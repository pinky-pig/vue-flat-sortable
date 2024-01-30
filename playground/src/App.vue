<script setup lang="ts">
import {
  FlatSortable,
  FlatSortableContent,
  FlatSortableItem,
} from '../../packages/vue-flat-sortable/src'


</script>

<template>
  <FlatSortable>
    <FlatSortableContent :gap="10" class="content112">
      <FlatSortableItem class="item" v-for="(item, index) in 4" :key="index">
        {{ item }}
      </FlatSortableItem>

      <!-- <FlatSortableItem class="item100">
        {{ 100 }}
      </FlatSortableItem> -->

    </FlatSortableContent>
  </FlatSortable>
</template>

<style scoped>
.item {
  width: 200px;
  height: 100px;
  border: 1px solid rgb(150 148 223);
  background: #9694df90;
  border-radius: 10px;
}
.item100 {
  width: 200px;
  height: 200px;
  background: #0ebd2e90;
  border-radius: 10px;
}
</style>
