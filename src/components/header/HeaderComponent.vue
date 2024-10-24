<template>
  <v-app-bar :elevation="8" rounded>

    <v-app-bar-title><b>Requisitos de documentos</b> Empresa Test</v-app-bar-title>

    <template v-slot:append>
      <b>{{ userName }}</b>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-app-bar-nav-icon v-bind="props"></v-app-bar-nav-icon>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in items" :key="index" :value="index">
            <v-list-item-title @click.stop="logout">{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const userName = ref('');
const items = ref([{ id: 1, title: 'Cerrar sesión' }])
const router = useRouter();

onMounted(async () => {
  const storedUserInfo = localStorage.getItem('userinfo');
  if (storedUserInfo) {
    userName.value = JSON.parse(storedUserInfo).nombre;
  }
});


const logout = () => {
  removeCookie('token');
  router.push('/')
}

const removeCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=0; path=/`;
};
</script>
