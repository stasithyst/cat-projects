import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import CardPage from '../pages/CardPage.vue'
import GalleryPage from '../pages/GalleryPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/card/:id',
      name: 'card',
      component: CardPage,
      props: true,
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: GalleryPage,
      children: [
        {
          path: ':id',
          name: 'gallery-image',
          component: GalleryPage,
        },
      ],
    },
  ],
})

export default router
