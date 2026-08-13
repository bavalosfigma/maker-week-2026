import { createRouter, createWebHistory } from 'vue-router'
import HomeCanvas from './pages/HomeCanvas.vue'
import OldCanvas from './pages/OldCanvas.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeCanvas },
    { path: '/old-canvas', name: 'old-canvas', component: OldCanvas },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
