<template>
  <div id="ReservaDetails">
    <div class="container-fluid">
      <div v-if="action === 'view'" class="container">
        <v-dialog/>
        <div class="row">
          <div class="col-sm-12 col-md-6">
            <h5><strong>Equipamento</strong>: {{reserva.Equipamento}}</h5>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-sm-12 col-md-4">
            <p><strong>Inicio</strong><br />{{reserva.Inicio}}</p>
          </div>
          <div class="col-sm-12 col-md-4">
            <p><strong>Fim</strong><br />{{reserva.Fim}}</p>
          </div>
          <div class="col-sm-12 col-md-4">
            <p><strong>Status</strong><br />{{reserva.Status}}</p>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-12 text-right">
            <ul class="list-inline d-inline-flex">
              <li>
                <router-link :to="{ name: 'Reservas', params: {}}" class="mr-2 list-inline-item btn btn-primary btn-sm">Voltar</router-link>
              </li>
              <li v-if="role === 'admin' || role === 'Supervisor'">
                <span v-on:click="confirmarDelete(key)" class="list-inline-item btn btn-danger btn-sm">Deletar</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-else class="container">
        <div class="row justify-content-center">
          <alert :showAlert="alert.showAlert" :dismissible="alert.dismissible" :type="alert.type" :title="alert.title" :msg="alert.msg"></alert>
          <form id="editFormReserva" class="needs-validation" v-on:submit.prevent novalidate>
            <div class="form-row">
              <div class="col-12 col-xl-6">
                <label for="inicioReserva"><strong>Inicio da reserva</strong></label><br>
                <date-picker id="inicioReserva" v-model="periodoReservar.inicio" :config="optionsInicio"></date-picker>
              </div>
              <div class="col-12 col-xl-6">
                <label for="fimReserva"><strong>Fim da reserva</strong></label>
                <date-picker id="fimReserva" v-model="periodoReservar.fim" :config="optionsFim"></date-picker>
              </div>
            </div>
            <div class="form-row">
              <div class="col-sm-6 justify-content-right">
                <button type="submit" v-on:click="verificarDados" class="btn btn-primary btn-block" >Confirmar</button>
              </div>
              <div class="col-sm-6 justify-content-left">
                <router-link :to="{ name: 'Reservas', params: {}}" class="btn btn-danger btn-block" v-on:click="autocompleteHide()" > Voltar</router-link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  </template>

  <script>
  import datePicker from 'vue-bootstrap-datetimepicker'
  import Alert from '../utility/Alert.vue'
  import RingLoader from 'vue-spinner/src/RingLoader.vue'
  import firebaseApp from '../../firebase-controller.js'
  const db = firebaseApp.database()
  const auth = firebaseApp.auth()
  export default {
    name: 'ReservaDetails',
    data () {
      return {
        role: null,
        key: this.$route.params.key,
        action: this.$route.params.action,
        antecedenciaReserva: null,
        reserva: null,
        requestList: [],
        loader: {
          loading: true,
          color: '#007bff',
          size: '100px'
        },
        reserv: {
          Equipamento: '',
          Inicio: '',
          Fim: '',
          Status: ''
        },
        periodoReservar: {
          inicio: null,
          fim: null
        },
        timeAPI: 'https://script.googleusercontent.com/macros/echo?user_content_key=Z4OOvXdX0KkKqfHxaNx-MeLwgf63O5c71wwLC3m16Dz2_J2_2rwvxV_BLlI43zns_L49PiyRcIlLk-mMghzhABEfwj_Lx6d6m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnJ9GRkcRevgjTvo8Dc32iw_BLJPcPfRdVKhJT5HNzQuXEeN3QFwl2n0M6ZmO-h7C6bwVq0tbM60-_IQDS8gp7-wwK7XAnp4CU0ajkDCYtjwe&lib=MwxUjRcLr2qLlnVOLh12wSNkqcO1Ikdrk',
        optionsInicio: {
          format: 'MM/DD/YYYY HH:mm',
          disabledHours: [0, 1, 2, 3, 4, 5, 6, 23],
          stepping: 10,
          daysOfWeekDisabled: [0],
          disabledTimeIntervals: [],
          useCurrent: false,
          sideBySide: true,
          minDate: null,
          maxDate: null,
          defaultDate: null,
          locale: 'pt-br',
          inline: true
        },
        optionsFim: {
          format: 'MM/DD/YYYY HH:mm',
          disabledHours: [0, 1, 2, 3, 4, 5, 6, 23],
          stepping: 10,
          daysOfWeekDisabled: [0],
          disabledTimeIntervals: [],
          useCurrent: false,
          sideBySide: true,
          minDate: null,
          maxDate: null,
          defaultDate: null,
          locale: 'pt-br',
          inline: true
        },
        alert: {
          showAlert: false,
          dismissible: false,
          type: '',
          title: '',
          msg: ''
        }
      }
    },
    components: {
      datePicker,
      Alert,
      RingLoader
    },
    computed: {
      periodoFormatado: function () {
        return this.$moment(new Date(this.periodoReservar.inicio)).format('[De] DD/MM/YYYY [às] HH:mm [até] ') + this.$moment(new Date(this.periodoReservar.fim)).format('DD/MM/YYYY [às] HH:mm')
      }
    },
    beforeMount: function () {
      this.loader.loading = true
      let _this = this
      db.ref('Reservas/equipamentos/' + this.$route.params.key).on('value', function (snapshot) {
        _this.reserva = snapshot.val()
        _this.reserv.Equipamento = _this.reserva.Equipamento
        _this.reserv.Inicio = _this.reserva.Inicio
        _this.reserv.Fim = _this.reserva.Fim
        _this.reserv.Status = _this.reserva.Status
        _this.loader.loading = false
      })
    },
    mounted: function () {
      let _this = this
      db.ref('Usuarios/' + auth.currentUser.uid + '/role').on('value', function (snapshot) {
        _this.role = snapshot.val()
      })
      db.ref('Controle/Configuracao/TempoMinAntesReserva').on('value', function (snapshot) {
        _this.antecedenciaReserva = snapshot.val()
      })
      this.getValidDates()
    },
    methods: {
      getValidDates () {
        let _this = this
        fetch(this.timeAPI).then(res => res.json()).then((out) => {
          let year = out.year
          let month = out.month
          let day = out.day
          let hours = out.hours < 7 ? 7 : (out.hours > 23 ? 22 : out.hours)
          hours = this.role === 'Comum' ? hours + this.antecedenciaReserva : hours
          let minutes = out.minutes % 10 ? (out.minutes + (out.minutes % 10)) : out.minutes
          minutes = minutes >= 60 ? 0 : minutes
          if (this.role === 'Comum') {
            this.optionsInicio.maxDate = month >= 8 ? this.$moment(new Date('12' + '/' + '20' + '/' + year + ' ' + hours + ':' + minutes)) : this.$moment(new Date('7' + '/' + '15' + '/' + year + ' ' + hours + ':' + minutes))
            this.optionsFim.maxDate = month >= 8 ? this.$moment(new Date('12' + '/' + '20' + '/' + year + ' ' + hours + ':' + minutes)) : this.$moment(new Date('7' + '/' + '15' + '/' + year + ' ' + hours + ':' + minutes))
          } else if (this.role === 'Supervisor' || this.role === 'admin') {
            this.optionsInicio.maxDate = this.$moment(new Date(month + '/' + day + '/' + (year + 2) + ' ' + hours + ':' + minutes))
            this.optionsFim.maxDate = this.$moment(new Date(month + '/' + day + '/' + (year + 2) + ' ' + hours + ':' + minutes))
          }
          this.optionsInicio.minDate = this.$moment(new Date(month + '/' + day + '/' + year + ' ' + hours + ':' + minutes))
          this.optionsFim.minDate = this.$moment(new Date(month + '/' + day + '/' + year + ' ' + hours + ':' + minutes))
          this.optionsInicio.defaultDate = this.$moment(this.reserva.Inicio)
          _this.optionsFim.defaultDate = this.$moment(this.reserva.Fim)
        }).then(function () {
          db.ref('Reservas/equipamentos/').orderByChild('Equipamento').equalTo(_this.reserva.Equipamento).on('value', function (snapshot) {
            let reservationDates = []
            snapshot.forEach(function (childSnapshot) {
              let inicioPeriodo = new Date(childSnapshot.val().Inicio)
              let fimPeriodo = new Date(childSnapshot.val().Fim)
              if ((childSnapshot.val().Status !== 'Cancelada') && (_this.$moment(fimPeriodo) >= _this.optionsInicio.minDate)) {
                _this.requestList.push(childSnapshot.val())
                reservationDates.push([_this.$moment(inicioPeriodo).subtract(10, 'm'), _this.$moment(fimPeriodo).add(10, 'm')])
              }
            })
            _this.optionsInicio.disabledTimeIntervals = reservationDates
            _this.optionsFim.disabledTimeIntervals = reservationDates
          })
        }).then(function () {
          _this.loader.loading = false
        })
      },
      checkPeriodo () {
        let inicio = this.$moment(new Date(this.periodoReservar.inicio))
        let fim = this.$moment(new Date(this.periodoReservar.fim))
        if (inicio.isSameOrAfter(fim)) {
          this.periodoReservar.inicio = this.optionsInicio.defaultDate
          this.periodoReservar.fim = this.optionsFim.defaultDate
          this.$notify({
            group: 'notify',
            type: 'error',
            title: 'Oops!',
            text: 'Selecione um período válido!',
            duration: 10000
          })
          return [-1]
        }
        let _this = this
        var conflitos = []
        this.requestList.forEach(function (reserva) {
          if (_this.$moment(new Date(reserva.Inicio)).isBetween(inicio, fim) || _this.$moment(new Date(reserva.Fim)).isBetween(inicio, fim)) {
            conflitos[0] = 1
            conflitos.push(reserva)
          }
        })
        if (conflitos.length > 0) {
          return conflitos
        }
        // db.ref('Reservas/locais').orderByChild('Local').equalTo(this.equipamento.Local).on('value', function (snapshot) {
        //   snapshot.forEach(function (reservaLab) {
        //     if (_this.$moment(new Date(reservaLab.val().Inicio)).isBetween(inicio, fim) || _this.$moment(new Date(reservaLab.val().Fim)).isBetween(inicio, fim) || inicio.isSame(_this.$moment(new Date(reservaLab.val().Inicio))) || fim.isSame(_this.$moment(new Date(reservaLab.val().Fim)))) {
        //       conflitos[0] = 2
        //       conflitos.push(reservaLab.val())
        //     }
        //   })
        // })
        return conflitos
      },
      verificarDados () {
        let _this = this
        let conflitos = this.checkPeriodo()
        console.log(conflitos)
        let msg = ''
        if (conflitos.length > 0 && conflitos[0] !== -1) {
          if (conflitos[0] === 1) {
            this.verificandoDados = false
            msg = 'Algumas das reservas deste equipamento estão entrando em conflito com o periodo selecionado por você. Este equipamento está reservado nos seguintes períodos conflitantes com o seu: '
            conflitos.forEach(function (conflito) {
              if (conflito !== 1) {
                let inicio = new Date(conflito.Inicio)
                let fim = new Date(conflito.Fim)
                msg += _this.$moment(inicio).format('[| de ] DD/MM/YYYY [às] HH:mm [até] ') + _this.$moment(fim).format('DD/MM/YYYY [às] HH:mm [| ]')
              }
            })
            msg += 'Por favor escolha um período que não interfira nestes.'
            _this.alert.type = 'alert-danger'
            _this.alert.dismissible = true
            _this.alert.title = 'Oops!'
            _this.alert.msg = msg
            _this.alert.showAlert = true
          } else if (conflitos[0] === 2) {
            this.$parent.currentStep = 2
            this.verificandoDados = false
            msg = 'Este equipamento se encontra no local ' + this.equipamento.Local + ' que está reservado nos seguintes períodos conflitantes com o período selecionado: '
            conflitos.forEach(function (conflito) {
              if (conflito !== 2) {
                let inicio = new Date(conflito.Inicio)
                let fim = new Date(conflito.Fim)
                msg += _this.$moment(inicio).format('[| de ] DD/MM/YYYY [às] HH:mm [até] ') + _this.$moment(fim).format('DD/MM/YYYY [às] HH:mm [| ]')
              }
            })
            msg += 'Por favor escolha um período que não interfira nestes.'
            _this.alert.type = 'alert-danger'
            _this.alert.dismissible = true
            _this.alert.title = 'Oops!'
            _this.alert.msg = msg
            _this.alert.showAlert = true
          }
        } else if (conflitos[0] !== -1) {
          this.submitReserva()
        }
      },
      submitReserva () {
        let form = document.getElementById('editFormReserva')
        form.classList.add('hideOn')
        this.loader.loading = true
        this.alert.showAlert = false
        let _this = this
        db.ref('Reservas/equipamentos').child(_this.key).update({
          'Inicio': _this.reserv.Inicio,
          'Fim': _this.reserv.Fim
        }).then(function () {
          _this.$notify({
            group: 'notify',
            type: 'success',
            title: 'Yey!',
            text: 'Reserva ' + _this.key + ', com patrimônio ' + _this.reserv.Equipamento + ', foi atualizada com sucesso!',
            duration: 10000
          })
          _this.$router.replace('/reservas/equipamentos/' + _this.key + '/view')
          setTimeout(function () {
            location.reload()
          }, 2000)
        }).catch((err) => {
          _this.alert.type = 'alert-danger'
          _this.alert.dismissible = true
          _this.alert.title = 'Oops!'
          _this.alert.msg = 'A reserva ' + _this.key + ', com patrimônio ' + _this.reserv.Equipamento + ', não foi atualizada devido ao Erro: ' + err
          _this.loader.loading = false
          _this.alert.showAlert = true
          form.classList.remove('hideOn')
          console.log('Erro: ' + err)
        })
      },
      confirmarDelete (reserva) {
        this.$modal.show('dialog', {
          title: 'Cuidado!',
          text: 'Realmente deseja deletar a reserva: ' + reserva + '? <br> Essa ação não pode ser desfeita',
          buttons: [
            {
              title: 'Deletar',
              handler: () => {
                let _this = this
                db.ref('Reservas/equipamentos').child(reserva).remove().then(function () {
                  _this.$notify({
                    group: 'notify',
                    type: 'success',
                    title: 'Yey!',
                    text: 'Reserva <strong>' + reserva + '</strong> deletada com sucesso'
                  })
                  _this.$router.replace('/reservas')
                }).catch((err) => {
                  _this.$notify({
                    group: 'notify',
                    type: 'error',
                    title: 'Yey!',
                    text: 'Falha ao deletar reserva: ' + reserva
                  })
                  console.log('Erro: ' + err)
                })
                this.$modal.hide('dialog')
              }
            },
            {
              title: 'Cancelar',
              default: true
            }
          ]
        })
      }
    }
  }
  </script>

  <style>
  #editFormReserva {
    width: 100vw;
  }
  </style>
