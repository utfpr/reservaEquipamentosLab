import Vue from 'vue'
import VueResource from 'vue-resource'
import router from './router'
import App from './App'
import VueProgressBar from 'vue-progressbar'
import Notifications from 'vue-notification'
import firebaseApp from './firebase-controller.js'
import VModal from 'vue-js-modal'
import vueEventCalendar from 'vue-event-calendar'
import 'vue-event-calendar/dist/style.css'
import 'bootstrap'

import './design'

const moment = require('moment')
require('moment/locale/pt-br')

Vue.use(require('vue-moment'), {moment})

Vue.use(vueEventCalendar, {locale: 'pt-br'})
Vue.use(Notifications)
Vue.use(VueResource)
Vue.use(VModal, { dialog: true })

Vue.config.productionTip = false

var app

const options = {
  color: '#0042b1',
  failedColor: '#BA2121',
  thickness: '7px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}

Vue.use(VueProgressBar, options)

firebaseApp.auth().onAuthStateChanged(function (user) {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      data: {toggled: false},
      template: '<App/>',
      components: { App }
    })
  }
})
