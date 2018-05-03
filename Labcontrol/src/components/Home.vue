<template>
  <div id="home">
	  <div class="container">
      <h2>CONTEÚDO AQUI</h2>
	  </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return { }
  },
  created: function () {
    let wrapper = document.getElementById('wrapper')
    wrapper.classList.add('toggled')
    this.$root.toggled = true
  }
}
</script>
