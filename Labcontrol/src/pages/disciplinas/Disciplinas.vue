<template>
  <a-spin :spinning = "loading">
    <a-row style = "margin-bottom: 30px;">
      <a-col :span = "16" :offset = "4" style = "text-align: center">
        <h1> Disciplinas </h1>
      </a-col>
      
      <a-col :span = "4">
        <a-button type = "primary" v-if = "role === 'admin' || role === 'Supervisor'" @click = "showDisciplinaModal()" size = "large" icon = "plus" style = "width: 100%; margin-top: 8px;"> Novo </a-button>
      </a-col>
    </a-row>

    <a-table :dataSource = "disciplinas" :columns = "columns" :locale = "{ filterConfirm: 'Ok', filterReset: 'Resetar', emptyText: 'Nenhuma Disciplina Cadastrada' }">
      <span slot = "actions" slot-scope = "text">
        <a-tooltip v-if = "role === 'admin' || role === 'Supervisor'" placement = "top">
          <template slot = "title">
            <span> Editar Disciplina </span>
          </template>

          <a-tag @click = "showAtualizaModal(text)" color = "orange" :key = "text">
            <a-icon type = "edit" />
          </a-tag>
        </a-tooltip>

        <a-tooltip v-if = "role === 'admin' || role === 'Supervisor'" placement = "top">
          <template slot = "title">
            <span> Deletar Disciplina </span>
          </template>

          <a-tag @click = "showConfirmModal(text)" color = "red" :key = "text">
            <a-icon type = "delete" />
          </a-tag>

        </a-tooltip>
      </span>

      <a-icon slot = "filterIcon" slot-scope = "filtered" type = "search" :style = "{ color: filtered ? '#108ee9' : '#aaa' }" />
      
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
      
      <div slot = "filterDropdownSupervisor" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
        <a-input
          ref = "supervisorInput"
          placeholder = 'Buscar Supervisor...'
          :value = "selectedKeys[0]"
          @change = "e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter = "() => handleSearch('searchSupervisor', selectedKeys, confirm)"
        />
        <a-button type = 'primary' @click = "() => handleSearch('searchSupervisor', selectedKeys, confirm)"> Buscar </a-button>
        <a-button @click = "() => handleReset('searchSupervisor', clearFilters)"> Resetar </a-button>
      </div>
    </a-table>

    <a-modal
      v-if = "role === 'admin' || role === 'Supervisor'"
      :visible = "visibleConfirmModal"
      :footer = "null"
      @cancel = "closeConfirmModal()"
      style = "padding: 32px 32px 24px;">

      <a-icon type = "question-circle-o" style = "color: #faad14; font-size: 22px; margin-right: 16px" />
      <span> <b> Cuidado! </b> </span> <br />
      <span style = "margin-left: 38px;"> Realmente deseja remover a disciplina: {{disciplina}}? </span> <br />
      <span style = "margin-left: 38px;"> <i> Esta ação não poderá ser desfeita. </i> </span> <br/>

      <div style = "text-align: right; margin-top: 20px;">
        <a-button @click = "closeConfirmModal()"> Cancelar </a-button>
        <a-button @click = "removeDisciplina()" type = "danger"> Deletar </a-button>
      </div> 
    </a-modal>

    <a-modal
      v-if = "role === 'admin' || role === 'Supervisor'"
      :visible = "visibleCursoModal"
      :footer = "null"
      @cancel = "closeDisciplinaModal()"
      style = "padding: 32px 32px 24px; top: 20px;">

      <div slot = "title">
        <h5 v-if = "edit"> <b> {{disciplina.nome}} </b> </h5>
        <h5 v-else > <b> Nova Disciplina </b> </h5>
      </div>

      <a-form layout = "vertical" :autoFormCreate = "(form) => { this.form = form }">
        <a-row :gutter = "16">
          <a-col :span = "24">
            <a-form-item label = "Disciplina" fieldDecoratorId = "nome" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }, { validator: this.checkUnique }], initialValue: disciplina.nome }">
              <a-input size = "large" placeholder = "Digite nome da disciplina" @focus = "checkInput" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter = "16">
          <a-col :span = "24">
            <a-form-item label = "Supervisor" fieldDecoratorId = "supervisor" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Selecione Supervisor' }], initialValue: disciplina.supervisor }">
              <a-select size = "large" placeholder = "Selecione supervisor" @focus = "checkSelect('supervisor')" showSearch notFoundContent = "Supervisor não Encontrado" :filterOption = "filterOption">
                <a-select-option v-for = "supervisor in supervisores" v-bind:key = "supervisor" :value = "supervisor"> {{supervisor}} </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style = "text-align: right; margin-bottom: 5px;">
          <a-button size = "large" @click = "closeDisciplinaModal()" style = "margin-right: 15px;"> Cancelar </a-button>
          
          <a-button :loading = "buttonLoading" v-if = "edit" size = "large" type = "primary" @click = "atualizaDisciplina"> Atualizar </a-button>
          <a-button :loading = "buttonLoading" v-else size = "large" type = "primary" @click = "cadastraDisciplina"> Cadastrar </a-button>
        </a-row>
      </a-form>
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
        buttonLoading: false,
        disciplinas: [],
        supervisores: [],
        disciplina: '',
        searchNome: '',
        searchSupervisor: '',
        columns: [{
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
          title: 'Supervisor',
          dataIndex: 'supervisor',
          key: 'supervisor',
          scopedSlots: {
            filterDropdown: 'filterDropdownSupervisor',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) => record.supervisor.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.supervisorInput.focus()
              })
            }
          }
        }, {
          title: 'Ações',
          dataIndex: 'nome',
          key: 'acoes',
          align: 'center',
          scopedSlots: { customRender: 'actions' }
        }],
        visibleConfirmModal: false,
        visibleCursoModal: false,
        edit: false
      }
    },
    beforeMount: function () {
      let _this = this
      _this.loading = true

      db.ref('Disciplinas').orderByKey().on('value', function (snapshot) {
        _this.loading = true
        _this.disciplinas = []

        snapshot.forEach(function (item) {
          _this.disciplinas.push({
            'nome': item.key,
            'supervisor': item.val().Supervisor
          })
        })
        _this.loading = false
      })

      db.ref('Usuarios').orderByChild('role').equalTo('Supervisor').on('value', (snapshot) => {
        _this.loading = true
        _this.supervisores = []

        snapshot.forEach(function (supervisor) {
          _this.supervisores.push(supervisor.val().Nome + ' ' + supervisor.val().Sobrenome)
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
      showConfirmModal (disciplina) {
        this.disciplina = disciplina
        this.visibleConfirmModal = true
      },
      closeConfirmModal () {
        this.visibleConfirmModal = false
        this.disciplina = ''
      },
      showDisciplinaModal () {
        this.visibleCursoModal = true
      },
      showAtualizaModal (disciplina) {
        this.disciplina = this.disciplinas[this.disciplinas.map(function (e) { return e.nome }).indexOf(disciplina)]
        this.edit = true
        this.showDisciplinaModal()
      },
      closeDisciplinaModal () {
        this.visibleCursoModal = false
        this.edit = false
        this.disciplina = ''
        this.form.resetFields()
      },
      checkUnique (rule, value, callback) {
        let resposta = 'Disciplina já existe!'
        if (value && this.disciplinas.some(e => e.nome === value) && this.disciplina.nome !== value) {
          callback(resposta)
        } else {
          callback()
        }
      },
      checkInput (e) {
        this.form.validateFields([e.target.id])
      },
      checkSelect (name) {
        this.form.validateFields([name])
      },
      filterOption (input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      async cadastraDisciplina () {
        let _this = this

        this.form.validateFields(async (err, values) => {
          if (!err) {
            _this.buttonLoading = true

            db.ref('Disciplinas').child(values.nome).update({
              'Supervisor': values.supervisor
            }).then((data) => {
              _this.$notification.success({
                message: 'Yey!..',
                description: 'Disciplina ' + values.nome + ' cadastrada com sucesso.'
              }, 1500)
              this.closeDisciplinaModal()
              _this.buttonLoading = false
            }).catch((err) => {
              _this.$notification.error({
                message: 'Opps..',
                description: 'Disciplina não cadastrada. Erro: ' + err
              })
              this.closeDisciplinaModal()
              _this.buttonLoading = false
            })
          }
        })
      },
      async atualizaDisciplina () {
        let _this = this

        this.form.validateFields(async (err, values) => {
          if (!err) {
            _this.buttonLoading = true

            db.ref('Disciplinas').child(values.nome).update({
              'Supervisor': values.supervisor
            }).then(() => {
              if (values.nome !== _this.disciplina.nome) {
                db.ref('Disciplinas').child(_this.disciplina.nome).remove()
              }

              _this.$notification.success({
                message: 'Yey!..',
                description: 'Disciplina atualizada com sucesso.'
              }, 1500)
              this.closeDisciplinaModal()
              _this.buttonLoading = false
            }).catch((err) => {
              _this.$notification.error({
                message: 'Opps..',
                description: 'Disciplina não atualizada. Erro: ' + err
              })
              this.closeDisciplinaModal()
              _this.buttonLoading = false
            })
          }
        })
      },
      removeDisciplina () {
        let _this = this
        _this.visibleConfirmModal = false

        db.ref('Disciplinas').child(_this.disciplina).remove().then(function () {
          _this.$notification.success({
            message: 'Yey!..',
            description: 'Disciplina removida com sucesso.'
          })
        }).catch((err) => {
          _this.$notification.error({
            message: 'Opps..',
            description: 'Disciplina não removida. Erro: ' + err
          })
        })

        _this.disciplina = ''
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
</style>
