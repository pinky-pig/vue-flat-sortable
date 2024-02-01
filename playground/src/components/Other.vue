<script setup lang="ts">
import { FlatSortable, FlatSortableContent, FlatSortableItem, } from '../../../packages/vue-flat-sortable/src'

import Sticker from './Sticker.vue'
</script>

<template>
  <div class="w-full h-full p-[10px] rounded-md border border-dashed border-black bg-[#eeeeee]">
    <FlatSortable>
      <FlatSortableContent direction="row" :gap="10" class="flex flex-row flex-wrap">
        <FlatSortableItem class="w-[140px] h-[100px] rounded-md">
          <Sticker />
        </FlatSortableItem>
  
        <FlatSortableItem class="w-[100px] h-[50px] bg-[#1e2982] font-bold text-white rounded-md grid place-items-center" v-for="(item, index) in 20" :key="index">
          {{ item }}
        </FlatSortableItem>
  
        <FlatSortableItem class="w-[140px] h-[100px] rounded-md">
          <Sticker />
        </FlatSortableItem>
  
      </FlatSortableContent>
    </FlatSortable>
  </div>
</template>

