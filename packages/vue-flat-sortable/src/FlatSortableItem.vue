<script setup lang="ts">
import { ref } from 'vue';
import { FlatSortableItemEmits, FlatSortableItemProps } from './types';


const props = defineProps<FlatSortableItemProps & { class?: string, inset?: boolean }>()
const emits = defineEmits<FlatSortableItemEmits>()

const itemRef = ref<HTMLElement | null>(null)

function handleDragstart(e: DragEvent) {
  
}

function handleMouseDown(e: PointerEvent) {
  console.log(11);
  // e.target.classList.add('sortable-chosen')
}
function handleMouseUp(e: PointerEvent) {
  console.log(22);
}
</script>

<template>
  <div 
    :class="props.class" 
    ref="itemRef" 
    :draggable="true"
    @dragstart="handleDragstart"
    @pointerdown="handleMouseDown"
    @onDragleave="handleMouseUp"



  >
    <slot />
  </div>
</template>
