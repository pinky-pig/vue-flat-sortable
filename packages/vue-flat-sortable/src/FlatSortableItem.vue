<script setup lang="ts">
import type { Ref } from 'vue'
import { inject, watch } from 'vue'
import type { FlatSortableItemEmits, FlatSortableItemProps } from './types'

const props = defineProps<FlatSortableItemProps & { class?: string, inset?: boolean }>()
const emits = defineEmits<FlatSortableItemEmits>()
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
