<template>
  <div class="documents" :style="{ width: componentWidth + 'px' }">
    <DocumentsComponet />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import DocumentsComponet from '@/components/documents/DocumentsComponet.vue';

const componentWidth = ref(0);

const updateWidth = () => {
  componentWidth.value = window.innerWidth - 280;
};

onMounted(() => {
  updateWidth();
  window.addEventListener('resize', updateWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWidth);
});
</script>
<style>
.documents {
  position: relative;
  left: 260px;
  top: 70px;
}

@media (max-width: 1279px) {
  .documents {
    position: relative;
    left: 10px;
    top: 70px;
  }
}
</style>
