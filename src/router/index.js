import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/market/symbol/:id/:moment',
    name: 'Market',
    component: () => import( '../views/Market.vue')
  },
  {
    path:'/admin',
    name:'Admin',
    component: ()=> import('../views/Admin.vue')
  },
  {
    path:'/error',
    name:'Error',
    component: ()=> import('../views/Error.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
