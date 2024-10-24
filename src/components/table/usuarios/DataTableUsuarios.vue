<template>
  <v-data-table v-if="items?.length" :headers="headers" :items="filteredItems"
    :sort-by="[{ key: 'nombre', order: 'asc' }]">
    <template v-slot:top>
      <v-toolbar flat class="content-heade-table">
        <v-toolbar-title>{{ titleTable }}</v-toolbar-title>
        <v-text-field v-model="search" label="Buscar" append-icon="mdi-magnify" single-line hide-details class="search-table"></v-text-field>
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>
  </v-data-table>
</template>

<script setup lang="js">
import { ref, onMounted, computed } from 'vue';
import { usuariosStore } from '@/stores/usuariosSlide';
import axios from '../../../axios';

// Estados para diálogos
const titleTable = ref('Usuarios');
const search = ref('');

const solicitantesStore = usuariosStore();
const { setUsuarios } = solicitantesStore;

const items = ref([]);

const headers = [
  { text: 'Nombre', value: 'nombre' },
  { text: 'Usuario', value: 'userName' },
  { text: 'Actions', value: 'actions', sortable: false }
];

onMounted(async () => {
  getItems()
});

// Computed para filtrar los elementos según el texto de búsqueda
const filteredItems = computed(() => {
  if (!search.value) return items.value;
  return items.value.filter(item => {
    return item.nombre.toLowerCase().includes(search.value.toLowerCase());
  });
});



const getItems = async () => {
  const response = await axios.get('/usuarios');
  setUsuarios(response?.data);
  items.value = response.data;
}

</script>

<style scoped>
.btn-add-table {
  background: #8432f1;
  color: #fff !important;
}

.margin-icons {
  margin-right: 30px;
}
.search-table{
  background: #fff;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 10px 10px 19px -8px rgba(117, 117, 117, 1);
}
</style>
