<template>
      <div v-if="!loader.loading && role === 'Comum'" class="container">
        <vue-event-calendar :events="reservasCalendar"></vue-event-calendar>
      </div>
</template>

<script>
import RingLoader from 'vue-spinner/src/RingLoader.vue'
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
        confirmadas: [],
        pendentes: []
      },
      equipamentos: {
        manutencao: [],
        quebrados: []
      },
      loader: {
        loading: true,
        color: '#007bff',
        size: '100px'
      }
    }
  },
  components: {
    RingLoader
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
    if (this.role === 'Comum') {
      db.ref('Reservas/equipamentos').orderByChild('Solicitante').equalTo(auth.currentUser.uid).on('value', function (snapshot) {
        _this.loader.loading = true
        _this.reservasUser = []
        snapshot.forEach(function (childSnapshot) {
          db.ref('Equipamentos/' + childSnapshot.val().Equipamento).on('value', function (equip) {
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
