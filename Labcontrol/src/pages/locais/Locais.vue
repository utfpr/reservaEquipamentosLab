<template>
  <a-spin :spinning = "loading">
    <a-row style = "margin-bottom: 30px;">
      <a-col :span = "16" :offset = "4" style = "text-align: center">
        <h1> Locais </h1>
      </a-col>
      
      <a-col :span = "4">
        <a-button type = "primary" v-if = "role === 'admin' || role === 'Supervisor'" @click = "showLocalModal()" size = "large" icon = "plus" style = "width: 100%; margin-top: 8px;"> Novo </a-button>
      </a-col>
    </a-row>

    <a-table :dataSource = "locais" :columns = "columns" :locale = "{ filterConfirm: 'Ok', filterReset: 'Resetar', emptyText: 'Nenhum Local Cadastrado' }">
      <span slot = "expandedRowRender" slot-scope = "record" style = "margin: 0">
        <p> <b> Descrição: </b> {{ record.descricao }} </p>
        <p>
          <b> Equipamentos: </b>
          <template v-for = "equipamento in equipamentos" v-if = "equipamento.local === record.nome">
            <a-popover v-bind:key = "equipamento.patrimonio">
              <template slot = "content">
                <p> <b> Nome: </b> {{ equipamento.nome }} </p>
                <span> <b> Status: </b> {{ equipamento.status }} </span>
              </template>

              <a-tag color = "blue"> {{ equipamento.patrimonio }} </a-tag>
            </a-popover>
          </template>
          <span v-if = "!equipamentos[equipamentos.map(function(e) { return e.local }).indexOf(record.nome)]"> Nenhum equipamento cadastrado ainda... </span>
        </p>
      </span>

      <span slot = "actions" slot-scope = "text">
        <a-tooltip placement = "top">
          <template slot = "title">
            <span> Reservar Local </span>
          </template>

          <a-tag color = "green" :key = "text" >
            <router-link :to = "{ name: 'periodoReserva', params: { objetoReserva: 'laboratorio', itemReserva: text} }">
             <a-icon style = "color: #52c41a" type = "database" />
            </router-link>
          </a-tag>
        </a-tooltip>

        <a-tooltip v-if = "role === 'admin' || role === 'Supervisor'" placement = "top">
          <template slot = "title">
            <span> Editar Local </span>
          </template>

          <a-tag @click = "showAtualizaModal(text)" color = "orange" :key = "text" >
            <a-icon type = "edit" />
          </a-tag>
        </a-tooltip>

        <a-tooltip v-if = "role === 'admin' || role === 'Supervisor'" placement = "top">
          <template slot = "title">
            <span> Deletar Local </span>
          </template>

          <a-tag @click = "showConfirmModal(text)" color = "red" :key = "text" >
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
      <span style = "margin-left: 38px;"> Realmente deseja deletar o local: {{local}}? </span> <br />
      <span style = "margin-left: 38px;"> <i> Esta ação não poderá ser desfeita. </i> </span> <br/>

      <div style = "text-align: right; margin-top: 20px;">
        <a-button @click = "closeConfirmModal()"> Cancelar </a-button>
        <a-button @click = "deletaLocal()" type = "danger"> Deletar </a-button>
      </div> 
    </a-modal>

    <a-modal
      v-if = "role === 'admin' || role === 'Supervisor'"
      :visible = "visibleLocalModal"
      :footer = "null"
      @cancel = "closeLocalModal()"
      style = "padding: 32px 32px 24px; top: 20px;">
      
      <div slot = "title">
        <h5 v-if = "edit"> <b> {{local.nome}} </b> </h5>
        <h5 v-else > <b> Novo Local </b> </h5>
      </div>

      <a-form layout = "vertical" :autoFormCreate = "(form) => { this.form = form }">
        <a-row :gutter = "16">
          <a-col :span = "24">
            <a-form-item label = "Sala" fieldDecoratorId = "nome" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }, { validator: this.checkUnique }], initialValue: local.nome }">
              <a-input size = "large" placeholder = "Digite bloco e sala" @focus = "checkInput" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter = "16">
          <a-col :span = "24">
            <a-form-item label = "Supervisor" fieldDecoratorId = "supervisor" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Selecione Supervisor' }], initialValue: local.supervisor }">
              <a-select size = "large" placeholder = "Selecione supervisor" @focus = "checkSelect('supervisor')" showSearch notFoundContent = "Supervisor não Encontrado" :filterOption = "filterOption">
                <a-select-option v-for = "supervisor in supervisores" v-bind:key = "supervisor" :value = "supervisor"> {{supervisor}} </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter = "16">
          <a-col :span = "24">
            <a-form-item label = "Cursos" fieldDecoratorId = "curso" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Selecione Curso' }], initialValue: local.curso }">
              <a-select size = "large" placeholder = "Selecione curso" @focus = "checkSelect('curso')" showSearch notFoundContent = "Curso não Encontrado" :filterOption = "filterOption">
                <a-select-option v-for = "curso in cursos" v-bind:key = "curso" :value = "curso"> {{curso}} </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter = "16">
          <a-col :span = "24">
            <a-form-item label = "Descrição" fieldDecoratorId = "descricao" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }], initialValue: local.descricao }">
              <a-textarea placeholder = "Digite descrição do laboratório" :autosize = "{ minRows: 3, maxRows: 6 }" @focus = "checkInput" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style = "text-align: right; margin-bottom: 5px;">
          <a-button size = "large" @click = "closeLocalModal()" style = "margin-right: 15px;"> Cancelar </a-button>
          
          <a-button v-if = "edit" size = "large" type = "primary" @click = "atualizaLocal"> Atualizar </a-button>
          <a-button v-else size = "large" type = "primary" @click = "cadastraLocal"> Cadastrar </a-button>
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
        locais: [],
        cursos: [],
        supervisores: [],
        equipamentos: [],
        local: '',
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
          title: 'Curso',
          dataIndex: 'curso',
          key: 'curso',
          filters: this.populaFiltroCursos(),
          onFilter: (value, record) => record.curso === value
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
        visibleLocalModal: false,
        edit: false
      }
    },
    beforeMount: function () {
      let _this = this
      _this.loading = true

      db.ref('Locais').orderByKey().on('value', function (snapshot) {
        _this.loading = true
        _this.locais = []

        snapshot.forEach(function (item) {
          _this.locais.push({
            'nome': item.key,
            'curso': item.val().Curso,
            'descricao': item.val().Descricao,
            'supervisor': item.val().Supervisor
          })
        })
        _this.loading = false
      })

      db.ref('Controle/Cursos').orderByKey().on('value', function (snapshot) {
        _this.loading = true
        _this.cursos = []

        snapshot.forEach(function (item) {
          _this.cursos.push(item.key)
        })
        _this.loading = false
      })

      db.ref('Equipamentos').orderByKey().on('value', function (snapshot) {
        _this.loading = true
        _this.equipamentos = []

        snapshot.forEach(function (item) {
          _this.equipamentos.push({
            'patrimonio': item.val().Patrimonio,
            'nome': item.val().Nome,
            'local': item.val().Local,
            'status': item.val().Status
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
      showConfirmModal (local) {
        this.local = local
        this.visibleConfirmModal = true
      },
      closeConfirmModal () {
        this.visibleConfirmModal = false
        this.local = ''
      },
      showLocalModal () {
        this.visibleLocalModal = true
      },
      showAtualizaModal (local) {
        this.local = this.locais[this.locais.map(function (e) { return e.nome }).indexOf(local)]
        this.edit = true
        this.showLocalModal()
      },
      closeLocalModal () {
        this.visibleLocalModal = false
        this.edit = false
        this.local = ''
        this.form.resetFields()
      },
      checkUnique (rule, value, callback) {
        let resposta = 'Local já existe!'
        if (value && this.locais.some(e => e.nome === value) && this.local.nome !== value) {
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
      async cadastraLocal () {
        let _this = this
        this.form.validateFields(async (err, values) => {
          if (!err) {
            db.ref('Locais').child(values.nome).update({
              'Supervisor': values.supervisor,
              'Curso': values.curso,
              'Descricao': values.descricao
            }).then((data) => {
              _this.$notification.success({
                message: 'Yey!..',
                description: 'Local ' + values.nome + ' cadastrado com sucesso.'
              }, 1500)
              this.closeLocalModal()
            }).catch((err) => {
              _this.$notification.error({
                message: 'Opps..',
                description: 'Local não cadastrado. Erro: ' + err
              })
              this.closeLocalModal()
            })
          }
        })
      },
      async atualizaLocal () {
        let _this = this
        this.form.validateFields(async (err, values) => {
          if (!err) {
            db.ref('Locais').child(values.nome).update({
              'Supervisor': values.supervisor,
              'Curso': values.curso,
              'Descricao': values.descricao
            }).then(() => {
              if (values.nome !== _this.local.nome) {
                db.ref('Locais').child(_this.local.nome).remove()
              }
              _this.$notification.success({
                message: 'Yey!..',
                description: 'Local atualizado com sucesso.'
              }, 1500)
              this.closeLocalModal()
            }).catch((err) => {
              _this.$notification.error({
                message: 'Opps..',
                description: 'Local não atualizado. Erro: ' + err
              })
              this.closeLocalModal()
            })
          }
        })
      },
      deletaLocal () {
        let _this = this
        _this.visibleConfirmModal = false

        db.ref('Locais').child(_this.local).remove().then(function () {
          _this.$notification.success({
            message: 'Yey!..',
            description: 'Local deletado com sucesso.'
          })
        }).catch((err) => {
          _this.$notification.error({
            message: 'Opps..',
            description: 'Local não deletado. Erro: ' + err
          })
        })

        _this.equipamento = ''
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
