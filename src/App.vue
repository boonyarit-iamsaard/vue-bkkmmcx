<template>
  <v-app>
    <v-app-bar app dark color="#156665">
      <v-app-bar-nav-icon
        @click="drawer = true"
        v-if="user"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>Cathay Pacific Airways</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title v-if="user"
        ><span class="font-weight-light px-4">{{
          getFullName
        }}</span></v-toolbar-title
      >
      <v-btn text to="/profile" v-if="user">
        <span class="font-weight-light">Profile</span>
      </v-btn>
      <v-btn text v-if="user" @click="signOutHandler">
        <span class="font-weight-light">Sign out</span>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="gray--text text--gray-4"
        >
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>
          <v-list-item to="/profile">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Profile
            </v-list-item-title>
          </v-list-item>
          <v-list-item to="/apply">
            <v-list-item-icon>
              <v-icon>mdi-calendar</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Apply for Leave</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view v-if="user" />
      <LoginForm v-else />
    </v-main>
  </v-app>
</template>

<script>
import { auth, firestore } from "@/database/firebase";
import LoginForm from "@/components/LoginForm";

export default {
  name: "App",
  components: {
    LoginForm
  },
  computed: {
    getFullName() {
      return `${this.user.firstName} ${this.user.lastName}`;
    }
  },
  methods: {
    async signOutHandler() {
      try {
        await auth.signOut().then(() => {
          console.log("Signed Out");
        });
      } catch (err) {
        console.error(err);
      }
    },
    async setUserData(uid) {
      await firestore
        .collection("users")
        .doc(uid)
        .onSnapshot(doc => {
          if (doc.exists) {
            const user = {
              uid: doc.id,
              ern: doc.data().ern,
              firstName: doc.data().firstName,
              lastName: doc.data().lastName,
              entitled: doc.data().entitled,
              anl1: doc.data().anl1,
              anl2: doc.data().anl2
            };

            this.user = user;
          }
        });
    }
  },
  data: () => ({
    user: null,
    authUnsubscribe: null,
    drawer: false,
    group: null
  }),
  created() {
    this.authUnsubscribe = auth.onAuthStateChanged(
      user => {
        if (user) {
          this.setUserData(user.uid);
        } else {
          this.user = null;
        }
      },
      err => console.log(err)
    );
  },
  beforeDestroy() {
    this.authUnsubscribe();
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
