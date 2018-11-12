<template>
  <a-row v-if = "action === 'resetPassword'">
    <a-row style = "text-align: center;">
      <h2> Redefinir Senha </h2>
    </a-row>

    <hr />

    <a-row>
      <a-alert v-if = "alert.visible" :type = "alert.type" showIcon>
        <span slot = "description"> {{ alert.message }} </span>
        <span slot = "message"> <i> {{ alert.title }} </i> </span>
      </a-alert>

      <a-form v-if = "validCode" style = "margin-top: 30px;" layout = "vertical" :autoFormCreate = "(form) => { this.form = form }">
        <a-row :gutter = "16">
          <a-col :span = "12">
            <a-form-item label = "Digite a Nova Senha" fieldDecoratorId = "password" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }, { validator: this.validateToNextPassword }] }">
              <a-input type = "password" placeholder = "Digite sua senha" size = "large"> 
                <a-icon slot = "prefix" type = "lock" style = "color: 'rgba(0,0,0,.25)'" />
              </a-input>
            </a-form-item>
          </a-col>

          <a-col :span = "12">
            <a-form-item label = "Repita Senha" fieldDecoratorId = "confirmPassword" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }, { validator: this.compareToFirstPassword }] }">
              <a-input type = "password" placeholder = "Digite sua senha novamente" size = "large"> 
                <a-icon slot = "prefix" type = "lock" style = "color: 'rgba(0,0,0,.25)'" />
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style = "margin-bottom: 5px;">
          <a-button style = "width: 100%;" type = "primary" :loading = "loading" size = "large" @click = "resetPassword"> Resetar Senha </a-button>
        </a-row>
      </a-form>
    </a-row>
  </a-row>

  <a-row v-else>
    <a-row style = "text-align: center;" v-if = "action === 'verifyEmail'">
      <h2> Verificação de E-mail </h2>
    </a-row>

    <hr />

    <a-row>
      <a-alert v-if = "alert.visible" :type = "alert.type" showIcon>
        <span slot = "description"> {{ alert.message }} </span>
        <span slot = "message"> <i> {{ alert.title }} </i> </span>
      </a-alert>

      <a-button v-if = "validCode" style = "width: 100%; margin-top: 30px;" type = "primary" @click = "refresh" size = "large"> Ir pra Home </a-button>
    </a-row>
  </a-row>
</template>

<script>
  import firebaseApp from '../firebase-controller.js'

  const auth = firebaseApp.auth()

  export default {
    name: 'actionHandler',
    data () {
      return {
        loading: false,
        validCode: false,
        action: this.$route.query.mode,
        code: this.$route.query.oobCode,
        alert: {
          visible: false,
          type: 'info',
          title: '',
          message: ''
        }
      }
    },
    created: function () {
      let _this = this
      if (this.$route.query.mode === 'resetPassword') {
        if (this.$route.query.oobCode) {
          auth.verifyPasswordResetCode(this.$route.query.oobCode).then(function () {
            _this.validCode = true
            _this.alert.visible = false
          }).catch(() => {
            _this.alert.visible = true
            _this.validCode = false
            _this.alert.type = 'error'
            _this.alert.title = 'Oops!'
            _this.alert.message = 'O código de redefinição de senha é inválido, já foi ultizado ou está expirado.'
          })
        } else {
          _this.alert.visible = true
          _this.alert.type = 'error'
          _this.alert.title = 'Oops!'
          _this.alert.message = 'Nenhum código de redefinição encontrado, certifique-se de não ter alterado o link de redefinição de senha.'
        }
      } else if (this.$route.query.mode === 'verifyEmail') {
        _this.alert.visible = true
        if (this.$route.query.oobCode) {
          auth.checkActionCode(this.$route.query.oobCode).then(function () {
            auth.applyActionCode(_this.$route.query.oobCode).then(function () {
              _this.validCode = true
              _this.alert.type = 'success'
              _this.alert.title = 'E-mail confirmado com sucesso!'
              _this.alert.message = 'Você já utilizar o sistema normalmente. Caso encontre algum problema atualize a página.'
            }).catch(() => {
              _this.validCode = false
              _this.alert.type = 'error'
              _this.alert.title = 'Oops!'
              _this.alert.message = 'Falha ao tentar verificar endereço de e-mail.'
            })
          }).catch(() => {
            _this.alert.type = 'error'
            _this.alert.title = 'Oops!'
            _this.alert.message = 'O código de validação de e-mail é inválido, já foi ultizado ou está expirado.'
          })
        } else {
          _this.alert.type = 'error'
          _this.alert.title = 'Oops!'
          _this.alert.message = 'Nenhum validação de e-mail encontrado, certifique-se de não ter alterado o link de validação recebido.'
        }
      } else {
        _this.alert.visible = true
        _this.alert.type = 'error'
        _this.alert.title = 'Oops!'
        _this.alert.message = 'Nenhum código de ação encontrado, certifique-se de não ter alterado o link recebido no e-mail.'
      }
    },
    methods: {
      compareToFirstPassword  (rule, value, callback) {
        let resposta = 'Senhas Incompatíveis'
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
      resetPassword () {
        let _this = this

        this.form.validateFields(async (err, values) => {
          if (!err) {
            _this.loading = true
            auth.confirmPasswordReset(this.code, values.password).then(function () {
              _this.alert.visible = true
              _this.alert.type = 'success'
              _this.alert.title = 'Senha redefinida com sucesso!'
              _this.alert.message = 'Você já pode logar no sistema com sua nova senha!'
              _this.loading = false
            }).catch(() => {
              _this.alert.visible = true
              _this.alert.type = 'error'
              _this.alert.title = 'Oops!'
              _this.alert.message = 'Algo deu errado ao tentar redefinir a senha. Na página de Login clique em "Esqueci minha senha" para tentar novamente.'
              _this.loading = false
            })
          }
        })
      },
      refresh () {
        this.$router.replace('/home')
        location.reload()
      }
    }
  }
</script>
