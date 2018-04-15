<template>
  <div id="root">
    <header>
      <nav name="hideOn" class="navbar navbar-expand-lg navbar-dark fixed-top nav-bg-gradient justify-content-between">
        <a class="navbar-brand text-justify" href="#">LabControl</a>

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon-personalized"></span>
        </button>

        <div class="collapse navbar-collapse"  id="navbar">
          <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
            <li class="nav-item">
              <router-link to="/home" class="nav-link">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/login" class="nav-link">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/cadastro" class="nav-link">Cadastro</router-link>
            </li>
          </ul>
        </div>

        <div class="userLogout">
          <div class="text-white">
            <span v-if="username">Olá, {{ username }}</span>
            <a v-if="isUser" href="#" v-on:click="logout" class="btn btn-dark btn-sm">Sair</a>
          </div>
        </div>
      </nav>
    </header>
    <main>
      <router-view></router-view>
      <notifications group="notify" />
      <vue-progress-bar></vue-progress-bar>
    </main>
    <footer id="footer" name="hideOn" class="footer" style="background-color: #DDDFE4;">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-sm-12 text-center">
            <!-- <img src="./assets/logo_UTFPR.png" style="width:150px; margin:10%"> -->
            <small><p class="d-xs-none d-sm-flex" style="margin: 15px 0 15px 0">UTFPR Campus Campo Mourão - Via Rosalina Maria dos Santos, 1233 CEP 87301-899 Caixa Postal: 271 Campo Mourão - PR - Brasil<br>Telefone Geral +55 (44) 3518-1400</p></small>
          </div>
        </div>
      </div>
      <div class="copyright" style="background-color:#C9CBD0;">
        <div class="container">
          <div class="row">
            <div class="col-sm-6 text-left">

            </div>
            <div class="col-md-6 text-right">
              <small>&copy; Copyright 2018 <a href="http://portal.utfpr.edu.br/campus/campomourao" target="_blank" class="text-dark">DACOM UTFPR-CM</a></small>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import firebaseApp from './firebase-controller.js'
const auth = firebaseApp.auth()
export default {
  name: 'app',
  data () {
    return {
      username: null,
      isUser: null
    }
  },
  mounted () {
    this.$Progress.finish()
  },
  created () {
    this.$Progress.start()
    this.$router.beforeEach((to, from, next) => {
      this.$Progress.start()
      next()
    })
    this.$router.afterEach((to, from) => {
      this.isUser = auth.currentUser
      if (auth.currentUser) {
        this.username = auth.currentUser.displayName
        if (!auth.currentUser.emailVerified) {
          this.$router.replace('/verificar-email')
        }
      }
      this.$Progress.finish()
    })
  },
  methods: {
    logout: function () {
      auth.signOut()
      this.$router.replace('/login')
      location.reload()
    }
  }
}
</script>

<style lang="css">
@import '../node_modules/bootstrap/dist/css/bootstrap.css';

#root {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

body {
  overflow-x: hidden;
}

main {
  flex: 1 1 auto;
  margin-top: 100px;
}

.vertical-center {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.horizontal-center {
  position: absolute;
  right: 50%;
  transform: translateX(50%);
}

.nav-bg-gradient {
  background-image: linear-gradient(135deg, #343a40 50%, #007bff 100%);
}

.navbar-toggler-icon-personalized {
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  vertical-align: middle;
  content: "";
  background: no-repeat center center;
  background-size: 100% 100%;
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(0, 0, 0, 0.5)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
}

@media (min-width: 0px){
  .d-xs-none{
    display: none;
  }
}

::-webkit-scrollbar {
  width: 5px;
  background-color:rgba(0, 0, 0, 0);
}

::-webkit-scrollbar-track {
  background-color:rgba(0, 0, 0, 0);
}


::-webkit-scrollbar-thumb {
  background: rgb(136, 136, 136, 1);
  border-radius: 25px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgb(85, 85, 85, 1);
}

.hideOn {
  display: none!important;
}

input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  display: none;
  cursor:pointer;
  display:block;
  width:8px;
  color: #333;
  text-align:center;
  position:relative;
}
input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
  margin: 0;
}

</style>
