import * as firebase from '../../plugins/firebase';

const state = {
  userDaysOff: []
};

const getters = {
  getUserDaysOff: state => state.userDaysOff
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
  }
};

const mutations = {
  setUserDaysOff: (state, daysOff) => {
    state.userDaysOff = daysOff;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
