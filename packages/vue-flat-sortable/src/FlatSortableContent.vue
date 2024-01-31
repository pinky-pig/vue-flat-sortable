<script setup lang="ts">
import { ref } from 'vue';

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

interface IDraggedNodeType extends INodeType {
  offsetXFromMouse: number,
  offsetYFromMouse: number,
}


const props = defineProps<FlatSortableContentProps>();
const emits = defineEmits();


// 容器 DOM
const containerRef = ref<HTMLElement | null>(null);

// 所有的子元素节点
const allItemNodes = ref<INodeType[]>([])

// 当前元素的节点
const draggedNode = ref<IDraggedNodeType>({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  width: 0,
  height: 0,
  offsetXFromMouse: 0,
  offsetYFromMouse: 0,
  el: null,
});

const dom = ref()

const handleDrag = (e: DragEvent) => {
  if (dom.value) {
    dom.value.style.left = e.clientX - draggedNode.value.offsetXFromMouse + draggedNode.value.width / 2 + 'px'
    dom.value.style.top = e.clientY - draggedNode.value.offsetYFromMouse + draggedNode.value.height / 2 + 'px'

    // 1. 找到所有碰撞的的元素
    // 2. 改变碰撞的位置
    const hittedNodes = getAllHittedNodes(e)

    hittedNodes.forEach((node: { el: HTMLElement; }) => {

      hitAllEle(
        draggedNode.value.el as HTMLElement,
        node.el as HTMLElement,
        Array.from(containerRef.value!.children) as HTMLElement[]
      )
    })

  }
}

const handleDragstart = (e: DragEvent) => {

  //  如果拖拽的不是 FlatSortableItem 则不进行拖拽
  if (!isFlatSortableItem(e.target as HTMLElement)) {
    return
  }

  // 初始化 draggedNode 的状态
  const currentRect = recordSingle(e.target as HTMLElement)
  draggedNode.value.el = e.target as HTMLElement;
  draggedNode.value.offsetXFromMouse = e.clientX - currentRect.left;
  draggedNode.value.offsetYFromMouse = e.clientY - currentRect.top;
  draggedNode.value.top = currentRect.top;
  draggedNode.value.left = currentRect.left;
  draggedNode.value.bottom = currentRect.bottom;
  draggedNode.value.right = currentRect.right;
  draggedNode.value.width = currentRect.width;
  draggedNode.value.height = currentRect.height;

  // 初始化所有 Node 的状态
  allItemNodes.value = Array.from(containerRef.value!.children).map(item => {
    return {
      ...recordSingle(item),
      el: item
    }
  })

  setTimeout(() => {

    // 添加 draggedNode 样式
    if (draggedNode.value && draggedNode.value.el) {
      draggedNode.value?.el.classList.add('sortable-chosen');
    }

    if (!dom.value) {
      dom.value = document.createElement('div')
      dom.value.style.width = '3px'
      dom.value.style.height = '3px'
      dom.value.style.background = 'red'
      dom.value.style.position = 'fixed'
      dom.value.style.left = draggedNode.value.left + draggedNode.value.width / 2 + 'px'
      dom.value.style.top = draggedNode.value.top + draggedNode.value.height / 2 + 'px'
      document.body.appendChild(dom.value)
    }

  });
  e.dataTransfer!.effectAllowed = 'move';

};

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
};

const handleDragEnter = (e: DragEvent) => {

  e.preventDefault();

  if (!draggedNode.value || draggedNode.value.el === e.target || e.target === containerRef.value || !isFlatSortableItem(e.target as HTMLElement)) return;

  // hitAllEle(
  //   draggedNode.value,
  //   e.target as HTMLElement,
  //   Array.from(containerRef.value!.children) as HTMLElement[]
  // )
};


const handleDragEnd = (e: DragEvent) => {
  if (draggedNode.value && draggedNode.value.el) {
    draggedNode.value?.el.classList.remove('sortable-chosen');
  }


  document.body.removeChild(dom.value)
  dom.value = null;

};

function isFlatSortableItem(el: HTMLElement) {
  return el.classList.contains('flat-sortable-item');
}

function getAllHittedNodes(e: DragEvent) {
  if (!draggedNode.value.el) {
    return
  }
  const hittedNodes: any = []
  // 1.找到当前元素第一层碰撞的元素
  allItemNodes.value.forEach((n: INodeType, index: number) => {
    if (n.el == draggedNode.value.el) {
      return
    }
    const x = e.clientX - draggedNode.value.offsetXFromMouse + draggedNode.value.width / 2
    const y = e.clientY - draggedNode.value.offsetYFromMouse + draggedNode.value.height / 2
    if (checkHit({ x, y }, n)) {
      // 将当前碰撞的要素添加到数组中
      hittedNodes.push(n)
      console.log(111);
    }
  })

  return hittedNodes
}


/**
 * 1. 记录当前元素的位置信息
 * 2. 判断碰撞的元素
 * 3. 更新碰撞的元素的位置信息
 */


function recordSingle(el: HTMLElement | Element): INodeType {
  const { top, left, width, height, right, bottom } = el.getBoundingClientRect();
  return { top, left, width, height, el, right, bottom }
}

async function hitAllEle(originNode: HTMLElement, targetNode: HTMLElement, allNodes: HTMLElement[]) {


  // First
  const originRectFirst = recordSingle(originNode);
  const targetRectFirst = recordSingle(targetNode);
  const currentIndex = allNodes.indexOf(originNode);
  const targetIndex = allNodes.indexOf(targetNode);

  if (currentIndex < targetIndex) {
    // 插入其后
    targetNode.parentElement?.insertBefore(originNode, targetNode.nextSibling);
  } else {
    // 插入其前
    targetNode.parentElement?.insertBefore(originNode, targetNode);
  }

  // Last
  const originRectLast = recordSingle(originNode);
  const targetRectLast = recordSingle(targetNode);

  // Play
  const originDiff = {
    top: originRectLast.top - originRectFirst.top,
    left: originRectLast.left - originRectFirst.left,
  };
  const targetDiff = {
    top: targetRectLast.top - targetRectFirst.top,
    left: targetRectLast.left - targetRectFirst.left,
  };
  const animations = [
    animateElement(targetNode, targetDiff),
    animateElement(originNode, originDiff),
  ];

  // 等待所有动画完成
  await Promise.all(animations);

}

async function animateElement(element: HTMLElement, diff: { top: number; left: number }) {
  return new Promise<void>((resolve) => {
    const animates = [
      `translate3d(${-diff.left}px, ${-diff.top}px,0px)`,
      'translate3d(0px, 0px, 0px)',
    ];
    const animation = element.animate(
      { transform: animates },
      { duration: 300, easing: 'linear', fill: 'backwards' },
    );
    animation.onfinish = () => {
      resolve();
    };
  });
}

function checkHit(a: { x: number, y: number }, b: INodeType) {
  return (
    a.x >= b.left &&
    a.x <= (b.left + b.width) &&
    a.y >= b.top &&
    a.y <= (b.top + b.height)
  )
}

</script>

<template>
  <div ref="containerRef" :class="props.class" class="translate-x-0" :style="{
    display: 'flex',
    flexDirection: props.direction || 'column',
    gap: (props.gap || 0) + 'px',
    transform: 'skew(0)',
  }" @dragstart="handleDragstart" @drag="handleDrag" @dragenter="handleDragEnter" @dragover="handleDragOver"
    @dragend="handleDragEnd">

    <slot />
  </div>
</template>

<style >
.sortable-chosen {
  cursor: pointer;
  background: transparent !important;
  color: transparent;
  border: 1px dashed #ccc;
  pointer-events: none !important;
}
</style>
