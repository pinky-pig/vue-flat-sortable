<script setup lang="ts">
import { ref } from 'vue';

interface FlatSortableContentProps {
  class?: string;
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  gap?: number;
}

const props = defineProps<FlatSortableContentProps>();
const emits = defineEmits();
const containerRef = ref<HTMLElement | null>(null);
const currentNode = ref<HTMLElement | null>(null);

const handleDragstart = (e: DragEvent) => {
  if (!isFlatSortableItem(e.target as HTMLElement)) {
    return
  }

  setTimeout(() => {
    currentNode.value = e.target as HTMLElement;
    currentNode.value?.classList.add('sortable-chosen');
  });
  e.dataTransfer!.effectAllowed = 'move';
};

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
};

const handleDragEnter = (e: DragEvent) => {

  e.preventDefault();

  if (!currentNode.value || currentNode.value === e.target || e.target === containerRef.value || !isFlatSortableItem(e.target as HTMLElement)) return;

  hitAllEle(
    currentNode.value,
    e.target as HTMLElement,
    Array.from(containerRef.value!.children) as HTMLElement[]
  )
};

const handleDragEnd = (e: DragEvent) => {
  currentNode.value?.classList.remove('sortable-chosen');
};

function isFlatSortableItem(el: HTMLElement) {
  return el.classList.contains('flat-sortable-item');
}


/**
 * 1. 记录当前元素的位置信息
 * 2. 判断碰撞的元素
 * 3. 更新碰撞的元素的位置信息
 */

interface Rectangle {
  top: number;
  left: number;
  width: number;
  height: number;
  el: HTMLElement
}

function recordSingle(el: HTMLElement): Rectangle {
  const { top, left, width, height } = el.getBoundingClientRect();
  return { top, left, width, height, el }
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

</script>

<template>
  <div ref="containerRef" :class="props.class" class="translate-x-0" :style="{
    display: 'flex',
    flexDirection: props.direction || 'column',
    gap: (props.gap || 0) + 'px',
    transform: 'skew(0)',
  }" @dragstart="handleDragstart" @dragenter="handleDragEnter" @dragover="handleDragOver" @dragend="handleDragEnd">

    <slot />
  </div>
</template>

<style >
.sortable-chosen {
  cursor: pointer;
  background: transparent !important;
  color: transparent;
  border: 1px dashed #ccc;
}
</style>
