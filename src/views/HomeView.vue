<template>
  <div class="home" :style="{ width: componentWidth + 'px' }">
    <div>
      <DataTableSolicitantes />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import DataTableSolicitantes from '@/components/table/solicitantes/DataTableSolicitantes.vue';

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
.home {
  position: relative;
  left: 260px;
  top: 70px;
}

@media (max-width: 1279px) {
  .home {
    position: relative;
    left: 10px;
    top: 70px;
  }
}
</style>
