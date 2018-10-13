<template>
  <a-row>
    <a-row style = "margin-bottom: 30px;">
      <a-col :span = "16" :offset = "4" style = "text-align: center">
        <h1> Equipamentos </h1>
      </a-col>
      
      <a-col :span = "4">
        <a-button type = "primary" v-if = "role === 'admin' || role === 'Supervisor'" @click = "showEquipamentoModal()" size = "large" icon = "plus" style = "width: 100%; margin-top: 8px;"> Novo </a-button>
      </a-col>
    </a-row>

    <a-table :dataSource = "equipamentos" :columns = "columns" :locale = "{ filterConfirm: 'Ok', filterReset: 'Resetar', emptyText: 'Nenhum Equipamento Cadastrado' }">
      <span slot = "expandedRowRender" slot-scope = "record" style = "margin: 0">
        <p> <b> Marca: </b> {{ record.marca }} </p>
        <p> <b> Curso: </b> {{ record.curso }} </p>
        <p> <b> Especificação: </b> {{ record.especificacao }} </p>
      </span>

      <span slot = "actions" slot-scope = "text">
        <a-tooltip placement = "top">
          <template slot = "title">
            <span> Baixar POP </span>
          </template>

          <a-tag color = "blue" :key = "text" >
            <a-icon type = "file-pdf" />
          </a-tag>
        </a-tooltip>

        <a-tooltip placement = "top">
          <template slot = "title">
            <span> Reservar Equipamento </span>
          </template>

          <a-tag color = "green" :key = "text" >
            <a-icon type = "database" />
          </a-tag>
        </a-tooltip>

        <a-tooltip v-if = "role === 'admin' || role === 'Supervisor'" placement = "top">
          <template slot = "title">
            <span> Editar Equipamento </span>
          </template>

          <a-tag @click = "showAtualizaModal(text)" color = "orange" :key = "text" >
            <a-icon type = "edit" />
          </a-tag>
        </a-tooltip>

        <a-tooltip v-if = "role === 'admin' || role === 'Supervisor'" placement = "top">
          <template slot = "title">
            <span> Deletar Equipamento </span>
          </template>

          <a-tag @click = "showConfirmModal(text)" color = "red" :key = "text" >
            <a-icon type = "delete" />
          </a-tag>
        </a-tooltip>
      </span>

      <a-icon slot = "filterIcon" slot-scope = "filtered" type='search' :style = "{ color: filtered ? '#108ee9' : '#aaa' }" />

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
      
      <div slot = "filterDropdownLocal" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
        <a-input
          ref = "localInput"
          placeholder = 'Buscar local...'
          :value = "selectedKeys[0]"
          @change = "e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter = "() => handleSearch('searchLocal', selectedKeys, confirm)"
        />
        <a-button type = 'primary' @click = "() => handleSearch('searchLocal', selectedKeys, confirm)"> Buscar </a-button>
        <a-button @click = "() => handleReset('searchLocal', clearFilters)"> Resetar </a-button>
      </div>
      
      <div slot = "filterDropdownPatrimonio" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
        <a-input
          ref = "patrimonioInput"
          placeholder = 'Buscar patrimônio...'
          :value = "selectedKeys[0]"
          @change = "e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter = "() => handleSearch('searchPatrimonio', selectedKeys, confirm)"
        />
        <a-button type = 'primary' @click = "() => handleSearch('searchPatrimonio', selectedKeys, confirm)"> Buscar </a-button>
        <a-button @click = "() => handleReset('searchPatrimonio', clearFilters)"> Resetar </a-button>
      </div>

      <span slot = "statusTag" slot-scope = "tag">
        <a-tag v-if = "tag == 'Normal'" color = "green" :key = "tag"> {{tag}} </a-tag>
        <a-tag v-if = "tag == 'Quebrado'" color = "red" :key = "tag"> {{tag}} </a-tag>
        <a-tag v-if = "tag == 'Em Manutenção'" color = "blue" :key = "tag"> {{tag}} </a-tag>
      </span>
    </a-table>

    <a-modal
      v-if = "role === 'admin' || role === 'Supervisor'"
      :visible = "visibleConfirmModal"
      :footer = "null"
      @cancel = "closeConfirmModal()"
      style = "padding: 32px 32px 24px;"
    >
      <a-icon type = "question-circle-o" style = "color: #faad14; font-size: 22px; margin-right: 16px" />
      <span> <b> Cuidado! </b> </span> <br />
      <span style = "margin-left: 38px;"> Realmente deseja deletar o equipamento: {{equipamento}}? </span> <br />
      <span style = "margin-left: 38px;"> <i> Esta ação não poderá ser desfeita. </i> </span> <br/>

      <div style = "text-align: right; margin-top: 20px;">
        <a-button @click = "closeConfirmModal()"> Cancelar </a-button>
        <a-button @click = "deletaEquipamento()" type = "danger"> Deletar </a-button>
      </div> 
    </a-modal>

    <a-modal
      v-if = "role === 'admin' || role === 'Supervisor'"
      :visible = "visibleEquipamentoModal"
      :footer = "null"
      @cancel = "closeEquipamentoModal()"
      style = "padding: 32px 32px 24px; top: 20px;"
    >
    <div slot = "title">
      <h5 v-if = "edit"> <b> {{equipamento.patrimonio}} </b> </h5>
      <h5 v-else > <b> Novo Equipamento </b> </h5>
    </div>

    <a-form layout = "vertical" @submit = "submitEquipamento">
      <a-row :gutter = "16">
        <a-col :span = "10">
          <a-form-item label = "Patrimônio">
            <a-input size = "large" placeholder = "Digite patrimônio" />
          </a-form-item>
        </a-col>

        <a-col :span = "14">
          <a-form-item label = "Nome">
            <a-input size = "large" placeholder = "Digite nome" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter = "16">
        <a-col :span = "18">
          <a-form-item label = "Cursos">
            <a-select size = "large" placeholder = "Selecione curso">
              <a-select-option v-for = "curso in cursos" v-bind:key = "curso" :value = "curso"> {{curso}} </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span = "6">
          <a-form-item label = "Locais">
            <a-select size = "large" placeholder = "Locais">
              <a-select-option v-for = "local in locais" v-bind:key = "local" :value = "local"> {{local}} </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter = "16">
        <a-col :span = "10">
          <a-form-item label = "Status">
            <a-select size = "large" placeholder = "Selecione status">
              <a-select-option value = "Normal"> Normal </a-select-option>
              <a-select-option value = "Quebrado"> Quebrado </a-select-option>
              <a-select-option value = "Em Manutenção"> Em Manutenção </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span = "14">
          <a-form-item label = "Marca">
            <a-input size = "large" placeholder = "Digite marca" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter = "16">
        <a-form-item label = "Especificação">
          <a-textarea placeholder = "Digite especificação" :autosize = "{ minRows: 3, maxRows: 6 }" />
        </a-form-item>
      </a-row>

      <a-row :gutter = "16">
        <a-form-item label = "Arquivo POP">
          <a-upload size = "large" :multiple = "false" :fileList = "pop" :beforeUpload = "beforeUpload">
            <a-button icon = "file-pdf"> Enviar Arquivo </a-button>
          </a-upload>
        </a-form-item>
      </a-row>

      <a-row style = "text-align: right; margin-bottom: 5px;">
        <a-button size = "large" @click = "closeEquipamentoModal()" style = "margin-right: 15px;"> Cancelar </a-button>
        
        <a-button size = "large" type = "primary" htmlType = 'submit'> Cadastrar </a-button>
      </a-row>
    </a-form>

    </a-modal>
  </a-row>
</template>

<script>
  import firebaseApp from '../../firebase-controller.js'

  const db = firebaseApp.database()
  const auth = firebaseApp.auth()

  export default {
    data () {
      return {
        role: null,
        equipamentos: [],
        locais: [],
        cursos: [],
        equipamento: '',
        pop: [],
        searchPatrimonio: '',
        searchNome: '',
        searchLocal: '',
        columns: [{
          title: 'Patrimônio',
          dataIndex: 'patrimonio',
          key: 'patrimonio',
          scopedSlots: {
            filterDropdown: 'filterDropdownPatrimonio',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) => record.patrimonio.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.patrimonioInput.focus()
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
          title: 'Local',
          dataIndex: 'local',
          key: 'local',
          filters: this.populaFiltroLocais(),
          onFilter: (value, record) => record.local === value
        }, {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'statusTag' },
          filters: [{
            text: 'Normal',
            value: 'Normal'
          }, {
            text: 'Quebrado',
            value: 'Quebrado'
          }, {
            text: 'Em Manutenção',
            value: 'Em Manutenção'
          }],
          onFilter: (value, record) => record.status === value
        }, {
          title: 'Ações',
          dataIndex: 'patrimonio',
          key: 'acoes',
          align: 'center',
          scopedSlots: { customRender: 'actions' }
        }],
        visibleConfirmModal: false,
        visibleEquipamentoModal: false,
        edit: false
      }
    },
    beforeMount: function () {
      let _this = this

      db.ref('Equipamentos').orderByKey().on('value', function (snapshot) {
        _this.equipamentos = []

        snapshot.forEach(function (item) {
          _this.equipamentos.push({
            'patrimonio': item.key,
            'nome': item.val().Nome,
            'local': item.val().Local,
            'status': item.val().Status,
            'curso': item.val().Curso,
            'marca': item.val().Marca,
            'especificacao': item.val().Especificacao
          })
        })
      })

      db.ref('Locais').orderByKey().on('value', function (snapshot) {
        _this.locais = []

        snapshot.forEach(function (item) {
          _this.locais.push(item.key)
        })
      })

      db.ref('Controle/Cursos').orderByKey().on('value', function (snapshot) {
        _this.cursos = []

        snapshot.forEach(function (item) {
          _this.cursos.push(item.key)
        })
      })

      db.ref('Usuarios/' + auth.currentUser.uid + '/role').on('value', function (snapshot) {
        _this.role = snapshot.val()
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
      populaFiltroLocais () {
        var locais = []
        db.ref('Locais').orderByKey().on('value', function (snapshot) {
          snapshot.forEach(function (item) {
            locais.push({
              'text': item.key,
              'value': item.key
            })
          })
        })

        return locais
      },
      showConfirmModal (equipamento) {
        this.equipamento = equipamento
        this.visibleConfirmModal = true
      },
      closeConfirmModal () {
        this.visibleConfirmModal = false
        this.equipamento = ''
      },
      showEquipamentoModal () {
        this.visibleEquipamentoModal = true
      },
      showAtualizaModal (equipamento) {
        this.equipamento = this.equipamentos[this.equipamentos.map(function (e) { return e.patrimonio }).indexOf(equipamento)]
        this.edit = true
        this.showEquipamentoModal()
      },
      closeEquipamentoModal () {
        this.visibleEquipamentoModal = false
        this.edit = false
        this.equipamento = ''
      },
      submitEquipamento () {
        console.log('oioioioioi')
      },
      deletaEquipamento () {
        let _this = this
        _this.visibleConfirmModal = false

        db.ref('Equipamentos').child(_this.equipamento).remove().then(function () {
          _this.$notify({
            group: 'notify',
            type: 'success',
            title: 'Yey!',
            text: 'Equipamento  <strong>' + _this.equipamento + '</strong> deletado com sucesso'
          })
        }).catch(() => {
          _this.$notify({
            group: 'notify',
            type: 'error',
            title: 'Yey!',
            text: 'Falha ao deletar Equipamento ' + _this.equipamento
          })
        })

        _this.equipamento = ''
      },
      beforeUpload (file) {
        if (this.pop.length === 1) {
          this.pop = this.pop[0]
        }
        this.pop = [...this.pop, file]

        return false
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
