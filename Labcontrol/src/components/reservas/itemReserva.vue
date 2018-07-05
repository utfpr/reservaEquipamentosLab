<template>
<div>
  <div class="row my-4 justify-content-center text-center">
    <div class="col-12 text-center">
      <h4> O que você deseja reservar? </h4>
    </div>
    <div class="col-12 text-center">
      <div class="btn-group" role="group" aria-label="Item de reserva">
        <router-link id="btnEquip" to="/reservar/equipamento" class="btn btn-secondary">Um Equipamento</router-link>
        <router-link id="btnEquip" to="/reservar/laboratorio" class="btn btn-secondary">Um Laboratório</router-link>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'itemReserva',
  data () {
    return { }
  }
}
</script>

<style lang="css">
</style>
