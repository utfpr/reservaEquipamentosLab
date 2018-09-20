<template>
  <div id="EquipamentoDetails">
    <div class="container-fluid">
      <div v-if="loader.loading" class="row justify-content-center">
        <ring-loader :loading="loader.loading" :color="loader.color" :size="loader.size"></ring-loader>
      </div>
      <div v-else-if="action === 'view'" class="container">
        <div class="row">
          <div class="col-sm-12 col-md-6">
            <h5><strong>Nome</strong>: {{key}}</h5>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-sm-12 col-md-4">
            <p><strong>Curso</strong><br />{{local.Curso}}</p>
          </div>
          <div class="col-sm-12 col-md-4">
            <p><strong>Supervisor</strong><br />{{local.Supervisor}}</p>
          </div>
          <div class="col-sm-12 col-md-4">
            <p><strong>Descrição</strong><br />{{local.Descricao}}</p>
          </div>
        </div>


        <!-- Listagem de Equipamentos no Local -->
        <div class="row">
          <div class="col-sm-12 col-md-6">
            <p><strong>Equipamentos</strong></p>
            <table class="table table-responsive-md table-hover text-center">
              <thead>
                <tr>
                  <th scope="col"> <span v-on:click="orderBy('key')">Patrimônio</span> </th>
                  <th scope="col"> <span v-on:click="orderBy('Nome')">Nome</span> </th>
                  <th scope="col"> <span v-on:click="orderBy('Status')">Status</span> </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="equipamento in equipamentos">
                  <th scope="row">{{equipamento[0]}}</th>
                  <td>{{equipamento[1].Nome}}</td>
                  <td>{{equipamento[1].Status}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <hr/>



        <div class="row">
          <div class="col-12 text-right">
            <ul class="list-inline d-inline-flex">
              <li>
                <router-link :to="{ name: 'Locais', params: {}}" class="mr-2 list-inline-item btn btn-primary btn-sm">Voltar</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'periodoReserva', params: {objetoReserva: 'laboratorio', itemReserva: key}}" class="mr-2 list-inline-item btn btn-primary btn-sm">Reservar</router-link>
              </li>
              <li>
                <span v-if="role === 'admin' || role === 'Supervisor'" v-on:click="confirmarDelete(key)" class="list-inline-item btn btn-danger btn-sm">Deletar</span>
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
                  <input v-on:change="checkUnique()" id="sala" type="text" class="form-control" placeholder="Digite o bloco e a sala" autocomplete="given-name" aria-describedby="salaPrepend" maxlength="4" v-model = "local.Nome" required>
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
                  <option v-for="curso in cursos" :value="curso">{{curso}}</option>
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
              <router-link :to="{ name: 'Locais', params: {}}" class="btn btn-danger btn-block">Voltar</router-link>
            </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Alert from '../utility/Alert.vue'
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import firebaseApp from '../../firebase-controller.js'
const db = firebaseApp.database()
const auth = firebaseApp.auth()
export default {
  name: 'EquipamentoDetails',
  data () {
    return {
      key: this.$route.params.key,
      action: this.$route.params.action,
      role: null,
      localDetails: null,
      supervisores: [],
      cursos: [],
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
      equipamentos: [],
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
    db.ref('Locais/' + this.$route.params.key).once('value', function (snapshot) {
      _this.localDetails = snapshot.val()
      _this.local.Nome = _this.$route.params.key
      _this.local.Descricao = _this.localDetails.Descricao
      _this.local.Supervisor = _this.localDetails.Supervisor
      _this.local.Curso = _this.localDetails.Curso
      _this.local.equipamentos = []
      _this.loader.loading = false
    })
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
    db.ref('Usuarios/' + auth.currentUser.uid + '/role').on('value', function (snapshot) {
      _this.role = snapshot.val()
    })
    db.ref('Controle/Cursos').orderByKey().on('value', function (snapshot) {
      _this.cursos = []
      snapshot.forEach(function (childSnapshot) {
        _this.cursos.push(childSnapshot.key)
      })
      // console.log(_this.cursos)
    })
    db.ref('Equipamentos').orderByChild('Local').equalTo(_this.local.Nome).on('value', (snapshot) => {
      _this.equipamentos = []
      snapshot.forEach(function (childSnapshot) {
        _this.equipamentos.push([childSnapshot.key, childSnapshot.val()])
      })
      // console.log(_this.equipamentos)
      console.log(_this.equipamentos)
    })
  },
  methods: {
    submitLocal () {
      let form = document.getElementById('cadastroFormLocal')
      form.classList.add('hideOn')
      this.loader.loading = true
      this.alert.showAlert = false
      let _this = this
      db.ref('Locais').child(this.local.Nome).update({
        'Curso': _this.local.Curso,
        'Descricao': _this.local.Descricao,
        'Supervisor': _this.local.Supervisor
      }).then(function () {
        if (_this.$route.params.key !== _this.local.Nome) {
          db.ref('Locais').child(_this.$route.params.key).remove()
        }
        _this.$notify({
          group: 'notify',
          type: 'success',
          title: 'Yey!',
          text: 'Local ' + _this.local.Nome + ' foi atualizado com sucesso!',
          duration: 10000
        })
        _this.$router.replace('/locais/' + _this.local.Nome + '/view')
        setTimeout(function () {
          location.reload()
        }, 2000)
      }).catch((err) => {
        _this.alert.type = 'alert-danger'
        _this.alert.dismissible = true
        _this.alert.title = 'Oops!'
        _this.alert.msg = 'O local ' + _this.local.Nome + ' não foi atualizado devido ao Erro: ' + err
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
    },
    confirmarDelete (nome) {
      this.$modal.show('dialog', {
        title: 'Cuidado!',
        text: 'Realmente deseja deletar o Local ' + nome + '? <br> Essa ação não pode ser desfeita',
        buttons: [
          {
            title: 'Deletar',
            handler: () => {
              let _this = this
              db.ref('Locais').child(nome).remove().then(function () {
                _this.$notify({
                  group: 'notify',
                  type: 'success',
                  title: 'Yey!',
                  text: 'Local ' + nome + 'deletado com sucesso'
                })
                _this.$router.replace('/locais')
              }).catch((err) => {
                _this.$notify({
                  group: 'notify',
                  type: 'error',
                  title: 'Yey!',
                  text: 'Falha ao deletar Local ' + nome
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
    },
    orderBy (campo) {
      if (campo === 'key') {
        this.equipamentos.sort(function (a, b) {
          if (a[0] > b[0]) {
            return 1
          }
          if (a[0] < b[0]) {
            return -1
          }
          return 0
        })
      } else if (campo === 'Nome') {
        this.equipamentos.sort(function (a, b) {
          if (a[1].Nome > b[1].Nome) {
            return 1
          }
          if (a[1].Nome < b[1].Nome) {
            return -1
          }
          return 0
        })
      } else if (campo === 'Status') {
        this.equipamentos.sort(function (a, b) {
          if (a[1].Status > b[1].Status) {
            return 1
          }
          if (a[1].Status < b[1].Status) {
            return -1
          }
          return 0
        })
      }
      console.log('Ordenado por ' + campo)
    },
    checkUnique: function () {
      let _this = this
      db.ref('Locais/' + this.local.Nome).once('value', function (snapshot) {
        let local = document.getElementById('sala')
        if (!snapshot.val()) {
          local.setCustomValidity('')
        } else {
          local.setCustomValidity('Local já está cadastrado')
          _this.alert.type = 'alert-danger'
          _this.alert.dismissible = true
          _this.alert.title = 'Oops!'
          _this.alert.msg = 'O nome ' + _this.local.Nome + ' já se encontra cadastrado, caso queira alterar este local o procure na lista de Locais e clique em Editar'
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
