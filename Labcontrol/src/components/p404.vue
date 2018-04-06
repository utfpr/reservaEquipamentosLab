<template>
  <div class="p404">
    <div class="e404 vertical-center"></div>
    <div class="container">
      <div class="row justify-content-center">
        <div class="home">
          <router-link to="/home" class="btn btn-dark">Ir para Home</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'p404',
  data () {
    return {}
  },
  mounted: function () {
    let elements = document.getElementsByTagName('footer')
    elements[0].classList.add('hideOn')

    let main = document.getElementsByTagName('main')
    main[0].setAttribute('style', 'margin-top: 55px!important;')
  },
  destroyed: function () {
    let elements = document.getElementsByTagName('footer')
    elements[0].classList.remove('hideOn')

    let main = document.getElementsByTagName('main')
    main[0].setAttribute('style', '')
  },
  methods: {}
}
</script>



<style>

.p404::before {
  content: "";
  position: fixed;
  left: 0;
  right: 0;
  z-index: -1;

  display: block;
  background-position: center;
  background-size:cover;
  width: 100vw;
  height: 100vh;
  background-image: url('../assets/img/404_back.svg');
}


@media (min-width: 0px) {
  .e404 {
    content: "";
    position: fixed;
    left: 0;
    right: 0;
    width: 100%;
    background-image: url('../assets/img/404_front.svg');
    background-size: cover;
    background-position: center;
    height: 0;
    padding: 0; /* reset */
    padding-bottom: 100%;
  }

  .home {
    position: fixed;
    top: 65%;
  }
}

@media (min-width: 992px) {
  .e404 {
    position: fixed;
    left: 0;
    right: 0;
    width: 100%;
    background-image: url('../assets/img/404_front.svg');
    background-size: cover;
    background-position: center;
    height: 0;
    padding: 0; /* reset */
    padding-bottom: 50%;
  }

  .home {
    position: fixed;
    top: 70%;
  }

}

</style>
