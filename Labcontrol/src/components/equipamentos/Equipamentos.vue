<template>
  <div id="Equipamentos">
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
          <div class="col-2 text-center">
            <router-link to="/equipamentos/cadastro" class="justify-content-center btn d-none d-lg-flex btn-outline-primary btn-block">Novo</router-link>
          </div>
        </div>
        <div v-if="!loader.loading" class="row mt-4 justify-content-center text-center">
          <h2> Equipamentos </h2>
        </div>
      <div v-if="!loader.loading" class="row">
        <v-dialog/>
        <div class="col-12">
          <h4 v-if="equipamentos.length === 0" class=" text-center mt-5"> Nenhum Equipamento encontrado </h4>
          <table v-else class="table table-responsive-md table-hover text-center">
            <thead>
              <tr>
                <th scope="col"> <span v-on:click="orderBy('Patrimonio')">Patrimônio</span> </th>
                <th scope="col"> <span v-on:click="orderBy('Nome')">Nome</span> </th>
                <th scope="col"> <span v-on:click="orderBy('Local')">Local</span> </th>
                <th scope="col"> <span v-on:click="orderBy('Estado')">Estado</span> </th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="equipamento in equipamentos">
                <th scope="row">{{equipamento[0]}}</th>
                <td>{{equipamento[1].Nome}}</td>
                <td>{{equipamento[1].Local}}</td>
                <td>{{equipamento[1].Status}}</td>
                <td>
                  <ul class="list-inline d-inline-flex">
                    <li>
                      <router-link :to="{ name: 'EquipamentoDetails', params: {key: equipamento[0], action: 'view'}}" class="mr-2 list-inline-item btn btn-primary btn-sm">Vizualizar</router-link>
                    </li>
                    <li>
                      <router-link :to="{ name: 'EquipamentoDetails', params: {key: equipamento[0], action: 'edit'}}" class="mr-2 list-inline-item btn btn-primary btn-sm">Editar</router-link>
                    </li>
                    <li>
                      <span v-on:click="confirmarDelete(equipamento[0])" class="list-inline-item btn btn-danger btn-sm">Deletar</span>
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
export default {
  name: 'equipamentos',
  data () {
    return {
      filtros: ['Patrimônio', 'Nome', 'Local', 'Estado'],
      filtroAtivo: '',
      equipamentos: [],
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
    db.ref('Equipamentos').orderByKey().on('value', function (snapshot) {
      _this.loader.loading = true
      _this.equipamentos = []
      snapshot.forEach(function (childSnapshot) {
        _this.equipamentos.push([childSnapshot.key, childSnapshot.val()])
      })
      _this.loader.loading = false
    })
  },
  methods: {
    confirmarDelete (patrimonio) {
      this.$modal.show('dialog', {
        title: 'Cuidado!',
        text: 'Realmente deseja deletar o Equipamento ' + patrimonio + '? <br> Essa ação não pode ser desfeita',
        buttons: [
          {
            title: 'Deletar',
            handler: () => {
              let _this = this
              db.ref('Equipamentos').child(patrimonio).remove().then(function () {
                _this.$notify({
                  group: 'notify',
                  type: 'success',
                  title: 'Yey!',
                  text: 'Equipamento  <strong>' + patrimonio + '</strong> deletado com sucesso'
                })
              }).catch((err) => {
                _this.$notify({
                  group: 'notify',
                  type: 'error',
                  title: 'Yey!',
                  text: 'Falha ao deletar Equipamento ' + patrimonio
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
    },
    search () {
      let pesquisa = document.getElementById('search').value
      let _this = this
      if (pesquisa) {
        if (this.filtroAtivo === 'Patrimônio') {
          db.ref('Equipamentos').orderByKey().startAt(pesquisa).endAt(pesquisa + '\uffff').on('value', function (snapshot) {
            _this.loader.loading = true
            _this.equipamentos = []
            snapshot.forEach(function (childSnapshot) {
              _this.equipamentos.push([childSnapshot.key, childSnapshot.val()])
            })
            _this.loader.loading = false
          })
        } else {
          if (this.filtroAtivo === 'Local') {
            pesquisa = pesquisa.toUpperCase()
          }
          db.ref('Equipamentos').orderByChild(this.filtroAtivo).startAt(pesquisa).endAt(pesquisa + '\uffff').on('value', function (snapshot) {
            _this.loader.loading = true
            _this.equipamentos = []
            snapshot.forEach(function (childSnapshot) {
              _this.equipamentos.push([childSnapshot.key, childSnapshot.val()])
            })
            _this.loader.loading = false
          })
        }
      } else {
        db.ref('Equipamentos').orderByKey().on('value', function (snapshot) {
          _this.loader.loading = true
          _this.equipamentos = []
          snapshot.forEach(function (childSnapshot) {
            _this.equipamentos.push([childSnapshot.key, childSnapshot.val()])
          })
          _this.loader.loading = false
        })
      }
    },
    orderBy (campo) {
      if (campo === 'Patrimonio') {
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
      } else if (campo === 'Local') {
        this.equipamentos.sort(function (a, b) {
          if (a[1].Local > b[1].Local) {
            return 1
          }
          if (a[1].Local < b[1].Local) {
            return -1
          }
          return 0
        })
      } else if (campo === 'Estado') {
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
    }
  }
}
</script>

<style lang="css">
</style>
