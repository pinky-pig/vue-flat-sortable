<script setup lang="ts">

</script>

<template>
  <div class="sticker-container rounded-md w-full h-full bg-white p-[6px] text-[var(--cover-main-color)] ">
    <div class="box h-full w-full flex flex-col items-center justify-center rounded-md bg-[var(--cover-main-color)] text-center font-bold ">
      <!-- 椭圆 -->
      <div class="cursor-pointer grid w-full flex-1 flex-shrink-0 place-items-center px-[20px]">
        <div class="h-4/5 w-full rounded-[100%] bg-white text-[36px] leading-[60px] flex justify-center items-center">
          {{ `Sort` }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sticker-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(/noise-light.png);
  background-repeat: repeat;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  color: rgb(255, 250, 221);
}
</style>
