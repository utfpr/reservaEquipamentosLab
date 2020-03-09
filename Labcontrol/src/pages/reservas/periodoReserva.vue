<template>
  <a-spin :spinning = "parent.loading">
    <a-row style = "text-align: center; margin-bottom: 30px;">
      <a-col :span = "4">
        <a-button v-if = "parent.current === 1" size = "large" @click = "parent.voltar">
          <span v-if = "item === 'equipamento' || item === 'local'"> <a-icon type = "arrow-left" /> Voltar </span>
          <span v-else> <a-icon type = "close" /> Cancelar </span>
        </a-button>
        
        <a-button v-if = "parent.current === 2" size = "large" @click = "voltar">
          <a-icon type = "arrow-left" /> Voltar
        </a-button>
      </a-col>

      <a-col :span = "16">
        <h2 v-if = "parent.current === 1"> Selecione Período da Reserva </h2>
        <h2 v-if = "parent.current === 2"> Confirme sua Reserva </h2>
      </a-col>

      <a-col :span = "4">
        <a-button v-if = "parent.current === 1 && (item === 'equipamento' || item === 'local')" size = "large" type = "primary" @click = "verificaDados">
          Próximo <a-icon type = "arrow-right" />
        </a-button>

        <a-button v-if = "parent.current === 1 && (item === 'reservaEquipamento' || item === 'reservaLocal')" size = "large" type = "primary" @click = "verificaDadosEdicao">
          Próximo <a-icon type = "arrow-right" />
        </a-button>

        <a-button v-if = "parent.current === 2" size = "large" type = "primary" @click = "openModal()">
          <a-icon type = "check" /> Concluir
        </a-button>
      </a-col>
    </a-row>

    <a-row style = "margin-bottom: 30px;">
      <a-alert v-if = "alert.visible" type = "error" showIcon>
        <span slot = "description"> {{ alert.message }} </span>
        <span slot = "message"> <i> Opps! </i> </span>
      </a-alert>
    </a-row>

    <a-form v-if = "parent.current === 1" layout = "inline" :autoFormCreate = "(form) => { this.form = form }">
      <a-row v-if = "role === 'Supervisor' || role === 'admin'" class = "form-solicitante" style = "margin: 0px 50px;">
        <a-form-item label = "Solicitante" fieldDecoratorId = "solicitante" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }], initialValue: solicitante }">
          <a-select v-model = "solicitante" size = "large" placeholder = "Selecione Solicitante" showSearch notFoundContent = "Usuário não Encontrado" :filterOption = "filterOption">
            <a-select-option v-for = "solicitante in usuarios" v-bind:key = "solicitante.id" :value = "solicitante.id"> {{solicitante.ra}} - {{solicitante.nome}} </a-select-option>
          </a-select>
        </a-form-item>
      </a-row>

      <a-row :gutter = "16" style = "text-align: center; margin-top: 20px;">
        <a-col :span = "12">
          <a-form-item label = "Data Início" fieldDecoratorId = "dataInicial" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }], initialValue: dateInitInicial }">
            <a-date-picker :showToday = "false" format = "DD/MM/YYYY" :disabledDate = "disabledDateInicial" placeholder = "Selecione Data Inicial" style = "margin-left: 30px;" size = "large" />
          </a-form-item>
        </a-col>

        <a-col :span = "12">
          <a-form-item label = "Hora Início" fieldDecoratorId = "horaInicial" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }], initialValue: dateInitInicial }">
            <a-time-picker :allowEmpty = "false" format = "HH:mm" :disabledHours = "disabledHours" :minuteStep = "10" placeholder = "Hora Inicial" style = "margin-left: 30px;" size = "large" hideDisabledOptions />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter = "16" style = "text-align: center; margin-top: 20px;">
        <a-col :span = "12">
          <a-form-item label = "Data Fim" fieldDecoratorId = "dataFinal" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }], initialValue: dateInitFinal }">
            <a-date-picker :showToday = "false" format = "DD/MM/YYYY" :disabledDate = "disabledDateFinal" placeholder = "Selecione Data Final" style = "margin-left: 30px;" size = "large" />
          </a-form-item>
        </a-col>

        <a-col :span = "12">
          <a-form-item label = "Hora Fim" fieldDecoratorId = "horaFinal" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }], initialValue: dateInitFinal }">
            <a-time-picker :allowEmpty = "false" format = "HH:mm" :disabledHours = "disabledHours" :minuteStep = "10" placeholder = "Hora Final" style = "margin-left: 30px;" size = "large" hideDisabledOptions />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <a-row v-if = "parent.current === 2">
      <h2 v-if = "item === 'equipamento'"> <b> Item Reservado: </b> {{ item }} - {{ equipamentos[equipamentos.map(function (e) { return e.id }).indexOf(valorItem)].patrimonio }} </h2>
      <h2 v-if = "item === 'local'"> <b> Item Reservado: </b> {{ item }} - {{ valorItem }} </h2>
      <h2 v-if = "item === 'reservaEquipamento'"> <b> Item Reservado (Edição): </b> equipamento - {{ equipamentos[equipamentos.map(function (e) { return e.id }).indexOf(reserva.Equipamento)].patrimonio }} </h2>
      <h2 v-if = "item === 'ReservaLocal'"> <b> Item Reservado (Edição): </b> local - {{ reserva.Local }} </h2>
      <br />
      <h2> <b> Perído Reservado: </b> {{ $moment(dataInicial).format('DD/MM/YYYY HH:mm') }} - {{ $moment(dataFinal).format('DD/MM/YYYY HH:mm') }} </h2>
      <br />
    </a-row>

    <a-modal :visible = "modal.visible" :footer = "null" @cancel = "closeModal()" style = "padding: 32px 32px 24px;">
      <a-icon type = "question-circle-o" style = "color: #faad14; font-size: 22px; margin-right: 16px" />
      <span> <b> Deseja confirmar sua reserva?! </b> </span> <br/><br/>
      <span> {{ modal.message }} </span> <br/>
      
      <span v-if = "(role === 'Supervisor' || role === 'admin') && (conflitos.length > 0)">
        <a-textarea v-model = "modal.resposta" placeholder = "Digite o motivo do cancelamento aqui" :autosize = "{ minRows: 5, maxRows: 5 }" /> <br/> <br/>
      </span>

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
    name: 'periodoReserva',
    data () {
      return {
        role: null,
        buttonLoading: false,
        equipamentos: [],
        usuarios: [],
        conflitos: [],
        conflitosAulas: [],
        parent: this.$parent.$parent.$parent,
        valorItem: this.$route.params.valorItem,
        item: this.$route.params.item,
        dateInitInicial: this.$moment(),
        dateInitFinal: null,
        reserva: '',
        dataInicial: '',
        dataFinal: '',
        tempoMin: 0,
        solicitante: auth.currentUser.uid,
        alert: {
          visible: false,
          message: ''
        },
        modal: {
          visible: false,
          message: '',
          resposta: ''
        }
      }
    },
    beforeMount: function () {
      let _this = this
      _this.parent.loading = true

      db.ref('Usuarios/' + auth.currentUser.uid).on('value', function (snapshot) {
        _this.parent.loading = true
        _this.role = snapshot.val().role

        db.ref('Controle/Configuracao/TempoMinAntesReserva').on('value', function (snapshot) {
          _this.tempoMin = snapshot.val()

          _this.dateInitInicial = _this.$moment(_this.dateInitInicial).set({
            'minute': _this.dateInitInicial.minute() + (10 - _this.dateInitInicial.minute() % 10)
          })

          if (_this.item === 'reservaEquipamento') {
            db.ref('Reservas/equipamentos/' + _this.valorItem).on('value', function (snapshot) {
              _this.solicitante = snapshot.val().Solicitante
              _this.dateInitInicial = _this.$moment(snapshot.val().Inicio, 'DD/MM/YYYY HH:mm')
              _this.dateInitFinal = _this.$moment(snapshot.val().Fim, 'DD/MM/YYYY HH:mm')
              _this.reserva = snapshot.val()
            })
          } else if (_this.item === 'reservaLocal') {
            db.ref('Reservas/locais/' + _this.valorItem).on('value', function (snapshot) {
              _this.solicitante = snapshot.val().Solicitante
              _this.dateInitInicial = _this.$moment(snapshot.val().Inicio, 'DD/MM/YYYY HH:mm')
              _this.dateInitFinal = _this.$moment(snapshot.val().Fim, 'DD/MM/YYYY HH:mm')
              _this.reserva = snapshot.val()
            })
          } else {
            if (_this.role === 'Comum') {
              _this.dateInitInicial = _this.$moment(_this.dateInitInicial).add(_this.tempoMin, 'hours')
            }

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
          }

          _this.parent.loading = false
        })
      })

      db.ref('Equipamentos').orderByKey().on('value', function (snapshot) {
        _this.equipamentos = []
        _this.parent.loading = true

        snapshot.forEach(function (item) {
          _this.equipamentos.push({
            'id': item.key,
            'patrimonio': item.val().Patrimonio,
            'nome': item.val().Nome
          })
        })
        _this.parent.loading = false
      })

      db.ref('Usuarios').orderByKey().on('value', function (snapshot) {
        _this.usuarios = []
        _this.parent.loading = true

        snapshot.forEach(function (item) {
          _this.usuarios.push({
            'id': item.key,
            'ra': item.val().RA,
            'email': item.val().Email,
            'nome': item.val().Nome + ' ' + item.val().Sobrenome
          })
        })
        _this.parent.loading = false
      })
    },
    created: function () {
      this.parent.current = 1
    },
    methods: {
      filterOption (input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      voltar () {
        this.parent.current = 1
      },
      avancar () {
        this.parent.current = 2
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
          // const realDateInitial = this.$moment(this.form.getFieldValue('dataInicial')).set({
          //   'hour': this.$moment(this.form.getFieldValue('horaInicial')).get('hour'),
          //   'minute': this.$moment(this.form.getFieldValue('horaInicial')).get('minute'),
          //   'second': '0'
          // })
          return (current && current < this.$moment().add(-1, 'days').endOf('day')) ||
            // (current && realDateInitial.isSameOrAfter(current)) ||
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
      verificaDados () {
        let _this = this
        _this.alert.visible = false

        this.form.validateFields(async (err, values) => {
          if (!err) {
            _this.dataInicial = this.$moment(values.dataInicial).set({
              'hour': values.horaInicial.get('hour'),
              'minute': values.horaInicial.get('minute'),
              'second': '0'
            })

            _this.dataFinal = this.$moment(values.dataFinal).set({
              'hour': values.horaFinal.get('hour'),
              'minute': values.horaFinal.get('minute'),
              'second': '0'
            })

            if (_this.dataFinal < _this.dataInicial || _this.dataInicial < this.$moment()) {
              _this.alert.message = 'Período Inválido.'
              _this.alert.visible = true
            } else if (this.role === 'Comum' && _this.dataInicial < this.$moment().add(this.tempoMin, 'hours')) {
              _this.alert.message = 'Período Inválido. Horas Mínimas de Reserva: ' + this.tempoMin + 'h.'
              _this.alert.visible = true
            } else {
              _this.conflitos = []
              _this.conflitosAulas = []

              if (this.item === 'equipamento') {
                db.ref('Reservas/equipamentos').orderByChild('Equipamento').equalTo(_this.valorItem).on('value', function (snapshot) {
                  snapshot.forEach(function (reservaEquip) {
                    let dataInicialEquip = _this.$moment(reservaEquip.val().Inicio, 'DD/MM/YYYY HH:mm')
                    let dataFinalEquip = _this.$moment(reservaEquip.val().Fim, 'DD/MM/YYYY HH:mm')

                    if ((_this.dataInicial <= dataFinalEquip) && (_this.dataFinal >= dataInicialEquip) && (reservaEquip.val().Status !== 'Cancelada')) {
                      _this.conflitos.push({
                        'id': reservaEquip.key,
                        'tipo': 'equipamento',
                        'dados': reservaEquip.val()
                      })
                    }
                  })

                  if (_this.conflitos.length === 0 || _this.role === 'Supervisor' || _this.role === 'admin') {
                    _this.avancar()
                  } else {
                    _this.alert.message = 'Neste período já existem agendamentos marcados, consulte um supervisor para realizar sua reserva ou escolha outro horário.'
                    _this.alert.visible = true
                  }
                })
              } else {
                db.ref('Reservas/locais').orderByChild('Local').equalTo(_this.valorItem).on('value', function (snapshot) {
                  snapshot.forEach(function (reservaLocal) {
                    let dataInicialLocal = _this.$moment(reservaLocal.val().Inicio, 'DD/MM/YYYY HH:mm')
                    let dataFinalLocal = _this.$moment(reservaLocal.val().Fim, 'DD/MM/YYYY HH:mm')

                    if ((_this.dataInicial <= dataFinalLocal) && (_this.dataFinal >= dataInicialLocal) && (reservaLocal.val().Status !== 'Cancelada')) {
                      _this.conflitos.push({
                        'id': reservaLocal.key,
                        'tipo': 'local',
                        'dados': reservaLocal.val()
                      })
                    }
                  })
                })

                db.ref('Reservas/aulas').orderByChild('Local').equalTo(_this.valorItem).on('value', function (snapshot) {
                  snapshot.forEach(function (reservaAula) {
                    let horaInicio = _this.$moment(reservaAula.val().horaInicio, 'HH:mm')
                    let horaFim = _this.$moment(reservaAula.val().horaFim, 'HH:mm')

                    let dataInicialAula = _this.$moment(reservaAula.val().Inicio, 'DD/MM/YYYY HH:mm').set({
                      'hour': horaInicio.get('hour'),
                      'minute': horaInicio.get('minute'),
                      'second': '0'
                    }).day(reservaAula.val().diaSemana)

                    let dataInicialFimAula = _this.$moment(reservaAula.val().Inicio, 'DD/MM/YYYY HH:mm').set({
                      'hour': horaFim.get('hour'),
                      'minute': horaFim.get('minute'),
                      'second': '0'
                    }).day(reservaAula.val().diaSemana)

                    let dataFinalAula = _this.$moment(reservaAula.val().Fim, 'DD/MM/YYYY HH:mm').set({
                      'hour': horaFim.get('hour'),
                      'minute': horaFim.get('minute'),
                      'second': '0'
                    }).day(reservaAula.val().diaSemana)

                    if (dataInicialAula.day() < _this.$moment(reservaAula.val().Inicio, 'DD/MM/YYYY HH:mm').day()) {
                      dataInicialAula = dataInicialAula.add(7, 'day')
                      dataInicialFimAula = dataInicialFimAula.add(7, 'day')
                    }

                    while (dataInicialAula <= dataFinalAula) {
                      if ((_this.dataInicial <= dataInicialFimAula) && (_this.dataFinal >= dataInicialAula) && (reservaAula.val().Status !== 'Cancelada')) {
                        _this.conflitosAulas.push({
                          'id': reservaAula.key,
                          'dados': reservaAula.val()
                        })
                        break
                      }
                      dataInicialAula = dataInicialAula.add(7, 'day')
                      dataInicialFimAula = dataInicialFimAula.add(7, 'day')
                    }
                  })

                  if (((_this.role === 'Comum') && (_this.conflitos.length === 0) && (_this.conflitosAulas.length === 0)) || ((_this.role === 'Supervisor' || _this.role === 'admin') && (_this.conflitosAulas.length === 0))) {
                    _this.avancar()
                  } else {
                    _this.alert.message = 'Neste período já existem agendamentos ou aulas marcadas, consulte um supervisor para realizar sua reserva ou escolha outro horário.'
                    _this.alert.visible = true
                  }
                })
              }
            }
          }
        })
      },
      verificaDadosEdicao () {
        let _this = this
        _this.alert.visible = false

        this.form.validateFields(async (err, values) => {
          if (!err) {
            _this.dataInicial = this.$moment(values.dataInicial).set({
              'hour': values.horaInicial.get('hour'),
              'minute': values.horaInicial.get('minute'),
              'second': '0'
            })

            _this.dataFinal = this.$moment(values.dataFinal).set({
              'hour': values.horaFinal.get('hour'),
              'minute': values.horaFinal.get('minute'),
              'second': '0'
            })

            if (_this.dataFinal < _this.dataInicial || (_this.dataInicial < this.$moment() && !(_this.dataInicial.isSame(_this.dateInitInicial)))) {
              _this.alert.message = 'Período Inválido.'
              _this.alert.visible = true
            } else if (this.role === 'Comum' && _this.dataInicial < this.$moment().add(this.tempoMin, 'hours')) {
              _this.alert.message = 'Período Inválido. Horas Mínimas de Reserva: ' + this.tempoMin + 'h.'
              _this.alert.visible = true
            } else {
              _this.conflitos = []
              _this.conflitosAulas = []

              if (this.item === 'reservaEquipamento') {
                db.ref('Reservas/equipamentos').orderByChild('Equipamento').equalTo(_this.reserva.Equipamento).on('value', function (snapshot) {
                  snapshot.forEach(function (reservaEquip) {
                    let dataInicialEquip = _this.$moment(reservaEquip.val().Inicio, 'DD/MM/YYYY HH:mm')
                    let dataFinalEquip = _this.$moment(reservaEquip.val().Fim, 'DD/MM/YYYY HH:mm')

                    if ((_this.dataInicial <= dataFinalEquip) && (_this.dataFinal >= dataInicialEquip) && (reservaEquip.val().Status !== 'Cancelada') && (_this.valorItem !== reservaEquip.key)) {
                      _this.conflitos.push({
                        'id': reservaEquip.key,
                        'tipo': 'equipamento',
                        'dados': reservaEquip.val()
                      })
                    }
                  })

                  if (_this.conflitos.length === 0 || _this.role === 'Supervisor' || _this.role === 'admin') {
                    _this.avancar()
                  } else {
                    _this.alert.message = 'Neste período já existem agendamentos marcados, consulte um supervisor para realizar sua reserva ou escolha outro horário.'
                    _this.alert.visible = true
                  }
                })
              } else {
                db.ref('Reservas/locais').orderByChild('Local').equalTo(_this.reserva.Local).on('value', function (snapshot) {
                  snapshot.forEach(function (reservaLocal) {
                    let dataInicialLocal = _this.$moment(reservaLocal.val().Inicio, 'DD/MM/YYYY HH:mm')
                    let dataFinalLocal = _this.$moment(reservaLocal.val().Fim, 'DD/MM/YYYY HH:mm')

                    if ((_this.dataInicial <= dataFinalLocal) && (_this.dataFinal >= dataInicialLocal) && (reservaLocal.val().Status !== 'Cancelada') && (_this.valorItem !== reservaLocal.key)) {
                      _this.conflitos.push({
                        'id': reservaLocal.key,
                        'tipo': 'local',
                        'dados': reservaLocal.val()
                      })
                    }
                  })

                  db.ref('Reservas/aulas').orderByChild('Local').equalTo(_this.reserva.Local).on('value', function (snapshot) {
                    snapshot.forEach(function (reservaAula) {
                      let horaInicio = _this.$moment(reservaAula.val().horaInicio, 'HH:mm')
                      let horaFim = _this.$moment(reservaAula.val().horaFim, 'HH:mm')

                      let dataInicialAula = _this.$moment(reservaAula.val().Inicio, 'DD/MM/YYYY HH:mm').set({
                        'hour': horaInicio.get('hour'),
                        'minute': horaInicio.get('minute'),
                        'second': '0'
                      }).day(reservaAula.val().diaSemana)

                      let dataInicialFimAula = _this.$moment(reservaAula.val().Inicio, 'DD/MM/YYYY HH:mm').set({
                        'hour': horaFim.get('hour'),
                        'minute': horaFim.get('minute'),
                        'second': '0'
                      }).day(reservaAula.val().diaSemana)

                      let dataFinalAula = _this.$moment(reservaAula.val().Fim, 'DD/MM/YYYY HH:mm').set({
                        'hour': horaFim.get('hour'),
                        'minute': horaFim.get('minute'),
                        'second': '0'
                      }).day(reservaAula.val().diaSemana)

                      if (dataInicialAula.day() < _this.$moment(reservaAula.val().Inicio, 'DD/MM/YYYY HH:mm').day()) {
                        dataInicialAula = dataInicialAula.add(7, 'day')
                        dataInicialFimAula = dataInicialFimAula.add(7, 'day')
                      }

                      while (dataInicialAula <= dataFinalAula) {
                        if ((_this.dataInicial <= dataInicialFimAula) && (_this.dataFinal >= dataInicialAula) && (reservaAula.val().Status !== 'Cancelada')) {
                          _this.conflitosAulas.push({
                            'id': reservaAula.key,
                            'dados': reservaAula.val()
                          })
                          break
                        }
                        dataInicialAula = dataInicialAula.add(7, 'day')
                        dataInicialFimAula = dataInicialFimAula.add(7, 'day')
                      }
                    })

                    if (((_this.role === 'Comum') && (_this.conflitos.length === 0) && (_this.conflitosAulas.length === 0)) || ((_this.role === 'Supervisor' || _this.role === 'admin') && (_this.conflitosAulas.length === 0))) {
                      _this.avancar()
                    } else {
                      _this.alert.message = 'Neste período já existem agendamentos ou aulas marcadas, consulte um supervisor para realizar sua reserva ou escolha outro horário.'
                      _this.alert.visible = true
                    }
                  })
                })
              }
            }
          }
        })
      },
      realizaReserva () {
        let _this = this
        _this.buttonLoading = true

        if (_this.item === 'equipamento' || _this.item === 'reservaEquipamento') {
          if ((_this.role === 'Supervisor' || _this.role === 'admin') && (_this.conflitos.length > 0)) {
            _this.conflitos.forEach(function (equipamento) {
              db.ref('Reservas/equipamentos').child(equipamento.id).update({
                'Status': 'Cancelada'
              }).then(() => {
                let user = _this.usuarios[_this.usuarios.map(function (e) { return e.id }).indexOf(equipamento.dados.Solicitante)]
                let equipamentoNome = _this.equipamentos[_this.equipamentos.map(function (e) { return e.id }).indexOf(equipamento.dados.Equipamento)].patrimonio
                let to = [user.nome + ' <' + user.email + '>']
                let textBody = 'Sua reserva foi cancelada'
                let htmlBody = '<h3>Reserva cancelada</h3><br><p>Sua reserva do equipamento: <strong>' + equipamentoNome + '</strong> no período: <strong>' + _this.$moment(_this.dataInicial).format('DD/MM/YYYY') + ' até ' + _this.$moment(_this.dataFinal).format('DD/MM/YYYY') + '</strong> foi <strong>cancelada</strong>.</p>'
                if (_this.modal.resposta !== '') {
                  htmlBody += '<p>Sua reserva foi cancelada pelo motivo: ' + _this.modal.resposta + '</p>'
                }
                htmlBody += '<small>Este é um E-mail automático, por favor não responda</small>'

                sendEmail(to, 'Reserva de equipamento cancelada', textBody, htmlBody)
                _this.buttonLoading = false
              }).catch(() => {
                _this.buttonLoading = false
              })
            })
          }

          if (_this.item === 'reservaEquipamento') {
            db.ref('Reservas/equipamentos').child(_this.valorItem).update({
              'Inicio': _this.$moment(_this.dataInicial).format('DD/MM/YYYY HH:mm'),
              'Fim': _this.$moment(_this.dataFinal).format('DD/MM/YYYY HH:mm'),
              'Solicitante': _this.solicitante,
              'Status': (_this.role === 'Supervisor' || _this.role === 'admin') ? 'Confirmada' : _this.reserva.Status
            }).then(() => {
              _this.$notification.success({
                message: 'Yey!..',
                description: 'Reserva atualizada com sucesso.'
              }, 1500)

              _this.closeModal()
              this.$router.push('/reservas')
            }).catch((err) => {
              _this.$notification.error({
                message: 'Opps..',
                description: 'Reserva não atualizada. Erro: ' + err
              })
            })
          } else {
            db.ref('Reservas/equipamentos').push({
              'Equipamento': _this.valorItem,
              'Inicio': _this.$moment(_this.dataInicial).format('DD/MM/YYYY HH:mm'),
              'Fim': _this.$moment(_this.dataFinal).format('DD/MM/YYYY HH:mm'),
              'Solicitante': _this.solicitante,
              'Status': (_this.role === 'Supervisor' || _this.role === 'admin') ? 'Confirmada' : 'Pendente'
            }).then(() => {
              _this.$notification.success({
                message: 'Yey!..',
                description: 'Reserva solicitada com sucesso.'
              }, 1500)

              _this.closeModal()
              this.$router.push('/reservas')
            }).catch((err) => {
              _this.$notification.error({
                message: 'Opps..',
                description: 'Reserva não realizada. Erro: ' + err
              })
            })
          }
        } else {
          if ((_this.role === 'Supervisor' || _this.role === 'admin') && (_this.conflitos.length > 0)) {
            _this.conflitos.forEach(function (local) {
              db.ref('Reservas/locais').child(local.id).update({
                'Status': 'Cancelada'
              }).then(() => {
                let user = _this.usuarios[_this.usuarios.map(function (e) { return e.id }).indexOf(local.dados.Solicitante)]
                let to = [user.nome + ' <' + user.email + '>']
                let textBody = 'Sua reserva foi cancelada'
                let htmlBody = '<h3>Reserva cancelada</h3><br><p>Sua reserva do local: <strong>' + local.dados.Local + '</strong> no período: <strong>' + _this.$moment(_this.dataInicial).format('DD/MM/YYYY') + ' até ' + _this.$moment(_this.dataFinal).format('DD/MM/YYYY') + '</strong> foi <strong>cancelada</strong>.</p>'
                if (_this.modal.resposta !== '') {
                  htmlBody += '<p>Sua reserva foi cancelada pelo motivo: ' + _this.modal.resposta + '</p>'
                }
                htmlBody += '<small>Este é um E-mail automático, por favor não responda</small>'

                sendEmail(to, 'Reserva de local cancelada', textBody, htmlBody)
                _this.buttonLoading = false
              }).catch(() => {
                _this.buttonLoading = false
              })
            })
          }

          if (_this.item === 'reservaLocal') {
            db.ref('Reservas/locais').child(_this.valorItem).update({
              'Inicio': _this.$moment(_this.dataInicial).format('DD/MM/YYYY HH:mm'),
              'Fim': _this.$moment(_this.dataFinal).format('DD/MM/YYYY HH:mm'),
              'Solicitante': _this.solicitante,
              'Status': (_this.role === 'Supervisor' || _this.role === 'admin') ? 'Confirmada' : _this.reserva.Status
            }).then(() => {
              _this.$notification.success({
                message: 'Yey!..',
                description: 'Reserva atualizada com sucesso.'
              }, 1500)

              _this.closeModal()
              this.$router.push('/reservas')
            }).catch((err) => {
              _this.$notification.error({
                message: 'Opps..',
                description: 'Reserva não atualizada. Erro: ' + err
              })
            })
          } else {
            db.ref('Reservas/locais').push({
              'Local': _this.valorItem,
              'Inicio': _this.$moment(_this.dataInicial).format('DD/MM/YYYY HH:mm'),
              'Fim': _this.$moment(_this.dataFinal).format('DD/MM/YYYY HH:mm'),
              'Solicitante': _this.solicitante,
              'Status': (_this.role === 'Supervisor' || _this.role === 'admin') ? 'Confirmada' : 'Pendente'
            }).then(() => {
              _this.$notification.success({
                message: 'Yey!..',
                description: 'Reserva solicitada com sucesso.'
              }, 1500)

              _this.closeModal()
              this.$router.push('/reservas')
            }).catch((err) => {
              _this.$notification.error({
                message: 'Opps..',
                description: 'Reserva não realizada. Erro: ' + err
              }, 1500)
            })
          }
        }
      },
      openModal () {
        this.modal.message = 'Está tudo certo, deseja continuar?'

        if ((this.role === 'Supervisor' || this.role === 'admin') && (this.conflitos.length > 0)) {
          this.modal.message = 'Para confirmar essa reserva será necessário cancelar algumas outras, está de acordo?'
        }

        this.modal.visible = true
      },
      closeModal () {
        this.modal.visible = false
      }
    }
  }
</script>

<style>
  .linkProximo {
    text-decoration: none !important;
  }

  .ant-calendar-ok-btn {
    color: white !important;
  }

  .ant-form-explain {
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
