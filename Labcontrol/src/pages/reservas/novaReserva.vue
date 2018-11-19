<template>
  <a-row>
    <a-steps size = "small" :current = "current">
      <a-step title = "Item" />
      <a-step title = "Período" />
      <a-step title = "Conclusão" />
    </a-steps>
    
    <a-row style = "margin-top: 30px;">
      <router-view />
    </a-row>
  </a-row>
</template>

<script>
  export default {
    name: 'novaReserva',
    data () {
      return {
        current: 0
      }
    },
    methods: {
      voltar () {
        this.$router.go(-1)
        this.current = this.current === 0 ? 0 : this.current - 1
      }
    }
  }
</script>

