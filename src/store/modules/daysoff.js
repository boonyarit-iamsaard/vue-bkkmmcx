import * as firebase from '../../plugins/firebase';

const state = {
  userDaysOff: [],
  allDaysOff: []
};

const getters = {
  getUserDaysOff: state => state.userDaysOff,
  getAllDaysOff: state => state.allDaysOff
};

const actions = {
  async fetchUserDaysOff({ commit }) {
    try {
      await firebase.daysOffCollection
        .where('userId', '==', firebase.auth.currentUser.uid)
        .onSnapshot(snapshot => {
          let daysOff = [];

          snapshot.forEach(doc => {
            let dayOff = doc.data();
            dayOff.id = doc.id;

            daysOff.push(dayOff);
          });
          commit('setUserDaysOff', daysOff);
        });
    } catch (err) {
      console.error(err);
    }
  },

  async fetchAllDaysOff({ commit }) {
    try {
      await firebase.daysOffCollection.onSnapshot(snapshot => {
        let allDaysOff = [];

        snapshot.forEach(doc => {
          let off = doc.data();
          off.id = doc.id;

          allDaysOff.push(off);
        });

        commit('setAllDaysOff', allDaysOff);
      });
    } catch (error) {
      console.log(error.message);
    }
  }
};

const mutations = {
  setUserDaysOff: (state, daysOff) => {
    state.userDaysOff = daysOff;
  },
  setAllDaysOff: (state, allDaysOff) => {
    state.allDaysOff = allDaysOff;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
