<template>
  <v-container>
    <v-toolbar flat dense class="pb-4">
      <template>
        <v-tabs v-model="tab">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab>
            User
          </v-tab>
          <v-tab>
            All
          </v-tab>
          <v-tab v-if="isAdmin">
            Admin
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
      <v-tab-item>
        <DaysOffCalendar />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import UserCalendar from '@/components/UserCalendar.vue';
import DaysOffCalendar from '@/components/DaysOffCalendar.vue';
import AdminCalendar from '@/components/AdminCalendar.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Home',
  components: {
    UserCalendar,
    DaysOffCalendar,
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
    }
  },

  methods: {
    ...mapActions(['fetchUserProfile'])
  }
};
</script>

<style scoped>
.v-tab.v-tab--active {
  background-color: #e0e0e0;
}
</style>
