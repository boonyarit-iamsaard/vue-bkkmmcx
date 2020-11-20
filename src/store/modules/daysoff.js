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

      // Try filter days off starte here.
      await firebase.daysOffCollection
        .where('userId', '==', 'IEmKpQ544YTZ5DiEQIG073TAVgF2')
        .onSnapshot(snapshot => {
          let srisuphan = [];
          snapshot.forEach(async doc => {
            let off = doc.data();
            off.id = doc.id;
            // await firebase.daysOffCollection.doc(doc.id).delete();
            srisuphan.push(off);
          });
          const januaryDaysOff = srisuphan.filter(
            off => off.startDate <= '2021-01-31'
          );
          console.log(
            januaryDaysOff.sort((a, b) => {
              if (a.startDate < b.startDate) {
                return -1;
              }
              if (a.startDate > b.startDate) {
                return 1;
              }
              return 0;
            })
          );
        });
      // Try filter days off end here.
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
