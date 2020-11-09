import * as firebase from '@/plugins/firebase';
import router from '@/router';

const state = {
  userProfile: {}
};

const getters = {
  userProfile: state => state.userProfile
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
    }
  },

  async signOut({ commit }) {
    try {
      await firebase.auth.signOut();

      // Clear userProfile and redirect to /signIn
      commit('setUserProfile', {});

      await router.push({ name: 'Login' });
    } catch (error) {
      console.log('signOut', error.message);
    }
  },

  async fetchUserProfile({ commit }, user) {
    try {
      // Fetch user's profile.
      const userProfile = await firebase.usersCollection.doc(user.uid).get();

      // Set user's profile in state.
      commit('setUserProfile', userProfile.data());

      // Change route to home.
      if (router.currentRoute.name === 'Login') {
        await router.push({ name: 'Home' });
      }
    } catch (error) {
      console.log('fetchUserProfile', error.message);
    }
  },

  async updatePriorityQuata({ state }, updatedPriorityQuata) {
    let anl1 = state.userProfile.anl1;
    let anl2 = state.userProfile.anl2;

    anl1 -= updatedPriorityQuata.anl1;
    anl2 -= updatedPriorityQuata.anl2;
    try {
      await firebase.usersCollection
        .doc(updatedPriorityQuata.userId)
        .update({
          anl1: anl1,
          anl2: anl2
        })
        .then(() => console.log('updatePriorityQuata is updated'));
    } catch (error) {
      console.log(error.message);
    }
  }
};

const mutations = {
  setUserProfile(state, user) {
    state.userProfile = user;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
