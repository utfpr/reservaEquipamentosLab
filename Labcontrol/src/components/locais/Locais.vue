<template>
  <div id="Locais">
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
          <table class="table table-responsive-md table-hover text-center">
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Descrição</th>
                <th scope="col">Curso</th>
                <th scope="col">Supervisor</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="local in locais">
                <th scope="row">{{local[1].Nome}}</th>
                <td>{{local[1].Descricao}}</td>
                <td>{{local[1].Curso}}</td>
                <td>{{local[1].Supervisor}}</td>
                <td>
                  <ul class="list-inline d-inline-flex">
                    <li>
                      <router-link :to="{ name: 'LocalDetails', params: {key: local[0], action: 'view'}}" class="mr-2 list-inline-item btn btn-primary btn-sm">Vizualizar</router-link>
                    </li>
                    <li>
                      <router-link :to="{ name: 'LocalDetails', params: {key: local[0], action: 'edit'}}" class="mr-2 list-inline-item btn btn-warning btn-sm">Editar</router-link>
                    </li>
                    <li>
                      <a href="#"  class="list-inline-item btn btn-danger btn-sm">Deletar</a>
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
  name: 'locais',
  data () {
    return {
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
  mounted: function () {
    let _this = this
    _this.loader.loading = true
    db.ref('Locais').on('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        _this.locais.push([childSnapshot.key, childSnapshot.val()])
        _this.loader.loading = false
      })
    })
  }
}
</script>

<style lang="css">
</style>
