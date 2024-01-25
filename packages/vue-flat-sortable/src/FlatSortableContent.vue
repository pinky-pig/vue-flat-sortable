<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { FlatSortableContentEmits, FlatSortableContentProps } from './types';

const props = defineProps<FlatSortableContentProps & { class?: string }>()
const emits = defineEmits<FlatSortableContentEmits>()

const contentRef = ref<HTMLElement | null>(null)



</script>

<template>
  <div 
    ref="contentRef"
    :class="props.class" 
    :style="{
      display: 'flex',
      flexDirection: props.direction || 'column',
      gap: (props.gap || 0) + 'px',
    }"
  >
    <slot />
  </div>
</template>
