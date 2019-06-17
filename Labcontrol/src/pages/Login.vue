<template>
  <a-modal :visible = "true" :footer = "null" :closable = "false" centered>
    <div class = "header">
      <h3> <b> LabControl </b> </h3>
      <span> Reserve equipamentos e espaços para as suas atividades com muito mais praticidade! </span>
    </div>
    
    <a-form layout = "vertical" :autoFormCreate = "(form) => { this.form = form }" @submit = "login">
      <a-row>
        <a-col :span = "24">
          <a-form-item fieldDecoratorId = "email" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }, { type: 'email', message: 'E-mail Inválido' }] }">
            <a-input placeholder = "Digite seu e-mail"> 
              <a-icon slot = "prefix" type = "mail" style = "color: 'rgba(0,0,0,.25)'" />
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span = "24">
          <a-form-item fieldDecoratorId = "password" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }] }">
            <a-input :type = "visible ? 'text' : 'password'" placeholder = "Digite sua senha"> 
              <a-icon slot = "prefix" type = "lock" style = "color: 'rgba(0,0,0,.25)'" />

              <a-icon v-if = "visible" slot = "suffix" type = "eye-o" style = "color: 'rgba(0,0,0,.25)'; cursor: pointer;" @click = "toggleVisible" />
              <a-icon v-else slot = "suffix" type = "eye" style = "color: 'rgba(0,0,0,.25)';  cursor: pointer;" @click = "toggleVisible" />
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row style = "margin-bottom: 5px;">
        <a-button style = "width: 100%;" type = "primary" :loading = "loading" html-type = "submit"> Login </a-button>
      </a-row>

      <a-row class = "links">
        <a-col :span = "12" style = "text-align: left;">
          <router-link to = "/cadastro"> Fazer Cadastro </router-link>
        </a-col>

        <a-col :span = "12" style = "text-align: right;">
          <router-link to = "/RecuperarSenha"> Esqueci minha senha </router-link>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
  import firebase from 'firebase'
  import firebaseApp from '../firebase-controller.js'

  const auth = firebaseApp.auth()

  export default {
    name: 'login',
    data () {
      return {
        loading: false,
        visible: false
      }
    },
    mounted: function () {
      let fundo = document.getElementsByClassName('ant-layout-content')
      fundo[0].setAttribute('style', 'background: url(./static/img/background.jpg) !important; background-size: cover !important; margin: 0 !important; padding: 24px !important;')
    },
    beforeDestroy: function () {
      let fundo = document.getElementsByClassName('ant-layout-content')
      fundo[0].setAttribute('style', 'background: white !important; margin: 24px 16px !important; padding: 24px !important;')
    },
    methods: {
      login () {
        let _this = this
        _this.loading = true
        this.form.validateFields(async (err, values) => {
          if (!err) {
            auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(function () {
              auth.signInWithEmailAndPassword(values.email, values.password).then(function (user) {
                _this.$router.replace('/verificar-email')
              }).catch((err) => {
                _this.loading = false
                switch (err.message) {
                  case 'The password is invalid or the user does not have a password.': {
                    _this.$notification.error({
                      message: 'Opps..',
                      description: 'Senha inválida.'
                    })
                    break
                  }
                  case 'There is no user record corresponding to this identifier. The user may have been deleted.': {
                    _this.$notification.error({
                      message: 'Opps..',
                      description: 'E-mail não cadastrado.'
                    })
                    break
                  }
                  default: {
                    _this.$notification.error({
                      message: 'Opps..',
                      description: 'Algo deu errado. Por favor, tente novamente. Erro: ' + err.message
                    })
                    break
                  }
                }
              })
            })
          }
        })
      },
      toggleVisible () {
        this.visible = !this.visible
      }
    }
  }
</script>

<style>
  .header {
    text-align: center;
    margin-bottom: 22px;
  }

  .links a:hover {
    text-decoration: none;
  }
</style>
