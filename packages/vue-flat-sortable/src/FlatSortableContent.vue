<script setup lang="ts">
import { ref } from 'vue';

interface FlatSortableContentProps {
  class?: string;
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  gap?: number;
}

interface Rectangle {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
  el: HTMLElement | Element
}


const props = defineProps<FlatSortableContentProps>();
const emits = defineEmits();
const containerRef = ref<HTMLElement | null>(null);
const allItemNodes = ref<Rectangle[]>([])
const currentNode = ref<HTMLElement | null>(null);


const currentNodePosition = ref<Omit<Rectangle,'el'> & {centerX: number,centerY: number,offsetXFromMouse: number,offsetYFromMouse: number, }>({
  top: 0,
  left:0,
  bottom:0,
  right:0,
  centerX:0,
  centerY:0,
  width:0,
  height:0,
  offsetXFromMouse:0,
  offsetYFromMouse:0,
})
const dom = ref()

const handleDrag = (e: DragEvent) => {
  if (dom.value) {
    dom.value.style.left = e.clientX - currentNodePosition.value.offsetXFromMouse  + 'px'
    dom.value.style.top = e.clientY - currentNodePosition.value.offsetYFromMouse + 'px'
  }
}

const handleDragstart = (e: DragEvent) => {

  
  setTimeout(() => {
    currentNode.value = e.target as HTMLElement;
    currentNode.value?.classList.add('sortable-chosen');


    allItemNodes.value = Array.from(containerRef.value!.children).map(item => {
      return recordSingle(item)
    })



    if (!dom.value) {
      const currentRect = recordSingle(currentNode.value)

      currentNodePosition.value.offsetXFromMouse = e.clientX - currentRect.left
      currentNodePosition.value.offsetYFromMouse = e.clientY - currentRect.top


      currentNodePosition.value.centerX = currentRect.left + currentRect.width / 2
      currentNodePosition.value.centerY = currentRect.top + currentRect.height / 2

      dom.value = document.createElement('div')
      dom.value.style.width = '3px'
      dom.value.style.height = '3px'
      dom.value.style.background = 'red'
      dom.value.style.position = 'fixed'
      dom.value.style.left = currentRect.left + currentRect.width / 2 + 'px'
      dom.value.style.top = currentRect.top + currentRect.height / 2 + 'px'
      document.body.appendChild(dom.value)
    }


  if (!isFlatSortableItem(e.target as HTMLElement)) {
    return
  }


  });
  e.dataTransfer!.effectAllowed = 'move';


  
};

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
};

const handleDragEnter = (e: DragEvent) => {

  e.preventDefault();

  if (!currentNode.value || currentNode.value === e.target || e.target === containerRef.value || !isFlatSortableItem(e.target as HTMLElement)) return;

  // hitAllEle(
  //   currentNode.value,
  //   e.target as HTMLElement,
  //   Array.from(containerRef.value!.children) as HTMLElement[]
  // )
};


const handleDragEnd = (e: DragEvent) => {
  currentNode.value?.classList.remove('sortable-chosen');


  document.body.removeChild(dom.value)
  dom.value = null;

};

function isFlatSortableItem(el: HTMLElement) {
  return el.classList.contains('flat-sortable-item');
}

function getAllHittedNodes() {
  const hittedNodes: any = []
  const originRectFirst = recordSingle(currentNode.value!);

  // 1.找到当前元素第一层碰撞的元素
  allItemNodes.value.forEach((n: Rectangle, index: number) => {

    if (n.el == currentNode.value) {
      return
    }

    const centerX = originRectFirst.left + originRectFirst.width / 2;
    const centerY = originRectFirst.top + originRectFirst.height / 2;


    if (checkHit({x: centerX,y: centerY},n)) {
      // 将当前碰撞的要素添加到数组中
      hittedNodes.push(n)
      console.log(111);
    }
  })

  return hittedNodes
}


/**
 * 1. 记录当前元素的位置信息
 * 2. 判断碰撞的元素
 * 3. 更新碰撞的元素的位置信息
 */


function recordSingle(el: HTMLElement | Element): Rectangle {
  const { top, left, width, height, right,bottom } = el.getBoundingClientRect();
  return { top, left, width, height, el,right,bottom }
}

async function hitAllEle(originNode: HTMLElement, targetNode: HTMLElement, allNodes: HTMLElement[]) {
  

  // First
  const originRectFirst = recordSingle(originNode);
  const targetRectFirst = recordSingle(targetNode);
  const currentIndex = allNodes.indexOf(originNode);
  const targetIndex = allNodes.indexOf(targetNode);

  if (currentIndex < targetIndex) {
    // 插入其后
    targetNode.parentElement?.insertBefore(originNode, targetNode.nextSibling);
  } else {
    // 插入其前
    targetNode.parentElement?.insertBefore(originNode, targetNode);
  }

  // Last
  const originRectLast = recordSingle(originNode);
  const targetRectLast = recordSingle(targetNode);

  // Play
  const originDiff = {
    top: originRectLast.top - originRectFirst.top,
    left: originRectLast.left - originRectFirst.left,
  };
  const targetDiff = {
    top: targetRectLast.top - targetRectFirst.top,
    left: targetRectLast.left - targetRectFirst.left,
  };
  const animations = [
    animateElement(targetNode, targetDiff),
    animateElement(originNode, originDiff),
  ];

  // 等待所有动画完成
  await Promise.all(animations);

}

async function animateElement(element: HTMLElement, diff: { top: number; left: number }) {
  return new Promise<void>((resolve) => {
    const animates = [
      `translate3d(${-diff.left}px, ${-diff.top}px,0px)`,
      'translate3d(0px, 0px, 0px)',
    ];
    const animation = element.animate(
      { transform: animates },
      { duration: 300, easing: 'linear', fill: 'backwards' },
    );
    animation.onfinish = () => {
      resolve();
    };
  });
}

function checkHit(a: { x: number,y:number}, b: Rectangle) {
  return (
    a.x >= b.left &&
    a.x <= (b.left + b.width) &&
    a.y >= b.top &&
    a.y <= (b.top + b.height)
  )
}

</script>

<template>
  <div ref="containerRef" :class="props.class" class="translate-x-0" :style="{
    display: 'flex',
    flexDirection: props.direction || 'column',
    gap: (props.gap || 0) + 'px',
    transform: 'skew(0)',
  }" @dragstart="handleDragstart" @drag="handleDrag" @dragenter="handleDragEnter" @dragover="handleDragOver" @dragend="handleDragEnd">

    <slot />
  </div>
</template>

<style >
.sortable-chosen {
  cursor: pointer;
  background: transparent !important;
  color: transparent;
  border: 1px dashed #ccc;
}
</style>
