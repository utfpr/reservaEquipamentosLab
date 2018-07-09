<template>
  <div id="Reservas">
    <div class="container-fluid">
      <div v-if="loader.loading" class="row justify-content-center">
        <ring-loader :loading="loader.loading" :color="loader.color" :size="loader.size"></ring-loader>
      </div>
      <div v-if="!loader.loading" class="row">
        <div class="col-12 col-lg-10 justify-content-center">
          <div class="input-group">
            <input v-on:keyup="search()" id="search" type="text" class="form-control"  aria-label="Campo de pesquisa" placeholder="Buscar...">
            <div class="input-group-append">
              <button v-on:click="search()" type="button" class="btn btn-outline-secondary">{{filtroAtivo}}</button>
              <button type="button" class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="sr-only">Filtro</span>
              </button>
              <div class="dropdown-menu">
                <span v-for="filtro in filtros" v-on:click="selectFilter(filtro)" class="dropdown-item">{{filtro}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-2 text-center">
          <router-link to="/reservar" class="justify-content-center mt-2 mt-md-0 btn btn-outline-primary btn-block">Novo</router-link>
        </div>
      </div>
      <div v-if="!loader.loading" class="row mt-4 justify-content-center text-center">
        <h2> Reservas </h2>
      </div>
      <div v-if="!loader.loading" class="row">
        <v-dialog/>
        <div class="col-12">
          <h4 v-if="reservas.length === 0" class=" text-center mt-5"> Nenhuma reserva encontrada </h4>
          <table v-else class="table table-responsive-md table-hover text-center">
            <thead>
              <tr>
                <th scope="col"><span v-on:click="orderBy('Periodo')">Período</span></th>
                <th scope="col"><span v-on:click="orderBy('Equipamento')">Equipamento</span></th>
                <th scope="col"><span v-on:click="orderBy('Local')">Local</span></th>
                <th scope="col"><span v-on:click="orderBy('Solicitante')">Solicitante</span></th>
                <th scope="col"><span v-on:click="orderBy('Status')">Status</span></th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="reserva in reservas">
                <td>{{periodoFormatado(reserva[1].Inicio, reserva[1].Fim)}}</td>
                <td>{{reserva[1].Equipamento}} - {{reserva[2].Nome}}</td>
                <td>{{reserva[2].Local}}</td>
                <td>{{reserva[3].RA}} - {{reserva[3].Nome}}</td>
                <td>{{reserva[1].Status}}</td>
                <td>
                  <ul class="list-inline d-inline-flex">
                    <li>
                      <router-link :to="{ name: 'ReservaDetails', params: {key: reserva[0], action: 'view'}}" class="mr-2 list-inline-item btn btn-primary btn-sm">Vizualizar</router-link>
                    </li>
                    <li>
                      <router-link :to="{ name: 'ReservaDetails', params: {key: reserva[0], action: 'edit'}}" class="mr-2 list-inline-item btn btn-primary btn-sm">Editar</router-link>
                    </li>
                    <li v-if="role === 'Supervisor' || role === 'admin'">
                      <span v-if="reserva[1].Status === 'Confirmada' || reserva[1].Status === 'Cancelada'"  class="mr-2 list-inline-item btn btn-primary btn-sm disabled">Confirmar</span>
                      <span v-else class="mr-2 list-inline-item btn btn-primary btn-sm" v-on:click="confirmaConfirmarReserva(reserva)">Confirmar</span>
                    </li>
                    <li>
                      <span v-if="reserva[1].Status === 'Cancelada'" class="list-inline-item btn btn-danger btn-sm disabled">Cancelar</span>
                      <span v-else class="list-inline-item btn btn-danger btn-sm" v-on:click="confirmaCancelarReserva(reserva)">Cancelar</span>
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {sendEmail} from '../../emailAPI.js'
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import firebaseApp from '../../firebase-controller.js'
const auth = firebaseApp.auth()
const db = firebaseApp.database()
export default {
  name: 'reservas',
  data () {
    return {
      filtros: ['Período', 'RA', 'Patrimônio', 'Nome', 'Status'],
      filtroAtivo: '',
      reservas: [],
      role: null,
      userEmail: null,
      loader: {
        loading: true,
        color: '#007bff',
        size: '100px'
      }
    }
  },
  components: {
    RingLoader
  },
  created: function () {
    this.filtroAtivo = this.filtros[0]
    var _this = this
    db.ref('Usuarios/' + auth.currentUser.uid).on('value', function (snapshot) {
      _this.loader.loading = true
      _this.role = snapshot.val().role
      _this.userEmail = snapshot.val().Email
      _this.loader.loading = false
    })
  },
  mounted: function () {
    var _this = this
    if (this.role === 'Supervisor' || this.role === 'admin') {
      db.ref('Reservas/equipamentos').on('value', function (snapshot) {
        _this.loader.loading = true
        _this.reservas = []
        snapshot.forEach(function (childSnapshot) {
          db.ref('Equipamentos/' + childSnapshot.val().Equipamento).on('value', function (equipamento) {
            db.ref('Usuarios/' + childSnapshot.val().Solicitante).on('value', function (soliciante) {
              _this.reservas.push([childSnapshot.key, childSnapshot.val(), equipamento.val(), soliciante.val()])
            })
          })
        })
        _this.loader.loading = false
      })
    } else if (this.role === 'Comum') {
      db.ref('Reservas/equipamentos').orderByChild('Solicitante').equalTo(auth.currentUser.uid).on('value', function (snapshot) {
        _this.loader.loading = true
        _this.reservas = []
        snapshot.forEach(function (childSnapshot) {
          db.ref('Equipamentos/' + childSnapshot.val().Equipamento).on('value', function (equipamento) {
            db.ref('Usuarios/' + childSnapshot.val().Solicitante).on('value', function (soliciante) {
              _this.reservas.push([childSnapshot.key, childSnapshot.val(), equipamento.val(), soliciante.val()])
            })
          })
        })
        _this.loader.loading = false
      })
    }
  },
  methods: {
    periodoFormatado (inicio, fim) {
      return this.$moment(new Date(inicio)).format('[De] DD/MM/YYYY [às] HH:mm [até] ') + this.$moment(new Date(fim)).format('DD/MM/YYYY [às] HH:mm')
    },
    confirmaCancelarReserva (reserva) {
      this.$modal.show('dialog', {
        title: 'Cuidado!',
        text: 'Realmente deseja <b>cancelar</b> esta reserva?<br><i>Essa ação não poderá ser desfeita</i>',
        buttons: [
          {
            title: 'Cancelar Reserva',
            handler: () => {
              this.$modal.hide('dialog')
              this.cancelarReserva(reserva)
            }
          },
          {
            title: 'Sair',
            default: true
          }
        ]
      })
    },
    cancelarReserva (reserva) {
      db.ref('Reservas/equipamentos').child(reserva[0]).update({
        'Status': 'Cancelada'
      })
      let to = [auth.currentUser.displayName + ' <' + this.userEmail + '>']
      let subject = 'Reserva de equipamento cancelada'
      let textBody = 'Sua resersa foi cancelada'
      let htmlBody = '<h3>Reserva cancelada</h3><br><p>Sua reserva do equipamento: <strong>' + reserva[1].Equipamento + ' - ' + reserva[2].Nome + '</strong> no local <strong>' + reserva[2].Local + '</strong> no período: <strong>' + (this.$moment(new Date(reserva[1].Inicio)).format('[De] DD/MM/YYYY [às] HH:mm [até] ') + this.$moment(new Date(reserva[1].Fim)).format('DD/MM/YYYY [às] HH:mm')) + '</strong> foi <strong>cancelada</strong> pelo responsável.</p><p><strong>Motivo do cancelamento: </strong></p><small>Este é um E-mail automático, por favor não responda</small>'
      sendEmail(to, subject, textBody, htmlBody)
      this.$notify({
        group: 'notify',
        type: 'success',
        title: 'Yey!',
        text: 'Reserva <b>cancelada</b> com sucesso'
      })
    },
    confirmaConfirmarReserva (reserva) {
      this.$modal.show('dialog', {
        title: 'Confirmar reserva',
        text: 'Realmente deseja <b>confirmar</b> esta reserva?<br><i>Você poderá cancelá-la depois</i>',
        buttons: [
          {
            title: 'Confirmar Reserva',
            handler: () => {
              this.$modal.hide('dialog')
              this.confirmarReserva(reserva)
            }
          },
          {
            title: 'Sair',
            default: true
          }
        ]
      })
    },
    confirmarReserva (reserva) {
      db.ref('Reservas/equipamentos').child(reserva[0]).update({
        'Status': 'Confirmada'
      })
      let to = [auth.currentUser.displayName + ' <' + this.userEmail + '>']
      let subject = 'Reserva de equipamento confirmada'
      let textBody = 'Sua resersa foi confirmada'
      let htmlBody = '<h3>Reserva confirmada</h3><br><p>Sua reserva do equipamento: <strong>' + reserva[1].Equipamento + ' - ' + reserva[2].Nome + '</strong> no local <strong>' + reserva[2].Local + '</strong> no período: <strong>' + (this.$moment(new Date(reserva[1].Inicio)).format('[De] DD/MM/YYYY [às] HH:mm [até] ') + this.$moment(new Date(reserva[1].Fim)).format('DD/MM/YYYY [às] HH:mm')) + '</strong> foi <strong>confirmada</strong> pelo responsável.</p><p>Cuide bem do equipamento e não deixe de ler o POP disponível no sitema de reservas caso tenha dúvidas</p><small>Este é um E-mail automático, por favor não responda</small>'
      sendEmail(to, subject, textBody, htmlBody)
      this.$notify({
        group: 'notify',
        type: 'success',
        title: 'Yey!',
        text: 'Reserva <b>confirmada</b> com sucesso'
      })
    },
    selectFilter (filtro) {
      this.filtroAtivo = filtro
    },
    search () {
      let pesquisa = document.getElementById('search').value
      var _this = this
      if (pesquisa) {
        if (this.filtroAtivo === 'Patrimônio') {
          if (this.role === 'Supervisor' || this.role === 'admin') {
            db.ref('Reservas/equipamentos').orderByChild('Equipamento').startAt(pesquisa).endAt(pesquisa + '\uf8ff').on('value', function (snapshot) {
              _this.loader.loading = true
              _this.reservas = []
              snapshot.forEach(function (childSnapshot) {
                db.ref('Equipamentos/' + childSnapshot.val().Equipamento).on('value', function (equipamento) {
                  db.ref('Usuarios/' + childSnapshot.val().Solicitante).on('value', function (soliciante) {
                    _this.reservas.push([childSnapshot.key, childSnapshot.val(), equipamento.val(), soliciante.val()])
                  })
                })
              })
              _this.loader.loading = false
            })
          } else if (this.role === 'Comum') {
            db.ref('Reservas/equipamentos').orderByChild('Equipamento').startAt(pesquisa).endAt(pesquisa + '\uf8ff').on('value', function (snapshot) {
              _this.loader.loading = true
              _this.reservas = []
              snapshot.forEach(function (childSnapshot) {
                if (childSnapshot.val().Solicitante === auth.currentUser.uid) {
                  db.ref('Equipamentos/' + childSnapshot.val().Equipamento).on('value', function (equipamento) {
                    db.ref('Usuarios/' + childSnapshot.val().Solicitante).on('value', function (soliciante) {
                      _this.reservas.push([childSnapshot.key, childSnapshot.val(), equipamento.val(), soliciante.val()])
                    })
                  })
                }
              })
              _this.loader.loading = false
            })
          }
        } else if (this.filtroAtivo === 'Nome') {
          if (this.role === 'Supervisor' || this.role === 'admin') {
            db.ref('Reservas/equipamentos').on('value', function (snapshot) {
              _this.loader.loading = true
              _this.reservas = []
              snapshot.forEach(function (childSnapshot) {
                db.ref('Equipamentos').orderByChild('Nome').startAt(pesquisa).endAt(pesquisa + '\uffff').on('value', function (equipamento) {
                  if (childSnapshot.val().Equipamento === equipamento.key) {
                    db.ref('Usuarios/' + childSnapshot.val().Solicitante).on('value', function (soliciante) {
                      _this.reservas.push([childSnapshot.key, childSnapshot.val(), equipamento.val(), soliciante.val()])
                    })
                  }
                })
              })
              _this.loader.loading = false
            })
          } else if (this.role === 'Comum') {
            db.ref('Reservas/equipamentos').orderByChild('Solicitante').equalTo(auth.currentUser.uid).on('value', function (snapshot) {
              _this.loader.loading = true
              _this.reservas = []
              snapshot.forEach(function (childSnapshot) {
                db.ref('Equipamentos').orderByChild('Nome').startAt(pesquisa).endAt(pesquisa + '\uffff').on('value', function (equipamento) {
                  if (childSnapshot.val().Equipamento === equipamento.key) {
                    db.ref('Usuarios/' + childSnapshot.val().Solicitante).on('value', function (soliciante) {
                      _this.reservas.push([childSnapshot.key, childSnapshot.val(), equipamento.val(), soliciante.val()])
                    })
                  }
                })
              })
              _this.loader.loading = false
            })
          }
        } else if (this.filtroAtivo === 'Status') {
          if (this.role === 'Supervisor' || this.role === 'admin') {
            db.ref('Reservas/equipamentos').orderByChild('Status').equalTo(pesquisa).on('value', function (snapshot) {
              _this.loader.loading = true
              _this.reservas = []
              snapshot.forEach(function (childSnapshot) {
                db.ref('Equipamentos/' + childSnapshot.val().Equipamento).on('value', function (equipamento) {
                  db.ref('Usuarios/' + childSnapshot.val().Solicitante).on('value', function (soliciante) {
                    _this.reservas.push([childSnapshot.key, childSnapshot.val(), equipamento.val(), soliciante.val()])
                  })
                })
              })
              _this.loader.loading = false
            })
          } else if (this.role === 'Comum') {
            db.ref('Reservas/equipamentos').orderByChild('Status').equalTo(pesquisa).on('value', function (snapshot) {
              _this.loader.loading = true
              _this.reservas = []
              snapshot.forEach(function (childSnapshot) {
                if (childSnapshot.val().Solicitante === auth.currentUser.uid) {
                  db.ref('Equipamentos/' + childSnapshot.val().Equipamento).on('value', function (equipamento) {
                    db.ref('Usuarios/' + childSnapshot.val().Solicitante).on('value', function (soliciante) {
                      _this.reservas.push([childSnapshot.key, childSnapshot.val(), equipamento.val(), soliciante.val()])
                    })
                  })
                }
              })
              _this.loader.loading = false
            })
          }
        }
      } else {
        if (this.role === 'Supervisor' || this.role === 'admin') {
          db.ref('Reservas/equipamentos').on('value', function (snapshot) {
            _this.loader.loading = true
            _this.reservas = []
            snapshot.forEach(function (childSnapshot) {
              db.ref('Equipamentos/' + childSnapshot.val().Equipamento).on('value', function (equipamento) {
                db.ref('Usuarios/' + childSnapshot.val().Solicitante).on('value', function (soliciante) {
                  _this.reservas.push([childSnapshot.key, childSnapshot.val(), equipamento.val(), soliciante.val()])
                })
              })
            })
            _this.loader.loading = false
          })
        } else if (this.role === 'Comum') {
          db.ref('Reservas/equipamentos').orderByChild('Solicitante').equalTo(auth.currentUser.uid).on('value', function (snapshot) {
            _this.loader.loading = true
            _this.reservas = []
            snapshot.forEach(function (childSnapshot) {
              db.ref('Equipamentos/' + childSnapshot.val().Equipamento).on('value', function (equipamento) {
                db.ref('Usuarios/' + childSnapshot.val().Solicitante).on('value', function (soliciante) {
                  _this.reservas.push([childSnapshot.key, childSnapshot.val(), equipamento.val(), soliciante.val()])
                })
              })
            })
            _this.loader.loading = false
          })
        }
      }
    },
    orderBy (campo) {
      console.log('chamado')
      if (campo === 'Data') {
        this.reservas.sort(function (a, b) {
          if (a[1].Data > b[0].Data) {
            return 1
          }
          if (a[0].Data < b[0].Data) {
            return -1
          }
          return 0
        })
      } else if (campo === 'Periodo') {
        this.reservas.sort(function (a, b) {
          if (a[1].PeriodoInicio > b[1].PeriodoInicio) {
            return 1
          }
          if (a[1].PeriodoInicio < b[1].PeriodoInicio) {
            return -1
          }
          return 0
        })
      } else if (campo === 'Equipamento') {
        console.log(this.reservas)
        this.reservas.sort(function (a, b) {
          if (a[1].Equipamento > b[1].Equipamento) {
            console.log('qualquertexot')
            return 1
          }
          if (a[1].Equipamento < b[1].Equipamento) {
            console.log('logo')
            return -1
          }
          return 0
        })
      } else if (campo === 'RA') {
        this.reservas.sort(function (a, b) {
          if (a[1].RA > b[1].RA) {
            return 1
          }
          if (a[1].RA < b[1].RA) {
            return -1
          }
          return 0
        })
      } else if (campo === 'Estado') {
        this.reservas.sort(function (a, b) {
          if (a[1].Status > b[1].Status) {
            return 1
          }
          if (a[1].Status < b[1].Status) {
            return -1
          }
          return 0
        })
      }
      console.log('terminado')
    }
  }
}
</script>

<style lang="css">
</style>
