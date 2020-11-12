<template>
  <div>
    <v-navigation-drawer v-model="drawer" app>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="gray--text text--gray-4"
        >
          <v-list-item to="/" v-if="showNav">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>
          <v-list-item to="/apply" v-if="showNav">
            <v-list-item-icon>
              <v-icon>mdi-calendar</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Apply for Leave</v-list-item-title>
          </v-list-item>
          <v-list-item to="/profile" v-if="showNav">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Profile
            </v-list-item-title>
          </v-list-item>
          <v-list-item to="/admin" v-if="isAdmin">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Admin
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app dark color="#156665">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <v-btn text to="/">Cathay Pacific Airways</v-btn>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text dark v-if="showNav"> {{ getFullName }}</v-btn>
        <v-btn text dark to="/profile" v-if="showNav">Profile</v-btn>
        <v-btn text dark v-if="isAdmin" to="/admin">Admin</v-btn>
        <v-btn text dark @click="signOutHandler" v-if="showNav">Logout</v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'Navbar',
  data() {
    return {
      drawer: false,
      group: null
    };
  },
  methods: {
    ...mapActions(['fetchUserProfile', 'signOut']),
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
  },

  created() {}
};
</script>

<style>
a {
  text-decoration: none;
}
</style>
