<template>
  <a-layout id = "components-layout-demo-custom-trigger">
    <a-layout-sider
      :trigger = "null"
      collapsible
      v-model = "collapsed"
      v-if = "isUser">

      <div class = "logo"/>

      <a-menu theme = "dark" mode = "inline" :selectedKeys = "[this.menuKey]">
        <a-menu-item key = "home">
          <a-icon type = "home" />
          <span> Home </span>
          <router-link to = "/home" />
        </a-menu-item>
        
        <a-menu-item key = "reservas">
          <a-icon type = "database" />
          <span> Reservas </span>
          <router-link to = "/reservas" />
        </a-menu-item>

        <a-menu-item key = "equipamentos">
          <a-icon class = "fa fa-flask" />
          <span> Equipamentos </span>
          <router-link to = "/equipamentos" />
        </a-menu-item>

        <a-menu-item key = "locais">
          <a-icon class = "fa fa-map-marker-alt" />
          <span> Locais </span>
          <router-link to = "/locais" />
        </a-menu-item>

        <a-menu-item v-if = "role === 'admin' || role === 'Supervisor'" key = "aulas">
          <a-icon type = "schedule" />
          <span> Aulas </span>
          <router-link to = "/aulas" />
        </a-menu-item>

        <a-menu-item v-if = "role === 'admin' || role === 'Supervisor'" key = "cursos">
          <a-icon type = "book" />
          <span> Cursos </span>
          <router-link to = "/cursos" />
        </a-menu-item>

        <a-menu-item v-if = "role === 'admin' || role === 'Supervisor'" key = "disciplinas">
          <a-icon type = "schedule" />
          <span> Disciplinas </span>
          <router-link to = "/disciplinas" />
        </a-menu-item>

        <a-menu-item v-if = "role === 'admin'" key = "usuarios">
          <a-icon class = "fa fa-users" />
          <span> Usuários </span>
          <router-link to = "/usuarios" />
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header v-if = "isUser" style = "background: #fff; padding: 0">
        <a-row>
          <a-col :span = "20">
            <a-icon class = "trigger" :type = "collapsed ? 'menu-unfold' : 'menu-fold'" @click = "() => collapsed = !collapsed" />
          </a-col>
          
          <a-col :span = "4">
            <a-dropdown>
              <a-menu slot = "overlay">
                <a-menu-item key = "perfil">
                  <router-link to = "/perfil">
                    <a-icon type = "idcard" />
                    <span> Perfil </span>
                  </router-link>
                </a-menu-item>

                <a-menu-item v-if = "role === 'admin'" key = "configuracoes">
                  <router-link to = "/configuracoes">
                    <a-icon type = "setting" />
                    <span> Configurações </span>
                  </router-link>
                </a-menu-item>

                <a-menu-item v-on:click = "logout" key = "logout">
                  <a-icon type = "logout" /> Sair
                </a-menu-item>
              </a-menu>

              <a-button style = "margin-left: 8">
                <a-icon type = "user" style = "font-size: '18px', margin-top: '5px'" />
                <span v-if = "username"> Olá, {{ username }} </span>
              </a-button>
            </a-dropdown>
          </a-col>
        </a-row>
      </a-layout-header>

      <a-layout-content :style = "{ margin: '24px 16px', padding: '24px', background: '#fff' }">
        <div id = "page-content-wrapper">
          <router-view></router-view>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
  import firebaseApp from './firebase-controller.js'
  import firebase from 'firebase'

  const auth = firebaseApp.auth()
  const db = firebaseApp.database()

  export default {
    name: 'app',
    data () {
      return {
        menuKey: '',
        role: null,
        username: null,
        isUser: null,
        reauthenticate: {
          email: null,
          password: null
        },
        collapsed: false
      }
    },
    updated () {
      this.menuKey = this.$route.meta.menuKey
    },
    mounted () {
      this.$Progress.finish()
    },
    created () {
      let _this = this
  
      this.$Progress.start()

      this.$router.beforeEach((to, from, next) => {
        this.$Progress.start()
        next()
      })

      this.$router.afterEach((to, from) => {
        this.isUser = auth.currentUser
        db.ref('Usuarios/' + auth.currentUser.uid + '/role').on('value', function (snapshot) {
          _this.role = snapshot.val()
        })

        if (auth.currentUser) {
          this.username = auth.currentUser.displayName
          if (!auth.currentUser.emailVerified && !this.$route.query.mode) {
            this.$router.replace('/verificar-email')
          }
        }
        this.$Progress.finish()
      })
    },
    methods: {
      logout: function () {
        if (this.$root.toggled) {
          this.toggle()
        }
        auth.signOut()
        this.$router.replace('/login')
      },
      toggle: function () {
        let wrapper = document.getElementById('wrapper')
        if (this.$root.toggled) {
          wrapper.classList.remove('toggled')
        } else {
          wrapper.classList.add('toggled')
        }
        this.$root.toggled = !this.$root.toggled
      },
      reauthentication () {
        let _this = this

        const credentialLogin = firebase.auth.EmailAuthProvider.credential(this.reauthenticate.email, this.reauthenticate.password)
        auth.currentUser.reauthenticateWithCredential(credentialLogin).then(function () {
          if ((_this.$children[(_this.$children.length) - 1].action) === 'deleteAccount') {
            _this.$children[(_this.$children.length) - 1].deleteAccount()
          } else if ((_this.$children[(_this.$children.length) - 1].action) === 'editProfile') {
            _this.$children[(_this.$children.length) - 1].editProfile()
          }
        }).catch(function (err) {
          _this.$notification.error({
            message: 'Opps..',
            description: 'Falha ao autenticar.'
          })
          console.log('Falha de reautenticação: ' + err)
        })
      },
      validate: function () {
        let _this = this

        var form = document.getElementById('reauthenticate')
        form.addEventListener('submit', function (event) {
          if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
          } else {
            _this.reauthentication()
          }
          form.classList.add('was-validated')
        }, false)
      }
    }
  }
</script>

<style>
  #components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color .3s;
  }

  #components-layout-demo-custom-trigger .trigger:hover {
    color: #1890ff;
  }

  #components-layout-demo-custom-trigger .logo {
    height: 32px;
    margin: 16px;
    background-image: url('/static/img/logo_utf.png');
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
  }

  #components-layout-demo-custom-trigger {
    min-height: 100%;
  }
</style>
