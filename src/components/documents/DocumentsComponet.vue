<template>
  <div class="text-right">
    <v-btn elevated color="indigo-darken-3" @click="openCreateModal()" class="btn-add-table">
      Agregar Documento a usuario
    </v-btn>
  </div>
  <div>
    <div v-if="listDocumentos.length === 0" class="div-no-info">
      <h1>No hay elementos</h1>
      <p>Da click en botón <b>agregar documento a usuario</b></p>
    </div>
    <div v-else>
      <DataTableDocumentos :list="listDocumentos" :requisitos="listRequisitos" :getDocuments="getDocuments"/>
    </div>
  </div>

  <!-- Modal requisitos -->
  <v-dialog v-model="showRequisitosDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Asignarle un documento</span>
      </v-card-title>
      <v-card-text>
        <v-select v-model="requisitoItem" :items="listRequisitos" item-text="title" item-value="id" label="Select"
          variant="outlined"></v-select>
        <v-file-input v-if="extension === 'jpg'" label="Cargar image " @change="handleFileUpload($event)"
          accept="image/*" :rules="[rules.required, rules.imageUploaded, rules.maxFileSize(256)]" :error-messages="fileError ? ['Debes cargar un archivo'] : []"
          required></v-file-input>
        <v-file-input v-if="extension === 'pdf'" label="Cargar pdf " @change="handleFileUpload($event)" accept=".pdf"
          :rules="[rules.required, rules.pdfUploaded, rules.maxFileSize(256)]" required :error-messages="fileError ? ['Debes cargar un archivo'] : []"></v-file-input>
        <v-file-input v-if="extension === 'xml'" label="Cargar xml " @change="handleFileUpload($event)" accept=".xml"
          :rules="[rules.required, rules.xmlUploaded, rules.maxFileSize(256)]" required :error-messages="fileError ? ['Debes cargar un archivo'] : []"></v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="addRequisito">Agregar</v-btn>
        <v-btn color="red darken-1" text @click="closeRquistoModal">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from '../../axios';
import DataTableDocumentos  from '@/components/table/documentos/DataTableDocumentos.vue';

const showRequisitosDialog = ref(false);
const listRequisitos = ref([]);
const requisitos = ref([]);
const listDocumentos = ref([]);
const requisitoItem = ref(null);
const documentFile = ref(null);
const extension = ref('');
const route = useRoute();
const fileError = ref(false);

onMounted(async () => {
  await getDocuments();
  await getRequisitos();
});

watch(requisitoItem, (newId) => {
  const filterRequisitos = requisitos.value.filter(i => i.requisitoId == newId);
  if (filterRequisitos?.length) {
    extension.value = filterRequisitos[0]?.extension;
  }
});

const openCreateModal = () => showRequisitosDialog.value = true;

const closeRquistoModal = () => showRequisitosDialog.value = false;

const addRequisito = async () => {
  if(validateForm()){
    const formData = new FormData();
    formData.append('RequisitoId', requisitoItem.value);
    formData.append('SolicitanteId', route.params.id);
    formData.append('UsuarioRegistro', getUserId());
    if (documentFile.value) {
      formData.append('archivo', documentFile.value);
    }

    const response = await axios.post(`documentos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response) {
      showRequisitosDialog.value = false;
      getDocuments();
    }
  }
}

const getDocuments = async () => {
  const resp = await axios.get(`/documentos/${route.params.id}`);
  if (resp?.data) {
    listDocumentos.value = resp?.data;
  }
}

const getRequisitos = async () => {
  const resp = await axios.get(`/requisitos`);
  if (resp?.data) {
    requisitos.value = resp.data;
    const newArray = resp.data.map(item => ({
      id: item.requisitoId,
      title: item.nombre
    }));
    listRequisitos.value = newArray;
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  documentFile.value = file;
};

const getUserId = () => {
  const storedUserInfo = localStorage.getItem('userinfo');
  if (storedUserInfo) {
    return JSON.parse(storedUserInfo).usuarioId;
  }
};

const rules = {
  required: v => !!v || 'Este campo es obligatorio',
    // Validación para imágenes JPG
  imageUploaded: v => {
    if (!v || v.length === 0) return 'Debes cargar una imagen';
    const file = v[0];
    return file.type === 'image/jpeg' || file.type === 'image/jpg' || 'El archivo debe ser una imagen JPG';
  },
  // Validación para PDFs
  pdfUploaded: v => {
    if (!v || v.length === 0) return 'Debes cargar un pdf';
    const file = v[0];
    return file.type === 'application/pdf' || 'El archivo debe ser un PDF';
  },
  // Validación para archivos XML
  xmlUploaded: v => {
    if (!v || v.length === 0) return 'Debes cargar un xml';
    const file = v[0];
    return file.type === 'application/xml' || file.type === 'text/xml' || 'El archivo debe ser un XML';
  },
  maxFileSize: maxMB => v => {
    if (!v || v.length === 0) return true;
    const file = v[0];
    if (!(file instanceof File)) return true;
    const fileSizeMB = file.size / (1024 * 1024);
    return fileSizeMB <= maxMB || `El archivo no puede exceder ${maxMB} MB`;
  },
};

const validateForm = () => {
  const fileInput = documentFile.value;
  if (!fileInput) {
    fileError.value = true;
    return false;
  }
  if (extension.value === 'jpg') {
    const imageError = rules.imageUploaded(fileInput ? [fileInput] : null);
    if (imageError !== true) {
      return false;
    }
  } else if (extension.value === 'pdf') {
    const pdfError = rules.pdfUploaded(fileInput ? [fileInput] : null);
    if (pdfError !== true) {
      return false;
    }
  } else if (extension.value === 'xml') {
    const xmlError = rules.xmlUploaded(fileInput ? [fileInput] : null);
    if (xmlError !== true) {
      return false;
    }
  }
  const sizeError = rules.maxFileSize(256)(fileInput ? [fileInput] : null);
  if (sizeError !== true) {
    return false;
  }

  return true;
};
</script>

<style scoped>
.div-no-info {
  text-align: center;
}
</style>
