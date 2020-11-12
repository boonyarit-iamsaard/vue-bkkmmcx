<template>
  <v-container>
    <Progress v-if="loading" />
    <v-form @submit.prevent="createUserHandler" v-model="valid" ref="form">
      <v-row>
        <v-col sm="6" md="4" class="mx-auto">
          <v-card class="pa-4 rounded-lg">
            <p class="display-1 font-weight-light text-center">
              Create User Profile
            </p>
            <p color="primary" class="text-center" v-if="message">
              {{ message }}
            </p>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model.trim="uid"
                  :rules="requiredRules"
                  label="UID"
                  color="primary"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model.trim="firstName"
                  :rules="requiredRules"
                  label="Firstname"
                  color="primary"
                  required
                ></v-text-field>
                <v-text-field
                  v-model.trim="lastName"
                  :rules="requiredRules"
                  label="Lastname"
                  color="primary"
                  required
                ></v-text-field>
                <v-select
                  :items="positionItems"
                  :rules="requiredRules"
                  v-model="position"
                  label="Position"
                  color="primary"
                  required
                ></v-select>
                <v-text-field
                  v-model.trim="ern"
                  :rules="requiredRules"
                  label="ERN"
                  color="primary"
                  required
                ></v-text-field>
                <v-text-field
                  v-model.trim="entitled"
                  :rules="requiredRules"
                  label="Entitled"
                  color="primary"
                  required
                ></v-text-field>
                <v-checkbox label="Admin" v-model="isAdmin"></v-checkbox>
              </v-col>
              <v-col cols="12">
                <v-menu
                  v-model="startMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="initiateDate"
                      label="Initiate Days Off Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      color="primary"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="initiateDate"
                    @input="startMenu = false"
                    color="primary"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-btn
                  block
                  dark
                  type="submit"
                  color="primary"
                  class="font-weight-light"
                  >Register
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
// import * as firebase from '@/plugins/firebase';
import { mapActions } from 'vuex';
import Progress from '@/components/Progress';
export default {
  name: 'Register',
  components: {
    Progress
  },
  data() {
    return {
      loading: false,
      valid: false,
      message: null,
      // email: null,
      // password: null,
      uid: null,
      firstName: null,
      lastName: null,
      position: null,
      ern: null,
      entitled: null,
      isAdmin: false,
      startMenu: false,
      initiateDate: new Date('2021-01-01').toISOString().substr(0, 10),
      positionItems: ['Manager', 'Admin', 'Engineer', 'Mechanic'],
      requiredRules: [value => !!value || 'Required.'],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ]
    };
  },
  methods: {
    ...mapActions(['createUserProfile']),

    async createUserHandler() {
      this.loading = false;
      console.log(this.initiateDate);
      try {
        await this.createUserProfile({
          uid: this.uid,
          firstName: this.firstName,
          lastName: this.lastName,
          position: this.position,
          ern: this.ern,
          entitled: parseInt(this.entitled, 10),
          isAdmin: this.isAdmin,
          anl1: 1,
          anl2: 1,
          tyc: 0,
          initiateDate: this.initiateDate
        }).then(() => {
          this.message = "A user's profile created.";
        });
      } catch (error) {
        this.loading = false;
        this.message = error.message;
      }

      this.loading = false;
    },

    validate() {
      this.$refs.form.validate();
    }
  }
};
</script>

<style scoped></style>
