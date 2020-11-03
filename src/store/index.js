import Vue from "vue";
import Vuex from "vuex";
import leaves from "./modules/leaves";
import staffs from "./modules/staffs";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    leaves,
    staffs
  }
});