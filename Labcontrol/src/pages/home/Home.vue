<template>
  <div id="home">
    <div class="container-fluid">
      <div v-if="loader.loading" class="row justify-content-center">
        <ring-loader :loading="loader.loading" :color="loader.color" :size="loader.size"></ring-loader>
      </div>
      <div v-if="!loader.loading && role !== 'Comum'" class="container">
        <resumo-supervisor :month="resumo.month" :day="resumo.day" :time="resumo.time" :reservasEquipConfirmadasLength="resumo.reservas_equip_confirmadas_length" :reservasEquipPendentesLength="resumo.reservas_equip_pendentes_length" :equipamentosQuebradosLength="resumo.equipamentos_quebrados_length" :equipamentosManutencaoLength="resumo.equipamentos_manutencao_length" :reservasLocalConfirmadasLength="resumo.reservas_local_confirmadas_length" :reservasLocalPendentesLength="resumo.reservas_local_pendentes_length"></resumo-supervisor>
      </div>
      <div v-if="!loader.loading && role === 'Comum'" class="container">
        <resumo-comum :month="resumo.month"></resumo-comum>
      </div>
    </div>
  </div>
</template>

<script>
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import ResumoSupervisor from './ResumoSupervisor.vue'
import ResumoComum from './ResumoComum.vue'
import firebaseApp from '../../firebase-controller.js'
const auth = firebaseApp.auth()
const db = firebaseApp.database()
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
        reservas_local_pendentes_length: 0
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
        _this.resumo.reservas_pendentes_length = 0
        snapshot.forEach(function (childSnapshot) {
          _this.reservas.equipPendentes.push(childSnapshot.key)
          _this.resumo.reservas_pendentes_length = _this.resumo.reservas_pendentes_length + 1
        })
        _this.loader.loading = false
      })
      db.ref('Reservas/equipamentos').orderByChild('Status').equalTo('Confirmada').on('value', function (snapshot) {
        _this.loader.loading = true
        _this.reservas.equipConfirmadas = []
        _this.resumo.reservas_confirmadas_length = 0
        snapshot.forEach(function (childSnapshot) {
          // TODO filtrar apenas as reservas cujo o periodo abranja a data atual
          // Usar comparação this.$moment().isBetween e this.$moment().isSame
          // assim como foi feito para filtrar datas válidas no momento da criação de uma reserva
          _this.reservas.equipConfirmadas.push(childSnapshot.key)
          _this.resumo.reservas_confirmadas_length = _this.resumo.reservas_confirmadas_length + 1
        })
        _this.loader.loading = false
      })
      db.ref('Equipamentos').orderByChild('Status').equalTo('Em Manutenção').on('value', function (snapshot) {
        _this.loader.loading = true
        _this.equipamentos.manutencao = []
        _this.resumo.equipamentos_manutencao_length = 0
        snapshot.forEach(function (childSnapshot) {
          _this.equipamentos.manutencao.push(childSnapshot.key)
          _this.resumo.equipamentos_manutencao_length = _this.resumo.equipamentos_manutencao_length + 1
        })
        _this.loader.loading = false
      })
      db.ref('Equipamentos').orderByChild('Status').equalTo('Quebrado').on('value', function (snapshot) {
        _this.loader.loading = true
        _this.equipamentos.quebrados = []
        _this.resumo.equipamentos_quebrados_length = 0
        snapshot.forEach(function (childSnapshot) {
          _this.equipamentos.quebrados.push(childSnapshot.key)
          _this.resumo.equipamentos_quebrados_length = _this.resumo.equipamentos_quebrados_length + 1
        })
        _this.loader.loading = false
      })
      db.ref('Reservas/locais').orderByChild('Status').equalTo('Pendente').on('value', function (snapshot) {
        _this.loader.loading = true
        _this.reservas.localPendentes = []
        _this.resumo.reservas_local_pendentes_length = 0
        snapshot.forEach(function (childSnapshot) {
          _this.reservas.localPendentes.push(childSnapshot.key)
          _this.resumo.reservas_local_pendentes_length = _this.resumo.reservas_local_pendentes_length + 1
        })
        _this.loader.loading = false
      })
      db.ref('Reservas/locais').orderByChild('Status').equalTo('Confirmada').on('value', function (snapshot) {
        _this.loader.loading = true
        _this.reservas.localConfirmadas = []
        _this.resumo.reservas_local_confirmadas_length = 0
        snapshot.forEach(function (childSnapshot) {
          // TODO filtrar apenas as reservas cujo o periodo abranja a data atual
          // Usar comparação this.$moment().isBetween e this.$moment().isSame
          // assim como foi feito para filtrar datas válidas no momento da criação de uma reserva
          _this.reservas.localConfirmadas.push(childSnapshot.key)
          _this.resumo.reservas_local_confirmadas_length = _this.resumo.reservas_local_confirmadas_length + 1
        })
        _this.loader.loading = false
      })
    } else if (this.role === 'Comum') {
      db.ref('Reservas/equipamentos').orderByChild('Solicitante').equalTo(auth.currentUser.uid).on('value', function (snapshot) {
        _this.loader.loading = true
        _this.reservasUser = []
        snapshot.forEach(function (childSnapshot) {
          db.ref('Equipamentos/' + childSnapshot.val().Equipamento).on('value', function (equip) {
            _this.reservasUser.push([childSnapshot.key, childSnapshot.val(), equip.val()])
          })
        })
      })
      console.log('oi')
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
