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
        <a-button :loading = "buttonLoadingConcluir" :disabled = "agendamentos.length === 0" size = "large" type = "primary" @click = "confirmarAgendamentos">
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

    <a-modal :visible = "modal.visible" :footer = "null" @cancel = "closeModal()" style = "padding: 32px 32px 24px;">
      <a-icon type = "question-circle-o" style = "color: #faad14; font-size: 22px; margin-right: 16px" />
      <span> <b> Deseja confirmar seus agendamentos?! </b> </span> <br/><br/>
      <small>
        <p><a-avatar :size = "15" style = "backgroundColor: #ff4d4f;" /> Conflitos com aulas (não serão confirmados). </p>
        <p><a-avatar :size = "15" style = "backgroundColor: #faad14;" /> Conflitos com reservas de locais (agendamentos serão confirmados, mas reservas de locais conflitantes serão cancelados). </p>
        <p><a-avatar :size = "15" style = "backgroundColor: #87d068;" /> Sem conflitos (serão confirmados). </p>
      </small>
      <p> Leia atentamente a legenda acima para poder confirmar seu agendamento! </p>

      <a-list size = "small" itemLayout = "horizontal" :dataSource = "agendamentos">
        <a-list-item slot = "renderItem" slot-scope = "item, index">
          <a-list-item-meta>
            <span slot = "description"> [{{ item.local }}] {{ $moment().day(item.diaSemana).format('dddd') }}. Das {{ item.horaInicio.format('HH:mm') }} até {{ item.horaFim.format('HH:mm') }} </span>
            <a-avatar slot = "avatar" :size = "20" v-if = "item.conflitosAula.length > 0" style = "backgroundColor: #ff4d4f;" />
            <a-avatar slot = "avatar" :size = "20" v-else-if = "item.conflitosLocal.length > 0" style = "backgroundColor: #faad14;" />
            <a-avatar slot = "avatar" :size = "20" v-else style = "backgroundColor: #87d068;" />
          </a-list-item-meta>
        </a-list-item>
      </a-list>

      <span> <i> Esta ação não poderá ser desfeita. </i> </span> <br/>

      <div style = "text-align: right; margin-top: 20px;">
        <a-button @click = "closeModal"> Voltar </a-button>
        <a-button :loading = "buttonLoading" @click = "realizaReserva" type = "primary"> Confirmar </a-button>
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
        buttonLoadingConcluir: false,
        buttonLoading: false,
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
        }],
        modal: {
          visible: false
        }
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
      openModal () {
        this.modal.visible = true
      },
      closeModal () {
        this.modal.visible = false
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
              'local': values.local,
              'diaSemana': values.diaSemana,
              'horaInicio': this.$moment(values.horaInicio, 'HH:mm'),
              'horaFim': this.$moment(values.horaFim, 'HH:mm'),
              'conflitosLocal': [],
              'conflitosAula': []
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

        this.form.validateFields(async (err, values) => {
          if (!err) {
            _this.buttonLoadingConcluir = true

            _this.agendamentos.forEach(function (agendamento) {
              agendamento.conflitosLocal = []
              agendamento.conflitosAula = []

              db.ref('Reservas/locais').on('value', function (snapshot) {
                snapshot.forEach(function (reservaLocal) {
                  let dataInicialLocal = _this.$moment(reservaLocal.val().Inicio, 'DD/MM/YYYY HH:mm')
                  let dataFinalLocal = _this.$moment(reservaLocal.val().Fim, 'DD/MM/YYYY HH:mm')

                  let horaInicio = _this.$moment(agendamento.horaInicio, 'HH:mm')
                  let horaFim = _this.$moment(agendamento.horaFim, 'HH:mm')

                  let dataInicialAula = _this.$moment(values.dataInicial, 'DD/MM/YYYY HH:mm').set({
                    'hour': horaInicio.get('hour'),
                    'minute': horaInicio.get('minute'),
                    'second': '0'
                  }).day(agendamento.diaSemana)

                  let dataInicialFimAula = _this.$moment(values.dataInicial, 'DD/MM/YYYY HH:mm').set({
                    'hour': horaFim.get('hour'),
                    'minute': horaFim.get('minute'),
                    'second': '0'
                  }).day(agendamento.diaSemana)

                  let dataFinalAula = _this.$moment(values.dataFinal, 'DD/MM/YYYY HH:mm').set({
                    'hour': horaFim.get('hour'),
                    'minute': horaFim.get('minute'),
                    'second': '0'
                  }).day(agendamento.diaSemana)

                  if (dataInicialAula.day() < _this.$moment(values.dataInicial, 'DD/MM/YYYY HH:mm').day()) {
                    dataInicialAula = dataInicialAula.add(7, 'day')
                    dataInicialFimAula = dataInicialFimAula.add(7, 'day')
                  }

                  while (dataInicialAula <= dataFinalAula) {
                    if ((dataInicialLocal <= dataInicialFimAula) && (dataFinalLocal >= dataInicialAula) &&
                      (reservaLocal.val().Status !== 'Cancelada') && (reservaLocal.val().Local === agendamento.local)) {
                      agendamento.conflitosLocal.push({
                        'id': reservaLocal.key,
                        'dados': reservaLocal.val()
                      })
                      break
                    }
                    dataInicialAula = dataInicialAula.add(7, 'day')
                    dataInicialFimAula = dataInicialFimAula.add(7, 'day')
                  }
                })
              })

              db.ref('Reservas/aulas').on('value', function (snapshot) {
                snapshot.forEach(function (reservaAula) {
                  let dataInicioAula = _this.$moment(reservaAula.val().Inicio, 'DD/MM/YYYY')
                  let dataFimAula = _this.$moment(reservaAula.val().Fim, 'DD/MM/YYYY')
                  let horaInicioAula = _this.$moment(reservaAula.val().horaInicio, 'HH:mm')
                  let horaFimAula = _this.$moment(reservaAula.val().horaFim, 'HH:mm')

                  let dataInicioAgendamento = _this.$moment(values.dataInicial.format('DD/MM/YYYY'), 'DD/MM/YYYY')
                  let dataFimAgendamento = _this.$moment(values.dataFinal.format('DD/MM/YYYY'), 'DD/MM/YYYY')
                  let horaInicioAgendamento = _this.$moment(agendamento.horaInicio.format('HH:mm'), 'HH:mm')
                  let horaFimAgendamento = _this.$moment(agendamento.horaFim.format('HH:mm'), 'HH:mm')

                  if ((dataInicioAgendamento <= dataFimAula) && (dataFimAgendamento >= dataInicioAula) &&
                    (horaInicioAgendamento < horaFimAula) && (horaFimAgendamento > horaInicioAula) &&
                    (reservaAula.val().Status !== 'Cancelada') && (reservaAula.val().diaSemana === agendamento.diaSemana) && (reservaAula.val().Local === agendamento.local)) {
                    agendamento.conflitosAula.push({
                      'id': reservaAula.key,
                      'dados': reservaAula.val()
                    })
                  }
                })
              })
            })

            _this.buttonLoadingConcluir = false
            _this.openModal()
          }
        })
      },
      realizaReserva () {
        let _this = this
        let erros = []
        this.buttonLoading = true

        this.agendamentos.forEach(function (agendamento) {
          var agendamentoResposta = ' [' + agendamento.local + '] ' + _this.$moment().day(agendamento.diaSemana).format('dddd') + '. Das ' + agendamento.horaInicio.format('HH:mm') + ' até ' + agendamento.horaFim.format('HH:mm')

          if (agendamento.conflitosAula.length > 0) {
            erros.push(agendamento)
          } else if (agendamento.conflitosLocal.length > 0) {
            agendamento.conflitosLocal.forEach(function (local) {
              db.ref('Reservas/locais').child(local.id).update({
                'Status': 'Cancelada'
              }).then(() => {
                let user = _this.usuarios[_this.usuarios.map(function (e) { return e.id }).indexOf(local.dados.Solicitante)]
                let to = [user.nome + ' <' + user.email + '>']
                let textBody = 'Sua reserva foi cancelada'
                let htmlBody = '<h3>Reserva cancelada</h3><br><p>Sua reserva do local: <strong>' + local.dados.Local + '</strong> no período: <strong>' + _this.$moment(_this.dataInicial).format('DD/MM/YYYY') + ' até ' + _this.$moment(_this.dataFinal).format('DD/MM/YYYY') + '</strong> foi <strong>cancelada</strong>.</p>'
                htmlBody += '<p>Sua reserva foi cancelada pelo motivo: Aula criada no mesmo horário</p>'
                htmlBody += '<small>Este é um E-mail automático, por favor não responda</small>'

                sendEmail(to, 'Reserva de local cancelada', textBody, htmlBody)
              }).catch(() => { })
            })

            db.ref('Reservas/aulas').push({
              'Local': agendamento.local,
              'Inicio': _this.$moment(_this.dataInicio).format('DD/MM/YYYY'),
              'Fim': _this.$moment(_this.dataFim).format('DD/MM/YYYY'),
              'diaSemana': agendamento.diaSemana,
              'horaInicio': _this.$moment(agendamento.horaInicio).format('HH:mm'),
              'horaFim': _this.$moment(agendamento.horaFim).format('HH:mm'),
              'Solicitante': _this.solicitante,
              'Status': 'Confirmada'
            }).then(() => {
              _this.$notification.warning({
                message: 'Yey!..',
                description: 'Agendamento' + agendamentoResposta + ' solicitada com sucesso.'
              }, 1500)
            }).catch((err) => {
              erros.push(agendamento)
              _this.$notification.error({
                message: 'Opps..',
                description: 'Agendamento' + agendamentoResposta + ' não realizada. Erro: ' + err
              }, 1500)
            })
          } else {
            db.ref('Reservas/aulas').push({
              'Local': agendamento.local,
              'Inicio': _this.$moment(_this.dataInicio).format('DD/MM/YYYY'),
              'Fim': _this.$moment(_this.dataFim).format('DD/MM/YYYY'),
              'diaSemana': agendamento.diaSemana,
              'horaInicio': _this.$moment(agendamento.horaInicio).format('HH:mm'),
              'horaFim': _this.$moment(agendamento.horaFim).format('HH:mm'),
              'Solicitante': _this.solicitante,
              'Status': 'Confirmada'
            }).then(() => {
              _this.$notification.success({
                message: 'Yey!..',
                description: 'Agendamento' + agendamentoResposta + ' solicitada com sucesso.'
              }, 1500)
            }).catch((err) => {
              erros.push(agendamento)
              _this.$notification.error({
                message: 'Opps..',
                description: 'Agendamento' + agendamentoResposta + ' não realizada. Erro: ' + err
              }, 1500)
            })
          }
        })
        if (erros.length > 0) {
          this.agendamentos = erros
          this.buttonLoading = false
          this.closeModal()
        } else {
          this.$router.push('/aulas')
        }
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

  .ant-avatar > * {
    line-height: 24px !important;
  }
</style>