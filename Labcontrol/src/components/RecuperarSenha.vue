<template>
  <div id="RecuperarSenha">
    <div class="container">
      <div class="row justify-content-center text-center">
        <h2> Recupere sua senha </h2>
      </div>
      <hr />
      <alert :showAlert="alert.showAlert" :dismissible="alert.dismissible" :type="alert.type" :title="alert.title" :msg="alert.msg"></alert>
      <div class="row justify-content-center">
        <ring-loader :loading="loader.loading" :color="loader.color" :size="loader.size"></ring-loader>
        <form id="recuperarForm" class="needs-validation" novalidate>
          <div class="form-row">
            <div class="col-md-6 mb-3">
              <label for="emailReset">E-mail</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="emailResetPrepend"><i class="fas fa-envelope"></i></span>
                </div>
                <input id="emailReset" type="email" class="form-control"  placeholder="E-mail" aria-describedby="emailResetPrepend"  v-model = "emailForReset" required>
                <div class="invalid-feedback">
                  Por favor informe um E-mail válido.
                </div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="col-md-6 mb-3">
              <button type="submit" class="btn btn-primary btn-block" v-on:click="validate">Enviar E-mail de recuperação</button>
            </div>
          </div>
        </form>
        <alert :showAlert="alertSuccess.showAlert" :type="alertSuccess.type" :title="alertSuccess.title" :msg="alertSuccess.msg"></alert>
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
  name: 'recuperarSenha',
  data () {
    return {
      emailForReset: '',
      loader: {
        loading: false,
        color: '#007bff',
        size: '100px'
      },
      alert: {
        showAlert: false,
        dismissible: true,
        type: '',
        title: '',
        msg: ''
      },
      alertSuccess: {
        showAlert: false,
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
  methods: {
    showError: function () {
      this.alertSuccess.showAlert = false
      this.alert.showAlert = true
      this.alert.type = 'alert-danger'
      this.alert.title = 'Oops!'
      this.alert.msg = 'Algo deu errado na comunicação com o servidor. Verifique sua conexão com a internet ou tente mais tarde.'
    },
    sendResetMail: function () {
      let _this = this
      var email = this.emailForReset
      auth.sendPasswordResetEmail(email).then(function () {
        let form = document.getElementById('recuperarForm')
        form.classList.add('hideOn')
        _this.alert.showAlert = false
        _this.alertSuccess.showAlert = true
        _this.alertSuccess.type = 'alert-success'
        _this.alertSuccess.title = 'Solicitação enviada com successo!'
        _this.alertSuccess.msg = ' Caso o E-mail ' + _this.emailForReset + ' esteja cadastrado na plataforma, você receberá um E-mail para a redefinição de senha. Caso o E-mail não apareça em sua caixa de entrada verifique a pasta de Spam'
      }).catch((err) => {
        this.showError()
        console.log('Erro ao tentar enviar E-mail de recuperação: ' + err)
      })
    },
    checkEmail: function () {
      var email = this.emailForReset

      let form = document.getElementById('recuperarForm')
      form.classList.add('hideOn')

      this.loader.loading = true

      let _this = this

      auth.fetchProvidersForEmail(email).then(function (providers) {
        _this.sendResetMail()
        console.log('Email providers: ' + providers)
      }).catch((err) => {
        form.classList.remove('hideOn')
        this.showError()
        console.log('Erro ao tentar vereficar E-mail: ' + err)
      })

      setTimeout(function () {
        _this.loader.loading = false
      }, 50000)
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
            _this.checkEmail()
          }
          form.classList.add('was-validated')
        }, false)
      })
    }
  }
}
</script>

<style>

#recuperarForm {
  width: 100vw;
}
</style>
