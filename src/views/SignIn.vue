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
              <span class="text-h4">Entrar</span>
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
                v-on:keyup.enter="login()"
              />
            </div>

            <div class="row col-12">
              <q-input
                :type="isVisiblePassword ? 'password' : 'text'"
                v-model="password"
                label="Sua senha"
                dense
                class="col-12"
                hide-bottom-space
                color="dark"
                label-color="dark"
                lazy-rules
                v-on:keyup.enter="login()"
                :rules="[ val => val && val.length > 0 || 'Por favor informe sua senha']"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isVisiblePassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isVisiblePassword = !isVisiblePassword"
                  />
                </template>
              </q-input>
            </div>

            <div class="row col-12">
              <q-btn
                class="col-12"
                unelevated
                text-color="dark"
                color="grey-4"
                label="Login"
                @click="login"
                :loading="loading"
              />
            </div>

            <div class="row col-6">
              <span
                @click="$router.push('/signup')"
                class="cursor-pointer">
                Ainda não sou cliente
              </span>
            </div>
            <div class="row col-6 justify-end text-right">
              <span
                @click="$router.push('/forgot')"
                class="cursor-pointer">
                Recuperar senha
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
import { Notify, LocalStorage } from 'quasar';
import Validation from '../utils/emailValidation';

export default {
  mounted() {
  },
  methods: {
    isEmailValid(val) {
      return Validation.isEmail(val) || 'Por favor, informe um e-mail valido';
    },
    login() {
      this.$refs.formUser.validate()
        .then((success) => {
          if (success) {
            this.loading = true;
            firebase.auth().signInWithEmailAndPassword(this.email, this.password)
              .then((userCredential) => {
                const { user } = userCredential;
                LocalStorage.set('user', user);
                this.$router.push('/investment');
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
      isVisiblePassword: true,
      email: '',
      password: '',
    };
  },
};
</script>

<style scoped>
</style>
