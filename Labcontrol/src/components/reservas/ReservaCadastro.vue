<template>
  <div id="cadastroReservation">
    <div class="container-fluid">
      <div class="row justify-content-center text-center">
        <h2> Cadastro de reservas </h2>
      </div>
      <hr />
      <div class="row justify-content-center">
        <ring-loader :loading="loader.loading" :color="loader.color" :size="loader.size"></ring-loader>
        <alert :showAlert="alert.showAlert" :dismissible="alert.dismissible" :type="alert.type" :title="alert.title" :msg="alert.msg"></alert>
        <form id="cadastroFormReservation" class="needs-validation" v-on:submit.prevent novalidate>
          <div class="form-row">
            <div class="col-md-6 mb-3">
              <!-- empty -->
            </div>
            <div class="col-md-6 mb-3">
              <label for="data">Data</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="dataPrepend"><i class="fas fa-calendar-alt"></i></span>
                </div>
                <datetime id="data" type="datetime" auto="true" class="form-control" aria-describedby="dataPrepend" v-model="newReservation.Data"></datetime>
                <!-- <input id="data" type="date-time" class="form-control" aria-describedby="dataPrepend" v-model = "newReservation.Data" required> -->
                <div class="invalid-feedback">
                  Por favor informe seu sobrenome.
                </div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="col-md-6 mb-3">
              <label for="equipamento">Equipamento</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="equipamentoPrepend"><i class="fas fa-flask"></i></span>
                </div>
                <input id="equipamento" type="text" class="form-control" placeholder="Nome do equipamento" autocomplete="given-name" aria-describedby="equipamentoPrepend" v-model = "newReservation.Equipamento" required>
                <div class="invalid-feedback">
                  Por favor informe seu nome.
                </div>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <label for="local">Local</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="localPrepend"><i class="fas fa-map-marker"></i></span>
                </div>
                <input id="local" type="text" class="form-control" aria-describedby="localPrepend" v-model = "newReservation.Local" required>
                <div class="invalid-feedback">
                  Por favor informe seu sobrenome.
                </div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="col-md-6 mb-3">
              <label for="retirada">Retirada</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="retiradaPrepend"><i class="fas fa-clock"></i></span>
                </div>
                <input id="retirada" type="text" class="form-control" placeholder=" " aria-describedby="retiradaPrepend" v-model = "newReservation.Retirada" required>
                <div class="invalid-feedback">
                  Por favor informe seu nome.
                </div>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <label for="retorno">Retorno</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="retornoPrepend"><i class="far fa-clock"></i></span>
                </div>
                <input id="retorno" type="text" class="form-control" aria-describedby="retornoPrepend" v-model = "newReservation.retorno" required>
                <div class="invalid-feedback">
                  Por favor informe seu sobrenome.
                </div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="col-sm-6 justify-content-right">
              <button type="submit" class="btn btn-primary btn-block" >Confirmar</button>
            </div>
            <div class="col-sm-6 justify-content-left">
              <button type="reset" class="btn btn-danger btn-block" v-on:click="autocompleteHide()">Cancelar</button>
            </div>
          </div>
        </form>
      </div>     
    </div>
  </div>
</template>

<script>
import {mask} from 'vue-the-mask'
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import Alert from '../utility/Alert.vue'
import firebaseApp from '../../firebase-controller.js'
const db = firebaseApp.database()
const auth = firebaseApp.auth()
export default {
  name: 'reserva',
  data () {
    return {
      locais: [],
      newReservation: {
        RA: '',
        Data: '',
        Equipamento: '',
        Retirada: '',
        Retorno: '',
        Status: ''
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
  firebase: {
    cadastroRef: db.ref('Reservas')
  },
  directives: {
    mask
  },
  components: {
    Alert,
    RingLoader
  },
  mounted: function () {
    let activeUser = auth.currentUser.uid
    db.ref('Usuarios/' + activeUser.toString()).once('value', data => {
      console.log(data.val())
      var raNumber = data.val().RA
      this.newReservation.RA = raNumber.toString()
    })
    // todo: get equipment name
    this.validate()
  },
  methods: {
    submitNewReserv () {
      let form = document.getElementById('cadastroFormReservation')
      form.classList.add('hideOn')
      this.loader.loading = true
      this.alert.showAlert = false
      let _this = this
      var dateField = document.getElementById('data')
      if (dateField.tagName === 'DIV') {
        dateField = dateField.children[0]
      }
      var tmpDate = new Date(dateField.value)
      let sanitizedDate = tmpDate.getUTCFullYear() + '-' + tmpDate.getUTCMonth() + '-' + tmpDate.getUTCDay() + 'T' + tmpDate.getUTCHours() + ':' + tmpDate.getUTCMinutes() + 'Z'
      this.$firebaseRefs.cadastroRef.child(sanitizedDate).update({
        'RA': _this.newReservation.RA,
        'Equipamento': _this.newReservation.Equipamento,
        'Retirada': _this.newReservation.Retirada,
        'Retorno': _this.newReservation.Retorno,
        'Local': _this.newReservation.Local,
        'Status': _this.newReservation.Status = 'Encaminhado'
      }).then(function () {
        _this.alert.type = 'alert-success'
        _this.alert.dismissible = true
        _this.alert.title = 'Yey!'
        _this.alert.msg = 'Sua reserva de' + _this.newReservation.Equipamento + ', para a data de ' + _this.newReservation.Data + ', com retirada às ' + _this.newReservation.Retirada + 'está com o status: ' + _this.newReservation.Status + '.'
        _this.loader.loading = false
        _this.alert.showAlert = true
        location.reload()
        form.classList.remove('hideOn')
        console.log('completo')
      }).catch((err) => {
        _this.alert.type = 'alert-danger'
        _this.alert.dismissible = true
        _this.alert.title = 'Oops!'
        _this.alert.msg = 'O equipamento ' + _this.newReservation.Equipamento + ', não foi cadastrado devido ao Erro: ' + err
        _this.loader.loading = false
        _this.alert.showAlert = true
        form.classList.remove('hideOn')
        console.log('Erro: ' + err)
      })
    },
    validate: function () {
      let _this = this
      var forms = document.getElementsByClassName('needs-validation')
      Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
          if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
          } else {
            _this.submitNewReserv()
          }
          form.classList.add('was-validated')
        }, false)
      })
    }
  }
}
</script>
<style>

#cadastroFormReservation {
  width: 100vw;
}
</style>
