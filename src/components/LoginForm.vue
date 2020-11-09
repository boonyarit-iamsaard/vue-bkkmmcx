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
                  v-model.trim="email"
                ></v-text-field>
                <v-text-field
                  filled
                  required
                  type="password"
                  color="primary"
                  label="Password"
                  v-model.trim="password"
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
import { mapActions } from 'vuex';

export default {
  name: 'Signin',
  methods: {
    ...mapActions(['signIn']),
    signInHandler() {
      this.signIn({ email: this.email, password: this.password });
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
