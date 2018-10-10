
<template>
  <div id = "root">
    <header>
      <nav id = "navBar" class = "navbar navbar-expand-lg navbar-dark fixed-top nav-bg-gradient justify-content-between" style = "min-height: 70px;">
        <button id="toggler-menu-button" class="navbar-toggler d-flex" type="button" v-on:click="toggle" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon-personalized"></span>
        </button>
        <router-link to="/" class="navbar-brand text-justify">LabControl</router-link>
      </nav>
    </header>
    <main>
      <div id="wrapper" class="">

        <!-- Sidebar -->
        <div id="sidebar-wrapper">
          <ul v-if="isUser" class="sidebar-nav">
            <li class="nav-item dropdown">
              <a class="nav-link" href="#userMenu" data-toggle="collapse" aria-haspopup="true" aria-expanded="false" aria-controls="userMenu" role="button">
                Olá<span v-if="username">, {{ username }}</span>
                <span class="collapseArrow"></span>
              </a>
              <div id="userMenu" class="collapse multi-collapse text-right">
                <router-link to="/perfil" class="nav-link">Perfil</router-link>
                <a href="#" v-on:click="logout" class="nav-link">Sair</a>
              </div>
            </li>
            <li class="nav-item">
              <router-link to="/home" class="nav-link">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/reservas" class="nav-link">Reservas</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/equipamentos" class="nav-link">Equipamentos</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/locais" class="nav-link">Locais</router-link>
            </li>
            <li v-if="role === 'admin' || role === 'Supervisor'">
              <router-link to="/aulas" class="nav-link">Aulas</router-link>
            </li>
            <li v-if="role === 'admin' || role === 'Supervisor'">
              <router-link to="/cursos" class="nav-link">Cursos</router-link>
            </li>
            <li v-if="role === 'admin'">
              <router-link to="/usuarios" class="nav-link">Usuários</router-link>
            </li>
          </ul>
          <ul v-else class="sidebar-nav">
            <li class="nav-item">
              <router-link to="/login" class="nav-link">Login</router-link>
            </li>
          </ul>
        </div>
        <!-- End sidebar -->

        <div id="page-content-wrapper">
          <router-view></router-view>
          <notifications group="notify" />
        </div>
      </div>
    </main>
  </div>
</template>
