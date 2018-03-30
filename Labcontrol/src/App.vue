<template>
  <div id="app">
    <header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <a class="navbar-brand text-justify" href="#">LabControl</a>

        <div class="collapse navbar-collapse"  id="navbar">
          <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
            <li class="nav-item">
              <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  <main>
    <router-view></router-view>
  </main>
  <footer id="footer" class="footer" style="background-color: #DDDFE4;">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-sm-auto">
          <!-- <img src="./assets/logo_UTFPR.png" style="width:150px; margin:10%"> -->
          <p class="text-center" style="font-size:1.2em; margin: 15px 0 15px 0">CAMPUS CAMPO MOURÃO - VIA ROSALINA MARIA DOS SANTOS, 1233 CEP 87301-899 Caixa Postal: 271 Campo Mourão - PR - Brasil<br>Telefone Geral +55 (44) 3518-1400</p>
        </div>
      </div>
          </div>
          <div class="copyright" style="background-color:#C9CBD0;">
              <div class="container">
                  <div class="row">
        <small>&copy; Copyright 2018 <a href="http://portal.utfpr.edu.br/campus/campomourao" target="_blank" class="text-dark">DACOM UTFPR-CM</a> </small>
                  </div>
              </div>
          </div>
  </footer>
</div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="css">
   @import '../node_modules/bootstrap/dist/css/bootstrap.css';

   #app {
     display: flex;
     min-height: 100vh;
     flex-direction: column;
   }

   main {
     flex: 1 1 auto;
   }

</style>
