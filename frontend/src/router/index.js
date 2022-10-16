import { createRouter, createWebHistory } from 'vue-router'
import SendView from '../views/SendView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        /*
        {
            path: '/',
            name: 'main',
            component: SendView
        },
        {
            path: '/explore',
            name: 'explore',
            component: () => import('../views/ExploreView.vue')
        }
        */
    ]
})

export default router
