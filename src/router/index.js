import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import Profile from '@/views/Profile';
import ApplyLeave from '@/views/ApplyLeave';
import Login from '@/views/Login';
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
    path: '/profile/:id',
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
    component: () => import('../views/Register.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
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
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
