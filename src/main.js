import Vue from 'vue';
import App from './App.vue';
import { auth } from '@/plugins/firebase';
import router from './router';
import vuetify from './plugins/vuetify';
import store from './store';

Vue.config.productionTip = false;

// new Vue({
//   store,
//   router,
//   vuetify,
//   render: h => h(App)
// }).$mount('#app');
let app;
auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app');
  }

  if (user) {
    store.dispatch('fetchUserProfile', user);
    // store.dispatch('fetchAllUsers');
    // store.dispatch('fetchAllLeaves');
    // store.dispatch('fetchUserDaysOff');
    // store.dispatch('fetchPublic');
    // store.dispatch('fetchLeaves');
    // store.dispatch('fetchAllDaysOff');
  }
});
