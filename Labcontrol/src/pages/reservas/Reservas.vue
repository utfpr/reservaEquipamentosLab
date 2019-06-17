<template>
  <a-spin :spinning = "loading">
    <a-row style = "margin-bottom: 30px;">
      <a-col :span = "16" :offset = "4" style = "text-align: center">
        <h1> Reservas </h1>
      </a-col>

      <a-col :span = "4">
        <router-link to = "/reservar">
          <a-button type = "primary" size = "large" icon = "plus" style = "width: 100%; margin-top: 8px;"> Nova Reserva </a-button>
        </router-link>
      </a-col>
    </a-row>

    <a-tabs defaultActiveKey = "1">
      <a-tab-pane key = "1">
        <span slot = "tab">
          <a-icon class = "fa fa-flask" /> Equipamentos
        </span>

        <a-table :dataSource = "reservaEquipamentos" :columns = "columnsEquipamento" :locale = "{ filterConfirm: 'Ok', filterReset: 'Resetar', emptyText: 'Nenhum Equipamento Cadastrado' }">
          <span slot = "actions" slot-scope = "text, record">
            <a-tooltip v-if = "record.status === 'Pendente' && role !== 'Comum'" placement = "top">
              <template slot = "title">
                <span> Confirmar Reserva</span>
              </template>

              <a-tag @click = "confirmarReservaEquipamento(record)" color = "green" :key = "text" >
                <a-icon style = "color: #52c41a" type = "check" />
              </a-tag>
            </a-tooltip>

            <a-button v-else-if = "record.status !== 'Cancelada' && role !== 'Comum'" class = "ant-tag" disabled>
              <a-icon style = "color: #52c41a" type = "check" />
            </a-button>

            <a-tooltip v-if = "record.status === 'Pendente'" placement = "top">
              <template slot = "title">
                <span> Editar Reserva </span>
              </template>

              <a-tag color = "orange" :key = "text" >
                <router-link :to = "{ name: 'periodoReserva', params: { item: 'reservaEquipamento', valorItem: text }}">
                  <a-icon style = "color: #fa8c16;" type = "edit" />
                </router-link>
              </a-tag>
            </a-tooltip>

            <a-button v-else-if = "record.status !== 'Cancelada'" class = "ant-tag" disabled>
              <a-icon style = "color: #fa8c16;" type = "edit" />
            </a-button>

            <a-tooltip v-if = "record.status !== 'Cancelada'" placement = "top">
              <template slot = "title">
                <span> Cancelar Reserva </span>
              </template>

              <a-tag @click = "showEquipamentoModal(record)" color = "red" :key = "text" >
                <a-icon type = "close" />
              </a-tag>
            </a-tooltip>
          </span>

          <a-icon slot = "filterIcon" slot-scope = "filtered" type='search' :style = "{ color: filtered ? '#108ee9' : '#aaa' }" />
          <a-icon slot = "filterIconDate" slot-scope = "filtered" type = "calendar" :style = "{ color: filtered ? '#108ee9' : '#aaa' }" />

          <div slot = "filterDropdownEquipamento" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
            <a-input
              ref = "equipamentoInput"
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

          <div slot = "filterDropdownDataInicio" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
            <a-date-picker
              ref = "dataInicioInput"
              format = "DD/MM/YYYY"
              :value = "searchDataInicioEquipamento"
              placeholder = "Data Inicial:"
              @change = "(date, dateString) => searchByDate(date, dateString, 'searchDataInicioEquipamento', setSelectedKeys, confirm)"
            />
            <a-button @click = "() => handleResetDate('searchDataInicioEquipamento', clearFilters)"> Resetar </a-button>
          </div>

          <div slot = "filterDropdownDataFim" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
            <a-date-picker
              ref = "dataFimInput"
              format = "DD/MM/YYYY"
              :value = "searchDataFimEquipamento"
              placeholder = "Data Final:"
              @change = "(date, dateString) => searchByDate(date, dateString, 'searchDataFimEquipamento', setSelectedKeys, confirm)"
            />
            <a-button @click = "() => handleResetDate('searchDataFimEquipamento', clearFilters)"> Resetar </a-button>
          </div>

          <span slot = "statusTag" slot-scope = "tag">
            <a-tag v-if = "tag == 'Confirmada'" color = "green" :key = "tag"> {{tag}} </a-tag>
            <a-tag v-if = "tag == 'Cancelada'" color = "red" :key = "tag"> {{tag}} </a-tag>
            <a-tag v-if = "tag == 'Pendente'" color = "blue" :key = "tag"> {{tag}} </a-tag>
          </span>
        </a-table>
      </a-tab-pane>

      <a-tab-pane key = "2">
        <span slot = "tab">
          <a-icon class = "fa fa-map-marker-alt" /> Locais
        </span>
        
        <a-table :dataSource = "reservaLocais" :columns = "columnsLocal" :locale = "{ filterConfirm: 'Ok', filterReset: 'Resetar', emptyText: 'Nenhum Local Cadastrado' }">
          <span slot = "actions" slot-scope = "text, record">
            <a-tooltip v-if = "record.status === 'Pendente' && role !== 'Comum'" placement = "top">
              <template slot = "title">
                <span> Confirmar Reserva</span>
              </template>

              <a-tag @click = "confirmarReservaLocal(record)" color = "green" :key = "text" >
                <a-icon style = "color: #52c41a" type = "check" />
              </a-tag>
            </a-tooltip>

            <a-button v-else-if = "record.status !== 'Cancelada' && role !== 'Comum'" class = "ant-tag" disabled>
              <a-icon style = "color: #52c41a" type = "check" />
            </a-button>

            <a-tooltip v-if = "record.status === 'Pendente' " placement = "top">
              <template slot = "title">
                <span> Editar Reserva </span>
              </template>

              <a-tag color = "orange" :key = "text" >
                <router-link :to = "{ name: 'periodoReserva', params: { item: 'reservaLocal', valorItem: text }}">
                  <a-icon style = "color: #fa8c16;" type = "edit" />
                </router-link>
              </a-tag>
            </a-tooltip>

            <a-button v-else-if = "record.status !== 'Cancelada'" class = "ant-tag" disabled>
              <a-icon style = "color: #fa8c16;" type = "edit" />
            </a-button>

            <a-tooltip v-if = "record.status !== 'Cancelada'" placement = "top">
              <template slot = "title">
                <span> Cancelar Reserva </span>
              </template>

              <a-tag @click = "showLocalModal(record)" color = "red" :key = "text" >
                <a-icon type = "close" />
              </a-tag>
            </a-tooltip>
          </span>

          <a-icon slot = "filterIcon" slot-scope = "filtered" type = "search" :style = "{ color: filtered ? '#108ee9' : '#aaa' }" />
          <a-icon slot = "filterIconDate" slot-scope = "filtered" type = "calendar" :style = "{ color: filtered ? '#108ee9' : '#aaa' }" />
    
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

          <div slot = "filterDropdownDataInicio" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
            <a-date-picker
              ref = "dataInicioInput"
              format = "DD/MM/YYYY"
              :value = "searchDataInicioLocal"
              placeholder = "Data Inicial:"
              @change = "(date, dateString) => searchByDate(date, dateString, 'searchDataInicioLocal', setSelectedKeys, confirm)"
            />
            <a-button @click = "() => handleResetDate('searchDataInicioLocal', clearFilters)"> Resetar </a-button>
          </div>

          <div slot = "filterDropdownDataFim" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
            <a-date-picker
              ref = "dataFimInput"
              format = "DD/MM/YYYY"
              :value = "searchDataFimLocal"
              placeholder = "Data Final:"
              @change = "(date, dateString) => searchByDate(date, dateString, 'searchDataFimLocal', setSelectedKeys, confirm)"
            />
            <a-button @click = "() => handleResetDate('searchDataFimLocal', clearFilters)"> Resetar </a-button>
          </div>

          <span slot = "statusTag" slot-scope = "tag">
            <a-tag v-if = "tag === 'Confirmada'" color = "green" :key = "tag"> {{tag}} </a-tag>
            <a-tag v-if = "tag === 'Cancelada'" color = "red" :key = "tag"> {{tag}} </a-tag>
            <a-tag v-if = "tag === 'Pendente'" color = "blue" :key = "tag"> {{tag}} </a-tag>
          </span>
        </a-table>
      </a-tab-pane>
    </a-tabs>
    
    <a-modal
      :visible = "visibleEquipamentoModal"
      :footer = "null"
      @cancel = "closeModal()"
      style = "padding: 32px 32px 24px;">

      <a-icon type = "question-circle-o" style = "color: #faad14; font-size: 22px; margin-right: 16px" />
      <span> <b> Cuidado! </b> </span> <br/><br/>
      <span > Realmente deseja cancelar esta Reserva do Equipamento: <b><i> {{modalEquipamento.equipamento}} </i></b>? </span> <br/>

      <span v-if = "role === 'Supervisor' || role === 'admin'">
        <a-textarea v-model = "resposta" placeholder = "Digite o motivo do cancelamento aqui" :autosize = "{ minRows: 5, maxRows: 5 }" /> <br/><br/>
      </span>

      <span > <i> Esta ação não poderá ser desfeita. </i> </span> <br/>

      <div style = "text-align: right; margin-top: 20px;">
        <a-button @click = "closeModal()"> Voltar </a-button>
        <a-button :loading = "buttonLoading" @click = "cancelarReservaEquipamento(modalEquipamento)" type = "danger"> Cancelar Reserva </a-button>
      </div> 
    </a-modal>

    <a-modal
      :visible = "visibleLocalModal"
      :footer = "null"
      @cancel = "closeModal()"
      style = "padding: 32px 32px 24px;">

      <a-icon type = "question-circle-o" style = "color: #faad14; font-size: 22px; margin-right: 16px" />
      <span> <b> Cuidado! </b> </span> <br/><br/>
      <span > Realmente deseja cancelar esta Reserva de Local?: <b><i> {{modalLocal.local}} </i></b>? </span> <br/>
      
      <span v-if = "role === 'Supervisor' || role === 'admin'">
        <a-textarea v-model = "resposta" placeholder = "Digite o motivo do cancelamento aqui" :autosize = "{ minRows: 5, maxRows: 5 }" /><br/><br/>
      </span>
      <span > <i> Esta ação não poderá ser desfeita. </i> </span> <br/>

      <div style = "text-align: right; margin-top: 20px;">
        <a-button @click = "closeModal()"> Voltar </a-button>
        <a-button :loading = "buttonLoading" @click = "cancelarReservaLocal(modalLocal)" type = "danger"> Cancelar Reserva </a-button>
      </div> 
    </a-modal>
  </a-spin>
</template>

<script>
  import firebaseApp from '../../firebase-controller.js'
  import { sendEmail } from '../../emailAPI.js'

  const db = firebaseApp.database()
  const auth = firebaseApp.auth()

  export default {
    data () {
      return {
        role: null,
        loading: true,
        buttonLoading: false,
        resposta: '',
        usuarios: [],
        locais: [],
        equipamentos: [],
        reservaEquipamentos: [],
        reservaLocais: [],
        searchDataInicioEquipamento: null,
        searchDataInicioLocal: null,
        searchDataFimEquipamento: null,
        searchDataFimLocal: null,
        columnsEquipamento: [{
          title: 'Equipamento',
          dataIndex: 'equipamento.nome',
          key: 'equipamento.nome',
          scopedSlots: {
            filterDropdown: 'filterDropdownEquipamento',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) => record.equipamento.nome.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.equipamentoInput.focus()
              })
            }
          }
        }, {
          title: 'Local',
          dataIndex: 'equipamento.local',
          key: 'equipamento.local',
          filters: this.populaFiltroLocais(),
          onFilter: (value, record) => record.equipamento.local === value
        }, {
          title: 'Solicitante',
          dataIndex: 'solicitante.nomeCompleto',
          key: 'solicitante.key',
          scopedSlots: {
            filterDropdown: 'filterDropdownSolicitante',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) => record.solicitante.nomeCompleto.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.solicitanteInput.focus()
              })
            }
          }
        }, {
          title: 'Data Início',
          dataIndex: 'dataInicio',
          key: 'dataInicio',
          scopedSlots: {
            filterDropdown: 'filterDropdownDataInicio',
            filterIcon: 'filterIconDate'
          },
          onFilter: (value, record) => this.$moment(value, 'DD/MM/YYYY') <= this.$moment(record.dataInicio, 'DD/MM/YYYY'),
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
            filterIcon: 'filterIconDate'
          },
          onFilter: (value, record) => this.$moment(value, 'DD/MM/YYYY') >= this.$moment(record.dataFim, 'DD/MM/YYYY'),
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
            text: 'Pendente',
            value: 'Pendente'
          }, {
            text: 'Confirmada',
            value: 'Confirmada'
          }],
          onFilter: (value, record) => record.status === value
        }, {
          title: 'Ações',
          dataIndex: 'key',
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
          dataIndex: 'solicitante.nomeCompleto',
          key: 'solicitante.key',
          scopedSlots: {
            filterDropdown: 'filterDropdownSolicitante',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) => record.solicitante.nomeCompleto.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.solicitanteInput.focus()
              })
            }
          }
        }, {
          title: 'Data Início',
          dataIndex: 'dataInicio',
          key: 'dataInicio',
          scopedSlots: {
            filterDropdown: 'filterDropdownDataInicio',
            filterIcon: 'filterIconDate'
          },
          onFilter: (value, record) => this.$moment(value, 'DD/MM/YYYY') <= this.$moment(record.dataInicio, 'DD/MM/YYYY'),
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
            filterIcon: 'filterIconDate'
          },
          onFilter: (value, record) => this.$moment(value, 'DD/MM/YYYY') >= this.$moment(record.dataFim, 'DD/MM/YYYY'),
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
            text: 'Pendente',
            value: 'Pendente'
          }, {
            text: 'Confirmada',
            value: 'Confirmada'
          }],
          onFilter: (value, record) => record.status === value
        }, {
          title: 'Ações',
          dataIndex: 'key',
          key: 'acoes',
          align: 'center',
          scopedSlots: { customRender: 'actions' }
        }],
        modalEquipamento: '',
        modalLocal: '',
        visibleEquipamentoModal: false,
        visibleLocalModal: false
      }
    },
    beforeMount: function () {
      let _this = this
  
      db.ref('Usuarios/' + auth.currentUser.uid + '/role').on('value', function (snapshot) {
        _this.loading = true
        _this.role = snapshot.val()

        db.ref('Locais').orderByKey().on('value', function (snapshot) {
          _this.locais = []
          _this.loading = true

          snapshot.forEach(function (item) {
            _this.locais.push({
              'local': item.key,
              'curso': item.val().Curso,
              'descricao': item.val().Descricao,
              'supervisor': item.val().Supervisor
            })
          })
          _this.loading = false
        })

        db.ref('Equipamentos').orderByKey().on('value', function (snapshot) {
          _this.equipamentos = []
          _this.loading = true

          snapshot.forEach(function (item) {
            _this.equipamentos.push({
              'key': item.key,
              'patrimonio': item.val().Patrimonio,
              'nome': item.val().Nome,
              'local': item.val().Local,
              'status': item.val().Status
            })
          })
          _this.loading = false
        })

        db.ref('Usuarios').orderByKey().on('value', function (snapshot) {
          _this.usuarios = []
          _this.loading = true

          snapshot.forEach(function (item) {
            _this.usuarios.push({
              'key': item.key,
              'curso': item.val().Curso,
              'email': item.val().Email,
              'RA': item.val().RA,
              'nomeCompleto': item.val().Nome + ' ' + item.val().Sobrenome,
              'nome': item.val().Nome,
              'sobrenome': item.val().Sobrenome,
              'role': item.val().role
            })
          })
          _this.loading = false
        })

        if (_this.role === 'admin' || _this.role === 'Supervisor') {
          db.ref('Reservas/locais').orderByChild('Status').on('value', function (snapshot) {
            _this.reservaLocais = []
            _this.loading = true

            snapshot.forEach(function (item) {
              _this.reservaLocais.push({
                'key': item.key,
                'local': item.val().Local,
                'solicitante': _this.usuarios[_this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)],
                'dataInicio': item.val().Inicio,
                'dataFim': item.val().Fim,
                'status': item.val().Status
              })
            })
            _this.reservaLocais = _this.reservaLocais.reverse()
            _this.loading = false
          })

          db.ref('Reservas/equipamentos').orderByChild('Status').on('value', function (snapshot) {
            _this.reservaEquipamentos = []
            _this.loading = true

            snapshot.forEach(function (item) {
              _this.reservaEquipamentos.push({
                'key': item.key,
                'equipamento': _this.equipamentos[_this.equipamentos.map(function (e) { return e.key }).indexOf(item.val().Equipamento)],
                'solicitante': _this.usuarios[_this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)],
                'dataInicio': item.val().Inicio,
                'dataFim': item.val().Fim,
                'status': item.val().Status
              })
            })
            _this.reservaEquipamentos = _this.reservaEquipamentos.reverse()
            _this.loading = false
          })
        } else {
          db.ref('Reservas/locais').orderByChild('Solicitante').equalTo(auth.currentUser.uid).on('value', function (snapshot) {
            var desordenados = []
            _this.reservaLocais = []
            _this.loading = true

            snapshot.forEach(function (item) {
              if (item.val().Status === 'Confirmada') {
                _this.reservaLocais.push({
                  'key': item.key,
                  'local': item.val().Local,
                  'solicitante': _this.usuarios[_this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)],
                  'dataInicio': item.val().Inicio,
                  'dataFim': item.val().Fim,
                  'status': item.val().Status
                })
              } else {
                desordenados.push({
                  'key': item.key,
                  'local': item.val().Local,
                  'solicitante': _this.usuarios[_this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)],
                  'dataInicio': item.val().Inicio,
                  'dataFim': item.val().Fim,
                  'status': item.val().Status
                })
              }
            })
            desordenados = desordenados.sort(function (a, b) {
              var x = a.status.toLowerCase()
              var y = b.status.toLowerCase()
              if (x < y) { return -1 }
              if (x > y) { return 1 }
              return 0
            }).reverse()
            _this.reservaLocais = _this.reservaLocais.concat(desordenados)
            _this.loading = false
          })

          db.ref('Reservas/equipamentos').orderByChild('Solicitante').equalTo(auth.currentUser.uid).on('value', function (snapshot) {
            var desordenados = []
            _this.reservaEquipamentos = []
            _this.loading = true

            snapshot.forEach(function (item) {
              if (item.val().Status === 'Confirmada') {
                _this.reservaEquipamentos.push({
                  'key': item.key,
                  'id': item.val().Equipamento,
                  'equipamento': _this.equipamentos[_this.equipamentos.map(function (e) { return e.key }).indexOf(item.val().Equipamento)],
                  'solicitante': _this.usuarios[_this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)],
                  'dataInicio': item.val().Inicio,
                  'dataFim': item.val().Fim,
                  'status': item.val().Status
                })
              } else {
                desordenados.push({
                  'key': item.key,
                  'id': item.val().Equipamento,
                  'equipamento': _this.equipamentos[_this.equipamentos.map(function (e) { return e.key }).indexOf(item.val().Equipamento)],
                  'solicitante': _this.usuarios[_this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)],
                  'dataInicio': item.val().Inicio,
                  'dataFim': item.val().Fim,
                  'status': item.val().Status
                })
              }
            })
            desordenados = desordenados.sort(function (a, b) {
              var x = a.status.toLowerCase()
              var y = b.status.toLowerCase()
              if (x < y) { return -1 }
              if (x > y) { return 1 }
              return 0
            }).reverse()
            _this.reservaEquipamentos = _this.reservaEquipamentos.concat(desordenados)
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
      handleResetDate (inputText, clearFilters) {
        clearFilters()
        this[inputText] = null
      },
      searchByDate (date, dateString, inputText, setSelectedKeys, confirm) {
        setSelectedKeys(dateString ? [dateString] : [])
        this.handleSearch(inputText, [date], confirm)
      },
      filterOption (input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
      showEquipamentoModal (equipamento) {
        this.modalEquipamento = equipamento
        this.visibleEquipamentoModal = true
      },
      showLocalModal (local) {
        this.modalLocal = local
        this.visibleLocalModal = true
      },
      closeModal () {
        this.visibleLocalModal = false
        this.visibleEquipamentoModal = false
        this.modalEquipamento = ''
        this.modalLocal = ''
      },
      confirmarReservaEquipamento (record) {
        let _this = this

        db.ref('Reservas/equipamentos').child(record.key).update({
          'Status': 'Confirmada'
        }).then(() => {
          let user = record.solicitante
          let to = [user.nome + ' <' + user.email + '>']
          let textBody = 'Sua reserva foi Confirmada'
          let htmlBody = '<h3>Reserva confirmada</h3><br><p>Sua reserva do equipamento: <strong>' + record.equipamento.nome + '</strong> no período: <strong>' + record.dataInicio + ' até ' + record.dataFim + '</strong> foi <strong>confirmada</strong>.</p> <small>Este é um E-mail automático, por favor não responda</small>'

          sendEmail(to, 'Reserva de equipamento confirmada', textBody, htmlBody)

          _this.$notification.success({
            message: 'Yey!..',
            description: 'Reserva confirmada com sucesso.'
          })
        }).catch(() => {
          _this.$notification.error({
            message: 'Opps..',
            description: 'Reserva não confirmada.'
          })
        })
      },
      confirmarReservaLocal (record) {
        let _this = this

        db.ref('Reservas/locais').child(record.key).update({
          'Status': 'Confirmada'
        }).then(() => {
          let user = record.solicitante
          let to = [user.nome + ' <' + user.email + '>']
          let textBody = 'Sua reserva foi Confirmada'
          let htmlBody = '<h3>Reserva confirmada</h3><br><p>Sua reserva do local: <strong>' + record.local + '</strong> no período: <strong>' + record.dataInicio + ' até ' + record.dataFim + '</strong> foi <strong>confirmada</strong>.</p> <small>Este é um E-mail automático, por favor não responda</small>'

          sendEmail(to, 'Reserva de Local confirmada', textBody, htmlBody)

          _this.$notification.success({
            message: 'Yey!..',
            description: 'Reserva confirmada com sucesso.'
          })
        }).catch(() => {
          _this.$notification.error({
            message: 'Opps..',
            description: 'Reserva não confirmada.'
          })
        })
      },
      cancelarReservaEquipamento (record) {
        let _this = this
        _this.buttonLoading = true

        db.ref('Reservas/equipamentos').child(record.key).update({
          'Status': 'Cancelada'
        }).then(() => {
          let user = record.solicitante
          let to = [user.nome + ' <' + user.email + '>']
          let textBody = 'Sua reserva foi Cancelada'
          let htmlBody = '<h3>Reserva cancelada</h3><br><p>Sua reserva do equipamento: <strong>' + record.equipamento.nome + '</strong> no período: <strong>' + record.dataInicio + ' até ' + record.dataFim + '</strong> foi <strong>cancelada</strong>.</p>'
          if (_this.resposta !== '') {
            htmlBody += '<p>Sua reserva foi cancelada pelo motivo: ' + _this.resposta + '</p>'
          }
          htmlBody += '<small>Este é um E-mail automático, por favor não responda</small>'

          sendEmail(to, 'Reserva de equipamento cancelada', textBody, htmlBody)
          _this.buttonLoading = false
          _this.resposta = ''
          if (_this.role === 'Comum') {
            _this.$router.push('/home')
          } else {
            _this.closeModal()

            _this.$notification.success({
              message: 'Yey!..',
              description: 'Reserva cancelada com sucesso.'
            })
          }
        }).catch(() => {
          _this.buttonLoading = false
          _this.closeModal()
  
          _this.$notification.error({
            message: 'Opps..',
            description: 'Reserva não cancelada.'
          })
        })
      },
      cancelarReservaLocal (record) {
        let _this = this
        _this.buttonLoading = true

        db.ref('Reservas/locais').child(record.key).update({
          'Status': 'Cancelada'
        }).then(() => {
          let user = record.solicitante
          let to = [user.nome + ' <' + user.email + '>']
          let textBody = 'Sua reserva foi Cancelada'
          let htmlBody = '<h3>Reserva cancelada</h3><br><p>Sua reserva do local: <strong>' + record.local + '</strong> no período: <strong>' + record.dataInicio + ' até ' + record.dataFim + '</strong> foi <strong>cancelada</strong>.</p>'
          if (_this.resposta !== '') {
            htmlBody += '<p>Sua reserva foi cancelada pelo motivo: ' + _this.resposta + '</p>'
          }
          htmlBody += '<small>Este é um E-mail automático, por favor não responda</small>'

          sendEmail(to, 'Reserva de local cancelada', textBody, htmlBody)
          _this.resposta = ''
          _this.buttonLoading = false
          if (_this.role === 'Comum') {
            _this.$router.push('/home')
          } else {
            _this.closeModal()

            _this.$notification.success({
              message: 'Yey!..',
              description: 'Reserva cancelada com sucesso.'
            })
          }
        }).catch(() => {
          _this.buttonLoading = false
          _this.closeModal()

          _this.$notification.error({
            message: 'Opps..',
            description: 'Reserva não cancelada.'
          })
        })
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

  .ant-tabs-content.ant-tabs-content-animated {
    min-height: 350px;
  }
</style>
