<template>
  <div v-if="action === 'resetPassword'" id="ResetarSenha">
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
  <div v-else id="checkEmail">
    <div class="container">
      <div v-if="action === 'verifyEmail'" class="row justify-content-center text-center">
        <h2> Verificação de E-mail </h2>
      </div>
      <hr />
      <div class="row justify-content-center">
        <alert :showAlert="alert.showAlert" :dismissible="alert.dismissible" :type="alert.type" :title="alert.title" :msg="alert.msg"></alert>
        <span v-if="validCode" v-on:click="refresh()" id="homeBtn" class="mt-5 btn btn-dark btn-block">Ir para Home</span>
      </div>
    </div>
  </div>
</template>

<script>
import Alert from './utility/Alert.vue'
import firebaseApp from '../firebase-controller.js'
const auth = firebaseApp.auth()
export default {
  name: 'actionHandler',
  data () {
    return {
      validCode: false,
      password: '',
      reenteredPassword: '',
      action: this.$route.query.mode,
      code: this.$route.query.oobCode,
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
    if (this.$route.query.mode === 'resetPassword') {
      if (this.$route.query.oobCode) {
        auth.verifyPasswordResetCode(this.$route.query.oobCode).then(function () {
          _this.validCode = true
        }).catch((err) => {
          _this.validCode = false
          _this.alert.showAlert = true
          _this.alert.type = 'alert-danger'
          _this.alert.title = 'Oops!'
          _this.alert.msg = 'O código de redefinição de senha é inválido, já foi ultizado ou está expirado.'
          console.log('Erro ao validar código: ' + err)
        })
      } else {
        _this.alert.showAlert = true
        _this.alert.type = 'alert-danger'
        _this.alert.title = 'Oops!'
        _this.alert.msg = 'Nenhum código de redefinição encontrado, certifique-se de não ter alterado o link de redefinição de senha.'
      }
    } else if (this.$route.query.mode === 'verifyEmail') {
      if (this.$route.query.oobCode) {
        auth.checkActionCode(this.$route.query.oobCode).then(function () {
          auth.applyActionCode(_this.$route.query.oobCode).then(function () {
            _this.validCode = true
            _this.alert.showAlert = true
            _this.alert.type = 'alert-success'
            _this.alert.title = 'E-mail confirmado com sucesso!'
            _this.alert.msg = 'Você já utilizar o sistema normalmente. Caso encontre algum problema atualize a página.'
          }).catch((err) => {
            _this.validCode = false
            _this.alert.showAlert = true
            _this.alert.type = 'alert-danger'
            _this.alert.title = 'Oops!'
            _this.alert.msg = 'Falha ao tentar verificar endereço de E-mail.'
            console.log('Erro ao aplicar código: ' + err)
          })
        }).catch((err) => {
          _this.alert.showAlert = true
          _this.alert.type = 'alert-danger'
          _this.alert.title = 'Oops!'
          _this.alert.msg = 'O código de validação de E-mail é inválido, já foi ultizado ou está expirado.'
          console.log('Erro ao validar código: ' + err)
        })
      } else {
        _this.alert.showAlert = true
        _this.alert.type = 'alert-danger'
        _this.alert.title = 'Oops!'
        _this.alert.msg = 'Nenhum validação de E-mail encontrado, certifique-se de não ter alterado o link de validação recebido.'
      }
    } else {
      _this.alert.showAlert = true
      _this.alert.type = 'alert-danger'
      _this.alert.title = 'Oops!'
      _this.alert.msg = 'Nenhum código de ação encontrado, certifique-se de não ter alterado o link recebido no E-mail.'
    }
  },
  mounted: function () {
    this.validate()
  },
  methods: {
    resetPassword () {
      var form = document.getElementById('resetForm')
      let _this = this
      auth.confirmPasswordReset(this.code, this.password).then(function () {
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
    },
    refresh () {
      this.$router.replace('/home')
      location.reload()
    }
  }
}
</script>

<style>

#resetForm {
  width: 100vw;
}
</style>
