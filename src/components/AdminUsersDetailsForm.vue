<template>
  <v-card class="mx-auto my-4" max-width="599">
    <v-card-title>
      <span class="title">User Details</span>
    </v-card-title>

    <v-card-text>
      <v-form>
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

        <v-row>
          <v-col cols="12">
            <v-btn block depressed color="primary" @click="addUserDetail">
              ADD DETAIL
            </v-btn>
          </v-col>

          <v-col>
            <v-text-field
              dense
              outlined
              label="Key"
              v-model="newUserDetail.key"
            ></v-text-field>

            <v-text-field
              dense
              outlined
              label="Label"
              v-model="newUserDetail.label"
            ></v-text-field>

            <v-select
              :items="userDetailTypes"
              dense
              item-text="label"
              item-value="value"
              label="Type"
              outlined
              v-model="newUserDetail.type"
            ></v-select>

            <v-text-field
              dense
              outlined
              label="Value"
              v-if="newUserDetail.type === 'string'"
              v-model="newUserDetail.value"
            ></v-text-field>

            <v-text-field
              dense
              outlined
              label="Value"
              type="number"
              v-if="newUserDetail.type === 'number'"
              v-model="newUserDetail.value"
            ></v-text-field>

            <v-checkbox
              class="mt-0 pt-0"
              label="Value"
              v-if="newUserDetail.type === 'boolean'"
              v-model="newUserDetail.value"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions class="d-flex justify-space-between pa-4">
      <v-btn depressed color="accent">
        CANCLE
      </v-btn>

      <v-btn depressed color="primary">
        SAVE
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'AdminUsersDetailsForm',

  data() {
    return {
      editableUserDetails: [
        { key: 'firstName', label: 'Firstname', type: 'string' },
        { key: 'lastName', label: 'Lastname', type: 'string' },
        { key: 'isAdmin', label: 'Admin?', type: 'boolean' },
        { key: 'entitled', label: 'ANL entitled', type: 'number' }
      ],
      newUserDetail: {
        key: '',
        label: '',
        type: 'string',
        value: null
      },
      user: {},
      userDetailTypes: [
        { label: 'String', value: 'string' },
        { label: 'Boolean', value: 'boolean' },
        { label: 'Number', value: 'number' }
      ]
    };
  },

  computed: {
    ...mapGetters(['getAllUsers', 'getSettings'])
  },

  methods: {
    ...mapActions(['fetchSettings']),

    addUserDetail() {
      this.editableUserDetails.push(this.newUserDetail);
      this.user[this.newUserDetail.key] = this.newUserDetail.value;
      console.log(this.editableUserDetails);
    },

    async fetchStoredSettings() {
      await this.fetchSettings().then(() => {
        this.editableUserDetails = this.getSettings.editableUserDetails;
      });
    }
  },

  created() {
    if (this.$route.params.id) {
      this.user = this.getAllUsers.find(
        user => (user.id = this.$route.params.id)
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
