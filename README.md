# 🌫️ El Tiempo en Scadrial — Portafolio Final (Módulo 8)

Aplicación web de clima temática basada en el universo **Mistborn** de Brandon Sanderson. SPA construida con Vue.js que consume datos meteorológicos reales desde la API Open-Meteo y los presenta con la estética del Imperio Final: paleta azul oscuro y dorado, estados del clima traducidos al lenguaje de Scadrial.

---

## 🔗 Repositorio

[https://github.com/Nyliram1906/weather-frontend-m8](https://github.com/Nyliram1906/weather-frontend-m8)

---

## ⚙️ Instrucciones de ejecución local

### Requisitos

- **Node.js** v20.19.0 o superior
- **npm** v9 o superior

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Nyliram1906/weather-frontend-m8.git
cd weather-frontend-m8/weatherapp-m6

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev
```

La app estará disponible en `http://localhost:5173`

### Variables de entorno

La aplicación usa la API **Open-Meteo**, que es **gratuita y no requiere API key ni archivo `.env`**. No se necesita ninguna configuración adicional para ejecutarla.

---

## 🗺️ Rutas principales

| Vista    | Ruta          | Acceso     | Descripción                                      |
|----------|---------------|------------|--------------------------------------------------|
| Home     | `/`           | Público    | Listado de 10 ciudades con clima actual          |
| Detalle  | `/lugar/:id`  | Público    | Pronóstico 7 días, estadísticas y alertas        |
| Login    | `/login`      | Público    | Formulario de inicio de sesión                   |
| Perfil   | `/perfil`     | 🔒 Privado | Preferencia de temperatura °C/°F                 |

---

## ✨ Funcionalidades clave

### API de clima
Consume datos reales desde **Open-Meteo** (`https://api.open-meteo.com/v1/forecast`), gratuita y sin API key. Cada ciudad de Scadrial está mapeada a coordenadas reales de Chile. Los códigos meteorológicos WMO se traducen al clima temático de Scadrial (ceniza, niebla, oscuridad, etc.).

### Estadísticas semanales
Para cada ciudad se calculan automáticamente a partir de los datos de la API:
- Temperatura mínima, máxima y promedio de la semana
- Conteo de días por tipo de clima
- Estado climático predominante

### Alertas meteorológicas
Reglas simples aplicadas sobre las estadísticas:
- 🌡️ Calor inusual si la máxima supera 15°C
- ⚠️ Frío extremo si la mínima baja de 5°C
- 🌪️ Semana tormentosa si hay 3+ días de tormenta de ceniza
- 🌑 Oscuridad prolongada si hay 2+ días de oscuridad y ceniza

### Preferencia de temperatura
El usuario puede cambiar entre **°C y °F** desde su perfil. La preferencia se guarda en Vuex y se aplica reactivamente en Home y Detalle.

### Autenticación
Login con usuarios simulados en el frontend. La ruta `/perfil` está protegida con un guard de Vue Router que redirige a `/login` si no hay sesión activa.

**Usuarios de prueba:**

| Email                | Contraseña |
|----------------------|------------|
| marilyn@scadrial.com | 1234       |
| vin@scadrial.com     | 1234       |
| sazed@scadrial.com   | 1234       |

---

## 🗃️ Estado global (Vuex)

```javascript
state: {
  usuario: null,           // datos del usuario autenticado
  isAuthenticated: false,  // flag de sesión activa
  unidadTemperatura: 'C',  // 'C' o 'F'
}
```

---

## 🛠️ Tecnologías

- **Vue.js 3** + Composition API
- **Vue Router 4** con navegación sin recarga y guards de autenticación
- **Vuex 4** para estado global
- **Bootstrap 5.3** + Bootstrap Icons
- **Vite 7**
- **API Open-Meteo** (fetch nativo)

---

## 🗺️ Ciudades del Imperio Final

| Ciudad (Scadrial)       | Coordenadas reales (Chile) |
|-------------------------|---------------------------|
| Luthadel                | Santiago                  |
| Fadrex City             | Valparaíso                |
| Urteau                  | Concepción                |
| Tremredare              | Temuco                    |
| Mantiz                  | La Serena                 |
| Conventical of Seran    | Puerto Montt              |
| Vetitan                 | Coyhaique                 |
| Pits of Hathsin         | Punta Arenas              |
| Tathingdwen             | Copiapó                   |
| Lakeside                | Valdivia                  |

---

## 👩‍💻 Autora

**Marilyn Villalobos** — Desarrolladora Frontend  
Proyecto académico — Módulo 8: Portafolio Final  
© 2025 Mistborn Edition
