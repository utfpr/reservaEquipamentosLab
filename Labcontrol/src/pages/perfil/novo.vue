<template>
  <a-tabs size = "large">
    <a-tab-pane key = "perfil">
      <span slot = "tab">
        <a-icon type = "smile-o" /> Perfil
      </span>
      
      <a-row style = "margin-top: 50px;">
        <a-col :span = "20" :offset = "2">
          <a-avatar :size = "100" icon = "user" />
        </a-col>
      </a-row>
    </a-tab-pane>

    <a-tab-pane key = "senha">
      <span slot = "tab">
        <a-icon type = "lock" /> Alterar Senha
      </span>
      Tab 2
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
</template>

<script>
  import firebaseApp from '../../firebase-controller.js'
  
  const db = firebaseApp.database()
  const auth = firebaseApp.auth()

  export default {
    nome: 'Perfil',
    data () {
      return {
        usuario: []
      }
    },
    mounted: function () {
      let _this = this
      db.ref('Usuarios/' + auth.currentUser.uid).on('value', function (snapshot) {
        _this.usuario.ra = snapshot.val().RA
        _this.usuario.nome = snapshot.val().Nome
        _this.usuario.sobrenome = snapshot.val().Sobrenome
        _this.usuario.curso = snapshot.val().Curso
        _this.usuario.role = snapshot.val().role
      })
    },
    methods: {
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
      }
    }
  }
</script>

<style>

</style>
