<template>
  <main class="container my-4">

    <!-- Cargando -->
    <div v-if="cargando" class="text-center my-4">
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2 text-white">Consultando los vientos de Scadrial...</p>
    </div>

    <!-- Error -->
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- Contenido -->
    <template v-if="!cargando && !error && lugar">

      <!-- Tarjeta principal -->
      <div class="card-principal mb-4">
        <div class="card-principal__icono">
          <i :class="`bi ${iconos[lugar.estadoActual] || 'bi-cloud'}`"></i>
        </div>
        <div class="card-principal__info">
          <h2 class="card-principal__nombre">{{ lugar.nombre }}</h2>
          <p class="card-principal__estado">{{ lugar.estadoActual }}</p>
          <p class="card-principal__temp">{{ convertirTemp(lugar.tempActual) }}</p>
        </div>
      </div>

      <!-- Alertas -->
      <section class="my-4">
        <h3 class="seccion-titulo">⚠️ Alertas del Imperio Final</h3>
        <div
          v-for="alerta in alertas"
          :key="alerta"
          class="alerta-item"
        >
          {{ alerta }}
        </div>
      </section>

      <!-- Pronóstico semanal -->
      <section class="my-4">
        <h3 class="seccion-titulo">Pronóstico semanal</h3>
        <ul class="pronostico-lista">
          <li
            v-for="dia in lugar.pronosticoSemanal"
            :key="dia.dia"
            class="pronostico-item"
          >
            <i :class="`bi ${iconos[dia.estado] || 'bi-cloud'} pronostico-icono`"></i>
            <span class="pronostico-dia">{{ dia.dia }}</span>
            <span class="pronostico-temp">
              {{ convertirTemp(dia.min) }} — {{ convertirTemp(dia.max) }}
            </span>
            <span class="pronostico-estado">{{ dia.estado }}</span>
          </li>
        </ul>
      </section>

      <!-- Estadísticas -->
      <section class="my-4">
        <h3 class="seccion-titulo">Estadísticas de la semana</h3>

        <!-- Tarjetas métricas -->
        <div class="metricas-grid">
          <div class="metrica-card">
            <span class="metrica-label">Mínima</span>
            <span class="metrica-valor">{{ convertirTemp(estadisticas.minimaSemanal) }}</span>
          </div>
          <div class="metrica-card">
            <span class="metrica-label">Máxima</span>
            <span class="metrica-valor">{{ convertirTemp(estadisticas.maximaSemanal) }}</span>
          </div>
          <div class="metrica-card">
            <span class="metrica-label">Promedio</span>
            <span class="metrica-valor">{{ convertirTemp(Number(estadisticas.promedioSemanal)) }}</span>
          </div>
          <div class="metrica-card">
            <span class="metrica-label">Clima predominante</span>
            <span class="metrica-valor metrica-valor--pequeño">{{ estadisticas.estadoPredominante }}</span>
          </div>
        </div>

        <!-- Tabla de estados -->
        <div class="estados-grid mt-4">
          <div
            v-for="(cantidad, estado) in estadisticas.conteoEstados"
            :key="estado"
            class="estado-card"
          >
            <span class="estado-nombre">{{ estado }}</span>
            <span class="estado-dias">{{ cantidad }} día{{ cantidad > 1 ? 's' : '' }}</span>
          </div>
        </div>
      </section>

      <!-- Volver -->
      <button @click="$router.push('/')" class="btn-volver mt-2">
        ← Volver al inicio
      </button>

    </template>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import WeatherApp from '@/services/WeatherApp'

const route = useRoute()
const store = useStore()
const lugar = ref(null)
const cargando = ref(true)
const error = ref(null)

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

const app = new WeatherApp()

const estadisticas = computed(() => {
  if (!lugar.value) return {}
  return app.calcularEstadisticas(lugar.value.pronosticoSemanal)
})

const alertas = computed(() => {
  if (!lugar.value) return []
  return app.generarAlertas(estadisticas.value)
})

onMounted(async () => {
  try {
    const id = parseInt(route.params.id)
    lugar.value = await app.obtenerDetalleLugar(id)
  } catch (e) {
    error.value = 'Error al cargar el detalle del lugar. Intenta más tarde.'
  } finally {
    cargando.value = false
  }
})
</script>

<style scoped>
.seccion-titulo {
  color: #ffd60a;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #ffd60a33;
  padding-bottom: 0.5rem;
}

/* Tarjeta principal */
.card-principal {
  background-color: #001d3d;
  border: 1px solid #4a4a4a;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
}
.card-principal__icono {
  font-size: 90px;
  color: #ffd60a;
  line-height: 1;
}
.card-principal__nombre {
  color: #ffd60a;
  font-size: 2rem;
  margin: 0;
}
.card-principal__estado {
  color: #a0aec0;
  margin: 0.25rem 0;
}
.card-principal__temp {
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
}

/* Alertas */
.alerta-item {
  background-color: #001d3d;
  border-left: 4px solid #ffd60a;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  color: #d9d9d9;
  font-size: 0.95rem;
}

/* Pronóstico */
.pronostico-lista {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.pronostico-item {
  background-color: #001d3d;
  border: 1px solid #4a4a4a33;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #d9d9d9;
}
.pronostico-icono {
  color: #ffd60a;
  font-size: 1.2rem;
  width: 1.5rem;
}
.pronostico-dia {
  width: 90px;
  font-weight: 600;
  text-transform: capitalize;
}
.pronostico-temp {
  color: #ffffff;
  font-weight: 600;
  width: 140px;
}
.pronostico-estado {
  color: #a0aec0;
  font-size: 0.85rem;
}

/* Métricas */
.metricas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}
.metrica-card {
  background-color: #001d3d;
  border: 1px solid #4a4a4a;
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.metrica-label {
  color: #a0aec0;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.metrica-valor {
  color: #ffd60a;
  font-size: 1.8rem;
  font-weight: 700;
}
.metrica-valor--pequeño {
  font-size: 1rem;
  text-align: center;
}

/* Estados */
.estados-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.estado-card {
  background-color: #001d3d;
  border: 1px solid #4a4a4a;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.estado-nombre {
  color: #d9d9d9;
  font-size: 0.8rem;
}
.estado-dias {
  color: #ffd60a;
  font-weight: 700;
}

/* Botón volver */
.btn-volver {
  background: transparent;
  border: 1px solid #4a4a4a;
  color: #d9d9d9;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-volver:hover {
  border-color: #ffd60a;
  color: #ffd60a;
}
</style>
