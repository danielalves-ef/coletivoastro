import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Locale from '../views/Locale.vue'
import Contas from '../views/contas/Contas.vue'


import firebase from "firebase/app";
import "firebase/auth";
import store from '@/store/index.js'


import i18n from '../i18n'
Vue.use(VueRouter)

const routes = [
  {
    path: '/:locale',
    component: Locale,
    beforeEnter: (to, from, next) => {
      const locale = to.params.locale;
      const localesSuportados = ['en', 'pt', 'es'];
      if (!localesSuportados.includes(locale)) {
        return next('pt');
      }
      if (i18n.locale !== locale) {
        i18n.locale = locale;
      }
      return next();
    },
    children: [
      {
        path: '',
        name: 'home',
        component: Home
      },
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
      },
      {
        path: 'contas',
        name: 'contas',
        component: Contas,
        // meta: {
        //   authRequired: true
        // },
      }
    ]

  },
  {
    path: '*',
    redirect() {
      return process.env.VUE_APP_I18N_LOCALE || 'pt';
    }
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  firebase.auth().onAuthStateChanged((user) => {
    window.console.log('status changed', user)

    const requiresAuth = to.matched.some(record => record.meta.authRequired);
    store.dispatch("auth/loginIntoStore", user).then(() => {
      // TEM USUARIO CONECTADO
      if (user) {
        next();
      }
      // NAO HA USUARIO CONECTADO
      else {
        if (requiresAuth) {
          next({ name: "login" });
        }
        else {
          next();
        }
      }

    })
  })
})


export default router
