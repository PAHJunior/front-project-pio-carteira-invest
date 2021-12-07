import Vue from 'vue';
import VueApexCharts from 'vue-apexcharts';

import './styles/quasar.sass';
import '@quasar/extras/roboto-font/roboto-font.css';
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css';
// eslint-disable-next-line object-curly-newline
import { Quasar, Notify, Dialog, LocalStorage } from 'quasar';

Vue.use(VueApexCharts);

Vue.use(Quasar, {
  config: {
    notify: {
      progress: true,
      actions: [{
        color: 'white',
        icon: 'close',
      }],
    },
  },
  plugins: {
    Notify,
    Dialog,
    LocalStorage,
  },
});
