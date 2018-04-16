<template>
<div id="cadastroLocal">
  <div class="container">
    <div class="row justify-content-center text-center">
      <h2> Cadastro de laboratorio </h2>
    </div>
    <hr />
    <div class="row justify-content-center">
      <ring-loader :loading="loader.loading" :color="loader.color" :size="loader.size"></ring-loader>
      <alert :showAlert="alert.showAlert" :dismissible="alert.dismissible" :type="alert.type" :title="alert.title" :msg="alert.msg"></alert>
      <form id="cadastroFormLocal" class="needs-validation" v-on:submit.prevent novalidate>
        <div class="form-row">
          <div class="col-md-6 mb-3">
            <label for="sala">Sala</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="salaPrepend"><i class="fas fa-map-marker"></i></span>
              </div>
              <input id="sala" type="text" class="form-control" placeholder="Digite o bloco e a sala" autocomplete="given-name" aria-describedby="salaPrepend" maxlength="4" v-model = "newLocal.class" required>
              <div class="invalid-feedback">
                Por favor informe o bloco e a sala (ex: E100)
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <label for="supervisor">Supervisor</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="supervisorPrepend"><i class="fas fa-clipboard"></i></span>
              </div>
              <select id="supervisor" class="form-control" aria-describedby="supervisorPrepend" v-model = "newLocal.supervisor" required>
                <option value="" disabled selected>Selecione o nome do supervisor</option>''
                <option>Prof 1</option>
                <option>Prof 2</option>
                <option>Prof 3</option>
              </select>
              <div class="invalid-feedback">
                Por favor selecione um supervisor.
              </div>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="col-md-12 mb-3">
            <label for="desc">Descrição</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="descPrepend"><i class="fas fa-book"></i></span>
              </div>
              <input id="desc" type="text" class="form-control" placeholder="Digite uma descrição sobre o laboratorio" autocomplete="given-name" aria-describedby="descPrepend" v-model = "newLocal.descrip">
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
    name: 'local',
    data () {
      return {
        newLocal: {
          class: '',
          descrip: '',
          supervisor: ''
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
      cadastroRef: db.ref('local')
    },
    directives: {
      mask
    },
    components: {
      Alert,
      RingLoader
    }
  }
  </script>

  <style>

  #cadastroFormLocal {
    width: 100vw;
  }
  </style>
