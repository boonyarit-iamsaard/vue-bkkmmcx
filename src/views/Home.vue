<template>
  <v-container>
    <v-toolbar flat dense>
      <template>
        <v-tabs v-model="tab">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab>
            <!-- User -->
            {{ getFullName }}
          </v-tab>
          <v-tab>
            All
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <UserCalendar />
      </v-tab-item>
      <v-tab-item>
        <AdminCalendar />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import UserCalendar from '@/components/UserCalendar.vue';
import AdminCalendar from '@/components/AdminCalendar.vue';
// import { auth } from '@/plugins/firebase';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Home',
  components: {
    UserCalendar,
    AdminCalendar
  },
  data() {
    return {
      switchCalendar: false,
      tab: null
    };
  },

  computed: {
    ...mapGetters(['getUserProfile']),
    isAdmin() {
      return this.getUserProfile.isAdmin;
    },
    getFullName() {
      return `${
        this.getUserProfile.firstName
      } ${this.getUserProfile.lastName.slice(0, 1)}.`;
    }
  },

  methods: {
    ...mapActions(['fetchUserProfile'])
  }

  // created() {
  //   this.fetchUserProfile(auth.currentUser);
  // }
};
</script>

<style scoped>
.v-tab.v-tab--active {
  background-color: #eeeeee;
}
</style>
