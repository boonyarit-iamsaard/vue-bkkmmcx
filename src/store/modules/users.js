import * as firebase from '@/plugins/firebase';
import router from '@/router';

const state = {
  allUsers: [],
  settings: {},
  userProfile: {}
};

const getters = {
  getAllUsers: state => state.allUsers,
  getSettings: state => state.settings,
  getUserProfile: state => state.userProfile
};

const actions = {
  async signIn({ dispatch }, payload) {
    try {
      // Sign user in.
      const { user } = await firebase.auth.signInWithEmailAndPassword(
        payload.email,
        payload.password
      );

      //  Fetch user's profile and set in state.
      dispatch('fetchUserProfile', user);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  },

  async signOut({ commit }) {
    try {
      await firebase.auth.signOut();

      commit('setUserProfile', {});

      await router.push({ name: 'Login' });
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  },

  async createUserProfile({ dispatch }, payload) {
    await firebase.usersCollection.doc(payload.uid).set({
      firstName: payload.firstName,
      lastName: payload.lastName,
      position: payload.position,
      sortIndex: payload.sortIndex,
      ern: payload.ern,
      entitled: payload.entitled,
      anl1: payload.anl1,
      anl2: payload.anl2,
      tyc: payload.tyc,
      isAdmin: payload.isAdmin
    });

    await dispatch('initiateNewUserDaysOff', {
      date: payload.initiateDate,
      id: payload.uid
    });
  },

  async initiateNewUserDaysOff({ dispatch }, initiateData) {
    try {
      console.log(initiateData.date);
      let limit = new Date('2021-12-31').getTime();
      let startDate = new Date(`${initiateData.date}`).getTime();
      console.log(startDate);
      let endDate = startDate + 3 * 86400000;
      do {
        await firebase.daysOffCollection.add({
          userId: initiateData.id,
          startDate: new Date(startDate).toISOString().substr(0, 10),
          endDate: new Date(endDate).toISOString().substr(0, 10)
        });
        startDate = new Date(endDate).getTime();
        startDate = startDate + 5 * 86400000;
        endDate = startDate + 3 * 86400000;
      } while (startDate <= limit);
    } catch (error) {
      console.log(error.message);
    }
    dispatch('fetchAllUsers');
  },

  async fetchUserProfile({ commit }, user) {
    try {
      const userProfile = await firebase.usersCollection.doc(user.uid).get();
      let profile = { ...userProfile.data(), id: user.uid };

      commit('setUserProfile', profile);

      if (router.currentRoute.name === 'Login') {
        // await router.push({ name: 'Home' });
        await router.push({
          name: 'Profile',
          params: { id: profile.id }
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  },

  async fetchAllUsers(context) {
    try {
      await firebase.usersCollection.onSnapshot(snapshot => {
        let allUsers = [];

        snapshot.forEach(doc => {
          let user = doc.data();
          user.id = doc.id;

          allUsers.push(user);
        });

        context.commit('setAllUsers', allUsers);
      });
    } catch (error) {
      console.error(error.message);
    }
  },

  async updatePriorityQuota({ state, dispatch }, payload) {
    let targetUser = state.allUsers.find(user => user.id === payload.userId);
    // let anl1 = targetUser.anl1;
    // let anl2 = targetUser.anl2;
    let tyc = targetUser.tyc;

    // anl1 -= payload.anl1;
    // anl2 -= payload.anl2;
    tyc -= payload.tyc;

    try {
      await firebase.usersCollection
        .doc(targetUser.id)
        .update({
          // anl1: anl1,
          // anl2: anl2,
          tyc: tyc
        })
        .then(() => {
          dispatch('fetchAllUsers');
          dispatch('fetchUserProfile', firebase.auth.currentUser);
        });
    } catch (error) {
      console.log(error.message);
    }
  },

  async fetchSettings(context) {
    try {
      await firebase.settingsCollection.onSnapshot(snapshot => {
        let settings = {};

        snapshot.forEach(doc => {
          let setting = doc.data();
          Object.keys(setting).forEach(key => {
            settings[key] = setting[key];
          });
        });

        context.commit('SET_SETTINGS', settings);
        return settings;
      });
    } catch (error) {
      console.log(error);
    }
  },

  async updateUserDetails(context, payload) {
    try {
      return await firebase.usersCollection
        .doc(payload.id)
        .set(payload)
        .then(() => {
          context.commit('UPDATE_USER', payload);
        });
    } catch (error) {
      console.log(error);
    }
  }
};

const mutations = {
  setUserProfile(state, user) {
    state.userProfile = user;
  },

  setAllUsers(state, allUsers) {
    state.allUsers = allUsers;
  },

  SET_SETTINGS(state, settings) {
    state.settings = settings;
  },

  UPDATE_USER(state, payload) {
    const index = state.allUsers.findIndex(user => user.id === payload.id);

    if (index !== -1) {
      state.allUsers.splice(index, 1, payload);
    }
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
