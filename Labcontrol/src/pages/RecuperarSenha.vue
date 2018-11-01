<template>
  <a-row>
    <a-row style = "text-align: center;">
      <h2> Recupere sua senha </h2>
    </a-row>

    <hr />

    <a-row >
      <a-alert style = "margin-bottom: 30px;" v-if = "alert.visible" :type = "alert.type" showIcon>
        <span slot = "description" v-html = "alert.message"> {{ alert.message }} </span>
        <span slot = "message"> <i> {{ alert.title }} </i> </span>
      </a-alert>

      <a-form layout = "vertical" :autoFormCreate = "(form) => { this.form = form }">
        <a-row :gutter = "16">
          <a-col :span = "20">
            <a-form-item fieldDecoratorId = "email" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }, { type: 'email', message: 'E-mail Inválido' }] }">
              <a-input placeholder = "Digite o seu e-mail" size = "large"> 
                <a-icon slot = "prefix" type = "mail" style = "color: 'rgba(0,0,0,.25)'" />
              </a-input>
            </a-form-item>
          </a-col>

          <a-col :span = "4">
            <a-button style = "width: 100%;" type = "primary" :loading = "loading" size = "large" @click = "checkEmail"> Alterar </a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-row>
  </a-row>
</template>

<script>
  import firebaseApp from '../firebase-controller.js'

  const auth = firebaseApp.auth()

  export default {
    name: 'recuperarSenha',
    data () {
      return {
        loading: false,
        emailForReset: '',
        alert: {
          visible: false,
          dismissible: false,
          type: '',
          title: '',
          message: ''
        }
      }
    },
    methods: {
      sendResetMail (email) {
        let _this = this

        auth.sendPasswordResetEmail(email).then(function () {
          _this.alert.type = 'success'
          _this.alert.title = 'Solicitação enviada com successo!'
          _this.alert.message = ' Caso o e-mail <b>' + email + '</b> esteja cadastrado na plataforma, você receberá um e-mail para a redefinição de senha. Caso o e-mail não apareça em sua caixa de entrada verifique a pasta de Spam'
          _this.alert.visible = true
        }).catch(() => {
          _this.alert.type = 'error'
          _this.alert.title = 'Oops!'
          _this.alert.message = 'Falha ao enviar e-mail de recuperação para <b>' + email + '</b>, por favor tente novamente mais tarde.'
          _this.alert.visible = true
        })
        _this.loading = false
      },
      checkEmail () {
        let _this = this

        _this.form.validateFields(async (err, values) => {
          if (!err) {
            _this.loading = true

            auth.fetchProvidersForEmail(values.email).then(function (providers) {
              if (providers.length !== 0) {
                _this.sendResetMail(values.email)
              } else {
                _this.alert.type = 'error'
                _this.alert.title = 'Oops!'
                _this.alert.message = 'O e-mail: <b>' + values.email + '</b> não se encontra cadastrado em nosso sistema.'
                _this.alert.visible = true
                _this.loading = false
              }
            }).catch(() => {
              _this.alert.type = 'error'
              _this.alert.title = 'Oops!'
              _this.alert.message = '<b> Falha na conexão com servidor </b>. Verifique sua conexão com a internet e tente novamente mais tarde.'
              _this.alert.visible = true
              _this.loading = false
            })
          }
        })
      }
    }
  }
</script>
