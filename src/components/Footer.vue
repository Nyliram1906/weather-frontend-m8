// eslint-disable-next-line vue/multi-word-component-names
<template>
  <footer class="footer-app">
    <div class="container d-flex justify-content-between align-items-center">
      <span class="footer-brand">🌫️ El Tiempo en Scadrial</span>
      <nav class="d-flex gap-3">
        <router-link to="/" class="footer-link">Inicio</router-link>
        <router-link v-if="isAuthenticated" to="/perfil" class="footer-link">Mi perfil</router-link>
        <router-link v-if="!isAuthenticated" to="/login" class="footer-link">Iniciar sesión</router-link>
      </nav>
      <span class="footer-copy">© 2025 Marilyn Villalobos Rojas</span>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const isAuthenticated = computed(() => store.getters.isAuthenticated)
</script>

<style scoped>
.footer-app {
  background-color: rgba(0, 13, 38, 0.95);
  border-top: 1px solid #ffd60a33;
  padding: 1rem 0;
  margin-top: 2rem;
}
.footer-brand {
  color: #ffd60a;
  font-weight: 600;
  font-size: 0.9rem;
}
.footer-link {
  color: #d9d9d9;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s;
}
.footer-link:hover {
  color: #ffd60a;
}
.footer-copy {
  color: #4a4a4a;
  font-size: 0.8rem;
}
</style>
