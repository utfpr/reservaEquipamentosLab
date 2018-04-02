<template>
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-sm-12 col-md-8 col-lg-4 vertical-center">
				<div class="card text-center" style="">
					<div class="card-header">
						Cadastro
					</div>
					<div class="card-body">
						<form id="form" class="form-inline" v-on:submit.prevent ="Confirmar">
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
										v-model = "newUser.ra"
								 />
								</div>
							</div>
							<div class="form-group">
									<label for="nome">Nome:</label>
									<div class="input-group ">
									<div class="input-group-prepend">
										<div class="input-group-text d-xs-none d-md-flex"><i class="fas fa-user"></i></div>
									</div>
									<input type="text" required="required" class="form-control" id="nome" v-model = "newUser.nome">
								</div>
							</div>
							<div class="form-group">
								<label for="email">E-mail:</label>
								<div class="input-group ">
									<div class="input-group-prepend">
										<div class="input-group-text d-xs-none d-md-flex"><i class="fas fa-envelope"></i></div>
									</div>
									<input type="email" required="required" class="form-control" id="email" v-model = "newUser.email">
								</div>
							</div>
							<div class="form-group">
									<label for="telefone">Telefone:</label>
								<div class="input-group ">
									<div class="input-group-prepend">
										<div class="input-group-text d-xs-none d-md-flex"><i class="fas fa-phone"></i></div>
									</div>
									<input type="tel" required="required" class="form-control" id="telefone" maxlength="11" v-model = "newUser.telefone">
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
    }
  }
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
