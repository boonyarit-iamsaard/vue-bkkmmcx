// import firestore from "../../database/firebase";

const state = {
  leaves: []
};

const getters = {
  leavesList: state => state.leaves
};

const actions = {
  addNewLeave({ commit }, newLeave) {
    commit("addLeave", newLeave);
  }
};

const mutations = {
  addLeave: (state, newLeave) => state.leaves.push(newLeave)
};

export default {
  state,
  getters,
  actions,
  mutations
};
