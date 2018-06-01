<template>
  <div id="Equipamentos">
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
        <div class="col-12">
          <h4 v-if="equipamentos.length === 0" class=" text-center mt-5"> Nenhum Equipamento encontrado </h4>
          <table v-else class="table table-responsive-md table-hover text-center">
            <thead>
              <tr>
                <th scope="col">Patrimônio</th>
                <th scope="col">Nome</th>
                <th scope="col">Local</th>
                <th scope="col">Estado</th>
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
  mounted: function () {
    let _this = this
    db.ref('Equipamentos').on('value', function (snapshot) {
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
    }
  }
}
</script>

<style lang="css">
</style>
