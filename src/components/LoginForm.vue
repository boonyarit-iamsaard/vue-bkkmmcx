<template>
  <div>
    <Progress v-if="loading" />
    <v-form @submit.prevent="signInHandler" v-model="valid" ref="form">
      <v-container>
        <v-row>
          <v-col sm="8" md="6" lg="5" class="mx-auto">
            <v-card rounded="lg" class="pa-6" elevation="2">
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
                <v-col>
                  <v-checkbox
                    label="Forget password or reset password"
                    v-model="forgetPassword"
                  ></v-checkbox>
                  <v-btn
                    block
                    color="primary"
                    class="white--text"
                    :disabled="!forgetPassword"
                    @click="reset = true"
                    >Reset Password</v-btn
                  >
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline secondary white--text">
          Error
        </v-card-title>
        <v-card-text class="pa-4">
          {{ error }}
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">
            dismiss
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="reset" width="500">
      <v-card>
        <v-card-title class="headline accent white--text"
          >Please input your e-mail</v-card-title
        >
        <v-card-text class="pa-6"
          ><v-overlay :value="resetProgress">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
          </v-overlay>
          <v-form
            v-model="resetValid"
            ref="resetForm"
            @submit.prevent="resetHandler"
          >
            <v-text-field
              filled
              required
              label="E-Mail"
              v-model="resetEmail"
              :rules="requiredRules"
            ></v-text-field>
            <v-btn block type="submit" color="primary" :disabled="!resetValid"
              >Reset Password
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogSuccess" width="500">
      <v-card>
        <v-card-title class="headline primary white--text">
          Message
        </v-card-title>
        <v-card-text class="pa-4">
          {{ message }}
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogSuccess = false">
            dismiss
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Progress from '@/components/Progress';
import { mapActions } from 'vuex';
import { auth } from '@/plugins/firebase';

export default {
  name: 'SignIn',
  components: {
    Progress
  },
  data() {
    return {
      loading: false,
      valid: false,
      resetValid: false,
      dialog: false,
      dialogSuccess: false,
      message: null,
      reset: false,
      resetEmail: null,
      resetProgress: false,
      forgetPassword: false,
      error: null,
      email: null,
      password: null,
      requiredRules: [
        v => !!v || 'Required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [v => !!v || 'Required']
    };
  },
  methods: {
    ...mapActions(['signIn']),

    async resetHandler() {
      console.log(this.resetEmail);

      try {
        this.resetProgress = true;
        await auth.sendPasswordResetEmail(this.resetEmail).then(() => {
          this.message = "Password reset's e-mail has been sent.";
          this.resetProgress = false;
          this.reset = false;
          this.dialogSuccess = true;
        });
      } catch (error) {
        this.error = error.message;
        this.resetProgress = false;
        this.reset = false;
        this.dialog = true;
      }
    },

    async signInHandler() {
      this.loading = true;
      try {
        await this.signIn({
          email: this.email,
          password: this.password
        });
      } catch (error) {
        this.loading = false;
        this.dialog = true;
        this.error = error.message;
        console.log(error.message);
      }
    },

    validate() {
      this.$refs.form.validate();
    },

    resetValidate() {
      this.$refs.form.resetValidate();
    }
  }
};
</script>

<style scoped></style>
