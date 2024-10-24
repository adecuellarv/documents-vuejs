import { defineStore } from "pinia";
import { ref } from 'vue';
export const useSolicitantesStore = defineStore('solicitantesSlide', () => {
  const solicitantes = ref<any[]>([]);

  const setSolicitantes = (payload: any[]) => {
      solicitantes.value = payload;
  }

  return { solicitantes, setSolicitantes };
});
