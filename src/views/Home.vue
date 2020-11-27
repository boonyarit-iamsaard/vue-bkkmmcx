<template>
  <v-container>
    <v-toolbar flat v-if="isAdmin" height="64">
      <v-spacer></v-spacer>
      <v-switch inset v-model="switchCalendar" class="mt-4"></v-switch>
    </v-toolbar>
    <UserCalendar v-if="!switchCalendar" />
    <AdminCalendar v-if="switchCalendar" />
  </v-container>
</template>

<script>
import UserCalendar from '@/components/UserCalendar.vue';
import AdminCalendar from '@/components/AdminCalendar.vue';
import { auth } from '@/plugins/firebase';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Home',
  components: {
    UserCalendar,
    AdminCalendar
  },
  data() {
    return {
      switchCalendar: false
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
  },
  created() {
    this.fetchUserProfile(auth.currentUser);
  },
  beforeMount() {}
};
</script>

<style scoped></style>
