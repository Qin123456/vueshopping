import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/user/users.vue'
import Rights from '../components/power/rights.vue'
import Roles from '../components/power/roles.vue'
import Categories from '../components/goods/categories.vue'
import Params from '../components/goods/params.vue'
import List from '../components/goods/list.vue'
import Add from '../components/goods/Add.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/home/welcome',
    children: [
      {
        path: 'welcome',
        name: 'welcome',
        component: Welcome
      },
      {
        path: 'users',
        name: 'users',
        component: Users
      },
      {
        path: 'rights',
        name: 'rights',
        component: Rights
      },
      {
        path: 'roles',
        name: 'roles',
        component: Roles
      },
      {
        path: 'categories',
        name: 'categories',
        component: Categories
      },
      {
        path: 'params',
        name: 'params',
        component: Params
      },
      {
        path: 'goods',
        name: 'goods',
        component: List
      },
      {
        path: 'add',
        name: 'add',
        component: Add
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
