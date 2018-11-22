<template>
  <div class="container">
    <a-row style = "margin-bottom: 30px;">
      <a-col :span = "16" :offset = "4" style = "text-align: center">
        <h1> Agendamento de Aulas </h1>
      </a-col>
    </a-row>  
    <div class="row" style = "margin-top: 20px;">
      <div class="col-md-1 offset-2">
        Início:
      </div>
      <div class="col-md-3">
        <a-date-picker
          :disabledDate="disabledStartDate"
          format="DD/MM/YYYY"
          v-model="startValue"
          placeholder="Selecionar"
          @openChange="handleStartOpenChange"
        />
      </div>
      <div class="col-md-1">
        Fim:
      </div>
      <div class="col-md-3">
        <a-date-picker
          :disabledDate="disabledEndDate"
          format="DD/MM/YYYY"
          placeholder="Selecionar"
          v-model="endValue"
          :open="endOpen"
          @openChange="handleEndOpenChange"
        />
      </div>
    </div>
    
    <hr>

    <div class = "row">
      <div class="col-12 col-md-12 text-center">
        <a-button type = "primary" v-if = "role === 'admin' || role === 'Supervisor'" @click = "showAulaModal()" size = "large" icon = "plus" style = "width: 100%; margin-top: 8px;"> Novo </a-button>
      </div>
    </div>

    <a-table :dataSource = "agendamentos" :columns = "columns" :locale = "{ emptyText: 'Nenhum agendamento cadastrado' }">
      <span slot="horas" slot-scope="text, record">
        <span>{{record.horaInicio}} Até {{record.horaFim}}</span>
      </span>

      <span slot="dia" slot-scope="text, record">
        <span>{{$moment().day(record.dia).format("dddd")}}</span>
      </span>

      <span slot = "actions" slot-scope = "text">
        <a-tooltip v-if = "role === 'admin' || role === 'Supervisor'" placement = "top">
          <template slot = "title">
            <span> Deletar agendamento </span>
          </template>

          <a-tag @click = "deleta(agendamento)" color = "red" :key = "text" >
            <a-icon type = "delete" />
          </a-tag>
        </a-tooltip>
      </span>    
    </a-table>  


    <div class = "row" v-if="agendamentos.length !== 0">
      <div class = "col-md-2 offset-8">
        <router-link :to="{ name: 'Home', params: {}}" class="btn btn-secondary btn-block" v-on:click="autocompleteHide()" > Voltar</router-link>
      </div>

      <div class = "col-md-2">
        <span class="btn btn-primary btn-block" v-on:click="submit()"> Confirmar </span>
      </div>
    </div>

    <a-modal
      
      :visible = "visibleAulaModal"
      :footer = "null"
      @cancel = "closeAulaModal()"
      style = "padding: 32px 32px 32px; top: 20px;"
      @ok= "adiciona()"
      >
      <div slot = "title">
        <h5> <b> Novo Agendamento </b> </h5>
      </div>
      <a-form layout = "vertical" :autoFormCreate = "(form) => { this.form = form }">
        <a-row :gutter = "16">
            <a-col :span = "24">
              <a-form-item label = "Dia da semana" fieldDecoratorId = "dia" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Selecione o dia da semana' }] }">
                <a-select size = "large" placeholder = "Dia da semana"  showSearch notFoundContent = "Status não Encontrado" :filterOption = "filterOption">
                  <a-select-option value = "1"> Segunda-Feira </a-select-option>
                  <a-select-option value = "2"> Terça-Feira </a-select-option>
                  <a-select-option value = "3"> Quarta-Feira </a-select-option>
                  <a-select-option value = "4"> Quinta-Feira</a-select-option>
                  <a-select-option value = "5"> Sexta-Feira</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
        </a-row>
        <a-row :gutter = "16">
            <a-col :span = "12">
              <a-form-item label = "Hora Inicio" fieldDecoratorId = "horaI" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Selecione a hora de inicio da aula' }] }">
                  <a-time-picker 
                    v-model="horaI" 
                    format= 'HH:mm'
                    placeholder= "Inicio"
                    :disabledHours="horasDesativadas"
                    :minuteStep="5"
                    hideDisabledOptions
                />
              </a-form-item>  
            </a-col>
            <a-col :span = "12">
            <a-form-item label = "Hora Inicio" fieldDecoratorId = "horaF" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Selecione a hora do fim da aula' }] }">
                  <a-time-picker 
                    v-model="horaF" 
                    format= 'HH:mm'
                    placeholder= "Fim"
                    :disabledHours="horasDesativadas"
                    :minuteStep="5"
                    hideDisabledOptions
                />
            </a-form-item>
            </a-col>
        </a-row>
        <a-row :gutter = "16">
            <a-col :span = "24">
              <a-form-item label = "Local" fieldDecoratorId = "local" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Selecione o Local' }] }">
                <a-select size = "large" placeholder = "Locais"  showSearch notFoundContent = "Status não Encontrado" :filterOption = "filterOption">
                  <a-select-option v-for = "local in locais" v-bind:key = "local" :value = "local.nome">  {{local.nome}} </a-select-option>
                  
                </a-select>
              </a-form-item>
            </a-col>
        </a-row>      
        <a-row style = "text-align: right; margin-bottom: 5px;">
          <a-button size = "large" @click = "closeAulaModal" style = "margin-right: 15px;"> Cancelar </a-button>
          <a-button size = "large" type = "primary" @click = "adiciona"> Cadastrar </a-button>
        </a-row>  
      </a-form>      
        
    </a-modal>
  </div>
</template>
 
<script>
  import datePicker from 'vue-bootstrap-datetimepicker'
  import firebaseApp from '../../firebase-controller.js'

  const db = firebaseApp.database()
  const auth = firebaseApp.auth()

  export default {
    data () {
      return {
        role: null,
        startValue: null,
        endValue: null,
        endOpen: false,
        locais: [],
        agendamentos: [],
        horaI: null,
        horaF: null,
        visibleAulaModal: false,
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
        },
        columns: [{
          title: 'Dia da Semana',
          dataIndex: 'dia',
          key: 'dia',
          scopedSlots: { customRender: 'dia' }
        }, {
          title: 'Local',
          dataIndex: 'local',
          key: 'local'
        }, {
          title: 'Hora Rerservada',
          dataIndex: ['horaInicio', 'horaFim'],
          key: 'horas',
          scopedSlots: { customRender: 'horas' }
        }, {
          title: 'Ações',
          key: 'acoes',
          align: 'center',
          scopedSlots: { customRender: 'actions' }
        }
        ]
      }
    },
    components: {
      datePicker
    },
    watch: {
      startValue (val) {
        console.log('startValue', val)
      },
      endValue (val) {
        console.log('endValue', val)
      }
    },
    beforeMount: function () {
      let _this = this
      db.ref('Usuarios/' + auth.currentUser.uid + '/role').on('value', function (snapshot) {
        _this.role = snapshot.val()
      })
      db.ref('Locais').orderByKey().on('value', function (snapshot) {
        _this.loading = true
        _this.locais = []

        snapshot.forEach(function (item) {
          _this.locais.push({
            'nome': item.key
          })
        })
        _this.loading = false
      })
    },
    methods: {
      horasDesativadas (current) {
        return [0, 1, 2, 3, 4, 5, 6, 23]
      },
      periodoFormatado (inicio, fim) {
        return this.$moment(new Date(inicio)).format('[Das] HH:mm [até] ') + this.$moment(new Date(fim)).format(' HH:mm')
      },
      disabledStartDate (startValue) {
        const endValue = this.endValue
        if (!startValue || !endValue) {
          return startValue && startValue < this.$moment().startOf('day')
        }
        return startValue.valueOf() > endValue.valueOf() || startValue < this.$moment().startOf('day')
      },
      disabledEndDate (endValue) {
        const startValue = this.startValue
        if (!endValue || !startValue) {
          return endValue && endValue < this.$moment().startOf('day')
        }
        return startValue.valueOf() >= endValue.valueOf() || startValue < this.$moment().startOf('day')
      },
      handleStartOpenChange (open) {
        if (!open) {
          this.endOpen = true
        }
      },
      handleEndOpenChange (open) {
        this.endOpen = open
      },
      showAulaModal () {
        this.visibleAulaModal = true
      },
      closeAulaModal () {
        this.visibleAulaModal = false
      },
      adiciona () {
        let _this = this
        var agendamento = []
        this.form.validateFields(async (err, values) => {
          if (!err) {
            agendamento.dia = values.dia
            agendamento.local = values.local
            agendamento.horaInicio = this.$moment(new Date(_this.horaI)).format(' HH:mm')
            agendamento.horaFim = this.$moment(new Date(_this.horaF)).format(' HH:mm')
            _this.agendamentos.push(agendamento)
            this.closeAulaModal()
            _this.$notify({
              group: 'notify',
              type: 'success',
              title: 'Yey!',
              text: 'Agendamento inserido na lista com sucesso'
            })
          }
        })
      },
      deleta (agendamento) {
        this.agendamentos.splice(this.agendamentos.indexOf(agendamento), 1)
      },
      submit () {
        let _this = this
        var diaInicio = this.$moment(new Date(_this.startValue)).format('DD/MM/YYYY')
        var diaFim = this.$moment(new Date(_this.endValue)).format('DD/MM/YYYY')
        _this.agendamentos.forEach(function (item) {
          console.log(diaInicio)
          console.log(diaFim)
          console.log(item.local)
          console.log(item.dia)
          console.log(item.horaInicio)
          console.log(item.horaFim)
          db.ref('Reservas/aulas').push({
            'Inicio': diaInicio,
            'Fim': diaFim,
            'Local': item.local,
            'diaSemana': item.dia,
            'horaInicio': item.horaInicio,
            'horaFim': item.horaFim
          }).then(() => {
            _this.$notification.success({
              message: 'Yey!..',
              description: 'Reserva solicitada com sucesso.'
            }, 1500)
            this.$router.push('/reservas')
          }).catch((err) => {
            _this.$notification.error({
              message: 'Opps..',
              description: 'Reserva não realizada. Erro: ' + err
            }, 1500)
          })
        })
      }
    }
  }
</script> 