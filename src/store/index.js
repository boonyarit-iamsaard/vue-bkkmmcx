import Vue from 'vue';
import Vuex from 'vuex';

import users from '@/store/modules/users';
import leaves from './modules/leaves';
import staffs from './modules/staffs';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  actions: {},
  mutations: {},
  modules: {
    users,
    leaves,
    staffs
  }
});
