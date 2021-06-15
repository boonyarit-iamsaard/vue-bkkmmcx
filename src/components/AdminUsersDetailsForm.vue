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
              v-model.number="user[detail.key]"
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

    <v-card class="mx-auto mb-4" max-width="599">
      <v-row class="ma-0">
        <v-col class="pa-4" cols="12">
          <v-text-field dense label="UID" outlined v-model="uid"></v-text-field>
        </v-col>

        <v-col class="pa-4">
          <v-btn block elevation="0" color="primary" @click="searchDaysOff"
            >Search</v-btn
          >
        </v-col>
      </v-row>

      <v-data-table
        :headers="headers"
        :items="daysOff"
        :sort-by="['startDate']"
        :sort-desc="['true']"
      >
        <template v-slot:item.actions="{ item }">
          <div class="d-flex align-center">
            <v-icon @click="deleteDayOff(item)">
              mdi-delete
            </v-icon>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import * as firebase from '@/plugins/firebase';
export default {
  name: 'AdminUsersDetailsForm',

  data() {
    return {
      daysOff: [],
      editableUserDetails: [],
      headers: [
        { text: 'Start', value: 'startDate', align: 'left' },
        { text: 'End', value: 'endDate', align: 'left' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'left' }
      ],
      uid: null,
      user: {}
    };
  },

  computed: {
    ...mapGetters(['getAllUsers', 'getSettings', 'getAllDaysOff']),

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

    async searchDaysOff() {
      try {
        await firebase.daysOffCollection
          .where('userId', '==', this.uid)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              let off = doc.data();
              off.id = doc.id;

              this.daysOff.push(off);
            });
          });
      } catch (error) {
        console.log(error.message);
      }
    },

    async deleteDayOff(item) {
      try {
        await firebase.daysOffCollection
          .doc(item.id)
          .delete()
          .then(() => console.log(item.id + ' deleted'));
      } catch (error) {
        console.log(error.message);
      }
    },

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
  },

  beforeDestroy() {
    this.daysOff = [];
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
