<template>
  <v-form @submit.prevent="signInHandler">
    <v-container>
      <v-row>
        <v-col sm="6" md="4" class="mx-auto">
          <v-card rounded="lg" class="pa-4">
            <p class="display-1 font-weight-light text-center">Login</p>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  filled
                  required
                  color="primary"
                  label="E-Mail"
                  v-model="email"
                ></v-text-field>
                <v-text-field
                  filled
                  required
                  type="password"
                  color="primary"
                  label="Password"
                  v-model="password"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn block dark color="primary" type="submit">
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
import { auth } from '@/database/firebase';

export default {
  name: 'SignIn',
  methods: {
    async signInHandler() {
      try {
        await auth
          .signInWithEmailAndPassword(this.email, this.password)
          .then(() => {
            this.email = null;
            this.password = null;
            console.log('Signed in');
            this.$router.push({ name: 'Home' });
          });
      } catch (err) {
        console.log(err.message);
      }
    }
  },
  data() {
    return {
      email: null,
      password: null
    };
  }
};
</script>

<style scoped></style>
