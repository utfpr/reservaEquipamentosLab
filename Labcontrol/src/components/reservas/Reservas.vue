<template>
  <div id="Reservas">
    <div class="container-fluid">
      <div v-if="loader.loading" class="row justify-content-center">
        <ring-loader :loading="loader.loading" :color="loader.color" :size="loader.size"></ring-loader>
      </div>
      <div v-if="!loader.loading" class="row">
        <div class="col d-none d-md-flex justify-content-center">
          <form>
            <div class="form-row align-items-center">
              <div class="col-auto my-1">
                <input class="form-control mr-sm-2" type="search" placeholder="Realize uma busca" aria-label="Buscar">
              </div>
              <div class="col-auto my-1">
                <button class="btn btn-outline-primary my-2 my-sm-0" type="submit">Buscar</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div v-if="!loader.loading" class="row">
        <div class="col-12">
          <h4 v-if="reservas.length === 0" class=" text-center mt-5"> Nenhuma reserva encontrada </h4>
          <table v-else class="table table-responsive-md table-hover text-center">
            <thead>
              <tr>
                <th scope="col">Data</th>
                <th scope="col">Periodo</th>
                <th scope="col">Equipamento - Local</th>
                <th scope="col">Aluno</th>
                <th scope="col">Status</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="reserva in reservas">
                <th scope="row">{{reserva[1].Data}}</th>
                <td>{{reserva[1].PeriodoInicio}} - {{reserva[1].PeriodoFim}}</td>
                <td>{{reserva[1].Equipamento}} - {{reserva[1].Local}}</td>
                <td>{{reserva[1].Aluno}} - {{reserva[1].Aluno}}</td>
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
  }
}
</script>

<style lang="css">
</style>
