<template>
  <div id="EquipamentoDetails">
    <div class="container-fluid">
      <div v-if="loader.loading" class="row justify-content-center">
        <ring-loader :loading="loader.loading" :color="loader.color" :size="loader.size"></ring-loader>
      </div>
      <div v-else-if="action === 'view'" class="container">
        <v-dialog/>
        <div class="row">
          <div class="col-sm-12 col-md-6">
            <h5><strong>Patrimônio</strong>: {{key}}</h5>
          </div>
          <div class="col-sm-12 col-md-6">
            <h5><strong>Nome</strong>: {{equipamento.Nome}}</h5>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-sm-12 col-md-4">
            <p><strong>Marca</strong><br />{{equipamento.Marca}}</p>
          </div>
          <div class="col-sm-12 col-md-4">
            <p><strong>Local</strong><br />{{equipamento.Local}}</p>
          </div>
          <div class="col-sm-12 col-md-4">
            <p><strong>Status</strong><br />{{equipamento.Status}}</p>
          </div>
          <div class="col-sm-12 col-md-4">
            <p><strong>Curso</strong><br />{{equipamento.Curso}}</p>
          </div>
          <div class="col-12">
            <p><strong>Especificação</strong><br />{{equipamento.Especificacao}}</p>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-12 text-right">
            <ul class="list-inline d-inline-flex">
              <li>
                <router-link :to="{ name: 'Equipamentos', params: {}}" class="mr-2 list-inline-item btn btn-primary btn-sm">Voltar</router-link>
              </li>
              <li>
                <span v-on:click="confirmarDelete(key)" class="list-inline-item btn btn-danger btn-sm">Deletar</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-else class="container">
        <div class="row justify-content-center">
          <alert :showAlert="alert.showAlert" :dismissible="alert.dismissible" :type="alert.type" :title="alert.title" :msg="alert.msg"></alert>
          <form id="cadastroFormEquipment" class="needs-validation" novalidate>
            <div class="form-row">
              <div class="col-lg-6 mb-3">
                <label for="patrimonio">Numero de patrimônio</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="patrimonioPrepend"><i class="fas fa-list-ol"></i></span>
                  </div>
                  <input v-on:focus="autocompleteHide()" v-on:change="checkUnique()" id="patrimonio" type="text" class="form-control" placeholder="Digite o numero de patrimonio" autocomplete="patrimonio" aria-describedby="patrimonioPrepend" min="0" v-model = "equipment.Patrimonio" required>
                  <div class="invalid-feedback">
                    Por favor informe um numero de patrimonio.
                  </div>
                </div>
              </div>
              <div class="col-lg-6 mb-3">
                <label for="nome">Nome</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="equipamentoPrepend"><i class="fas fa-flask"></i></span>
                  </div>
                  <input v-on:focus="autocompleteHide()" id="equipamento" type="text" class="form-control" placeholder="Digite o nome do equipamento" autocomplete="given-name" aria-describedby="equipamentoPrepend" v-model = "equipment.Nome" required>
                  <div class="invalid-feedback">
                    Por favor informe o nome do equipamento a ser registrado
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="col-lg-6 mb-3">
                <label for="local">Local</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="localPrepend"><i class="fas fa-map-marker"></i></span>
                  </div>
                  <input id="local" v-on:focus="autocompleteShow()" v-on:keyup="autocompleteSearch()" v-on:change="autocompleteHide()" type="text" class="form-control" placeholder="Local do equipamento" autocomplete="local" aria-describedby="localPrepend" v-model = "equipment.Local" required>
                  <div id="autocomplete" class="list-group autocomplete hideOn">
                    <span v-for="local in locais" v-on:click="selectLocal(local)" class="list-group-item list-group-item-action">{{local}}</span>
                  </div>
                  <div class="invalid-feedback">
                    Por favor informe um local válido.
                  </div>
                </div>
              </div>
              <div class="col-lg-6 mb-3">
                <label for="cursoequipamento">Curso</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="cursoPrepend"><i class="fas fa-graduation-cap"></i></span>
                  </div>
                  <select v-on:focus="autocompleteHide()" id="cursoequipamento" class="form-control" aria-describedby="cursoequipamentoPrepend" v-model = "equipment.Curso" required>
                    <option value="" disabled selected>Selecione o curso de utilização</option>''
                    <option>Todos</option>
                    <option>Engenharia Ambiental</option>
                    <option>Engenharia de Alimentos</option>
                    <option>Quimica</option>
                  </select>
                  <div class="invalid-feedback">
                    Por favor selecione um curso.
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="col-lg-6 mb-3">
                <label for="status">Status</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="statusPrepend"><i class="fas fa-check-square"></i></span>
                  </div>
                  <select v-on:focus="autocompleteHide()" id="status" class="form-control" aria-describedby="statusPrepend" v-model = "equipment.Status" required>
                    <option value="" disabled selected>Selecione o status do equipamento</option>''
                    <option value="Normal">Normal</option>
                    <option value="Quebrado">Quebrado</option>
                    <option value="Em Manutanção">Em Manutanção</option>
                  </select>
                  <div class="invalid-feedback">
                    Por favor selecione um status.
                  </div>
                </div>
              </div>
              <div class="col-lg-6 mb-3">
                <label for="marca">Marca</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="marcaPrepend"><i class="fas fa-bookmark"></i></span>
                  </div>
                  <input v-on:focus="autocompleteHide()" id="marca" type="text" class="form-control" placeholder="Digite a marca do equipamento" autocomplete="given-name" aria-describedby="equipamentoPrepend" v-model = "equipment.Marca" required>
                  <div class="invalid-feedback">
                    Por favor informe a marca do equipamento
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="col-12 mb-3">
                <label for="esp">Especificação</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="espPrepend"><i class="fas fa-book"></i></span>
                  </div>
                  <textarea v-on:focus="autocompleteHide()" id="esp" type="text" class="form-control" placeholder="Digite a especificação de uso" autocomplete="especificação" aria-describedby="espPrepend" v-model = "equipment.Especificacao" required></textarea>
                  <div class="invalid-feedback">
                    Por favor informe uma especificação.
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="col-sm-6 justify-content-right">
                <button type="submit" class="btn btn-primary btn-block" >Confirmar</button>
              </div>
              <div class="col-sm-6 justify-content-left">
                <router-link :to="{ name: 'Equipamentos', params: {}}" class="btn btn-danger btn-block" v-on:click="autocompleteHide()" > Voltar</router-link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  </template>

  <script>
  import Alert from '../utility/Alert.vue'
  import RingLoader from 'vue-spinner/src/RingLoader.vue'
  import firebaseApp from '../../firebase-controller.js'
  const db = firebaseApp.database()
  export default {
    name: 'EquipamentoDetails',
    data () {
      return {
        locais: [],
        key: this.$route.params.key,
        action: this.$route.params.action,
        equipamento: null,
        loader: {
          loading: true,
          color: '#007bff',
          size: '100px'
        },
        equipment: {
          Nome: '',
          Patrimonio: '',
          Especificacao: '',
          Curso: '',
          Status: '',
          Marca: '',
          Local: ''
        },
        alert: {
          showAlert: false,
          dismissible: false,
          type: '',
          title: '',
          msg: ''
        }
      }
    },
    components: {
      Alert,
      RingLoader
    },
    beforeMount: function () {
      this.loader.loading = true
      let _this = this
      db.ref('Equipamentos/' + this.$route.params.key).on('value', function (snapshot) {
        _this.equipamento = snapshot.val()
        _this.equipment.Nome = _this.equipamento.Nome
        _this.equipment.Patrimonio = _this.$route.params.key
        _this.equipment.Especificacao = _this.equipamento.Especificacao
        _this.equipment.Curso = _this.equipamento.Curso
        _this.equipment.Status = _this.equipamento.Status
        _this.equipment.Marca = _this.equipamento.Marca
        _this.equipment.Local = _this.equipamento.Local
        _this.loader.loading = false
      })
    },
    mounted: function () {
      if (this.action === 'edit') {
        this.validate()
      }
    },
    methods: {
      submitEquip () {
        let form = document.getElementById('cadastroFormEquipment')
        form.classList.add('hideOn')
        this.loader.loading = true
        this.alert.showAlert = false
        let _this = this
        db.ref('Equipamentos').child(_this.equipment.Patrimonio).update({
          'Nome': _this.equipment.Nome,
          'Especificacao': _this.equipment.Especificacao,
          'Curso': _this.equipment.Curso,
          'Status': _this.equipment.Status,
          'Marca': _this.equipment.Marca,
          'Local': _this.equipment.Local
        }).then(function () {
          if (_this.$route.params.key !== _this.equipment.Patrimonio) {
            db.ref('Equipamentos').child(_this.$route.params.key).remove()
          }
          _this.$notify({
            group: 'notify',
            type: 'success',
            title: 'Yey!',
            text: 'Equipamento ' + _this.equipment.Nome + ', com patrimônio ' + _this.equipment.Patrimonio + ', foi atualizado com sucesso!',
            duration: 10000
          })
          _this.$router.replace('/equipamentos/' + _this.equipment.Patrimonio + '/view')
          setTimeout(function () {
            location.reload()
          }, 2000)
        }).catch((err) => {
          _this.alert.type = 'alert-danger'
          _this.alert.dismissible = true
          _this.alert.title = 'Oops!'
          _this.alert.msg = 'O equipamento ' + _this.equipment.Nome + ', com patrimônio ' + _this.equipment.Patrimonio + ', não foi atualizado devido ao Erro: ' + err
          _this.loader.loading = false
          _this.alert.showAlert = true
          form.classList.remove('hideOn')
          console.log('Erro: ' + err)
        })
      },
      validate: function () {
        let _this = this
        var forms = document.getElementsByClassName('needs-validation')
        Array.prototype.filter.call(forms, function (form) {
          form.addEventListener('submit', function (event) {
            if (form.checkValidity() === false) {
              event.preventDefault()
              event.stopPropagation()
            } else {
              _this.submitEquip()
            }
            form.classList.add('was-validated')
          }, false)
        })
      },
      confirmarDelete (patrimonio) {
        this.$modal.show('dialog', {
          title: 'Cuidado!',
          text: 'Realmente deseja deletar o Equipamento ' + patrimonio + '? <br> Essa ação não pode ser desfeita',
          buttons: [
            {
              title: 'Deletar',
              handler: () => {
                let _this = this
                db.ref('Equipamentos').child(patrimonio).remove().then(function () {
                  _this.$notify({
                    group: 'notify',
                    type: 'success',
                    title: 'Yey!',
                    text: 'Equipamento <strong>' + patrimonio + '</strong> deletado com sucesso'
                  })
                  _this.$router.replace('/equipamentos')
                }).catch((err) => {
                  _this.$notify({
                    group: 'notify',
                    type: 'error',
                    title: 'Yey!',
                    text: 'Falha ao deletar Equipamento ' + patrimonio
                  })
                  console.log('Erro: ' + err)
                })
                this.$modal.hide('dialog')
              }
            },
            {
              title: 'Cancelar',
              default: true
            }
          ]
        })
      },
      autocompleteSearch: function () {
        let local = document.getElementById('local').value
        let _this = this
        _this.locais = []
        db.ref('Locais').orderByKey().startAt(local.toUpperCase()).endAt(local.toUpperCase() + '\uffff').limitToFirst(4).once('value', function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
            _this.locais.push(childSnapshot.key)
          })
        })
      },
      autocompleteHide () {
        let autocomplete = document.getElementById('autocomplete')
        let local = document.getElementById('local')
        if (this.locais.includes(this.equipment.Local)) {
          local.setCustomValidity('')
        } else {
          local.setCustomValidity('Sala inválida')
        }
        autocomplete.classList.add('hideOn')
      },
      autocompleteShow () {
        let autocomplete = document.getElementById('autocomplete')
        autocomplete.classList.remove('hideOn')
      },
      selectLocal (local) {
        let localField = document.getElementById('local')
        localField.value = local
        this.equipment.Local = localField.value
        this.autocompleteHide()
      },
      checkUnique: function () {
        let _this = this
        db.ref('Equipamentos/' + this.equipment.Patrimonio).once('value', function (snapshot) {
          let patrimonio = document.getElementById('patrimonio')
          if (!snapshot.val()) {
            patrimonio.setCustomValidity('')
          } else {
            patrimonio.setCustomValidity('Equipamento já está cadastrado')
            _this.alert.type = 'alert-danger'
            _this.alert.dismissible = true
            _this.alert.title = 'Oops!'
            _this.alert.msg = 'O número de patrimônio ' + _this.equipment.Patrimonio + ' já se encontra cadastrado, caso queira alterar este equipamento o procure na lista de Equipamentos e clique em Editar'
            _this.alert.showAlert = true
          }
        })
      }
    }
  }
  </script>

  <style>
  #cadastroFormEquipment {
    width: 100vw;
  }
  </style>
