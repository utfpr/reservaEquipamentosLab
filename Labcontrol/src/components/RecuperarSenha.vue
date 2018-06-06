<template>
  <div id="RecuperarSenha">
    <div class="container">
      <div class="row justify-content-center text-center">
        <h2> Recupere sua senha </h2>
      </div>
      <hr />
      <div class="row justify-content-center">
        <ring-loader :loading="loader.loading" :color="loader.color" :size="loader.size"></ring-loader>
        <alert :showAlert="alert.showAlert" :dismissible="alert.dismissible" :type="alert.type" :title="alert.title" :msg="alert.msg"></alert>
        <form id="recuperarForm" class="needs-validation" novalidate>
          <div class="form-row">
            <div class="col-12 mb-3">
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
            <div class="col-12 mb-3">
              <button type="submit" class="btn btn-primary btn-block" v-on:click="validate">Enviar E-mail de recuperação</button>
            </div>
          </div>
        </form>
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
  methods: {
    sendResetMail: function () {
      this.loader.loading = true
      let _this = this
      var email = this.emailForReset
      let form = document.getElementById('recuperarForm')
      form.classList.add('hideOn')
      auth.sendPasswordResetEmail(email).then(function () {
        _this.alert.showAlert = true
        _this.alert.dismissible = false
        _this.alert.type = 'alert-success'
        _this.alert.title = 'Solicitação enviada com successo!'
        _this.alert.msg = ' Caso o E-mail ' + _this.emailForReset + ' esteja cadastrado na plataforma, você receberá um E-mail para a redefinição de senha. Caso o E-mail não apareça em sua caixa de entrada verifique a pasta de Spam'
      }).catch((err) => {
        form.classList.remove('hideOn')
        _this.alert.showAlert = true
        _this.alert.dismissible = true
        _this.alert.type = 'alert-danger'
        _this.alert.title = 'Oops!'
        _this.alert.msg = 'Falha ao enviar E-mail de recuperação para ' + _this.emailForReset + ', por favor tente novamente mais tarde.'
        console.log('Erro ao tentar enviar E-mail de recuperação: ' + err.code)
      })
      this.loader.loading = false
    },
    checkEmail: function () {
      var email = this.emailForReset

      let form = document.getElementById('recuperarForm')
      form.classList.add('hideOn')

      this.loader.loading = true

      let _this = this

      auth.fetchProvidersForEmail(email).then(function (providers) {
        if (providers.length !== 0) {
          _this.sendResetMail()
        } else {
          form.classList.remove('hideOn')
          _this.alert.dismissible = true
          _this.alert.showAlert = true
          _this.alert.type = 'alert-danger'
          _this.alert.title = 'Oops!'
          _this.alert.msg = ' O E-mail ' + _this.emailForReset + ' não se encontra cadastrado em nosso sistema.'
        }
      }).catch((err) => {
        form.classList.remove('hideOn')
        _this.alert.showAlert = false
        _this.alert.dismissible = true
        _this.alert.type = 'alert-danger'
        _this.alert.title = 'Oops!'
        _this.alert.msg = 'Falha na comunicação com o servidor, verifique sua conexão com a internet ou tente novamente mais tarde.'
        console.log('Erro ao tentar vereficar E-mail: ' + err.code)
      })
      _this.loader.loading = false
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
