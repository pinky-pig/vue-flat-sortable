<script setup lang="ts">
import { ref } from 'vue'
import { FlatSortable, FlatSortableContent, FlatSortableItem } from '../../../packages/vue-flat-sortable/src'

import Sticker from './Sticker.vue'

const flatContents = ref(Array(22).fill(0).map((_, i) => `item-${i}`))
</script>

<template>
  <div class="w-full h-full p-[10px] rounded-md border border-dashed border-black bg-[#eeeeee]">
    <FlatSortable>
      <FlatSortableContent v-model="flatContents" direction="row" :gap="10" class="flex flex-row flex-wrap">
        <FlatSortableItem class="w-[140px] h-[100px] rounded-md">
          <Sticker />
        </FlatSortableItem>

        <FlatSortableItem v-for="(item, index) in 20" :key="index" class="w-[100px] h-[50px] bg-[#1e2982] font-bold text-white rounded-md grid place-items-center">
          {{ item }}
        </FlatSortableItem>

        <FlatSortableItem class="w-[140px] h-[100px] rounded-md">
          <Sticker />
        </FlatSortableItem>
      </FlatSortableContent>
    </FlatSortable>
  </div>
</template>
