<template>
  <div id="ResetarSenha">
    <div class="container">
      <div class="row justify-content-center text-center">
        <h2> Redefinir Senha </h2>
      </div>
      <hr />
      <div class="row justify-content-center">
        <alert :showAlert="alert.showAlert" :dismissible="alert.dismissible" :type="alert.type" :title="alert.title" :msg="alert.msg"></alert>
        <form v-if="validCode" id="resetForm" class="needs-validation" v-on:submit.prevent novalidate>
          <div class="form-row">
            <div class="col-md-6 mb-3">
              <label for="senha">Senha</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="senhaPrepend"><i class="fas fa-lock"></i></span>
                </div>
                <input id="senha" v-on:keyup="validatePassword" type="password" class="form-control" autocomplete="new-password" placeholder="Digite sua senha (Min. 6 caracteres)" aria-describedby="senhaPrepend" minlength=6 v-model = "password" required>
                <div class="invalid-feedback">
                  Por favor informe uma senha válida (Mínimo de 6 caracteres).
                </div>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <label for="senhaConfirma">Confirme sua senha</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="senhaConfirmaPrepend"><i class="fas fa-lock"></i></span>
                </div>
                <input id="senhaConfirma" v-on:keyup="validatePassword" type="password" class="form-control" autocomplete="new-password" placeholder="Digite sua senha novamente" aria-describedby="senhaConfirmaPrepend" v-model = "reenteredPassword" required>
                <div class="invalid-feedback">
                  As senhas diferem.
                </div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="col-12 mb-3">
              <button type="submit" v-on:click="validate" class="btn btn-primary btn-block">Redefinir senha</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Alert from './utility/Alert.vue'
import firebaseApp from '../firebase-controller.js'
const auth = firebaseApp.auth()
export default {
  name: 'resetarSenha',
  data () {
    return {
      validCode: false,
      password: '',
      reenteredPassword: '',
      resetCode: this.$route.query.oobCode,
      alert: {
        showAlert: false,
        type: '',
        title: '',
        msg: ''
      }
    }
  },
  components: {
    Alert
  },
  created: function () {
    let _this = this
    if (this.$route.query.oobCode) {
      auth.checkActionCode(this.$route.query.oobCode).then(function () {
        _this.validCode = true
      }).catch((err) => {
        _this.validCode = false
        _this.alert.showAlert = true
        _this.alert.type = 'alert-danger'
        _this.alert.title = 'Oops!'
        _this.alert.msg = 'O código de redefinição de senha é inválido, já foi ultizado ou está expirado.'
        console.log('Erro ao tentar enviar E-mail de recuperação: ' + err.code)
      })
    } else {
      _this.alert.showAlert = true
      _this.alert.type = 'alert-danger'
      _this.alert.title = 'Oops!'
      _this.alert.msg = 'Nenhum código de redefinição encontrado, certifique-se de não ter alterado o link de redefinição de senha.'
    }
  },
  mounted: function () {
    this.validate()
  },
  methods: {
    resetPassword () {
      var form = document.getElementById('resetForm')
      let _this = this
      auth.confirmPasswordReset(this.resetCode, this.password).then(function () {
        form.classList.add('hideOn')
        _this.alert.showAlert = true
        _this.alert.type = 'alert-success'
        _this.alert.title = 'Senha redefinida com sucesso!'
        _this.alert.msg = 'Você já pode logar no sistema com sua nova senha!'
      }).catch((err) => {
        form.classList.add('hideOn')
        _this.alert.showAlert = true
        _this.alert.type = 'alert-danger'
        _this.alert.title = 'Oops!'
        _this.alert.msg = 'Algo deu errado ao tentar redefinir a senha. Na página de Login clique em "Esqueci minha senha" para tentar novamente.'
        console.log('Falha ao redefinir senha. Erro: ' + err.code)
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
            _this.resetPassword()
          }
          form.classList.add('was-validated')
        }, false)
      })
    },
    validatePassword: function () {
      var confirmPassword = document.getElementById('senhaConfirma')
      if (this.password === this.reenteredPassword) {
        confirmPassword.setCustomValidity('')
      } else {
        confirmPassword.setCustomValidity('As senhas diferem')
      }
    }
  }
}
</script>

<style>

#resetForm {
  width: 100vw;
}
</style>
