<template>
      <div class="container">
        <a-row>  
          <a-col :span="12" type="flex" justify="space-around" align="middle">
            <h1 align="center" >Calendar</h1>
            <br/>
            <div :style="{ width: '300px', border: '1px solid #d9d9d9', borderRadius: '4px' }">
              <a-calendar :fullscreen="false" @panelChange="onPanelChange" align = "middle" class="calendar"/>
            </div>
          </a-col>
          <a-col :span="12">
            col-12
          </a-col>
      </a-row>
      </div>
</template>

<script>
export default {
  name: 'ResumoComum',
  props: {
    month: {type: String, default: 'Jan', required: true}
  },
  methods: {
    onPanelChange (value, mode) {
    }
  }
}
</script>
<style>

</style>
