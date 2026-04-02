import { createStore } from 'vuex'

const usuariosFake = [
  { id: 1, nombre: 'Marilyn', email: 'marilyn@scadrial.com', password: '1234' },
  { id: 2, nombre: 'Vin', email: 'vin@scadrial.com', password: '1234' },
  { id: 3, nombre: 'Sazed', email: 'sazed@scadrial.com', password: '1234' },
]

export default createStore({
  state: {
    usuario: null,
    isAuthenticated: false,
    unidadTemperatura: 'C',
  },

  mutations: {
    LOGIN(state, usuario) {
      state.usuario = usuario
      state.isAuthenticated = true
    },
    LOGOUT(state) {
      state.usuario = null
      state.isAuthenticated = false
      state.unidadTemperatura = 'C'
    },
    SET_UNIDAD(state, unidad) {
      state.unidadTemperatura = unidad
    },
  },

  actions: {
    login({ commit }, credenciales) {
      return new Promise((resolve) => {
        const usuario = usuariosFake.find(
          u => u.email === credenciales.email && u.password === credenciales.password
        )
        if (usuario) {
          const { password, ...usuarioSinPassword } = usuario
          commit('LOGIN', usuarioSinPassword)
          resolve(true)
        } else {
          resolve(false)
        }
      })
    },
    logout({ commit }) {
      commit('LOGOUT')
    },
    setUnidad({ commit }, unidad) {
      commit('SET_UNIDAD', unidad)
    },
  },

  getters: {
    usuario: state => state.usuario,
    isAuthenticated: state => state.isAuthenticated,
    unidadTemperatura: state => state.unidadTemperatura,
  },
})
