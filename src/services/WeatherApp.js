// Clase principal de la aplicación
class WeatherApp {
  constructor() {
    this.lugares = [];
    this.apiBaseUrl = 'https://api.open-meteo.com/v1/forecast';
  }

  // Método para obtener coordenadas de cada ciudad
  getCoordenadas(nombreLugar = 'Luthadel') {
    const coordenadas = {
      'Luthadel':             { lat: -33.45, lon: -70.67 },
      'Fadrex City':          { lat: -33.03, lon: -71.63 },
      'Urteau':               { lat: -36.82, lon: -73.05 },
      'Tremredare':           { lat: -38.74, lon: -72.60 },
      'Mantiz':               { lat: -29.90, lon: -71.25 },
      'Conventical of Seran': { lat: -41.47, lon: -72.94 },
      'Vetitan':              { lat: -45.57, lon: -72.07 },
      'Pits of Hathsin':      { lat: -53.16, lon: -70.91 },
      'Tathingdwen':          { lat: -27.36, lon: -70.33 },
      'Lakeside':             { lat: -39.81, lon: -73.24 },
    };
    return coordenadas[nombreLugar] || { lat: -33.45, lon: -70.67 };
  }

  // Método para traducir código WMO a estado de clima Scadrial
  traducirEstado(codigo = 0) {
    if (codigo === 0)  return 'Neblina matutina';
    if (codigo <= 3)   return 'Ceniza ligera';
    if (codigo <= 48)  return 'Niebla densa';
    if (codigo <= 67)  return 'Ceniza moderada';
    if (codigo <= 77)  return 'Ceniza pesada';
    if (codigo <= 82)  return 'Tormenta de ceniza';
    if (codigo <= 99)  return 'Oscuridad y ceniza';
    return 'Ceniza constante';
  }

  // Método para obtener datos de la API para un lugar
  async obtenerClima(nombreLugar) {
    const { lat, lon } = this.getCoordenadas(nombreLugar);
    const url = `${this.apiBaseUrl}?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto`;

    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error('Error al obtener datos de la API');
    return await respuesta.json();
  }

  // Método para calcular estadísticas semanales
  calcularEstadisticas(pronosticoSemanal = []) {
    const maximas = pronosticoSemanal.map(d => d.max);
    const minimas = pronosticoSemanal.map(d => d.min);

    const maximaSemanal = Math.max(...maximas);
    const minimaSemanal = Math.min(...minimas);
    const promedioSemanal = (maximas.reduce((a, b) => a + b, 0) / maximas.length).toFixed(2);

    const conteoEstados = {};
    pronosticoSemanal.forEach(dia => {
      conteoEstados[dia.estado] = (conteoEstados[dia.estado] || 0) + 1;
    });

    const estadoPredominante = Object.entries(conteoEstados)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0];

    return { maximaSemanal, minimaSemanal, promedioSemanal, conteoEstados, estadoPredominante };
  }

  // Método para generar alertas
  generarAlertas(estadisticas) {
    const alertas = [];

    if (estadisticas.minimaSemanal <= 5) {
      alertas.push('⚠️ Alerta de frío extremo: temperaturas bajo 5°C.');
    }
    if (estadisticas.maximaSemanal >= 15) {
      alertas.push('🌡️ Alerta de calor inusual para Scadrial: temperatura sobre 15°C.');
    }
    const diasTormenta = estadisticas.conteoEstados['Tormenta de ceniza'] || 0;
    if (diasTormenta >= 3) {
      alertas.push('🌪️ Semana con tormentas de ceniza intensas.');
    }
    const diasOscuridad = estadisticas.conteoEstados['Oscuridad y ceniza'] || 0;
    if (diasOscuridad >= 2) {
      alertas.push('🌑 Oscuridad prolongada detectada.');
    }

    return alertas.length > 0 ? alertas : ['✅ Condiciones estables para el Imperio Final.'];
  }

  // ✅ Para Vue: retorna todos los lugares con datos de la API sin tocar el DOM
  async obtenerTodosLosLugares(nombresLugares) {
    const lugares = [];

    for (let i = 0; i < nombresLugares.length; i++) {
      const nombre = nombresLugares[i];
      const datos = await this.obtenerClima(nombre);

      lugares.push({
        id: i + 1,
        nombre,
        tempActual: Math.round(datos.current_weather.temperature),
        estadoActual: this.traducirEstado(datos.current_weather.weathercode),
        pronosticoSemanal: datos.daily.time.map((dia, j) => ({
          dia: new Date(dia).toLocaleDateString('es-CL', { weekday: 'long' }),
          min: Math.round(datos.daily.temperature_2m_min[j]),
          max: Math.round(datos.daily.temperature_2m_max[j]),
          estado: this.traducirEstado(datos.daily.weathercode[j]),
        })),
      });

      // Pausa entre peticiones para evitar error 429
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    return lugares;
  }

  // ✅ Para Vue: retorna el detalle de un lugar específico sin tocar el DOM
  async obtenerDetalleLugar(locationId) {
    const nombresCiudades = [
      'Luthadel', 'Fadrex City', 'Urteau', 'Tremredare', 'Mantiz',
      'Conventical of Seran', 'Vetitan', 'Pits of Hathsin', 'Tathingdwen', 'Lakeside',
    ];

    const nombre = nombresCiudades[locationId - 1];
    if (!nombre) throw new Error('Lugar no encontrado');

    const datos = await this.obtenerClima(nombre);

    return {
      id: locationId,
      nombre,
      tempActual: Math.round(datos.current_weather.temperature),
      estadoActual: this.traducirEstado(datos.current_weather.weathercode),
      pronosticoSemanal: datos.daily.time.map((dia, j) => ({
        dia: new Date(dia).toLocaleDateString('es-CL', { weekday: 'long' }),
        min: Math.round(datos.daily.temperature_2m_min[j]),
        max: Math.round(datos.daily.temperature_2m_max[j]),
        estado: this.traducirEstado(datos.daily.weathercode[j]),
      })),
    };
  }
}

export default WeatherApp;