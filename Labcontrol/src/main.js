// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import router from './router'
import App from './App'
import VueProgressBar from 'vue-progressbar'
import 'bootstrap'

Vue.use(VueResource)
Vue.config.productionTip = false

const options = {
  color: '#0042b1',
  failedColor: '#BA2121',
  thickness: '7px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 400
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}

Vue.use(VueProgressBar, options)

// Vue.mixin({
//   data () {
//     return {
//       loading: false,
//       color: '#0042b1',
//       size: '30px'
//     }
//   },
//   mounted: function () {
//     this.loading = false
//   }
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
