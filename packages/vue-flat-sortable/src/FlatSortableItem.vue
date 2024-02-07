<script setup lang="ts">
import type { Ref } from 'vue'
import { inject } from 'vue'
import type { FlatSortableItemEmits, FlatSortableItemProps } from './types'

const props = defineProps<FlatSortableItemProps & { class?: string, inset?: boolean }>()
const emits = defineEmits<FlatSortableItemEmits>()

const isDragging = inject('isDragging') as Ref<boolean>
</script>

<template>
  <div
    class="flat-sortable-item"
    :class="props.class"
    :draggable="true"
    style="will-change: transform;"
  >
    <div
      style="width: 100%; height: 100%;"
      :style="{ 'pointer-events': isDragging ? 'none' : 'auto' }"
    >
      <slot />
    </div>
  </div>
</template>
