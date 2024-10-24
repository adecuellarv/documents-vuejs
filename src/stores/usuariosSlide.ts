import { defineStore } from "pinia";
import { ref } from 'vue';
export const usuariosStore = defineStore('usuariosSlide', () => {
  const usuarios = ref<any[]>([]);

  const setUsuarios = (payload: any[]) => {
    usuarios.value = payload;
  }

  return { usuarios, setUsuarios };
});
