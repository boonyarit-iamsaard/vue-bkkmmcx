import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    staffs: [
      {
        id: "124430K",
        firstName: "Boonyarit",
        lastName: "Iamsa-ard",
        entitled: 10,
        anl1: 1,
        anl2: 1
      }
    ],
    leaves: []
  },
  mutations: {
    addNewLeave(state, newLeave) {
      state.leaves.push(newLeave);
    },
    updatePriorityQuata(state, updatedPriorityQuata) {
      let targetedStaff = state.staffs.find(
        staff => staff.id === updatedPriorityQuata.staffId
      );
      targetedStaff.anl1 -= updatedPriorityQuata.anl1Used;
      targetedStaff.anl2 -= updatedPriorityQuata.anl2Used;
      console.log(JSON.stringify(targetedStaff));
    }
  },
  getters: {
    getLeaves(state) {
      return state.leaves;
    },
    getStaff(state) {
      return state.staffs;
    }
  }
});
// Initiate
