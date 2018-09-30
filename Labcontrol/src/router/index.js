import Vue from 'vue'
import Router from 'vue-router'
import firebaseApp from '../firebase-controller.js'
import Home from '@/components/Home'
import Login from '@/components/Login'
import p404 from '@/components/p404'
import Perfil from '@/components/perfil/Perfil.vue'
import Equipamentos from '@/components/equipamentos/Equipamentos'
import EquipamentoCadastro from '@/components/equipamentos/EquipamentoCadastro'
import EquipamentoDetails from '@/components/equipamentos/EquipamentoDetails'
import ReservaDetails from '@/components/reservas/ReservaDetails'
import Locais from '@/components/locais/Locais'
import LocalCadastro from '@/components/locais/LocalCadastro'
import LocalDetails from '@/components/locais/LocalDetails'
import Reservas from '@/components/reservas/Reservas'
import listaEquipamentos from '@/components/reservas/ListaEquipamentos'
import listaLocais from '@/components/reservas/ListaLocais'
import itemReserva from '@/components/reservas/itemReserva'
import novaReserva from '@/components/reservas/novaReserva'
import ReservaCadastro from '@/components/reservas/ReservaCadastro'
import Cadastro from '@/components/Cadastro'
import VerificarEmail from '@/components/VerificarEmail'
import actionHandler from '@/components/actionHandler'
import RecuperarSenha from '@/components/RecuperarSenha'
import Calendario from '@/components/Calendar-event'
import Aulas from '@/components/aulas/Aulas'

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
      path: '/aulas',
      name: 'Aulas',
      component: Aulas,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/perfil',
      name: 'Perfil',
      component: Perfil,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/equipamentos',
      name: 'Equipamentos',
      component: Equipamentos,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/equipamentos/cadastro',
      name: 'EquipamentoCadastro',
      component: EquipamentoCadastro,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/equipamentos/:key/:action',
      name: 'EquipamentoDetails',
      component: EquipamentoDetails,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/reservas/equipamentos/:key/:action',
      name: 'ReservaDetails',
      component: ReservaDetails,
      meta: {
        requiresAuth: true
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
      path: '/actionHandler',
      name: 'actionHandler',
      component: actionHandler,
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
      path: '/locais',
      name: 'Locais',
      component: Locais,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/locais/cadastro',
      name: 'LocalCadastro',
      component: LocalCadastro,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/locais/:key/:action',
      name: 'LocalDetails',
      component: LocalDetails,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/reservas',
      name: 'Reservas',
      component: Reservas,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/calendario',
      name: 'Calendario',
      component: Calendario,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/reservar',
      component: novaReserva,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: 'itemReserva',
          component: itemReserva,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'equipamento',
          name: 'ListaEquipamentos',
          component: listaEquipamentos,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'laboratorio',
          name: 'listaLocais',
          component: listaLocais,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: ':objetoReserva/:itemReserva',
          name: 'periodoReserva',
          component: ReservaCadastro,
          meta: {
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: '/reservas/cadastro',
      name: 'Cadastro de reservas',
      component: ReservaCadastro,
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
