<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view :key="$route.path" />
    </v-main>
  </v-app>
</template>

<script>
// import { auth } from '@/plugins/firebase';
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar
  },
  data() {
    return {
      unsubscribe: null,
      loading: true
    };
  },
  created() {
    // this.unsubscribe = auth.onAuthStateChanged(user => {
    //   if (user) {
    //     this.$store.dispatch('fetchUserProfile', user);
    //     this.$store.dispatch('fetchAllUsers');
    //     this.$store.dispatch('fetchAllLeaves');
    //     this.$store.dispatch('fetchUserDaysOff');
    //     this.$store.dispatch('fetchPublic');
    //     this.$store.dispatch('fetchLeaves');
    //     this.$store.dispatch('fetchAllDaysOff');
    //   }
    // });
  },
  beforeDestroy() {
    // this.unsubscribe();
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
}
.v-application {
  background-color: #eeeeee !important;
}
</style>
