<template>
  <div id="cadastroEquips">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-sm-12 col-md-8 col-lg-4 vertical-center">
          <div class="card text-center" style="">
            <div class="card-header">
              Cadastro de equipamento
            </div>
            <div class="card-body">
              <form>
                <div class="form-group">
                  <label for="nome">Nome do equipamento:</label>
                  <div class="input-group ">
                    <div class="input-group-prepend">
                      <div class="input-group-text d-xs-none d-md-flex"><i class="fas fa-flask"></i></div>
                    </div>
                    <input type="text" required="required" class="form-control" id="equipamento">
                  </div>
                </div>
                <div class="form-group">
                  <label for="email">Numero de patrimonio:</label>
                  <div class="input-group ">
                    <div class="input-group-prepend">
                      <div class="input-group-text d-xs-none d-md-flex"><i class="fas fa-list-ol"></i></div>
                    </div>
                    <input type="number" required="required" class="form-control" id="patrimonio">
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
    name: 'equipamento',
    data () {
      return {}
    },
    methods: {}
  }
  </script>

  <style>
  </style>
