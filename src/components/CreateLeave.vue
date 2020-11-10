<template>
  <v-form @submit.prevent="createLeaveHandler" v-model="valid" ref="form">
    <v-container>
      <v-row>
        <v-col sm="8" md="4" class="mx-auto">
          <v-card class="pa-4 rounded-lg">
            <p class="display-1 font-weight-light text-center">
              Apply for Leave
            </p>
            <v-row>
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
                      v-model="startDate"
                      label="Start Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      color="teal darken-3"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="startDate"
                    @input="startMenu = false"
                    @change="changeEndDate"
                    color="teal darken-3"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-menu
                  v-model="endMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="endDate"
                      label="End Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      color="red darken-3"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="endDate"
                    @input="endMenu = false"
                    color="red darken-3"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-select
                  :items="priorityItems"
                  :rules="priorityRules"
                  v-model="priority"
                  label="Priority"
                  color="teal darken-3"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-btn
                  block
                  dark
                  type="submit"
                  color="#156665"
                  class="font-weight-light"
                  >APPLY
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
import * as firebase from '../plugins/firebase';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'CreateLeave',
  data: () => ({
    valid: false,
    priorityRules: [v => v.length > 0 || 'Priority is required.'],
    priorityItems: [
      { text: 'ANL-1', disabled: false },
      { text: 'ANL-2', disabled: false },
      { text: 'ANL-3', disabled: false },
      { text: 'H', disabled: false }
    ],
    startDate: new Date('2021-01-01').toISOString().substr(0, 10),
    endDate: new Date('2021-01-01').toISOString().substr(0, 10),
    priority: '',
    startMenu: false,
    endMenu: false
  }),
  methods: {
    ...mapActions(['createLeave']),

    changeEndDate() {
      return (this.endDate = this.startDate);
    },

    async updatePriorityQuata(updatedPriorityQuata) {
      let anl1 = this.userProfile.anl1;
      let anl2 = this.userProfile.anl2;

      anl1 -= updatedPriorityQuata.anl1;
      anl2 -= updatedPriorityQuata.anl2;

      try {
        await firebase.usersCollection.doc(updatedPriorityQuata.userId).update({
          anl1: anl1,
          anl2: anl2
        });
      } catch (error) {
        console.log(error.message);
      }
    },

    async createLeaveHandler() {
      if (this.$refs.form.validate()) {
        let anl1 = 0;
        let anl2 = 0;
        if (this.priority === 'ANL-1') {
          anl1 = 1;
        }
        if (this.priority === 'ANL-2') {
          anl2 = 1;
        }

        const targetMonth = new Date(`${this.startDate}`);
        targetMonth.setMonth(targetMonth.getMonth() - 1);

        await this.updatePriorityQuata({
          userId: firebase.auth.currentUser.uid,
          anl1: anl1,
          anl2: anl2
        });

        await this.createLeave({
          userId: firebase.auth.currentUser.uid,
          startDate: this.startDate,
          endDate: this.endDate,
          days: this.days(),
          priority: this.priority,
          status: 'Pending'
        });

        await this.$router.push({
          name: 'Home',
          params: { focus: targetMonth.toISOString().substr(0, 10) }
        });
      }
    },

    days() {
      let start = new Date(`${this.startDate}T00:00:00`);
      let end = new Date(`${this.endDate}T23:59:59`);
      let days = (end.getTime() - start.getTime()) / 86400000;
      return Math.round(days);
    },

    validate() {
      this.$refs.form.validate();
    }
  },

  mounted() {
    this.disabledPriority();
  },

  computed: {
    ...mapGetters(['getLeaves', 'userProfile'])
  },

  filters: {
    dateFormat(value) {
      const months = [
        'January',
        'Febuary',
        'March',
        'April',
        'May',
        'Jun',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];
      let d = new Date(value);
      let year = d.getFullYear();
      let month = d.getMonth();
      let date = d.getDate();

      return `${date} ${months[month].substr(0, 3)} ${year}`;
    }
  }
};
</script>

<style scoped></style>
