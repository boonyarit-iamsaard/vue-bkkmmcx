import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import Profile from '@/views/Profile';
import ApplyLeave from '@/views/ApplyLeave';
import EditLeave from '@/views/EditLeave';
import Login from '@/views/Login';
import Admin from '@/views/Admin';
import Register from '@/views/Register';
import { auth } from '@/plugins/firebase';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/apply',
    name: 'ApplyLeave',
    component: ApplyLeave,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/edit',
    name: 'EditLeave',
    component: EditLeave,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      requiresAuth: true
    }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, form, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth.currentUser) {
      next({
        path: '/login'
        // query: {
        //   redirect: to.fullPath
        // }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});
// router.beforeEach((to, from, next) => {
//   const requiresAuth = to.matched.some(route => route.meta.requiresAuth);

//   if (requiresAuth && !auth.currentUser) {
//     next({ name: 'Login' });
//   } else {
//     next();
//   }
// });

export default router;
