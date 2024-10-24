<template>

  <v-navigation-drawer class="div-slide-left">
    <v-list-item title="Ligas" subtitle="" class="div-header-links"></v-list-item>
    <v-divider></v-divider>
    <v-list-item :active="isActive('/home')" @click="goToPage('/home')" title="Solicitantes">
    </v-list-item>
    <v-list-item :active="isActive('/requisitos')" @click="goToPage('/requisitos')" title="Requisitos">
    </v-list-item>
    <v-list-item :active="isActive('/usuarios')" @click="goToPage('/usuarios')" title="Usuarios">
    </v-list-item>
  </v-navigation-drawer>

</template>
<script setup lang="ts">
//import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();



const goToPage = (page: string) => {
  router.push(page)
}

const isActive = (page) => {
  return route.path === page;
}

</script>

<style scoped>
.div-slide-left {
  width: 250px;
  background: #fff;
}

.div-header-links {
  background: #00b3ff;
}
</style>
