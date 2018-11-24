<template>
  <a-spin :spinning = "loading">
    <a-row style = "margin-bottom: 30px;">
      <a-col :span = "16" :offset = "4" style = "text-align: center">
        <h1> Aulas </h1>
      </a-col>
        
      <a-col :span = "4">
        <router-link to = "/agendamento">
          <a-button type = "primary" v-if = "role === 'admin' || role === 'Supervisor'" size = "large" icon = "plus" style = "width: 100%; margin-top: 8px;"> Novo </a-button>
        </router-link>
      </a-col>
    </a-row>

    <a-table :dataSource = "aulas" :columns = "columns" :locale = "{ filterConfirm: 'Ok', filterReset: 'Resetar', emptyText: 'Nenhuma Aula Agendada' }">
      <span slot = "expandedRowRender" slot-scope = "record" style = "margin: 0">
        <p> <b> Solicitante: </b> {{ record.solicitante.nomeCompleto }} </p>
      </span>

      <a-icon slot = "filterIconDate" slot-scope = "filtered" type = "calendar" :style = "{ color: filtered ? '#108ee9' : '#aaa' }" />
      <div slot = "filterDropdownHoraInicio" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
            <a-time-picker
              ref = "horaInicioInput"
              format = "HH:mm"
              :disabledHours = "disabledHours"
              :minuteStep = "10" 
              hideDisabledOptions
              :value = "searchHoraInicio"
              placeholder = "Hora Inicial:"
              @change = "(date, dateString) => searchByDate(date, dateString, 'searchHoraInicio', setSelectedKeys, confirm)"
            />
            <a-button @click = "() => handleResetDate('searchHoraInicio', clearFilters)"> Resetar </a-button>
      </div>

      <div slot = "filterDropdownHoraFim" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
            <a-time-picker
              ref = "horaFimInput"
              format = "HH:mm"
              :disabledHours = "disabledHours"
              :minuteStep = "10" 
              hideDisabledOptions
              :value = "searchHoraFim"
              placeholder = "Hora Inicial:"
              @change = "(date, dateString) => searchByDate(date, dateString, 'searchHoraFim', setSelectedKeys, confirm)"
            />
            <a-button @click = "() => handleResetDate('searchHoraFim', clearFilters)"> Resetar </a-button>
      </div>

      <a-icon slot = "filterIconHora" slot-scope = "filtered" type = "clock-circle-o" :style = "{ color: filtered ? '#108ee9' : '#aaa' }" />
      <div slot = "filterDropdownDataInicio" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
            <a-date-picker
              ref = "inicioInput"
              format = "DD/MM/YYYY"
              :value = "searchDataInicio"
              placeholder = "Data Inicial:"
              @change = "(date, dateString) => searchByDate(date, dateString, 'searchDataInicio', setSelectedKeys, confirm)"
            />
            <a-button @click = "() => handleResetDate('searchDataInicio', clearFilters)"> Resetar </a-button>
      </div>

      <div slot = "filterDropdownDataFim" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
            <a-date-picker
              ref = "fimInput"
              format = "DD/MM/YYYY"
              :value = "searchDataFim"
              placeholder = "Data Final:"
              @change = "(date, dateString) => searchByDate(date, dateString, 'searchDataFim', setSelectedKeys, confirm)"
            />
            <a-button @click = "() => handleResetDate('searchDataFim', clearFilters)"> Resetar </a-button>
      </div>

      <span slot = "actions" slot-scope = "text, record">
        <a-tooltip v-if = "record.status === 'Confirmada'" placement = "top">
          <template slot = "title">
            <span> Cancelar Aula </span>
          </template>

          <a-tag @click = "showModal(text)" color = "red" :key = "text">
            <a-icon type = "close" />
          </a-tag>
        </a-tooltip>

        <a-button v-else class = "ant-tag" disabled>
          <a-icon style = "color: #f5222d" type = "close" />
        </a-button>
      </span>

      <span slot = "diaSemana" slot-scope = "text">
        <span> {{ $moment().day(text).format("dddd") }} </span>
      </span>

      <span slot = "statusTag" slot-scope = "tag">
        <a-tag v-if = "tag === 'Confirmada'" color = "green" :key = "tag"> {{tag}} </a-tag>
        <a-tag v-if = "tag === 'Cancelada'" color = "red" :key = "tag"> {{tag}} </a-tag>
      </span>
    </a-table>

    <a-modal
      :visible = "visibleModal"
      :footer = "null"
      @cancel = "closeModal()"
      style = "padding: 32px 32px 24px;">

      <a-icon type = "question-circle-o" style = "color: #faad14; font-size: 22px; margin-right: 16px" />
      <span> <b> Cuidado! </b> </span> <br/><br/>
      <span > Realmente deseja cancelar esta Aula? </span> <br/>
      <span > <i> Esta ação não poderá ser desfeita. </i> </span> <br/>

      <div style = "text-align: right; margin-top: 20px;">
        <a-button @click = "closeModal()"> Voltar </a-button>
        <a-button :loading = "buttonLoading" @click = "cancelarAula()" type = "danger"> Cancelar Aula </a-button>
      </div> 
    </a-modal>
  </a-spin>    
</template>

<script>
  import firebaseApp from '../../firebase-controller.js'

  const auth = firebaseApp.auth()
  const db = firebaseApp.database()

  export default {
    data () {
      return {
        role: null,
        loading: true,
        buttonLoading: false,
        aulas: [],
        usuarios: [],
        modalAula: '',
        searchDataInicio: null,
        searchDataFim: null,
        searchHoraInicio: null,
        searchHoraFim: null,
        visibleModal: false,
        columns: [{
          title: 'Local',
          dataIndex: 'local',
          key: 'local',
          filters: this.populaFiltroLocais(),
          onFilter: (value, record) => record.local === value
        }, {
          title: 'Data Início',
          dataIndex: 'inicio',
          key: 'inicio',
          scopedSlots: {
            filterDropdown: 'filterDropdownDataInicio',
            filterIcon: 'filterIconDate'
          },
          onFilter: (value, record) => this.$moment(value, 'DD/MM/YYYY') <= this.$moment(record.inicio, 'DD/MM/YYYY'),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.inicioInput.focus()
              })
            }
          }
        }, {
          title: 'Data Fim',
          dataIndex: 'fim',
          key: 'fim',
          scopedSlots: {
            filterDropdown: 'filterDropdownDataFim',
            filterIcon: 'filterIconDate'
          },
          onFilter: (value, record) => this.$moment(value, 'DD/MM/YYYY') >= this.$moment(record.fim, 'DD/MM/YYYY'),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.fimInput.focus()
              })
            }
          }
        }, {
          title: 'Dia da Semana',
          dataIndex: 'diaSemana',
          key: 'diaSemana',
          scopedSlots: { customRender: 'diaSemana' },
          filters: [{
            text: 'Segunda-feira',
            value: '1'
          }, {
            text: 'Terça-feira',
            value: '2'
          }, {
            text: 'Quarta-feira',
            value: '3'
          }, {
            text: 'Quinta-feira',
            value: '4'
          }, {
            text: 'Sexta-feira',
            value: '5'
          }, {
            text: 'Sábado',
            value: '6'
          }],
          onFilter: (value, record) => record.diaSemana.toString() === value
        }, {
          title: 'Horário Início',
          dataIndex: 'horaInicio',
          key: 'horaInicio',
          scopedSlots: {
            filterDropdown: 'filterDropdownHoraInicio',
            filterIcon: 'filterIconHora'
          },
          onFilter: (value, record) => this.$moment(value, 'HH:mm') <= this.$moment(record.horaInicio, 'HH:mm'),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.horaInicioInput.focus()
              })
            }
          }
        }, {
          title: 'Horário Fim',
          dataIndex: 'horaFim',
          key: 'horaFim',
          scopedSlots: {
            filterDropdown: 'filterDropdownHoraFim',
            filterIcon: 'filterIconHora'
          },
          onFilter: (value, record) => this.$moment(value, 'HH:mm') >= this.$moment(record.horaFim, 'HH:mm'),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.horaFimInput.focus()
              })
            }
          }
        }, {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'statusTag' },
          filters: [{
            text: 'Confirmada',
            value: 'Confirmada'
          }, {
            text: 'Cancelada',
            value: 'Cancelada'
          }],
          onFilter: (value, record) => record.status === value
        }, {
          title: 'Ações',
          dataIndex: 'id',
          key: 'acoes',
          align: 'center',
          scopedSlots: { customRender: 'actions' }
        }]
      }
    },
    beforeMount: function () {
      let _this = this
      _this.loading = true

      db.ref('Usuarios/' + auth.currentUser.uid + '/role').on('value', function (snapshot) {
        _this.loading = true
        _this.role = snapshot.val()
        _this.loading = false
      })

      db.ref('Usuarios').orderByKey().on('value', function (snapshot) {
        _this.loading = true
        _this.usuarios = []

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

        db.ref('Reservas/aulas').orderByChild('Status').on('value', function (snapshot) {
          _this.loading = true
          _this.aulas = []

          snapshot.forEach(function (item) {
            _this.aulas.push({
              'id': item.key,
              'inicio': item.val().Inicio,
              'fim': item.val().Fim,
              'local': item.val().Local,
              'solicitante': _this.usuarios[_this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)],
              'diaSemana': item.val().diaSemana,
              'status': item.val().Status,
              'horaFim': item.val().horaFim,
              'horaInicio': item.val().horaInicio
            })
          })
          _this.aulas.reverse()
          _this.loading = false
        })
      })
    },
    methods: {
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
      disabledHours () {
        return [0, 1, 2, 3, 4, 5, 6, 23]
      },
      handleSearch (inputText, selectedKeys, confirm) {
        confirm()
        this[inputText] = selectedKeys[0]
      },
      searchByDate (date, dateString, inputText, setSelectedKeys, confirm) {
        setSelectedKeys(dateString ? [dateString] : [])
        this.handleSearch(inputText, [date], confirm)
      },
      handleResetDate (inputText, clearFilters) {
        clearFilters()
        this[inputText] = null
      },
      showEquipamentoModal (aula) {
        this.modalAula = aula
        this.visibleModal = true
      },
      closeModal () {
        this.visibleModal = false
        this.modalAula = ''
      },
      cancelarAula () {
        let _this = this
        _this.buttonLoading = true

        db.ref('Reservas/aulas').child(_this.modalAula).update({
          'Status': 'Cancelada'
        }).then(() => {
          _this.buttonLoading = false
          _this.closeModal()

          _this.$notification.success({
            message: 'Yey!..',
            description: 'Aula cancelada com sucesso.'
          })
        }).catch(() => {
          _this.buttonLoading = false

          _this.$notification.error({
            message: 'Opps..',
            description: 'Aula não cancelada.'
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
</style>