<template>
  <div class="verificarEmail">
    <div class="container">
      <div class="row justify-content-center">
        <ring-loader :loading="loader.loading" :color="loader.color" :size="loader.size"></ring-loader>
        <div class="col-sm-12">

          <alert :showAlert="alert.showAlert" :dismissible="alert.dismissible" :type="alert.type" :title="alert.title" :msg="alert.msg"></alert>

          <form id="changeEmail" class="hideOn needs-validation" v-on:submit.prevent novalidate>
            <fieldset class="form-group">
              <label for="emailResend">Novo E-mail</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="emailPrepend"><i class="fas fa-envelope"></i></span>
                </div>
                <input id="email" type="email" class="form-control" placeholder="Digite um E-mail válido" autocomplete="email" aria-describedby="emailPrepend" v-model = "user.newEmail" required>
                <div class="invalid-feedback">
                  Por favor informe um E-mail válido (exemplo@exemplo.com).
                </div>
              </div>
            </fieldset>
            <button  class="btn btn-primary btn-block" v-on:click="validate">Alterar E-mail</button>
          </form>

          <hr />

          <button name="resendEmail" type="button" class="btn btn-primary btn-block" v-on:click="resendEmail">Reenviar E-mail</button>
          <button name="resendEmail" type="button" class="btn btn-primary btn-block" v-on:click="showForm">Alterar E-mail</button>
          <router-link to="/home" id="homeBtn" class="btn btn-dark btn-block hideOn">Ir para Home</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import Alert from './utility/Alert.vue'
import firebaseApp from '../firebase-controller.js'
const auth = firebaseApp.auth()
export default {
  name: 'verificarEmail',
  data () {
    return {
      user: {
        email: auth.currentUser.email,
        newEmail: ''
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
      console.log('E-mail verificado!')
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
        console.log('E-mail de verificação reenviado com sucesso!')
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
    showForm () {
      var form = document.getElementById('changeEmail')
      form.classList.remove('hideOn')
      let btn = document.getElementsByName('resendEmail')
      for (let i = 0; i < btn.length; i++) {
        btn[i].classList.add('hideOn')
      }
      this.alert.showAlert = false
    },
    changeEmail () {
      let btn = document.getElementsByName('resendEmail')
      for (let i = 0; i < btn.length; i++) {
        btn[i].classList.add('hideOn')
      }
      this.alert.showAlert = false
      this.loader.loading = true
      let _this = this
      auth.currentUser.updateEmail(this.user.newEmail).then(function () {
        _this.user.email = _this.user.newEmail
        console.log('E-mail alterado com sucesso!')
        _this.resendEmail()
      }).catch((err) => {
        var forms = document.getElementsByClassName('needs-validation')
        switch (err.code) {
          case 'auth/email-already-in-use': {
            this.$notify({
              group: 'notify',
              type: 'error',
              title: 'Oops!',
              text: 'Endereço de E-mail já está em uso'
            })
            this.loader.loading = false
            Array.prototype.filter.call(forms, function (form) {
              form.classList.remove('hideOn')
            })
            break
          }
          case 'auth/requires-recent-login': {
            this.$notify({
              group: 'notify',
              type: 'error',
              title: 'Oops!',
              text: 'Operação sensível, necessário confirmar informações de login'
            })
            this.loader.loading = false
            Array.prototype.filter.call(forms, function (form) {
              form.classList.remove('hideOn')
            })
            break
          }
          case 'auth/user-token-expired': {
            this.$notify({
              group: 'notify',
              type: 'error',
              title: 'Oops!',
              text: 'Sua sessão expirou! Por favor, logue novamente'
            })
            this.loader.loading = false
            Array.prototype.filter.call(forms, function (form) {
              form.classList.remove('hideOn')
            })
            break
          }
          case 'auth/invalid-email': {
            this.$notify({
              group: 'notify',
              type: 'error',
              title: 'Oops!',
              text: 'Endereço de E-mail informado é inválido'
            })
            this.loader.loading = false
            Array.prototype.filter.call(forms, function (form) {
              form.classList.remove('hideOn')
            })
            break
          }
          default: {
            this.$notify({
              group: 'notify',
              type: 'error',
              title: 'Oops!',
              text: 'Parece que algo deu errado.<br>Por favor, tente novamente'
            })
            break
          }
        }
        console.log(err.code)
      })
    },
    validate: function () {
      let _this = this
      var forms = document.getElementsByClassName('needs-validation')
      Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
          if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
          } else {
            form.classList.remove('hideOn')
            _this.changeEmail()
            form.classList.add('hideOn')
          }
          form.classList.add('was-validated')
        }, false)
      })
    }
  }
}
</script>

<style>
</style>
