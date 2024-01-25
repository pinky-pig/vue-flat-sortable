<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { FlatSortableContentEmits, FlatSortableContentProps } from './types';

const props = defineProps<FlatSortableContentProps & { class?: string }>()
const emits = defineEmits<FlatSortableContentEmits>()

const containerRef = ref<HTMLElement | null>(null)


const currentNode = ref()
function handleDragstart(e: DragEvent) {
  setTimeout(() => {
    e.target.classList.add('sortable-chosen')
  });

  e.dataTransfer!.effectAllowed = 'move'
  currentNode.value = e.target
}
function handleDragOver(e: DragEvent) {
  e.preventDefault()
  
}
function handleDragEnter(e: DragEvent) {
  e.preventDefault()
  if (currentNode.value === e.target || e.target === containerRef.value) return
if (!containerRef.value) return

  const nodes = Array.from(containerRef.value.children)
  const currentIndex = nodes.indexOf(currentNode.value)
  const targetIndex = nodes.indexOf(e.target as HTMLElement)

  if (currentIndex < targetIndex) {
    e.target.parentElement?.insertBefore(currentNode.value, e.target.nextSibling)
  }
  else {
    e.target.parentElement?.insertBefore(currentNode.value, e.target)
  }
}

function handleDragEnd(e: DragEvent) {
  e.target.classList.remove('sortable-chosen')
}
</script>

<template>
  <div 
    ref="containerRef"
    :class="props.class" 
    class="translate-z-0"
    :style="{
      display: 'flex',
      flexDirection: props.direction || 'column',
      gap: (props.gap || 0) + 'px',
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
  transform: translateZ(0);
}
</style>
