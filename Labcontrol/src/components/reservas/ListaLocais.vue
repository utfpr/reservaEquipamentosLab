<template>
  <div class="container-fluid">
    <div v-if="loader.loading" class="row justify-content-center">
      <ring-loader :loading="loader.loading" :color="loader.color" :size="loader.size"></ring-loader>
    </div>
    <div v-if="!loader.loading" class="row">
      <div class="col-12 justify-content-center">
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
    </div>
    <div v-if="!loader.loading" class="row mt-4 justify-content-center text-center">
      <h2> Escolha um Laboratório </h2>
    </div>
    <div v-if="!loader.loading" class="row">
      <div class="col-12 justify-content-center">
        <div class="table-wrapper">
          <h4 v-if="locais.length === 0" class=" text-center mt-5"> Nenhum local encontrado </h4>
          <table v-else class="table table-responsive-md table-hover text-center">
            <thead>
              <tr>
                <th scope="col"> <span v-on:click="orderBy('Nome')">Nome</span> </th>
                <th scope="col"> <span v-on:click="orderBy('Descricao')">Descrição</span> </th>
                <th scope="col"> <span v-on:click="orderBy('Curso')">Curso</span> </th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="local in locais"  v-on:click="selectItem(local[0])">
                <th scope="row">
                  <div class="custom-control custom-radio">
                    <input type="radio" :id="local[0]" name="itemReserva" class="custom-control-input" :value="local[0]" v-model="localReserva">
                    <label class="custom-control-label" :for="local[0]">{{local[0]}}</label>
                  </div>
                </th>
                <td>{{local[1].Descricao}}</td>
                <td>{{local[1].Curso}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="d-flex d-md-none row justify-content-between">
      <div class="col-12 col-md-6 text-right">
        <router-link v-if="localReserva" :to="{ name: 'reservaLocal', params: {local: localReserva}}" class="btn btn-primary btn-block">Continuar reserva</router-link>
        <span v-else class="btn btn-primary btn-block disabled">Continuar reserva</span>
      </div>
      <div class="col-12 col-md-6 text-left">
        <button type="submit" v-on:click="$parent.voltar" class="btn btn-danger btn-block" >Voltar</button>
      </div>
    </div>
    <div class="d-none d-md-flex row justify-content-between">
      <div class="col-12 col-md-6 text-left">
        <button type="submit" v-on:click="$parent.voltar" class="btn btn-danger" >Voltar</button>
      </div>
      <div class="col-12 col-md-6 text-right">
        <router-link v-if="localReserva" :to="{ name: 'reservaLocal', params: {local: localReserva}}" class="btn btn-primary">Continuar reserva</router-link>
        <span v-else class="btn btn-primary disabled">Continuar reserva</span>
      </div>
    </div>
  </div>
</template>

<script>
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import firebaseApp from '../../firebase-controller.js'
const db = firebaseApp.database()
export default {
  name: 'locais',
  data () {
    return {
      filtros: ['Nome', 'Descrição'],
      filtroAtivo: '',
      localReserva: null,
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
    this.$parent.currentStep = 1
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
  },
  methods: {
    selectItem (local) {
      let itemReserva = document.getElementById(local)
      itemReserva.checked = true
      this.localReserva = itemReserva.value
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
          if (campo === 'Descrição') {
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
      }
    }
  }
}
</script>

<style lang="css">
</style>
