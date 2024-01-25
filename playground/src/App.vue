<script setup lang="ts">
import {
  FlatSortable,
  FlatSortableContent,
  FlatSortableItem,
} from '../../packages/vue-flat-sortable/src'

</script>

<template>
  <FlatSortable>
    <FlatSortableContent direction="column" :gap="10" class="content112">
      <FlatSortableItem class="item" v-for="(item, index) in 4" :key="index">
        {{ item }}
      </FlatSortableItem>
    </FlatSortableContent>
  </FlatSortable>
</template>

<style scoped>
.item {
  width: 200px;
  height: 100px;
  border: 1px solid rgb(150 148 223);
  border-radius: 10px;
}
</style>
