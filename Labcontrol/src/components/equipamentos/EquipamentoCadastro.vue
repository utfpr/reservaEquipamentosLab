<template>
  <div id="cadastroEquipment">
    <div class="container-fluid">
      <div class="row justify-content-center text-center">
        <h2> Cadastro de equipamento </h2>
      </div>
      <hr />
      <div class="row justify-content-center">
        <ring-loader :loading="loader.loading" :color="loader.color" :size="loader.size"></ring-loader>
        <alert :showAlert="alert.showAlert" :dismissible="alert.dismissible" :type="alert.type" :title="alert.title" :msg="alert.msg"></alert>
        <form id="cadastroFormEquipment" class="needs-validation" novalidate>
          <div class="form-row">
            <div class="col-lg-6 mb-3">
              <label for="patrimonio">Numero de patrimônio</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="patrimonioPrepend"><i class="fas fa-list-ol"></i></span>
                </div>
                <input v-on:focus="autocompleteHide()" v-on:change="checkUnique()" id="patrimonio" type="text" class="form-control" placeholder="Digite o patrimônio" autocomplete="patrimonio" aria-describedby="patrimonioPrepend" min="0" v-model = "newEquipment.Patrimonio" required>
                <div class="invalid-feedback">
                  Por favor informe um patrimoôio válido e único.
                </div>
              </div>
            </div>
            <div class="col-lg-6 mb-3">
              <label for="nome">Nome</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="equipamentoPrepend"><i class="fas fa-flask"></i></span>
                </div>
                <input v-on:focus="autocompleteHide()" id="equipamento" type="text" class="form-control" placeholder="Digite o nome do equipamento" autocomplete="given-name" aria-describedby="equipamentoPrepend" v-model = "newEquipment.Nome" required>
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
                <input id="local" v-on:focus="autocompleteShow()" v-on:keyup="autocompleteSearch()" v-on:change="autocompleteHide()" type="text" class="form-control" placeholder="Local do equipamento" autocomplete="local" aria-describedby="localPrepend" v-model = "newEquipment.Local" required>
                <div id="autocomplete" class="list-group autocomplete hideOn">
                  <li v-for="local in locais" v-on:click="selectLocal(local)" class="list-group-item list-group-item-action">
                    <span v-on:click="selectLocal(local)">{{local}}</span>
                  </li>
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
                <select v-on:focus="autocompleteHide()" id="cursoequipamento" class="form-control" aria-describedby="cursoequipamentoPrepend" v-model = "newEquipment.Curso" required>
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
                <select v-on:focus="autocompleteHide()" id="status" class="form-control" aria-describedby="statusPrepend" v-model = "newEquipment.Status" required>
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
                <input v-on:focus="autocompleteHide()" id="marca" type="text" class="form-control" placeholder="Digite a marca do equipamento" autocomplete="given-name" aria-describedby="equipamentoPrepend" v-model = "newEquipment.Marca" required>
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
                <textarea v-on:focus="autocompleteHide()" id="esp" type="text" class="form-control" placeholder="Digite a especificação de uso" autocomplete="especificação" aria-describedby="espPrepend" v-model = "newEquipment.Especificacao" required></textarea>
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
              <button type="reset" class="btn btn-danger btn-block" v-on:click="autocompleteHide()">Cancelar</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {mask} from 'vue-the-mask'
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import Alert from '../utility/Alert.vue'
import firebaseApp from '../../firebase-controller.js'
const db = firebaseApp.database()
export default {
  name: 'equipamento',
  data () {
    return {
      locais: [],
      newEquipment: {
        Nome: '',
        Patrimonio: '',
        Especificacao: '',
        Curso: '',
        Status: '',
        Marca: '',
        Local: ''
      },
      loader: {
        loading: false,
        color: '#007bff',
        size: '100px'
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
  firebase: {
    cadastroRef: db.ref('Equipamentos')
  },
  directives: {
    mask
  },
  components: {
    Alert,
    RingLoader
  },
  mounted: function () {
    this.validate()
  },
  methods: {
    submitNewEquip () {
      let form = document.getElementById('cadastroFormEquipment')
      form.classList.add('hideOn')
      this.loader.loading = true
      this.alert.showAlert = false
      let _this = this
      this.$firebaseRefs.cadastroRef.child(this.newEquipment.Patrimonio).update({
        'Curso': _this.newEquipment.Curso,
        'Nome': _this.newEquipment.Nome,
        'Marca': _this.newEquipment.Marca,
        'Especificacao': _this.newEquipment.Especificacao,
        'Local': _this.newEquipment.Local,
        'Status': _this.newEquipment.Status
      }).then(function () {
        _this.alert.type = 'alert-success'
        _this.alert.dismissible = true
        _this.alert.title = 'Yey!'
        _this.alert.msg = 'O equipamento ' + _this.newEquipment.Nome + ', com patrimônio ' + _this.newEquipment.Patrimonio + ', foi cadastrado com sucesso!'
        _this.loader.loading = false
        _this.alert.showAlert = true
        location.reload()
        form.classList.remove('hideOn')
        console.log('completo')
      }).catch((err) => {
        _this.alert.type = 'alert-danger'
        _this.alert.dismissible = true
        _this.alert.title = 'Oops!'
        _this.alert.msg = 'O equipamento ' + _this.newEquipment.Nome + ', com patrimônio ' + _this.newEquipment.Patrimonio + ', não foi cadastrado devido ao Erro: ' + err
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
            _this.submitNewEquip()
          }
          form.classList.add('was-validated')
        }, false)
      })
    },
    autocompleteSearch: function () {
      let local = document.getElementById('local').value
      let _this = this
      _this.locais = []
      db.ref('Locais').orderByKey().startAt(local.toUpperCase()).endAt(local.toUpperCase() + '\uffff').limitToFirst(4).once('value', function (snapshot) {
        _this.locais = []
        snapshot.forEach(function (childSnapshot) {
          _this.locais.push(childSnapshot.key)
        })
      })
    },
    autocompleteHide () {
      let autocomplete = document.getElementById('autocomplete')
      let local = document.getElementById('local')
      if (this.locais.includes(this.newEquipment.Local)) {
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
      this.newEquipment.Local = localField.value
      this.autocompleteHide()
    },
    checkUnique: function () {
      let _this = this
      db.ref('Equipamentos/' + this.newEquipment.Patrimonio).once('value', function (snapshot) {
        let patrimonio = document.getElementById('patrimonio')
        if (!snapshot.val()) {
          patrimonio.setCustomValidity('')
        } else {
          patrimonio.setCustomValidity('Equipamento já está cadastrado')
          _this.alert.type = 'alert-danger'
          _this.alert.dismissible = true
          _this.alert.title = 'Oops!'
          _this.alert.msg = 'O número de patrimônio ' + _this.newEquipment.Patrimonio + ' já se encontra cadastrado, caso queira alterar este equipamento o procure na lista de Equipamentos e clique em Editar'
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
