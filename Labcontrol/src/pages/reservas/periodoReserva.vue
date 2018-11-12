<template>
  <a-row>
    <a-row style = "text-align: center; margin-bottom: 30px;">
      <a-col :span = "4">
        <a-button size = "large" v-on:click = "parent.voltar">
          <a-icon type = "arrow-left" /> Voltar
        </a-button>
      </a-col>

      <a-col :span = "16">
        <h2> Selecione Período da Reserva </h2>
      </a-col>

      <a-col :span = "4">
        <a-button size = "large" type = "primary" @click = "verificaDados">
          Próximo <a-icon type = "arrow-right" />
        </a-button>
      </a-col>
    </a-row>

    <a-row style = "margin-bottom: 30px;">
      <a-alert v-if = "alert.visible" type = "error" showIcon>
        <span slot = "description"> {{ alert.message }} </span>
        <span slot = "message"> <i> Opps! </i> </span>
      </a-alert>
    </a-row>

    <a-form layout = "inline" :autoFormCreate = "(form) => { this.form = form }">
      <a-row :gutter = "16" style = "text-align: center;">
        <a-col :span = "12">
          <a-form-item label = "Data Início" fieldDecoratorId = "dataInicial" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }] }">
            <a-date-picker format = "DD/MM/YYYY" :disabledDate = "disabledDateInicial" placeholder = "Selecione Data Inicial" style = "margin-left: 30px;" size = "large" />
          </a-form-item>
        </a-col>

        <a-col :span = "12">
          <a-form-item label = "Hora Início" fieldDecoratorId = "horaInicial" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }] }">
            <a-time-picker format = "HH:mm" :disabledHours = "disabledHoursInicial" :minuteStep = "10" placeholder = "Hora Inicial" style = "margin-left: 30px;" size = "large" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter = "16" style = "text-align: center;">
        <a-col :span = "12">
          <a-form-item label = "Data Fim" fieldDecoratorId = "dataFinal" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }] }">
            <a-date-picker format = "DD/MM/YYYY" :disabledDate = "disabledDateFinal" placeholder = "Selecione Data Final" style = "margin-left: 30px;" size = "large" />
          </a-form-item>
        </a-col>

        <a-col :span = "12">
          <a-form-item label = "Hora Fim" fieldDecoratorId = "horaFinal" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }] }">
            <a-time-picker format = "HH:mm" :disabledHours = "disabledHoursFinal" :minuteStep = "10" placeholder = "Hora Final" style = "margin-left: 30px;" size = "large" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-row>
</template>

<script>
  import firebaseApp from '../../firebase-controller.js'

  const db = firebaseApp.database()
  const auth = firebaseApp.auth()

  export default {
    name: 'periodoReserva',
    data () {
      return {
        role: null,
        parent: this.$parent.$parent.$parent,
        valorItem: this.$route.params.valorItem,
        item: this.$route.params.item,
        tempoMin: 0,
        alert: {
          visible: false,
          message: ''
        }
      }
    },
    beforeMount: function () {
      let _this = this

      db.ref('Controle/Configuracao/TempoMinAntesReserva').on('value', function (snapshot) {
        _this.tempoMin = snapshot.val()
      })

      db.ref('Usuarios/' + auth.currentUser.uid).on('value', function (snapshot) {
        _this.role = snapshot.val().role
      })
    },
    created: function () {
      this.parent.current = 1
    },
    methods: {
      range (start, end) {
        const result = []
        for (let i = start; i < end; i++) {
          result.push(i)
        }
        return result
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
          (week === 6) ||
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
          return (current && current < this.$moment(this.form.getFieldValue('dataInicial'))) ||
            (week === 6) ||
            (week === 7) ||
            (current && current > maxDate)
        } else {
          return (current && current < this.$moment().add(-1, 'days').endOf('day')) ||
            (week === 6) ||
            (week === 7) ||
            (current && current > maxDate)
        }
      },
      disabledHoursInicial () {
        return this.range(0, 24).splice(0, 7) + this.range(0, 24).splice(23, 1)
      },
      disabledHoursFinal () {
        return this.range(0, 24).splice(0, 7) + this.range(0, 24).splice(23, 1)
      },
      verificaDados () {
        let _this = this
        _this.alert.visible = false

        this.form.validateFields(async (err, values) => {
          if (!err) {
            let dataInicial = this.$moment(values.dataInicial).set({
              'hour': values.horaInicial.get('hour'),
              'minute': values.horaInicial.get('minute'),
              'second': '0'
            })

            let dataFinal = this.$moment(values.dataFinal).set({
              'hour': values.horaFinal.get('hour'),
              'minute': values.horaFinal.get('minute'),
              'second': '0'
            })

            if (dataFinal < dataInicial || dataInicial < this.$moment()) {
              _this.alert.message = 'Período Inválido.'
              _this.alert.visible = true
            } else if (this.role === 'Comum' && dataInicial < this.$moment().add(this.tempoMin, 'hours')) {
              _this.alert.message = 'Período Inválido. Horas Mínimas de Reserva: ' + this.tempoMin + 'h.'
              _this.alert.visible = true
            }

            if (this.item === 'equipamento') {
              db.ref('Reservas/equipamentos').orderByChild('Equipamento').equalTo(this.valorItem).on('value', function (snapshot) {
                snapshot.forEach(function (reservaEquip) {
                  let dataInicialEquip = _this.$moment(reservaEquip.val().Inicio, 'DD/MM/YYYY HH:mm')
                  let dataFinalEquip = _this.$moment(reservaEquip.val().Fim, 'DD/MM/YYYY HH:mm')
                  if ((dataInicial <= dataFinalEquip) && (dataFinal >= dataInicialEquip) && (reservaEquip.val().Status !== 'Cancelada')) {
                    _this.alert.message = 'Neste período já existem agendamentos marcados, consulte um supervisor para realizar sua reserva ou escolha outro horário.'
                    _this.alert.visible = true
                  }
                })
              })
            } else {
              console.log('oi')
            }
          }
        })
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
</style>