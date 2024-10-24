<template>
  <v-app-bar :elevation="8" rounded>

    <v-app-bar-title><b>Requisitos de documentos</b> Empresa Test</v-app-bar-title>

    <template v-slot:append>
      <b>{{ userName }} Ade Cuellar</b>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>
  </v-app-bar>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const userName = ref('');

onMounted(async () => {
  const storedUserInfo = localStorage.getItem('userinfo');
  if (storedUserInfo) {
    userName.value = JSON.parse(storedUserInfo).nombre;
  }
});

</script>
