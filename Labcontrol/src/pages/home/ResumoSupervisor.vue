<template>
  <a-spin :spinning = "loading">
    <a-row :gutter = "16">
      <a-col :span = "8">
        <a-card title = "Equipamentos">
          <a-tag color = "green"> Normal: <b> {{ equipamentos.filter(function (e) { return e.status === 'Normal' }).length }} </b> </a-tag>
          <a-tag color = "blue"> Em Manutenção: <b> {{ equipamentos.filter(function (e) { return e.status === 'Em Manutenção' }).length }} </b> </a-tag>
          <a-tag color = "red"> Quebrados: <b> {{ equipamentos.filter(function (e) { return e.status === 'Quebrado' }).length }} </b> </a-tag> <br />
          
          <hr style = "border: none; border-top: 1px solid #d2d2d2; margin-top: 18px;" />

          <a-tag color = ""> Reservas Confirmadas: <b> {{ allReservas.filter(function (e) { return e.status === 'Confirmada' && e.tipo === 'equipamento' }).length }} </b> </a-tag>
          <a-tag color = ""> Reservas Pendentes: <b> {{ allReservas.filter(function (e) { return e.status === 'Pendente' && e.tipo === 'equipamento' }).length }} </b> </a-tag>
        </a-card>

        <a-card title = "Locais" style = "margin-top: 30px;">
          <a-tag color = ""> Reservas Confirmadas: <b> {{ allReservas.filter(function (e) { return e.status === 'Confirmada' && e.tipo === 'local' }).length }} </b> </a-tag>
          <a-tag color = ""> Reservas Pendentes: <b> {{ allReservas.filter(function (e) { return e.status === 'Pendente' && e.tipo === 'local' }).length }} </b> </a-tag>
        </a-card>

        <a-card title = "Aulas" style = "margin-top: 30px;">
          <a-tag color = ""> Reservas Confirmadas: <b> {{ allReservas.filter(function (e) { return e.status === 'Confirmada' && e.tipo === 'aula' }).length }} </b> </a-tag>
          <a-tag color = ""> Reservas Canceladas: <b> {{ allReservas.filter(function (e) { return e.status === 'Cancelada' && e.tipo === 'aula' }).length }} </b> </a-tag>
        </a-card>
      </a-col>

      <a-col :span = "16">
        <a-list :locale = "{ emptyText: 'Sem Reservas ou Aulas neste dia' }" :bordered = "true" size = "small" itemLayout = "horizontal" :dataSource = "reservas">
          <div slot = "header">
            <a-row style = "text-align: center;">
              <a-col :span = "4">
                <h3> <a-icon v-if = "tabDate" @click = "prevDay" class = "buttons-icons" type = "left" /> </h3>
              </a-col>

              <a-col v-if = "tabDate" :span = "16">
                <div style = "display: -webkit-inline-box;">
                  <h3 class = "dia"> <i @click = "changeTab"> {{ dia.format('DD/MM/YYYY') }} </i> </h3>
                  <small> <a-icon @click = "changeTab" style = "margin-top: 14px;" class = "buttons-icons" type = "edit" /> </small>
                </div>
              </a-col>

              <a-col v-else :span = "16">
                <a-date-picker :showToday = "false" size = "large" format = "DD/MM/YYYY" :value = "dia" placeholder = "Data Final:" @change = "(date, dateString) => changeDate(date)" />
              </a-col>

              <a-col :span = "4">
                <h3> <a-icon v-if = "tabDate" @click = "nextDay" class = "buttons-icons" type = "right" /> </h3>
              </a-col>
            </a-row>
          </div>

          <a-list-item slot = "renderItem" slot-scope = "item">
            <a-tooltip placement = "left">
              <template slot = "title">
                <span> {{ item.tipo }} </span>
              </template>

              <a-list-item-meta>
                <span v-if = "item.tipo === 'equipamento'" slot = "description">
                  <b> [{{ item.solicitante.ra }} - {{ item.solicitante.nome }}] </b>
                  <i> Equipamento: {{ item.equipamento.nome }} </i>.
                  Das {{ item.horaInicio }} até {{ item.horaFim }}
                </span>

                <span v-else-if = "item.tipo === 'local'" slot = "description">
                  <b> [{{ item.solicitante.ra }} - {{ item.solicitante.nome }}] </b>
                  <i> Local: {{ item.local }}. </i>
                  Das {{ item.horaInicio }} até {{ item.horaFim }}
                </span>

                <span v-else slot = "description">
                  <b> [{{ item.solicitante.ra }} - {{ item.solicitante.nome }}] </b>
                  <i> Local da Aula: {{ item.local }}. </i>
                  Das {{ item.horaInicio }} até {{ item.horaFim }}
                </span>
                
                <a-avatar :size = "20" slot = "avatar" :style = "{ backgroundColor: item.tipo === 'equipamento' ? '#00a2ae' : item.tipo === 'local' ? '#7265e6' : '#ffbf00' }" />
              </a-list-item-meta>
            </a-tooltip>
          </a-list-item>
        </a-list>
      </a-col>
    </a-row>
  </a-spin>
</template>

<script>
  import firebaseApp from '../../firebase-controller.js'

  const db = firebaseApp.database()

  export default {
    data () {
      return {
        loading: false,
        role: null,
        tabDate: true,
        dia: this.$moment().hours(0).minutes(0).seconds(0),
        reservas: [],
        allReservas: [],
        usuarios: [],
        equipamentos: []
      }
    },
    beforeMount: function () {
      let _this = this
      _this.allReservas = []
      _this.loading = true

      db.ref('Usuarios').on('value', function (snapshot) {
        _this.loading = true
        _this.usuarios = []

        snapshot.forEach(function (item) {
          _this.usuarios.push({
            'id': item.key,
            'ra': item.val().RA,
            'nome': item.val().Nome + ' ' + item.val().Sobrenome
          })
        })

        db.ref('Equipamentos').on('value', function (snapshot) {
          _this.loading = true
          _this.equipamentos = []

          snapshot.forEach(function (item) {
            _this.equipamentos.push({
              'id': item.key,
              'patrimonio': item.val().Patrimonio,
              'nome': item.val().Nome,
              'status': item.val().Status
            })
          })

          _this.atualizaReserva()
          _this.loading = false
        })
      })

      db.ref('Reservas/equipamentos').on('value', function (snapshot) {
        _this.loading = true

        snapshot.forEach(function (item) {
          _this.allReservas.push({
            'tipo': 'equipamento',
            'status': item.val().Status
          })
        })
        _this.loading = false
      })

      db.ref('Reservas/locais').on('value', function (snapshot) {
        _this.loading = true

        snapshot.forEach(function (item) {
          _this.allReservas.push({
            'tipo': 'local',
            'status': item.val().Status
          })
        })
        _this.loading = false
      })

      db.ref('Reservas/aulas').on('value', function (snapshot) {
        _this.loading = true

        snapshot.forEach(function (item) {
          _this.allReservas.push({
            'tipo': 'aula',
            'status': item.val().Status
          })
        })
        _this.loading = false
      })
    },
    methods: {
      atualizaReserva () {
        let _this = this
        var dia = _this.$moment(_this.dia.format('DD/MM/YYYY'), 'DD/MM/YYYY')
        _this.reservas = []

        db.ref('Reservas/equipamentos').orderByChild('Status').equalTo('Confirmada').on('value', function (snapshot) {
          snapshot.forEach(function (item) {
            var inicio = _this.$moment(_this.$moment(item.val().Inicio, 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY'), 'DD/MM/YYYY')
            var horaInicio = _this.$moment(_this.$moment(item.val().Inicio, 'DD/MM/YYYY HH:mm').format('HH:mm'), 'HH:mm')
            var fim = _this.$moment(_this.$moment(item.val().Fim, 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY'), 'DD/MM/YYYY')
            var horaFim = _this.$moment(_this.$moment(item.val().Fim, 'DD/MM/YYYY HH:mm').format('HH:mm'), 'HH:mm')

            if (dia.isSameOrBefore(fim) && dia.isSameOrAfter(inicio)) {
              _this.reservas.push({
                'tipo': 'equipamento',
                'horaInicio': dia.isSame(inicio) ? horaInicio.format('HH:mm') : '07:00',
                'horaFim': dia.isSame(fim) ? horaFim.format('HH:mm') : '23:00',
                'equipamento': _this.equipamentos[_this.equipamentos.map(function (e) { return e.id }).indexOf(item.val().Equipamento)],
                'solicitante': _this.usuarios[_this.usuarios.map(function (e) { return e.id }).indexOf(item.val().Solicitante)]
              })
            }
          })
        })

        db.ref('Reservas/locais').orderByChild('Status').equalTo('Confirmada').on('value', function (snapshot) {
          snapshot.forEach(function (item) {
            var inicio = _this.$moment(_this.$moment(item.val().Inicio, 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY'), 'DD/MM/YYYY')
            var horaInicio = _this.$moment(_this.$moment(item.val().Inicio, 'DD/MM/YYYY HH:mm').format('HH:mm'), 'HH:mm')
            var fim = _this.$moment(_this.$moment(item.val().Fim, 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY'), 'DD/MM/YYYY')
            var horaFim = _this.$moment(_this.$moment(item.val().Fim, 'DD/MM/YYYY HH:mm').format('HH:mm'), 'HH:mm')

            if (dia.isSameOrBefore(fim) && dia.isSameOrAfter(inicio)) {
              _this.reservas.push({
                'tipo': 'local',
                'horaInicio': dia.isSame(inicio) ? horaInicio.format('HH:mm') : '07:00',
                'horaFim': dia.isSame(fim) ? horaFim.format('HH:mm') : '23:00',
                'local': item.val().Local,
                'solicitante': _this.usuarios[_this.usuarios.map(function (e) { return e.id }).indexOf(item.val().Solicitante)]
              })
            }
          })
        })

        db.ref('Reservas/aulas').orderByChild('Status').equalTo('Confirmada').on('value', function (snapshot) {
          snapshot.forEach(function (item) {
            var inicio = _this.$moment(item.val().Inicio, 'DD/MM/YYYY')
            var fim = _this.$moment(item.val().Fim, 'DD/MM/YYYY')

            if (dia.isSameOrBefore(fim) && dia.isSameOrAfter(inicio) && dia.day() === item.val().diaSemana) {
              _this.reservas.push({
                'tipo': 'aula',
                'horaInicio': item.val().horaInicio,
                'horaFim': item.val().horaFim,
                'local': item.val().Local,
                'solicitante': _this.usuarios[_this.usuarios.map(function (e) { return e.id }).indexOf(item.val().Solicitante)]
              })
            }
          })
        })
      },
      nextDay () {
        let _this = this

        this.dia = this.$moment(_this.dia.add(1, 'day'))
        this.atualizaReserva()
      },
      prevDay () {
        let _this = this

        this.dia = this.$moment(_this.dia.add(-1, 'day'))
        this.atualizaReserva()
      },
      changeTab () {
        this.tabDate = !(this.tabDate)
      },
      changeDate (date) {
        this.dia = date
        this.changeTab()
        this.atualizaReserva()
      }
    }
  }
</script>

<style>
  .buttons-icons, .dia {
    cursor: pointer;
  }

  .dia:hover + small .buttons-icons {
    color: #1890ff;
  }

  .buttons-icons:hover {
    color: #1890ff;
  }

  .anticon.anticon-cross-circle.ant-calendar-picker-clear {
    display: none;
  }

  .ant-list.ant-list-split .ant-spin-nested-loading {
    overflow-y: scroll;
    height: 65vh;
  }

  .ant-tag {
    margin-top: 8px
  }
</style>