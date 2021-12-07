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
              <span class="text-h4">Cadastre-se</span>
            </div>
            <div class="row col-12">
              <q-input
                v-model="email"
                label="Informe Seu e-mail *"
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
              <q-input
                :type="isVisiblePassword ? 'password' : 'text'"
                v-model="password"
                label="Digite sua senha *"
                dense
                class="col-12"
                hide-bottom-space
                color="dark"
                label-color="dark"
                lazy-rules
                v-on:keyup.enter="createUser()"
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
              <q-input
                :type="isVisiblePassword ? 'password' : 'text'"
                v-model="confirmPassword"
                label="Confirmar sua senha *"
                dense
                class="col-12"
                hide-bottom-space
                color="dark"
                label-color="dark"
                lazy-rules
                v-on:keyup.enter="createUser()"
                :rules="[ val => val === password || 'Por favor informe a mesma senha']"
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
                label="Cadastrar"
                @click="createUser"
                :loading="loading"
              />
            </div>

            <div class="row col-12 justify-end">
              <span
                 @click="$router.push('/')"
                class="cursor-pointer">
                Já tenho uma conta
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
    createUser() {
      this.$refs.formUser.validate()
        .then((success) => {
          if (success) {
            this.loading = true;
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
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
    isEmailValid(val) {
      return Validation.isEmail(val) || 'Por favor, informe um e-mail valido';
    },
  },
  data() {
    return {
      loading: false,
      email: '',
      password: '',
      confirmPassword: '',
      isVisiblePassword: true,
    };
  },
};
</script>

<style scoped>
</style>
