import { auth } from '../../database/firebase';

const state = {
  user: null,
  staffs: [
    {
      id: '124430K',
      firstName: 'Boonyarit',
      lastName: 'Iamsa-ard',
      entitled: 10,
      anl1: 1,
      anl2: 1
    }
  ]
};

const getters = {
  staffsList: state => state.staffs
};

const actions = {
  async userStateChanged() {
    try {
      await auth.onAuthStateChanged(user => {
        if (!user) {
          this.$router.push({ name: 'Login' });
          alert('Please sign in.');
        }
      });
    } catch (error) {
      () => console.log(error.message);
    }
  },
  updatePriorityQuata({ commit }, updatedPriorityQuata) {
    let staffs = state.staffs;
    let targetedStaff = staffs.find(
      staff => staff.id === updatedPriorityQuata.staffId
    );
    targetedStaff.anl1 -= updatedPriorityQuata.anl1Used;
    targetedStaff.anl2 -= updatedPriorityQuata.anl2Used;
    commit('updatePriority', staffs);
  }
};

const mutations = {
  updatePriority: (state, staffs) => {
    state.staffs = staffs;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
