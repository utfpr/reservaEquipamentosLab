<template>
  <a-row>
    <a-row style = "margin-bottom: 30px;" v-if = "visibleAlert">
      <a-alert :type = "alert.type" showIcon>
        <span slot = "description" v-html = "alert.message"> {{ alert.message }} </span>
        <span slot = "message"> <i> {{ alert.title }} </i> </span>
      </a-alert>
    </a-row>

    <a-row v-if = "visible">
      <a-form layout = "vertical" :autoFormCreate = "(form) => { this.form = form }">
        <a-row :gutter = "16">
          <a-col :span = "20">
            <a-form-item fieldDecoratorId = "email" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }, { type: 'email', message: 'E-mail Inválido' }, { validator: this.checkUniqueEmail }] }">
              <a-input placeholder = "Digite um novo e-mail"> 
                <a-icon slot = "prefix" type = "mail" style = "color: 'rgba(0,0,0,.25)'" />
              </a-input>
            </a-form-item>
          </a-col>

          <a-col :span = "4">
            <a-button style = "width: 100%;" type = "primary" :loading = "loading" @click = "alterarEmail"> Alterar </a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-row>
    
    <a-row :gutter = "16">
      <a-col :span = "12">
        <a-button style = "width: 100%;" type = "primary" @click = "resendEmail" size = "large"> Reenviar E-mail </a-button>
      </a-col>

      <a-col :span = "12">
        <a-button style = "width: 100%;" type = "primary" size = "large" @click = "showForm"> Alterar E-mail </a-button>
      </a-col>
    </a-row>
  </a-row>
</template>

<script>
  import firebaseApp from '../firebase-controller.js'

  const db = firebaseApp.database()
  const auth = firebaseApp.auth()

  export default {
    name: 'verificarEmail',
    data () {
      return {
        visible: false,
        visibleAlert: false,
        loading: false,
        user: {
          email: auth.currentUser.email
        },
        alert: {
          type: 'info',
          title: '',
          message: ''
        }
      }
    },
    mounted: function () {
      this.visibleAlert = true
      if (auth.currentUser.emailVerified) {
        this.alert.type = 'success'
        this.alert.title = 'E-mail confirmado com sucesso!'
        this.alert.message = 'Você pode utilizar o sistema de reservas normalmente!'
      } else {
        this.alert.type = 'warning'
        this.alert.title = 'Confirme seu e-mail'
        this.alert.message = 'Para utilizar o sistema abra o link de verificação de conta enviado para o e-mail: <b> ' + this.user.email + ' </b>. Caso o e-mail não apareça em sua caixa de entrada verifique a pasta de Spam.'
      }
    },
    methods: {
      resendEmail: function () {
        let _this = this
        _this.visible = false

        auth.currentUser.sendEmailVerification().then(function () {
          _this.alert.type = 'success'
          _this.alert.title = 'Yey!'
          _this.alert.message = 'Um E-mail de verificação de conta foi enviado para o e-mail: <b> ' + _this.user.email + ' </b>. Caso o e-mail não apareça em sua caixa de entrada verifique a pasta de Spam.'
          _this.visibleAlert = true
        }).catch(() => {
          _this.alert.type = 'error'
          _this.alert.title = 'Oops!'
          _this.alert.message = 'Falha ao enviar E-mail de verificação de conta para o e-mail: <b> ' + _this.user.email + ' </b>. Verifique sua conexão com a internet ou tente novamente mais tarde.'
          _this.visibleAlert = true
        })

        _this.loading = false
      },
      showForm () {
        this.visible = true
        this.visibleAlert = false
      },
      checkUniqueEmail (rule, value, callback) {
        let resposta = 'E-mail já utilizado anteriormente!'
        if (this.user.email === value) {
          callback(resposta)
        } else {
          callback()
        }
      },
      alterarEmail () {
        let _this = this

        this.form.validateFields(async (err, values) => {
          if (!err) {
            _this.loading = true
            auth.currentUser.updateEmail(values.email).then(function () {
              _this.user.email = values.email
              db.ref('Usuarios').child(auth.currentUser.uid).update({
                'Email': auth.currentUser.email
              }).then(function () {
                _this.resendEmail()
              })
            }).catch((err) => {
              let erro
              switch (err.code) {
                case 'auth/email-already-in-use': {
                  erro = 'Endereço de E-mail já está em uso'
                  break
                }
                case 'auth/requires-recent-login' || 'auth/user-token-expired': {
                  erro = 'Sua sessão expirou! Por favor, logue novamente'
                  break
                }
                case 'auth/invalid-email': {
                  erro = 'Endereço de E-mail informado é inválido'
                  break
                }
                default: {
                  erro = 'Parece que algo deu errado. Por favor, tente novamente. Erro: ' + err.code
                  break
                }
              }
              _this.$notification.error({
                message: 'Opps..',
                description: erro
              })
              _this.loading = false
            })
          }
        })
      }
    }
  }
</script>
