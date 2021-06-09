<template>
  <v-form @submit.prevent="submitHandler">
    <v-card class="mx-auto my-4" max-width="599">
      <v-card-title>
        <span class="title">User Details</span>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            v-for="detail in editableUserDetails"
            :key="detail.key"
          >
            <v-text-field
              dense
              outlined
              v-if="detail.type === 'string'"
              v-model="user[detail.key]"
              :label="detail.label"
            ></v-text-field>
            <v-text-field
              dense
              outlined
              type="number"
              v-if="detail.type === 'number'"
              v-model="user[detail.key]"
              :label="detail.label"
            ></v-text-field>
            <v-checkbox
              class="mt-0 pt-0"
              v-if="detail.type === 'boolean'"
              v-model="user[detail.key]"
              :label="detail.label"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="d-flex justify-space-between pb-4 pt-0 px-4">
        <v-btn depressed color="accent" @click="$router.go(-1)">
          CANCEL
        </v-btn>

        <v-btn depressed color="primary" type="submit">
          SAVE
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'AdminUsersDetailsForm',

  data() {
    return {
      editableUserDetails: [],
      user: {}
    };
  },

  computed: {
    ...mapGetters(['getAllUsers', 'getSettings']),

    userDetails() {
      const userDetails = this.user;

      this.editableUserDetails.forEach(detail => {
        if (userDetails[detail.key] === undefined) {
          userDetails[detail.key] = detail.defaultValue;
        }
      });

      return userDetails;
    }
  },

  methods: {
    ...mapActions(['fetchSettings', 'updateUserDetails']),

    submitHandler() {
      this.updateUserDetails(this.user).then(() => {
        this.$router.go(-1);
      });
    },

    async fetchStoredSettings() {
      await this.fetchSettings().then(() => {
        this.editableUserDetails = this.getSettings.editableUserDetails;

        this.editableUserDetails.forEach(detail => {
          if (this.user[detail.key] === undefined) {
            this.user[detail.key] = detail.defaultValue;
          }
        });
      });
    }
  },

  created() {
    if (this.$route.params.id) {
      this.user = this.getAllUsers.find(
        user => user.id === this.$route.params.id
      );
    }

    this.fetchStoredSettings();
  }
};
</script>

<style lang="scss" scoped>
::v-deep .row {
  margin: -8px;
}

::v-deep .col-12 {
  padding: 8px;
}
</style>
