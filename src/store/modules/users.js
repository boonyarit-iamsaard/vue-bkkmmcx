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
      console.log(error.message);
    }
  },

  async fetchUserProfile({ commit }, user) {
    try {
      const userProfile = await firebase.usersCollection.doc(user.uid).get();

      commit('setUserProfile', userProfile.data());

      if (router.currentRoute.name === 'Login') {
        await router.push({ name: 'Home' });
      }
    } catch (error) {
      console.log(error.message);
    }
  },

  async updatePriorityQuata({ state, dispatch }, updatedPriorityQuata) {
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
        .then(() => {
          // commit('updateUserProfile', updatedPriorityQuata);
          dispatch('fetchUserProfile', firebase.auth.currentUser);
        });
    } catch (error) {
      console.log(error.message);
    }
  }
};

const mutations = {
  setUserProfile(state, user) {
    state.userProfile = user;
  }
  // updateUserProfile(state, updatedPriorityQuata) {
  //   console.log(state.userProfile.anl1, state.userProfile.anl2);
  //   state.userProfile.anl1 -= updatedPriorityQuata.anl1;
  //   state.userProfile.anl1 -= updatedPriorityQuata.anl2;
  // }
};

export default {
  state,
  getters,
  actions,
  mutations
};
