<template>
      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <div class="card border-secondary mb-3">
              <div class="card-header text-center"><h1>Resumo do dia</h1></div>
              <div class="card-body  justify-content-center">
                <div class="row" style="min-height: 8rem;">
                  <div class="col-sm-12 col-md-6 d-flex justify-content-center justify-content-sm-center justify-content-md-end">
                    <div class="card text-white bg-primary mb-3 text-center vertical-center" style="max-width: 5rem; min-width: 5rem; max-height:5rem; min-height:5rem">
                      <div class="card-header" style="padding:0;">{{ month }}</div>
                      <div class="card-body" style="padding:0;">
                        
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6 d-flex justify-content-center justify-content-sm-center justify-content-md-start">
                    <h3 class="card-title text-sm-center text-md-left vertical-center">
                      <span style="font-size: 1.5rem;">
                        <i class="far fa-clock"></i>
                      </span>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          
        </div>
      </div>
</template>

<script>
export default {
  name: 'ResumoComum',
  props: {
    month: {type: String, default: 'Jan', required: true}
  }
}
</script>
