<template>
<<<<<<< HEAD
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
                  <div class="input-group ">
                  <input type="text" required="required" class="form-control" id="ra" placeholder="RA">
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group ">
                  <input type="text" required="required" class="form-control" id="nome" placeholder="Nome">
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group ">
                  <input type="email" required="required" class="form-control" id="e-mail" placeholder="E-mail">
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group ">
                  <input type="text" required="required" class="form-control" id="telefone" placeholder="Telefone">
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group ">
                    <select  class="form-control" name="Curso" id="curso">
                      <option value="quimica"> Quimica </option>
                      <option value="engali"> Engenharia de Alimentos </option>
                      <option value="engamb"> Engenharia Ambiental </option>
                    </select>
                  </div>
                </div>
                   <button type="submit" class="btn btn-primary">Confirmar</button>
                   <button type="reset" class="btn btn-primary">Cancelar</button>
              </form>
            </div>
            <div class="card-footer">
              <div class="row">
=======
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
								    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
								    type = "number"
								    maxlength = "7"
										class="form-control"
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
>>>>>>> Labcontrol/master
              </div>
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
