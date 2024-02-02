<script setup lang="ts">
import { nextTick, provide, ref } from 'vue';

/********************************************************/
/*                 dragstart 开始拖拽                    */
/*                 dragend 结束拖拽                      */
/********************************************************/

const props = defineProps<FlatSortableContentProps>();
const emits = defineEmits();

interface FlatSortableContentProps {
  class?: string;
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  gap?: number;
}

interface INodeType {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
  el: HTMLElement | Element | null
}

interface IDraggedNodeType{
  top: number;
  left: number;
  width: number;
  height: number;
  el: HTMLElement | Element | null
  shadowEl: HTMLElement | Element | null
  offsetXFromMouse: number,
  offsetYFromMouse: number,
}

// 容器 DOM
const containerRef = ref<HTMLElement | null>(null);

// 当前元素的节点
const draggedNode = ref<IDraggedNodeType>({
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  offsetXFromMouse: 0,
  offsetYFromMouse: 0,
  el: null,
  shadowEl:null
});

// 是否正在拖拽
const isDragging = ref<boolean>(false);
provide('isDragging', isDragging)

/********************************************************/
/*                 1. 占位 DOM                          */
/*                 2. 跟随鼠标 DOM                       */
/*                 2. 拖拽过渡，结束拖拽过渡               */
/********************************************************/

function handleDrag(e: DragEvent) {
}

function handleDragstart(e: DragEvent){

  //  如果拖拽的不是 FlatSortableItem 则不进行拖拽
  if (!isFlatSortableItem(e.target as HTMLElement)) {
    return
  }

  // 初始化 draggedNode 的状态
  draggedNode.value.el = e.target as HTMLElement;

  setTimeout(() => {
    // 添加 draggedNode 样式
    if (draggedNode.value && draggedNode.value.el) {
      draggedNode.value?.el.classList.add('sortable-chosen');
    }
  });

  e.dataTransfer!.effectAllowed = 'move';

  isDragging.value = true;
};

function handleDragEnter (e: DragEvent){
  e.preventDefault();

  // 如果拖拽的不是 FlatSortableItem 则不进行拖拽
  if (!isFlatSortableItem(e.target as HTMLElement)) {
    return
  }

  if (!draggedNode.value.el || draggedNode.value.el === e.target || e.target === containerRef.value || !isFlatSortableItem(e.target as HTMLElement)) return;
  hitTest( draggedNode.value.el as HTMLElement, e.target as HTMLElement, Array.from(containerRef.value!.children) as HTMLElement[] )
};

function handleDragOver(e: DragEvent){
  e.preventDefault();
};


function handleDragEnd(e: DragEvent) {

  if (draggedNode.value && draggedNode.value.el) {
    draggedNode.value?.el.classList.remove('sortable-chosen');
    draggedNode.value.el = null;
    isDragging.value = false;
  }
};


/********************************************************/
/*                       utils                          */
/********************************************************/

function isFlatSortableItem(el: HTMLElement) {
  return el.classList.contains('flat-sortable-item');
}

function recordSingle(el: HTMLElement | Element): INodeType {
  const { top, left, width, height, right, bottom } = el.getBoundingClientRect();
  return { top, left, width, height, el, right, bottom }
}

/**
 * 这里碰撞检测比较简单，但是动画比较繁琐
 * 首先碰撞就是 dragenter 已经拿到了，不需要再操作了
 * 其次是交换位置只需要 insertBefore 插入就行
 * 动画这块，直接使用 animates 
 * 但是因为设计到快速多次动画触发，所以造成动画异常
 * 在这次动画开始之前，先结束上次的动画，然后立即开始新的动画
 * @param originNode 拖拽的元素
 * @param targetNode 碰撞的元素
 * @param allNodes 所有的容器内的子元素
 */
async function hitTest(originNode: HTMLElement, targetNode: HTMLElement, allNodes: HTMLElement[]) {

  // 判断当前碰撞的元素是否在动画中，如果是，那么就跳过
  const targetIsAnimating = targetNode.getAttribute('data-animating')

  if (targetIsAnimating === 'true') return

  const currentIndex = allNodes.indexOf(originNode);
  const targetIndex = allNodes.indexOf(targetNode);

  // 这是相邻元素的碰撞，首先只需要添加这俩。但如果设计到相邻的两元素是换行的，并且高度不一致，后面的还是需要添加动画的
  if (Math.abs(currentIndex - targetIndex) === 1) {

    const originRectFirst = recordSingle(originNode);
    const targetRectFirst = recordSingle(targetNode);

    // 碰撞的两个后面的所有元素
    const filterNodes = allNodes.filter((node,index) => {
      return index >= Math.max(currentIndex, targetIndex) 
    });
    const firsts = filterNodes.map(node => {
      return recordSingle(node)
    })

    /************************************************************************** */
    if (currentIndex < targetIndex) {
      targetNode.parentElement?.insertBefore(originNode, targetNode.nextSibling);
    } else {
      targetNode.parentElement?.insertBefore(originNode, targetNode);
    }
    /************************************************************************** */


    const originRectLast = recordSingle(originNode);
    const targetRectLast = recordSingle(targetNode);

    const lasts = filterNodes.map(node => {
      return recordSingle(node)
    })

    const originDiff = {
      top: originRectLast.top - originRectFirst.top,
      left: originRectLast.left - originRectFirst.left,
    };
    const targetDiff = {
      top: targetRectLast.top - targetRectFirst.top,
      left: targetRectLast.left - targetRectFirst.left,
    };

    interruptAnimation(originNode)
    interruptAnimation(targetNode)

    animateElement(originNode, originDiff)
    animateElement(targetNode, targetDiff)

    for (let i = filterNodes.length - 1; i >= 0; i--) {
      const node = filterNodes[i];
      const first = firsts[i];
      const last = lasts[i];
      const diff = {
        top: last.top - first.top,
        left: last.left - first.left,
      };

      if (diff.top !== 0 && diff.left !== 0) {
        interruptAnimation(node)
        animateElement(node, diff)
      }
    }
  }
  else if (Math.abs(currentIndex - targetIndex) > 1) {

    allNodes.forEach(async (node) => {
      interruptAnimation(node)
    })

    allNodes.filter((node,index) => {
      return index >= Math.min(currentIndex, targetIndex) && index <= Math.max(currentIndex, targetIndex)
    }).forEach(node => {
      node.setAttribute('data-animating', 'true')
    })

    const filterNodes = allNodes.filter((node,index) => {
      // return index >= Math.min(currentIndex, targetIndex) && index <= Math.max(currentIndex, targetIndex)
      return index >= Math.min(currentIndex, targetIndex) 
    });

    const firsts = filterNodes.map(node => {
      return recordSingle(node)
    })
    
    /************************************************************************** */
    if (currentIndex < targetIndex) {
      targetNode.parentElement?.insertBefore(originNode, targetNode.nextSibling);
    } else {
      targetNode.parentElement?.insertBefore(originNode, targetNode);
    }
    /************************************************************************** */

    nextTick(async () => {
      const lasts = filterNodes.map(node => {
        return recordSingle(node)
      })

      if (currentIndex > targetIndex) {
        // 说明拖拽的元素大于碰撞的元素，那么是插入其前面，动画从后面开始播放
        for (let i = filterNodes.length - 1; i >= 0; i--) {
          const node = filterNodes[i];
          const first = firsts[i];
          const last = lasts[i];
          const diff = {
            top: last.top - first.top,
            left: last.left - first.left,
          };

          // if (diff.top !== 0 && diff.left !== 0) {
            node.setAttribute('data-animating', 'true')
            animateElement(node, diff)
          // }
        }
      }else{
        for (let i = 0; i < filterNodes.length; i++) {
          const node = filterNodes[i];
          const first = firsts[i];
          const last = lasts[i];
          const diff = {
            top: last.top - first.top,
            left: last.left - first.left,
          };
      
          // if (diff.top !== 0 && diff.left !== 0) {
            node.setAttribute('data-animating', 'true')
            animateElement(node, diff)
          // }
        }
      }
    });
  }
}

async function animateElement(
    element: HTMLElement, 
    diff: { top: number; left: number },
    options: {
      reverse?: boolean;
      duration?: number;
      easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end' |string;
      delay?: number;
    } = {
      reverse: true,
      duration: 300,
      easing: 'linear',
      delay: 0,
    }
  ) {
  return new Promise<void>(async (resolve) => {
    
    const animates = [
      `translate3d(${-diff.left}px, ${-diff.top}px,0px)`,
      'translate3d(0px, 0px, 0px)',
    ]

    const animation = element.animate(
      { transform: options.reverse
            ? animates
            : [...animates].reverse() , 
          },
      { duration: options.duration, easing: options.easing, delay:options.delay, fill: 'backwards' ,},
    )
    animation.onfinish = () => {
      // 标志位，结束动画
      element.removeAttribute('data-animating')
      resolve();
    }
  })
}

function interruptAnimation(element: HTMLElement) {
  return new Promise<void>((resolve) => {
    const animation = element.getAnimations()[0];
    if (animation) {
      // 动画中断后，立即恢复到最终状态
      element.removeAttribute('data-animating')
      element.style.transform = 'translate3d(0px, 0px, 0px)'
      // 中断动画
      animation.cancel();
    }
    resolve();
  });
}

</script>

<template>
  <div 
    ref="containerRef" 
    :class="props.class" 
    class="translate-x-0" 
    :style="{
      display: 'flex',
      flexDirection: props.direction || 'column',
      gap: (props.gap || 0) + 'px',
      transform: 'skew(0)',
    }" 
    @dragstart="handleDragstart" 
    @dragenter="handleDragEnter" 
    @dragover="handleDragOver"
    @dragend="handleDragEnd" 
    @drag="handleDrag"
  >
    <slot />
  </div>
</template>

<style >
.sortable-chosen {
  will-change: transform;
  pointer-events: none !important;
  opacity: 0.2;
}

</style>
