<template>
  <a-spin :spinning = "loading">
    <a-row style = "margin-bottom: 30px;">
      <a-col :span = "16" :offset = "4" style = "text-align: center">
        <h1> Usuários </h1>
      </a-col>
    </a-row>

    <a-table :dataSource = "usuarios" :columns = "columns" :locale = "{ filterConfirm: 'Ok', filterReset: 'Resetar', emptyText: 'Nenhum Usuário Cadastrado' }">
      <span slot = "expandedRowRender" slot-scope = "record" style = "margin: 0">
        <p> <b> E-mail: </b> {{ record.email }} </p>
      </span>

      <span slot = "actions" slot-scope = "text, record">
        <a-tooltip v-if = "record.type !== 'Comum'" placement = "top">
          <template slot = "title">
            <span> Rebaixar Usuário </span>
          </template>

          <a-tag @click = "rebaixaUsuario(text)" color = "orange" :key = "text">
            <a-icon type = "arrow-down" />
          </a-tag>
        </a-tooltip>
        
        <a-tooltip v-if = "record.type !== 'admin'" placement = "top">
          <template slot = "title">
            <span> Promover Usuário </span>
          </template>

          <a-tag @click = "promoveUsuario(text)" color = "green" :key = "text" >
            <a-icon type = "arrow-up" />
          </a-tag>
        </a-tooltip>
        
        <a-tooltip placement = "top">
          <template slot = "title">
            <span> Deletar Usuário </span>
          </template>

          <a-tag @click = "showConfirmModal(text)" color = "red" :key = "text" >
            <a-icon type = "delete" />
          </a-tag>
        </a-tooltip>
      </span>
      
      <a-icon slot = "filterIcon" slot-scope = "filtered" type = "search" :style = "{ color: filtered ? '#108ee9' : '#aaa' }" />
      
      <div slot = "filterDropdownRA" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
        <a-input
          ref = "raInput"
          placeholder = 'Buscar por RA...'
          :value = "selectedKeys[0]"
          @change = "e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter = "() => handleSearch('searchRA', selectedKeys, confirm)"
        />
        <a-button type = 'primary' @click = "() => handleSearch('searchRA', selectedKeys, confirm)"> Buscar </a-button>
        <a-button @click = "() => handleReset('searchRA', clearFilters)"> Resetar </a-button>
      </div>

      <div slot = "filterDropdownNome" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
        <a-input
          ref = "nomeInput"
          placeholder = 'Buscar nome...'
          :value = "selectedKeys[0]"
          @change = "e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter = "() => handleSearch('searchNome', selectedKeys, confirm)"
        />
        <a-button type = 'primary' @click = "() => handleSearch('searchNome', selectedKeys, confirm)"> Buscar </a-button>
        <a-button @click = "() => handleReset('searchNome', clearFilters)"> Resetar </a-button>
      </div>

      <span slot = "statusTipo" slot-scope = "type">
        <a-tag v-if = "type == 'Comum'" color = "blue" :key = "type"> {{type}} </a-tag>
        <a-tag v-if = "type == 'admin'" color = "green" :key = "type"> {{type}} </a-tag>
        <a-tag v-if = "type == 'Supervisor'" color = "yellow" :key = "type"> {{type}} </a-tag>
      </span>

    </a-table>

    <a-modal
      :visible = "visibleConfirmModal"
      :footer = "null"
      @cancel = "closeConfirmModal()"
      style = "padding: 32px 32px 24px;">

      <a-icon type = "question-circle-o" style = "color: #faad14; font-size: 22px; margin-right: 16px" />
      <span> <b> Cuidado! </b> </span> <br />
      <span style = "margin-left: 38px;"> Realmente deseja deletar o usuário: {{usuario.nome}}? </span> <br />
      <span style = "margin-left: 38px;"> <i> Esta ação não poderá ser desfeita. </i> </span> <br/>

      <div style = "text-align: right; margin-top: 20px;">
        <a-button @click = "closeConfirmModal()"> Cancelar </a-button>
        <a-button @click = "deletaUsuario()" type = "danger"> Deletar </a-button>
      </div> 
    </a-modal>
  </a-spin>
</template>

<script>
  import firebaseApp from '../../firebase-controller.js'

  const db = firebaseApp.database()
  const auth = firebaseApp.auth()

  export default {
    data () {
      return {
        role: null,
        loading: true,
        usuarios: [],
        usuario: '',
        searchRA: '',
        searchNome: '',
        columns: [{
          title: 'RA',
          dataIndex: 'ra',
          key: 'ra',
          scopedSlots: {
            filterDropdown: 'filterDropdownRA',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) => record.ra.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.raInput.focus()
              })
            }
          }
        }, {
          title: 'Nome',
          dataIndex: 'nome',
          key: 'nome',
          scopedSlots: {
            filterDropdown: 'filterDropdownNome',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) => record.nome.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.nomeInput.focus()
              })
            }
          }
        }, {
          title: 'Curso',
          dataIndex: 'curso',
          key: 'curso',
          filters: this.populaFiltroCursos(),
          onFilter: (value, record) => record.curso === value
        }, {
          title: 'Tipo de Usuário',
          dataIndex: 'type',
          scopedSlots: { customRender: 'statusTipo' },
          key: 'type',
          filters: [{
            'text': 'Comum',
            'value': 'Comum'
          }, {
            'text': 'Supervisor',
            'value': 'Supervisor'
          }, {
            'text': 'admin',
            'value': 'admin'
          }],
          onFilter: (value, record) => record.type === value
        }, {
          title: 'Ações',
          dataIndex: 'id',
          key: 'acoes',
          align: 'center',
          scopedSlots: { customRender: 'actions' }
        }],
        visibleConfirmModal: false
      }
    },
    beforeMount: function () {
      let _this = this
      _this.loading = true

      db.ref('Usuarios').orderByKey().on('value', function (snapshot) {
        _this.usuarios = []
        _this.loading = true

        snapshot.forEach(function (item) {
          if (auth.currentUser.uid !== item.key) {
            _this.usuarios.push({
              'id': item.key,
              'ra': item.val().RA,
              'email': item.val().Email,
              'type': item.val().role,
              'nome': item.val().Nome + ' ' + item.val().Sobrenome,
              'curso': item.val().Curso
            })
          }
        })
        _this.loading = false
      })

      db.ref('Usuarios/' + auth.currentUser.uid + '/role').on('value', function (snapshot) {
        _this.loading = true
        _this.role = snapshot.val()
        _this.loading = false
      })
    },
    methods: {
      handleSearch (inputText, selectedKeys, confirm) {
        confirm()
        this[inputText] = selectedKeys[0]
      },
      handleReset (inputText, clearFilters) {
        clearFilters()
        this[inputText] = ''
      },
      showConfirmModal (id) {
        this.usuario = this.usuarios[this.usuarios.map(function (u) { return u.id }).indexOf(id)]
        this.visibleConfirmModal = true
      },
      closeConfirmModal () {
        this.visibleConfirmModal = false
        this.usuario = ''
      },
      populaFiltroCursos () {
        var cursos = []
        db.ref('Controle/Cursos').orderByKey().on('value', function (snapshot) {
          snapshot.forEach(function (item) {
            cursos.push({
              'text': item.key,
              'value': item.key
            })
          })
        })

        return cursos
      },
      deletaUsuario () {
        let _this = this

        _this.visibleConfirmModal = false
        db.ref('Usuarios').child(_this.usuario.id).remove().then(function () {
          _this.$notification.success({
            message: 'Yey!',
            description: 'Usuário deletado com sucesso.'
          })
        }).catch(() => {
          _this.$notification.error({
            message: 'Yey!',
            description: 'Falha ao deletar Usuário ' + _this.usuario
          })
        })

        _this.usuario = ''
      },
      promoveUsuario (id) {
        this.usuario = this.usuarios[this.usuarios.map(function (u) { return u.id }).indexOf(id)]
        if (this.usuario.type === 'Comum') {
          db.ref('Usuarios').child(this.usuario.id).update({role: 'Supervisor'}).then(() => {
            this.$notification.success({
              message: 'Yey!',
              description: 'Usuário promovido com sucesso.'
            })
          }).catch(() => {
            this.$notification.error({
              message: 'Yey!',
              description: 'Falha ao promover Usuário ' + this.usuario.nome
            })
          })
        } else if (this.usuario.type === 'Supervisor') {
          db.ref('Usuarios').child(this.usuario.id).update({role: 'admin'}).then(() => {
            this.$notification.success({
              message: 'Yey!',
              description: 'Usuário promovido com sucesso.'
            })
          }).catch(() => {
            this.$notification.error({
              message: 'Yey!',
              description: 'Falha ao promover Usuário ' + this.usuario.nome
            })
          })
        } else {
          this.$notification.warning({
            message: 'Opps..',
            description: 'Este usuário já está no nível alto baixo possível.'
          })
        }
      },
      rebaixaUsuario (id) {
        this.usuario = this.usuarios[this.usuarios.map(function (u) { return u.id }).indexOf(id)]
        if (this.usuario.type === 'admin') {
          db.ref('Usuarios').child(this.usuario.id).update({role: 'Supervisor'}).then(() => {
            this.$notification.success({
              message: 'Yey!',
              description: 'Usuário rebaixado com sucesso.'
            })
          }).catch(() => {
            this.$notification.error({
              message: 'Yey!',
              description: 'Falha ao rebaixar Usuário ' + this.usuario.nome
            })
          })
        } else if (this.usuario.type === 'Supervisor') {
          db.ref('Usuarios').child(this.usuario.id).update({role: 'Comum'}).then(() => {
            this.$notification.success({
              message: 'Yey!',
              description: 'Usuário rebaixado com sucesso.'
            })
          }).catch(() => {
            this.$notification.error({
              message: 'Yey!',
              description: 'Falha ao rebaixar Usuário ' + this.usuario.nome
            })
          })
        } else {
          this.$notification.warning({
            message: 'Opps..',
            description: 'Este usuário já está no nível mais baixo possível.'
          })
        }
      }
    }
  }
</script>

<style>
  .custom-filter-dropdown {
    padding: 8px;
    border-radius: 6px;
    background: #fff;
    box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
  }

  .custom-filter-dropdown input {
    width: 130px;
    margin-right: 8px;
  }

  .custom-filter-dropdown button {
    margin-right: 8px;
  }

  .highlight {
    color: #f50;
  }
</style>

