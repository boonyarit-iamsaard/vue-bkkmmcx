import Vue from 'vue';
import Vuex from 'vuex';
// import createPersistedState from 'vuex-persistedstate';

import userModule from './modules/user';
import users from './modules/users';
import leaves from './modules/leaves';
import daysoff from './modules/daysoff';
import publics from './modules/publics';

Vue.use(Vuex);

export default new Vuex.Store({
  state: () => ({
    isLoading: false
  }),
  getters: {
    getIsLoading(state) {
      return state.isLoading;
    }
  },
  actions: {
    setIsLoading(context, shouldLoading) {
      context.commit('SET_IS_LOADING', shouldLoading);
    }
  },
  mutations: {
    SET_IS_LOADING(state, shouldLoading) {
      state.isLoading = shouldLoading;
    }
  },
  // plugins: [createPersistedState()],
  modules: {
    user: userModule,
    users,
    leaves,
    daysoff,
    publics
  }
});
