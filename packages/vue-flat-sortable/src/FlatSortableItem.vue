<script setup lang="ts">
import type { Ref } from 'vue'
import { inject, watch } from 'vue'
import type { FlatSortableItemEmits, FlatSortableItemProps } from './types'

const props = defineProps<FlatSortableItemProps & { class?: string, inset?: boolean }>()
const emits = defineEmits<FlatSortableItemEmits>()

const isDragging = inject('isDragging') as Ref<boolean>

watch(isDragging, (v) => {
  const element = document.querySelector('.flat-sortable-item') as HTMLElement
  Array.from(element.children).forEach((child) => {
    (child as HTMLElement).style.pointerEvents = v ? 'none' : 'auto'
  })
})
</script>

<template>
  <div
    class="flat-sortable-item"
    :class="props.class"
    :draggable="true"
    style="will-change: transform;"
  >
    <slot />
  </div>
</template>
