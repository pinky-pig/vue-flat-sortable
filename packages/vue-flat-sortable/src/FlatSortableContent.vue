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

  const nodes = Array.from(containerRef.value!.children);
  const currentIndex = nodes.indexOf(currentNode.value);
  const targetIndex = nodes.indexOf(e.target as HTMLElement);

  if (currentIndex < targetIndex) {
    // 插入其后
    (e.target as HTMLElement).parentElement?.insertBefore(currentNode.value, (e.target as HTMLElement).nextSibling);
  } else {
    // 插入其前
    (e.target as HTMLElement).parentElement?.insertBefore(currentNode.value, (e.target as HTMLElement));
  }
};

const handleDragEnd = (e: DragEvent) => {
  currentNode.value?.classList.remove('sortable-chosen');
};

function isFlatSortableItem(el: HTMLElement) {
  return el.classList.contains('flat-sortable-item');
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
  >
    <slot />
  </div>
</template>

<style >
.sortable-chosen{
  cursor: pointer;
}

</style>
