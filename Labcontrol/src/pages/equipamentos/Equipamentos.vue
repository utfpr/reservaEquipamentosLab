<template>
  <a-spin :spinning = "loading">
    <a-row style = "margin-bottom: 30px;">
      <a-col :span = "16" :offset = "4" style = "text-align: center">
        <h1> Equipamentos </h1>
      </a-col>
      
      <a-col :span = "4">
        <a-button type = "primary" v-if = "role === 'admin' || role === 'Supervisor'" @click = "showEquipamentoModal()" size = "large" icon = "plus" style = "width: 100%; margin-top: 8px;"> Novo </a-button>
      </a-col>
    </a-row>

    <a-table :dataSource = "equipamentos" :columns = "columns" :locale = "{ filterConfirm: 'Ok', filterReset: 'Resetar', emptyText: 'Nenhum Equipamento Cadastrado' }">
      <span slot = "expandedRowRender" slot-scope = "record" style = "margin: 0">
        <p> <b> Marca: </b> {{ record.marca }} </p>
        <p> <b> Curso: </b> {{ record.curso }} </p>
        <p> <b> Especificação: </b> {{ record.especificacao }} </p>
      </span>

      <span slot = "actions" slot-scope = "text, record">
        <a-tooltip v-if = "record.pop === 'true'" placement = "top">
          <template slot = "title">
            <span> Baixar POP </span>
          </template>

          <a-tag @click = "downloadFile(text)" color = "blue" :key = "text" >
            <a-icon type = "file-pdf" />
          </a-tag>
        </a-tooltip>

        <a-tooltip v-if = "record.status !== 'Quebrado'" placement = "top">
          <template slot = "title">
            <span> Reservar Equipamento </span>
          </template>

          <a-tag color = "green" :key = "text" >
            <router-link :to = "{ name: 'periodoReserva', params: { item: 'equipamento', valorItem: text }}">
             <a-icon style = "color: #52c41a" type = "database" />
            </router-link>
          </a-tag>
        </a-tooltip>

        <a-tooltip v-if = "role === 'admin' || role === 'Supervisor'" placement = "top">
          <template slot = "title">
            <span> Editar Equipamento </span>
          </template>

          <a-tag @click = "showAtualizaModal(text)" color = "orange" :key = "text" >
            <a-icon type = "edit" />
          </a-tag>
        </a-tooltip>

        <a-tooltip v-if = "role === 'admin' || role === 'Supervisor'" placement = "top">
          <template slot = "title">
            <span> Deletar Equipamento </span>
          </template>

          <a-tag @click = "showConfirmModal(text)" color = "red" :key = "text" >
            <a-icon type = "delete" />
          </a-tag>
        </a-tooltip>
      </span>

      <a-icon slot = "filterIcon" slot-scope = "filtered" type='search' :style = "{ color: filtered ? '#108ee9' : '#aaa' }" />

      <div slot = "filterDropdownNome" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
        <a-input
          ref = "nomeInput"
          placeholder = 'Buscar nome...'
          :value = "selectedKeys[0]"
          @change = "e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter = "() => handleSearch('searchNome', selectedKeys, confirm)"
        />
        <a-button type = 'primary' @click = "() => handleSearch('searchNome', selectedKeys, confirm)"> Buscar </a-button>
        <a-button @click = "() => handleReset('searchNome', clearFilters)"> Resetar </a-button>
      </div>
      
      <div slot = "filterDropdownPatrimonio" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
        <a-input
          ref = "patrimonioInput"
          placeholder = 'Buscar patrimônio...'
          :value = "selectedKeys[0]"
          @change = "e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter = "() => handleSearch('searchPatrimonio', selectedKeys, confirm)"
        />
        <a-button type = 'primary' @click = "() => handleSearch('searchPatrimonio', selectedKeys, confirm)"> Buscar </a-button>
        <a-button @click = "() => handleReset('searchPatrimonio', clearFilters)"> Resetar </a-button>
      </div>

      <span slot = "statusTag" slot-scope = "tag">
        <a-tag v-if = "tag === 'Normal'" color = "green" :key = "tag"> {{tag}} </a-tag>
        <a-tag v-if = "tag === 'Quebrado'" color = "red" :key = "tag"> {{tag}} </a-tag>
        <a-tag v-if = "tag === 'Em Manutenção'" color = "blue" :key = "tag"> {{tag}} </a-tag>
      </span>
    </a-table>

    <a-modal
      v-if = "role === 'admin' || role === 'Supervisor'"
      :visible = "visibleConfirmModal"
      :footer = "null"
      @cancel = "closeConfirmModal()"
      style = "padding: 32px 32px 24px;">

      <a-icon type = "question-circle-o" style = "color: #faad14; font-size: 22px; margin-right: 16px" />
      <span> <b> Cuidado! </b> </span> <br />
      <span style = "margin-left: 38px;"> Realmente deseja deletar o equipamento: {{equipamento.patrimonio}}? </span> <br />
      <span style = "margin-left: 38px;"> <i> Esta ação não poderá ser desfeita. </i> </span> <br/>

      <div style = "text-align: right; margin-top: 20px;">
        <a-button @click = "closeConfirmModal()"> Cancelar </a-button>
        <a-button @click = "deletaEquipamento()" type = "danger"> Deletar </a-button>
      </div> 
    </a-modal>

    <a-modal
      v-if = "role === 'admin' || role === 'Supervisor'"
      :visible = "visibleEquipamentoModal"
      :footer = "null"
      @cancel = "closeEquipamentoModal()"
      style = "top: 20px; width: 570px;">

      <div slot = "title">
        <h5 v-if = "edit"> <b> {{equipamento.patrimonio}} </b> </h5>
        <h5 v-else > <b> Novo Equipamento </b> </h5>
      </div>

      <a-form layout = "vertical" :autoFormCreate = "(form) => { this.form = form }">
        <a-row :gutter = "16">
          <a-col :span = "10">
            <a-form-item label = "Patrimônio" fieldDecoratorId = "patrimonio" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }, { validator: this.checkUnique }], initialValue: equipamento.patrimonio }">
              <a-input size = "large" placeholder = "Digite patrimônio" @focus = "checkInput" />
            </a-form-item>
          </a-col>

          <a-col :span = "14">
            <a-form-item label = "Nome" fieldDecoratorId = "nome" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }], initialValue: equipamento.nome }">
              <a-input size = "large" placeholder = "Digite nome" @focus = "checkInput" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter = "16">
          <a-col :span = "18">
            <a-form-item label = "Cursos" fieldDecoratorId = "curso" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Selecione Curso' }], initialValue: equipamento.curso }">
              <a-select size = "large" placeholder = "Selecione curso" @focus = "checkSelect('curso')" showSearch notFoundContent = "Curso não Encontrado" :filterOption = "filterOption">
                <a-select-option v-for = "curso in cursos" v-bind:key = "curso" :value = "curso"> {{curso}} </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span = "6">
            <a-form-item label = "Locais" fieldDecoratorId = "local" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Selecione Local' }], initialValue: equipamento.local }">
              <a-select size = "large" placeholder = "Locais" @focus = "checkSelect('local')" showSearch notFoundContent = "Local não Encontrado" :filterOption = "filterOption">
                <a-select-option v-for = "local in locais" v-bind:key = "local" :value = "local"> {{local}} </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter = "16">
          <a-col :span = "10">
            <a-form-item label = "Status" fieldDecoratorId = "status" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Selecione Status' }], initialValue: equipamento.status }">
              <a-select size = "large" placeholder = "Selecione status" @focus = "checkSelect('status')" showSearch notFoundContent = "Status não Encontrado" :filterOption = "filterOption">
                <a-select-option value = "Normal"> Normal </a-select-option>
                <a-select-option value = "Quebrado"> Quebrado </a-select-option>
                <a-select-option value = "Em Manutenção"> Em Manutenção </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span = "14">
            <a-form-item label = "Marca" fieldDecoratorId = "marca" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }], initialValue: equipamento.marca }">
              <a-input size = "large" placeholder = "Digite marca" @focus = "checkInput" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter = "16">
          <a-form-item label = "Especificação" fieldDecoratorId = "especificacao" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }], initialValue: equipamento.especificacao }">
            <a-textarea placeholder = "Digite especificação de uso" :autosize = "{ minRows: 3, maxRows: 6 }" @focus = "checkInput" />
          </a-form-item>
        </a-row>

        <a-row :gutter = "16">
          <a-form-item label = "Arquivo POP" fieldDecoratorId = "pop">
            <a-upload size = "large" :multiple = "false" :fileList = "pop" :beforeUpload = "beforeUpload">
              <a-button icon = "file-pdf"> Enviar Arquivo </a-button>
            </a-upload>
          </a-form-item>
        </a-row>

        <a-row style = "text-align: right; margin-bottom: 5px;">
          <a-button size = "large" @click = "closeEquipamentoModal()" style = "margin-right: 15px;"> Cancelar </a-button>
          
          <a-button :loading = "buttonLoading" v-if = "edit" size = "large" type = "primary" @click = "atualizaEquipamento"> Atualizar </a-button>
          <a-button :loading = "buttonLoading" v-else size = "large" type = "primary" @click = "cadastraEquipamento"> Cadastrar </a-button>
        </a-row>
      </a-form>
    </a-modal>
  </a-spin>
</template>

<script>
  import firebaseApp from '../../firebase-controller.js'
  import firebase from 'firebase'

  const db = firebaseApp.database()
  const storage = firebase.storage()
  const auth = firebaseApp.auth()

  export default {
    nome: 'Equipamentos',
    data () {
      return {
        role: null,
        loading: true,
        buttonLoading: false,
        equipamentos: [],
        locais: [],
        cursos: [],
        equipamento: '',
        pop: [],
        searchPatrimonio: '',
        searchNome: '',
        columns: [{
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
            filterDropdown: 'filterDropdownNome',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) => record.nome.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.nomeInput.focus()
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
        }, {
          title: 'Ações',
          dataIndex: 'id',
          key: 'acoes',
          align: 'center',
          scopedSlots: { customRender: 'actions' }
        }],
        visibleConfirmModal: false,
        visibleEquipamentoModal: false,
        edit: false
      }
    },
    beforeMount: function () {
      let _this = this
      _this.loading = true

      db.ref('Equipamentos').orderByKey().on('value', function (snapshot) {
        _this.loading = true
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
            'especificacao': item.val().Especificacao,
            'pop': item.val().Pop
          })
        })
        _this.loading = false
      })

      db.ref('Locais').orderByKey().on('value', function (snapshot) {
        _this.loading = true
        _this.locais = []

        snapshot.forEach(function (item) {
          _this.locais.push(item.key)
        })
        _this.loading = false
      })

      db.ref('Controle/Cursos').orderByKey().on('value', function (snapshot) {
        _this.loading = true
        _this.cursos = []

        snapshot.forEach(function (item) {
          _this.cursos.push(item.key)
        })
        _this.loading = false
      })

      db.ref('Usuarios/' + auth.currentUser.uid + '/role').on('value', function (snapshot) {
        _this.loading = true
        _this.role = snapshot.val()
        _this.loading = false
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
      showConfirmModal (id) {
        this.equipamento = this.equipamentos[this.equipamentos.map(function (e) { return e.id }).indexOf(id)]
        this.visibleConfirmModal = true
      },
      closeConfirmModal () {
        this.visibleConfirmModal = false
        this.equipamento = ''
      },
      showEquipamentoModal () {
        this.pop = []
        this.visibleEquipamentoModal = true
      },
      showAtualizaModal (id) {
        this.equipamento = this.equipamentos[this.equipamentos.map(function (e) { return e.id }).indexOf(id)]
        this.edit = true
        this.showEquipamentoModal()
      },
      closeEquipamentoModal () {
        this.visibleEquipamentoModal = false
        this.edit = false
        this.equipamento = ''
        this.form.resetFields()
      },
      checkUnique (rule, value, callback) {
        let resposta = 'Equipamento já existe!'
        if (value && this.equipamentos.some(e => e.patrimonio === value) && this.equipamento.patrimonio !== value) {
          callback(resposta)
        } else {
          callback()
        }
      },
      checkInput (e) {
        this.form.validateFields([e.target.id])
      },
      checkSelect (name) {
        this.form.validateFields([name])
      },
      filterOption (input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      async cadastraEquipamento () {
        let _this = this

        this.form.validateFields(async (err, values) => {
          if (!err) {
            _this.buttonLoading = true

            db.ref('Equipamentos').push({
              'Patrimonio': values.patrimonio,
              'Curso': values.curso,
              'Nome': values.nome,
              'Marca': values.marca,
              'Especificacao': values.especificacao,
              'Local': values.local,
              'Status': values.status,
              'Pop': values.pop ? 'true' : 'false'
            }).then((data) => {
              const key = values.patrimonio
              _this.buttonLoading = false
              _this.$notification.success({
                key,
                message: 'Yey!..',
                description: 'Equipamento ' + values.patrimonio + ' cadastrado com sucesso.'
              }, 1500)

              if (values.pop) {
                var pdfRef = storage.ref().child(data.key + '.pdf')
                pdfRef.put(values.pop.file).then((data) => {
                  _this.$notification.info({
                    key,
                    message: 'Yey!.. De novo',
                    description: 'POP armazenado com sucesso.'
                  })
                })
              }
              this.closeEquipamentoModal()
            }).catch((err) => {
              _this.$notification.error({
                message: 'Opps..',
                description: 'Equipamento não cadastrado. Erro: ' + err
              })
              _this.buttonLoading = false
              this.closeEquipamentoModal()
            })
          }
        })
      },
      async atualizaEquipamento () {
        let _this = this

        this.form.validateFields(async (err, values) => {
          if (!err) {
            _this.buttonLoading = true

            db.ref('Equipamentos').child(_this.equipamento.id).update({
              'Patrimonio': values.patrimonio,
              'Curso': values.curso,
              'Nome': values.nome,
              'Marca': values.marca,
              'Especificacao': values.especificacao,
              'Local': values.local,
              'Status': values.status,
              'Pop': values.pop ? 'true' : 'false'
            }).then(() => {
              const key = _this.equipamento.id
              _this.buttonLoading = false
              _this.$notification.success({
                key,
                message: 'Yey!..',
                description: 'Equipamento atualizado com sucesso.'
              }, 1500)

              if (values.pop) {
                var pdfRef = storage.ref().child(_this.equipamento.id + '.pdf')
                pdfRef.put(values.pop.file).then((data) => {
                  _this.$notification.info({
                    key,
                    message: 'Yey!.. De novo',
                    description: 'POP atualizado com sucesso.'
                  })
                })
              }
              this.closeEquipamentoModal()
            }).catch((err) => {
              _this.$notification.error({
                message: 'Opps..',
                description: 'Equipamento não atualizado. Erro: ' + err
              })
              _this.buttonLoading = false
              this.closeEquipamentoModal()
            })
          }
        })
      },
      deletaEquipamento () {
        let _this = this
        _this.visibleConfirmModal = false

        db.ref('Equipamentos').child(_this.equipamento.id).remove().then(function () {
          _this.$notification.success({
            message: 'Yey!..',
            description: 'Equipamento deletado com sucesso.'
          })
        }).catch((err) => {
          _this.$notification.error({
            message: 'Opps..',
            description: 'Equipamento não deletado. Erro: ' + err
          })
        })

        if (_this.equipamento.pop) {
          storage.ref(_this.equipamento.id + '.pdf').delete()
        }

        _this.equipamento = ''
      },
      downloadFile (equipamento) {
        var _this = this
        var pathReference = storage.ref(equipamento + '.pdf')

        pathReference.getDownloadURL().then((url) => {
          window.open(url, '_blank')
        }).catch((err) => {
          switch (err.code) {
            case 'storage/object-not-found':
              _this.$notification.error({
                message: 'Opps..',
                description: 'POP não armazenado para este equipamento.'
              })
              break
            default:
              _this.$notification.error({
                message: 'Opps..',
                description: 'Não foi possível vizualizar POP. Erro: ' + err
              })
              break
          }
        })
      },
      beforeUpload (file) {
        if (file.type === 'application/pdf') {
          if (this.pop.length === 1) {
            this.pop = this.pop[0]
          }
          this.pop = [...this.pop, file]
        } else {
          this.$message.error("Extensão Inválida! Permitido apenas PDF's")
          this.pop = []
        }

        return false
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
