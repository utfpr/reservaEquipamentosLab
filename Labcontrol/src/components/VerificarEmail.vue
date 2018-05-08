<template>
  <div class="verificarEmail">
    <div class="container">
      <div class="row justify-content-center">
        <ring-loader :loading="loader.loading" :color="loader.color" :size="loader.size"></ring-loader>
        <div class="col-sm-12">
          <alert :showAlert="alert.showAlert" :dismissible="alert.dismissible" :type="alert.type" :title="alert.title" :msg="alert.msg"></alert>
          
          <hr />

          <button name="resendEmail" type="button" class="btn btn-primary btn-block" v-on:click="resendEmail">Reenviar E-mail</button>
          <button name="resendEmail" type="button" class="btn btn-primary btn-block" v-on:click="changeEmail">Alterar E-mail</button>
          <router-link to="/home" id="homeBtn" class="btn btn-dark btn-block hideOn">Ir para Home</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import Alert from './Alert.vue'
import firebaseApp from '../firebase-controller.js'
const auth = firebaseApp.auth()
export default {
  name: 'verificarEmail',
  data () {
    return {
      user: {
        email: auth.currentUser.email
      },
      loader: {
        loading: false,
        color: '#007bff',
        size: '100px'
      },
      alert: {
        showAlert: false,
        dismissible: false,
        type: '',
        title: '',
        msg: ''
      }
    }
  },
  components: {
    Alert,
    RingLoader
  },
  mounted: function () {
    if (auth.currentUser.emailVerified) {
      let home = document.getElementById('homeBtn')
      let btn = document.getElementsByName('resendEmail')
      for (let i = 0; i < btn.length; i++) {
        btn[i].classList.add('hideOn')
      }
      home.classList.remove('hideOn')
      this.alert.type = 'alert-success'
      this.alert.dismissible = false
      this.alert.title = 'E-mail confirmado com sucesso!'
      this.alert.msg = 'Você pode utilizar o sistema de reservas normalmente!'
      this.alert.showAlert = true
      console.log('E-mail está verificado!')
    } else {
      this.alert.type = 'alert-warning'
      this.alert.dismissible = false
      this.alert.title = 'Confirme seu E-mail!'
      this.alert.msg = 'Para utilizar o sistema abra o link de verificação de conta enviado para o E-mail ' + this.user.email + '. Caso o E-mail não apareça em sua caixa de entrada verifique a pasta de Spam. '
      this.alert.showAlert = true
      console.log('E-mail não verificado!')
    }
  },
  methods: {
    resendEmail: function () {
      let btn = document.getElementsByName('resendEmail')
      for (let i = 0; i < btn.length; i++) {
        btn[i].classList.add('hideOn')
      }

      this.loader.loading = true
      this.alert.showAlert = false

      let _this = this
      auth.currentUser.sendEmailVerification().then(function () {
        _this.alert.type = 'alert-success'
        _this.alert.dismissible = false
        _this.alert.title = 'Yey!'
        _this.alert.msg = 'Um E-mail de verificação de conta foi enviado para o endereço ' + _this.user.email + '. Caso o E-mail não apareça em sua caixa de entrada verifique a pasta de Spam. '
        _this.loader.loading = false
        _this.alert.showAlert = true
        for (let i = 0; i < btn.length; i++) {
          btn[i].classList.remove('hideOn')
        }
        console.log('E-mail de verificação reenciado com sucesso!')
      }).catch((err) => {
        _this.alert.type = 'alert-danger'
        _this.alert.dismissible = true
        _this.alert.title = 'Oops!'
        _this.alert.msg = 'Falha ao enviar E-mail de verificação de conta para o endereço ' + _this.user.email + '. Verifique sua conexão com a internet ou tente novamente mais tarde.'
        _this.loader.loading = false
        _this.alert.showAlert = true
        for (let i = 0; i < btn.length; i++) {
          btn[i].classList.remove('hideOn')
        }
        console.log('Falha ao enviar E-mail de verificação de conta: ' + err)
      })
    },
    changeEmail: function () {
      console.log('mudar email')
    }
  }
}
</script>

<style>
</style>
