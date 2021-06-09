import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import users from './modules/users';
import leaves from './modules/leaves';
import daysoff from './modules/daysoff';
import publics from './modules/publics';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  actions: {},
  mutations: {},
  plugins: [createPersistedState()],
  modules: {
    users,
    leaves,
    daysoff,
    publics
  }
});
