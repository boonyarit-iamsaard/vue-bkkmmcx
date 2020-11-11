<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { auth } from '@/plugins/firebase';
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar
  },
  data() {
    return {};
  },
  created() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('fetchUserProfile', user);
        this.$store.dispatch('fetchLeaves');
        this.$store.dispatch('fetchUserDaysOff');
        this.$store.dispatch('fetchPublics');
      }
    });
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
