<template>
  <a-spin :spinning = "loading">
    <a-row style = "margin-bottom: 30px;">
      <a-col :span = "16" :offset = "4" style = "text-align: center">
        <h1> Aulas </h1>
      </a-col>
        
      <a-col :span = "4">
        <router-link to = "/agendamento">  
          <a-button type = "primary" v-if = "role === 'admin' || role === 'Supervisor'" size = "large" icon = "plus" style = "width: 100%; margin-top: 8px;"> Novo Agendamento</a-button>
        </router-link>    
      </a-col>
    </a-row>

    <a-table :dataSource = "aulas" :columns = "columns" :locale = "{ filterConfirm: 'Ok', filterReset: 'Resetar', emptyText: 'Nenhuma Aula Agendada' }">
      <span slot = "diaSemana" slot-scope = "text, record">
        <span> {{ $moment().day(record.diaSemana).format("dddd") }} </span>
      </span>
      <span slot = "horas" slot-scope = "text, record">
        <span> {{ record.horaInicio }} Até {{ record.horaFim }} </span>
      </span>
    </a-table>  
  </a-spin>    
</template>

<script>
  import firebaseApp from '../../firebase-controller.js'

  const auth = firebaseApp.auth()
  const db = firebaseApp.database()

  export default {
    data () {
      return {
        usuarios: [],
        role: null,
        loading: true,
        aulas: [],
        columns: [{
          title: 'Data Inicio',
          dataIndex: 'inicio',
          key: 'periodInicial'
        }, {
          title: 'Data Fim',
          dataIndex: 'fim',
          key: 'periodfinal'
        }, {
          title: 'Dia da semana',
          dataIndex: 'diaSemana',
          key: 'diaSemana',
          scopedSlots: { customRender: 'diaSemana' }
        }, {
          title: 'Horario',
          dataIndex: ['horaFim', 'horaInicio'],
          key: 'horas',
          scopedSlots: { customRender: 'horas' }
        }, {
          title: 'solicitante',
          dataIndex: 'solicitante',
          key: 'solicitante'
        }, {
          title: 'Local',
          dataIndex: 'local',
          key: 'local'
        }]
      }
    },
    beforeMount: function () {
      let _this = this
      _this.loading = true

      db.ref('Usuarios/' + auth.currentUser.uid + '/role').on('value', function (snapshot) {
        _this.loading = true
        _this.role = snapshot.val()
        _this.loading = false
      })

      db.ref('Usuarios').orderByKey().on('value', function (snapshot) {
        _this.loading = true
        snapshot.forEach(function (item) {
          _this.usuarios.push({
            'key': item.key,
            'curso': item.val().Curso,
            'email': item.val().Email,
            'nome': item.val().Nome,
            'RA': item.val().RA,
            'sobrenome': item.val().Sobrenome,
            'role': item.val().role
          })
        })
        _this.loading = false
      })
      db.ref('Reservas/aulas').orderByKey().on('value', function (snapshot) {
        _this.loading = true
        _this.equipamentos = []

        snapshot.forEach(function (item) {
          var solicitante
          var val = _this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)
          if (val === -1) {
            solicitante = 'Error'
          } else {
            solicitante = _this.usuarios[_this.usuarios.map(function (e) { return e.key }).indexOf(item.val().Solicitante)].nome
          }
          _this.aulas.push({
            'id': item.key,
            'fim': item.val().Fim,
            'inicio': item.val().Inicio,
            'local': item.val().Local,
            'solicitante': solicitante,
            'diaSemana': item.val().diaSemana,
            'horaFim': item.val().horaFim,
            'horaInicio': item.val().horaInicio
          })
        })
        _this.loading = false
      })
    }
  }
</script>    