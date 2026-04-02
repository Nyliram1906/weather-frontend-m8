<template>
  <main class="container my-4">
    <div class="row justify-content-center">
      <div class="col-md-5">

        <div class="card p-4 mt-5">
          <h2 class="card-title text-center mb-4">
            <i class="bi bi-cloud-haze me-2"></i>
            Iniciar sesión
          </h2>

          <!-- Mensaje de error -->
          <div v-if="errorMsg" class="alert alert-danger">
            {{ errorMsg }}
          </div>

          <form @submit.prevent="handleLogin">

            <div class="mb-3">
              <label for="email" class="form-label">Correo electrónico</label>
              <input
                v-model="email"
                type="email"
                class="form-control"
                id="email"
                placeholder="correo@scadrial.com"
                required
              />
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">Contraseña</label>
              <input
                v-model="password"
                type="password"
                class="form-control"
                id="password"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" class="btn btn-warning w-100 mt-2">
              Entrar al Imperio Final
            </button>

          </form>

          <p class="text-center mt-3 small">
            Usuarios de prueba: marilyn@scadrial.com / vin@scadrial.com / sazed@scadrial.com
            <br>Contraseña: <strong>1234</strong>
          </p>
        </div>

      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMsg = ref('')

const handleLogin = async () => {
  errorMsg.value = ''

  const exito = await store.dispatch('login', {
    email: email.value,
    password: password.value,
  })

  if (exito) {
    await router.push('/')
  } else {
    errorMsg.value = 'Usuario o contraseña incorrectos.'
  }
}
</script>
