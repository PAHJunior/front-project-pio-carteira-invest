import axios from 'axios';
import { Notify } from 'quasar';

const http = axios.create({
  baseURL: 'https://carteira-invest-pio.herokuapp.com/api',
  timeout: 60000,
});

http.interceptors.response.use((response) => {
  if (response.data.status === 400) {
    for (let i = 0; i < response.data.errors.length; i += 1) {
      Notify.create({
        color: 'negative',
        title: 'Alerta',
        message: `${response.data.errors[i].message}`,
        icon: 'warning',
      });
    }
  }
  return response;
}, (error) => {
  if (error.response) {
    const { data, status } = error.response;
    const { errors } = data;

    if (status === 400 || status === 404) {
      for (let i = 0; i < errors.length; i += 1) {
        if (errors[i].status === 400) {
          Notify.create({
            color: 'negative',
            title: 'Alerta',
            message: errors[i].message,
            icon: 'warning',
          });
        }
      }
    }
  } else {
    Notify.create({
      color: 'negative',
      title: 'Alerta',
      message: 'Sem conexão com a internet',
      icon: 'signal_wifi_connected_no_internet_4',
    });
  }
  return Promise.reject(error);
});

export default http;
