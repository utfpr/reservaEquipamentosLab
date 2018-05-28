<template>
  <div id="EquipamentoDetails">
    <div class="container-fluid">
      <div v-if="loader.loading" class="row justify-content-center">
        <ring-loader :loading="loader.loading" :color="loader.color" :size="loader.size"></ring-loader>
      </div>
      <div v-else-if="action === 'view'" class="container">
        <div class="row">
          <div class="col-sm-12 col-md-6">
            <h5><strong>Nome</strong>: {{local.Nome}}</h5>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-sm-12 col-md-6">
            <p><strong>Curso</strong><br />{{local.Curso}}</p>
          </div>
          <div class="col-sm-12 col-md-6">
            <p><strong>Supervisor</strong><br />{{local.Supervisor}}</p>
          </div>
          <div class="col-12">
            <p><strong>Descrição</strong><br />{{local.Descricao}}</p>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-12 text-right">
            <ul class="list-inline d-inline-flex">
              <li>
                <router-link :to="{ name: 'Locais', params: {}}" class="mr-2 list-inline-item btn btn-primary btn-sm">Voltar</router-link>
              </li>
              <li>
                <a href="#"  class=" mr-2 list-inline-item btn btn-primary btn-sm"> TESTE</a>
              </li>
              <li>
                <a href="#"  class="list-inline-item btn btn-primary btn-sm"> TESTE</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-else class="container">
        <div class="row justify-content-center">
          <alert :showAlert="alert.showAlert" :dismissible="alert.dismissible" :type="alert.type" :title="alert.title" :msg="alert.msg"></alert>
          <form id="cadastroFormLocal" class="needs-validation" novalidate>
            <div class="form-row">
              <div class="col-lg-6 mb-3">
                <label for="sala">Sala</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="salaPrepend"><i class="fas fa-map-marker"></i></span>
                  </div>
                  <input id="sala" type="text" class="form-control" placeholder="Digite o bloco e a sala" autocomplete="given-name" aria-describedby="salaPrepend" maxlength="4" v-model = "local.Nome" required>
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
                  <select id="supervisor" class="form-control" aria-describedby="supervisorPrepend" v-model = "local.Supervisor" required>
                    <option value="" disabled selected>Selecione o nome do supervisor</option>''
                    <option>Prof 1</option>
                    <option>Prof 2</option>
                    <option>Prof 3</option>
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
                  <input id="desc" type="text" class="form-control" placeholder="Digite uma descrição sobre o laboratorio" autocomplete="given-name" aria-describedby="descPrepend" v-model = "local.Descricao">
                </div>
              </div>
            <div class="col-lg-6 mb-3">
              <label for="cursolocal">Curso</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="cursoPrepend"><i class="fas fa-graduation-cap"></i></span>
                </div>
                <select id="cursolocal" class="form-control" aria-describedby="cursolocalPrepend" v-model = "local.Curso" required>
                  <option value="" disabled selected>Selecione o curso de utilização</option>''
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
              <router-link :to="{ name: 'Locais', params: {}}" class="btn btn-danger btn-block">Cancelar</router-link>
            </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Alert from './Alert.vue'
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import firebaseApp from '../firebase-controller.js'
const db = firebaseApp.database()
export default {
  name: 'EquipamentoDetails',
  data () {
    return {
      action: this.$route.params.action,
      localDetails: null,
      loader: {
        loading: true,
        color: '#007bff',
        size: '100px'
      },
      local: {
        Nome: '',
        Descricao: '',
        Supervisor: '',
        Curso: ''
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
    Alert,
    RingLoader
  },
  beforeMount: function () {
    this.loader.loading = true
    let _this = this
    db.ref('Locais/' + this.$route.params.key).on('value', function (snapshot) {
      _this.localDetails = snapshot.val()
      _this.local.Nome = _this.localDetails.Nome
      _this.local.Descricao = _this.localDetails.Descricao
      _this.local.Supervisor = _this.localDetails.Supervisor
      _this.local.Curso = _this.localDetails.Curso
      _this.loader.loading = false
    })
  },
  mounted: function () {
    this.validate()
  },
  methods: {
    submitLocal () {
      let form = document.getElementById('cadastroFormLocal')
      form.classList.add('hideOn')
      this.loader.loading = true
      this.alert.showAlert = false
      let _this = this
      db.ref('Locais/' + this.$route.params.key).update({
        'Nome': _this.local.Nome,
        'Curso': _this.local.Curso,
        'Descricao': _this.local.Descricao,
        'Supervisor': _this.local.Supervisor
      }).then(function () {
        _this.alert.type = 'alert-success'
        _this.alert.dismissible = true
        _this.alert.title = 'Yey!'
        _this.alert.msg = 'O local ' + _this.local.Nome + ' foi atualizado com sucesso!'
        _this.loader.loading = false
        _this.alert.showAlert = true
        location.reload()
        form.classList.remove('hideOn')
        console.log('completo')
      }).catch((err) => {
        _this.alert.type = 'alert-danger'
        _this.alert.dismissible = true
        _this.alert.title = 'Oops!'
        _this.alert.msg = 'O equipamento ' + _this.local.Nome + ' não foi atualizado devido ao Erro: ' + err
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
            _this.submitLocal()
          }
          form.classList.add('was-validated')
        }, false)
      })
    }
  }
}
</script>

<style>
#cadastroFormEquipment {
  width: 100vw;
}
</style>
