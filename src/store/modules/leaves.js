import * as firebase from '@/plugins/firebase';

const state = {
  leaves: [],
  allLeaves: []
};

const getters = {
  getLeaves: state => state.leaves,
  getAllLeaves: state => state.allLeaves
};

const actions = {
  async fetchAllLeaves({ commit }) {
    try {
      await firebase.leavesCollection.onSnapshot(snapshot => {
        let allLeaves = [];

        snapshot.forEach(doc => {
          let leave = doc.data();
          leave.id = doc.id;

          allLeaves.push(leave);
        });
        commit('setAllLeaves', allLeaves);
      });
    } catch (error) {
      console.log(error.message);
    }
  },

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
    } catch (error) {
      console.error(error.message);
    }
  },

  async createLeave({ dispatch }, leave) {
    try {
      await firebase.leavesCollection
        .add({
          userId: leave.userId,
          startDate: leave.startDate,
          endDate: leave.endDate,
          days: leave.days,
          priority: leave.priority,
          status: leave.status
        })
        .then(() => {
          dispatch('fetchLeaves', firebase.auth.currentUser);
          console.log('A new leave created.');
        });
    } catch (error) {
      console.log(error.message);
    }
  },

  async updateLeave({ dispatch }, leave) {
    try {
      await firebase.leavesCollection
        .doc(leave.docId)
        .update({
          startDate: leave.startDate,
          endDate: leave.endDate,
          days: leave.days,
          priority: leave.priority,
          status: leave.status
        })
        .then(() => {
          dispatch('fetchLeaves', firebase.auth.currentUser);
          console.log('updateLeave successful');
        });
    } catch (error) {
      console.log(error.message);
    }
  },

  async deleteLeave({ dispatch }, id) {
    try {
      await firebase.leavesCollection
        .doc(id)
        .delete()
        .then(() => {
          dispatch('fetchLeaves', firebase.auth.currentUser);
          console.log('Deleted');
        });
    } catch (error) {
      console.log(error.message);
    }
  }
};

const mutations = {
  setLeaves: (state, leaves) => (state.leaves = leaves),
  setAllLeaves: (state, allLeaves) => (state.allLeaves = allLeaves)
};

export default {
  state,
  getters,
  actions,
  mutations
};
