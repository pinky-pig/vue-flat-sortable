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

async function hitTest(originNode: HTMLElement, targetNode: HTMLElement, allNodes: HTMLElement[]) {

  const currentIndex = allNodes.indexOf(originNode);
  const targetIndex = allNodes.indexOf(targetNode);

  if (Math.abs(currentIndex - targetIndex) === 1) {

    const originRectFirst = recordSingle(originNode);
    const targetRectFirst = recordSingle(targetNode);
    const currentIndex = allNodes.indexOf(originNode);
    const targetIndex = allNodes.indexOf(targetNode);

    if (currentIndex < targetIndex) {
      targetNode.parentElement?.insertBefore(originNode, targetNode.nextSibling);
    } else {
      targetNode.parentElement?.insertBefore(originNode, targetNode);
    }

    const originRectLast = recordSingle(originNode);
    const targetRectLast = recordSingle(targetNode);

    const originDiff = {
      top: originRectLast.top - originRectFirst.top,
      left: originRectLast.left - originRectFirst.left,
    };
    const targetDiff = {
      top: targetRectLast.top - targetRectFirst.top,
      left: targetRectLast.left - targetRectFirst.left,
    };
    animateElement(originNode, originDiff)
    animateElement(targetNode, targetDiff)
  }
  else if (Math.abs(currentIndex - targetIndex) > 1) {

    const filterNodes = allNodes.filter((node,index) => {
      return index >= Math.min(currentIndex, targetIndex) && index <= Math.max(currentIndex, targetIndex)
    });

    const firsts = filterNodes.map(node => {
      return recordSingle(node)
    })
  
    if (currentIndex < targetIndex) {
      targetNode.parentElement?.insertBefore(originNode, targetNode.nextSibling);
    } else {
      targetNode.parentElement?.insertBefore(originNode, targetNode);
    }
    nextTick( () => {
      const lasts = filterNodes.map(node => {
        return recordSingle(node)
      })
    
      for (let i = 0; i < filterNodes.length; i++) {
        const node = filterNodes[i];
        const first = firsts[i];
        const last = lasts[i];
        const diff = {
          top: last.top - first.top,
          left: last.left - first.left,
        };
    
        animateElement(node, diff)
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
  return new Promise<void>((resolve) => {
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
      resolve();
    }
  })
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
