<template>
      <div class="container">
<!-- Parte cards -->
        <div class="row">
          <div class="col-md-6">
            <a-card title="Equipamentos">
              <h5 class="card-title">Quebrados: <span class="text-dark">{{ equipamentosQuebradosLength }}</span></h5>
              
              <h5 class="card-title">Em Manutenção: <span class="text-dark">{{ equipamentosManutencaoLength }}</span></h5>
              
              <h5 class="card-title">Reservas confirmadas: <span class="text-dark">{{ reservasEquipConfirmadasLength }}</span> </h5>
              
              <h5 class="card-title">Reservas pendentes: <span class="text-dark">{{ reservasEquipPendentesLength }}</span></h5>
            </a-card>
          </div>

          <div class="col-md-6">
            <a-card title="Locais">
              <h5 class="card-title">Reservas confirmadas: <span class="text-dark">{{ reservasLocalConfirmadasLength }}</span></h5>
              
              <h5 class="card-title">Reservas pendentes: <span class="text-dark">{{ reservasLocalConfirmadasLength }}</span></h5>
              <br><br><br>
            </a-card>
          </div>
        </div>

<!-- Parte tabs -->
        <br/>
        <div>
          <a-row>
            <a-col :span = "4" style="text-align: center;">
              <a-button size = "large" icon = "left" style = "margin-top: 8px;"></a-button>
            </a-col>

            <a-col :span = "16" style="text-align: center;">
              <h3> Agendados  para  {{ diaResumo.date() }}/{{ diaResumo.month() }}/{{ diaResumo.year() }} </h3>
            </a-col>

            <a-col :span = "4" style="text-align: center;">
              <h3><a-icon type = "right" /></h3>
            </a-col>
          </a-row>
          
            
<!-- ++++++++++++++++++++++++++ -->

            <a-list
              itemLayout="horizontal"
              :dataSource="reservas"
            >
              <a-list-item slot="renderItem" slot-scope="item, index">
                <a-list-item-meta>
                  <span slot="title" >{{item[0]}}</span>
                  <span slot="description" > Início: {{item[1].Inicio}} - Fim: {{item[1].Fim}} - Solicitante: {{item[2].Nome}} {{item[2].Sobrenome}} </span>
                  <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                </a-list-item-meta>
              </a-list-item>
            </a-list>
            
           <!-- <div>
              
              <br/>

                <div v-for="reserva in reservas">
                  <h5></h5>
                </div>

            </div> -->
            <!-- <div></div> -->

        </div>



      </div>
</template>

<script>
var moment = require('moment')
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
    diaResumo: {type: Object, default: '2018-11-11', required: true}
  },
  data () {
    return {
      // diaResumo: '2018-11-11'
    }
  },
  methods: {
    callback (key) {
      this.diaResumo = moment(this.diaResumo)
    }
  }
}
</script>
<style scoped>
/* For demo */
.ant-carousel >>> .slick-slide {
  text-align: center;
  background: #f7f7f7;
  overflow: hidden;
  padding-top: 20px;
  padding-bottom: 20px;
}

.ant-carousel >>> .custom-slick-arrow {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #000;
  background-color: #f7f7f7;
  opacity: 0.3;
}
.ant-carousel >>> .custom-slick-arrow:before {
  display: none;
}
.ant-carousel >>> .custom-slick-arrow:hover {
  opacity: 0.5;
}

.ant-carousel >>> .slick-slide  h3 {
  color: #000;
}
</style>
<style>
.ant-card {
  border-bottom: 1px solid rgb(232, 232, 232);
  border-top: 1px solid rgb(232, 232, 232);
}
.ant-card-head {
  font-size: 24px;
  border-bottom: 1px solid rgb(232, 232, 232);
}
.ant-card-head-title {
  font-size: 24px;
  text-align: center;
}

</style>
>