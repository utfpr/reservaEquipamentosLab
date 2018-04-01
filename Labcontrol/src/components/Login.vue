<template>
  <div id="login">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-sm-12 col-md-8 col-lg-4 vertical-center">
          <div class="card text-center" style="">
            <div class="card-header">
              Identifique-se, por favor
            </div>
            <div class="card-body">
              <form id="login">
                <div class="form-group">
                  <label class="sr-only" for="email">E-mail</label>
                  <div class="input-group ">
                    <div class="input-group-prepend">
                      <div class="input-group-text d-xs-none d-md-flex"><i class="fas fa-envelope"></i></div>
                    </div>
                  <input type="email" v-model="email" class="form-control" id="email" placeholder="E-mail" @focus="" @blur="" >
                  </div>
                </div>
                   <div class="form-group">
                  <label class="sr-only" for="password">Senha</label>
                     <div class="input-group">
                       <div class="input-group-prepend">
                         <div class="input-group-text d-xs-none d-md-flex"><i class="fas fa-lock"></i></div>
                       </div>
                       <input type="password" v-model="password" class="form-control" id="password" placeholder="Senha">
                     </div>
                   </div>
                   <button class="btn btn-primary btn-block" v-on:click="login">Login</button>
              </form>
            </div>
            <div class="card-footer">
              <div class="row">
                <div class="col-sm-6">
                  <a href="#" class="justify-content-start">Fazer cadastro</a>
                </div>
                <div class="col-sm-6">
                  <a href="#" class="justify-content-end">Esqueci minha senha</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'login',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login: function () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          this.$router.replace('/home')
        },
        (err) => {
          alert('Oops ' + err.message)
        }
      )
    }
  }
}
</script>

<style>

</style>
