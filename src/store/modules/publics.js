import * as firebase from '@/plugins/firebase';

const state = {
  publics: []
};

const getters = {
  getPublics: state => state.publics
};

const actions = {
  async fetchPublics({ commit }) {
    try {
      await firebase.publicsCollection.onSnapshot(snapshot => {
        let publics = [];

        snapshot.forEach(doc => {
          let ph = doc.data();
          ph.id = doc.id;

          publics.push(ph);
        });
        commit('setPublics', publics);
      });
    } catch (err) {
      console.error(err);
    }
  }
};

const mutations = {
  setPublics: (state, publics) => (state.publics = publics)
};

export default {
  state,
  getters,
  actions,
  mutations
};
