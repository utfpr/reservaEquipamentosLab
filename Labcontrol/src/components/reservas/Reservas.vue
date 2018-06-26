<template>
  <div id="Reservas">
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
            <router-link to="/reservas/cadastro" class="justify-content-center btn d-none d-lg-flex btn-outline-primary btn-block">Novo</router-link>
          </div>
        </div>
      <div v-if="!loader.loading" class="row mt-4 justify-content-center text-center">
        <h2> Reservas </h2>
      </div>
      <div v-if="!loader.loading" class="row">
        <div class="col-12">
          <h4 v-if="reservas.length === 0" class=" text-center mt-5"> Nenhuma reserva encontrada </h4>
          <table v-else class="table table-responsive-md table-hover text-center">
            <thead>
              <tr>
                <th scope="col"><span v-on:click="orderBy('Data')">Data</span></th>
                <th scope="col"><span v-on:click="orderBy('Periodo')">Periodo</span></th>
                <th scope="col"><span v-on:click="orderBy('Equipamento')">Equipamento - Local</span></th>
                <th scope="col"><span v-on:click="orderBy('RA')">Aluno</span></th>
                <th scope="col"><span v-on:click="orderBy('Estado')">Status</span></th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="reserva in reservas">
                <th scope="row">{{reserva[1].Data}}</th>
                <td>{{reserva[1].PeriodoInicio}} - {{reserva[1].PeriodoFim}}</td>
                <td>{{reserva[1].Equipamento}} - {{reserva[1].Local}}</td>
                <td>{{reserva[1].RA}} - {{reserva[1].Aluno}}</td>
                <td>{{reserva[1].Status}}</td>
                <td>
                  <ul class="list-inline d-inline-flex">
                    <li>
                      <router-link :to="{ name: 'EquipamentoDetails', params: {key: reserva[0], action: 'view'}}" class="mr-2 list-inline-item btn btn-primary btn-sm">Vizualizar</router-link>
                    </li>
                    <li>
                      <router-link :to="{ name: 'EquipamentoDetails', params: {key: reserva[0], action: 'edit'}}" class="mr-2 list-inline-item btn btn-primary btn-sm">Editar</router-link>
                    </li>
                    <li>
                      <a href="#"  class="mr-2 list-inline-item btn btn-primary btn-sm">Confirmar</a>
                    </li>
                    <li>
                      <a href="#"  class="list-inline-item btn btn-danger btn-sm">Cancelar</a>
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
  name: 'reservas',
  data () {
    return {
      filtros: ['Data', 'Periodo', 'RA', 'Equipamento', 'Estado'],
      filtroAtivo: '',
      reservas: [],
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
    db.ref('Reservas').on('value', function (snapshot) {
      _this.loader.loading = true
      _this.reservas = []
      snapshot.forEach(function (childSnapshot) {
        _this.reservas.push([childSnapshot.key, childSnapshot.val()])
      })
      _this.loader.loading = false
    })
  },
  methods: {
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
      console.log('chamado')
      if (campo === 'Data') {
        this.reservas.sort(function (a, b) {
          if (a[1].Data > b[0].Data) {
            return 1
          }
          if (a[0].Data < b[0].Data) {
            return -1
          }
          return 0
        })
      } else if (campo === 'Periodo') {
        this.reservas.sort(function (a, b) {
          if (a[1].PeriodoInicio > b[1].PeriodoInicio) {
            return 1
          }
          if (a[1].PeriodoInicio < b[1].PeriodoInicio) {
            return -1
          }
          return 0
        })
      } else if (campo === 'Equipamento') {
        console.log(this.reservas)
        this.reservas.sort(function (a, b) {
          if (a[1].Equipamento > b[1].Equipamento) {
            console.log('qualquertexot')
            return 1
          }
          if (a[1].Equipamento < b[1].Equipamento) {
            console.log('logo')
            return -1
          }
          return 0
        })
      } else if (campo === 'RA') {
        this.reservas.sort(function (a, b) {
          if (a[1].RA > b[1].RA) {
            return 1
          }
          if (a[1].RA < b[1].RA) {
            return -1
          }
          return 0
        })
      } else if (campo === 'Estado') {
        this.reservas.sort(function (a, b) {
          if (a[1].Status > b[1].Status) {
            return 1
          }
          if (a[1].Status < b[1].Status) {
            return -1
          }
          return 0
        })
      }
      console.log('terminado')
    }
  }
}
</script>

<style lang="css">
</style>
