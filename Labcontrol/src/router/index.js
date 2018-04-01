import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import Home from '@/components/Home'
import Login from '@/components/Login'
import p404 from '@/components/p404'
import Cadastro from '@/components/Cadastro'

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
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/cadastro',
      name: 'Cadastro',
      component: Cadastro,
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

  if (requiresAuth && !currentUser) next('login')
  else if (currentUser && !requiresAuth) next('home')
  else next()
})

export default router
