import Vue from 'vue'
import Router from 'vue-router'
import firebaseApp from '../firebase-controller.js'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import p404 from '@/pages/p404'
import Perfil from '@/pages/perfil/Perfil.vue'
import Equipamentos from '@/pages/equipamentos/Equipamentos'
import ReservaDetails from '@/pages/reservas/ReservaDetails'
import Locais from '@/pages/locais/Locais'
import LocalCadastro from '@/pages/locais/LocalCadastro'
import LocalDetails from '@/pages/locais/LocalDetails'
import Reservas from '@/pages/reservas/Reservas'
import listaEquipamentos from '@/pages/reservas/ListaEquipamentos'
import listaLocais from '@/pages/reservas/ListaLocais'
import itemReserva from '@/pages/reservas/itemReserva'
import novaReserva from '@/pages/reservas/novaReserva'
import ReservaCadastro from '@/pages/reservas/ReservaCadastro'
import Cadastro from '@/pages/Cadastro'
import VerificarEmail from '@/pages/VerificarEmail'
import actionHandler from '@/components/actionHandler'
import RecuperarSenha from '@/pages/RecuperarSenha'
import Calendario from '@/components/Calendar-event'
import Aulas from '@/pages/aulas/Aulas'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    }, {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        menuKey: 'home',
        requiresAuth: true
      }
    }, {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        menuKey: '',
        login: true
      }
    }, {
      path: '/aulas',
      name: 'Aulas',
      component: Aulas,
      meta: {
        menuKey: 'aulas',
        requiresAuth: true
      }
    }, {
      path: '/perfil',
      name: 'Perfil',
      component: Perfil,
      meta: {
        menuKey: '',
        requiresAuth: true
      }
    }, {
      path: '/equipamentos',
      name: 'Equipamentos',
      component: Equipamentos,
      meta: {
        menuKey: 'equipamentos',
        requiresAuth: true
      }
    }, {
      path: '/reservas/equipamentos/:key/:action',
      name: 'ReservaDetails',
      component: ReservaDetails,
      meta: {
        menuKey: 'equipamentos',
        requiresAuth: true
      }
    }, {
      path: '/cadastro',
      name: 'Cadastro',
      component: Cadastro,
      meta: {
        menuKey: '',
        requiresAuth: false,
        cadastro: true
      }
    }, {
      path: '/verificar-email',
      name: 'VerificarEmail',
      component: VerificarEmail,
      meta: {
        menuKey: '',
        requiresAuth: true
      }
    }, {
      path: '/actionHandler',
      name: 'actionHandler',
      component: actionHandler,
      meta: {
        menuKey: '',
        requiresAuth: false
      }
    }, {
      path: '/RecuperarSenha',
      name: 'RecuperarSenha',
      component: RecuperarSenha,
      meta: {
        menuKey: '',
        requiresAuth: false
      }
    }, {
      path: '/locais',
      name: 'Locais',
      component: Locais,
      meta: {
        menuKey: 'locais',
        requiresAuth: true
      }
    }, {
      path: '/locais/cadastro',
      name: 'LocalCadastro',
      component: LocalCadastro,
      meta: {
        menuKey: 'locais',
        requiresAuth: true
      }
    }, {
      path: '/locais/:key/:action',
      name: 'LocalDetails',
      component: LocalDetails,
      meta: {
        menuKey: 'locais',
        requiresAuth: true
      }
    }, {
      path: '/reservas',
      name: 'Reservas',
      component: Reservas,
      meta: {
        menuKey: 'reservas',
        requiresAuth: true
      }
    }, {
      path: '/calendario',
      name: 'Calendario',
      component: Calendario,
      meta: {
        menuKey: 'home',
        requiresAuth: false
      }
    }, {
      path: '/reservar',
      component: novaReserva,
      meta: {
        menuKey: 'reservas',
        requiresAuth: true
      },
      children: [{
        path: '',
        name: 'itemReserva',
        component: itemReserva,
        meta: {
          menuKey: 'reservas',
          requiresAuth: true
        }
      }, {
        path: 'equipamento',
        name: 'ListaEquipamentos',
        component: listaEquipamentos,
        meta: {
          menuKey: 'reservas',
          requiresAuth: true
        }
      }, {
        path: 'laboratorio',
        name: 'listaLocais',
        component: listaLocais,
        meta: {
          menuKey: 'reservas',
          requiresAuth: true
        }
      }, {
        path: ':objetoReserva/:itemReserva',
        name: 'periodoReserva',
        component: ReservaCadastro,
        meta: {
          menuKey: 'reservas',
          requiresAuth: true
        }
      }]
    }, {
      path: '/reservas/cadastro',
      name: 'Cadastro de reservas',
      component: ReservaCadastro,
      meta: {
        menuKey: 'reservas',
        requiresAuth: true
      }
    }, {
      path: '/p404',
      name: 'p404',
      component: p404,
      meta: {
        menuKey: ''
      }
    }, {
      path: '*',
      redirect: '/'
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
      else if ((!requiresAuth && login) || (!requiresAuth && cadastro)) next('home')
      else if (!requiresAuth && !login) next()
      else next()
    } else {
      if (requiresAuth) next('login')
      else next()
    }
  })
})

export default router
