<template>
      <div class="container">
        <!-- <div class="row">
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
        </div> -->

<!-- Parte cards -->
        <div class="row">
          <div class="col-md-6">
            <a-card title="Equipamentos">
              <h5 class="card-title">Quebrados: <span class="text-dark">{{ equipamentosQuebradosLength }}</span></h5>
              <br>
              <h5 class="card-title">Em Manutenção: <span class="text-dark">{{ equipamentosManutencaoLength }}</span></h5>
              <br>
              <h5 class="card-title">Reservas confirmadas: <span class="text-dark">{{ reservasEquipConfirmadasLength }}</span> </h5>
              <br>
              <h5 class="card-title">Reservas pendentes: <span class="text-dark">{{ reservasEquipPendentesLength }}</span></h5>
            </a-card>
          </div>

          <div class="col-md-6">
            <a-card title="Locais">
              <h5 class="card-title">Reservas confirmadas: <span class="text-dark">{{ reservasLocalConfirmadasLength }}</span></h5>
              <br>
              <h5 class="card-title">Reservas pendentes: <span class="text-dark">{{ reservasLocalConfirmadasLength }}</span></h5>
            </a-card>
          </div>
        </div>

<!-- Parte tabs -->
        <br/>
        <div>
          <a-carousel arrows>
            <div
              slot="prevArrow" slot-scope="props"
              class="custom-slick-arrow"
              style="left: 10px;zIndex: 1"
            >
              <a-icon type="left-circle" />
            </div>
            <div
              slot="nextArrow" slot-scope="props"
              class="custom-slick-arrow"
              style="right: 10px"
            >
              <a-icon type="right-circle" />
            </div>
            
            <div>
              <h3> {{ diaResumo }} </h3>

              <ul>
                <li> ccc </li>
                <li v-for="reserva in reservas"> {{reserva}} </li>
              </ul>
            </div>
          </a-carousel>
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
    reservasLocalPendentesLength: {type: Number, default: 0, required: true},
    reservas: {type: Array, default: 'Não há reservas para este dia.', required: true},
    diaResumo: {type: Date, default: '2018-11-11', required: true}
  },
  data () {
    return {
    }
  },
  methods: {
    callback (key) {
      console.log(key)
    }
  }
}
</script>
<style scoped>
/* For demo */
.ant-carousel >>> .slick-slide {
  text-align: center;
  background: #364d79;
  overflow: hidden;
}

.ant-carousel >>> .custom-slick-arrow {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31,45,61,.11);
  opacity: 0.3;
}
.ant-carousel >>> .custom-slick-arrow:before {
  display: none;
}
.ant-carousel >>> .custom-slick-arrow:hover {
  opacity: 0.5;
}

.ant-carousel >>> .slick-slide  h3 {
  color: #fff;
}
</style>
<style>
.ant-card-bordered {
  border: 2px solid #1890ff;
}
.ant-card-head {
  font-size: 24px;
  background: #f7f7f7;
  border-bottom: 1px solid #1890ff;
}
.ant-card-head-title {
  font-size: 24px;
  text-align: center;
}

</style>
>