import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../layouts/Login.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/SignIn.vue'),
      },
      {
        path: '/signup',
        component: () => import('../views/SignUp.vue'),
      },
      {
        path: '/forgot',
        component: () => import('../views/Forgot.vue'),
      },
    ],
  },
  {
    path: '/investment',
    name: 'Investment',
    component: () => import('../layouts/Investment.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/Dashboard.vue'),
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
