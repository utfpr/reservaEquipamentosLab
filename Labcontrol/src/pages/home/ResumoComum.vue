<template>
      <div class="container">
        <a-row>  
          <a-col :span="8" type = "flex" justify = "space-around" align = "middle">
            <h1 align="center" >Calendar</h1>
            <br/>
            <div :style="{ width: '300px', border: '1px solid #d9d9d9', borderRadius: '4px' }">
              {{ month }}
              <a-calendar :fullscreen="false" @panelChange="onPanelChange" align = "middle" class="calendar"/>
            </div>
          </a-col>
          <a-col :span="16" type="flex" justify = "space-around" align = "middle">
            <a-col :span="16" :offset="6">
              <a-tabs @change="callback" type="card">
                <a-tab-pane tab="Reservas de Equipamentos" key="1">
                  <h3>Reservas de Equipamentos</h3>
                  <a-list size="small" bordered :dataSource="reservasUser">
                    <a-list-item slot="renderItem" slot-scope="item, index">{{item}}</a-list-item>
                    <div slot="header">Header</div>
                    <div slot="footer">Footer</div>
                  </a-list>
                </a-tab-pane>
                <a-tab-pane tab="Reservas de Locais" key="2">
                  <h3>Reservas de Locais</h3>
                  <a-list size="small" bordered :dataSource="reservasUser">
                    <a-list-item slot="renderItem" slot-scope="item, index">{{item}}</a-list-item>
                    <div slot="header">Header</div>
                    <div slot="footer">Footer</div>
                  </a-list>
                </a-tab-pane>
                <a-tab-pane tab="Minhas reservas" key="3">
                  <h3>Minhas reservas</h3>
                  <a-list size="small" bordered :dataSource="reservasUser">
                    <a-list-item slot="renderItem" slot-scope="item, index">{{item}}</a-list-item>
                    <div slot="header">Header</div>
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
// import {Icon} from 'antd'
export default {
  constructor () {
    this.state = {
      data: moment().hours(0).minutes(0).seconds(0).milliseconds(0)
    }
  },
  name: 'ResumoComum',
  props: {
    month: { type: String, default: 'Jan', required: true },
    reservasUser: { type: Array }
  },
  methods: {
    onPanelChange (value) {
      var data
      if (value === 'backward') {
        data = moment(this.state.data).subtract(1, 'M')
      } else {
        data = moment(this.state.data).add(1, 'M')
      }
      this.setState({ data })
    },
    callback (key) {
      console.log(key + this.reservasUser)
    }
  }
}
</script>
<style>
  .ant-select-selection--single{
    display:none;
  }
  .ant-radio-group{
    display:none;
  }
</style>
