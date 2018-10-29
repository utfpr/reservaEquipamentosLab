<template>
      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <div class="card border-secondary mb-3">
              <div class="card-header text-center"><h1>Resumo do dia</h1></div>
              <div class="card-body  justify-content-center">
                <div class="row" style="min-height: 8rem;">
                  <div class="col-sm-12 col-md-6 d-flex justify-content-center justify-content-sm-center justify-content-md-end">
                    <div class="card text-white bg-primary mb-3 text-center vertical-center" style="max-width: 5rem; min-width: 5rem; max-height:5rem; min-height:5rem">
                      <div class="card-header" style="padding:0;">{{ month }}</div>
                      <div class="card-body" style="padding:0;">
                        <h3>{{ day }}</h3>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6 d-flex justify-content-center justify-content-sm-center justify-content-md-start">
                    <h3 class="card-title text-sm-center text-md-left vertical-center">
                      <span style="font-size: 1.5rem;">
                        <i class="far fa-clock"></i>
                      </span> {{ time }}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="card border-primary mb-3">
              <div class="card-header text-center">
                <h3><router-link to="/equipamento" class="text-dark">Equipamentos</router-link></h3>
              </div>
              <div class="card-body text-primary">
                <h5 class="card-title">Quebrados: <span class="text-dark">{{ equipamentosQuebradosLength }}</span></h5>
                <br>
                <h5 class="card-title">Em Manutenção: <span class="text-dark">{{ equipamentosManutencaoLength }}</span></h5>
                <br>
                <h5 class="card-title">Reservas confirmadas: <span class="text-dark">{{ reservasEquipConfirmadasLength }}</span> </h5>
                <br>
                <h5 class="card-title">Reservas pendentes: <span class="text-dark">{{ reservasEquipPendentesLength }}</span></h5>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card border-primary mb-3">
              <div class="card-header text-center">
                <h3><router-link to="/equipamento" class="text-dark">Locais</router-link></h3>
              </div>
              <div class="card-body text-primary">
                <h5 class="card-title">Reservas confirmadas: <span class="text-dark">{{ reservasLocalConfirmadasLength }}</span></h5>
                <br>
                <h5 class="card-title">Reservas pendentes: <span class="text-dark">{{ reservasLocalConfirmadasLength }}</span></h5>
              </div>
            </div>
          </div>
        </div>
      </div>
</template>

<script>
export default {
  name: 'ResumoSupervisor',
  props: {
    month: {type: String, default: 'Jan', required: true},
    day: {type: Number, default: 1, required: true},
    time: {type: Number, default: 2018, required: true},
    reservasEquipConfirmadasLength: {type: Number, default: 0, required: true},
    reservasEquipPendentesLength: {type: Number, default: 0, required: true},
    equipamentosQuebradosLength: {type: Number, default: 0, required: true},
    equipamentosManutencaoLength: {type: Number, default: 0, required: true},
    reservasLocalConfirmadasLength: {type: Number, default: 0, required: true},
    reservasLocalPendentesLength: {type: Number, default: 0, required: true}
  }
}
</script>
