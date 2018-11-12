<template>
  <a-row>
    <a-row :gutter = "16">
      <a-col :span = "23">
        <a-row v-if = "current === 0">
          <a-row style = "text-align: center; margin-bottom: 30px;">
            <a-col :span = "16" :offset = "4">
              <h2> Escolha Item de Reserva </h2>
            </a-col>

            <a-col :span = "4">
              <a-button :disabled = "!valorItem" size = "large" type = "primary" @click = "next">
                Próximo <a-icon type = "arrow-right" />
              </a-button>
            </a-col>
          </a-row>

          <a-row>
            <a-tabs @change = "onChangeTab" :activeKey = "item">
              <a-tab-pane key = "equipamentos">
                <span slot = "tab">
                  <a-icon class = "fa fa-flask" /> Equipamentos
                </span>

                <a-table :rowSelection = "rowSelectionEquipamento" :dataSource = "equipamentos" :columns = "columnsEquipamento" :locale = "{ filterConfirm: 'Ok', filterReset: 'Resetar', emptyText: 'Nenhum Equipamento Cadastrado' }">
                  <span slot = "expandedRowRender" slot-scope = "record" style = "margin: 0">
                    <p> <b> Marca: </b> {{ record.marca }} </p>
                    <p> <b> Curso: </b> {{ record.curso }} </p>
                    <p> <b> Especificação: </b> {{ record.especificacao }} </p>
                  </span>

                  <a-icon slot = "filterIcon" slot-scope = "filtered" type='search' :style = "{ color: filtered ? '#108ee9' : '#aaa' }" />

                  <div slot = "filterDropdownNomeEquipamento" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
                    <a-input
                      ref = "nomeInputEquipamento"
                      placeholder = 'Buscar nome...'
                      :value = "selectedKeys[0]"
                      @change = "e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                      @pressEnter = "() => handleSearch('searchNomeEquipamento', selectedKeys, confirm)"
                    />
                    <a-button type = 'primary' @click = "() => handleSearch('searchNomeEquipamento', selectedKeys, confirm)"> Buscar </a-button>
                    <a-button @click = "() => handleReset('searchNomeEquipamento', clearFilters)"> Resetar </a-button>
                  </div>
                  
                  <div slot = "filterDropdownPatrimonio" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
                    <a-input
                      ref = "patrimonioInput"
                      placeholder = 'Buscar patrimônio...'
                      :value = "selectedKeys[0]"
                      @change = "e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                      @pressEnter = "() => handleSearch('searchPatrimonioEquipamento', selectedKeys, confirm)"
                    />
                    <a-button type = 'primary' @click = "() => handleSearch('searchPatrimonioEquipamento', selectedKeys, confirm)"> Buscar </a-button>
                    <a-button @click = "() => handleReset('searchPatrimonioEquipamento', clearFilters)"> Resetar </a-button>
                  </div>

                  <span slot = "statusTag" slot-scope = "tag">
                    <a-tag v-if = "tag == 'Normal'" color = "green" :key = "tag"> {{tag}} </a-tag>
                    <a-tag v-if = "tag == 'Quebrado'" color = "red" :key = "tag"> {{tag}} </a-tag>
                    <a-tag v-if = "tag == 'Em Manutenção'" color = "blue" :key = "tag"> {{tag}} </a-tag>
                  </span>
                </a-table>
              </a-tab-pane>

              <a-tab-pane key = "locais">
                <span slot = "tab">
                  <a-icon class = "fa fa-map-marker-alt" /> Locais
                </span>

                <a-table :rowSelection = "rowSelectionLocal" :dataSource = "locais" :columns = "columnsLocais" :locale = "{ filterConfirm: 'Ok', filterReset: 'Resetar', emptyText: 'Nenhum Local Cadastrado' }">
                  <span slot = "expandedRowRender" slot-scope = "record" style = "margin: 0">
                    <p> <b> Descrição: </b> {{ record.descricao }} </p>
                    <p>
                      <b> Equipamentos: </b>
                      <template v-for = "equipamento in equipamentos" v-if = "equipamento.local === record.nome">
                        <a-popover v-bind:key = "equipamento.patrimonio">
                          <template slot = "content">
                            <p> <b> Nome: </b> {{ equipamento.nome }} </p>
                            <span> <b> Status: </b> {{ equipamento.status }} </span>
                          </template>

                          <a-tag color = "blue"> {{ equipamento.patrimonio }} </a-tag>
                        </a-popover>
                      </template>
                      <span v-if = "!equipamentos[equipamentos.map(function(e) { return e.local }).indexOf(record.nome)]"> Nenhum equipamento cadastrado ainda... </span>
                    </p>
                  </span>

                  <a-icon slot = "filterIcon" slot-scope = "filtered" type = "search" :style = "{ color: filtered ? '#108ee9' : '#aaa' }" />
                  
                  <div slot = "filterDropdownNomeLocal" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
                    <a-input
                      ref = "nomeInputLocal"
                      placeholder = 'Buscar nome...'
                      :value = "selectedKeys[0]"
                      @change = "e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                      @pressEnter = "() => handleSearch('searchNomeLocal', selectedKeys, confirm)"
                    />
                    <a-button type = 'primary' @click = "() => handleSearch('searchNomeLocal', selectedKeys, confirm)"> Buscar </a-button>
                    <a-button @click = "() => handleReset('searchNomeLocal', clearFilters)"> Resetar </a-button>
                  </div>
                  
                  <div slot = "filterDropdownSupervisor" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
                    <a-input
                      ref = "supervisorInput"
                      placeholder = 'Buscar Supervisor...'
                      :value = "selectedKeys[0]"
                      @change = "e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                      @pressEnter = "() => handleSearch('searchSupervisorLocal', selectedKeys, confirm)"
                    />
                    <a-button type = 'primary' @click = "() => handleSearch('searchSupervisorLocal', selectedKeys, confirm)"> Buscar </a-button>
                    <a-button @click = "() => handleReset('searchSupervisorLocal', clearFilters)"> Resetar </a-button>
                  </div>
                </a-table>
              </a-tab-pane>
            </a-tabs>
          </a-row>
        </a-row>

        <a-row v-else-if = "current === 1">
          <a-row style = "text-align: center; margin-bottom: 30px;">
            <a-col :span = "4">
              <a-button size = "large" @click = "prev">
                <a-icon type = "arrow-left" /> Voltar
              </a-button>
            </a-col>

            <a-col :span = "12" :offset = "4">
              <h2> Selecione Período </h2>
            </a-col>

            <a-col :span = "4">
              <a-button :disabled = "!valorItem" size = "large" type = "primary" @click = "next">
                Próximo <a-icon type = "arrow-right" />
              </a-button>
            </a-col>
          </a-row>

          <a-row>

          </a-row>
        </a-row>

        <a-row v-else>
          <a-row style = "text-align: center; margin-bottom: 30px;">
            <h2> Confirmação da Reserva </h2>
          </a-row>

        </a-row>
      </a-col>

      <a-col :span = "1">
        <a-steps direction = "vertical" size = "small" :current = "current">
          <a-step key = "escolha" />
          <a-step key = "periodo" />
          <a-step key = "conclusao" />
        </a-steps>
      </a-col>
    </a-row>
    
    <!-- <a-row style = "text-align: right;">
      <a-button :disabled = "current === 0" style = "margin-right: 8px" @click = "prev"> Voltar </a-button>
      <a-button v-if = "current == 2" type = "primary" style = "margin-right: 8px"> Done </a-button>
      <a-button v-else type = "primary" @click = "next"> Próximo </a-button>
    </a-row> -->
  </a-row>
</template>

<script>
  import firebaseApp from '../../firebase-controller.js'

  const db = firebaseApp.database()

  export default {
    data () {
      return {
        current: 0,
        equipamentos: [],
        locais: [],
        supervisores: [],
        selectedRowKey: [],
        valorItem: '',
        item: 'equipamentos',
        searchPatrimonioEquipamento: '',
        searchNomeEquipamento: '',
        searchNomeLocal: '',
        searchSupervisorLocal: '',
        columnsEquipamento: [{
          title: 'Patrimônio',
          dataIndex: 'patrimonio',
          key: 'patrimonio',
          scopedSlots: {
            filterDropdown: 'filterDropdownPatrimonio',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) => record.patrimonio.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.patrimonioInput.focus()
              })
            }
          }
        }, {
          title: 'Nome',
          dataIndex: 'nome',
          key: 'nome',
          scopedSlots: {
            filterDropdown: 'filterDropdownNomeEquipamento',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) => record.nome.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.nomeInputEquipamento.focus()
              })
            }
          }
        }, {
          title: 'Local',
          dataIndex: 'local',
          key: 'local',
          filters: this.populaFiltroLocais(),
          onFilter: (value, record) => record.local === value
        }, {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'statusTag' },
          filters: [{
            text: 'Normal',
            value: 'Normal'
          }, {
            text: 'Quebrado',
            value: 'Quebrado'
          }, {
            text: 'Em Manutenção',
            value: 'Em Manutenção'
          }],
          onFilter: (value, record) => record.status === value
        }],
        columnsLocais: [{
          title: 'Nome',
          dataIndex: 'nome',
          key: 'nome',
          scopedSlots: {
            filterDropdown: 'filterDropdownNomeLocal',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) => record.nome.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.nomeInputLocal.focus()
              })
            }
          }
        }, {
          title: 'Curso',
          dataIndex: 'curso',
          key: 'curso',
          filters: this.populaFiltroCursos(),
          onFilter: (value, record) => record.curso === value
        }, {
          title: 'Supervisor',
          dataIndex: 'supervisor',
          key: 'supervisor',
          scopedSlots: {
            filterDropdown: 'filterDropdownSupervisor',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) => record.supervisor.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.supervisorInput.focus()
              })
            }
          }
        }]
      }
    },
    computed: {
      rowSelectionEquipamento () {
        return {
          type: 'radio',
          selectedRowKeys: this.selectedRowKey,
          onChange: (selectedRowKeys, selectedRows) => {
            this.selectedRowKey = selectedRowKeys
            this.valorItem = selectedRows[0].id
          },
          getCheckboxProps: record => ({
            props: {
              disabled: record.status === 'Quebrado',
              name: record.patrimonio
            }
          })
        }
      },
      rowSelectionLocal () {
        return {
          type: 'radio',
          selectedRowKeys: this.selectedRowKey,
          onChange: (selectedRowKeys, selectedRows) => {
            this.selectedRowKey = selectedRowKeys
            this.valorItem = selectedRows[0].nome
          },
          getCheckboxProps: record => ({
            props: {
              name: record.nome
            }
          })
        }
      }
    },
    beforeMount: function () {
      let _this = this

      db.ref('Equipamentos').orderByKey().on('value', function (snapshot) {
        _this.equipamentos = []

        snapshot.forEach(function (item) {
          _this.equipamentos.push({
            'id': item.key,
            'patrimonio': item.val().Patrimonio,
            'nome': item.val().Nome,
            'local': item.val().Local,
            'status': item.val().Status,
            'curso': item.val().Curso,
            'marca': item.val().Marca,
            'especificacao': item.val().Especificacao
          })
        })
      })

      db.ref('Locais').orderByKey().on('value', function (snapshot) {
        _this.locais = []

        snapshot.forEach(function (item) {
          _this.locais.push({
            'nome': item.key,
            'curso': item.val().Curso,
            'descricao': item.val().Descricao,
            'supervisor': item.val().Supervisor
          })
        })
      })

      db.ref('Usuarios').orderByChild('role').equalTo('Supervisor').on('value', (snapshot) => {
        _this.supervisores = []

        snapshot.forEach(function (supervisor) {
          _this.supervisores.push(supervisor.val().Nome + ' ' + supervisor.val().Sobrenome)
        })
      })
    },
    methods: {
      handleSearch (inputText, selectedKeys, confirm) {
        confirm()
        this[inputText] = selectedKeys[0]
      },
      handleReset (inputText, clearFilters) {
        clearFilters()
        this[inputText] = ''
      },
      populaFiltroCursos () {
        var cursos = []
        db.ref('Controle/Cursos').orderByKey().on('value', function (snapshot) {
          snapshot.forEach(function (item) {
            cursos.push({
              'text': item.key,
              'value': item.key
            })
          })
        })

        return cursos
      },
      populaFiltroLocais () {
        var locais = []
        db.ref('Locais').orderByKey().on('value', function (snapshot) {
          snapshot.forEach(function (item) {
            locais.push({
              'text': item.key,
              'value': item.key
            })
          })
        })

        return locais
      },
      onChangeTab (key) {
        this.selectedRowKey = []
        this.item = key
        this.valorItem = ''
      },
      next () {
        this.current++
      },
      prev () {
        this.current--
      }
    }
  }
</script>

<style>
  .custom-filter-dropdown {
    padding: 8px;
    border-radius: 6px;
    background: #fff;
    box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
  }

  .custom-filter-dropdown input {
    width: 130px;
    margin-right: 8px;
  }

  .custom-filter-dropdown button {
    margin-right: 8px;
  }
</style>

