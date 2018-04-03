<template>
  <div id="cadastro">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-sm-12 col-md-8 col-lg-4 vertical-center">
          <div class="card text-center" style="">
            <div class="card-header">
              Cadastro de laboratorio
            </div>
            <div class="card-body">
              <form>
                <div class="form-group">
                  <label for="nome">Bloco e Sala (Ex: E004)</label>
                  <div class="input-group ">
                    <div class="input-group-prepend">
                      <div class="input-group-text d-xs-none d-md-flex"><i class="fas fa-map-marker"></i></div>
                    </div>
                    <input type="text" required="required" class="form-control" id="sala" maxlength="4">
                  </div>
                </div>
                <div class="form-group">
                  <label for="telefone">Descrição:</label>
                  <div class="input-group ">
                    <div class="input-group-prepend">
                      <div class="input-group-text d-xs-none d-md-flex"><i class="fas fa-book"></i></div>
                    </div>
                    <input type="text" class="form-control" id="descrição">
                  </div>
                </div>
                <div class="form-group">
                  <label for="curso">Supervisor:</label>
                  <select class="form-control" id="supervisor">
                    <option>Prof 1</option>
                    <option>Prof 2</option>
                    <option>Prof 3</option>
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
    name: 'local',
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
