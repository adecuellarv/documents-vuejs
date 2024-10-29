<template>
  <v-data-table v-if="items?.length" :headers="headers" :items="filteredItems"
    :sort-by="[{ key: 'nombre', order: 'asc' }]">
    <template v-slot:top>
      <v-toolbar flat class="content-heade-table">
        <v-toolbar-title>{{ titleTable }}</v-toolbar-title>
        <v-text-field v-model="search" label="Buscar" append-icon="mdi-magnify" single-line hide-details class="search-table"></v-text-field>
        <v-spacer></v-spacer>
        <v-btn elevated color="indigo-darken-3" @click="openCreateModal()" class="btn-add-table">
          Agregar nuevo
        </v-btn>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon class="me-2 margin-icons" size="small" @click="openEditModal(item)">
        mdi-pencil
      </v-icon>
      <v-icon class="margin-icons" size="small" @click="openDeleteModal(item)">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>

  <!-- Modal de edición -->
  <v-dialog v-model="createDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Crear Requisito</span>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="nameNewItem" label="Nombre"
          :rules="[v => !!v || 'El campo no puede estar vacío']"></v-text-field>
          <v-select v-model="extensionNewItem" :items="listExtensions" item-text="title" item-value="title" label="Select"
          variant="outlined" :rules="[v => !!v || 'El campo no puede estar vacío']"></v-select>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="saveCreate">Guardar</v-btn>
        <v-btn color="red darken-1" text @click="closeCreateModal">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal de edición -->
  <v-dialog v-model="editDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Editar Solicitante</span>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="editedItem.nombre" label="Nombre"
          :rules="[v => !!v || 'El campo no puede estar vacío']"></v-text-field>
          <v-select v-model="editedItem.extension" :items="listExtensions" item-text="title" item-value="title" label="Select"
          variant="outlined" :rules="[v => !!v || 'El campo no puede estar vacío']"></v-select>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="saveEdit">Guardar</v-btn>
        <v-btn color="red darken-1" text @click="closeEditModal">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal de eliminación -->
  <v-dialog v-model="deleteDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Eliminar Solicitante</span>
      </v-card-title>
      <v-card-text>
        ¿Estás seguro de que deseas eliminar "{{ deleteItem?.nombre }}"?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="confirmDelete">Eliminar</v-btn>
        <v-btn color="grey" text @click="closeDeleteModal">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="js">
import { ref, onMounted, computed } from 'vue';
import { useRequisitosStore } from '@/stores/requisitosSlide';
import axios from '../../../axios';

// Estados para diálogos
const editDialog = ref(false);
const editedItem = ref({ name: '' });
const deleteDialog = ref(false);
const deleteItem = ref({ name: '' });
const createDialog = ref(false);
const nameNewItem = ref('');
const extensionNewItem = ref('');
const titleTable = ref('Requisitos');
const listExtensions = ref([
  {
    title: 'pdf'
  },
  {
    title: 'img'
  },
  {
    title: 'xml'
  }
])
const search = ref('');

const requistosStore = useRequisitosStore();
const { setRequisitos } = requistosStore;

const items = computed(() => requistosStore.requisitos);

const headers = [
  { text: 'Nombre', value: 'nombre' },
  { text: 'Extensión', value: 'extension' },
  { text: 'Actions', value: 'actions', sortable: false }
];

onMounted(async () => {
  await getItems()
});

// Computed para filtrar los elementos según el texto de búsqueda
const filteredItems = computed(() => {
  if (!search.value) return items.value;
  return items.value.filter(item => {
    return item.nombre.toLowerCase().includes(search.value.toLowerCase());
  });
});


const openEditModal = (item) => {
  editedItem.value = { ...item };
  editDialog.value = true;
};

const closeEditModal = () => editDialog.value = false;

const saveEdit = async () => {
  if (editedItem.value.nombre) {
    const values = {
      Nombre: editedItem.value.nombre,
      Extension: editedItem.value.extension,
      Status: 1,
      UsuarioRegistro: getUserId()
    }

    const response = await axios.put(`/requisitos/${editedItem.value.requisitoId}`, values);
    if (response) {
      editDialog.value = false;
      getItems()
    }
  }
}

const openDeleteModal = (item) => {
  deleteDialog.value = true;
  deleteItem.value = { ...item };
}

const closeDeleteModal = () => deleteDialog.value = false;

const confirmDelete = async () => {
  const response = await axios.delete(`/requisitos/${deleteItem.value.requisitoId}`);
  if (response) {
    deleteDialog.value = false;
    getItems()
  }
}

const openCreateModal = () => createDialog.value = true;

const closeCreateModal = () => createDialog.value = false;

const saveCreate = async () => {
  if (nameNewItem.value && extensionNewItem.value) {
    const values = {
      Nombre: nameNewItem.value,
      Extension: extensionNewItem.value,
      Status: 1,
      UsuarioRegistro: getUserId()
    }

    const response = await axios.post(`/requisitos`, values);
    if (response) {
      createDialog.value = false;
      nameNewItem.value = '';
      extensionNewItem.value = '';
      getItems()
    }
  }
}

const getItems = async () => {
  const response = await axios.get('/requisitos');
  setRequisitos(response?.data);
}

const getUserId = () => {
  const storedUserInfo = localStorage.getItem('userinfo');
  if (storedUserInfo) {
    return JSON.parse(storedUserInfo).usuarioId;
  }
};
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
