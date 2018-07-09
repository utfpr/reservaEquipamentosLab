<template>
  <div id="home">
    <div class="container-fluid">
      <div v-if="loader.loading" class="row justify-content-center">
        <ring-loader :loading="loader.loading" :color="loader.color" :size="loader.size"></ring-loader>
      </div>
      <div v-if="!loader.loading && role !== 'Comum'" class="container">
        <div class="row">
          <div class="col-sm-12">
            <div class="card border-secondary mb-3">
              <div class="card-header text-center"><h1>Resumo do dia</h1></div>
              <div class="card-body  justify-content-center">
                <div class="row" style="min-height: 8rem;">
                  <div class="col-sm-12 col-md-6 d-flex justify-content-center justify-content-sm-center justify-content-md-end">
                    <div class="card text-white bg-primary mb-3 text-center vertical-center" style="max-width: 5rem; min-width: 5rem; max-height:5rem; min-height:5rem">
                      <div class="card-header" style="padding:0;">{{ month }}</div>
                      <div class="card-body" style="padding:0;">
                        <h3>{{ day }}</h3>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6 d-flex justify-content-center justify-content-sm-center justify-content-md-start">
                    <h3 class="card-title text-sm-center text-md-left vertical-center">
                      <span style="font-size: 1.5rem;">
                        <i class="far fa-clock"></i>
                      </span> {{ time }}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="card border-primary mb-3">
              <div class="card-header text-center">
                <h3><router-link to="/equipamento" class="text-dark">Reservas de equipamentos</router-link></h3>
              </div>
              <div class="card-body text-primary">
                <h5 class="card-title">Confirmadas: <span class="text-dark">{{ reservas.confirmadas.length }}</span> </h5>
                <br>
                <h5 class="card-title">Pendentes: <span class="text-dark">{{ reservas.pendentes.length }}</span></h5>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card border-primary mb-3">
              <div class="card-header text-center">
                <h3><router-link to="/equipamento" class="text-dark">Equipamentos</router-link></h3>
              </div>
              <div class="card-body text-primary">
                <h5 class="card-title">Quebrados: <span class="text-dark">{{ equipamentos.quebrados.length }}</span></h5>
                <br>
                <h5 class="card-title">Em Manutenção: <span class="text-dark">{{ equipamentos.manutencao.length }}</span></h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!loader.loading && role === 'Comum'" class="container">
        <vue-event-calendar :events="reservasCalendar"></vue-event-calendar>
      </div>
    </div>
  </div>
</template>

<script>
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import firebaseApp from '../firebase-controller.js'
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
    if (this.role === 'Supervisor' || this.role === 'admin') {
      db.ref('Reservas/equipamentos').orderByChild('Status').equalTo('Pendente').on('value', function (snapshot) {
        _this.loader.loading = true
        _this.reservas.pendentes = []
        snapshot.forEach(function (childSnapshot) {
          _this.reservas.pendentes.push(childSnapshot.key)
        })
        _this.loader.loading = false
      })
      db.ref('Reservas/equipamentos').orderByChild('Status').equalTo('Confirmada').on('value', function (snapshot) {
        _this.loader.loading = true
        _this.reservas.confirmadas = []
        snapshot.forEach(function (childSnapshot) {
          // TODO filtrar apenas as reservas cujo o periodo abranja a data atual - Usar comapração com this.$moment() assim como foi feito para filtrar datas válidas no momento da criação de uma reserva
          _this.reservas.confirmadas.push(childSnapshot.key)
        })
        _this.loader.loading = false
      })
      db.ref('Equipamentos').orderByChild('Status').equalTo('Em Manutenção').on('value', function (snapshot) {
        _this.loader.loading = true
        _this.equipamentos.manutencao = []
        snapshot.forEach(function (childSnapshot) {
          _this.equipamentos.manutencao.push(childSnapshot.key)
        })
        _this.loader.loading = false
      })
      db.ref('Equipamentos').orderByChild('Status').equalTo('Quebrado').on('value', function (snapshot) {
        _this.loader.loading = true
        _this.equipamentos.quebrados = []
        snapshot.forEach(function (childSnapshot) {
          _this.equipamentos.quebrados.push(childSnapshot.key)
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
      console.log(this.reservasUser)
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
      console.log(this.reservasCalendar)
    }
    console.log(this.role)
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
