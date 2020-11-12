<template>
  <div>
    <Progress v-if="loading" v-model="valid" ref="form" />
    <v-form @submit.prevent="signInHandler">
      <v-container>
        <v-row>
          <v-col sm="6" md="4" class="mx-auto">
            <v-card rounded="lg" class="pa-4">
              <p class="display-1 text-center">Login</p>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    filled
                    required
                    :rules="requiredRules"
                    color="primary"
                    label="E-Mail"
                    v-model.trim="email"
                  ></v-text-field>
                  <v-text-field
                    filled
                    required
                    :rules="passwordRules"
                    type="password"
                    color="primary"
                    label="Password"
                    v-model.trim="password"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-btn
                    block
                    color="primary"
                    type="submit"
                    class="white--text"
                    :disabled="!valid"
                  >
                    Login
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import Progress from '@/components/Progress';
import { mapActions } from 'vuex';

export default {
  name: 'Signin',
  components: {
    Progress
  },
  methods: {
    ...mapActions(['signIn']),
    async signInHandler() {
      this.loading = true;
      try {
        await this.signIn({
          email: this.email,
          password: this.password
        });
      } catch (error) {
        this.loading = false;
        console.log(error);
        alert(error);
      }
    },

    validate() {
      this.$refs.form.validate();
    }
  },
  data() {
    return {
      loading: false,
      valid: true,
      email: null,
      password: null,
      requiredRules: [
        v => !!v || 'Required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [v => !!v || 'Required']
    };
  }
};
</script>

<style scoped>
.inactive {
  color: #fff;
}
</style>
