<template>
  <a-modal :visible = "true" :footer = "null" :closable = "false" centered>
    <div class = "header">
      <h3> <b> Crie sua conta no LabControl! </b> </h3>
    </div>
    
    <a-form layout = "vertical" :autoFormCreate = "(form) => { this.form = form }">
      <a-row :gutter = "16">
        <a-col :span = "12">
          <a-form-item fieldDecoratorId = "nome" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }] }">
            <a-input placeholder = "Digite seu nome"> 
              <a-icon slot = "prefix" type = "user" style = "color: 'rgba(0,0,0,.25)'" />
            </a-input>
          </a-form-item>
        </a-col>

        <a-col :span = "12">
          <a-form-item fieldDecoratorId = "sobrenome" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }] }">
            <a-input placeholder = "Digite seu sobrenome"> 
              <a-icon slot = "prefix" type = "user" style = "color: 'rgba(0,0,0,.25)'" />
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter = "16">
        <a-col :span = "8">
          <a-form-item fieldDecoratorId = "ra" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }, { validator: this.checkUniqueRA }] }">
            <a-input placeholder = "Digite seu RA"> 
              <a-icon slot = "prefix" type = "profile" style = "color: 'rgba(0,0,0,.25)'" />
            </a-input>
          </a-form-item>
        </a-col>

        <a-col :span = "16">
          <a-form-item fieldDecoratorId = "curso" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Selecione Curso' }] }">
            <a-select placeholder = "Selecione curso" showSearch notFoundContent = "Curso não Encontrado" :filterOption = "filterOption">
              <a-select-option v-for = "curso in cursos" v-bind:key = "curso" :value = "curso"> {{curso}} </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span = "24">
          <a-form-item fieldDecoratorId = "email" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }, {type: 'email', message: 'E-mail Inválido'}, { validator: this.checkUniqueEmail }] }">
            <a-input placeholder = "Digite seu e-mail"> 
              <a-icon slot = "prefix" type = "mail" style = "color: 'rgba(0,0,0,.25)'" />
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter = "16">
        <a-col :span = "12">
          <a-form-item fieldDecoratorId = "password" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }, { validator: this.validateToNextPassword }] }">
            <a-input type = "password" placeholder = "Digite sua senha"> 
              <a-icon slot = "prefix" type = "lock" style = "color: 'rgba(0,0,0,.25)'" />
            </a-input>
          </a-form-item>
        </a-col>

        <a-col :span = "12">
          <a-form-item fieldDecoratorId = "confirmPassword" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }, { validator: this.compareToFirstPassword }] }">
            <a-input type = "password" placeholder = "Digite sua senha novamente"> 
              <a-icon slot = "prefix" type = "lock" style = "color: 'rgba(0,0,0,.25)'" />
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row style = "margin-bottom: 5px;">
        <a-button style = "width: 100%;" type = "primary" :loading = "loading" @click = "cadastro"> Cadastro </a-button>
      </a-row>

      <a-row class = "links">
        <a-col :span = "12" style = "text-align: left;">
          <router-link to = "/login"> Já possuo Conta </router-link>
        </a-col>

        <a-col :span = "12" style = "text-align: right;">
          <router-link to = "/RecuperarSenha"> Esqueci minha senha </router-link>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
  import firebaseApp from '../firebase-controller.js'

  const db = firebaseApp.database()
  const auth = firebaseApp.auth()

  export default {
    name: 'cadastro',
    data () {
      return {
        loading: false,
        visible: false,
        cursos: [],
        usuarios: []
      }
    },
    created: function () {
      let fundo = document.getElementsByClassName('ant-layout-content')
      fundo[0].setAttribute('style', 'background: url(./static/img/background.jpg) !important; background-size: cover !important; margin: 0 !important; padding: 24px !important;')
    },
    beforeMount: function () {
      let _this = this

      db.ref('Usuarios').orderByChild('role').on('value', (snapshot) => {
        _this.usuarios = []

        snapshot.forEach(function (usuario) {
          _this.usuarios.push({
            'ra': usuario.val().RA,
            'email': usuario.val().Email
          })
        })
      })

      db.ref('Controle/Cursos').orderByKey().on('value', function (snapshot) {
        _this.cursos = []

        snapshot.forEach(function (item) {
          _this.cursos.push(item.key)
        })
      })
    },
    destroyed: function () {
      let fundo = document.getElementsByClassName('ant-layout-content')
      fundo[0].setAttribute('style', 'background: white !important; margin: 24px 16px !important; padding: 24px !important;')
    },
    methods: {
      compareToFirstPassword  (rule, value, callback) {
        let resposta = 'Duas senhas incompatíveis'
        const form = this.form
        if (value && value !== form.getFieldValue('password')) {
          callback(resposta)
        } else {
          callback()
        }
      },
      validateToNextPassword  (rule, value, callback) {
        const form = this.form
        if (value && this.confirmDirty) {
          form.validateFields(['confirmPassword'], { force: true })
        }
        callback()
      },
      checkUniqueRA (rule, value, callback) {
        let resposta = 'RA já utilizado!'
        if (value && this.usuarios.some(e => e.ra === value)) {
          callback(resposta)
        } else {
          callback()
        }
      },
      checkUniqueEmail (rule, value, callback) {
        let resposta = 'Email já utilizado!'
        if (value && this.usuarios.some(e => e.email === value)) {
          callback(resposta)
        } else {
          callback()
        }
      },
      filterOption (input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      cadastro () {
        let _this = this
        _this.loading = true
        this.form.validateFields(async (err, values) => {
          if (!err) {
            auth.createUserWithEmailAndPassword(values.email, values.password).then(function () {
              auth.currentUser.sendEmailVerification().then(function () {
                db.ref('Usuarios').child(auth.currentUser.uid).update({
                  'RA': values.ra,
                  'Nome': values.nome,
                  'Sobrenome': values.sobrenome,
                  'Curso': values.curso,
                  'Email': auth.currentUser.email,
                  'role': 'Comum'
                }).then(function () {
                  _this.$notification.success({
                    message: 'Yey!..',
                    description: 'E-mail de verificação enviado para ' + values.email
                  })

                  setTimeout(function () {
                    location.reload()
                  }, 10000)
                }).catch(() => {
                  _this.loading = false
                  _this.$notification.error({
                    message: 'Opps..',
                    description: 'Falha na comunicação com nosso Banco de Dados.'
                  })
                })
              }).catch(() => {
                _this.loading = false
                auth.currentUser.delete().then(function () {
                  _this.$notification.error({
                    message: 'Opps..',
                    description: 'Falha ao enviar E-mail de verificação de conta para o endereço ' + _this.newUser.email + '. Verifique seu endereço de E-mail e tente realizar o cadastro novamente.'
                  })
                }).catch((err) => {
                  console.log('Falha ao deletar user que não recebeu E-mail de verificação adequadamente: ' + err)
                })
              })
            }).catch((err) => {
              let erro
              switch (err.code) {
                case 'auth/email-already-in-use': {
                  erro = 'o E-mail ' + values.email + ' já está cadastrado em nossa base de dados, se você esqueceu sua senha utilize o link "Esqueci minha senha" na tela de login'
                  break
                }
                case 'auth/invalid-email': {
                  erro = 'o E-mail ' + values.email + ' é inválido'
                  break
                }
                case 'auth/user-disabled': {
                  erro = 'o E-mail ' + values.email + ' foi desabilitado do sistema, entre em contato com os supervisores do sistema'
                  break
                }
                default: {
                  erro = 'tivemos problemas na comunicação com o servidor, verifique sua conexão com a internet ou tente novamente mais tarde'
                }
              }
              _this.loading = false
              _this.$notification.error({
                message: 'Opps..',
                description: erro
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
