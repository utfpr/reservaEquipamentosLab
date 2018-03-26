<template>
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-sm-12 col-lg-6">
				<div class="card text-center" style="margin-top: 10%;"">
					<div class="card-header">
						Identifique-se, por favor
					</div>
					<div class="card-body">
						<form>
							<div class="form-group">
								<label for="email">Email address</label>
								<input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email">
							</div>
							<div class="form-group">
								<label for="password">Password</label>
								<input type="password" class="form-control" id="password" placeholder="Password">
							</div>
							<button type="submit" class="btn btn-primary">Login</button>
						</form>
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

</style>
