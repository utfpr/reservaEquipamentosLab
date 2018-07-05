<template>
  <div id="cadastroReservation">
    <div class="container-fluid">
      <div class="row justify-content-center text-center">
        <h2> Informe o período de sua reserva </h2>
      </div>
      <hr />
      <div class="row justify-content-center">
        <ring-loader :loading="loader.loading" :color="loader.color" :size="loader.size"></ring-loader>
        <alert :showAlert="alert.showAlert" :dismissible="alert.dismissible" :type="alert.type" :title="alert.title" :msg="alert.msg"></alert>
        <form id="cadastroFormReservation" class="needs-validation" v-on:submit.prevent novalidate>
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
                <datetime id="retirada" type="datetime" auto="true" class="form-control" aria-describedby="retiradaPrepend" v-model="newReservation.Retirada"></datetime>
                <!-- <input id="retirada" type="text" class="form-control" placeholder=" " aria-describedby="retiradaPrepend" v-model = "newReservation.Retirada" required> -->
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
                <datetime id="retorno" type="datetime" auto="true" class="form-control" aria-describedby="retornoPrepend" v-model="newReservation.Retorno"></datetime>
                <!-- <input id="retorno" type="text" class="form-control" aria-describedby="retornoPrepend" v-model = "newReservation.retorno" required> -->
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
  created: function () {
    this.$parent.currentStep = 2
    this.$firebaseRefs.cadastroRef.orderByChild('Retirada').once('value', data => {
      let requestList = []
      console.log(data.val())
      data.forEach(element => {
        var val = element.val()
        if (new Date(val.Retirada) > new Date()) {
          requestList.push(val)
          // add requests from today and up
        }
        console.log(requestList)
      })
    })
    let activeUser = this.newReservation.Solicitante = auth.currentUser.uid
    db.ref('Usuarios/' + activeUser.toString()).once('value', data => {
      var raNumber = data.val().RA
      this.newReservation.RA = raNumber.toString()
    })
  },
  mounted: function () {
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
      // fix dates
      var retiradaField = document.getElementById('retirada')
      if (retiradaField.tagName === 'DIV') {
        retiradaField = retiradaField.children[0]
      }
      _this.newReservation.Retirada = new Date(retiradaField.value).toISOString()
      var retornoField = document.getElementById('retorno')
      if (retornoField.tagName === 'DIV') {
        retornoField = retornoField.children[0]
      }
      _this.newReservation.Retorno = new Date(retornoField.value).toISOString()
      this.$firebaseRefs.cadastroRef.push(_this.newReservation).then(function () {
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
    },
    validateDisponibility: function () {
      this.requestList.forEach(item => {
        if (this.newReservation.Equipamento === item.Equipamento && this.newReservation.Retirada > item.Retirada && this.newReservation.Retirada < item.Retorno) {
          var retiradaField = document.getElementById('retirada')
          if (retiradaField.tagName === 'DIV') {
            retiradaField = retiradaField.children[0]
          }
          retiradaField.classList.add('needs-validation')
        }
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
