<template>
    <main class="container my-4">

        <!-- Cargando -->
        <div v-if="cargando" class="text-center my-4">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Consultando los vientos de Scadrial...</p>
        </div>

        <!-- Error -->
        <div v-if="error" class="alert alert-danger">
            {{ error }}
        </div>

        <!-- Contenido -->
        <template v-if="!cargando && !error && lugar">

            <!-- Tarjeta principal -->
            <div class="card mb-3">
                <div class="row g-0">
                    <div class="col-lg-4 d-flex justify-content-center align-items-center">
                        <i :class="`bi ${iconos[lugar.estadoActual] || 'bi-cloud'}`" style="font-size: 90px"></i>
                    </div>
                    <div class="col-lg-8">
                        <div class="card-body">
                            <h2 class="card-title">{{ lugar.nombre }}</h2>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">{{ lugar.estadoActual }}</li>
                                <li class="list-group-item">Temperatura: {{ lugar.tempActual }}°C</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Alertas -->
            <section class="my-4">
                <h3>⚠️ Alertas del Imperio Final</h3>
                <div v-for="alerta in alertas" :key="alerta" class="alert alert-warning" role="alert">
                    {{ alerta }}
                </div>
            </section>

            <!-- Pronóstico semanal -->
            <section class="my-4">
                <h3>Pronóstico semanal</h3>
                <ul class="list-group">
                    <li v-for="dia in lugar.pronosticoSemanal" :key="dia.dia" class="list-group-item">
                        <i :class="`bi ${iconos[dia.estado] || 'bi-cloud'}`"></i>
                        {{ dia.dia }}: {{ dia.min }}°C - {{ dia.max }}°C — {{ dia.estado }}
                    </li>
                </ul>
            </section>

            <!-- Estadísticas -->
            <section class="my-4">
                <h3>Estadísticas de la semana</h3>
                <table class="table table-bordered text-center">
                    <thead>
                        <tr>
                            <th>Temperatura mínima</th>
                            <th>Temperatura máxima</th>
                            <th>Temperatura promedio</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ estadisticas.minimaSemanal }}°C</td>
                            <td>{{ estadisticas.maximaSemanal }}°C</td>
                            <td>{{ estadisticas.promedioSemanal }}°C</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Resumen -->
                <p>
                    Semana con clima mayormente
                    <strong>{{ estadisticas.estadoPredominante }}</strong>.
                    Máxima {{ estadisticas.maximaSemanal }}°C,
                    mínima {{ estadisticas.minimaSemanal }}°C.
                </p>

                <!-- Tabla de estados -->
                <table class="table table-bordered text-center mt-3">
                    <thead>
                        <tr>
                            <th v-for="(cantidad, estado) in estadisticas.conteoEstados" :key="estado">
                                Días {{ estado }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td v-for="(cantidad, estado) in estadisticas.conteoEstados" :key="estado">
                                {{ cantidad }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <!-- Volver al Home -->
            <router-link to="/" class="btn btn-secondary mt-2">
                ← Volver al inicio
            </router-link>

        </template>
    </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import WeatherApp from '@/services/WeatherApp'

const route = useRoute()
const lugar = ref(null)
const cargando = ref(true)
const error = ref(null)

const iconos = {
    'Ceniza constante': 'bi-cloud-haze',
    'Niebla densa': 'bi-cloud-fog',
    'Ceniza ligera': 'bi-cloud-drizzle',
    'Tormenta de ceniza': 'bi-cloud-lightning',
    'Neblina': 'bi-cloud-haze2',
    'Ceniza pesada': 'bi-clouds',
    'Niebla espesa': 'bi-cloud-fog2',
    'Oscuridad y ceniza': 'bi-cloud-moon',
    'Ceniza moderada': 'bi-cloud-rain',
    'Neblina matutina': 'bi-clouds-fill',
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