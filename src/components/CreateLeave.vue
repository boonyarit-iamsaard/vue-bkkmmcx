<template>
  <v-form @submit.prevent="createLeaveHandler" v-model="valid" ref="form">
    <Progress v-if="loading" />
    <v-container>
      <v-row>
        <v-col sm="8" md="6" class="mx-auto">
          <v-alert border="top" colored-border type="warning" elevation="2">
            Please apply minimum 50% of your 2021's entitled leave before
            <strong><u>30</u><sup>th</sup> <u>Nevember 2020</u></strong
            >.
          </v-alert>
          <v-card class="pa-4 rounded-lg" elevation="2">
            <p class="display-1 text-center">
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
                    min="2021-01-01"
                    max="2021-12-31"
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
                      color="secondary"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="endDate"
                    @input="endMenu = false"
                    :max="max"
                    :min="min"
                    color="secondary"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-select
                  :items="priorityItems"
                  :rules="priorityRules"
                  v-model="priority"
                  label="Priority"
                  color="primary"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-btn
                  block
                  class="white--text"
                  :disabled="!valid"
                  type="submit"
                  color="primary"
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
import Progress from '@/components/Progress.vue';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'CreateLeave',
  components: {
    Progress
  },
  data: () => ({
    loading: false,
    valid: true,
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
    endMenu: false,
    max: null,
    min: null
  }),
  methods: {
    ...mapActions(['createLeave']),

    changeEndDate() {
      return (this.endDate = this.startDate);
    },

    minDate() {
      return this.startDate;
    },

    maxDate() {
      let start =
        new Date(`${this.startDate}T00:00:00`).getTime() + 5 * 86400000;
      start = new Date(start);
      return start.toISOString().substr(0, 10);
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
      this.loading = true;
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

    disabledPriority() {
      if (this.getLeaves.length > 0) {
        if (
          this.getLeaves.filter(leave => leave.priority === 'ANL-1').length > 0
        ) {
          this.priorityItems[0].disabled = true;
        }
        if (
          this.getLeaves.filter(leave => leave.priority === 'ANL-2').length > 0
        ) {
          this.priorityItems[1].disabled = true;
        }
      }
    },

    validate() {
      this.$refs.form.validate();
    }
  },

  mounted() {
    this.disabledPriority();
    this.max = this.maxDate();
    this.min = this.minDate();
  },

  beforeUpdate() {
    this.max = this.maxDate();
    this.min = this.minDate();
  },

  computed: {
    ...mapGetters(['getLeaves', 'userProfile'])
  },

  watch: {
    leaves: 'disabledPriority'
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
