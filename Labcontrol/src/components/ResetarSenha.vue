<template>
  <div id="ResetarSenha">
    <div class="container">
      <div class="row justify-content-center text-center">
        <h2> Insira uma nova senha </h2>
      </div>
      <hr />
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>Oops!</strong> Algo deu errado na comunicação com o servidor. Verifique sua conexão com a internet ou tente mais tarde.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="row justify-content-center">
        <form id="cadastroForm" class="needs-validation" novalidate>
          <div class="form-row">
            <div class="col-md-6 mb-3">
              <label for="passwordReset">Nova senha</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="passwordResetPrepend"><i class="fas fa-lock"></i></span>
                </div>
                <input id="passwordReset" type="password" class="form-control"  placeholder="Digite sua senha" aria-describedby="passwordResetPrepend"  v-model = "passwordForReset" required>
                <div class="invalid-feedback">
                  Por favor informe uma senha.
                </div>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <label for="passwordResetAgain">Repita a nova senha</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="passwordResetAgainPrepend"><i class="fas fa-lock"></i></span>
                </div>
                <input id="passwordResetAgain" type="password" class="form-control"  placeholder="Digite sua senha novamente" aria-describedby="passwordResetAgainPrepend"  v-model = "passwordForReset" required>
                <div class="invalid-feedback">
                  Por favor informe uma senha.
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
      </div>
    </div>
  </div>
</template>

<script>
import firebaseApp from '../firebase-controller.js'
const auth = firebaseApp.auth()
export default {
  name: 'resetarSenha',
  data () {
    return {
      passwordForReset: ''
    }
  },
  methods: {
    checkEmail: function () {
      // let _this = this
      var email = this.passwordForReset
      auth.fetchProvidersForEmail(email).then(function (providers) {
        console.log('Email providers: ' + providers)
      }).catch((err) => {
        console.log('Erro ao tentar recuperar senha: ' + err.message)
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

#cadastroForm {
  width: 100vw;
}
</style>
