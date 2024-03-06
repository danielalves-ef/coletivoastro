import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

import './scss/astro.scss';

// vue i18n
// import VueI18n from 'vue-i18n';
// Vue.use(VueI18n);
import i18n from './i18n'

// FIREBASE
import firebasePlugin from './plugins/firebase.js';
Vue.use(firebasePlugin);

// FILTERS
import './plugins/filters.js';

// HELPERS
import helpers from './plugins/helpers.js';
Vue.use(helpers);




// SWEETALERT
import VueSweetalert2 from 'vue-sweetalert2';

const options = {
    target: '#app',
};
import 'sweetalert2/dist/sweetalert2.min.css';
Vue.use(VueSweetalert2, options);




// VUE HAMMER
import { VueHammer } from 'vue2-hammer'

import './registerServiceWorker'


VueHammer.config.press = { time: 300 };
Vue.use(VueHammer)


Vue.config.productionTip = false

new Vue({
    router,
    store,
    vuetify,
    i18n,
    render: h => h(App)
}).$mount('#app')
