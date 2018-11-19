<template>
  
  <div id="home">
    <div class="container-fluid">
      <div v-if="role !== 'Comum'" class="container">
        <resumo-supervisor :month="resumo.month" :day="resumo.day" :time="resumo.time" :reservasEquipConfirmadasLength="resumo.reservas_equip_confirmadas_length" :reservasEquipPendentesLength="resumo.reservas_equip_pendentes_length" :equipamentosQuebradosLength="resumo.equipamentos_quebrados_length" :equipamentosManutencaoLength="resumo.equipamentos_manutencao_length" :reservasLocalConfirmadasLength="resumo.reservas_local_confirmadas_length" :reservasLocalPendentesLength="resumo.reservas_local_pendentes_length" :reservas="resumo.reservados" :diaResumo="resumo.dia"></resumo-supervisor>
      </div>
      <div v-if="!loader.loading && role !== 'Comum'" class="container">
        <resumo-supervisor :month="resumo.month" :day="resumo.day" :time="resumo.time" :reservasEquipConfirmadasLength="resumo.reservas_equip_confirmadas_length" :reservasEquipPendentesLength="resumo.reservas_equip_pendentes_length" :equipamentosQuebradosLength="resumo.equipamentos_quebrados_length" :equipamentosManutencaoLength="resumo.equipamentos_manutencao_length" :reservasLocalConfirmadasLength="resumo.reservas_local_confirmadas_length" :reservasLocalPendentesLength="resumo.reservas_local_pendentes_length" :reservas="resumo.reservados" :diaResumo="resumo.dia"></resumo-supervisor>
      </div>
      <div v-if="!loader.loading && role === 'Comum'" class="container">
        <resumo-comum :month="resumo.month" :reservasUser="resumo.reservasUser"></resumo-comum>
      </div>
    </div>
  </div>
</template>

<script>
import ResumoSupervisor from './ResumoSupervisor.vue'
import ResumoComum from './ResumoComum.vue'
import firebaseApp from '../../firebase-controller.js'
const auth = firebaseApp.auth()
const db = firebaseApp.database()
var moment = require('moment')
export default {
  name: 'home',
  data () {
    return {
      hours: null,
      minutes: null,
      seconds: null,
      time: null,
      month: null,
      day: null,
      role: null,
      reservasUser: [],
      reservasCalendar: [],
      reservas: {
        equipConfirmadas: [],
        equipPendentes: [],
        localConfirmadas: [],
        localPendentes: []
      },
      equipamentos: {
        manutencao: [],
        quebrados: []
      },
      loader: {
        loading: true,
        color: '#007bff',
        size: '100px'
      },
      resumo: {
        reservas_equip_confirmadas_length: 0,
        reservas_equip_pendentes_length: 0,
        equipamentos_quebrados_length: 0,
        equipamentos_manutencao_length: 0,
        reservas_local_confirmadas_length: 0,
        reservas_local_pendentes_length: 0,
        reservados: [],
        dia: moment()
      }
    }
  },
  components: {
    RingLoader,
    ResumoSupervisor,
    ResumoComum
  },
  created: function () {
    var _this = this
    db.ref('Usuarios/' + auth.currentUser.uid + '/role').on('value', function (snapshot) {
      _this.loader.loading = true
      _this.role = snapshot.val()
      _this.loader.loading = false
    })
  },
  mounted: function () {
    this.loader.loading = true
    let now = new Date()
    this.hours = now.getHours()
    this.minutes = this.zeroPattern(now.getMinutes())
    this.seconds = this.zeroPattern(now.getSeconds())
    this.time = this.hours + ':' + this.minutes
    this.day = this.zeroPattern(now.getDate())
    var month = now.getMonth()
    if (month === 0) {
      this.month = 'Jan'
    } else if (month === 1) {
      this.month = 'Fev'
    } else if (month === 2) {
      this.month = 'Mar'
    } else if (month === 3) {
      this.month = 'Abr'
    } else if (month === 4) {
      this.month = 'Mai'
    } else if (month === 5) {
      this.month = 'Jun'
    } else if (month === 6) {
      this.month = 'Jul'
    } else if (month === 7) {
      this.month = 'Ago'
    } else if (month === 8) {
      this.month = 'Set'
    } else if (month === 9) {
      this.month = 'Out'
    } else if (month === 10) {
      this.month = 'Nov'
    } else if (month === 11) {
      this.month = 'Dez'
    }
    setInterval(this.updateTime, 1000)

    var _this = this
    if (this.role === 'Supervisor' || this.role === 'admin') {
      db.ref('Reservas/equipamentos').orderByChild('Status').equalTo('Pendente').on('value', function (snapshot) {
        _this.loader.loading = true
        _this.reservas.equipPendentes = []
        snapshot.forEach(function (childSnapshot) {
          _this.reservas.equipPendentes.push(childSnapshot.key)
          // _this.resumo.reservas_pendentes_length = _this.resumo.reservas_pendentes_length + 1
        })
        _this.resumo.reservas_equip_pendentes_length = _this.reservas.equipPendentes.length
        // console.log('Lista Pendentes:' + _this.reservas.equipPendentes)
        // console.log('Lista Pendentes tem:' + _this.reservas.equipPendentes.length)
        _this.loader.loading = false
      })
      db.ref('Reservas/equipamentos').orderByChild('Status').equalTo('Confirmada').on('value', function (snapshot) {
        _this.loader.loading = true
        _this.reservas.equipConfirmadas = []
        // Percorre todos os equipamentos confirmados
        snapshot.forEach(function (childSnapshot) {
          // console.log('Solicitante:' + childSnapshot.val().Solicitante)
          // Pega dados do equipamento
          db.ref('Equipamentos/' + childSnapshot.val().Equipamento).on('value', function (equipa) {
            // Pega o usuário que solicitou o equipamento
            db.ref('Usuarios/' + childSnapshot.val().Solicitante).on('value', function (userSolicitante) {
              // console.log('hi' + userSolicitante.val().Nome)
              console.log('conf: ' + childSnapshot.key)
              // Adiciona o equipamento na lista de confirmados
              _this.reservas.equipConfirmadas.push(childSnapshot.key)
              // Pega data de início do empréstimo
              var dataInicio = moment(childSnapshot.val().Inicio.slice(0, 10), 'DD/MM/YYYY')
              // console.log('Inicio: ' + dataInicio.date() + dataInicio.month() + dataInicio.year())
              // console.log('hoje: ' + _this.resumo.dia.date() + _this.resumo.dia.month() + _this.resumo.dia.year())
              // Se a data de início de empréstimo é igual a data atual
              if ((dataInicio.year() === _this.resumo.dia.year()) && (dataInicio.month() === _this.resumo.dia.month()) && (dataInicio.date() === _this.resumo.dia.date())) {
                // console.log('Passou equipconf: ' + equipa.val())
                // Equipamento é adiciondo na lista de resumo
                _this.resumo.reservados.push([equipa.val().Nome, childSnapshot.val(), userSolicitante.val()])
              }

              // Guarda quantidade de confirmados
              _this.resumo.reservas_equip_confirmadas_length = _this.reservas.equipConfirmadas.length
              // _this.resumo.reservados = _this.reservas.equipConfirmadas
              console.log('Lista Confirmados E:' + _this.reservas.equipConfirmadas.length)
              _this.loader.loading = false
            })
          })
          // _this.resumo.reservados.push(childSnapshot.key)
        })
      })
      db.ref('Equipamentos').orderByChild('Status').equalTo('Em Manutenção').on('value', function (snapshot) {
        _this.loader.loading = true
        _this.equipamentos.manutencao = []
        _this.resumo.equipamentos_manutencao_length = 0
        snapshot.forEach(function (childSnapshot) {
          _this.equipamentos.manutencao.push(childSnapshot.key)
          // _this.resumo.equipamentos_manutencao_length = _this.resumo.equipamentos_manutencao_length + 1
        })
        _this.resumo.equipamentos_manutencao_length = _this.equipamentos.manutencao.length
        _this.loader.loading = false
      })
      db.ref('Equipamentos').orderByChild('Status').equalTo('Quebrado').on('value', function (snapshot) {
        _this.loader.loading = true
        _this.equipamentos.quebrados = []
        _this.resumo.equipamentos_quebrados_length = 0
        snapshot.forEach(function (childSnapshot) {
          _this.equipamentos.quebrados.push(childSnapshot.key)
          // _this.resumo.equipamentos_quebrados_length = _this.resumo.equipamentos_quebrados_length + 1
        })
        _this.resumo.equipamentos_quebrados_length = _this.equipamentos.quebrados.length
        _this.loader.loading = false
      })
      db.ref('Reservas/locais').orderByChild('Status').equalTo('Pendente').on('value', function (snapshot) {
        _this.loader.loading = true
        _this.reservas.localPendentes = []
        _this.resumo.reservas_local_pendentes_length = 0
        snapshot.forEach(function (childSnapshot) {
          _this.reservas.localPendentes.push(childSnapshot.key)
          // _this.resumo.reservas_local_pendentes_length = _this.resumo.reservas_local_pendentes_length + 1
        })
        _this.resumo.reservas_local_pendentes_length = _this.reservas.localPendentes.length
        _this.loader.loading = false
      })
      db.ref('Reservas/locais').orderByChild('Status').equalTo('Confirmada').on('value', function (snapshot) {
        _this.loader.loading = true
        _this.reservas.localConfirmadas = []
        // Percorre todos os locais confirmados
        snapshot.forEach(function (childSnapshot) {
          // Pega o usuário que solicitou o equipamento
          db.ref('Usuarios/' + childSnapshot.val().Solicitante).on('value', function (userSolicitante) {
            console.log('conf: ' + childSnapshot.key)
            // Adiciona o local na lista de confirmados
            _this.reservas.localConfirmadas.push([childSnapshot.key, childSnapshot.val(), userSolicitante.val()])
            // Pega data de início do empréstimo
            var dataInicio = moment(childSnapshot.val().Inicio.slice(0, 10), 'DD/MM/YYYY')
            if ((dataInicio.year() === _this.resumo.dia.year()) && (dataInicio.month() === _this.resumo.dia.month()) && (dataInicio.date() === _this.resumo.dia.date())) {
              // console.log('Passou equipconf')
              // Equipamento é adiciondo na lista de resumo
              _this.resumo.reservados.push([childSnapshot.val().Local, childSnapshot.val(), userSolicitante.val()])
            }

            // Guarda quantidade de confirmados
            _this.resumo.reservas_local_confirmadas_length = _this.reservas.localConfirmadas.length
            _this.loader.loading = false
            console.log('Lista Confirmados L:' + _this.reservas.localConfirmadas.length)
          })
        })
      })
    } else if (this.role === 'Comum') {
      db.ref('Reservas/equipamentos').orderByChild('Solicitante').equalTo(auth.currentUser.uid).on('value', function (snapshot) {
        _this.loader.loading = true
        _this.reservasUser = []
        snapshot.forEach(function (childSnapshot) {
          console.log('ReservasUser183184: ' + _this.reservasUser)
          db.ref('Equipamentos/' + childSnapshot.val().Equipamento).on('value', function (equip) {
            console.log('ChildSnapshot.key' + childSnapshot.key + '///' + 'reservasUser: ' + _this.reservasUser)
            _this.reservasUser.push([childSnapshot.key, childSnapshot.val(), equip.val()])
          })
        })
      })
      this.reservasUser.forEach(function (reserva) {
        let ReservaInicio = {
          date: _this.$moment(new Date(reserva[1].Inicio)).format('YYYY/MM/DD'),
          title: 'Inicio de reserva: Equipamento ' + reserva[2].Nome + ' - ' + reserva[1].Status,
          desc: 'Reserva do equipamento ' + reserva[1].Equipamento + ' - ' + reserva[2].Nome + ' no laboratório ' + reserva[2].Local + 'inicia às ' + _this.$moment(new Date(reserva[1].Inicio)).format('HH:mm')
        }
        let ReservaFim = {
          date: _this.$moment(new Date(reserva[1].Fim)).format('YYYY/MM/DD'),
          title: 'Fim de reserva: Equipamento ' + reserva[2].Nome + ' - ' + reserva[1].Status,
          desc: 'Reserva do equipamento ' + reserva[1].Equipamento + ' - ' + reserva[2].Nome + ' no laboratório ' + reserva[2].Local + 'se encerra às ' + _this.$moment(new Date(reserva[1].Fim)).format('HH:mm')
        }
        console.log('Teste')
        _this.reservasCalendar.push(ReservaInicio)
        _this.reservasCalendar.push(ReservaFim)
      })
      console.log('Reservas User: ' + _this.reservasUser)
      this.loader.loading = false
    }
  },
  methods: {
    zeroPattern (n) {
      return (parseInt(n, 10) >= 10 ? '' : '0') + n
    },
    updateTime: function () {
      let now = new Date()
      this.hours = now.getHours()
      this.minutes = this.zeroPattern(now.getMinutes())
      this.seconds = this.zeroPattern(now.getSeconds())
      this.time = this.hours + ':' + this.minutes
    }
  }
}
</script>
