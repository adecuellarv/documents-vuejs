import { defineStore } from "pinia";
import { ref } from 'vue';
export const useRequisitosStore = defineStore('requisitosSlide', () => {
  const requisitos = ref<any[]>([]);

  const setRequisitos = (payload: any[]) => {
      requisitos.value = payload;
  }

  return { requisitos, setRequisitos };
});
