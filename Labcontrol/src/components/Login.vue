<template>
  <div id="login">
      <div class="row justify-content-end">
        <div class="d-xs-none d-md-flex col-md-12 col-lg-8 justify-content-center">
          <div class="login-center">
            <h1 class="text-white display-1"> <b>LabControl</b> </h1>
          </div>
        </div>
        <div class="col-sm-12 col-md-12 col-lg-4 justify-content-center login-form login-center login-divider">
          <form id="singIn">
            <div class="form-group">
              <label class="sr-only" for="email">E-mail</label>
              <div class="input-group ">
                <div class="input-group-prepend">
                  <div class="input-group-text d-xs-none d-md-flex"><i class="fas fa-envelope"></i></div>
                </div>
                <input type="email" v-model="email" class="form-control" id="email" placeholder="E-mail">
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
          <div class="row">
            <div class="col-sm-6 text-left">
              <a href="#" class="text-link">Fazer cadastro</a>
            </div>
            <div class="col-sm-6 text-right">
              <a href="#" class="text-link">Esqueci minha senha</a>
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
  mounted: function () {
    let elements = document.getElementsByName('hideOnLogin')

    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.add('login')
    }

    let main = document.getElementsByTagName('main')
    main[0].setAttribute('style', 'margin-top: 0px!important;')
  },
  destroyed: function () {
    let elements = document.getElementsByName('hideOnLogin')

    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove('login')
    }

    let main = document.getElementsByTagName('main')
    main[0].setAttribute('style', '')
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
/* local styles */

.login-divider {
  height: 96vh;
  margin-top: 2vh;
  margin-bottom: 2vh;
  border-left: 0.1em solid rgba(255,255,255,0.75);
}

@media (min-width: 0px) {
  .login-form {
    padding-right: 15%;
    padding-left: 15%;
    padding-top: 15%;
  }
}

@media (min-width: 768px) {
  .login-form {
    padding-right: 5%;
    padding-left: 5%;
  }

}

@media (min-width: 992px) {
  .login-center{
    padding-top: 42vh;
  }
}

.login {
  display: none!important;
}

.text-link {
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
  background-image: url('../assets/lab_01.jpg');
  background-size:cover;
  width: 100%;
  height: 100%;

  -webkit-filter: blur(0.65em);
  -moz-filter: blur(0.65em);
  -o-filter: blur(0.65em);
  -ms-filter: blur(0.65em);
  filter: blur(0.65em);
}

.input-group-text {
  color: #fff;
  background-color: transparent;
  border: 0px;
  border-bottom: 1px solid #fff;
  border-radius: 0rem;
}

.form-control {
  color: #fff;
  border: 0px;
  background-color: transparent;
  background-clip: padding-box;
  border-bottom: 1px solid #fff;
  border-radius: 0rem;
}

.form-control:focus {
  color: #fff;
  background-color: rgba(0, 0, 0, 0);
  border: 0px;
  border-bottom: 2px solid #fff;
  outline: 0;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
}

.form-control::-webkit-input-placeholder {
  color: #fff;
  opacity: 1;
}

.form-control::-moz-placeholder {
  color: #fff;
  opacity: 1;
}

.form-control:-ms-input-placeholder {
  color: #fff;
  opacity: 1;
}

.form-control::-ms-input-placeholder {
  color: #fff;
  opacity: 1;
}

.form-control::placeholder {
  color: #fff;
  opacity: 1;
}

.btn-primary {
  color: #fff;
  background-color: rgba(44, 102, 206, 0.45);
  border-color: rgba(0, 0, 0, 0);
  border-radius: 0;
}

.btn-primary:hover {
  color: #fff;
  background-color: rgba(44, 102, 206, 0.75);
  border-color: rgba(44, 102, 206, 0)
}

.btn-primary:focus, .btn-primary.focus {
  color: #fff;
  background-color: rgba(44, 102, 206, 0.75);
  border-color: rgba(44, 102, 206, 0.75);
  box-shadow: 0 0 0 0.2rem rgba(44, 102, 206, 0.5);
}

</style>
