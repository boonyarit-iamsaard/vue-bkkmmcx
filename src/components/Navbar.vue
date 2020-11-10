<template>
  <v-app-bar app dark color="#156665">
    <v-toolbar-title>
      <v-btn text to="/">Cathay Pacific Airways</v-btn>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn text dark v-if="showNav"> {{ getFullName }} </v-btn>
      <v-btn text dark v-if="showNav" to="/profile">Profile</v-btn>
      <!-- <v-btn text dark v-if="!showNav" to="/login">Login</v-btn> -->
      <v-btn text dark v-if="showNav" @click="signOutHandler">Logout</v-btn>
      <!-- <v-btn text dark v-if="showNav" to="/register">Register</v-btn> -->
      <!-- <v-btn text dark v-if="isAdmin" to="/admin">Admin</v-btn> -->
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'Navbar',
  components: {},
  methods: {
    ...mapActions(['signOut']),
    signOutHandler() {
      this.signOut();
    }
  },
  computed: {
    ...mapGetters(['userProfile']),
    showNav() {
      return Object.keys(this.userProfile).length > 1;
    },
    isAdmin() {
      return this.userProfile.isAdmin;
    },
    getFullName() {
      return `${this.userProfile.firstName} ${this.userProfile.lastName}`;
    }
  }
};
</script>

<style></style>
