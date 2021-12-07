<template>
  <q-layout view="lHh Lpr lff">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>
          Carteira <span class="text-bold">Invest</span>
        </q-toolbar-title>

        <q-space />
        <q-btn dense flat round icon="logout" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="left" side="left">
      <q-scroll-area
        style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list>
          <q-item
            clickable
            v-ripple
            to="/investment"
            active-class="bg-primary text-white"
          >
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>

            <q-item-section>Dashboard</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            active-class="bg-primary text-white"
            @click="openPage('https://github.com/PAHJunior/')"
          >
            <q-item-section avatar>
              <q-icon name="fab fa-github" />
            </q-item-section>

            <q-item-section>GitHub</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          <div class="text-weight-bold">{{ user.email }}</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { openURL, LocalStorage } from 'quasar';

export default {
  name: 'College',
  methods: {
    openPage(link) {
      openURL(link);
    },
    logout() {
      this.$router.push('/');
    },
  },
  data() {
    return {
      left: false,
      link: 'investment',
      user: LocalStorage.getItem('user'),
    };
  },
};
</script>
