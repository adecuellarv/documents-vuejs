<template>
  <v-app class="app-vapp">
    <HeaderComponent v-if="isLoggedIn" />
    <SlideLeft v-if="isLoggedIn" />
    <RouterView />
  </v-app>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import HeaderComponent from './components/header/HeaderComponent.vue';
import SlideLeft from './components/slide/SlideLeft.vue';
const isLoggedIn = ref(false);
const route = useRoute();
const currentUrl = ref(route.fullPath);

onMounted(() => {
  // Observar cambios en la ruta
  watch(route, handleUrlChange);
});

const handleUrlChange = () => {
  currentUrl.value = route.fullPath;
  if (getCookie('token')) isLoggedIn.value = true;
  else isLoggedIn.value = false;
};

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
  return undefined;
}
</script>
<style scoped></style>
