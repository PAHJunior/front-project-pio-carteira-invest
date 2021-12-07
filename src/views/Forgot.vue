<template>
  <q-layout view="lHh LpR fFf" class="bg-primary">

    <q-page-container>
      <q-page class="row content-center justify-center">
        <div class="col-md-6 col-sm-6 col-xs-10 q-pa-md row bg-white justify-center">
          <q-form
            class="row col-12 q-col-gutter-md"
            greedy
            ref="formUser"
          >
            <div class="row col-12 justify-center">
              <span class="text-h4">Recuperar senha</span>
            </div>
            <div class="row col-12">
              <q-input
                v-model="email"
                label="Seu e-mail"
                dense
                label-color="dark"
                color="dark"
                class="col-12"
                hide-bottom-space
                lazy-rules
                :rules="[isEmailValid]"
              />
            </div>

            <div class="row col-12">
              <q-btn
                class="col-12"
                unelevated
                text-color="dark"
                color="grey-4"
                label="Enviar email"
                @click="sendPasswordResetEmail"
                :loading="loading"
              />
            </div>

            <div class="row col-12 justify-between">
              <span
                @click="$router.push('/signup')"
                class="cursor-pointer">
                Ainda não sou cliente
              </span>
              <span
                @click="$router.push('/')"
                class="cursor-pointer">
                Já tenho conta
              </span>
            </div>
          </q-form>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import firebase from 'firebase';
import { Notify } from 'quasar';
import Validation from '../utils/emailValidation';

export default {
  mounted() {
  },
  methods: {
    isEmailValid(val) {
      return Validation.isEmail(val) || 'Por favor, informe um e-mail valido';
    },
    sendPasswordResetEmail() {
      this.$refs.formUser.validate()
        .then((success) => {
          if (success) {
            this.loading = true;
            firebase.auth().sendPasswordResetEmail(this.email)
              .then(() => {
                Notify.create({
                  color: 'positive',
                  message: `Enviamos o email de recuperação para ${this.email}`,
                  icon: 'thumb_up_off_alt',
                });
              })
              .catch((error) => {
                const { message } = error;
                const errorMessage = message;
                Notify.create({
                  color: 'negative',
                  message: errorMessage,
                  icon: 'error',
                });
              })
              .finally(() => {
                this.loading = false;
              });
          }
        });
    },
  },
  data() {
    return {
      loading: false,
      email: '',
    };
  },
};
</script>

<style scoped>
</style>
