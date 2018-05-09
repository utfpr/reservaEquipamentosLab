// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import router from './router'
import App from './App'
import VueProgressBar from 'vue-progressbar'
import Notifications from 'vue-notification'
import VueFire from 'vuefire'
import VueValidator from 'vue-validator'
import Validate from 'v-validate'
import firebaseApp from './firebase-controller.js'
import 'bootstrap'

Vue.use(Notifications)
Vue.use(VueFire)
Vue.use(VueResource)
Vue.use(VueValidator)
Vue.use(Validate)

Vue.config.productionTip = false

let app

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
