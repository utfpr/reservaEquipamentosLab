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

    <a-tabs defaultActiveKey="1">
      <a-tab-pane key = "1">
        <span slot = "tab">
          <a-icon class = "fa fa-flask" /> Equipamentos
        </span>

        <a-table :dataSource = "Reservaequip" :columns = "columnsEquip" :locale = "{ filterConfirm: 'Ok', filterReset: 'Resetar', emptyText: 'Nenhum Equipamento Cadastrado' }">
          <span slot = "actions" slot-scope = "text, record">
            <a-tooltip v-if = "record.status === 'Pendente' && role !== 'Comum'" placement = "top">
              <template slot = "title">
                <span> Confirmar Reserva</span>
              </template>

              <a-tag @click = "confirmReserva(record.key, record)" color = "green" :key = "text" >
                <a-icon style = "color: #52c41a" type = "check" />
              </a-tag>
            </a-tooltip>

            <a-tooltip v-if = "record.status === 'Pendente' " placement = "top">
              <template slot = "title">
                <span> Editar Reserva </span>
              </template>

              <a-tag color = "orange" :key = "text" >
                <router-link :to = "{ name: 'periodoReserva', params: { item: 'equipamento', valorItem: text }}">
                  <a-icon style = "color: #fa8c16;" type = "edit" />
                </router-link>
              </a-tag>
            </a-tooltip>

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

          <div slot = "filterDropdownDataInicio'" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
            <a-input
              ref = "dataInicioInput"
              placeholder = 'Buscar data de inicio...'
              :value = "selectedKeys[0]"
              @change = "e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
              @pressEnter = "() => handleSearch('searchDataInicio', selectedKeys, confirm)"
            />
            <a-button type = 'primary' @click = "() => handleSearch('searchDataInicio', selectedKeys, confirm)"> Buscar </a-button>
            <a-button @click = "() => handleReset('searchDataInicio', clearFilters)"> Resetar </a-button>
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
        
        <a-table :dataSource = "Reservalocais" :columns = "columnsLocal" :locale = "{ filterConfirm: 'Ok', filterReset: 'Resetar', emptyText: 'Nenhum Local Cadastrado' }">
          <span slot = "actions" slot-scope = "text, record">
              <a-tooltip v-if = "record.status === 'Pendente'  && role !== 'Comum'" placement = "top">
                <template slot = "title">
                  <span> Confirmar Reserva</span>
                </template>

                <a-tag @click = "confirmReservaLocais(record.key, record)" color = "green" :key = "text" >
                  <a-icon style = "color: #52c41a" type = "check" />
                </a-tag>
              </a-tooltip>

              <a-tooltip v-if = "record.status === 'Pendente' " placement = "top">
                <template slot = "title">
                  <span> Editar Reserva </span>
                </template>

                <a-tag color = "orange" :key = "text" >
                  <router-link :to = "{ name: 'periodoReserva', params: { item: 'equipamento', valorItem: text }}">
                    <a-icon style = "color: #fa8c16;" type = "edit" />
                  </router-link>
                </a-tag>
              </a-tooltip>

              <a-tooltip v-if = "record.status !== 'Cancelada'" placement = "top">
                <template slot = "title">
                  <span> Cancelar Reserva </span>
                </template>

                <a-tag @click = "showLocalModal(record)" color = "red" :key = "text" >
                  <a-icon type = "close" />
                </a-tag>
            </a-tooltip>
          </span>

          <a-icon slot = "filterIcon" slot-scope = "filtered" type='search' :style = "{ color: filtered ? '#108ee9' : '#aaa' }" />
    
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
      @cancel = "closeEquipamentoModal()"
      style = "padding: 32px 32px 24px;">

      <a-icon type = "question-circle-o" style = "color: #faad14; font-size: 22px; margin-right: 16px" />
      <span> <b> Cuidado! </b> </span> <br/><br/>
      <span > Realmente deseja cancelar esta Reserva do Equipamento: <b><i> {{modalEquip.equipamento}} </i></b>? </span> <br/>

      <span v-if = "role === 'Supervisor' || role === 'admin'">
        <a-textarea v-model = "resposta" placeholder = "Digite o motivo do cancelamento aqui" :autosize = "{ minRows: 5, maxRows: 5 }" /> <br/><br/>
      </span>

      <span > <i> Esta ação não poderá ser desfeita. </i> </span> <br/>

      <div style = "text-align: right; margin-top: 20px;">
        <a-button @click = "closeEquipamentoModal()"> Voltar </a-button>
        <a-button @click = "cancelarReserva(modalEquip)" type = "danger"> Cancelar </a-button>
      </div> 
    </a-modal>

    <a-modal
      :visible = "visibleLocalModal"
      :footer = "null"
      @cancel = "closeLocalModal()"
      style = "padding: 32px 32px 24px;">

      <a-icon type = "question-circle-o" style = "color: #faad14; font-size: 22px; margin-right: 16px" />
      <span> <b> Cuidado! </b> </span> <br/><br/>
      <span > Realmente deseja cancelar esta Reserva de Local?: <b><i> {{modalLocal.local}} </i></b>? </span> <br/>
      
      <span v-if = "role === 'Supervisor' || role === 'admin'">
        <a-textarea v-model = "resposta" placeholder = "Digite o motivo do cancelamento aqui" :autosize = "{ minRows: 5, maxRows: 5 }" /><br/><br/>
      </span>
      <span > <i> Esta ação não poderá ser desfeita. </i> </span> <br/>

      <div style = "text-align: right; margin-top: 20px;">
        <a-button @click = "closeLocalModal()"> Voltar </a-button>
        <a-button @click = "cancelarReservaLocal(modalLocal)" type = "danger"> Cancelar </a-button>
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
        resposta: '',
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
          dataIndex: 'solicitante.nomeCompleto',
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
          dataIndex: 'id',
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
          dataIndex: 'local',
          key: 'acoes',
          align: 'center',
          scopedSlots: { customRender: 'actions' }
        }],
        visibleEquipamentoModal: false,
        modalEquip: '',
        modalLocal: '',
        visibleLocalModal: false,
        edit: false
      }
    },
    beforeMount: function () {
      let _this = this
      _this.loading = true
  
      db.ref('Usuarios/' + auth.currentUser.uid + '/role').on('value', function (snapshot) {
        _this.loading = true
        _this.role = snapshot.val()

        db.ref('Locais').orderByKey().on('value', function (snapshot) {
          _this.local = []
          _this.loading = true

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

        db.ref('Usuarios').orderByChild('role').equalTo('Supervisor').on('value', (snapshot) => {
          _this.supervisores = []
          _this.loading = true

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

        db.ref('Equipamentos').orderByKey().on('value', function (snapshot) {
          _this.equipamento = []
          _this.loading = true

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
          db.ref('Reservas/locais').orderByKey().on('value', function (snapshot) {
            _this.Reservalocais = []
            _this.loading = true

            snapshot.forEach(function (item) {
              var solicitante
              var supervisor
              var val = _this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)
              if (val === -1) {
                solicitante = 'Error'
              } else {
                solicitante = _this.usuarios[_this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)]
              }
              val = _this.supervisores.map(function (e) { return e.key }).indexOf(item.val().Supervisor)
              if (val === -1) {
                supervisor = 'Error'
              } else {
                supervisor = _this.supervisores[_this.supervisores.map(function (e) { return e.key }).indexOf(item.val().Supervisor)].nome
              }
              _this.Reservalocais.push({
                'key': item.key,
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

          db.ref('Reservas/equipamentos').orderByKey().on('value', function (snapshot) {
            _this.Reservaequip = []
            _this.loading = true

            snapshot.forEach(function (item) {
              var solicitante
              var val = _this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)
              if (val === -1) {
                solicitante = 'Error'
              } else {
                solicitante = _this.usuarios[_this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)]
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
                'key': item.key,
                'id': item.val().Equipamento,
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
          db.ref('Reservas/locais').orderByChild('Solicitante').equalTo(auth.currentUser.uid).on('value', function (snapshot) {
            _this.Reservalocais = []
            _this.loading = true

            snapshot.forEach(function (item) {
              console.log('item =', item.val())
              var solicitante
              var supervisor
              var val = _this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)
              if (val === -1) {
                solicitante = 'Error'
              } else {
                solicitante = _this.usuarios[_this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)]
              }
              val = _this.supervisores.map(function (e) { return e.key }).indexOf(item.val().Supervisor)
              if (val === -1) {
                supervisor = 'Error'
              } else {
                supervisor = _this.supervisores[_this.supervisores.map(function (e) { return e.key }).indexOf(item.val().Supervisor)].nome
              }
              _this.Reservalocais.push({
                'key': item.key,
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

          db.ref('Reservas/equipamentos').orderByChild('Solicitante').equalTo(auth.currentUser.uid).on('value', function (snapshot) {
            _this.Reservaequip = []
            _this.loading = true

            snapshot.forEach(function (item) {
              var solicitante
              var val = _this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)
              if (val === -1) {
                solicitante = 'Error'
              } else {
                solicitante = _this.usuarios[_this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)]
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
                'key': item.key,
                'id': item.val().Equipamento,
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
      showEquipamentoModal (equipamento) {
        this.modalEquip = equipamento
        this.visibleEquipamentoModal = true
      },
      showLocalModal (local) {
        this.modalLocal = local
        this.visibleLocalModal = true
      },
      confirmReserva (key, equipamento) {
        var _this = this
        db.ref('Reservas/equipamentos').child(key).update({
          'Status': 'Confirmada'
        }).then(() => {
          let user = _this.Reservaequip[_this.Reservaequip.map(function (e) { return e.key }).indexOf(key)].solicitante
          let to = [user.nome + ' <' + user.email + '>']
          let textBody = 'Sua reserva foi Confirmada'
          let htmlBody = '<h3>Reserva confirmada</h3><br><p>Sua reserva do equipamento: <strong>' + equipamento.equipamento + '</strong> no período: <strong>' + equipamento.dataInicio + ' até ' + equipamento.dataFim + '</strong> foi <strong>confirmado</strong>.</p> <small>Este é um E-mail automático, por favor não responda</small>'

          sendEmail(to, 'Reserva de equipamento confirmada', textBody, htmlBody)
        })
      },
      confirmReservaLocais (key, locais) {
        // var _this = this
        db.ref('Reservas/locais').child(key).update({
          'Status': 'Confirmada'
        }).then(() => {
          let user = locais.solicitante
          let to = [user.nome + ' <' + user.email + '>']
          let textBody = 'Sua reserva foi Confirmada'
          let htmlBody = '<h3>Reserva confirmada</h3><br><p>Sua reserva do local: <strong>' + locais.local + '</strong> no período: <strong>' + locais.dataInicio + ' até ' + locais.dataFim + '</strong> foi <strong>confirmada</strong>.</p> <small>Este é um E-mail automático, por favor não responda</small>'
          sendEmail(to, 'Reserva de Local confirmada', textBody, htmlBody)
        })
      },
      cancelarReserva (equipamento) {
        var _this = this
        db.ref('Reservas/equipamentos').child(equipamento.key).update({
          'Status': 'Cancelada'
        }).then(() => {
          let user = equipamento.solicitante
          let to = [user.nome + ' <' + user.email + '>']
          let textBody = 'Sua reserva foi Cancelada'
          let htmlBody = '<h3>Reserva cancelada</h3><br><p>Sua reserva do equipamento: <strong>' + equipamento.equipamento + '</strong> no período: <strong>' + equipamento.dataInicio + ' até ' + equipamento.dataFim + '</strong> foi <strong>cancelada</strong>.</p>'
          if (_this.resposta !== '') {
            htmlBody += '<p>Sua reserva foi cancelada pelo motivo: ' + _this.resposta + '</p>'
          }
          htmlBody += '<small>Este é um E-mail automático, por favor não responda</small>'

          sendEmail(to, 'Reserva de equipamento cancelada', textBody, htmlBody)
          _this.resposta = ''
          if (_this.role === 'Comum') {
            _this.$router.push('/home')
          } else {
            _this.closeEquipamentoModal()
          }
        })
      },
      cancelarReservaLocal (local) {
        var _this = this
        db.ref('Reservas/locais').child(local.key).update({
          'Status': 'Cancelada'
        }).then(() => {
          let user = local.solicitante
          let to = [user.nome + ' <' + user.email + '>']
          let textBody = 'Sua reserva foi Cancelada'
          let htmlBody = '<h3>Reserva cancelada</h3><br><p>Sua reserva do local: <strong>' + local.local + '</strong> no período: <strong>' + local.dataInicio + ' até ' + local.dataFim + '</strong> foi <strong>cancelada</strong>.</p>'
          if (_this.resposta !== '') {
            htmlBody += '<p>Sua reserva foi cancelada pelo motivo: ' + _this.resposta + '</p>'
          }
          htmlBody += '<small>Este é um E-mail automático, por favor não responda</small>'

          sendEmail(to, 'Reserva de local cancelada', textBody, htmlBody)
          _this.resposta = ''
          if (_this.role === 'Comum') {
            _this.$router.push('/home')
          } else {
            _this.closeLocalModal()
          }
        })
      },
      closeEquipamentoModal () {
        this.visibleEquipamentoModal = false
        this.modalEquip = ''
      },
      closeLocalModal () {
        this.visibleLocalModal = false
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
