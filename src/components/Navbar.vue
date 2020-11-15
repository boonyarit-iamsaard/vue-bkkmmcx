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
            <v-list-item-title>Apply Leave</v-list-item-title>
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
              <v-icon>mdi-account-multiple</v-icon>
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
      <v-toolbar-title v-if="showNav">{{ getFullName }}</v-toolbar-title>
      <v-toolbar-title v-else
        >Cathay Pacific Airways || Bangkok Engineering</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-tooltip bottom v-if="showNav">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text dark v-bind="attrs" v-on="on" to="/">
              <v-icon>mdi-home</v-icon>
            </v-btn>
          </template>
          <span>Home</span>
        </v-tooltip>
        <v-tooltip bottom v-if="showNav">
          <template v-slot:activator="{ on, attrs }">
            <v-btn dark text v-bind="attrs" v-on="on" to="/apply">
              <v-icon>
                mdi-calendar
              </v-icon>
            </v-btn>
          </template>
          <span>Apply Leave</span>
        </v-tooltip>
        <v-tooltip bottom v-if="showNav">
          <template v-slot:activator="{ on, attrs }">
            <v-btn dark text v-bind="attrs" v-on="on" to="/profile">
              <v-icon>
                mdi-account
              </v-icon>
            </v-btn>
          </template>
          <span>Profile</span>
        </v-tooltip>
        <v-tooltip bottom v-if="isAdmin">
          <template v-slot:activator="{ on, attrs }">
            <v-btn dark text v-bind="attrs" v-on="on" to="/admin">
              <v-icon>
                mdi-account-multiple
              </v-icon>
            </v-btn>
          </template>
          <span>Admin's area</span>
        </v-tooltip>
        <v-tooltip bottom v-if="showNav">
          <template v-slot:activator="{ on, attrs }">
            <v-btn dark text v-bind="attrs" v-on="on" @click="signOutHandler">
              <v-icon>
                mdi-logout
              </v-icon>
            </v-btn>
          </template>
          <span>Logout</span>
        </v-tooltip>
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
