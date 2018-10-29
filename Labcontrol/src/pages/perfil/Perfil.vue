<template>
  <a-spin :spinning = "loading">
    <a-tabs size = "large" @change = "alteraTab">
      <a-tab-pane key = "perfil">
        <span slot = "tab">
          <a-icon type = "smile-o" /> Perfil
        </span>
        
        <a-row style = "margin-top: 50px;">
          <a-col :span = "20" :offset = "2">
            <a-form layout = "inline" :autoFormCreate = "(form) => { this.form = form }">
              <a-row style = "display: -webkit-inline-box;">
                <a-avatar v-if = "usuario.role === 'Comum'" :size = "50" style = "background-color: #007bff;" icon = "user" />
                <a-avatar v-else-if = "usuario.role === 'Comum'" :size = "50" style = "background-color: #ffc107;" icon = "star" />
                <a-avatar v-else :size = "50" style = "background-color: #28a745;" icon = "star" />
                
                <div v-if = "editable" style = "margin-top: 8px; margin-left: 15px;">
                  <a-form-item class = "input-perfil" fieldDecoratorId = "nome" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }], initialValue: usuario.nome }">
                    <a-input size = "large" @focus = "checkInput" placeholder = "Digite nome" />
                  </a-form-item>

                  <a-form-item class = "input-perfil" fieldDecoratorId = "sobrenome" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }], initialValue: usuario.sobrenome }">
                    <a-input size = "large" @focus = "checkInput" placeholder = "Digite sobrenome" />
                  </a-form-item>
                </div>

                <div v-else style = "display: -webkit-box; width: 100%;">
                  <h3 style = "margin-top: 8px; margin-left: 15px;"> {{usuario.nome}} {{usuario.sobrenome}} </h3>
                  <h5 style = "margin-top: 14px; margin-left: 5px;"> <i> ({{usuario.role}}) </i> </h5>

                  <div style = "width: 100%; text-align: right; margin-top: 6px;">
                    <a-button size = "large" type = "primary" icon = "edit" @click = "() => {this.editable = !this.editable}"> Editar </a-button>
                  </div>
                </div>
              </a-row>
              
              <hr />
              <a-row class = "row-perfil">
                <a-col class = "titulo-perfil" :span = "4" :offset = "1">
                  <b> RA: </b>
                </a-col>

                <a-col :span = "5">
                  <a-form-item class = "input-perfil" v-if = "editable" fieldDecoratorId = "ra" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }, { validator: this.checkUniqueRA }], initialValue: usuario.ra }">
                    <a-input size = "large" @focus = "checkInput" placeholder = "Digite RA" />
                  </a-form-item>

                  <div class = "text-perfil" v-else>
                    <span> {{usuario.ra}} </span>
                  </div>
                </a-col>
              </a-row>

              <a-row class = "row-perfil">
                <a-col class = "titulo-perfil" :span = "4" :offset = "1">
                  <b> Curso: </b>
                </a-col>

                <a-col :span = "7">
                  <a-form-item class = "input-curso-perfil" v-if = "editable" style = "width: 100%;" fieldDecoratorId = "curso" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Selecione Curso' }], initialValue: usuario.curso }">
                    <a-select size = "large" placeholder = "Selecione curso" showSearch notFoundContent = "Curso não Encontrado" :filterOption = "filterOption">
                      <a-select-option v-for = "curso in cursos" @focus = "checkSelect('curso')" v-bind:key = "curso" :value = "curso"> {{curso}} </a-select-option>
                    </a-select>
                  </a-form-item>

                  <div class = "text-perfil" v-else>
                    <span> {{usuario.curso}} </span>
                  </div>
                </a-col>
              </a-row>

              <a-row class = "row-perfil">
                <a-col class = "titulo-perfil" :span = "4" :offset = "1">
                  <b> E-mail: </b>
                </a-col>

                <a-col :span = "10">
                  <a-form-item class = "input-perfil" v-if = "editable" style = "width: 100%;" fieldDecoratorId = "email" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }, { type: 'email', message: 'Digite e-mail válido' }, { validator: this.checkUniqueEmail }], initialValue: usuario.email }">
                    <a-input size = "large" @focus = "checkInput" placeholder = "Digite e-mail" />
                  </a-form-item>

                  <div class = "text-perfil" v-else>
                    <span> {{usuario.email}} </span>
                  </div>
                </a-col>
              </a-row>
              <hr />

              <a-row v-if = "editable" style = "text-align: right;">
                <a-button size = "large" style = "margin-right: 15px;" icon = "rollback" @click = "closeEdicao"> Cancelar </a-button>
                <a-button size = "large" type = "primary" icon = "check" @click = "atualizaPerfil"> Atualizar </a-button>
              </a-row>
            </a-form>
          </a-col>
        </a-row>
      </a-tab-pane>

      <a-tab-pane key = "senha">
        <span slot = "tab">
          <a-icon type = "lock" /> Alterar Senha
        </span>
        
        <a-row style = "margin-top: 50px;">
          <a-form :autoFormCreate = "(form) => { this.formSenha = form }">
            <a-form-item :labelCol = "{ span: 6 }" :wrapperCol = "{ span: 12 }" label = "Senha" fieldDecoratorId = "senha" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }, { validator: this.validateToNextPassword }] }">
              <a-input type = "password" size = "large" @focus = "checkSenha" placeholder = "Digite senha" />
            </a-form-item>

            <a-form-item :labelCol = "{ span: 6 }" :wrapperCol = "{ span: 12 }"  label = "Confirmar Senha" fieldDecoratorId = "confirmarSenha" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }, { validator: this.compareToFirstPassword }] }">
              <a-input type = "password" size = "large" @focus = "checkSenha" placeholder = "Confirme senha" />
            </a-form-item>

            <a-row style = "text-align: right;">
              <a-button size = "large" style = "margin-right: 15px;" icon = "rollback" @click = "closeSenha"> Cancelar </a-button>
              <a-button size = "large" type = "primary" icon = "check" @click = "alteraSenha"> Alterar Senha </a-button>
            </a-row>
          </a-form>
        </a-row>
      </a-tab-pane>

      <a-popconfirm slot = "tabBarExtraContent" placement = "bottomRight" okText = "Confirmar" cancelText = "Cancelar" @confirm = "deletarConta">
        <template slot = "title">
          <b> <i> Atenção! </i> </b> <br />
          Realmente deseja deletar sua conta? <br />
          Esta ação não poderá ser desfeita. 
        </template>
        
        <a-button icon = "delete" type = "danger"> Deletar Conta </a-button>
      </a-popconfirm>
    </a-tabs>
  </a-spin>
</template>

<script>
  import firebaseApp from '../../firebase-controller.js'
  
  const db = firebaseApp.database()
  const auth = firebaseApp.auth()

  export default {
    nome: 'Perfil',
    data () {
      return {
        loading: true,
        usuario: '',
        usuarios: [],
        cursos: [],
        editable: false
      }
    },
    beforeMount () {
      let _this = this
      _this.populaUsuario()

      db.ref('Controle/Cursos').orderByKey().on('value', function (snapshot) {
        _this.loading = true
        _this.cursos = []

        snapshot.forEach(function (item) {
          _this.cursos.push(item.key)
        })
        _this.loading = false
      })

      db.ref('Usuarios').on('value', function (snapshot) {
        _this.loading = true
        _this.usuarios = []

        snapshot.forEach(function (item) {
          _this.usuarios.push({
            'ra': item.val().RA,
            'nome': item.val().Nome,
            'sobrenome': item.val().Sobrenome,
            'curso': item.val().Curso,
            'email': item.val().Email,
            'role': item.val().role
          })
        })
        _this.loading = false
      })
    },
    methods: {
      populaUsuario () {
        let _this = this
        db.ref('Usuarios/' + auth.currentUser.uid).once('value', function (snapshot) {
          _this.usuario = {}
          _this.usuario.id = snapshot.key
          _this.usuario.ra = snapshot.val().RA
          _this.usuario.nome = snapshot.val().Nome
          _this.usuario.sobrenome = snapshot.val().Sobrenome
          _this.usuario.curso = snapshot.val().Curso
          _this.usuario.email = snapshot.val().Email
          _this.usuario.role = snapshot.val().role
        })
      },
      deletarConta () {
        let uid = auth.currentUser.uid
        let _this = this
        auth.currentUser.delete().then(function () {
          _this.$notification.success({
            message: 'Yey!..',
            description: 'Conta deletada com sucesso.'
          })
          db.ref('Usuarios').child(uid).remove().then(function () {
            setTimeout(function () {
              _this.$parent.logout()
            }, 1000)
          })
        }).catch((err) => {
          _this.$notification.error({
            message: 'Opps..',
            description: 'Falha ao deletar conta. Erro: ' + err
          })
        })
      },
      checkUniqueRA (rule, value, callback) {
        let resposta = 'RA já cadastrado!'
        if (value && this.usuarios.some(e => e.ra === value) && this.usuario.ra !== value) {
          callback(resposta)
        } else {
          callback()
        }
      },
      checkUniqueEmail (rule, value, callback) {
        let resposta = 'Email já utilizado!'
        if (value && this.usuarios.some(e => e.email === value) && this.usuario.email !== value) {
          callback(resposta)
        } else {
          callback()
        }
      },
      closeEdicao () {
        this.editable = false
        this.form.resetFields()
      },
      closeSenha () {
        this.formSenha.resetFields()
      },
      checkInput (e) {
        this.form.validateFields([e.target.id])
      },
      checkSenha (e) {
        this.formSenha.validateFields([e.target.id])
      },
      checkSelect (name) {
        this.form.validateFields([name])
      },
      filterOption (input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      compareToFirstPassword  (rule, value, callback) {
        let resposta = 'Duas senhas incompatíveis'
        const form = this.formSenha
        if (value && value !== form.getFieldValue('senha')) {
          callback(resposta)
        } else {
          callback()
        }
      },
      validateToNextPassword  (rule, value, callback) {
        const form = this.formSenha
        if (value && this.confirmDirty) {
          form.validateFields(['confirmarSenha'], { force: true })
        }
        callback()
      },
      atualizaPerfil () {
        let _this = this
        this.form.validateFields(async (err, values) => {
          if (!err) {
            db.ref('Usuarios').child(_this.usuario.id).update({
              'Nome': values.nome,
              'Sobrenome': values.sobrenome,
              'Curso': values.curso,
              'RA': values.ra
            }).then(() => {
              _this.$notification.success({
                message: 'Yey!..',
                description: 'Perfil atualizado com sucesso.'
              }, 1500)

              if (values.email !== _this.usuario.email) {
                auth.currentUser.updateEmail(values.email).then(function () {
                  _this.usuario.email = values.email
                  _this.resendEmail(values.email)
                }).catch((err) => {
                  switch (err.code) {
                    case 'auth/invalid-email': {
                      _this.$notification.error({
                        message: 'Opps..',
                        description: 'Email inválido'
                      })
                      break
                    }
                    default: {
                      _this.$notification.error({
                        message: 'Opps..',
                        description: 'Algo não deu certo. Erro: ' + err.code
                      })
                      break
                    }
                  }
                })
              }
              this.populaUsuario()
              this.closeEdicao()
            }).catch((err) => {
              _this.$notification.error({
                message: 'Opps..',
                description: 'Equipamento não atualizado. Erro: ' + err
              })
              this.closeEdicao()
            })
          }
        })
      },
      alteraSenha () {
        let _this = this
        this.formSenha.validateFields(async (err, values) => {
          if (!err) {
            auth.currentUser.updatePassword(values.senha).then(() => {
              _this.$notification.success({
                message: 'Yey!..',
                description: 'Senha Alterada.'
              })
              this.closeSenha()
            }).catch((err) => {
              _this.$notification.error({
                message: 'Opps..',
                description: 'Senha não alterada. Erro: ' + err
              })
              this.closeSenha()
            })
          }
        })
      },
      resendEmail (newEmail) {
        let _this = this
        auth.currentUser.sendEmailVerification().then(() => {
          _this.$notification.info({
            message: 'Yey!.. De novo',
            description: 'E-mail de verificação enviado com sucesso! Confirme seu E-mail para utilizar o sistema.'
          })
          db.ref('Usuarios').child(_this.usuario.id).update({
            'Email': newEmail
          })
        }).catch((err) => {
          _this.$notification.error({
            message: 'Opps..',
            description: 'Email de verificação não enviado. Erro: ' + err
          })
        })
      },
      alteraTab (activeKey) {
        if (activeKey === 'senha') {
          this.closeEdicao()
        } else {
          this.closeSenha()
        }
      }
    }
  }
</script>

<style>
  .titulo-perfil {
    margin-top: 8px;
    font-size: 16px;
  }

  .text-perfil {
    margin-top: 6px;
    font-size: 16px;
  }

  .row-perfil { margin-bottom: 15px; }
  .input-perfil .ant-form-item-control-wrapper { width: 100%; }
  .input-curso-perfil .ant-form-item-control-wrapper { width: 100%; }
</style>
