<template>
  <div id="cadastroReservation">
    <div v-if="!verificandoDados" class="container-fluid">
      <div v-if="loader.loading" class="row justify-content-center">
        <ring-loader :loading="loader.loading" :color="loader.color" :size="loader.size"></ring-loader>
      </div>
      <div v-if="!loader.loading" class="row justify-content-center">
        <alert :showAlert="alert.showAlert" :dismissible="alert.dismissible" :type="alert.type" :title="alert.title" :msg="alert.msg"></alert>
        <h4> Informe o período de sua reserva </h4>
        <form id="cadastroFormReservation" class="needs-validation" v-on:submit.prevent novalidate>
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
          <div class="d-flex d-md-none form-row justify-content-between">
            <!-- Mobile buttons -->
            <div class="col-12 col-md-6 text-right">
              <span v-on:click="verificarDados" class="btn btn-primary my-3 btn-block">Continuar reserva</span>
            </div>
            <div class="col-12 col-md-6 text-left">
              <button type="submit" v-on:click="$parent.voltar" class="btn btn-light btn-block" >Voltar</button>
            </div>
          </div>
          <div class="d-none d-md-flex form-row justify-content-between">
            <!-- Medium+ buttons -->
            <div class="col-12 col-md-6 text-left">
              <button type="submit" v-on:click="$parent.voltar" class="btn btn-light" >Voltar</button>
            </div>
            <div class="col-12 col-md-6 text-right">
              <!--aquiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii-->
              <div v-if="status == 1">
                <span v-on:click="verificarDadosSupervisor" class="btn btn-primary">Continuar reserva mesmo?</span>
              </div>
              <div v-else>
                <span v-on:click="verificarDados" class="btn btn-primary">Continuar reserva1</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div v-if="verificandoDados" class="container">
      <v-dialog/>
      <div class="row">
        <div class="col-12 text-center">
          <p v-if="objetoReserva === 'equipamento'" class="text-left">
            <strong>Equipamento a ser reservado:</strong> {{itemReserva}} - {{equipamento.Nome}}
            <br>
            <strong>Local do equipamento:</strong> {{equipamento.Local}}
            <br>
            <strong>Período de reserva:</strong> {{periodoFormatado}}
          </p>
          <p v-if="objetoReserva === 'laboratorio'" class="text-left">
            <strong>Laboratório a ser reservado:</strong> {{itemReserva}} - {{laboratorio.Descricao}}
            <br>
            <strong>Supervisor:</strong> {{laboratorio.Supervisor}}
            <br>
            <strong>Período de reserva:</strong> {{periodoFormatado}}
          </p>
        </div>
      </div>
      <div class="d-none d-md-flex row justify-content-between">
        <div class="col-12 col-md-6">
          <span v-on:click="voltar" class="btn btn-light">Voltar</span>
        </div>
        <div class="col-12 col-md-6">
          <span class="btn btn-primary my-3" v-on:click="solicitarReserva">Solicitar Reserva</span>
          <span class="btn btn-danger" v-on:click="cancelar">Cancelar</span>
        </div>
      </div>
      <div class="d-flex d-md-none row justify-content-center">
        <div class="col-12 col-md-6">
          <span v-on:click="voltar" class="btn btn-light btn-block">Voltar</span>
        </div>
        <div class="col-12 col-md-6">
          <span class="btn btn-primary mr-3 btn-block" v-on:click="solicitarReserva">Solicitar Reserva</span>
          <span class="btn btn-danger btn-block" v-on:click="cancelar">Cancelar</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import datePicker from 'vue-bootstrap-datetimepicker'
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css'
import {sendEmail} from '../../emailAPI.js'
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import firebaseApp from '../../firebase-controller.js'
const db = firebaseApp.database()
const auth = firebaseApp.auth()
export default {
  name: 'reserva',
  data () {
    return {
      // eu alterei aqui
      conflito: [],
      status: null,
      role: null,
      verificandoDados: false,
      antecedenciaReserva: null,
      itemReserva: this.$route.params.itemReserva,
      objetoReserva: this.$route.params.objetoReserva,
      equipamento: null,
      laboratorio: null,
      requestList: [],
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
      loader: {
        loading: false,
        color: '#007bff',
        size: '100px'
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
    RingLoader
  },
  computed: {
    periodoFormatado: function () {
      return this.$moment(new Date(this.periodoReservar.inicio)).format('[De] DD/MM/YYYY [às] HH:mm [até] ') + this.$moment(new Date(this.periodoReservar.fim)).format('DD/MM/YYYY [às] HH:mm')
    }
  },
  created: function () {
    this.$parent.currentStep = 2
    this.loader.loading = true
    let _this = this
    if (this.objetoReserva === 'equipamento') {
      db.ref('Equipamentos/' + this.itemReserva).on('value', function (snapshot) {
        _this.equipamento = snapshot.val()
      })
    } else if (this.objetoReserva === 'laboratorio') {
      db.ref('Locais/' + this.itemReserva).on('value', function (snapshot) {
        _this.laboratorio = snapshot.val()
      })
    }
    db.ref('Controle/Configuracao/TempoMinAntesReserva').on('value', function (snapshot) {
      _this.antecedenciaReserva = snapshot.val()
    })
  },
  mounted: function () {
    this.loader.loading = true
    if (this.equipamento || this.laboratorio) {
      let _this = this
      db.ref('Usuarios/' + auth.currentUser.uid).on('value', function (snapshot) {
        _this.role = snapshot.val().role
      })
      this.getValidDates()
    } else {
      this.$notify({
        group: 'notify',
        type: 'error',
        title: 'Oops!',
        text: 'Falha ao acessar o item de reserva'
      })
      this.$router.push('/home')
    }
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
        this.optionsInicio.defaultDate = this.$moment(this.optionsInicio.minDate)
        _this.optionsFim.defaultDate = this.$moment(this.optionsFim.minDate)
      }).then(function () {
        if (_this.objetoReserva === 'equipamento') {
          db.ref('Reservas/equipamentos/').orderByChild('Equipamento').equalTo(_this.itemReserva).on('value', function (snapshot) {
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
        } else if (_this.objetoReserva === 'laboratorio') {
          db.ref('Reservas/locais/').orderByChild('Local').equalTo(_this.itemReserva).on('value', function (snapshot) {
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
        }
      }).then(function () {
        _this.loader.loading = false
      })
    },
    checkPeriodo () {
      // pega a data de inicio da reserva
      let inicio = this.$moment(new Date(this.periodoReservar.inicio))
      // pega a data final da reserva
      let fim = this.$moment(new Date(this.periodoReservar.fim))
      // isSameOrAfter verifica se a data de inicio e igual oconflitou maior a data de fim
      if (inicio.isSameOrAfter(fim)) {
        // erro
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
      // requestList[] tem equipamento
      this.requestList.forEach(function (reserva) {
        // se a data estiver entre o inicio e final ele guarda ela em conflito
        if (_this.$moment(new Date(reserva.Inicio)).isBetween(inicio, fim) || _this.$moment(new Date(reserva.Fim)).isBetween(inicio, fim)) {
          conflitos[0] = 1
          conflitos.push(reserva)
        }
      })
      if (conflitos.length > 0) {
        return conflitos
      }
      if (this.objetoReserva === 'equipamento') {
        // verifica se ja existe um equipamento cadastrado nesta data
        db.ref('Reservas/locais').orderByChild('Local').equalTo(this.equipamento.Local).on('value', function (snapshot) {
          snapshot.forEach(function (reservaLab) {
            if (_this.$moment(new Date(reservaLab.val().Inicio)).isBetween(inicio, fim) || _this.$moment(new Date(reservaLab.val().Fim)).isBetween(inicio, fim) || inicio.isSame(_this.$moment(new Date(reservaLab.val().Inicio))) || fim.isSame(_this.$moment(new Date(reservaLab.val().Fim)))) {
              conflitos[0] = 2
              conflitos.push(reservaLab.val())
            }
          })
        })
      }
      return conflitos
    },
    verificarDados () {
      let _this = this
      let conflitos = this.checkPeriodo()
      let msg = ''
      this.conflito = conflitos
      if (conflitos.length > 0 && conflitos[0] !== -1) {
        // se voce for supervisor entra aqui
        if (this.role === 'Supervisor') {
          // reserva de equipamento ou laboratorio invalida
          if (conflitos[0] === 1) {
            this.$parent.currentStep = 2
            this.verificandoDados = false
            if (this.objetoReserva === 'equipamento') {
              msg = 'Algumas das reservas deste equipamento estão entrando em conflito com o periodo selecionado por você. Este equipamento está reservado nos seguintes períodos conflitantes com o seu: '
            } else if (this.objetoReserva === 'laboratorio') {
              msg = 'Algumas das reservas deste laboratório estão entrando em conflito com o periodo selecionado por você. Este laboratório está reservado nos seguintes períodos conflitantes com o seu: '
            }
            conflitos.forEach(function (conflito) {
              if (conflito !== 1) {
                let inicio = new Date(conflito.Inicio)
                let fim = new Date(conflito.Fim)
                msg += _this.$moment(inicio).format('[| de ] DD/MM/YYYY [às] HH:mm [até] ') + _this.$moment(fim).format('DD/MM/YYYY [às] HH:mm [| ]')
              }
            })
            msg += 'Deseja mesmo sobrescrever estas reservas? Se sim clique em confirmar reserva ou escolha outra data'
            _this.status = 1
            _this.alert.type = 'alert-danger'
            _this.alert.dismissible = true
            _this.alert.title = 'Oops!'
            _this.alert.msg = msg
            _this.alert.showAlert = true
            // erro se equipamento se encontra em algum local
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
            msg += 'Deseja mesmo sobrescrever estas reservas? Se sim clique em confirmar reserva ou escolha outra data'
            _this.status = 1
            _this.alert.type = 'alert-danger'
            _this.alert.dismissible = true
            _this.alert.title = 'Oops!'
            _this.alert.msg = msg
            _this.alert.showAlert = true
          }
        // se for qualquer usuario menos o Supervisor entra aqui
        } else {
          // reserva de equipamento ou laboratorio invalida
          if (conflitos[0] === 1) {
            this.$parent.currentStep = 2
            this.verificandoDados = false
            if (this.objetoReserva === 'equipamento') {
              msg = 'Algumas das reservas deste equipamento estão entrando em conflito com o periodo selecionado por você. Este equipamento está reservado nos seguintes períodos conflitantes com o seu: '
            } else if (this.objetoReserva === 'laboratorio') {
              msg = 'Algumas das reservas deste laboratório estão entrando em conflito com o periodo selecionado por você. Este laboratório está reservado nos seguintes períodos conflitantes com o seu: '
            }
            conflitos.forEach(function (conflito) {
              if (conflito !== 1) {
                let inicio = new Date(conflito.Inicio)
                let fim = new Date(conflito.Fim)
                msg += _this.$moment(inicio).format('[| de ] DD/MM/YYYY [às] HH:mm [até] ') + _this.$moment(fim).format('DD/MM/YYYY [às] HH:mm [| ]')
              }
            })
            // <------------------------------------------------------------------
            msg += 'Por favor escolha um período que não interfira nestes.'
            _this.alert.type = 'alert-danger'
            _this.alert.dismissible = true
            _this.alert.title = 'Oops!'
            _this.alert.msg = msg
            _this.alert.showAlert = true
            // erro se equipamento se encontra em algum local
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
        // mensagem se inicio for maior ou igual que fim
        }
      } else if (conflitos[0] !== -1) {
        this.verificandoDados = true
        this.$parent.currentStep = 3
      }
    },
    verificarDadosSupervisor () {
      this.verificandoDados = true
      this.$parent.currentStep = 3
      this.cancelarReserva()
      console.log('otimo', this.conflito)
    },
    cancelarReserva () {
      var usuario = []
      var conflito = this.conflito
      var i
      var count = this.conflito.length
      for (i = 1; i < count; i++) {
        db.ref('Usuarios/' + conflito[i].Solicitante).on('value', function (snapshot) {
          console.log('snap', snapshot.val())
          usuario.push(snapshot.val())
          // console.log('usuario', usuario)
          console.log('usuario', usuario[0].Nome)
          db.ref('Reservas/equipamentos').orderByChild('Solicitante').equalTo(conflito[1].Solicitante).on('value', function (snapshot2) {
            db.ref('Reservas/equipamentos' + snapshot2.val().Key).update({
              'Status': 'Cancelada'
            })
          })
          console.log('conflito', conflito)
          db.ref('Equipamentos/' + conflito[1].Equipamento).on('value', function (snapshot1) {
            var equipamento = snapshot1.val()
            console.log('equipamento', equipamento)
            let to = [usuario[0].Nome + ' <' + usuario[0].Email + '>']
            let subject = 'Reserva de equipamento cancelada'
            let textBody = 'Sua resersa foi cancelada'
            let htmlBody = '<h3>Reserva cancelada</h3><br><p>Sua reserva do equipamento: <strong>' + conflito[1].Equipamento + ' - ' + equipamento.Nome + '</strong> no local <strong>' + equipamento.Local + '</strong> no período: <strong>' + conflito[1].Inicio + ' até ' + conflito[1].Fim + '</strong> foi <strong>cancelada</strong> pelo responsável.</p><small>Este é um E-mail automático, por favor não responda</small>'
            sendEmail(to, subject, textBody, htmlBody)
          })
        })
      }
      // confirmar isto <------------------------------------------
      // db.ref('Reservas/equipamentos').child(this.conlfito[1].key()).update({
      // 'Status': 'Cancelada'
      // })
      // let to = [auth.currentUser.displayName + ' <' + this.userEmail + '>']
      // let subject = 'Reserva de equipamento cancelada'
      // let textBody = 'Sua resersa foi cancelada'

      // let htmlBody = '<h3>Reserva cancelada</h3><br><p>Sua reserva do equipamento: <strong>' + reserva[1].Equipamento + ' - ' + reserva[2].Nome + '</strong> no local <strong>' + reserva[2].Local + '</strong> no período: <strong>' + (this.$moment(new Date(reserva[1].Inicio)).format('[De] DD/MM/YYYY [às] HH:mm [até] ') + this.$moment(new Date(reserva[1].Fim)).format('DD/MM/YYYY [às] HH:mm')) + '</strong> foi <strong>cancelada</strong> pelo responsável.</p><small>Este é um E-mail automático, por favor não responda</small>'
      // sendEmail(to, subject, textBody, htmlBody)
      // this.$notify({
      // group: 'notify',
      // type: 'success',
      // title: 'Yey!',
      // text: 'Reserva <b>cancelada</b> com sucesso'
      // })
    },
    solicitarReserva () {
      if (this.role === 'Supervisor') { // se for supervisor mando mensagens para as pessoas que irao perder sua confirmacao
        this.verificarDadosSupervisor()
        if (this.$parent.currentStep === 3) {
          let _this = this
          if (this.objetoReserva === 'equipamento') {
            let reservaEquip = {
              Equipamento: this.itemReserva,
              Inicio: this.periodoReservar.inicio,
              Fim: this.periodoReservar.fim,
              Status: 'Confirmada',
              Solicitante: auth.currentUser.uid
            }
            db.ref('Reservas/equipamentos').push(reservaEquip).then(function () {
              let to = [auth.currentUser.displayName + ' <' + auth.currentUser.email + '>']
              let subject = 'Nova reserva de equipamento'
              let textBody = 'Sua resersa foi realizada e está aguardando aprovação'
              let htmlBody = '<h3>Nova reserva</h3><br><p>Sua reserva do equipamento: <strong>' + _this.itemReserva + ' - ' + _this.equipamento.Nome + '</strong> no local <strong>' + _this.equipamento.Local + '</strong> no período: <strong>' + _this.periodoFormatado + '</strong> foi realizada com sucesso e está aguardando aprovação do responsável.</p><p>Você será notificado por E-mail caso sua reserva seja confirmada ou cancelada, em caso de dúvidas entre em contato com o responsável pelo equipamento.</p><small>Este é um E-mail automático, por favor não responda</small>'
              sendEmail(to, subject, textBody, htmlBody)
              _this.$notify({
                group: 'notify',
                type: 'success',
                title: 'Yey!',
                text: 'Reserva solicitada com sucesso.<br>Você será nofiticado por <b>E-mail</b> sobre o decorrer do processo. Verifique também sua caixa de <i>span</i>',
                duration: 10000
              })
              _this.$router.push('/home')
            })
          } else if (this.objetoReserva === 'laboratorio') {
            let reservaLocal = {
              Local: this.itemReserva,
              Inicio: this.periodoReservar.inicio,
              Fim: this.periodoReservar.fim,
              Status: 'Confirmada',
              Solicitante: auth.currentUser.uid
            }
            db.ref('Reservas/locais').push(reservaLocal).then(function () {
              let to = [auth.currentUser.displayName + ' <' + auth.currentUser.email + '>']
              let subject = 'Nova reserva de laboratório'
              let textBody = 'Sua resersa foi realizada e está aguardando aprovação'
              let htmlBody = '<h3>Nova reserva</h3><br><p>Sua reserva do laboratório: <strong>' + _this.itemReserva + '</strong> no período: <strong>' + _this.periodoFormatado + '</strong> foi realizada com sucesso e está aguardando aprovação do responsável.</p><p>Você será notificado por E-mail caso sua reserva seja confirmada ou cancelada, em caso de dúvidas entre em contato com o responsável pelo local.</p><small>Este é um E-mail automático, por favor não responda</small>'
              sendEmail(to, subject, textBody, htmlBody)
              _this.$notify({
                group: 'notify',
                type: 'success',
                title: 'Yey!',
                text: 'Reserva solicitada com sucesso.<br>Você será nofiticado por <b>E-mail</b> sobre o decorrer do processo. Verifique também sua caixa de <i>span</i>',
                duration: 10000
              })
              _this.$router.push('/home')
            })
          }
        }
      } else { // se nao for Supervisor entao verifico normalmente
        this.verificarDados()
        // so executa se o estado atual for igual a 3?
        if (this.$parent.currentStep === 3) {
          let _this = this
          if (this.objetoReserva === 'equipamento') {
            let reservaEquip = {
              Equipamento: this.itemReserva,
              Inicio: this.periodoReservar.inicio,
              Fim: this.periodoReservar.fim,
              Status: 'Pendente',
              Solicitante: auth.currentUser.uid
            }
            db.ref('Reservas/equipamentos').push(reservaEquip).then(function () {
              let to = [auth.currentUser.displayName + ' <' + auth.currentUser.email + '>']
              let subject = 'Nova reserva de equipamento'
              let textBody = 'Sua resersa foi realizada e está aguardando aprovação'
              let htmlBody = '<h3>Nova reserva</h3><br><p>Sua reserva do equipamento: <strong>' + _this.itemReserva + ' - ' + _this.equipamento.Nome + '</strong> no local <strong>' + _this.equipamento.Local + '</strong> no período: <strong>' + _this.periodoFormatado + '</strong> foi realizada com sucesso e está aguardando aprovação do responsável.</p><p>Você será notificado por E-mail caso sua reserva seja confirmada ou cancelada, em caso de dúvidas entre em contato com o responsável pelo equipamento.</p><small>Este é um E-mail automático, por favor não responda</small>'
              sendEmail(to, subject, textBody, htmlBody)
              _this.$notify({
                group: 'notify',
                type: 'success',
                title: 'Yey!',
                text: 'Reserva solicitada com sucesso.<br>Você será nofiticado por <b>E-mail</b> sobre o decorrer do processo. Verifique também sua caixa de <i>span</i>',
                duration: 10000
              })
              _this.$router.push('/home')
            })
          } else if (this.objetoReserva === 'laboratorio') {
            let reservaLocal = {
              Local: this.itemReserva,
              Inicio: this.periodoReservar.inicio,
              Fim: this.periodoReservar.fim,
              Status: 'Pendente',
              Solicitante: auth.currentUser.uid
            }
            db.ref('Reservas/locais').push(reservaLocal).then(function () {
              let to = [auth.currentUser.displayName + ' <' + auth.currentUser.email + '>']
              let subject = 'Nova reserva de laboratório'
              let textBody = 'Sua resersa foi realizada e está aguardando aprovação'
              let htmlBody = '<h3>Nova reserva</h3><br><p>Sua reserva do laboratório: <strong>' + _this.itemReserva + '</strong> no período: <strong>' + _this.periodoFormatado + '</strong> foi realizada com sucesso e está aguardando aprovação do responsável.</p><p>Você será notificado por E-mail caso sua reserva seja confirmada ou cancelada, em caso de dúvidas entre em contato com o responsável pelo local.</p><small>Este é um E-mail automático, por favor não responda</small>'
              sendEmail(to, subject, textBody, htmlBody)
              _this.$notify({
                group: 'notify',
                type: 'success',
                title: 'Yey!',
                text: 'Reserva solicitada com sucesso.<br>Você será nofiticado por <b>E-mail</b> sobre o decorrer do processo. Verifique também sua caixa de <i>span</i>',
                duration: 10000
              })
              _this.$router.push('/home')
            })
          }
        }
      } // fim do else
    },
    voltar () {
      this.verificandoDados = false
      this.$parent.currentStep = 2
    },
    cancelar () {
      this.$modal.show('dialog', {
        title: 'Cuidado!',
        text: 'Realmente deseja cancelar o processo de reserva? <br> <i>Todos os dados não salvos serão perdidos</i>',
        buttons: [
          {
            title: 'Cancelar',
            handler: () => {
              this.$modal.hide('dialog')
              this.$notify({
                group: 'notify',
                type: 'success',
                title: 'Yey!',
                text: 'Processo de reserva cancelado com sucesso'
              })
              this.$router.push('/home')
            }
          },
          {
            title: 'Continuar reserva',
            default: true
          }
        ]
      })
    }
  }
}
</script>
<style>
#cadastroFormReservation {
  width: 100vw;
}

.table-condensed tr td a {
  display:none
}

.was-validated .theme-blue .form-control:invalid .invalid-feedback {
  display: block;
}

.timepicker-picker::before {
  display: flex;
  content: ' ';
  background-image: url('../../assets/img/clock-regular.svg');
  background-size: 28px 28px;
  height: 28px;
  width: 28px;
  position: absolute;
  transform: translateY(281%);
}
</style>
