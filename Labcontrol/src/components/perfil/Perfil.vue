<template>
  <div id="perfilUser">
    <div v-if="!editing" class="container-fluid">
      <div v-if="loader.loading" class="row justify-content-center">
        <ring-loader :loading="loader.loading" :color="loader.color" :size="loader.size"></ring-loader>
      </div>
      <div v-if="!loader.loading" class="container">
        <v-dialog/>
        <div class="row">
          <div class="col-sm-12 col-md-6">
            <h5><strong>RA</strong>: {{user.ra}}</h5>
          </div>
          <div class="col-sm-12 col-md-6">
            <h5><strong>Nome</strong>: {{user.Nome}} {{user.Sobrenome}}</h5>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-sm-12 col-md-6">
            <p><strong>Curso</strong><br />{{user.Curso}}</p>
          </div>
          <div class="col-sm-12 col-md-6">
            <p><strong>E-mail</strong><br />{{user.Email}}</p>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-12 text-right">
            <ul class="list-inline d-inline-flex">
              <li>
                <span v-on:click="editReauthentication()" class="mr-2 list-inline-item btn btn-primary btn-sm">Editar</span>
                <!-- <router-link to="/peril/edit" class="mr-2 list-inline-item btn btn-primary btn-sm">Editar</router-link> -->
              </li>
              <li>
                <span v-on:click="confirmarExclusao()" class="list-inline-item btn btn-danger btn-sm">Excluir conta</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-if="editing" class="container-fluid">
      <div v-if="loader.loading" class="row justify-content-center">
        <ring-loader :loading="loader.loading" :color="loader.color" :size="loader.size"></ring-loader>
      </div>
      <div v-if="!loader.loading" class="row justify-content-center">
        <alert :showAlert="alert.showAlert" :dismissible="alert.dismissible" :type="alert.type" :title="alert.title" :msg="alert.msg"></alert>
        <form id="editProfile" class="needs-validation-perfil" v-on:submit.prevent novalidate>
          <div class="form-row">
            <div class="col-md-6 mb-3">
              <label for="nome">Nome</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="nomePrepend"><i class="fas fa-user"></i></span>
                </div>
                <input id="nome" type="text" class="form-control" placeholder="Digite seu nome" autocomplete="given-name" aria-describedby="nomePrepend" v-model = "user.Nome" required>
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
                <input id="sobrenome" type="text" class="form-control" placeholder="Digite seu sobrenome" autocomplete="family-name" aria-describedby="sobrenomePrepend" v-model = "user.Sobrenome" required>
                <div class="invalid-feedback">
                  Por favor informe seu sobrenome.
                </div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="col-md-6 mb-3">
              <label for="ra">Registro Academico</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="raPrepend"><i class="fas fa-address-card"></i></span>
                </div>
                <input v-on:change="checkUnique()" id="ra" type="number" class="form-control" placeholder="Digite seu RA" autocomplete="RA" aria-describedby="raPrepend" min="0" v-model = "user.ra" required>
                <div class="invalid-feedback">
                  Por favor informe um RA válido.
                </div>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <label for="curso">Curso</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="cursoPrepend"><i class="fas fa-graduation-cap"></i></span>
                </div>
                <select id="curso" class="form-control" aria-describedby="cursoPrepend" v-model = "user.Curso" required>
                  <option value="" disabled selected>Selecione seu curso</option>
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
                <input id="email" type="email" class="form-control" placeholder="Digite um E-mail válido" autocomplete="email" aria-describedby="emailPrepend" v-model = "user.newEmail" required>
                <div class="invalid-feedback">
                  Por favor informe um E-mail válido (exemplo@exemplo.com).
                </div>
              </div>
            </div>
            <div class="form-check mb-3">
              <input type="checkbox" class="form-check-input" id="changePassword" v-model = "changePassword">
              <label class="form-check-label" for="changePassword">Alterar Senha</label>
            </div>
          </div>
          <div v-if="changePassword" class="form-row">
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
          <div class="row">
            <div class="col-12 col-md-6 mb-3">
              <button type="submit" class="btn btn-primary btn-block">Atualizar Perfil</button>
            </div>
            <div class="col-12 col-md-6 mb-3">
              <span v-on:click="cancelEdit()" class="btn btn-danger btn-block">Cancelar</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import firebaseApp from '../../firebase-controller.js'
import Alert from '../utility/Alert.vue'
const db = firebaseApp.database()
const auth = firebaseApp.auth()
export default {
  nome: 'Perfil',
  data () {
    return {
      action: null,
      changePassword: false,
      editing: false,
      uid: auth.currentUser.uid,
      userData: null,
      user: {
        ra: null,
        Nome: null,
        Sobrenome: null,
        Curso: null,
        Email: auth.currentUser.email,
        newEmail: auth.currentUser.email
      },
      password: '',
      reenteredPassword: '',
      loader: {
        loading: true,
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
    this.loader.loading = true
    let _this = this
    db.ref('Usuarios/' + auth.currentUser.uid).on('value', function (snapshot) {
      _this.userData = snapshot.val()
      _this.user.ra = _this.userData.RA
      _this.user.Nome = _this.userData.Nome
      _this.user.Sobrenome = _this.userData.Sobrenome
      _this.user.Curso = _this.userData.Curso
      _this.loader.loading = false
    })
  },
  methods: {
    cancelEdit () {
      this.editing = false
      let _this = this
      db.ref('Usuarios/' + auth.currentUser.uid).once('value', function (snapshot) {
        _this.userData = snapshot.val()
        _this.user.ra = _this.userData.RA
        _this.user.Nome = _this.userData.Nome
        _this.user.Sobrenome = _this.userData.Sobrenome
        _this.user.Curso = _this.userData.Curso
      })
    },
    deleteAccount () {
      let uid = auth.currentUser.uid
      let _this = this
      auth.currentUser.delete().then(function () {
        _this.$notify({
          group: 'notify',
          type: 'success',
          title: 'Yey!',
          text: 'Conta deletada com sucesso.'
        })
        db.ref('Usuarios').child(uid).remove().then(function () {
          setTimeout(function () {
            _this.$parent.logout()
          }, 1000)
        })
      }).catch((err) => {
        _this.$notify({
          group: 'notify',
          type: 'error',
          title: 'Oops!',
          text: 'Falha ao deletar conta'
        })
        console.log('Falha ao deletar conta.' + err)
      })
    },
    editProfile () {
      this.$modal.hide('reauthenticate-modal')
      this.editing = true
      let _this = this
      setTimeout(function () {
        _this.validate()
      }, 500)
    },
    editReauthentication () {
      this.$notify({
        group: 'notify',
        type: 'warn',
        title: 'Cuidado!',
        text: 'Esta ação requer autenticação recente!'
      })
      this.action = 'editProfile'
      this.$modal.show('reauthenticate-modal')
      let _this = this
      setTimeout(function () {
        _this.$parent.validate()
      }, 500)
    },
    resendEmail: function () {
      this.loader.loading = true
      this.alert.showAlert = false

      let _this = this
      auth.currentUser.sendEmailVerification().then(function () {
        _this.$notify({
          group: 'notify',
          type: 'success',
          title: 'Yey!',
          text: 'E-mail de verificação enviado com sucesso! Confirme seu E-mail para utilizar o sistema.'
        })
        _this.loader.loading = false
        _this.alert.showAlert = true
        console.log('E-mail de verificação enviado com sucesso!')
      }).catch((err) => {
        _this.alert.type = 'alert-danger'
        _this.alert.dismissible = true
        _this.alert.title = 'Oops!'
        _this.alert.msg = 'Falha ao enviar E-mail de verificação de conta para o endereço ' + _this.user.email + '. Não foi possivel atualizar seu perfil. Verifique sua conexão com a internet ou tente novamente mais tarde.'
        _this.loader.loading = false
        _this.alert.showAlert = true
        console.log('Falha ao enviar E-mail de verificação de conta: ' + err)
      })
    },
    updateProfile () {
      this.loader.loading = true
      let _this = this
      let update = true
      if (this.user.Email !== this.user.newEmail) {
        auth.currentUser.updateEmail(this.user.newEmail).then(function () {
          _this.user.Email = _this.user.newEmail
          update = true
          _this.resendEmail()
        }).catch((err) => {
          update = false
          console.log('Falha ao atualizar E-mail: ' + err.code)
          switch (err.code) {
            case 'auth/email-already-in-use': {
              this.$notify({
                group: 'notify',
                type: 'error',
                title: 'Oops!',
                text: 'Endereço de E-mail já está em uso'
              })
              this.loader.loading = false
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
        })
      }
      if (this.changePassword) {
        auth.currentUser.updatePassword(this.password).then(function () {
          _this.$notify({
            group: 'notify',
            type: 'success',
            title: 'Yey!',
            text: 'Senha atualizada com sucesso.'
          })
        }).catch((err) => {
          this.$notify({
            group: 'notify',
            type: 'error',
            title: 'Oops!',
            text: 'Falha ao atualizar senha.'
          })
          update = false
          console.log('Falha ao atualizar senha: ' + err)
        })
      }
      if (update) {
        db.ref('Usuarios').child(auth.currentUser.uid).update({
          'RA': _this.user.ra,
          'Nome': _this.user.Nome,
          'Sobrenome': _this.user.Sobrenome,
          'Curso': _this.user.Curso
        }).then(function () {
          _this.$notify({
            group: 'notify',
            type: 'success',
            title: 'Yey!',
            text: 'Perfil atualizado com sucesso!'
          })
          _this.editing = false
          _this.loader.loading = false
        }).catch((err) => {
          console.log('Falha ao escrever no BD: ' + err)
          auth.currentUser.delete().then(function () {
            _this.alert.type = 'alert-danger'
            _this.alert.dismissible = true
            _this.alert.title = 'Oops!'
            _this.alert.msg = 'Falha na comunicação com nosso Banco de Dados.'
            _this.loader.loading = false
            _this.alert.showAlert = true
          })
        })
      }
    },
    confirmarExclusao () {
      let _this = this
      this.$modal.show('dialog', {
        title: 'Cuidado!',
        text: 'Ao excluir sua conta <b>todas</b> as suas reservas serão canceladas. <br> Realmente deseja excluir sua conta? <br> <i>Essa ação não poderá ser desfeita</i>',
        buttons: [
          {
            title: 'Deletar',
            handler: () => {
              _this.$notify({
                group: 'notify',
                type: 'warn',
                title: 'Cuidado!',
                text: 'Esta ação requer autenticação recente!'
              })
              this.$modal.hide('dialog')
              this.action = 'deleteAccount'
              this.$modal.show('reauthenticate-modal')
              setTimeout(function () {
                _this.$parent.validate()
              }, 500)
            }
          },
          {
            title: 'Cancelar',
            default: true
          }
        ]
      })
    },
    validate: function () {
      let _this = this
      var forms = document.getElementsByClassName('needs-validation-perfil')
      Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
          if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
          } else {
            _this.updateProfile()
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
    checkUnique: function () {
      let _this = this
      var ra
      var unique = true
      db.ref('Usuarios').orderByChild('RA').once('value', function (snapshot) {
        ra = document.getElementById('ra')
        snapshot.forEach(function (childSnapshot) {
          if ((childSnapshot.val().RA === ra.value) && (ra.value !== _this.userData.RA)) {
            unique = false
          }
        })
        if (unique) {
          ra.setCustomValidity('')
          _this.alert.showAlert = false
        } else {
          ra.setCustomValidity('RA já está cadastrado')
          _this.alert.type = 'alert-danger'
          _this.alert.dismissible = false
          _this.alert.title = 'Oops!'
          _this.alert.msg = 'O RA ' + _this.user.ra + ' já se encontra cadastrado!'
          _this.alert.showAlert = true
        }
      })
    }
  }
}
</script>

<style>
  #editProfile {
    width: 100vw;
  }
</style>
