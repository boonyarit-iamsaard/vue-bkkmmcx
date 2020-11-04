<template>
  <v-form @submit.prevent="signInHandler">
    <v-container>
      <v-row>
        <v-col md="8" lg="4" class="mx-auto">
          <v-card rounded-lg class="pa-4">
            <p class="display-1 font-weight-light text-center">Login</p>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  filled
                  color="#156665"
                  label="E-Mail"
                  required
                  v-model="email"
                ></v-text-field>
                <v-text-field
                  filled
                  color="#156665"
                  label="Password"
                  required
                  v-model="password"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn block dark color="#156665" type="submit">
                  <span class="font-weight-light">Login</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { auth } from "@/database/firebase";

export default {
  name: "SignIn",
  methods: {
    async signInHandler() {
      try {
        await auth
          .signInWithEmailAndPassword(this.email, this.password)
          .then(() => {
            this.email = null;
            this.password = null;
            console.log("Signed in");
          });
      } catch (err) {
        console.log(err);
      }
    }
  },
  data() {
    return {
      email: "",
      password: ""
    };
  }
};
</script>

<style scoped></style>
