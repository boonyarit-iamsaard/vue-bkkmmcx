import Vue from 'vue';
import Vuex from 'vuex';

import users from '@/store/modules/users';
import leaves from './modules/leaves';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  actions: {},
  mutations: {},
  modules: {
    users,
    leaves
  }
});
