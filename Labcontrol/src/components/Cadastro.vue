<template>
  <div class="container">
    <div class="row justify-content-center text-center">
        <h2> Crie sua conta no LabControl! </h2>
    </div>
    <hr />
    <div class="row justify-content-center">
      <form id="cadastroForm" class="needs-validation"  novalidate>
        <div class="form-row">
          <div class="col-md-6 mb-3">
            <label for="ra">Registro Academico</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="raPrepend"><i class="fas fa-address-card"></i></span>
              </div>
              <input id="ra" type="number" class="form-control" maxlength = "7" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"  placeholder="Digite seu RA" aria-describedby="raPrepend" v-model = "newUser.ra" required>
              <div class="invalid-feedback">
                Por favor informe um RA.
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <label for="nome">Nome</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="nomePrepend"><i class="fas fa-user"></i></span>
              </div>
              <input id="nome" type="text" class="form-control" placeholder="Digite seu nome" aria-describedby="nomePrepend" v-model = "newUser.nome" required>
              <div class="invalid-feedback">
                Por favor informe seu nome.
              </div>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="col-md-6 mb-3">
            <label for="email">E-mail</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="emailPrepend"><i class="fas fa-envelope"></i></span>
              </div>
              <input id="email" type="email" class="form-control" placeholder="Digite um E-mail válido" aria-describedby="emailPrepend" v-model = "newUser.email" required>
              <div class="invalid-feedback">
                Por favor informe um E-mail válido.
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <label for="telefone">Telefone</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="telefonePrepend"><i class="fas fa-phone"></i></span>
              </div>
              <input id="telefone" type="tel" class="form-control" placeholder="Digite seu telefone com DDD (opcional)" aria-describedby="telefonePrepend" v-model = "newUser.telefone">
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="col-md-6 mb-3">
            <label for="curso">Curso</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="cursoPrepend"><i class="fas fa-graduation-cap"></i></span>
              </div>
              <select id="curso" class="form-control" aria-describedby="cursoPrepend" v-model = "newUser.curso" required>
                <option value="" disabled selected>Selecione seu curso</option>''
                <option>Engenharia Ambiental</option>
                <option>Engenharia de Alimentos</option>
                <option>Quimica</option>
              </select>
              <div class="invalid-feedback">
                Por favor selecione um curso.
              </div>
            </div>
          </div>
        </div>
        <div>
          <button type="submit" class="btn btn-primary btn-block" v-on:click="validate">Me cadastrar</button>
        </div>
      </form>
    </div>
  </div>
</div>
</template>

<script>
import firebase from 'firebase'
var db = firebase.database()
var cadastroRef = db.ref('cadastro')
export default {
  name: 'confirmar',
  firebase: {
    cadastro: cadastroRef
  },
  data () {
    return {
      newUser: {
        ra: '',
        nome: '',
        email: '',
        telefone: '',
        curso: ''
      }
    }
  },
  methods: {
    submitNewUser () {
      cadastroRef.push(this.newUser)
      this.newUser.ra = ''
      this.newUser.nome = ''
      this.newUser.email = ''
      this.newUser.telefone = ''
      this.newUser.curso = ''
      this.$router.push({name: '/', params: 'teste'})
    },
    validate: function () {
      let _this = this
      var forms = document.getElementsByClassName('needs-validation')
      Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
          if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
          } else {
            _this.submitNewUser()
          }
          form.classList.add('was-validated')
        }, false)
      })
    }
  }
}
</script>

<style>

#cadastroForm {
  width: 100vw;
}
</style>
