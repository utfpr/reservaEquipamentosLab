<template>
  <div id="home">
    <div class="container-fluid">
      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <div class="card border-light mb-3">
              <div class="card-header text-center">Resumo do dia:</div>
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
                <h3><router-link to="/equipamento" class="text-dark">Reservas</router-link></h3>
              </div>
              <div class="card-body text-primary">
                <h5 class="card-title">Confirmadas: <span class="text-dark">15</span> </h5>
                <br>
                <h5 class="card-title">Pendentes: <span class="text-dark">5</span></h5>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card border-primary mb-3">
              <div class="card-header text-center">
                <h3><router-link to="/equipamento" class="text-dark">Equipamentos</router-link></h3>
              </div>
              <div class="card-body text-primary">
                <h5 class="card-title">Quebrados: <span class="text-dark">15</span> </h5>
                <br>
                <h5 class="card-title">Em Manutenção: <span class="text-dark">5</span></h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      hours: null,
      minutes: null,
      seconds: null,
      time: null,
      month: null,
      day: null
    }
  },
  mounted: function () {
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
  },
  created: function () {
    let wrapper = document.getElementById('wrapper')
    wrapper.classList.add('toggled')
    this.$root.toggled = true
    this.updateTime()
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
