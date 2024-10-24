<template>
  <v-app class="app-vapp">
    <div class="container-login">
      <div class="text-center div-title-login">
        <h1>Login</h1>
        <p>Sistema de Requisitos de documentos</p>
      </div>
      <div class="div-login">
        <v-text-field label="Usuario" v-model="userName"
          :rules="[v => !!v || 'El campo no puede estar vacío']"></v-text-field>
        <v-text-field label="Contraseña" type="password" v-model="password"
          :rules="[v => !!v || 'El campo no puede estar vacío']"></v-text-field>
        <div class="text-right">
          <v-btn elevated color="indigo-darken-3" @click="validateFields">
            Login
          </v-btn>
        </div>
      </div>
      <div class="text-center div-msg-ca">
        <p>Si no tienes cuenta <b>Crear una</b></p>
      </div>
    </div>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import axios from '../../axios';

const userName = ref('');
const password = ref('');
const router = useRouter();

const validateFields = async () => {
  if (!userName.value || !password.value) {
    Swal.fire({
      title: 'Campos vacios',
      text: 'Llenar los campos',
      icon: 'error',
      confirmButtonText: '¡Entendido!'
    })
    return;
  }

  const response = await axios.get(`usuarios/login?userName=${userName.value}&password=${password.value}`);
  const authorizationHeader = response.headers['authorization'];
  if (authorizationHeader) document.cookie = `token=${authorizationHeader}; path=/; secure; SameSite=Strict`;
  if (response?.data) localStorage.setItem('userinfo', JSON.stringify(response.data));
  if (authorizationHeader && response?.data) router.push('/home')
};
</script>

<style scoped>
.container-login {
  padding-top: 100px;
}

.div-title-login {
  margin-bottom: 10px;
}

.div-title-login h1 {
  font-weight: 600;
}

.div-title-login p {
  color: gray;
}

.div-login {
  position: relative;
  width: 400px;
  margin: 0 auto;
  background: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 10px 10px 19px -8px rgba(117, 117, 117, 1);
}

.div-msg-ca {
  margin-top: 20px;
}
</style>
