<template>
  <v-app-bar app dark color="#156665">
    <v-toolbar-title
      ><v-btn text to="/home">Cathay Pacific Airways</v-btn></v-toolbar-title
    >
    <v-spacer></v-spacer>
    <v-btn text dark to="/profile">Profile</v-btn>
    <v-btn text dark to="/">Login</v-btn>
    <v-btn text dark @click="signOutHandler">Logout</v-btn>
    <v-btn text dark to="/register">Register</v-btn>
  </v-app-bar>
</template>

<script>
import { auth } from '../database/firebase';
export default {
  name: 'Navbar',
  methods: {
    async signOutHandler() {
      try {
        await auth.signOut().then(() => {
          this.$router.push({ name: 'Login' });
          console.log('Signed Out');
        });
      } catch (error) {
        () => console.log(error.message);
      }
    }
  }
};
</script>

<style></style>
