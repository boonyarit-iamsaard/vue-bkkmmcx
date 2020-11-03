// import firestore from "../../database/firebase";

const state = {
  leaves: []
};

const getters = {
  leavesList: state => state.leaves
};

const actions = {
  addNewLeave({ commit }, newLeave) {
    console.log(newLeave);
    commit("addLeave", newLeave);
  },
  updateLeave({ commit }, updatedLeave) {
    commit("updateLeave", updatedLeave);
  }
};

const mutations = {
  addLeave: (state, newLeave) => state.leaves.push(newLeave),
  updateLeave: (state, updatedLeave) => {
    let targetLeave = state.leaves.findIndex(
      leave => leave.id === updatedLeave.id
    );
    state.leaves.splice(targetLeave, 1, updatedLeave);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
