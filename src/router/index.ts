import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Layout',
      component: Layout,
      children: [
        {
          path: 'article',
          name: 'Article',
          component: () => import('@/views/article/index.vue')
        },
        {
          path: 'category',
          name: 'Category',
          component: () => import('@/views/category/index.vue')
        },
        {
          path: 'tag',
          name: 'Tag',
          component: () => import('@/views/tag/index.vue')
        }
      ]
    }
  ]
})

export default router
