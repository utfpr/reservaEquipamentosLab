import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import Home from '@/components/Home'
import Login from '@/components/Login'
import p404 from '@/components/p404'
import Cadastro from '@/components/Cadastro'
import Equipamento from '@/components/Equipamento'
import Local from '@/components/Local'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        login: true
      }
    },
    {
      path: '/cadastro',
      name: 'Cadastro',
      component: Cadastro,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/equipamento',
      name: 'Equipamento',
      component: Equipamento,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/local',
      name: 'Local',
      component: Local,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/p404',
      name: 'p404',
      component: p404
    },
    {
      path: '*',
      redirect: '/p404'
    }
  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  let login = to.matched.some(record => record.meta.login)

  if (requiresAuth && !currentUser) next('login')
  else if (currentUser && !requiresAuth && !login) next()
  else next()
})

export default router
