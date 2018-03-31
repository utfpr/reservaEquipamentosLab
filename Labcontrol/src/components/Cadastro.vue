<template>
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
                  <select name="Curso" id="curso">
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
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {}
  },
  methods: {}
}
</script>

<style>
.vertical-center {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

@media (min-width: 0px){
	.d-xs-none{
		display: none;
	}
}
</style>
