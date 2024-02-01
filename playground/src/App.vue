<script setup lang="ts">
import Row from './components/Row.vue'
import Column from './components/Column.vue'
import Other from './components/Other.vue'
</script>

<template>
  <div class="w-screen flex flex-col justify-start items-center gap-6">

    <div class="w-[60vw] h-[60vh] ">
      <span class="font-bold"> Other:</span>
      <Other></Other>
    </div>

    <!-- <div class="w-[60vw]">
      <span class="font-bold"> Row:</span>
      <Row ></Row>
    </div> -->

    <!-- <div class="w-[60vw]">
      <span class="font-bold"> Column:</span>
      <Column></Column>
    </div> -->

    
  </div>
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
  border-radius: 10px;
}
</style>
