<template>
<div id="cadastroLocal">
  <div class="container-fluid">
    <div class="row justify-content-center text-center">
      <h2> Cadastro de laboratorio </h2>
    </div>
    <hr />
    <div class="row justify-content-center">
      <ring-loader :loading="loader.loading" :color="loader.color" :size="loader.size"></ring-loader>
      <alert :showAlert="alert.showAlert" :dismissible="alert.dismissible" :type="alert.type" :title="alert.title" :msg="alert.msg"></alert>
      <form id="cadastroFormLocal" class="needs-validation" novalidate>
        <div class="form-row">
          <div class="col-lg-6 mb-3">
            <label for="sala">Sala</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="salaPrepend"><i class="fas fa-map-marker"></i></span>
              </div>
              <input v-on:change="checkUnique()" id="sala" type="text" class="form-control" placeholder="Digite o bloco e a sala" autocomplete="given-name" aria-describedby="salaPrepend" maxlength="4" v-model = "newLocal.Nome" required>
              <div class="invalid-feedback">
                Por favor informe o bloco e a sala (ex: C103)
              </div>
            </div>
          </div>
          <div class="col-lg-6 mb-3">
            <label for="supervisor">Supervisor</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="supervisorPrepend"><i class="fas fa-clipboard"></i></span>
              </div>
              <select id="supervisor" class="form-control" aria-describedby="supervisorPrepend" v-model = "newLocal.Supervisor" required>
                <option value="" disabled selected>Selecione um supervisor</option>
                <option v-for="supervisor in supervisores" value="supervisor">{{supervisor}}</option>
              </select>
              <div class="invalid-feedback">
                Por favor selecione um supervisor.
              </div>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="col-lg-6 mb-3">
            <label for="desc">Descrição</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="descPrepend"><i class="fas fa-book"></i></span>
              </div>
              <input id="desc" type="text" class="form-control" placeholder="Digite uma descrição sobre o laboratorio" autocomplete="given-name" aria-describedby="descPrepend" v-model = "newLocal.Descricao">
            </div>
          </div>
        <div class="col-lg-6 mb-3">
          <label for="cursolocal">Curso</label>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text" id="cursoPrepend"><i class="fas fa-graduation-cap"></i></span>
            </div>
            <select id="cursolocal" class="form-control" aria-describedby="cursolocalPrepend" v-model = "newLocal.Curso" required>
              <option value="" disabled selected>Selecione o curso de utilização</option>
              <option>Todos</option>
              <option>Engenharia Ambiental</option>
              <option>Engenharia de Alimentos</option>
              <option>Quimica</option>
            </select>
            <div class="invalid-feedback">
              Por favor selecione um curso.
            </div>
          </div>
        </div>
      </div>
        <div class="form-row">
        <div class="col-sm-6 justify-content-right">
          <button type="submit" class="btn btn-primary btn-block" >Confirmar</button>
        </div>
        <div class="col-sm-6 justify-content-left">
          <button type="reset" class="btn btn-danger btn-block" v-on:click="validate">Cancelar</button>
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
  export default {
    name: 'localCadastro',
    data () {
      return {
        supervisores: [],
        newLocal: {
          Nome: '',
          Descricao: '',
          Supervisor: '',
          Curso: ''
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
      cadastroRef: db.ref('Locais')
    },
    directives: {
      mask
    },
    components: {
      Alert,
      RingLoader
    },
    mounted: function () {
      this.validate()
      let _this = this
      db.ref('Usuarios').orderByChild('role').equalTo('Supervisor').on('value', (snapshot) => {
        _this.supervisores = []
        snapshot.forEach(function (supervisor) {
          _this.supervisores.push(supervisor.val().Nome)
        })
      })
    },
    methods: {
      submitNewPlace () {
        let form = document.getElementById('cadastroFormLocal')
        form.classList.add('hideOn')
        this.loader.loading = true
        this.alert.showAlert = false
        let _this = this
        this.$firebaseRefs.cadastroRef.child(this.newLocal.Nome).update({
          'Curso': _this.newLocal.Curso,
          'Descricao': _this.newLocal.Descricao,
          'Supervisor': _this.newLocal.Supervisor
        }).then(function () {
          _this.alert.type = 'alert-success'
          _this.alert.dismissible = true
          _this.alert.title = 'Yey!'
          _this.alert.msg = 'O local ' + _this.newLocal.Nome + 'foi cadastrado com sucesso!'
          _this.loader.loading = false
          _this.alert.showAlert = true
          location.reload()
          form.classList.remove('hideOn')
          console.log('completo')
        }).catch((err) => {
          _this.alert.type = 'alert-danger'
          _this.alert.dismissible = true
          _this.alert.title = 'Oops!'
          _this.alert.msg = 'O local ' + _this.newLocal.Nome + ' não foi cadastrado devido ao Erro: ' + err
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
              _this.submitNewPlace()
            }
            form.classList.add('was-validated')
          }, false)
        })
      },
      checkUnique: function () {
        let _this = this
        db.ref('Locais/' + this.newLocal.Nome).once('value', function (snapshot) {
          let local = document.getElementById('sala')
          if (!snapshot.val()) {
            local.setCustomValidity('')
          } else {
            local.setCustomValidity('Local já está cadastrado')
            _this.alert.type = 'alert-danger'
            _this.alert.dismissible = true
            _this.alert.title = 'Oops!'
            _this.alert.msg = 'O nome ' + _this.newLocal.Nome + ' já se encontra cadastrado, caso queira alterar este local o procure na lista de Locais e clique em Editar'
            _this.alert.showAlert = true
          }
        })
      }
    }
  }
  </script>

  <style>

  #cadastroFormLocal {
    width: 100vw;
  }
  </style>
