<template>
  <v-data-table :headers="headers" :items="desserts" :sort-by="[{ key: 'calories', order: 'asc' }]">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>{{ titleTable }}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn elevated color="indigo-darken-3" v-bind="props">
              Agregar
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.name" label="Nombre"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field v-model="editedItem.calories" label="Total de tramites"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close">
                Cancel
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="save">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon class="me-2" size="small" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>
<script setup lang="ts">
import { ref } from 'vue';


const dialog = ref(false);
const dialogDelete = ref(false);
const editedItem = ref({ name: '', calories: '', fat: '', carbs: '', protein: '' });
const items = ref([]);
const formTitle = ref('Nuevo');
const selectedItem = ref(null);
const titleTable = ref('Solicitantes');

// Table headers
const headers = [
  { text: 'Nombre', value: 'name' },
  { text: 'Total de tramites', value: 'calories' },
  { text: 'Actions', value: 'actions', sortable: false }
];

// Sample data
const desserts = ref([
  { name: 'Ice Cream', calories: 207 },
  { name: 'Cake', calories: 364, },
  // Add more items as needed
]);

// Methods
const initialize = () => {
  // Initialize with sample data or fetch from an API
  items.value = desserts.value;
};

const close = () => {
  dialog.value = false;
  resetEditedItem();
};

const save = () => {
  if (selectedItem.value) {
    Object.assign(selectedItem.value, editedItem.value);
  } else {
    items.value.push({ ...editedItem.value });
  }
}

</script>
