<template>
  <a-spin :spinning = "loading">
    <a-row style = "text-align: center;">
      <h1> Configurações </h1>
      <!-- Para fazer o download do arquivo: <a :href="'data:'+ this.abacate" download="data.json">download JSON</a> -->
      <p style = "width: 80%; margin-left: auto; margin-right: auto;"> Está página se refere exclusivamente em alterações importantes do sistema, como o <i>tempo mínimo</i> para se realizar uma reserva (para usuários comuns). Assim como apagar dados que não são mais relevantes para o sistema, como: reservas canceladas e reservas que o período de uso já passou. Esteja ciente das alterações que serão feitas aqui, algumas podem não serem revertidas. Qualquer dúvida, consulte um <b>administrador</b>. </p>
    </a-row>

    <a-tabs size = "large">
      <a-tab-pane key = "tempoMin">
        <span slot = "tab">
          <a-icon type = "hourglass" /> Tempo Mínimo de Reserva
        </span>
        
        <a-form layout = "vertical" :autoFormCreate = "(form) => { this.form = form }">
          <a-row :gutter = "16">
            <a-col :span = "10">
              <a-form-item label = "Tempo Mínimo" fieldDecoratorId = "tempoMin" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }], initialValue: tempoMin }">
                <a-input-number :min = "0" :max = "24" :value = "tempoMin" size = "large" /> horas
              </a-form-item>
            </a-col>
          </a-row>

          <a-row style = "text-align: right; margin-bottom: 5px;">
            <a-button size = "large" @click = "limpaTempoMinimo" style = "margin-right: 15px;"> Resetar </a-button>
            
            <a-button :loading = "buttonLoading" size = "large" type = "primary" @click = "atualizaTempoMinimo"> Atualizar </a-button>
          </a-row>
        </a-form>
      </a-tab-pane>

      <a-popconfirm slot = "tabBarExtraContent" placement = "bottomRight" okText = "Confirmar" cancelText = "Cancelar" @confirm = "confirmarDeletarDados">
        <template slot = "title">
          <b> <i> Atenção! </i> </b> <br />
          Realmente deseja deletar os dados ultrapassados? <br />
          A última limpeza foi feita em: {{ dataLimpeza }}. <br /> <br />
          <i> Esta ação não poderá ser desfeita. </i>
        </template>
        
        <a-button icon = "delete" type = "danger" @click = "deletarDados"> Deletar Dados </a-button>
      </a-popconfirm>
    </a-tabs>
  </a-spin>
</template>

<script>
  import firebaseApp from '../../firebase-controller.js'
  import firebase from 'firebase'

  const db = firebaseApp.database()
  const storage = firebase.storage().ref()

  export default {
    data () {
      return {
        loading: false,
        buttonLoading: false,
        tempoMin: '',
        dataLimpeza: '',
        dados: []
      }
    },
    beforeMount: function () {
      let _this = this
      _this.loading = true

      db.ref().on('value', function (snapshot) {
        console.log(snapshot.val())
      })

      db.ref('Controle/Configuracao').on('value', function (snapshot) {
        _this.loading = true
        _this.tempoMin = snapshot.val().TempoMinAntesReserva
        _this.dataLimpeza = snapshot.val().DataLimpeza
        _this.loading = false
      })
    },
    methods: {
      limpaTempoMinimo () {
        let _this = this

        db.ref('Controle/Configuracao').on('value', function (snapshot) {
          _this.tempoMin = snapshot.val().TempoMinAntesReserva
          _this.form.resetFields()
        })
      },
      atualizaTempoMinimo () {
        let _this = this

        this.form.validateFields(async (err, values) => {
          if (!err) {
            _this.buttonLoading = true

            db.ref('Controle/Configuracao').update({
              'TempoMinAntesReserva': values.tempoMin
            }).then(() => {
              _this.$notification.success({
                message: 'Yey!..',
                description: 'Tempo Mínimo para Reserva foi alterado para ' + values.tempoMin + ' horas.'
              }, 1500)
              _this.buttonLoading = false
            }).catch(() => {
              _this.$notification.error({
                message: 'Opps..',
                description: 'Tempo Mínimo para Reserva não foi alterado.'
              }, 1500)
              _this.buttonLoading = false
            })
          }
        })
      },
      deletarDados () {
        let _this = this
        let dia = this.$moment(_this.$moment().format('DD/MM/YYYY'), 'DD/MM/YYYY')
        _this.dados = []

        db.ref('Reservas/equipamentos').on('value', function (snapshot) {
          snapshot.forEach(function (item) {
            var fim = _this.$moment(_this.$moment(item.val().Fim, 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY'), 'DD/MM/YYYY')

            if (dia.isAfter(fim) || item.val().Status === 'Cancelada') {
              _this.dados.push({
                'tipo': 'equipamento',
                'key': item.key,
                'dados': item.val()
              })
            }
          })
        })

        db.ref('Reservas/locais').on('value', function (snapshot) {
          snapshot.forEach(function (item) {
            var fim = _this.$moment(_this.$moment(item.val().Fim, 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY'), 'DD/MM/YYYY')

            if (dia.isAfter(fim) || item.val().Status === 'Cancelada') {
              _this.dados.push({
                'tipo': 'local',
                'key': item.key,
                'dados': item.val()
              })
            }
          })
        })

        db.ref('Reservas/aulas').on('value', function (snapshot) {
          snapshot.forEach(function (item) {
            var fim = _this.$moment(item.val().Fim, 'DD/MM/YYYY')

            if (dia.isAfter(fim) || item.val().Status === 'Cancelada') {
              _this.dados.push({
                'tipo': 'aula',
                'key': item.key,
                'dados': item.val()
              })
            }
          })
        })
      },
      confirmarDeletarDados () { // Chamada quando usuário confirma a ação para deletar dados
        let _this = this
        var status = true

        // Estrutura de dados para gerar arquivo de restauração
        var dadosArquivo = {
          'equipamentos': {},
          'locais': {},
          'aulas': {}
        }

        // Insere dados de reservas em dadosArquivo
        _this.dados.forEach(function (item) {
          if (item.tipo === 'equipamento') {
            _this.$set(dadosArquivo.equipamentos, item.key, item.dados) // Insere novo elemento no objeto dadosArquivo.equipamentos
          }
          if (item.tipo === 'local') {
            _this.$set(dadosArquivo.locais, item.key, item.dados) // Insere novo elemento no objeto dadosArquivo.locais
          }
          if (item.tipo === 'aula') {
            _this.$set(dadosArquivo.aulas, item.key, item.dados) // Insere novo elemento no objeto dadosArquivo.aulas
          }
        })

        // Cria os meta dados do arquivo de restauração
        var metadataRestauracao = {
          contentType: 'text/json'
        }
        // Cria um array com string a ser carregada no arquivo (o json é transformado em arquivo)
        var stringRestauracao = [JSON.stringify(dadosArquivo)]
        // Cria o arquivo Blob com os dados da restauração
        var blobRestauracao = new Blob(stringRestauracao, {type: 'text/json'})
        // Faz o upload do arquivo
        storage.child('backups/Reservas-' + _this.$moment().format('DDMMYYYY-HHmm') + '.json').put(blobRestauracao, metadataRestauracao).then((data) => {
          _this.$notification.info({ // Se deu certo, exibe a mensagem
            message: 'Dados de reservas limpos.',
            description: 'Para restaurar os dados apagados, consulte um técnico.'
          })
        })

        // Deleta dados do banco
        _this.dados.forEach(function (item) {
          if (item.tipo === 'equipamento') {
            db.ref('Reservas/equipamentos').child(item.key).remove().then(() => {
            }).catch(() => {
              status = false
            })
          } else if (item.tipo === 'local') {
            db.ref('Reservas/locais').child(item.key).remove().then(() => {
            }).catch(() => {
              status = false
            })
          } else if (item.tipo === 'aula') {
            db.ref('Reservas/aulas').child(item.key).remove().then(() => {
            }).catch(() => {
              status = false
            })
          }
        })

        // Grava data da última limpeza
        if (status === true) {
          db.ref('Controle/Configuracao').update({
            'DataLimpeza': _this.$moment().format('DD/MM/YYYY HH:mm')
          }).then(() => {
            _this.$notification.success({
              message: 'Yey!..',
              description: 'Dados deletados com sucesso.'
            })
          })
        } else {
          _this.$notification.error({
            message: 'Opps..',
            description: 'Falha ao deletar dados.'
          })
        }
      }
    }
  }
</script>

<style>
  .buttons-icons, .dia {
    cursor: pointer;
  }

  .dia:hover + small .buttons-icons {
    color: #1890ff;
  }

  .buttons-icons:hover {
    color: #1890ff;
  }

  .anticon.anticon-cross-circle.ant-calendar-picker-clear {
    display: none;
  }

  .ant-list.ant-list-split .ant-spin-nested-loading {
    overflow-y: scroll;
    height: 65vh;
  }

  .ant-tag {
    margin-top: 8px
  }
</style>