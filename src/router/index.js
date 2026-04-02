import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DetalleView from '@/views/DetalleView.vue'
import LoginView from '@/views/LoginView.vue'
import PerfilView from '@/views/PerfilView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/lugar/:id',
      name: 'detalle',
      component: DetalleView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: PerfilView,
      meta: { requiereAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  import('@/store').then(({ default: store }) => {
    if (to.meta.requiereAuth && !store.getters.isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  })
})

export default router
