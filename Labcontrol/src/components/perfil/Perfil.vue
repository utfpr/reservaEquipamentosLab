<template>
  <div id="perfilUser">
    <div class="container-fluid">
      <div v-if="loader.loading" class="row justify-content-center">
        <ring-loader :loading="loader.loading" :color="loader.color" :size="loader.size"></ring-loader>
      </div>
      <div v-if="!loader.loading" class="container">
        <v-dialog/>
        <div class="row">
          <div class="col-sm-12 col-md-6">
            <h5><strong>RA</strong>: {{user.ra}}</h5>
          </div>
          <div class="col-sm-12 col-md-6">
            <h5><strong>Nome</strong>: {{user.Nome}} {{user.Sobrenome}}</h5>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-sm-12 col-md-6">
            <p><strong>Curso</strong><br />{{user.Curso}}</p>
          </div>
          <div class="col-sm-12 col-md-6">
            <p><strong>E-mail</strong><br />{{user.Email}}</p>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-12 text-right">
            <ul class="list-inline d-inline-flex">
              <li>
                <router-link to="/peril/edit" class="mr-2 list-inline-item btn btn-primary btn-sm">Editar</router-link>
              </li>
              <li>
                <span v-on:click="confirmarDelete(key)" class="list-inline-item btn btn-danger btn-sm">Excluir conta</span>
              </li>
            </ul>
          </div>
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
  nome: 'Perfil',
  data () {
    return {
      userData: null,
      user: {
        ra: null,
        Nome: null,
        Sobrenome: null,
        Curso: null,
        Email: auth.currentUser.email
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
  mounted: function () {
    this.loader.loading = true
    let _this = this
    db.ref('Usuarios/' + auth.currentUser.uid).on('value', function (snapshot) {
      _this.userData = snapshot.val()
      _this.user.ra = _this.userData.RA
      _this.user.Nome = _this.userData.Nome
      _this.user.Sobrenome = _this.userData.Sobrenome
      _this.user.Curso = _this.userData.Curso
      _this.loader.loading = false
    })
  }
}
</script>

<style lang="css">
</style>
