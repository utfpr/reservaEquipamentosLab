<template>
      <div class="container">
        <a-row>  
          <a-col :span="8" type = "flex" justify = "space-around" align = "middle">
            <h1 align="center" >Calendar</h1>
            <br/>
            <div :style="{ width: '300px', border: '1px solid #d9d9d9', borderRadius: '4px' }">
              <a-row> 
                <a-col :span="6" type = "flex" justify = "space-around" align = "middle"> 
                  <a-icon 
                    class = "iterativeIcons"
                    type = "left"
                    theme = "outlined"
                    v-on:click= "onChangePanel('backward')"
                  />
                </a-col>
                <a-col :span="12" type = "flex" justify = "space-around" align = "middle"> 
                  {{this.data}}
                </a-col>
                <a-col :span="6" type = "flex" justify = "space-around" align = "middle"> 
                  <a-icon 
                    class = "iterativeIcons"
                    type = "right"
                    theme = "outlined"
                    v-on:click= "onChangePanel('forward')"
                  />
                </a-col>
              </a-row>
                <div :style="{ width: '300px', border: '1px solid #d9d9d9', borderRadius: '4px' }">
                  <a-calendar :fullscreen="false" @select="onPanelChange" />
                </div>
            </div>
          </a-col>
          <a-col :span="16" type="flex" justify = "space-around" align = "middle">
            <a-col :span="16" :offset="6">
              <a-tabs @change="callback" type="card">
                <a-tab-pane tab="Reservas de Equipamentos" key="1">
                
                  <a-list size="small" bordered :dataSource="reservasEquip">
                    <a-list-item slot="renderItem" slot-scope="item, index">{{item}}</a-list-item>
                    <h3 slot="header">Reservas de Equipamentos</h3>
                    <div slot="footer">Footer</div>
                  </a-list>
                </a-tab-pane>
                <a-tab-pane tab="Reservas de Locais" key="2">
                  <a-list size="small" bordered :dataSource="reservasLocais">
                    <a-list-item slot="renderItem" slot-scope="item, index">{{item}}</a-list-item>
                    <h3 slot="header">Reservas de Locais</h3>
                    <div slot="footer">Footer</div>
                  </a-list>
                </a-tab-pane>
                <a-tab-pane tab="Minhas reservas" key="3">
                  <a-list size="small" bordered :dataSource="reservasUser">
                    <a-list-item slot="renderItem" slot-scope="item, index">{{reservasUser}}</a-list-item>
                    <h3 slot="header">Minhas Reservas</h3>
                    <div slot="footer">Footer</div>
                  </a-list>
                </a-tab-pane>
              </a-tabs>
            </a-col>
          </a-col>
        </a-row>
      </div>
</template>
 
<script>
import moment from 'moment'
import 'moment/locale/pt-br'
import firebaseApp from '../../firebase-controller.js'
// import {Icon} from 'antd'

const db = firebaseApp.database()

export default {
  data () {
    return {
      data: moment().hours(0).minutes(0).seconds(0).milliseconds(0),
      mounth: moment().hours(0).minutes(0).seconds(0).milliseconds(0),
      equipamentos: [],
      locais: [],
      aulas: [],
      reservasEquip: [],
      reservasLocais: [],
      reservasUser: []
    }
  },
  name: 'ResumoComum',

  beforeMount: function () {
    let _this = this
    db.ref('Equipamentos').orderByKey().on('value', function (snapshot) {
      _this.equipamentos = []
      snapshot.forEach(function (item) {
        _this.equipamentos.push({
          'key': item.key,
          'patrimonio': item.val().Patrimonio,
          'nome': item.val().Nome,
          'local': item.val().Local,
          'status': item.val().Status
        })
      })
      console.log('equipamentos', _this.equipamentos)
      db.ref('Reservas/equipamentos').orderByChild('Status').equalTo('Confirmada').on('value', function (snapshot) {
        _this.reservasEquip = []
        snapshot.forEach(function (item) {
          var local
          var equipamento
          var val
          val = _this.equipamentos.map(function (e) { return e.key }).indexOf(item.val().Equipamento)
          if (val === -1) {
            local = 'Error'
          } else {
            local = _this.equipamentos[_this.equipamentos.map(function (e) { return e.key }).indexOf(item.val().Equipamento)].local
            equipamento = _this.equipamentos[_this.equipamentos.map(function (e) { return e.key }).indexOf(item.val().Equipamento)].patrimonio
          }
          _this.reservasEquip.push({
            'id': item.val().Equipamento,
            'equipamento': equipamento,
            'local': local,
            'dataInicio': item.val().Inicio,
            'dataFim': item.val().Fim,
            'status': item.val().Status
          })
        })
        console.log('banana', _this.reservasEquip)
      })
    })
  },
  methods: {

    callback (key) {
      console.log(key + this.reservasUser)
    },

    onPanelChange (value) {
      var data = value.format('DD/MM/YYYY HH:MM')
      let _this = this
      moment(data).format()
      console.log('data: ', data)
      // let _this = this'
      // console.log('estou aqui', this.state.data)
      db.ref('Reservas/equipamentos').OrderBy('Inicio').equalTo(data).on('value', function (snapshot) {
        _this.equipamentos = []
        snapshot.forEach(function (item) {
          _this.equipamentos.push({
            'Equipamento': item.val().Equipamento,
            'Inicio': item.val().Inicio,
            'Fim': item.val().Fim
          })
        })
        console.log('Este é o equipamento: ', _this.equipamentos)
      })
    }
  }

}
</script>
<style>
  .ant-row{
    margin-Top: 5%;
    margin-Bottom: 5%;

  }
  .ant-fullcalendar-header{
    display:none;
  }
  .ant-select-selection--single{
    display:none;
  }
  .ant-radio-group{
    display:none;
  }
  .iterativeIcons:hover {
    color:#1890ff;
    cursor: pointer;
  }
</style>
