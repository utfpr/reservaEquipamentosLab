<template>
  <div>
  <!-- <a-spin :spinning = "loading"> -->
    <a-row style = "margin-bottom: 30px;">
      <a-col :span = "16" :offset = "4" style = "text-align: center">
        <h1> Reservas </h1>
      </a-col>

      <a-col :span = "4">
        <a-button type = "primary" @click = "showLocalModal()" size = "large" icon = "plus" style = "width: 100%; margin-top: 8px;"> Nova Reserva </a-button>
      </a-col>
    </a-row>
    <a-tabs defaultActiveKey="1">
      <a-tab-pane key="1">
        <span slot="tab">
          <a-icon class = "fa fa-flask" />
          Equipamentos
        </span>
        <a-table :dataSource = "Reservaequip" :columns = "columnsEquip" :locale = "{ filterConfirm: 'Ok', filterReset: 'Resetar', emptyText: 'Nenhum Equipamento Cadastrado' }">
          <span slot = "actions" slot-scope = "text">

            <a-tooltip placement = "top">
              <template slot = "title">
                <span> Confirmar Reserva</span>
              </template>

              <a-tag color = "green" :key = "text" >
                <router-link :to = "{ name: 'periodoReserva', params: { item: 'equipamento', valorItem: text} }">
                <a-icon style = "color: #52c41a" type = "check" />
                </router-link>
              </a-tag>
            </a-tooltip>

            <a-tooltip placement = "top">
              <template slot = "title">
                <span> Editar Reserva </span>
              </template>

              <a-tag @click = "showConfirmModal(text)" color = "orange" :key = "text" >
                <a-icon type = "edit" />
              </a-tag>
            </a-tooltip>

            <a-tooltip placement = "top">
              <template slot = "title">
                <span> Cancelar Reserva </span>
              </template>

              <a-tag @click = "showConfirmModal(text)" color = "red" :key = "text" >
                <a-icon type = "close" />
              </a-tag>
            </a-tooltip>
          </span>

          <a-icon slot = "filterIcon" slot-scope = "filtered" type='search' :style = "{ color: filtered ? '#108ee9' : '#aaa' }" />

          <div slot = "filterDropdownEquipamento" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
            <a-input
              ref = "EquipamentoInput"
              placeholder = 'Buscar Equipamento...'
              :value = "selectedKeys[0]"
              @change = "e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
              @pressEnter = "() => handleSearch('searchNome', selectedKeys, confirm)"
            />
            <a-button type = 'primary' @click = "() => handleSearch('searchEquipamento', selectedKeys, confirm)"> Buscar </a-button>
            <a-button @click = "() => handleReset('searchEquipamento', clearFilters)"> Resetar </a-button>
          </div>
          
          <div slot = "filterDropdownSolicitante" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
            <a-input
              ref = "solicitanteInput"
              placeholder = 'Buscar solicitante...'
              :value = "selectedKeys[0]"
              @change = "e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
              @pressEnter = "() => handleSearch('searchSolicitante', selectedKeys, confirm)"
            />
            <a-button type = 'primary' @click = "() => handleSearch('searchSolicitante', selectedKeys, confirm)"> Buscar </a-button>
            <a-button @click = "() => handleReset('searchSolicitante', clearFilters)"> Resetar </a-button>
          </div>

          <span slot = "statusTag" slot-scope = "tag">
            <a-tag v-if = "tag == 'Confirmada'" color = "green" :key = "tag"> {{tag}} </a-tag>
            <a-tag v-if = "tag == 'Cancelada'" color = "red" :key = "tag"> {{tag}} </a-tag>
            <a-tag v-if = "tag == 'Pendente'" color = "blue" :key = "tag"> {{tag}} </a-tag>
          </span>
        </a-table>

      </a-tab-pane>
      <a-tab-pane key="2">
        <span slot="tab">
          <a-icon class = "fa fa-map-marker-alt" />
          Locais
        </span>
          <a-table :dataSource = "Reservalocais" :columns = "columnsLocal" :locale = "{ filterConfirm: 'Ok', filterReset: 'Resetar', emptyText: 'Nenhum Local Cadastrado' }">
            <span slot = "actions" slot-scope = "text">
              <a-tooltip v-if = "role === 'admin' || role === 'Supervisor'" placement = "top">
                <template slot = "title">
                  <span> Confirmar Reserva </span>
                </template>

                <a-tag color = "green" :key = "text" >
                  <router-link :to = "{ name: 'periodoReserva', params: { item: 'local', valorItem: text} }">
                  <a-icon style = "color: #52c41a" type = "database" />
                  </router-link>
                </a-tag>
              </a-tooltip>

              <a-tooltip v-if = "role === 'admin' || role === 'Supervisor'" placement = "top">
                <template slot = "title">
                  <span> Cancelar Reserva </span>
                </template>

                <a-tag @click = "showConfirmModal(text)" color = "red" :key = "text" >
                  <a-icon type = "delete" />
                </a-tag>

              </a-tooltip>
            </span>

            <a-icon slot = "filterIcon" slot-scope = "filtered" type='search' :style = "{ color: filtered ? '#108ee9' : '#aaa' }" />
            
            <!-- <div slot = "filterDropdownNome" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
              <a-input
                ref = "nomeInput"
                placeholder = 'Buscar nome...'
                :value = "selectedKeys[0]"
                @change = "e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                @pressEnter = "() => handleSearch('searchNome', selectedKeys, confirm)"
              />
              <a-button type = 'primary' @click = "() => handleSearch('searchNome', selectedKeys, confirm)"> Buscar </a-button>
              <a-button @click = "() => handleReset('searchNome', clearFilters)"> Resetar </a-button>
            </div> -->

            <div slot = "filterDropdownSolicitante" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
              <a-input
                ref = "solicitanteInput"
                placeholder = 'Buscar solicitante...'
                :value = "selectedKeys[0]"
                @change = "e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                @pressEnter = "() => handleSearch('searchSolicitante', selectedKeys, confirm)"
              />
              <a-button type = 'primary' @click = "() => handleSearch('searchSolicitante', selectedKeys, confirm)"> Buscar </a-button>
              <a-button @click = "() => handleReset('searchSolicitante', clearFilters)"> Resetar </a-button>
            </div>
            
            <!-- <div slot = "filterDropdownSupervisor" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
              <a-input
                ref = "supervisorInput"
                placeholder = 'Buscar Supervisor...'
                :value = "selectedKeys[0]"
                @change = "e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                @pressEnter = "() => handleSearch('searchSupervisor', selectedKeys, confirm)"
              />
              <a-button type = 'primary' @click = "() => handleSearch('searchSupervisor', selectedKeys, confirm)"> Buscar </a-button>
              <a-button @click = "() => handleReset('searchSupervisor', clearFilters)"> Resetar </a-button>
            </div> -->
            <span slot = "statusTag" slot-scope = "tag">
              <a-tag v-if = "tag === 'Confirmada'" color = "green" :key = "tag"> {{tag}} </a-tag>
              <a-tag v-if = "tag === 'Cancelada'" color = "red" :key = "tag"> {{tag}} </a-tag>
              <a-tag v-if = "tag === 'Pendente'" color = "blue" :key = "tag"> {{tag}} </a-tag>
            </span>
          </a-table>
      </a-tab-pane>
    </a-tabs>

    
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
  </div>
  <!-- </a-spin> -->
</template>

<script>
  import firebaseApp from '../../firebase-controller.js'

  const db = firebaseApp.database()
  const auth = firebaseApp.auth()

  export default {
    data () {
      return {
        role: null,
        // loading: false,
        cursos: [],
        supervisores: [],
        usuarios: [],
        Reservaequip: [],
        Reservalocais: [],
        local: [],
        locais: [],
        equipamento: [],
        searchNome: '',
        searchSupervisor: '',
        columnsEquip: [{
          title: 'Equipamento',
          dataIndex: 'equipamento',
          key: 'equipamento',
          scopedSlots: {
            filterDropdown: 'filterDropdownEquipamento',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) => record.equipamento.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.equipamentoInput.focus()
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
          title: 'Solicitante',
          dataIndex: 'solicitante',
          key: 'solicitante',
          scopedSlots: {
            filterDropdown: 'filterDropdownSolicitante',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) => record.solicitante.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.solicitanteInput.focus()
              })
            }
          }
        }, {
          title: 'Data Inicio',
          dataIndex: 'dataInicio',
          key: 'dataInicio',
          scopedSlots: {
            filterDropdown: 'filterDropdownDataInicio',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) => record.dataInicio.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.dataInicioInput.focus()
              })
            }
          }
        }, {
          title: 'Data Fim',
          dataIndex: 'dataFim',
          key: 'dataFim',
          scopedSlots: {
            filterDropdown: 'filterDropdownDataFim',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) => record.dataFim.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.dataFimInput.focus()
              })
            }
          }
        }, {
        }, {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'statusTag' },
          filters: [{
            text: 'Cancelada',
            value: 'Cancelada'
          }, {
            text: 'Confirmada',
            value: 'Confirmada'
          }, {
            text: 'Pendente',
            value: 'Pendente'
          }],
          onFilter: (value, record) => record.status === value
        }, {
          title: 'Ações',
          dataIndex: 'acoes',
          key: 'acoes',
          align: 'center',
          scopedSlots: { customRender: 'actions' }
        }],
        columnsLocal: [{
          title: 'Local',
          dataIndex: 'local',
          key: 'local',
          filters: this.populaFiltroLocais(),
          onFilter: (value, record) => record.local === value
        }, {
          title: 'Solicitante',
          dataIndex: 'solicitante',
          key: 'solicitante',
          scopedSlots: {
            filterDropdown: 'filterDropdownSolicitante',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) => record.solicitante.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.solicitanteInput.focus()
              })
            }
          }
        }, {
          title: 'Data Inicio',
          dataIndex: 'dataInicio',
          key: 'dataInicio',
          scopedSlots: {
            filterDropdown: 'filterDropdownDataInicio',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) => record.dataInicio.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.dataInicioInput.focus()
              })
            }
          }
        }, {
          title: 'Data Fim',
          dataIndex: 'dataFim',
          key: 'dataFim',
          scopedSlots: {
            filterDropdown: 'filterDropdownDataFim',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) => record.dataFim.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.dataFimInput.focus()
              })
            }
          }
        }, {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'statusTag' },
          filters: [{
            text: 'Cancelada',
            value: 'Cancelada'
          }, {
            text: 'Confirmada',
            value: 'Confirmada'
          }, {
            text: 'Pendente',
            value: 'Pendente'
          }],
          onFilter: (value, record) => record.status === value
        }, {
          title: 'Ações',
          dataIndex: 'acoes',
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
      db.ref('Usuarios/' + auth.currentUser.uid + '/role').on('value', function (snapshot) {
        // _this.loading = true
        _this.role = snapshot.val()
        // _this.loading = false
        // todos os locais
        db.ref('Locais').orderByKey().on('value', function (snapshot) {
          // _this.loading = true
          _this.local = []

          snapshot.forEach(function (item) {
            _this.local.push({
              'local': item.key,
              'curso': item.val().Curso,
              'descricao': item.val().Descricao,
              'supervisor': item.val().Supervisor
            })
          })
          _this.loading = false
        })
        // todos os Supervisores
        db.ref('Usuarios').orderByChild('role').equalTo('Supervisor').on('value', (snapshot) => {
          // _this.loading = true
          _this.supervisores = []

          snapshot.forEach(function (item) {
            _this.supervisores.push({
              'key': item.key,
              'curso': item.val().Curso,
              'email': item.val().Email,
              'nome': item.val().Nome,
              'RA': item.val().RA
            })
          })
          _this.loading = false
        })
        // todos os Equipamentos
        db.ref('Equipamentos').orderByKey().on('value', function (snapshot) {
          // _this.loading = true

          snapshot.forEach(function (item) {
            _this.equipamento.push({
              'key': item.key,
              'patrimonio': item.val().Patrimonio,
              'nome': item.val().Nome,
              'local': item.val().Local,
              'status': item.val().Status
            })
          })
          _this.loading = false
        })
        // todos os Usuarios
        db.ref('Usuarios').orderByKey().on('value', function (snapshot) {
          // _this.loading = true

          snapshot.forEach(function (item) {
            _this.usuarios.push({
              'key': item.key,
              'curso': item.val().Curso,
              'email': item.val().Email,
              'nome': item.val().Nome,
              'RA': item.val().RA,
              'sobrenome': item.val().Sobrenome,
              'role': item.val().role
            })
          })
          _this.loading = false
        })
        if (_this.role === 'admin' || _this.role === 'Supervisor') {
          // Reservas dos Locais
          db.ref('Reservas/locais').orderByKey().on('value', function (snapshot) {
            // _this.loading = true
            snapshot.forEach(function (item) {
              var solicitante
              var supervisor
              var val = _this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)
              if (val === -1) {
                solicitante = 'Error'
              } else {
                solicitante = _this.usuarios[_this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)].nome
              }
              val = _this.supervisores.map(function (e) { return e.key }).indexOf(item.val().Supervisor)
              if (val === -1) {
                supervisor = 'Error'
              } else {
                supervisor = _this.supervisores[_this.supervisores.map(function (e) { return e.key }).indexOf(item.val().Supervisor)].nome
              }
              _this.Reservalocais.push({
                'local': item.val().Local,
                'solicitante': solicitante,
                'supervisor': supervisor, // esta dando erro tem que arrumar o banco.
                'dataInicio': item.val().Inicio,
                'dataFim': item.val().Fim,
                'status': item.val().Status
              })
            })
            _this.loading = false
          })
          // Reservas dos Equipamentos
          db.ref('Reservas/equipamentos').orderByKey().on('value', function (snapshot) {
            // _this.loading = true

            snapshot.forEach(function (item) {
              var solicitante
              var val = _this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)
              if (val === -1) {
                solicitante = 'Error'
              } else {
                solicitante = _this.usuarios[_this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)].nome
              }
              var local
              var equipamento
              val = _this.equipamento.map(function (e) { return e.key }).indexOf(item.val().Equipamento)
              if (val === -1) {
                local = 'Error'
              } else {
                local = _this.equipamento[_this.equipamento.map(function (e) { return e.key }).indexOf(item.val().Equipamento)].local
                equipamento = _this.equipamento[_this.equipamento.map(function (e) { return e.key }).indexOf(item.val().Equipamento)].patrimonio
              }
              _this.Reservaequip.push({
                'equipamento': equipamento,
                'local': local,
                'solicitante': solicitante,
                'dataInicio': item.val().Inicio,
                'dataFim': item.val().Fim,
                'status': item.val().Status
              })
            })
            _this.loading = false
          })
        } else {
          // Reservas dos Locais
          console.log(auth.currentUser.uid)
          db.ref('Reservas/locais').orderByChild('Solicitante').equalTo(auth.currentUser.uid).on('value', function (snapshot) {
            // _this.loading = true
            console.log('entrou')
            snapshot.forEach(function (item) {
              console.log('item =', item.val())
              var solicitante
              var supervisor
              var val = _this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)
              if (val === -1) {
                solicitante = 'Error'
              } else {
                solicitante = _this.usuarios[_this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)].nome
              }
              val = _this.supervisores.map(function (e) { return e.key }).indexOf(item.val().Supervisor)
              if (val === -1) {
                supervisor = 'Error'
              } else {
                supervisor = _this.supervisores[_this.supervisores.map(function (e) { return e.key }).indexOf(item.val().Supervisor)].nome
              }
              _this.Reservalocais.push({
                'local': item.val().Local,
                'solicitante': solicitante,
                'supervisor': supervisor, // esta dando erro tem que arrumar o banco.
                'dataInicio': item.val().Inicio,
                'dataFim': item.val().Fim,
                'status': item.val().Status
              })
            })
            _this.loading = false
          })
          // Reservas dos Equipamentos
          db.ref('Reservas/equipamentos').orderByChild('Solicitante').equalTo(auth.currentUser.uid).on('value', function (snapshot) {
            // _this.loading = true

            snapshot.forEach(function (item) {
              var solicitante
              var val = _this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)
              if (val === -1) {
                solicitante = 'Error'
              } else {
                solicitante = _this.usuarios[_this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)].nome
              }
              var local
              var equipamento
              val = _this.equipamento.map(function (e) { return e.key }).indexOf(item.val().Equipamento)
              if (val === -1) {
                local = 'Error'
              } else {
                local = _this.equipamento[_this.equipamento.map(function (e) { return e.key }).indexOf(item.val().Equipamento)].local
                equipamento = _this.equipamento[_this.equipamento.map(function (e) { return e.key }).indexOf(item.val().Equipamento)].patrimonio
              }
              _this.Reservaequip.push({
                'equipamento': equipamento,
                'local': local,
                'solicitante': solicitante,
                'dataInicio': item.val().Inicio,
                'dataFim': item.val().Fim,
                'status': item.val().Status
              })
            })
            _this.loading = false
          })
        }
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
      filterOption (input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
