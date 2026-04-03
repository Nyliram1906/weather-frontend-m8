<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container">
      <router-link class="navbar-brand" to="/">El Tiempo en Scadrial</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-center gap-2">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Inicio</router-link>
          </li>

          <!-- Si está logueado -->
          <template v-if="isAuthenticated">
            <li class="nav-item">
              <router-link to="/perfil" class="usuario-badge">
                <i class="bi bi-person-fill me-1"></i>
                {{ usuario.nombre }}
              </router-link>
            </li>
            <li class="nav-item">
              <button class="btn-cerrar-sesion" @click="cerrarSesion">
                Cerrar sesión
              </button>
            </li>
          </template>

          <!-- Si no está logueado -->
          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Iniciar sesión</router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
defineOptions({ name: 'AppNavbar' })

import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const isAuthenticated = computed(() => store.getters.isAuthenticated)
const usuario = computed(() => store.getters.usuario)

const cerrarSesion = () => {
  store.dispatch('logout')
  router.push('/login')
}
</script>

<style scoped>
.usuario-badge {
  display: inline-flex;
  align-items: center;
  background-color: #ffd60a;
  color: #001d3d;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 4px 12px;
  border-radius: 20px;
  text-decoration: none;
  transition: background-color 0.2s;
}
.usuario-badge:hover {
  background-color: #ffc300;
}

.btn-cerrar-sesion {
  background: transparent;
  border: 1px solid #ffd60a44;
  color: #d9d9d9;
  font-size: 0.85rem;
  padding: 4px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cerrar-sesion:hover {
  border-color: #ffd60a;
  color: #ffd60a;
}
</style>

