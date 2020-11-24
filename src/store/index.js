import Vue from 'vue';
import Vuex from 'vuex';

import users from './modules/users';
import leaves from './modules/leaves';
import daysoff from './modules/daysoff';
import publics from './modules/publics';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  actions: {},
  mutations: {},
  modules: {
    users,
    leaves,
    daysoff,
    publics
  }
});
