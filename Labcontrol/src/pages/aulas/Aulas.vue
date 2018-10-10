<template>
<<<<<<< HEAD
  <div id="Aulas">

  </div>
</template>
=======
  <div class="container">
    <div class="row" style = "margin-top: 20px;">
      <div class="col-md-1 offset-2">
        Início:
      </div>
      <div class="col-md-3">
        <date-picker v-model="dateInicio" :config="optionsInicio"></date-picker>
      </div>
      <div class="col-md-1">
        Fim:
      </div>
      <div class="col-md-3">
        <date-picker v-model="dateFim" :config="optionsFim"></date-picker>
      </div>
    </div>

    <hr>

    <div class = "row">
      <div class="col-12 col-md-12 text-center">
        <button type="button" class="btn btn-primary btn-lg col-md-12" data-toggle="modal" data-target="#exampleModal"> + </button>
      </div>
    </div>

    <div class = "row" style = "margin: 40px 0">
      <h4 v-if="agendamentos.length === 0" class=" text-center mt-5"> Nenhum agendamento cadastrado </h4>
      <table v-else class="table table-responsive-md table-hover text-center">
        <thead>
          <tr>
            <th scope="col"><span>Dia da Semana</span></th>
            <th scope="col"><span>Local</span></th>
            <th scope="col"><span>Hora Reservada</span></th>
            <th scope="col">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="agendamento in agendamentos">
            <td> {{ agendamento.dia }} </td>
            <td> {{ agendamento.local }} </td>
            <td> {{ periodoFormatado(agendamento.horaInicio, agendamento.horaFim) }} </td>
            <td>
              <ul class="list-inline d-inline-flex">
                <li>
                  <span class="list-inline-item btn btn-danger btn-sm" v-on:click="deleta(agendamento)"> Deletar </span>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class = "row" v-if="agendamentos.length !== 0">
      <div class = "col-md-2 offset-8">
        <router-link :to="{ name: 'Home', params: {}}" class="btn btn-secondary btn-block" v-on:click="autocompleteHide()" > Voltar</router-link>
      </div>

      <div class = "col-md-2">
        <span class="btn btn-primary btn-block" v-on:click="submit()"> Confirmar </span>
      </div>
    </div>

    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Novo Agendamento</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class = "row" style = "margin-bottom: 20px;">
              <div class = "col-md-2 offset-2"> Dia: </div>
              <div class = "col-md-6">
                <select class="form-control" id = "dia">
                  <option>Segunda-Feira</option>
                  <option>Terça-Feira</option>
                  <option>Quarta-Feira</option>
                  <option>Quinta-Feira</option>
                  <option>Sexta-Feira</option>
                </select>
              </div>
            </div>
            <div class = "row" style = "margin-bottom: 20px;">
              <div class = "col-md-2 offset-2"> Local: </div>
              <div class = "col-md-6">
                <select class = "form-control" id = "local">
                  <option v-for="local in locais"> {{local[0]}} </option>
                </select>
              </div> 
            </div>
            <div class = "row" style = "margin-bottom: 20px;">
              <div class = "col-md-2 offset-2"> Hora: </div>
              <div class = "col-md-3">
                <date-picker v-model="horaInicio" :config="optionsHora"></date-picker>
              </div>
              <div class = "col-md-3">
                <date-picker v-model="horaFim" :config="optionsHora"></date-picker>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button id = "fechaModal" type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" v-on:click="adiciona()">Adicionar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
  import datePicker from 'vue-bootstrap-datetimepicker'
  import firebaseApp from '../../firebase-controller.js'
  const db = firebaseApp.database()
  export default {
    data () {
      return {
        locais: [],
        agendamentos: [],
        dateInicio: new Date(),
        dateFim: new Date(),
        horaInicio: new Date(new Date(new Date().setHours(7)).setMinutes(30)),
        horaFim: new Date(new Date(new Date().setHours(22)).setMinutes(59)),
        optionsHora: {
          format: 'HH:mm',
          locale: 'pt-br',
          disabledHours: [0, 1, 2, 3, 4, 5, 6, 23],
          useCurrent: false
        },
        optionsInicio: {
          format: 'DD/MM/YYYY',
          locale: 'pt-br',
          minDate: new Date(new Date().setDate(new Date().getDate() - 1)),
          useCurrent: false
        },
        optionsFim: {
          format: 'DD/MM/YYYY',
          locale: 'pt-br',
          minDate: new Date(new Date().setDate(new Date().getDate() - 1)),
          useCurrent: false
        }
      }
    },
    components: {
      datePicker
    },
    mounted: function () {
      let _this = this
      db.ref('Locais').orderByKey().on('value', function (snapshot) {
        _this.locais = []
        snapshot.forEach(function (childSnapshot) {
          _this.locais.push([childSnapshot.key, childSnapshot.val()])
        })
      })
    },
    methods: {
      periodoFormatado (inicio, fim) {
        return this.$moment(new Date(inicio)).format('[Das] HH:mm [até] ') + this.$moment(new Date(fim)).format(' HH:mm')
      },
      adiciona () {
        let _this = this
        var agendamento = []

        let selectDia = document.getElementById('dia')
        let selectLocal = document.getElementById('local')

        let dia = selectDia.options[selectDia.selectedIndex].text
        let local = selectLocal.options[selectLocal.selectedIndex].text

        agendamento.dia = dia
        agendamento.local = local
        agendamento.horaInicio = _this.horaInicio
        agendamento.horaFim = _this.horaFim

        _this.agendamentos.push(agendamento)

        _this.$notify({
          group: 'notify',
          type: 'success',
          title: 'Yey!',
          text: 'Agendamento inserido na lista com sucesso'
        })
        document.getElementById('fechaModal').click()
        console.log(_this.agendamentos)
      },
      deleta (agendamento) {
        this.agendamentos.splice(this.agendamentos.indexOf(agendamento), 1)
      },
      submit () {
        let _this = this

        if (this.$moment(_this.dateInicio) >= this.$moment(_this.dateFim)) {
          this.$notify({
            group: 'notify',
            type: 'error',
            title: 'Oops!',
            text: 'Selecione um período válido!',
            duration: 10000
          })
        }
      }
    }
  }
</script> 
>>>>>>> 76a004382e9b76cd2303f672c4e49c436c6b072d
