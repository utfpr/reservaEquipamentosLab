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
          <h2> Escolha um equipamento </h2>
        </div>
      <div v-if="!loader.loading" class="row">
        <div class="col-12">
          <div class="table-wrapper">
            <h4 v-if="equipamentos.length === 0" class=" text-center mt-5"> Nenhum Equipamento encontrado </h4>
            <table v-else class="table table-responsive-md table-hover text-center">
              <thead>
                <tr>
                  <th scope="col"> <span v-on:click="orderBy('Patrimonio')">Patrimônio</span> </th>
                  <th scope="col"> <span v-on:click="orderBy('Nome')">Nome</span> </th>
                  <th scope="col"> <span v-on:click="orderBy('Local')">Local</span> </th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="equipamento in equipamentos" v-on:click="selectItem(equipamento[0])">
                  <th scope="row">
                    <div class="custom-control custom-radio">
                      <input type="radio" :id="equipamento[0]" name="itemReserva" class="custom-control-input" :value="equipamento[0]" v-model="equipamentoReserva">
                      <label class="custom-control-label" :for="equipamento[0]">{{equipamento[0]}}</label>
                    </div>
                  </th>
                  <td>{{equipamento[1].Nome}}</td>
                  <td>{{equipamento[1].Local}}</td>
                  <td>
                    <ul class="list-inline d-inline-flex">
                      <li>
                        <span v-on:click="$modal.show('equipamentView', {item: equipamento})" class="mr-2 list-inline-item btn btn-primary btn-sm">Informações</span>
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="d-flex d-md-none row justify-content-between">
        <div class="col-12 col-md-6 text-right">
          <router-link v-if="equipamentoReserva" :to="{ name: 'periodoReserva', params: {objetoReserva: 'equipamento', itemReserva: equipamentoReserva}}" class="btn btn-primary btn-block">Continuar reserva</router-link>
          <span v-else class="btn btn-primary btn-block disabled">Continuar reserva</span>
        </div>
        <div class="col-12 col-md-6 text-left">
          <button type="submit" v-on:click="$parent.voltar" class="btn btn-light btn-block" >Voltar</button>
        </div>
      </div>
      <div class="d-none d-md-flex row justify-content-between">
        <div class="col-12 col-md-6 text-left">
          <button type="submit" v-on:click="$parent.voltar" class="btn btn-light" >Voltar</button>
        </div>
        <div class="col-12 col-md-6 text-right">
          <router-link v-if="equipamentoReserva" :to="{ name: 'periodoReserva', params: {objetoReserva: 'equipamento', itemReserva: equipamentoReserva}}" class="btn btn-primary">Continuar reserva</router-link>
          <span v-else class="btn btn-primary disabled">Continuar reserva</span>
        </div>
      </div>

      <modal name="equipamentView" :height="'auto'" @before-open="beforeOpen">
        <div class="container">
          <div class="row justify-content-end">
            <button class="btn btn-outline-secondary btn-sm my-2 mx-2" @click="$modal.hide('equipamentView')">
              ❌
            </button>
          </div>
          <div class="row justify-content-center">
            <div class="col-12 text-center">
              <h5>Informações sobre o equipamento</h5>
            </div>
          </div>
          <hr />
          <div class="row">
            <div class="col-12">
              <strong>Patrimônio: </strong>{{view.patrimonio}}
            </div>
            <div class="col-12">
              <strong>Nome: </strong>{{view.nome}}
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <strong>Curso: </strong>{{view.curso}}
            </div>
            <div class="col-sm-6 col-md-4">
              <strong>Local: </strong>{{view.local}}
            </div>
            <div class="col-sm-6 col-md-4">
              <strong>Marca: </strong>{{view.status}}
            </div>
            <div class="col-sm-6 col-md-4">
              <strong>Status: </strong>{{view.status}}
            </div>
          </div>
        </div>
      </modal>
    </div>
</template>

<script>
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import firebaseApp from '../../firebase-controller.js'
const db = firebaseApp.database()
// const auth = firebaseApp.auth()
export default {
  name: 'listaEquipamentos',
  data () {
    return {
      filtros: ['Patrimônio', 'Nome', 'Local'],
      filtroAtivo: '',
      equipamentoReserva: null,
      equipamentos: [],
      view: {
        patrimonio: null,
        nome: null,
        curso: null,
        local: null,
        marca: null,
        status: null
      },
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
        if (childSnapshot.val().Status === 'Normal') {
          _this.equipamentos.push([childSnapshot.key, childSnapshot.val()])
        }
      })
      _this.loader.loading = false
    })
    this.$parent.currentStep = 1
  },
  methods: {
    selectItem (patrimonio) {
      let itemReserva = document.getElementById(patrimonio)
      itemReserva.checked = true
      this.equipamentoReserva = itemReserva.value
    },
    selectFilter (filtro) {
      this.filtroAtivo = filtro
      this.search()
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
      }
    },
    beforeOpen (event) {
      let equip = event.params.item
      this.view.patrimonio = equip[0]
      this.view.nome = equip[1].Nome
      this.view.curso = equip[1].Curso
      this.view.local = equip[1].Local
      this.view.marca = equip[1].Marca
      this.view.status = equip[1].Status
    }
  }
}
</script>

<style lang="css">
</style>
