<template>
  <a-spin :spinning = "loading">
    <a-row :gutter = "16">  
      <a-col :span = "8" style = "margin-top: 56px;">
        <a-card>
          <a-row slot = "title" style = "text-align: center;"> 
            <a-col :span = "4"> 
              <a-icon class = "buttons-icons" type = "double-left" @click = "prevYear" />
              <a-icon class = "buttons-icons" type = "left" @click = "prevMonth" />
            </a-col>

            <a-col :span = "16"> 
              <i> {{ this.data.format('DD/MM/YYYY') }} </i>
            </a-col>

            <a-col :span = "4"> 
              <a-icon class = "buttons-icons" type = "right" @click = "nextMonth" />
              <a-icon class = "buttons-icons" type = "double-right" @click = "nextYear" />
            </a-col>
          </a-row>

          <a-calendar :value = "data" :fullscreen = "false" @change = "(date, dateString) => changeDate(date)" />
        </a-card>
      </a-col>
    
      <a-col :span = "16">
        <a-tabs type = "card">
          <a-tab-pane tab = "Reservas de Equipamentos" key = "1">
            <a-list :locale = "{ emptyText: 'Sem Reservas neste dia' }" size = "small" bordered :dataSource = "reservasEquipamentos">
              <a-list-item slot = "renderItem" slot-scope = "item">
                <a-tooltip placement = "left">
                  <template slot = "title">
                    <span> equipamento </span>
                  </template>

                  <a-list-item-meta>
                    <span slot = "description">
                      <b> [{{ item.solicitante.ra }} - {{ item.solicitante.nome }}] </b>
                      <i> Equipamento: {{ item.equipamento.nome }} </i>.
                      Das {{ item.horaInicio }} até {{ item.horaFim }}
                    </span>
                    
                    <a-avatar :size = "20" slot = "avatar" :style = "{ backgroundColor: '#00a2ae' }" />
                  </a-list-item-meta>
                </a-tooltip>
              </a-list-item>
            </a-list>
          </a-tab-pane>

          <a-tab-pane tab = "Reservas de Locais" key = "2">
            <a-list :locale = "{ emptyText: 'Sem Reservas neste dia' }" size = "small" bordered :dataSource = "reservasLocais">
              <a-list-item slot = "renderItem" slot-scope = "item">
                <a-tooltip placement = "left">
                  <template slot = "title">
                    <span> local </span>
                  </template>

                  <a-list-item-meta>
                    <span slot = "description">
                      <b> [{{ item.solicitante.ra }} - {{ item.solicitante.nome }}] </b>
                      <i> Local: {{ item.local }}. </i>
                      Das {{ item.horaInicio }} até {{ item.horaFim }}
                    </span>
                    
                    <a-avatar :size = "20" slot = "avatar" :style = "{ backgroundColor: '#7265e6' }" />
                  </a-list-item-meta>
                </a-tooltip>
              </a-list-item>
            </a-list>
          </a-tab-pane>

          <a-tab-pane tab = "Reservas de Aulas" key = "3">
            <a-list :locale = "{ emptyText: 'Sem Reservas neste dia' }" size = "small" bordered :dataSource = "reservasAulas">
              <a-list-item slot = "renderItem" slot-scope = "item">
                <a-tooltip placement = "left">
                  <template slot = "title">
                    <span> aula </span>
                  </template>

                  <a-list-item-meta>
                    <span slot = "description">
                      <b> [{{ item.solicitante.ra }} - {{ item.solicitante.nome }}] </b>
                      <i> Local da Aula: {{ item.local }}. </i>
                      Das {{ item.horaInicio }} até {{ item.horaFim }}
                    </span>
                    
                    <a-avatar :size = "20" slot = "avatar" :style = "{ backgroundColor: '#ffbf00' }" />
                  </a-list-item-meta>
                </a-tooltip>
              </a-list-item>
            </a-list>
          </a-tab-pane>

 
          <a-tab-pane key = "4">
            <a-badge slot = "tab" :dot = "reservasMinhas.length > 0"> Minhas Reservas </a-badge>

            <a-list :locale = "{ emptyText: 'Sem Reservas neste dia' }" size = "small" bordered :dataSource = "reservasMinhas">
              <a-list-item slot = "renderItem" slot-scope = "item">
                <a-tooltip placement = "left">
                  <template slot = "title">
                    <span> {{ item.tipo }} </span>
                  </template>

                  <a-list-item-meta>
                    <span v-if = "item.tipo === 'equipamento'" slot = "description">
                      <i> Equipamento: {{ item.equipamento.nome }} </i>.
                      Das {{ item.horaInicio }} até {{ item.horaFim }}
                    </span>

                    <span v-else-if = "item.tipo === 'local'" slot = "description">
                      <i> Local: {{ item.local }}. </i>
                      Das {{ item.horaInicio }} até {{ item.horaFim }}
                    </span>

                    <span v-else slot = "description">
                      <i> Local da Aula: {{ item.local }}. </i>
                      Das {{ item.horaInicio }} até {{ item.horaFim }}
                    </span>
                    
                    <a-avatar :size = "20" slot = "avatar" :style = "{ backgroundColor: item.tipo === 'equipamento' ? '#00a2ae' : item.tipo === 'local' ? '#7265e6' : '#ffbf00' }" />
                  </a-list-item-meta>
                </a-tooltip>
              </a-list-item>
            </a-list>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </a-spin>
</template>
 
<script>
  import firebaseApp from '../../firebase-controller.js'

  const db = firebaseApp.database()
  const auth = firebaseApp.auth()

  export default {
    data () {
      return {
        loading: true,
        data: this.$moment().hours(0).minutes(0).seconds(0).milliseconds(0),
        usuario: auth.currentUser.uid,
        equipamentos: [],
        usuarios: [],
        reservasEquipamentos: [],
        reservasLocais: [],
        reservasAulas: [],
        reservasMinhas: []
      }
    },
    beforeMount: function () {
      let _this = this
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

          _this.atualizaReservas()
          _this.loading = false
        })
      })
    },
    methods: {
      prevMonth () {
        let _this = this

        this.data = this.$moment(_this.data.add(-1, 'month'))
        this.atualizaReservas()
      },
      prevYear () {
        let _this = this

        this.data = this.$moment(_this.data.add(-1, 'year'))
        this.atualizaReservas()
      },
      nextMonth () {
        let _this = this

        this.data = this.$moment(_this.data.add(1, 'month'))
        this.atualizaReservas()
      },
      nextYear () {
        let _this = this

        this.data = this.$moment(_this.data.add(1, 'year'))
        this.atualizaReservas()
      },
      changeDate (date) {
        this.data = date
        this.atualizaReservas()
      },
      atualizaReservas () {
        let _this = this
        var dia = _this.$moment(_this.data.format('DD/MM/YYYY'), 'DD/MM/YYYY')
        _this.reservasEquipamentos = []
        _this.reservasLocais = []
        _this.reservasAulas = []
        _this.reservasMinhas = []

        db.ref('Reservas/equipamentos').orderByChild('Status').equalTo('Confirmada').on('value', function (snapshot) {
          snapshot.forEach(function (item) {
            var inicio = _this.$moment(_this.$moment(item.val().Inicio, 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY'), 'DD/MM/YYYY')
            var horaInicio = _this.$moment(_this.$moment(item.val().Inicio, 'DD/MM/YYYY HH:mm').format('HH:mm'), 'HH:mm')
            var fim = _this.$moment(_this.$moment(item.val().Fim, 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY'), 'DD/MM/YYYY')
            var horaFim = _this.$moment(_this.$moment(item.val().Fim, 'DD/MM/YYYY HH:mm').format('HH:mm'), 'HH:mm')

            if (dia.isSameOrBefore(fim) && dia.isSameOrAfter(inicio)) {
              if (item.val().Solicitante === _this.usuario) {
                _this.reservasMinhas.push({
                  'tipo': 'equipamento',
                  'horaInicio': dia.isSame(inicio) ? horaInicio.format('HH:mm') : '07:00',
                  'horaFim': dia.isSame(fim) ? horaFim.format('HH:mm') : '23:00',
                  'equipamento': _this.equipamentos[_this.equipamentos.map(function (e) { return e.id }).indexOf(item.val().Equipamento)]
                })
              }

              _this.reservasEquipamentos.push({
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
              if (item.val().Solicitante === _this.usuario) {
                _this.reservasMinhas.push({
                  'tipo': 'local',
                  'horaInicio': dia.isSame(inicio) ? horaInicio.format('HH:mm') : '07:00',
                  'horaFim': dia.isSame(fim) ? horaFim.format('HH:mm') : '23:00',
                  'local': item.val().Local
                })
              }

              _this.reservasLocais.push({
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
              if (item.val().Solicitante === _this.usuario) {
                _this.reservasMinhas.push({
                  'tipo': 'aula',
                  'horaInicio': item.val().horaInicio,
                  'horaFim': item.val().horaFim,
                  'local': item.val().Local
                })
              }

              _this.reservasAulas.push({
                'horaInicio': item.val().horaInicio,
                'horaFim': item.val().horaFim,
                'local': item.val().Local,
                'solicitante': _this.usuarios[_this.usuarios.map(function (e) { return e.id }).indexOf(item.val().Solicitante)]
              })
            }
          })
        })
      }
    }
  }
</script>

<style>
  .buttons-icons {
    cursor: pointer;
  }

  .buttons-icons:hover {
    color: #1890ff;
  }

  .ant-fullcalendar-header {
    display: none;
  }

  .ant-fullcalendar.ant-fullcalendar-full {
    border: none
  }

  .ant-list.ant-list-split .ant-spin-nested-loading {
    overflow-y: scroll;
    height: 50vh;
  }
</style>
