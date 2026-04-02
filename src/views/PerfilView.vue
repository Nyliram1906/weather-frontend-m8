<template>
  <main class="container my-4">
    <div class="row justify-content-center">
      <div class="col-md-6">

        <div class="card p-4 mt-4">
          <h2 class="card-title mb-4">
            <i class="bi bi-person-circle me-2"></i>
            Mi perfil
          </h2>

          <!-- Info usuario -->
          <div class="mb-4">
            <p><strong>Nombre:</strong> {{ usuario.nombre }}</p>
            <p><strong>Correo:</strong> {{ usuario.email }}</p>
          </div>

          <hr>

          <!-- Preferencia de temperatura -->
          <h4 class="mb-3">🌡️ Preferencia de temperatura</h4>

          <div class="d-flex gap-3 align-items-center mb-3">
            <div class="form-check">
              <input
                v-model="unidad"
                class="form-check-input"
                type="radio"
                value="C"
                id="celsius"
                @change="guardarUnidad"
              />
              <label class="form-check-label" for="celsius">
                Celsius (°C)
              </label>
            </div>
            <div class="form-check">
              <input
                v-model="unidad"
                class="form-check-input"
                type="radio"
                value="F"
                id="fahrenheit"
                @change="guardarUnidad"
              />
              <label class="form-check-label" for="fahrenheit">
                Fahrenheit (°F)
              </label>
            </div>
          </div>

          <div class="alert alert-success" v-if="guardado">
            ✅ Preferencia guardada correctamente.
          </div>

          <hr>

          <router-link to="/" class="btn btn-secondary mt-2">
            ← Volver al inicio
          </router-link>
        </div>

      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const usuario = computed(() => store.getters.usuario)
const unidad = ref(store.getters.unidadTemperatura)
const guardado = ref(false)

const guardarUnidad = () => {
  store.dispatch('setUnidad', unidad.value)
  guardado.value = true
  setTimeout(() => {
    guardado.value = false
  }, 2000)
}
</script>
