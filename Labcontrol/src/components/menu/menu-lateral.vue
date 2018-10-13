<template>
  <a-layout-sider id = "menu"
    :trigger = "null"
    collapsible
    v-model = "collapsed"
    v-if = "isUser"
  >
    <div class = "logo"/>

    <a-menu theme = "dark" mode = "inline" :selectedKeys = "[this.menuKey]">
      <a-menu-item key = "home">
        <a-icon type = "home" />
        <span> Home </span>
        <router-link to = "/home" class = "nav-link" />
      </a-menu-item>
      
      <a-menu-item key = "reservas">
        <a-icon type = "database" />
        <span> Reservas </span>
        <router-link to = "/reservas" class = "nav-link" />
      </a-menu-item>

      <a-menu-item key = "equipamentos">
        <a-icon class = "fa fa-flask" />
        <span> Equipamentos </span>
        <router-link to = "/equipamentos" class = "nav-link" />
      </a-menu-item>

      <a-menu-item key = "locais">
        <a-icon class = "fa fa-map-marker-alt" />
        <span> Locais </span>
        <router-link to = "/locais" class = "nav-link" />
      </a-menu-item>

      <a-menu-item v-if = "role === 'admin' || role === 'Supervisor'" key = "aulas">
        <a-icon type = "schedule" />
        <span> Aulas </span>
        <router-link to = "/aulas" class = "nav-link" />
      </a-menu-item>

      <a-menu-item v-if = "role === 'admin' || role === 'Supervisor'" key = "cursos">
        <a-icon type = "book" />
        <span> Cursos </span>
        <router-link to = "/cursos" class = "nav-link" />
      </a-menu-item>

      <a-menu-item v-if = "role === 'admin'" key = "usuarios">
        <a-icon class = "fa fa-users" />
        <span> Usuários </span>
        <router-link to = "/usuarios" class = "nav-link" />
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script>
  export default {
    name: 'Menu',
    props: {
      collapsed: { type: Boolean, default: false, required: true },
      isUser: { type: Boolean, default: null, required: true },
      menuKey: { type: String, default: '', required: true },
      role: { type: String, default: '', required: true }
    }
  }
</script>