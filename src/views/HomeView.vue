<template>
  <main class="container my-4">
    <header class="my-4">
      <h1 class="text-center">Reporte del tiempo en el Imperio Final</h1>
    </header>

    <!-- Buscador -->
    <div class="row justify-content-center my-3">
      <div class="col-md-4">
        <input
          v-model="busqueda"
          type="text"
          class="form-control"
          placeholder="Buscar ciudad..."
        />
      </div>
    </div>

    <!-- Mensaje de carga -->
    <p v-if="cargando" class="text-center">Cargando datos del clima...</p>

    <!-- Mensaje de error -->
    <div v-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>

    <!-- Sin resultados -->
    <p v-if="lugaresFiltrados.length === 0 && !cargando" class="text-center">
      No se encontró ninguna ciudad con ese nombre.
    </p>

    <!-- Listado de lugares -->
    <section v-if="!cargando && !error" class="row row-cols-1 row-cols-md-4 row-cols-lg-6 g-4">
      <div class="col" v-for="lugar in lugaresFiltrados" :key="lugar.id">
        <article class="card weather-card h-100 text-center">
          <i :class="`bi ${iconos[lugar.estadoActual] || 'bi-cloud'} card__icon`"></i>
          <div class="card-body">
            <h5 class="card-title">{{ lugar.nombre }}</h5>
            <p class="card-text">{{ lugar.tempActual }}°C</p>
            <p class="card-text">{{ lugar.estadoActual }}</p>
          </div>
          <div class="card-footer bg-transparent border-0">
            <router-link :to="`/lugar/${lugar.id}`" class="card-link">
              Ver detalle
            </router-link>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import WeatherApp from '@/services/WeatherApp'

const lugares = ref([])
const cargando = ref(true)
const error = ref(null)
const busqueda = ref('')

const iconos = {
  'Ceniza constante':   'bi-cloud-haze',
  'Niebla densa':       'bi-cloud-fog',
  'Ceniza ligera':      'bi-cloud-drizzle',
  'Tormenta de ceniza': 'bi-cloud-lightning',
  'Neblina':            'bi-cloud-haze2',
  'Ceniza pesada':      'bi-clouds',
  'Niebla espesa':      'bi-cloud-fog2',
  'Oscuridad y ceniza': 'bi-cloud-moon',
  'Ceniza moderada':    'bi-cloud-rain',
  'Neblina matutina':   'bi-clouds-fill',
}

const nombresCiudades = [
  'Luthadel', 'Fadrex City', 'Urteau', 'Tremredare', 'Mantiz',
  'Conventical of Seran', 'Vetitan', 'Pits of Hathsin', 'Tathingdwen', 'Lakeside',
]

const lugaresFiltrados = computed(() =>
  lugares.value.filter(lugar =>
    lugar.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  )
)

onMounted(async () => {
  try {
    const app = new WeatherApp()
    lugares.value = await app.obtenerTodosLosLugares(nombresCiudades)
  } catch (e) {
    error.value = 'Error al cargar los datos del clima. Intenta más tarde.'
  } finally {
    cargando.value = false
  }
})
</script>