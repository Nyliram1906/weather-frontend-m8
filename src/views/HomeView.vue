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
          class="form-control buscador"
          placeholder="🔍 Buscar ciudad..."
        />
      </div>
    </div>

    <!-- Mensaje de carga -->
    <p v-if="cargando" class="text-center text-white">Cargando datos del clima...</p>

    <!-- Mensaje de error -->
    <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>

    <!-- Sin resultados -->
    <p v-if="lugaresFiltrados.length === 0 && !cargando" class="text-center text-white">
      No se encontró ninguna ciudad con ese nombre.
    </p>

    <!-- Listado de lugares -->
    <section v-if="!cargando && !error" class="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-4">
      <div class="col" v-for="lugar in lugaresFiltrados" :key="lugar.id">
        <article class="weather-card h-100">
          <div class="weather-card__icon">
            <i :class="`bi ${iconos[lugar.estadoActual] || 'bi-cloud'}`"></i>
          </div>
          <div class="weather-card__body">
            <h5 class="weather-card__ciudad">{{ lugar.nombre }}</h5>
            <p class="weather-card__temp">{{ convertirTemp(lugar.tempActual) }}</p>
            <p class="weather-card__estado">{{ lugar.estadoActual }}</p>
          </div>
          <div class="weather-card__footer">
            <router-link :to="`/lugar/${lugar.id}`" class="weather-card__link">
              Ver detalle →
            </router-link>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import WeatherApp from '@/services/WeatherApp'

const store = useStore()
const lugares = ref([])
const cargando = ref(true)
const error = ref(null)
const busqueda = ref('')

const unidad = computed(() => store.getters.unidadTemperatura)

const convertirTemp = (tempC) => {
  if (unidad.value === 'F') {
    return `${Math.round((tempC * 9/5) + 32)}°F`
  }
  return `${tempC}°C`
}

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

<style scoped>
.weather-card {
  background-color: #001d3d;
  border: 1px solid #4a4a4a;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.weather-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(255, 214, 10, 0.25);
}
.weather-card__icon {
  width: 100%;
  background-color: #003566;
  padding: 1rem 0;
  font-size: 2.5rem;
  color: #ffd60a;
}
.weather-card__body {
  padding: 1rem;
  flex: 1;
}
.weather-card__ciudad {
  color: #ffd60a;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}
.weather-card__temp {
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}
.weather-card__estado {
  color: #a0aec0;
  font-size: 0.85rem;
  margin: 0;
}
.weather-card__footer {
  padding: 0.75rem;
  width: 100%;
  border-top: 1px solid #4a4a4a22;
}
.weather-card__link {
  color: #ffc300;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  transition: color 0.2s;
}
.weather-card__link:hover {
  color: #ffd60a;
}
.buscador {
  background-color: #001d3d;
  border: 1px solid #4a4a4a;
  color: #d9d9d9;
}
.buscador::placeholder {
  color: #6b7c93;
}
.buscador:focus {
  background-color: #001d3d;
  border-color: #ffd60a;
  color: #d9d9d9;
  box-shadow: 0 0 0 2px rgba(255, 214, 10, 0.2);
}
</style>
