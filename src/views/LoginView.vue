<template>
  <div class="Login">
    <LoginForm />
  </div>
</template>
<script setup lang="ts">
import LoginForm from '../components/login/LoginForm.vue';
</script>
<style>
@media (min-width: 1024px) {
  .Login {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
