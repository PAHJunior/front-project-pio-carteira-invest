<template>
  <q-page padding>
    <div class="row">
      <div class="col-12">
        <q-table
          table-header-class="text-secondary"
          dense
          row-key="id"
          rows-per-page-label="Registros por página"
          :data="data"
          :columns="columns"
          :loading="loadingTable"
          :pagination="{rowsPerPage: 5}"
          :filter="filter"
        >
          <template v-slot:top="props">
            <q-space />
            <div class="col-md-7 col-12 row q-col-gutter-sm">
              <div class="row col-md-5 col-sm-5 col-xs-12">
                <q-input
                  outlined
                  dense
                  class="col-12"
                  debounce="300"
                  v-model="filter"
                  placeholder="Pesquisar"
                >
                  <template v-slot:append>
                    <q-btn
                      flat
                      dense
                      @click="getAllInvestmentsByUser"
                      icon="search"
                    />
                  </template>
                </q-input>
              </div>

              <div class="row col-md-5 col-sm-5 col-xs-12">
                <q-btn
                  class="col-12"
                  outline
                  dense
                  color="secondary"
                  label="ADICIONAR ATIVO"
                  @click="openDialogInvestment(null)"
                />
              </div>

              <div class="row col-2">
                <q-btn
                  class="col-12"
                  flat
                  round
                  dense
                  :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                  @click="props.toggleFullscreen"
                />
              </div>
            </div>
          </template>

          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
              >
                {{ col.label }}
              </q-th>
              <q-th auto-width />
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr
              :props="props"
            >
              <q-td
                v-for="(coluna) in columns"
                :key="coluna.name"
                :props="props"
                @click="openDialogInvestment(props.row)"
              >
                <div class="cursor-pointer">
                  {{ props.row[coluna.name] }}
                </div>
              </q-td>
              <q-td auto-width>
                <q-btn
                  size="sm"
                  color="negative"
                  round
                  flat
                  dense
                  @click="deleteInvestment(props.row)"
                  icon="delete"
                />
              </q-td>
            </q-tr>
          </template>

        </q-table>
      </div>

      <div class="col-md-6 col-xs-12 col-sm-6">
        <Donut
          :series="seriesTypes"
          :labels="labelsTypes"
        >
        </Donut>
      </div>
      <div class="col-md-6 col-xs-12 col-sm-6">
        <Donut
          :series="seriesCodes"
          :labels="labelsCodes"
        >
        </Donut>
      </div>
    </div>

    <q-dialog v-model="dialogInvestment" persistent>
      <q-card>
        <q-bar class="bg-secondary bg-white">
          <q-space />
          <q-btn
            dense
            flat
            color="secondary"
            icon="close"
            v-close-popup />
        </q-bar>

        <q-card-actions class="col-12" align="right">
          <q-form
            class="row col-12"
            greedy
            ref="formInvestment"
          >
            <div class="row col-12 q-col-gutter-sm">
              <div class="col-6">
                <q-select
                  label="Tipo do investmento"
                  outlined
                  dense
                  v-model="investment.typeInvestment"
                  ref="investmenttypeInvestment"
                  clearable
                  :options="options"
                  :rules="[ val => val !== null || 'Por favor selecione uma opção']"
                  hide-bottom-space
                  lazy-rules
                />
              </div>

              <div class="col-6">
                <q-input
                  outlined
                  dense
                  v-model="investment.value"
                  ref="investmentValue"
                  label="Valor *"
                  hide-bottom-space
                  lazy-rules
                  mask="###,##"
                  reverse-fill-mask
                  :rules="[validadeValue]"
                />
              </div>

              <div class="col-6">
                <q-input
                  outlined
                  dense
                  v-model="investment.code"
                  ref="investmentCode"
                  label="Codigo do ativo *"
                  hide-bottom-space
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Preencha o campo']"
                />
              </div>

              <div class="col-6">
                <q-input
                  outlined
                  dense
                  v-model="investment.amount"
                  ref="investmentAmount"
                  label="Quantidade *"
                  hide-bottom-space
                  lazy-rules
                  :rules="[ val => val && val > 0 || 'Informe um valor maior que zero']"
                />
              </div>

              <div class="col-12">
                <q-input
                  dense
                  outlined
                  readonly
                  label="Data de compra"
                  ref="investmentDate"
                  v-model="investment.date"
                  mask="##-##-####"
                  :rules="[ val => val && val.length > 9 || 'Preencha o campo']"
                >
                  <template v-slot:append>
                    <q-icon
                      name="event"
                      class="cursor-pointer"
                    >
                      <q-popup-proxy
                        ref="qDateProxy"
                        transition-show="scale"
                        transition-hide="scale">
                        <q-date mask="DD-MM-YYYY" v-model="investment.date">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-12 row justify-center">
                <q-btn
                  :label="investment.id ? 'Modificar' : 'Cadastrar'"
                  color="primary"
                  @click="investment.id ? updateInvestment() : createInvestment()"
                  class="col-6"
                />
              </div>
            </div>
          </q-form>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { Notify, LocalStorage } from 'quasar';
import Donut from '@/components/Donut.vue';
import Investments from '../services/investments';
import Graphics from '../services/graphics';

export default {
  components: {
    Donut,
  },
  mounted() {
    this.finds();
  },
  methods: {
    finds() {
      this.getAllInvestmentsByUser();
      this.findAndCountTypeInvestments();
      this.findAndCountCodeInvestments();
    },
    validadeValue(value) {
      let price = value.toString().replace(/\./g, '');
      price = price.replace(/,/g, '.');

      if (parseFloat(price) <= 0) {
        return 'Informe um valor maior do que zero';
      }
      return true;
    },
    openDialogInvestment(investment) {
      this.dialogInvestment = !this.dialogInvestment;
      this.investment = {
        userID: this.user.uid,
        id: investment ? investment.id : null,
        typeInvestment: investment ? investment.typeInvestment : 'Renda Variável',
        code: investment ? investment.code : '',
        value: investment ? investment.value : 0.0,
        amount: investment ? investment.amount : 0,
        date: investment ? investment.date : null,
      };
    },
    findAndCountCodeInvestments() {
      const query = {
        userID: this.user.uid,
      };

      Graphics.findAndCountCodeInvestments(query)
        .then((result) => {
          this.seriesCodes = result.data.series;
          this.labelsCodes = result.data.labels;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    findAndCountTypeInvestments() {
      const query = {
        userID: this.user.uid,
      };

      Graphics.findAndCountTypeInvestments(query)
        .then((result) => {
          this.seriesTypes = result.data.series;
          this.labelsTypes = result.data.labels;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getAllInvestmentsByUser() {
      const query = {
        userID: this.user.uid,
      };

      this.loadingTable = true;
      Investments.getAllInvestments(query)
        .then((result) => {
          this.data = result.data.investments.map((investment) => ({
            id: investment._id, // eslint-disable-line no-param-reassign, no-underscore-dangle
            code: investment.code,
            typeInvestment: investment.typeInvestment,
            value: parseFloat(investment.value).toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              currency: 'BRL',
            }),
            amount: investment.amount,
            total: parseFloat(investment.total).toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              currency: 'BRL',
            }),
            date: investment.date,
          }));
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.loadingTable = false;
        });
    },
    createInvestment() {
      this.$refs.formInvestment.validate()
        .then((success) => {
          if (success) {
            Investments.createInvestment(this.investment)
              .then(() => {
                Notify.create({
                  color: 'secondary',
                  message: 'Investimento cadastrado com sucesso',
                  icon: 'thumb_up_alt',
                });
                this.dialogInvestment = false;
              })
              .finally(() => {
                this.finds();
              });
          }
        });
    },
    updateInvestment() {
      this.$refs.formInvestment.validate()
        .then((success) => {
          if (success) {
            Investments.updateInvestment(this.investment.id, this.investment)
              .then(() => {
                Notify.create({
                  progress: true,
                  color: 'secondary',
                  message: 'Dados atualizados com sucesso',
                  icon: 'thumb_up_alt',
                });
                this.dialogInvestment = false;
              })
              .finally(() => {
                this.finds();
              });
          }
        });
    },
    deleteInvestment(investment) {
      this.$q.dialog({
        title: 'Aviso',
        message: 'Deseja mesmo deletar o registro?',
        ok: {
          label: 'Sim, desejo deletar',
        },
        cancel: {
          flat: true,
          color: 'negative',
          label: 'não',
        },
        focus: true,
        persistent: true,
      }).onOk(() => {
        Investments.deleteInvestment(investment.id)
          .then(() => {
            Notify.create({
              progress: true,
              color: 'secondary',
              message: 'Registro deletado com sucesso',
              icon: 'thumb_up_alt',
            });
          })
          .finally(() => {
            this.finds();
          });
      }).onCancel(() => {
      });
    },
  },
  name: 'Dashboard',
  data() {
    return {
      user: LocalStorage.getItem('user'),
      investment: {
        id: null,
        code: '',
        typeInvestment: 'Renda Variável',
        value: 0.00,
        amount: 0,
        date: null,
      },
      dialogInvestment: false,
      loadingTable: false,
      filter: '',
      floatingLabel: false,
      moneyFormatForDirective: {
        decimal: '.',
        thousands: ',',
        prefix: '$ ',
        suffix: ' #',
        precision: 2,
        masked: false, /* doesn't work with directive */
      },
      options: ['Renda Variável', 'Renda Fixa'],
      columns: [
        {
          name: 'code',
          align: 'left',
          label: 'Codigo',
          field: 'code',
          required: true,
          sortable: true,
        },
        {
          name: 'typeInvestment',
          align: 'left',
          label: 'Tipo',
          field: 'typeInvestment',
          sortable: true,
        },
        {
          name: 'value',
          align: 'left',
          label: 'Valor (R$)',
          field: 'value',
          sortable: true,
        },
        {
          name: 'amount',
          align: 'left',
          label: 'Quantidade',
          field: 'amount',
          sortable: true,
        },
        {
          name: 'total',
          align: 'left',
          label: 'Totoal',
          field: 'total',
          sortable: true,
        },
        {
          name: 'date',
          align: 'left',
          label: 'Data da compra',
          field: 'date',
          sortable: true,
        },
      ],
      data: [],
      seriesTypes: [],
      labelsTypes: [],
      seriesCodes: [],
      labelsCodes: [],
    };
  },
};
</script>
