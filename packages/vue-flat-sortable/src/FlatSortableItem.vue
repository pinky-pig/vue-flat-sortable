<script setup lang="ts">
import { ref } from 'vue';
import { FlatSortableItemEmits, FlatSortableItemProps } from './types';


const props = defineProps<FlatSortableItemProps & { class?: string, inset?: boolean }>()
const emits = defineEmits<FlatSortableItemEmits>()

</script>

<template>
  <div 
    :class="props.class" 
    ref="itemRef" 
    :draggable="true"
  >
    <slot />
  </div>
</template>
