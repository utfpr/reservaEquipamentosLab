<template>
  <div id="root">
    <header>
      <nav name="hideOn" class="navbar navbar-expand-lg navbar-dark fixed-top nav-bg-gradient justify-content-between">

        <button class="navbar-toggler d-flex" type="button" v-on:click="toggle" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon-personalized"></span>
        </button>

        <a class="navbar-brand text-justify" href="#">LabControl</a>

      </nav>
    </header>
    <main>

      <div id="wrapper" class="">

       <!-- Sidebar -->
       <div id="sidebar-wrapper">
         <ul class="sidebar-nav">
           <li class="nav-item dropdown">
             <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
               <span v-if="username">Olá, {{ username }}</span>
             </a>
             <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
               <a v-if="isUser" href="#" v-on:click="logout" class="dropdown-item">Sair</a>
               <a class="dropdown-item" href="#">Action</a>
               <a class="dropdown-item" href="#">Another action</a>
               <a class="dropdown-item" href="#">Something else here</a>
             </div>
           </li>
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
       <!-- End sidebar -->

      <div id="page-content-wrapper">
        <router-view></router-view>
        <notifications group="notify" />
        <vue-progress-bar></vue-progress-bar>
      </div>
    </div>
    </main>
    <!-- <footer id="footer" name="hideOn" class="footer" style="background-color: #DDDFE4;">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-sm-12 text-center"> -->
            <!-- <img src="./assets/logo_UTFPR.png" style="width:150px; margin:10%"> -->
            <!-- <small><p class="d-xs-none d-sm-flex" style="margin: 15px 0 15px 0">UTFPR Campus Campo Mourão - Via Rosalina Maria dos Santos, 1233 CEP 87301-899 Caixa Postal: 271 Campo Mourão - PR - Brasil<br>Telefone Geral +55 (44) 3518-1400</p></small>
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
    </footer> -->
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
      if (this.$root.toggled) {
        this.toggle()
      }
      auth.signOut()
      this.$router.replace('/login')
      location.reload()
    },
    toggle: function () {
      let wrapper = document.getElementById('wrapper')
      if (this.$root.toggled) {
        wrapper.classList.remove('toggled')
      } else {
        wrapper.classList.add('toggled')
      }
      this.$root.toggled = !this.$root.toggled
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
  margin-top: 70px;
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

#wrapper {
  padding-left: 0;
  -webkit-transition: all 0.5s ease;
  -moz-transition: all 0.5s ease;
  -o-transition: all 0.5s ease;
  transition: all 0.5s ease;
}

#wrapper.toggled {
  padding-left: 250px;
}

#sidebar-wrapper {
  z-index: 1000;
  position: fixed;
  left: 250px;
  width: 0;
  height: 100%;
  margin-left: -250px;
  overflow-y: auto;
  background: #000;
  -webkit-transition: all 0.5s ease;
  -moz-transition: all 0.5s ease;
  -o-transition: all 0.5s ease;
  transition: all 0.5s ease;
}

#wrapper.toggled #sidebar-wrapper {
  width: 250px;
}

/* #page-content-wrapper {
  width: 100%;
  position: absolute;
  padding: 15px;
}

#wrapper.toggled #page-content-wrapper {
  position: absolute;
  margin-right: -250px;
} */


/* Sidebar Styles */

#wrapper .sidebar-nav {
  position: absolute;
  top: 0;
  width: 250px;
  margin: 0;
  padding: 0;
  list-style: none;
}

#wrapper .sidebar-nav li {
  text-indent: 20px;
  line-height: 40px;
}

#wrapper .sidebar-nav li a {
  display: block;
  text-decoration: none;
  color: #999999;
}

#wrapper .sidebar-nav li a:hover {
  text-decoration: none;
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
}

#wrapper .sidebar-nav li a:active, .sidebar-nav li a:focus {
  text-decoration: none;
}

#wrapper .sidebar-nav>.sidebar-brand {
  height: 65px;
  font-size: 18px;
  line-height: 60px;
}

#wrapper .sidebar-nav>.sidebar-brand a {
  color: #999999;
}

#wrapper .sidebar-nav>.sidebar-brand a:hover {
  color: #fff;
  background: none;
}

@media(min-width:768px) {
  #wrapper {
    padding-left: 0;
  }
  #wrapper.toggled {
    padding-left: 250px;
  }
  #sidebar-wrapper {
    width: 0;
  }
  #wrapper.toggled #sidebar-wrapper {
    width: 250px;
  }
  /* #page-content-wrapper {
    padding: 20px;
    position: relative;
  }
  #wrapper.toggled #page-content-wrapper {
    position: relative;
    margin-right: 0;
  } */
}

</style>
