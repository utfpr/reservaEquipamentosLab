<template>
  <div id="Locais">
    <div class="container-fluid">
      <div v-if="loader.loading" class="row justify-content-center">
        <ring-loader :loading="loader.loading" :color="loader.color" :size="loader.size"></ring-loader>
      </div>
      <div v-if="!loader.loading" class="row">
        <div class="col-12 col-lg-10 justify-content-center">
          <div class="input-group">
            <input v-on:keyup="search()" id="search" type="text" class="form-control"  aria-label="Campo de pesquisa" placeholder="Buscar...">
            <div class="input-group-append">
              <button v-on:click="search()" type="button" class="btn btn-outline-secondary">{{filtroAtivo}}</button>
              <button type="button" class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="sr-only">Filtro</span>
              </button>
              <div class="dropdown-menu">
                <span v-for="filtro in filtros" v-on:click="selectFilter(filtro)" class="dropdown-item">{{filtro}}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="role === 'admin' || role === 'Supervisor'" class="col-12 col-md-2 text-center">
          <router-link to="/locais/cadastro" class="justify-content-center mt-2 mt-md-0 btn btn-outline-primary btn-block">Novo</router-link>
        </div>
      </div>
      <div v-if="!loader.loading" class="row mt-4 justify-content-center text-center">
        <h2> Locais </h2>
      </div>
      <div v-if="!loader.loading" class="row">
        <v-dialog/>
        <div class="col-12 justify-content-center">
          <h4 v-if="locais.length === 0" class=" text-center mt-5"> Nenhum local encontrado </h4>
          <table v-else class="table table-responsive-md table-hover text-center">
            <thead>
              <tr>
                <th scope="col"> <span v-on:click="orderBy('Nome')">Nome</span> </th>
                <th scope="col"> <span v-on:click="orderBy('Descricao')">Descrição</span> </th>
                <th scope="col"> <span v-on:click="orderBy('Curso')">Curso</span> </th>
                <th scope="col"> <span v-on:click="orderBy('Supervisor')">Supervisor</span> </th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="local in locais">
                <th scope="row">{{local[0]}}</th>
                <td>{{local[1].Descricao}}</td>
                <td>{{local[1].Curso}}</td>
                <td>{{local[1].Supervisor}}</td>
                <td>
                  <ul class="list-inline d-inline-flex">
                    <li>
                      <router-link :to="{ name: 'LocalDetails', params: {key: local[0], action: 'view'}}" class="mr-2 list-inline-item btn btn-primary btn-sm">Vizualizar</router-link>
                    </li>
                    <li>
                      <router-link :to="{ name: 'reservaLocal', params: {local: local[0]}}" class="mr-2 list-inline-item btn btn-primary btn-sm">Reservar</router-link>
                    </li>
                    <li v-if="role === 'admin' || role === 'Supervisor'">
                      <router-link :to="{ name: 'LocalDetails', params: {key: local[0], action: 'edit'}}" class="mr-2 list-inline-item btn btn-primary btn-sm">Editar</router-link>
                    </li>
                    <li v-if="role === 'admin' || role === 'Supervisor'">
                      <span v-on:click="confirmarDelete(local[0])" class="list-inline-item btn btn-danger btn-sm">Remover</span>
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import firebaseApp from '../../firebase-controller.js'
const db = firebaseApp.database()
const auth = firebaseApp.auth()
export default {
  name: 'locais',
  data () {
    return {
      role: null,
      filtros: ['Nome', 'Descrição', 'Curso', 'Supervisor'],
      filtroAtivo: '',
      locais: [],
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
    this.filtroAtivo = this.filtros[0]
  },
  mounted: function () {
    let _this = this
    db.ref('Locais').orderByKey().on('value', function (snapshot) {
      _this.loader.loading = true
      _this.locais = []
      snapshot.forEach(function (childSnapshot) {
        _this.locais.push([childSnapshot.key, childSnapshot.val()])
      })
      _this.loader.loading = false
    })
    db.ref('Usuarios/' + auth.currentUser.uid + '/role').on('value', function (snapshot) {
      _this.role = snapshot.val()
    })
  },
  methods: {
    confirmarDelete (nome) {
      this.$modal.show('dialog', {
        title: 'Cuidado!',
        text: 'Realmente deseja deletar o Local <b>' + nome + '</b>? <br> <i>Essa ação não poderá ser desfeita</i>',
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
                  text: 'Local <b>' + nome + '</b> deletado com sucesso'
                })
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
    selectFilter (filtro) {
      this.filtroAtivo = filtro
      this.search()
    },
    search () {
      let pesquisa = document.getElementById('search').value
      let _this = this
      if (pesquisa) {
        if (this.filtroAtivo === 'Nome') {
          db.ref('Locais').orderByKey().startAt(pesquisa.toUpperCase()).endAt(pesquisa.toUpperCase() + '\uffff').on('value', function (snapshot) {
            _this.loader.loading = true
            _this.locais = []
            snapshot.forEach(function (childSnapshot) {
              _this.locais.push([childSnapshot.key, childSnapshot.val()])
            })
            _this.loader.loading = false
          })
        } else {
          let campo = this.filtroAtivo
          if (this.filtroAtivo === 'Descrição') {
            campo = 'Descricao'
          }
          db.ref('Locais').orderByChild(campo).startAt(pesquisa).endAt(pesquisa + '\uffff').on('value', function (snapshot) {
            _this.loader.loading = true
            _this.locais = []
            snapshot.forEach(function (childSnapshot) {
              _this.locais.push([childSnapshot.key, childSnapshot.val()])
            })
            _this.loader.loading = false
          })
        }
      } else {
        db.ref('Locais').orderByKey().on('value', function (snapshot) {
          _this.loader.loading = true
          _this.locais = []
          snapshot.forEach(function (childSnapshot) {
            _this.locais.push([childSnapshot.key, childSnapshot.val()])
          })
          _this.loader.loading = false
        })
      }
    },
    orderBy (campo) {
      if (campo === 'Nome') {
        this.locais.sort(function (a, b) {
          if (a[0] > b[0]) {
            return 1
          }
          if (a[0] < b[0]) {
            return -1
          }
          return 0
        })
      } else if (campo === 'Descricao') {
        this.locais.sort(function (a, b) {
          if (a[1].Descricao > b[1].Descricao) {
            return 1
          }
          if (a[1].Descricao < b[1].Descricao) {
            return -1
          }
          return 0
        })
      } else if (campo === 'Curso') {
        this.locais.sort(function (a, b) {
          if (a[1].Curso > b[1].Curso) {
            return 1
          }
          if (a[1].Curso < b[1].Curso) {
            return -1
          }
          return 0
        })
      } else if (campo === 'Supervisor') {
        this.locais.sort(function (a, b) {
          if (a[1].Supervisor > b[1].Supervisor) {
            return 1
          }
          if (a[1].Supervisor < b[1].Supervisor) {
            return -1
          }
          return 0
        })
      }
      console.log('Ordenado por ' + campo)
    }
  }
}
</script>

<style lang="css">
</style>
