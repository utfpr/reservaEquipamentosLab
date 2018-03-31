<template>
  <div class="home">
	  <div class="container">
      <h2>CONTEÚDO AQUI</h2>
      <div id="loading">
        <pulse-loader :loading="loading" :color="color" :size="size"></pulse-loader>
      </div>
	  </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      loading: true,
      color: '#5dc596',
      size: '30px'

    }
  },
  methods: {

  }
}
</script>
