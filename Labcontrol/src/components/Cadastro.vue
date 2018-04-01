<template>
  <div id="cadastro">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-sm-12 col-md-8 col-lg-4 vertical-center">
          <div class="card text-center" style="">
            <div class="card-header">
              Cadastro
            </div>
            <div class="card-body">
              <form>
                <div class="form-group">
                  <label for="ra">Registro Academico:</label>
                  <div class="input-group ">
                    <div class="input-group-prepend">
                      <div class="input-group-text d-xs-none d-md-flex"><i class="fas fa-graduation-cap"></i></div>
                    </div>
                    <input id="ra"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" type = "number" min="1" maxlength = "7" class="form-control"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label for="nome">Nome:</label>
                  <div class="input-group ">
                    <div class="input-group-prepend">
                      <div class="input-group-text d-xs-none d-md-flex"><i class="fas fa-user"></i></div>
                    </div>
                    <input type="text" required="required" class="form-control" id="nome">
                  </div>
                </div>
                <div class="form-group">
                  <label for="email">E-mail:</label>
                  <div class="input-group ">
                    <div class="input-group-prepend">
                      <div class="input-group-text d-xs-none d-md-flex"><i class="fas fa-envelope"></i></div>
                    </div>
                    <input type="email" required="required" class="form-control" id="email">
                  </div>
                </div>
                <div class="form-group">
                  <label for="telefone">Telefone:</label>
                  <div class="input-group ">
                    <div class="input-group-prepend">
                      <div class="input-group-text d-xs-none d-md-flex"><i class="fas fa-phone"></i></div>
                    </div>
                    <input type="tel" required="required" class="form-control" id="telefone" maxlength="11" >
                  </div>
                </div>
                <div class="form-group">
                  <label for="curso">Curso:</label>
                  <select class="form-control" id="curso">
                    <option>Engenharia Ambiental</option>
                    <option>Engenharia de Alimentos</option>
                    <option>Quimica</option>
                  </select>
                </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script>
  export default {
    name: 'cadastro',
    data () {
      return {}
    },
    methods: {}
  }
  </script>

  <style>
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
