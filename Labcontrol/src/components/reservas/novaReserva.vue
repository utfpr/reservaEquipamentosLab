<template>
  <div id="cadastroReservation">
    <div class="container-fluid">
      <div class="row justify-content-center text-center">
        <h2> Nova Reserva </h2>
      </div>
      <div id="step-progress" class="row">
        <step-progress :steps="steps" :current-step="currentStep"></step-progress>
      </div>
      <hr style="margin-top:5%" />
      <div>
        <!-- <keep-alive> -->
          <router-view />
        <!-- </keep-alive> -->
      </div>
    </div>
  </div>
</template>

<script>
import StepProgress from 'vue-step-progress'
export default {
  name: 'novaReserva',
  data () {
    return {
      itemReserva: 'Equipamento',
      steps: ['Objeto de reserva', 'Item a ser reservado', 'Período da reserva', 'Confirmação dos dados'],
      currentStep: 0
    }
  },
  components: {
    'step-progress': StepProgress
  },
  methods: {
    voltar () {
      this.$router.go(-1)
      this.currentStep = this.currentStep === 0 ? 0 : this.currentStep - 1
    }
  }
}
</script>
<style>

#cadastroFormReservation {
  width: 100vw;
}

#step-progress .step-progress-bar {
    width: 100%;
    display: flex;
    height: 100px;
    justify-content: space-between;
    align-items: center;
  margin-bottom: 0px !important;
}

#step-progress .step-progress-step.valid span {
    color: white;
    transform: translate3d(0, 0, 0) scale(1) perspective(1000px);
}

#step-progress .step-progress-step.valid:after {
    background-color: #007bff;
    border: 5px solid #007bff;
}

#step-progress .step-progress-step.valid .step-progress-step-label {
    color: #007bff;
}

#step-progress .step-progress-wrapper-after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    height: 12px;
    width: 100%;
    background-color: #007bff;
    transform: scaleX(0) translateY(-50%) perspective(1000px);
    transform-origin: left center;
    transition: transform .5s ease;
}

#step-progress .step-progress-step.active:after {
    border: 5px solid #007bff;
}

#step-progress .step-progress-step.active .step-progress-step-label {
    color: #007bff;
}

#step-progress .step-progress-step.active span {
    color: #007bff;
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1.2) perspective(1000px);
}

@media (max-width: 1279px) {
  #step-progress .step-progress-step .step-progress-step-label {
    display: none;
  }
}
</style>
