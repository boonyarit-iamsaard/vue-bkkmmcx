<template>
  <v-app>
    <LoadingProgress />

    <Navbar />

    <v-main>
      <router-view :key="$route.path" />
    </v-main>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import LoadingProgress from './components/common/LoadingProgress.vue';

export default {
  name: 'App',
  components: {
    LoadingProgress,
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
