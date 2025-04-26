import { createRouter, createWebHistory } from 'vue-router'
import ModelLeaderboard from '../components/ModelLeaderboard.vue'
import VendorInfo from '../components/VendorInfo.vue'
import { createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ModelLeaderboard
  },
  {
    path: '/vendors',
    name: 'Vendors',
    component: VendorInfo
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router