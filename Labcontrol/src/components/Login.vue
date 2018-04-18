<template>
  <div id="login">
      <div class="row justify-content-end">
        <div class="d-xs-none d-sm-flex col-sm-12 col-lg-8 justify-content-center text-center">
            <div class="login-center mt-sm-5 mt-lg-0">
                <h1 class="text-white display-1"> <b>LabControl</b></h1>
                <div class="d-xs-none d-lg-flex text-white">
                  <p class="login-description">Reserve equipamentos e espaços para as suas atividades com muito mais praticidade!</p>
                </div>
            </div>
        </div>
        <div class="col-sm-12 col-md-12 col-lg-4 justify-content-center login-form login-center login-divider">
          <form id="singIn" v-on:submit="login">
            <div class="form-group">
              <label class="sr-only" for="email">E-mail</label>
              <div class="input-group ">
                <div class="input-group-prepend">
                  <div class="input-group-text input-group-text-login d-xs-none d-md-flex"><i class="fas fa-envelope"></i></div>
                </div>
                <input type="email" v-model="email" class="form-control form-control-login" id="email" placeholder="E-mail" autocomplete="off" >
              </div>
            </div>
            <div class="form-group">
              <label class="sr-only" for="password">Senha</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <div class="input-group-text input-group-text-login d-xs-none d-md-flex"><i class="fas fa-lock"></i></div>
                </div>
                <input type="password" v-model="password" class="form-control form-control-login" id="password" placeholder="Senha" autocomplete="current-password">
              </div>
            </div>
            <button type="submit" class="btn btn-primary-login btn-block">Login</button>
          </form>
          <div class="row">
            <div class="col-sm-12 col-md-6 text-left">
              <router-link to="/cadastro" class="text-link">Fazer cadastro</router-link>
            </div>
            <div class="col-sm-12 col-md-6 text-right">
              <router-link to="/RecuperarSenha" class="text-link">Esqueci minha senha</router-link>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import firebaseApp from '../firebase-controller.js'
const auth = firebaseApp.auth()

export default {
  name: 'login',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  mounted: function () {
    let elements = document.getElementsByName('hideOn')

    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.add('hideOn')
    }

    let main = document.getElementsByTagName('main')
    main[0].setAttribute('style', 'margin-top: 0px!important;')
  },
  destroyed: function () {
    let elements = document.getElementsByName('hideOn')

    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove('hideOn')
    }

    let main = document.getElementsByTagName('main')
    main[0].setAttribute('style', '')
  },
  methods: {
    login: function () {
      let _this = this
      auth.signInWithEmailAndPassword(this.email, this.password).then(function (user) {
        _this.$router.replace('/verificar-email')
      }).catch((err) => {
        switch (err.message) {
          case 'The email address is badly formatted.': {
            this.$notify({
              group: 'notify',
              type: 'error',
              title: 'Oops!',
              text: 'Endereço de E-mail inválido'
            })
            break
          }
          case 'The password is invalid or the user does not have a password.' || 'There is no user record corresponding to this identifier. The user may have been deleted.': {
            this.$notify({
              group: 'notify',
              type: 'error',
              title: 'Oops!',
              text: 'E-mail não cadastrado ou senha inválida'
            })
            break
          }
          default: {
            this.$notify({
              group: 'notify',
              type: 'error',
              title: 'Oops!',
              text: 'Parece que algo deu errado.<br>Por favor, tente novamente'
            })
            break
          }
        }
        console.log('Falha ao logar: ' + err.message)
      })
    }
  }
}
</script>

<style>
/* local styles */

#login .login-divider {
  height: 96vh;
  margin-top: 2vh;
  margin-bottom: 2vh;
  border-left: 0.1em solid rgba(255,255,255,0.75);
}

@media (min-width: 0px) {
  #login .login-form {
    padding-right: 15%;
    padding-left: 15%;
    padding-top: 15%;
  }
  #login .text-left {
    text-align: center!important;
  }
  #login .text-right {
    text-align: center!important;
  }
}

@media (min-width: 768px) {
  #login .login-form {
    padding-right: 5%;
    padding-left: 5%;
  }
  #login .text-left {
    text-align: left!important;
  }
  #login .text-right {
    text-align: right!important;
  }

}

@media (min-width: 992px) {
  #login .login-center{
    padding-top: 42vh;
  }
}

#login .text-link {
  color: rgba(255, 255, 255, 0.5);
}

a:hover {
  color: rgba(255, 255, 255, 0.5);
}

#login {
  background-color: rgba(0,0,0,0.65);
}

#login::before {
  content: "";
  position: fixed;
  left: 0;
  right: 0;
  z-index: -1;

  display: block;
  background-position: center;
  background-image: url('../assets/img/lab_01.jpg');
  background-size:cover;
  width: 100%;
  height: 100%;

  -webkit-filter: blur(0.65em);
  -moz-filter: blur(0.65em);
  -o-filter: blur(0.65em);
  -ms-filter: blur(0.65em);
  filter: blur(0.65em);
}

#login .login-description {
  max-width: 50vw;
}

#login .input-group-text-login {
  color: #fff;
  background-color: transparent;
  border: 0px;
  border-bottom: 1px solid #fff;
  border-radius: 0rem;
}

#login .form-control-login {
  color: #fff;
  border: 0px;
  background-color: transparent;
  background-clip: padding-box;
  border-bottom: 1px solid #fff;
  border-radius: 0rem;
}

#login .form-control-login:focus {
  color: #fff;
  background-color: rgba(0, 0, 0, 0);
  border: 0px;
  border-bottom: 2px solid #fff;
  outline: 0;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
}

#login .form-control-login::-webkit-input-placeholder {
  color: #fff;
  opacity: 1;
}

#login .form-control-login::-moz-placeholder {
  color: #fff;
  opacity: 1;
}

#login .form-control-login:-ms-input-placeholder {
  color: #fff;
  opacity: 1;
}

#login .form-control-login::-ms-input-placeholder {
  color: #fff;
  opacity: 1;
}

#login .form-control-login::placeholder {
  color: #fff;
  opacity: 1;
}

#login .btn-primary-login {
  color: #fff;
  background-color: rgba(44, 102, 206, 0.45);
  border-color: rgba(0, 0, 0, 0);
  border-radius: 0;
}

#login .btn-primary-login:hover {
  color: #fff;
  background-color: rgba(44, 102, 206, 0.75);
  border-color: rgba(44, 102, 206, 0)
}

#login .btn-primary-login:focus, #login .btn-primary.focus {
  color: #fff;
  background-color: rgba(44, 102, 206, 0.75);
  border-color: rgba(44, 102, 206, 0.75);
  box-shadow: 0 0 0 0.2rem rgba(44, 102, 206, 0.5);
}

</style>
