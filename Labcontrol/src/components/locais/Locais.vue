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
        <v-dialog/>
        <div class="col-12 justify-content-center">
          <h4 v-if="locais.length === 0" class=" text-center mt-5"> Nenhum local encontrado </h4>
          <table v-else class="table table-responsive-md table-hover text-center">
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
                      <router-link :to="{ name: 'LocalDetails', params: {key: local[0], action: 'edit'}}" class="mr-2 list-inline-item btn btn-primary btn-sm">Editar</router-link>
                    </li>
                    <li>
                      <span v-on:click="confirmarDelete(local[0], local[1].Nome)" class="list-inline-item btn btn-danger btn-sm">Deletar</span>
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
    db.ref('Locais').on('value', function (snapshot) {
      _this.loader.loading = true
      _this.locais = []
      snapshot.forEach(function (childSnapshot) {
        _this.locais.push([childSnapshot.key, childSnapshot.val()])
      })
      _this.loader.loading = false
    })
  },
  methods: {
    confirmarDelete (key, nome) {
      this.$modal.show('dialog', {
        title: 'Cuidado!',
        text: 'Realmente deseja deletar o Local ' + nome + '? <br> Essa ação não pode ser desfeita',
        buttons: [
          {
            title: 'Deletar',
            handler: () => {
              let _this = this
              db.ref('Locais').child(key).remove().then(function () {
                _this.$notify({
                  group: 'notify',
                  type: 'success',
                  title: 'Yey!',
                  text: 'Local ' + nome + 'deletado com sucesso'
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
    }
  }
}
</script>

<style lang="css">
</style>
