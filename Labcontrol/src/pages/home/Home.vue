<template>
  <resumo-supervisor v-if = "role === 'Supervisor' || role === 'admin'" />
  <resumo-comum v-else-if = "role === 'Comum'" />
</template>

<script>
  import ResumoSupervisor from './ResumoSupervisor.vue'
  import ResumoComum from './ResumoComum.vue'

  import firebaseApp from '../../firebase-controller.js'

  const db = firebaseApp.database()
  const auth = firebaseApp.auth()

  export default {
    data () {
      return {
        role: null
      }
    },
    components: {
      ResumoSupervisor,
      ResumoComum
    },
    beforeMount: function () {
      var _this = this

      db.ref('Usuarios/' + auth.currentUser.uid + '/role').on('value', function (snapshot) {
        _this.role = snapshot.val()
      })
    }
  }
</script>
