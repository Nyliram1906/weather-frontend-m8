# 🌫️ El Tiempo en Scadrial — Módulo 7 (Usuarios, Login y Estado Global)

Extensión de la SPA Vue del Módulo 6, ahora con sistema de autenticación, estado global con **Vuex** y personalización por usuario.

---

## 👤 Sistema de usuarios

La autenticación se maneja con usuarios simulados en el frontend. Cada usuario tiene:

| Campo       | Descripción                        |
|-------------|------------------------------------|
| `nombre`    | Nombre visible en el navbar        |
| `email`     | Credencial de acceso               |
| `password`  | Contraseña de acceso               |

### Usuarios de prueba

| Email                     | Contraseña |
|---------------------------|------------|
| marilyn@scadrial.com      | 1234       |
| vin@scadrial.com          | 1234       |
| sazed@scadrial.com        | 1234       |

---

## 🗺️ Vistas principales

| Vista    | Ruta          | Acceso      | Descripción                                        |
|----------|---------------|-------------|----------------------------------------------------|
| Home     | `/`           | Público     | Listado de las 10 ciudades con clima actual        |
| Detalle  | `/lugar/:id`  | Público     | Pronóstico, estadísticas y alertas de una ciudad   |
| Login    | `/login`      | Público     | Formulario de inicio de sesión                     |
| Perfil   | `/perfil`     | 🔒 Privado  | Preferencia de temperatura °C / °F                 |

---

## 🧭 Rutas configuradas (Vue Router)

```javascript
{ path: '/',           component: HomeView }
{ path: '/lugar/:id',  component: DetalleView }
{ path: '/login',      component: LoginView }
{ path: '/perfil',     component: PerfilView, meta: { requiereAuth: true } }
```

La ruta `/perfil` está protegida con un guard global que redirige a `/login` si el usuario no está autenticado.

---

## 🔐 Flujo de autenticación

1. Usuario ingresa email y contraseña en `/login`
2. Se validan las credenciales contra los usuarios fake
3. **Éxito:** se guarda el usuario en Vuex y redirige al Home
4. **Error:** se muestra mensaje "Usuario o contraseña incorrectos"
5. El navbar muestra el nombre del usuario y un botón "Cerrar sesión"
6. Al cerrar sesión se limpia el estado en Vuex y redirige a `/login`

---

## 🗃️ Estado global (Vuex)

El store contiene:

```javascript
state: {
  usuario: null,           // objeto con nombre y email
  isAuthenticated: false,  // flag de sesión activa
  unidadTemperatura: 'C',  // 'C' o 'F'
}
```

**Mutations:** `LOGIN`, `LOGOUT`, `SET_UNIDAD`

**Actions:** `login`, `logout`, `setUnidad`

---

## 🌡️ Personalización por usuario

En `/perfil` el usuario puede cambiar la unidad de temperatura entre **°C** y **°F**. La preferencia se guarda en Vuex y está disponible globalmente en la app.

---

## 🛠️ Tecnologías utilizadas

- **Vue.js 3** + Composition API
- **Vue Router** (rutas protegidas con guards)
- **Vuex 4** (estado global de autenticación)
- **Bootstrap 5.3** + Bootstrap Icons
- **Vite**
- **API Open-Meteo** (gratuita, sin API key)

---

## ⚙️ Cómo ejecutar el proyecto

```bash
npm install
npm run dev
```

---

## 🔗 Repositorio

[GitHub — El Tiempo en Scadrial M7](https://github.com/Nyliram1906/weather-frontend-m7)

---

## 👩‍💻 Autora

**Marilyn Villalobos** — Desarrolladora Frontend  
Proyecto académico — Módulo 7: Usuarios, Login y Estado Global  
© 2025 Mistborn Edition
