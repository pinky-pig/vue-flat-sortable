<script setup lang="ts">
import { FlatSortableItemEmits, FlatSortableItemProps } from './types';

const props = defineProps<FlatSortableItemProps & { class?: string, inset?: boolean }>()
const emits = defineEmits<FlatSortableItemEmits>()

</script>

<template>
  <div 
    class="flat-sortable-item"
    :class="props.class" 
    :draggable="true"
  >
    <slot />
  </div>
</template>
