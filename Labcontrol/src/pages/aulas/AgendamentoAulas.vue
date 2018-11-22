<template>
  <a-spin :spinning = "loading">
    <a-row style = "margin-bottom: 30px; text-align: center;">
      <a-col :span = "4">
        <router-link to = "/aulas">
          <a-button size = "large">
            <a-icon type = "arrow-left" /> Voltar
          </a-button>
        </router-link>
      </a-col>

      <a-col :span = "16">
        <h1> Agendamento de Aulas </h1>
      </a-col>

      <a-col :span = "4">
        <a-button :disabled = "agendamentos.length === 0" size = "large" type = "primary" @click = "confirmarAgendamentos">
          <a-icon type = "check" /> Concluir
        </a-button>
      </a-col>
    </a-row>

    <a-form class = "form" layout = "inline" :autoFormCreate = "(form) => { this.form = form }">
      <a-row class = "form-solicitante" style = "margin: 0px 50px;">
        <a-form-item label = "Solicitante" fieldDecoratorId = "solicitante" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }], initialValue: solicitante }">
          <a-select v-model = "solicitante" size = "large" placeholder = "Selecione Solicitante" showSearch notFoundContent = "Usuário não Encontrado" :filterOption = "filterOption">
            <a-select-option v-for = "solicitante in usuarios" v-bind:key = "solicitante.id" :value = "solicitante.id"> {{solicitante.ra}} - {{solicitante.nome}} </a-select-option>
          </a-select>
        </a-form-item>
      </a-row>

      <a-row :gutter = "16" style = "text-align: center;">
        <a-col :span = "12">
          <a-form-item label = "Início" fieldDecoratorId = "dataInicial" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }], initialValue: dateInitInicial }">
            <a-date-picker format = "DD/MM/YYYY" :disabledDate = "disabledDateInicial" placeholder = "Selecione Data Inicial" style = "margin-left: 30px;" size = "large" @openChange = "handleStartOpenChange" />
          </a-form-item>
        </a-col>

        <a-col :span = "12">
          <a-form-item label = "Fim" fieldDecoratorId = "dataFinal" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }] }">
            <a-date-picker format = "DD/MM/YYYY" :disabledDate = "disabledDateFinal" placeholder = "Selecione Data Final" style = "margin-left: 30px;" size = "large" :open = "endOpen" @openChange = "handleEndOpenChange" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <hr/>

    <a-row style = "margin-bottom: 30px;">
      <a-col>
        <a-button type = "dashed" @click = "showAulaModal()" size = "large" icon = "plus" style = "width: 100%; margin-top: 8px;"> Novo </a-button>
      </a-col>
    </a-row>

    <a-table :dataSource = "agendamentos" :columns = "columns" :locale = "{ emptyText: 'Nenhum Agendamento Cadastrado' }">
      <span slot = "horas" slot-scope = "text, record">
        <span> {{ record.horaInicio.format('HH:mm') }} Até {{ record.horaFim.format('HH:mm') }} </span>
      </span>

      <span slot = "diaSemana" slot-scope = "text, record">
        <span> {{ $moment().day(record.diaSemana).format("dddd") }} </span>
      </span>

      <span slot = "actions" slot-scope = "text, record">
        <a-tooltip placement = "top">
          <template slot = "title">
            <span> Deletar Agendamento </span>
          </template>

          <a-tag @click = "deletaAgendamento(record)" color = "red" :key = "text">
            <a-icon type = "delete" />
          </a-tag>
        </a-tooltip>
      </span>    
    </a-table>

    <a-modal
      :visible = "visibleAulaModal"
      :footer = "null"
      @cancel = "closeAulaModal()"
      style = "padding: 32px 32px 32px; top: 20px;">

      <div slot = "title">
        <h5> <b> Novo Agendamento </b> </h5>
      </div>

      <a-form layout = "vertical" :autoFormCreate = "(form) => { this.formAgendamento = form }">
        <a-row :gutter = "16">
          <a-col :span = "24">
            <a-form-item label = "Dia da Semana" fieldDecoratorId = "diaSemana" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Selecione o Dia da Semana' }], initialValue: $moment(dataInicio).get('day') }">
              <a-select size = "large" placeholder = "Dia da Semana" showSearch notFoundContent = "Dia não Encontrado" :filterOption = "filterOption">
                <a-select-option :value = "1"> Segunda-Feira </a-select-option>
                <a-select-option :value = "2"> Terça-Feira </a-select-option>
                <a-select-option :value = "3"> Quarta-Feira </a-select-option>
                <a-select-option :value = "4"> Quinta-Feira </a-select-option>
                <a-select-option :value = "5"> Sexta-Feira </a-select-option>
                <a-select-option :value = "6"> Sábado </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter = "16">
          <a-col :span = "12">
            <a-form-item label = "Hora Início" fieldDecoratorId = "horaInicio" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Selecione Hora Inicial' }, { validator: this.checkTimeInicial }] }">
              <a-time-picker size = "large" format = 'HH:mm' placeholder = "Inicio" :disabledHours = "disabledHours" :minuteStep = "10" hideDisabledOptions />
            </a-form-item>  
          </a-col>

          <a-col :span = "12">
            <a-form-item label = "Hora Fim" fieldDecoratorId = "horaFim" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Selecione Hora Final' }, { validator: this.checkTimeFinal }] }">
              <a-time-picker size = "large" format = 'HH:mm' placeholder = "Fim" :disabledHours = "disabledHours" :minuteStep = "10" hideDisabledOptions />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter = "16">
          <a-col :span = "24">
            <a-form-item label = "Local" fieldDecoratorId = "local" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Selecione o Local' }] }">
              <a-select size = "large" placeholder = "Selecione Local"  showSearch notFoundContent = "Local não Encontrado" :filterOption = "filterOption">
                <a-select-option v-for = "local in locais" v-bind:key = "local.nome" :value = "local.nome">  {{local.nome}} </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style = "text-align: right; margin-bottom: 5px;">
          <a-button size = "large" @click = "closeAulaModal" style = "margin-right: 15px;"> Cancelar </a-button>
          <a-button size = "large" type = "primary" @click = "adicionaAgendamento"> Cadastrar </a-button>
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
        endOpen: false,
        solicitante: auth.currentUser.uid,
        dateInitInicial: this.$moment(),
        dataInicio: null,
        dataFim: null,
        agendamentos: [],
        usuarios: [],
        locais: [],
        visibleAulaModal: false,
        columns: [{
          title: 'Dia da Semana',
          dataIndex: 'dia',
          key: 'dia',
          scopedSlots: { customRender: 'diaSemana' }
        }, {
          title: 'Local',
          dataIndex: 'local',
          key: 'local'
        }, {
          title: 'Hora Reservada',
          dataIndex: ['horaInicio', 'horaFim'],
          key: 'horaInicio',
          scopedSlots: { customRender: 'horas' }
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

      if (_this.dateInitInicial.hour() < 7 || _this.dateInitInicial.hour() >= 23) {
        if (_this.dateInitInicial.hour() >= 23) {
          _this.dateInitInicial = _this.$moment(_this.dateInitInicial).add(1, 'day')
        }
        _this.dateInitInicial = _this.$moment(_this.dateInitInicial).set({
          'hour': '7',
          'minute': '0'
        })
      }

      if (_this.dateInitInicial.isoWeekday() === 7) {
        _this.dateInitInicial = _this.$moment(_this.dateInitInicial).day(1)
      }

      db.ref('Usuarios/' + auth.currentUser.uid + '/role').on('value', function (snapshot) {
        _this.loading = true
        _this.role = snapshot.val()
        _this.loading = false
      })

      db.ref('Locais').orderByKey().on('value', function (snapshot) {
        _this.loading = true
        _this.locais = []

        snapshot.forEach(function (item) {
          _this.locais.push({
            'nome': item.key
          })
        })
        _this.loading = false
      })

      db.ref('Usuarios').orderByKey().on('value', function (snapshot) {
        _this.usuarios = []
        _this.loading = true

        snapshot.forEach(function (item) {
          _this.usuarios.push({
            'id': item.key,
            'ra': item.val().RA,
            'email': item.val().Email,
            'nome': item.val().Nome + ' ' + item.val().Sobrenome
          })
        })
        _this.loading = false
      })
    },
    methods: {
      filterOption (input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      disabledDateInicial (current) {
        let week = this.$moment(current).isoWeekday()
        let maxDate = this.$moment().set({ 'date': '15', 'month': '06' })

        if (this.$moment().get('month') >= 7) {
          maxDate = this.$moment().set({ 'date': '20', 'month': '11' })
        }

        if (this.role === 'admin' || this.role === 'Supervisor') {
          maxDate = this.$moment(maxDate).add(2, 'year')
        }

        return (current && current < this.$moment().add(-1, 'days').endOf('day')) ||
          (week === 7) ||
          (current && current > maxDate)
      },
      disabledDateFinal (current) {
        let week = this.$moment(current).isoWeekday()
        let maxDate = this.$moment().set({ 'date': '15', 'month': '06' })

        if (this.$moment().get('month') >= 7) {
          maxDate = this.$moment().set({ 'date': '20', 'month': '11' })
        }

        if (this.role === 'admin' || this.role === 'Supervisor') {
          maxDate = this.$moment(maxDate).add('2', 'years')
        }

        if (this.form.getFieldValue('dataInicial')) {
          return (current && current < this.$moment().add(-1, 'days').endOf('day')) ||
            (current && current < this.$moment(this.form.getFieldValue('dataInicial'))) ||
            (week === 7) ||
            (current && current > maxDate)
        } else {
          return (current && current < this.$moment().add(-1, 'days').endOf('day')) ||
            (week === 7) ||
            (current && current > maxDate)
        }
      },
      disabledHours () {
        return [0, 1, 2, 3, 4, 5, 6, 23]
      },
      handleStartOpenChange (open) {
        if (!open) {
          this.endOpen = true
        }
      },
      handleEndOpenChange (open) {
        this.endOpen = open
      },
      showAulaModal () {
        let _this = this

        this.form.validateFields(async (err, values) => {
          if (!err) {
            _this.dataInicio = _this.$moment(values.dataInicial, 'DD/MM/YYYY')
            _this.dataFim = _this.$moment(values.dataFinal, 'DD/MM/YYYY')
            _this.visibleAulaModal = true
          }
        })
      },
      closeAulaModal () {
        this.visibleAulaModal = false
        this.formAgendamento.resetFields()
      },
      checkTimeInicial (rule, value, callback) {
        const form = this.formAgendamento
        if (value) {
          form.validateFields(['horaFim'], { force: true })
        }
        callback()
      },
      checkTimeFinal (rule, value, callback) {
        let resposta = 'Hora Final deve ser maior que a Inicial!'
        const form = this.formAgendamento
        var inicio = this.$moment(value).format('HH:mm')
        var fim = this.$moment(form.getFieldValue('horaInicio')).format('HH:mm')

        if (value && this.$moment(fim, 'HH:mm').isSameOrAfter(this.$moment(inicio, 'HH:mm'))) {
          callback(resposta)
        } else {
          callback()
        }
      },
      adicionaAgendamento () {
        let _this = this

        this.formAgendamento.validateFields(async (err, values) => {
          if (!err) {
            _this.agendamentos.push({
              'dia': values.diaSemana,
              'local': values.local,
              'diaSemana': values.diaSemana,
              'horaInicio': this.$moment(values.horaInicio, 'HH:mm'),
              'horaFim': this.$moment(values.horaFim, 'HH:mm')
            })

            this.closeAulaModal()
            _this.$notification.success({
              message: 'Yey!..',
              description: 'Agendamento inserido com sucesso.'
            })
          }
        })
      },
      deletaAgendamento (record) {
        this.agendamentos.splice(this.agendamentos.indexOf(record), 1)
      },
      confirmarAgendamentos () {
        let _this = this
        let i = 0

        this.form.validateFields(async (err, values) => {
          if (!err) {
            while (i !== _this.agendamentos.length) {
              let agendamento = _this.agendamentos[i]
              db.ref('Reservas/locais').orderByChild('Local').equalTo(agendamento.local).on('value', function (snapshot) {
                snapshot.forEach(function (reservaLocal) {
                  // let dataInicialLocal = _this.$moment(reservaLocal.val().Inicio, 'DD/MM/YYYY HH:mm')
                  // let dataFinalLocal = _this.$moment(reservaLocal.val().Fim, 'DD/MM/YYYY HH:mm')

                  // if ((_this.dataInicial <= dataFinalLocal) && (_this.dataFinal >= dataInicialLocal) && (reservaLocal.val().Status !== 'Cancelada')) {
                  //   _this.conflitos.push({
                  //     'id': reservaLocal.key,
                  //     'tipo': 'local',
                  //     'dados': reservaLocal.val()
                  //   })
                  // }
                })
              })

              db.ref('Reservas/aulas').orderByChild('Local').equalTo(agendamento.local).on('value', function (snapshot) {
                snapshot.forEach(function (reservaAula) {
                  console.log(reservaAula.val())
                  // let horaInicio = _this.$moment(reservaAula.val().horaInicio, 'HH:mm')
                  // let horaFim = _this.$moment(reservaAula.val().horaFim, 'HH:mm')

                  // let dataInicialAula = _this.$moment(reservaAula.val().Inicio, 'DD/MM/YYYY HH:mm').set({
                  //   'hour': horaInicio.get('hour'),
                  //   'minute': horaInicio.get('minute'),
                  //   'second': '0'
                  // }).day(reservaAula.val().diaSemana)

                  // let dataInicialFimAula = _this.$moment(reservaAula.val().Inicio, 'DD/MM/YYYY HH:mm').set({
                  //   'hour': horaFim.get('hour'),
                  //   'minute': horaFim.get('minute'),
                  //   'second': '0'
                  // }).day(reservaAula.val().diaSemana)

                  // let dataFinalAula = _this.$moment(reservaAula.val().Fim, 'DD/MM/YYYY HH:mm').set({
                  //   'hour': horaFim.get('hour'),
                  //   'minute': horaFim.get('minute'),
                  //   'second': '0'
                  // })

                  // while (dataInicialAula <= dataFinalAula) {
                  //   if ((_this.dataInicial <= dataInicialFimAula) && (_this.dataFinal >= dataInicialAula) && (reservaAula.val().Status !== 'Cancelada')) {
                  //     _this.conflitosAulas.push({
                  //       'id': reservaAula.key,
                  //       'dados': reservaAula.val()
                  //     })
                  //     break
                  //   }
                  //   dataInicialAula = dataInicialAula.add(7, 'day')
                  //   dataInicialFimAula = dataInicialFimAula.add(7, 'day')
                  // }
                })
              })
              i += 1
            }
          }
        })
      }
    }
  }
</script>

<style>
  .form .ant-form-explain {
    margin-left: 30px;
  }

  .form-solicitante .ant-form-item-control-wrapper, .form-solicitante .ant-row.ant-form-item {
    width: 70%;
    display: flex;
  }

  .form-solicitante .ant-form-item-label {
    margin-right: 15px;
  }
</style>