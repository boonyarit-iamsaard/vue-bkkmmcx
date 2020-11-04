import { firestore } from "@/database/firebase";
const leavesRef = firestore.collection("leaves");

const state = {
  leaves: []
};

const getters = {
  leavesList: state => state.leaves
};

const actions = {
  // Test fetch leaves from firestore
  async fetchLeaves() {
    let leaves = [];
    try {
      await leavesRef
        .where("staffId", "==", "124430K") //(fieldName, queryOperator, value)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            if (doc.data()) {
              leaves.push(doc.id, doc.data());
            }
          });
          console.log(leaves);
        });
    } catch (err) {
      console.error(err);
    }
  },

  addNewLeave({ commit }, newLeave) {
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
