<template>
  <vue-event-calendar :events="demoEvents"></vue-event-calendar>
</template>

<script>
export default {
  data () {
    return {
      demoEvents: [{
        date: '2018/06/12', // Required
        title: 'Foo' // Required
      },
      {
        date: '2018/06/12', // Required
        title: 'Foo2' // Required
      }, {
        date: '2018/06/15',
        title: 'Bar',
        desc: 'teste',
        customClass: 'disabled highlight' // Custom classes to an calendar cell
      }]
    }
  }
}
</script>
