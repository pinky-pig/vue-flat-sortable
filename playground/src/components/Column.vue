<script setup lang="ts">
import { ref } from 'vue'
import { FlatSortable, FlatSortableContent, FlatSortableItem } from '../../../packages/vue-flat-sortable/src'

import Sticker from './Sticker.vue'

const flatContents = ref([
  'item-0',
  'item-1',
  'item-2',
  'item-3',
])
</script>

<template>
  <div class="w-fit h-fit p-[10px] rounded-md border border-dashed border-black bg-[#eeeeee]">
    <FlatSortable>
      <FlatSortableContent v-model="flatContents" direction="column" :gap="10" class="content112">
        <FlatSortableItem class="w-[140px] h-[100px] rounded-md">
          <Sticker />
        </FlatSortableItem>

        <FlatSortableItem v-for="(item, index) in 2" :key="index" class="w-[100px] h-[50px] bg-[#1e2982] font-bold text-white rounded-md grid place-items-center">
          {{ item }}
        </FlatSortableItem>

        <FlatSortableItem class="w-[140px] h-[100px] rounded-md">
          <Sticker />
        </FlatSortableItem>
      </FlatSortableContent>
    </FlatSortable>
  </div>
</template>
