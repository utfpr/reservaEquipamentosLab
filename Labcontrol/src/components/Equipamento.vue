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
      <form id="cadastroFormEquipment" class="needs-validation" v-on:submit.prevent novalidate>
        <div class="form-row">
          <div class="col-lg-6 mb-3">
            <label for="nome">Nome</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="equipamentoPrepend"><i class="fas fa-flask"></i></span>
              </div>
              <input id="equipamento" type="text" class="form-control" placeholder="Digite o nome do equipamento" autocomplete="given-name" aria-describedby="equipamentoPrepend" v-model = "newEquipment.name" required>
              <div class="invalid-feedback">
                Por favor informe o nome do equipamento a ser registrado
              </div>
            </div>
          </div>
          <div class="col-lg-6 mb-3">
            <label for="patrimonio">Numero de patrimonio</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="patrimonioPrepend"><i class="fas fa-list-ol"></i></span>
              </div>
              <input id="patrimonio" type="number" class="form-control" placeholder="Digite o numero de patrimonio" autocomplete="patrimonio" aria-describedby="patrimonioPrepend" min="0" v-model = "newEquipment.patri" required>
              <div class="invalid-feedback">
                Por favor informe um numero de patrimonio.
              </div>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="col-lg-6 mb-3">
            <label for="nome">Especificação</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="espPrepend"><i class="fas fa-book"></i></span>
              </div>
              <input id="esp" type="text" class="form-control" placeholder="Digite a especificação de uso" autocomplete="especificação" aria-describedby="espPrepend" v-model = "newEquipment.esp">
            </div>
          </div>
        <div class="col-lg-6 mb-3">
          <label for="cursoequipamento">Curso</label>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text" id="cursoPrepend"><i class="fas fa-graduation-cap"></i></span>
            </div>
            <select id="cursoequipamento" class="form-control" aria-describedby="cursoequipamentoPrepend" v-model = "newEquipment.curso" required>
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
            <select id="status" class="form-control" aria-describedby="statusPrepend" v-model = "newEquipment.status" required>
              <option value="" disabled selected>Selecione o status do equipamento</option>''
              <option>Normal</option>
              <option>Conserto</option>
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
              <input id="marca" type="text" class="form-control" placeholder="Digite a marca do equipamento" autocomplete="given-name" aria-describedby="equipamentoPrepend" v-model = "newEquipment.marca" required>
              <div class="invalid-feedback">
                Por favor informe a marca do equipamento
              </div>
            </div>
          </div>
        </div>
        <div>
          <button type="submit" class="btn btn-primary btn-block" v-on:click="validate">Confirmar</button>
        </div>
      </form>
    </div>
  </div>
</div>
</template>

<script>
import {mask} from 'vue-the-mask'
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import Alert from './Alert.vue'
import firebaseApp from '../firebase-controller.js'
const db = firebaseApp.database()
export default {
  name: 'equipamento',
  data () {
    return {
      newEquipment: {
        name: '',
        patri: '',
        esp: '',
        curso: '',
        status: '',
        marca: ''
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
    cadastroRef: db.ref('equipamento')
  },
  directives: {
    mask
  },
  components: {
    Alert,
    RingLoader
  },
  methods: {
    submitNewEquip () {
      // TODO: Cadastro de equipamentos
      console.log('Equipamento cadastrado')
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
    }
  }
}
</script>

<style>

#cadastroFormEquipment {
  width: 100vw;
}
</style>
