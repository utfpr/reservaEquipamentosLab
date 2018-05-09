<template>
<div id="cadastroUser">
  <div class="container-fluid">
    <div class="row justify-content-center text-center">
      <h2> Crie sua conta no LabControl! </h2>
    </div>
    <hr />
    <div class="row justify-content-center">
      <ring-loader :loading="loader.loading" :color="loader.color" :size="loader.size"></ring-loader>
      <alert :showAlert="alert.showAlert" :dismissible="alert.dismissible" :type="alert.type" :title="alert.title" :msg="alert.msg"></alert>
      <form id="cadastroForm" class="needs-validation" v-on:submit.prevent novalidate>
        <div class="form-row">
          <div class="col-md-6 mb-3">
            <label for="nome">Nome</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="nomePrepend"><i class="fas fa-user"></i></span>
              </div>
              <input id="nome" type="text" class="form-control" placeholder="Digite seu nome" autocomplete="given-name" aria-describedby="nomePrepend" v-model = "newUser.firstName" required>
              <div class="invalid-feedback">
                Por favor informe seu nome.
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <label for="sobrenome">Sobrenome</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="sobrenomePrepend"><i class="fas fa-user"></i></span>
              </div>
              <input id="sobrenome" type="text" class="form-control" placeholder="Digite seu sobrenome" autocomplete="family-name" aria-describedby="sobrenomePrepend" v-model = "newUser.lastName" required>
              <div class="invalid-feedback">
                Por favor informe seu sobrenome.
              </div>
            </div>
          </div>
        </div>
        <div class="form-row">
          <!-- <div class="col-md-6 mb-3">
            <label for="telefone">Telefone</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="telefonePrepend"><i class="fas fa-phone"></i></span>
              </div>
              <input id="telefone" type="tel" class="form-control" placeholder="Digite seu telefone com DDD (opcional)" autocomplete="tel-national" aria-describedby="telefonePrepend" v-mask="['(##) ####-####', '(##) #####-####']" v-model = "newUser.telefone">
            </div>
          </div> -->
          <div class="col-md-6 mb-3">
            <label for="ra">Registro Academico</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="raPrepend"><i class="fas fa-address-card"></i></span>
              </div>
              <input id="ra" type="number" class="form-control" placeholder="Digite seu RA" autocomplete="RA" aria-describedby="raPrepend" min="0" v-model = "newUser.ra" required>
              <div class="invalid-feedback">
                Por favor informe um RA.
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <label for="curso">Curso</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="cursoPrepend"><i class="fas fa-graduation-cap"></i></span>
              </div>
              <select id="curso" class="form-control" aria-describedby="cursoPrepend" v-model = "newUser.curso" required>
                <option value="" disabled selected>Selecione seu curso</option>''
                <option>Engenharia Ambiental</option>
                <option>Engenharia de Alimentos</option>
                <option>Quimica</option>
              </select>
              <div class="invalid-feedback">
                Por favor selecione um curso.
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div class="form-row">
          <div class="col-md-12 mb-3">
            <label for="email">E-mail</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="emailPrepend"><i class="fas fa-envelope"></i></span>
              </div>
              <input id="email" type="email" class="form-control" placeholder="Digite um E-mail válido" autocomplete="email" aria-describedby="emailPrepend" v-model = "newUser.email" required>
              <div class="invalid-feedback">
                Por favor informe um E-mail válido (exemplo@exemplo.com).
              </div>
            </div>
          </div>
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
        <div>
          <button type="submit" class="btn btn-primary btn-block" v-on:click="validate">Me cadastrar</button>
        </div>
      </form>
    </div>
  </div>
</div>
</template>

<script>
import {mask} from 'vue-the-mask'
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import Alert from './Alert.vue'
import firebaseApp from '../firebase-controller.js'
const db = firebaseApp.database()
const auth = firebaseApp.auth()
export default {
  name: 'cadastro',
  data () {
    return {
      newUser: {
        ra: '',
        firstName: '',
        lastName: '',
        email: '',
        // telefone: '',
        curso: ''
      },
      password: '',
      reenteredPassword: '',
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
  firebase: {
    cadastroRef: db.ref('cadastro')
  },
  directives: {
    mask
  },
  components: {
    Alert,
    RingLoader
  },
  computed: {
    matchPassword: function () {
      return this.password === this.reenteredPassword
    }
  },
  validator: {
    validates: {
      match: function (v, result) {
        return result
      }
    }
  },
  methods: {
    submitNewUser () {
      let form = document.getElementById('cadastroForm')
      form.classList.add('hideOn')
      this.loader.loading = true
      this.alert.showAlert = false
      let _this = this
      auth.createUserWithEmailAndPassword(this.newUser.email, this.password).then(function () {
        form.classList.add('hideOn')
        _this.$firebaseRefs.cadastroRef.push(_this.newUser)
        auth.currentUser.updateProfile({
          displayName: _this.newUser.firstName
        })
        auth.currentUser.sendEmailVerification().then(function () {
          _this.$notify({
            group: 'notify',
            type: 'success',
            title: 'Yey!',
            text: 'E-mail de verificação enviado para' + _this.newUser.email,
            duration: 11000
          })
          form.classList.add('hideOn')
          setTimeout(function () {
            location.reload()
          }, 10000)
        }).catch((err) => {
          console.log('Falha ao enviar E-mail de verificação de conta: ' + err)
          auth.currentUser.delete().then(function () {
            _this.alert.type = 'alert-danger'
            _this.alert.dismissible = true
            _this.alert.title = 'Oops!'
            _this.alert.msg = 'Falha ao enviar E-mail de verificação de conta para o endereço ' + _this.newUser.email + '. Verifique seu endereço de E-mail e tente realizar o cadastro novamente.'
            _this.loader.loading = false
            _this.alert.showAlert = true
            form.classList.remove('hideOn')
          }).catch((err) => {
            console.log('Falha ao deletar user que não recebeu E-mail de verificação adequadamente: ' + err)
          })
        })
      }).catch((err) => {
        setTimeout(function () {
          let erro
          switch (err.code) {
            case 'auth/email-already-in-use': {
              erro = 'o E-mail ' + _this.newUser.email + ' já está cadastrado em nossa base de dados, se você esqueceu sua senha '
              break
            }
            case 'auth/invalid-email': {
              erro = 'o E-mail ' + _this.newUser.email + ' é inválido'
              break
            }
            case 'auth/user-disabled': {
              erro = 'o E-mail ' + _this.newUser.email + ' foi desabilitado do sistema, entre em contato com os supervisores do sistema'
              break
            }
            default: {
              erro = 'tivemos problemas na comunicação com o servidor, verifique sua conexão com a internet ou tente novamente mais tarde'
            }
          }
          _this.alert.type = 'alert-danger'
          _this.alert.dismissible = true
          _this.alert.title = 'Oops!'
          _this.alert.msg = 'Falha ao criar conta, ' + erro
          _this.loader.loading = false
          _this.alert.showAlert = true
          form.classList.remove('hideOn')
        }, 5000)
        console.log('Falha ao criar usuário: ' + err)
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
            _this.submitNewUser()
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

#cadastroForm {
  width: 100vw;
}
</style>
