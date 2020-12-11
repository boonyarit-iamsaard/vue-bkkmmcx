<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view :key="$route.path" />
    </v-main>
  </v-app>
</template>

<script>
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
