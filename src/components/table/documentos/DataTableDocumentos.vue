<template>
  <v-data-table v-if="items?.length" :headers="headers" :items="filteredItems"
    :sort-by="[{ key: 'requistoName', order: 'asc' }]">
    <template v-slot:top>
      <v-toolbar flat class="content-heade-table">
        <v-toolbar-title>Documentos</v-toolbar-title>
        <v-text-field v-model="search" label="Buscar" append-icon="mdi-magnify" single-line hide-details class="search-table"></v-text-field>
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn elevated color="indigo-darken-3 " @click="goTo(item)" class="btn-add-table margin-icons">
        Ver archivo
      </v-btn>
      <v-icon class="me-2 margin-icons" size="small" @click="openEditModal(item)">
        mdi-pencil
      </v-icon>
      <v-icon class="margin-icons" size="small" @click="openDeleteModal(item)">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>


  <!-- Modal de edición -->
  <v-dialog v-model="editDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Editar Documento</span>
      </v-card-title>
      <v-card-text>
        <v-file-input v-if="editedItem.requistoExtension === 'jpg'" label="Cargar image " @change="handleFileUpload($event)"
          accept="image/*" :rules="[rules.required, rules.imageUploaded, rules.maxFileSize(256)]"
          required></v-file-input>
        <v-file-input v-if="editedItem.requistoExtension === 'pdf'" label="Cargar pdf " @change="handleFileUpload($event)" accept=".pdf"
          :rules="[rules.required, rules.pdfUploaded, rules.maxFileSize(256)]" required></v-file-input>
        <v-file-input v-if="editedItem.requistoExtension === 'xml'" label="Cargar xml " @change="handleFileUpload($event)" accept=".xml"
          :rules="[rules.required, rules.xmlUploaded, rules.maxFileSize(256)]" required></v-file-input>
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
        <span class="headline">Eliminar Documento</span>
      </v-card-title>
      <v-card-text>
        ¿Estás seguro de que deseas eliminar "{{ deleteItem?.requistoName }}"?
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
import { ref, onMounted, computed, watch } from 'vue';
import { defineProps } from 'vue';
import { useRoute } from 'vue-router';
import { useRequisitosStore } from '@/stores/requisitosSlide';
import axios from '../../../axios';


// Estados para diálogos
const editDialog = ref(false);
const editedItem = ref({});
const deleteDialog = ref(false);
const deleteItem = ref({ name: '' });
const search = ref('');
const props = defineProps({
  list: {
    type: Array,
    required: true,
  },
  getDocuments: {
    type: Function,
    required: false,
    default: null,
  }
});

const requistosStore = useRequisitosStore();
const { setRequisitos } = requistosStore;
const items = ref([]);
const documentFile = ref(null);
const route = useRoute();

const headers = [
  { text: 'Nombre', value: 'requistoName' },
  { text: 'Fecha de Registro', value: 'fechaRegistro' },
  { text: 'Actions', value: 'actions', sortable: false }
];

onMounted(async () => {
  items.value = props.list;
});

watch(
  () => [props.list, props.requisitos],
  ([newList]) => {
    items.value = newList;

  }
);

// Computed para filtrar los elementos según el texto de búsqueda
const filteredItems = computed(() => {
  if (!search.value) return items.value;
  return items.value.filter(item => {
    return item.requistoName.toLowerCase().includes(search.value.toLowerCase());
  });
});


const openEditModal = async (item) => {
  editedItem.value = { ...item };
  editDialog.value = true;
};

const closeEditModal = () => editDialog.value = false;

const saveEdit = async () => {
  const formData = new FormData();
  formData.append('RequisitoId', editedItem.value.requisitoId);
  formData.append('SolicitanteId', route.params.id);
  formData.append('UsuarioRegistro', getUserId());
  if (documentFile.value) {
    formData.append('archivo', documentFile.value);
  }
  const response = await axios.put(`documentos/${editedItem.value.documentoId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (response) {
    editDialog.value = false;
    editedItem.value = {};
    props.getDocuments();
  }
}

const openDeleteModal = (item) => {
  deleteDialog.value = true;
  deleteItem.value = { ...item };
}

const closeDeleteModal = () => deleteDialog.value = false;

const confirmDelete = async () => {
  const response = await axios.delete(`/documentos/${deleteItem.value.documentoId}`);
  if (response) {
    deleteDialog.value = false;
    props.getDocuments();
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  documentFile.value = file;
};

const goTo = (item) => {
  window.open(item.url, '_blank');
}

const getItems = async () => {
  const response = await axios.get('/requisitos');
  setRequisitos(response?.data);
  items.value = response.data;
}

const getUserId = () => {
  const storedUserInfo = localStorage.getItem('userinfo');
  if (storedUserInfo) {
    return JSON.parse(storedUserInfo).usuarioId;
  }
};

const rules = {
  required: v => !!v || 'Este campo es obligatorio',
  imageUploaded: () => documentFile.value !== null || 'Debes cargar una imagen',
  pdfUploaded: () => documentFile.value !== null || 'Debes cargar un pdf',
  xmlUploaded: () => documentFile.value !== null || 'Debes cargar un xml',
  maxFileSize: maxMB => v => {
    if (!v || v.length === 0) return true;
    const file = v[0];
    if (!(file instanceof File)) return true;
    const fileSizeMB = file.size / (1024 * 1024);
    return fileSizeMB <= maxMB || `El archivo no puede exceder ${maxMB} MB`;
  },
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
