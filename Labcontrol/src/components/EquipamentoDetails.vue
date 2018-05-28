<template>
  <div id="EquipamentoDetails">
    <div class="container-fluid">
      <div v-if="loader.loading" class="row justify-content-center">
        <ring-loader :loading="loader.loading" :color="loader.color" :size="loader.size"></ring-loader>
      </div>
      <div v-else-if="action === 'view'" class="container">
        <div class="row">
          <div class="col-sm-12 col-md-6">
            <h5><strong>Patrimônio</strong>: {{equipamento.Patrimonio}}</h5>
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
            <p><strong>Local</strong><br />{{equipamento.Sala}}</p>
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
                <a href="#"  class=" mr-2 list-inline-item btn btn-primary btn-sm"> TESTE</a>
              </li>
              <li>
                <a href="#"  class="list-inline-item btn btn-primary btn-sm"> TESTE</a>
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
                <label for="nome">Nome</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="equipamentoPrepend"><i class="fas fa-flask"></i></span>
                  </div>
                  <input id="equipamento" type="text" class="form-control" placeholder="Digite o nome do equipamento" autocomplete="given-name" aria-describedby="equipamentoPrepend" v-model = "equipment.name" required>
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
                  <input id="patrimonio" type="number" class="form-control" placeholder="Digite o numero de patrimonio" autocomplete="patrimonio" aria-describedby="patrimonioPrepend" min="0" v-model = "equipment.patri" required>
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
                  <input id="esp" type="text" class="form-control" placeholder="Digite a especificação de uso" autocomplete="especificação" aria-describedby="espPrepend" v-model = "equipment.esp">
                </div>
              </div>
              <div class="col-lg-6 mb-3">
                <label for="cursoequipamento">Curso</label>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="cursoPrepend"><i class="fas fa-graduation-cap"></i></span>
                  </div>
                  <select id="cursoequipamento" class="form-control" aria-describedby="cursoequipamentoPrepend" v-model = "equipment.curso" required>
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
                  <select id="status" class="form-control" aria-describedby="statusPrepend" v-model = "equipment.status" required>
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
                  <input id="marca" type="text" class="form-control" placeholder="Digite a marca do equipamento" autocomplete="given-name" aria-describedby="equipamentoPrepend" v-model = "equipment.marca" required>
                  <div class="invalid-feedback">
                    Por favor informe a marca do equipamento
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="col-sm-6 justify-content-right">
                <button type="submit" class="btn btn-primary btn-block" >Confirmar</button>
              </div>
              <div class="col-sm-6 justify-content-left">
                <router-link :to="{ name: 'Equipamentos', params: {}}" class="btn btn-danger btn-block">Cancelar</router-link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Alert from './Alert.vue'
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import firebaseApp from '../firebase-controller.js'
const db = firebaseApp.database()
export default {
  name: 'EquipamentoDetails',
  data () {
    return {
      action: this.$route.params.action,
      equipamento: null,
      loader: {
        loading: true,
        color: '#007bff',
        size: '100px'
      },
      equipment: {
        name: '',
        patri: '',
        esp: '',
        curso: '',
        status: '',
        marca: ''
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
      _this.equipment.name = _this.equipamento.Nome
      _this.equipment.patri = _this.equipamento.Patrimonio
      _this.equipment.esp = _this.equipamento.Especificacao
      _this.equipment.curso = _this.equipamento.Curso
      _this.equipment.status = _this.equipamento.Status
      _this.equipment.marca = _this.equipamento.Marca
      _this.equipment.sala = _this.equipamento.Sala
      _this.loader.loading = false
    })
  },
  mounted: function () {
    this.validate()
  },
  methods: {
    submitEquip () {
      let form = document.getElementById('cadastroFormEquipment')
      form.classList.add('hideOn')
      this.loader.loading = true
      this.alert.showAlert = false
      let _this = this
      db.ref('Equipamentos/' + this.$route.params.key).update({
        'Nome': _this.equipment.name,
        'Patrimonio': _this.equipment.patri,
        'Especificacao': _this.equipment.esp,
        'Curso': _this.equipment.curso,
        'Status': _this.equipment.status,
        'Marca': _this.equipment.marca,
        'Sala': _this.equipment.sala
      }).then(function () {
        _this.alert.type = 'alert-success'
        _this.alert.dismissible = true
        _this.alert.title = 'Yey!'
        _this.alert.msg = 'O equipamento ' + _this.equipment.name + ', com patrimônio ' + _this.equipment.name + ', foi atualizado com sucesso!'
        _this.loader.loading = false
        _this.alert.showAlert = true
        location.reload()
        form.classList.remove('hideOn')
        console.log('completo')
      }).catch((err) => {
        _this.alert.type = 'alert-danger'
        _this.alert.dismissible = true
        _this.alert.title = 'Oops!'
        _this.alert.msg = 'O equipamento ' + _this.equipment.name + ', com patrimônio ' + _this.equipment.name + ', não foi atualizado devido ao Erro: ' + err
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
    }
  }
}
</script>

<style>
#cadastroFormEquipment {
  width: 100vw;
}
</style>
