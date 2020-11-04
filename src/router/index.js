import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Profile from "@/views/Profile";
import ApplyLeave from "@/views/ApplyLeave";
import EditLeave from "@/views/EditLeave";
import SignInView from "@/views/SignIn";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    props: true
  },
  {
    path: "/apply",
    name: "ApplyLeave",
    component: ApplyLeave,
    props: true
  },
  {
    path: "/edit",
    name: "EditLeave",
    component: EditLeave,
    props: true
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    props: true
  },
  {
    path: "/signin",
    name: "Signin",
    component: SignInView,
    props: true
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
// Initiate
