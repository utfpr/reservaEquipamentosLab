import Vue from 'vue'
import Router from 'vue-router'
import firebaseApp from '../firebase-controller.js'
import Home from '@/components/Home'
import Login from '@/components/Login'
import p404 from '@/components/p404'
import Equipamento from '@/components/Equipamento'
import Local from '@/components/Local'
import Cadastro from '@/components/Cadastro'
import VerificarEmail from '@/components/VerificarEmail'
import ResetarSenha from '@/components/ResetarSenha'
import RecuperarSenha from '@/components/RecuperarSenha'

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
      component: Login,
      meta: {
        login: true
      }
    },
    {
      path: '/equipamento',
      name: 'Equipamento',
      component: Equipamento,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/cadastro',
      name: 'Cadastro',
      component: Cadastro,
      meta: {
        requiresAuth: false,
        cadastro: true
      }
    },
    {
      path: '/verificar-email',
      name: 'VerificarEmail',
      component: VerificarEmail,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/ResetarSenha/:code',
      name: 'ResetarSenha',
      component: ResetarSenha,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/RecuperarSenha',
      name: 'RecuperarSenha',
      component: RecuperarSenha,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/local',
      name: 'Local',
      component: Local,
      meta: {
        requiresAuth: false
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
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  let login = to.matched.some(record => record.meta.login)
  let cadastro = to.matched.some(record => record.meta.cadastro)

  firebaseApp.auth().onAuthStateChanged(function (user) {
    if (user) {
      if (!user.emailVerified && cadastro) next('verificar-email')
      else if (!requiresAuth && login) next('home')
      else if (!requiresAuth && !login) next()
      else next()
    } else {
      if (requiresAuth) next('login')
      else next()
    }
  })
})

export default router
