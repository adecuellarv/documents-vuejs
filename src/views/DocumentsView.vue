<template>
  <div class="documents">
    <DocumentsComponet />
  </div>
</template>
<script setup lang="ts">
import DocumentsComponet from '@/components/documents/DocumentsComponet.vue';
</script>
<style>
@media (min-width: 1024px) {
  .documents {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
