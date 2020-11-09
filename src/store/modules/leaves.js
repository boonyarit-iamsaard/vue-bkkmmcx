import * as firebase from '@/plugins/firebase';

const state = {
  leaves: []
};

const getters = {
  getLeaves: state => state.leaves
};

const actions = {
  async fetchLeaves({ commit }) {
    try {
      await firebase.leavesCollection
        .where('userId', '==', firebase.auth.currentUser.uid)
        .onSnapshot(snapshot => {
          let leaves = [];

          snapshot.forEach(doc => {
            let leave = doc.data();
            leave.id = doc.id;

            leaves.push(leave);
          });

          commit('setLeaves', leaves);
        });
    } catch (err) {
      console.error(err);
    }
  }
};

const mutations = {
  setLeaves: (state, leaves) => (state.leaves = leaves)
};

export default {
  state,
  getters,
  actions,
  mutations
};
