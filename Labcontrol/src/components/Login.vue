<template>
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-sm-12 col-md-8 col-lg-4 vertical-center">
				<div class="card text-center" style="">
					<div class="card-header">
						Identifique-se, por favor
					</div>
					<div class="card-body">
						<form>
							<div class="form-group">
								<label class="sr-only" for="email">E-mail</label>
								<div class="input-group ">
								  <div class="input-group-prepend">
								    <div class="input-group-text d-xs-none d-md-flex"><i class="fas fa-envelope"></i></div>
								  </div>
								<input type="text" class="form-control" id="email" placeholder="E-mail">
								</div>
							</div>
						     <div class="form-group">
								<label class="sr-only" for="senha">Senha</label>
							     <div class="input-group">
							       <div class="input-group-prepend">
							         <div class="input-group-text d-xs-none d-md-flex"><i class="fas fa-lock"></i></div>
							       </div>
							       <input type="text" class="form-control" id="senha" placeholder="Senha">
							     </div>
						     </div>
						     <button type="submit" class="btn btn-primary">Login</button>
						</form>
					</div>
					<div class="card-footer">
						<div class="row">
							<div class="col-sm-6">
								<a href="#" class="justify-content-start">Fazer cadastro</a>
							</div>
							<div class="col-sm-6">
								<a href="#" class="justify-content-end">Esqueci minha senha</a>
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
