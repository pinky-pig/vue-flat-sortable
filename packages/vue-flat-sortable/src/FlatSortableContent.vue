<script setup lang="ts">
import { ref } from 'vue';

interface FlatSortableContentProps {
  class?: string;
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  gap?: number;
}

const props = defineProps<FlatSortableContentProps>();
const emits = defineEmits();
const containerRef = ref<HTMLElement | null>(null);
const currentNode = ref<HTMLElement | null>(null);

const handleDragstart = (e: DragEvent) => {
  if (!isFlatSortableItem(e.target as HTMLElement)) {
    return
  }

  record(containerRef.value!.children)
  setTimeout(() => {
    currentNode.value = e.target as HTMLElement;
    currentNode.value?.classList.add('sortable-chosen');
  });
  e.dataTransfer!.effectAllowed = 'move';

};

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
};

const handleDragEnter = (e: DragEvent) => {
  e.preventDefault();
  if (!currentNode.value || currentNode.value === e.target || e.target === containerRef.value || !isFlatSortableItem(e.target as HTMLElement)) return;

  const nodes = Array.from(containerRef.value!.children);
  const currentIndex = nodes.indexOf(currentNode.value);
  const targetIndex = nodes.indexOf(e.target as HTMLElement);

  if (currentIndex < targetIndex) {
    // 插入其后
    (e.target as HTMLElement).parentElement?.insertBefore(currentNode.value, (e.target as HTMLElement).nextSibling);
  } else {
    // 插入其前
    (e.target as HTMLElement).parentElement?.insertBefore(currentNode.value, (e.target as HTMLElement));
  }

  last([e.target,currentNode.value])
};

const handleDragEnd = (e: DragEvent) => {
  currentNode.value?.classList.remove('sortable-chosen');
};

function isFlatSortableItem(el: HTMLElement) {
  return el.classList.contains('flat-sortable-item');
}



function record(eleAll: any) {
  for( let i = 0;i < eleAll.length; i++ ) {
    const { top,left } = eleAll[i].getBoundingClientRect()
    eleAll[i]._top_ = top
    eleAll[i]._left_ = left
  }
}
 
 
 
function last(eleAll: any) {
  for( let i = 0;i < eleAll.length; i++ ) {
    const dom = eleAll[i]
    const { top,left } = dom.getBoundingClientRect()
    if(dom._left_) {
      dom.style.transform = `translate3d(${ dom._left_ - left }px, ${ dom._top_ - top }px,0px)`
 
      let rafId = requestAnimationFrame(function() {
        dom.style.transition = 'transform 300ms ease-out'
        dom.style.transform = 'none'
      })
      dom.addEventListener('transitionend', () => {
        dom.style.transition = 'none'
        cancelAnimationFrame(rafId)
      })
    }
  }
}
</script>

<template>
  <div 
    ref="containerRef"
    :class="props.class" 
    class="translate-x-0"
    :style="{
      display: 'flex',
      flexDirection: props.direction || 'column',
      gap: (props.gap || 0) + 'px',
      transform: 'skew(0)',
    }"
    @dragstart="handleDragstart"
    @dragenter="handleDragEnter"
    @dragover="handleDragOver"
    @dragend="handleDragEnd"
  >
    <slot />
  </div>
</template>

<style >
.sortable-chosen{
  cursor: pointer;
  background: transparent;
      color: transparent;
      border: 1px  dashed #ccc;
}

</style>
