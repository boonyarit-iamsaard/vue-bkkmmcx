<template>
  <v-container>
    <v-toolbar flat v-if="isAdmin">
      <v-spacer></v-spacer>
      <v-switch inset v-model="switchCalendar"></v-switch>
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
      switchCalendar: false,
      isAdmin: null
    };
  },
  computed: {
    ...mapGetters(['userProfile'])
  },
  methods: {
    ...mapActions(['fetchUserProfile'])
  },
  created() {
    this.fetchUserProfile(auth.currentUser);
  },
  beforeMount() {
    this.isAdmin = this.userProfile.isAdmin;
  }
};
</script>

<style scoped></style>
