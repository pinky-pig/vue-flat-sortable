<script setup lang="ts">
import type { FlatSortableEmits, FlatSortableProps } from './types'

const props = defineProps<FlatSortableProps & { class?: string }>()
const emits = defineEmits<FlatSortableEmits>()
</script>

<template>
  <div :class="props.class">
    <slot />
  </div>
</template>

<style scoped>

</style>
