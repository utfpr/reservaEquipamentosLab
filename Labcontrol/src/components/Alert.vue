<template>
  <div id="alert" class="alert alert-dismissible fade show" :class="type" role="alert" :style="{display: showAlert ? 'block' : 'none'}">
    <strong>{{ title }}</strong> {{ msg }}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close" :style="{display: dismissible ? 'block' : 'none'}">
      <span aria-hidden="false">&times;</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'Alert',
  props: {
    showAlert: {type: Boolean, default: true, required: false},
    dismissible: {type: Boolean, default: false, required: false},
    type: {type: String, required: true},
    title: {type: String, default: '', required: false},
    msg: {type: String, required: true}
  }
}
</script>

<style>
</style>
