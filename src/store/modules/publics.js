import * as firebase from '@/plugins/firebase';

const state = {
  public: []
};

const getters = {
  getPublic: state => state.public
};

const actions = {
  async fetchPublic({ commit }) {
    try {
      await firebase.publicsCollection.get().then(snapshot => {
        let publicList = [];

        snapshot.forEach(doc => {
          let ph = doc.data();
          ph.id = doc.id;

          publicList.push(ph);
        });
        commit('setPublic', publicList);
      });
    } catch (err) {
      console.error(err);
    }
  }
};

const mutations = {
  setPublic: (state, publicList) => (state.public = publicList)
};

export default {
  state,
  getters,
  actions,
  mutations
};
