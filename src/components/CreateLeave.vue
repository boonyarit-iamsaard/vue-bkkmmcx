<template>
  <v-container>
    <v-row>
      <v-col sm="6" md="6" lg="4" class="mx-auto">
        <!-- <v-alert
          text
          outlined
          color="deep-orange"
          icon="mdi-fire"
          elevation="2"
        >
          Please apply minimum 50% of your 2021's entitled leave before <br />
          <strong><u>30</u><sup>th</sup> <u>November 2020</u></strong
          >.
        </v-alert> -->
        <v-card class="pa-4 rounded-lg" elevation="2">
          <p class="display-1 text-center">Apply for Leave</p>
          <v-form
            @submit.prevent="createLeaveHandler"
            v-model="valid"
            ref="form"
          >
            <Progress v-if="loading" />
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
                  :items="leaveTypeItems"
                  :rules="priorityRules"
                  @change="onLeaveTypeChange"
                  v-model="leaveType"
                  label="Leave Type"
                ></v-select>
              </v-col>
              <v-col cols="12" v-if="leaveType === 'ANL' || leaveType === 'H'">
                <v-select
                  :items="phaseItems"
                  v-model="phase"
                  label="Phase"
                  readonly
                ></v-select>
              </v-col>
              <v-col cols="12" v-if="leaveType === 'ANL' && phase !== 'B'">
                <v-select
                  :items="disabledPriority"
                  :rules="priorityRules"
                  :disabled="isANL"
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
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
    startDate: new Date('2021-01-01').toISOString().substr(0, 10),
    endDate: new Date('2021-01-01').toISOString().substr(0, 10),
    leaveTypeItems: ['ANL', 'SLS', 'H'],
    phaseItems: ['A', 'B'],
    leaveType: '',
    phase: 'B',
    priority: '',
    startMenu: false,
    endMenu: false,
    max: null,
    min: null
  }),
  methods: {
    ...mapActions(['createLeave', 'updatePriorityQuota', 'fetchLeaves']),

    changeEndDate() {
      return (this.endDate = this.startDate);
    },

    onLeaveTypeChange() {
      this.priority = '';
      this.$refs.form.resetValidation();
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

    async createLeaveHandler() {
      this.loading = true;
      if (this.$refs.form.validate()) {
        let priority;

        if (this.leaveType === 'ANL' && this.phase === 'B') {
          priority = 'ANL';
        } else if (this.leaveType === 'H') {
          priority = 'H';
        } else if (this.leaveType === 'SLS') {
          priority = 'SLS';
          this.phase = 'None';
        } else priority = this.priority;

        await this.createLeave({
          userId: firebase.auth.currentUser.uid,
          startDate: this.startDate,
          endDate: this.endDate,
          days: this.days(),
          type: this.leaveType,
          phase: this.phase,
          priority: priority,
          status: 'Pending'
        });

        const targetMonth = new Date(`${this.startDate}`);
        targetMonth.setMonth(targetMonth.getMonth() - 1);

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

  created() {
    this.fetchLeaves();
  },
  mounted() {
    this.max = this.maxDate();
    this.min = this.minDate();
  },

  beforeUpdate() {
    this.max = this.maxDate();
    this.min = this.minDate();
  },

  computed: {
    ...mapGetters(['getLeaves', 'getUserProfile']),

    isANL() {
      if (this.leaveType === 'ANL' && this.phase !== 'B') {
        return false;
      } else {
        return true;
      }
    },

    disabledPriority() {
      let priorityItems = [
        { text: 'TYC', disabled: false },
        { text: 'ANL-1', disabled: false },
        { text: 'ANL-2', disabled: false },
        { text: 'ANL-3', disabled: false }
      ];

      if (this.getUserProfile.tyc === 0) {
        priorityItems[0].disabled = true;
      }
      if (
        this.getLeaves.filter(
          leave => leave.priority === 'ANL-1' && leave.status !== 'Rejected'
        ).length > 0
      ) {
        priorityItems[1].disabled = true;
      }
      if (
        this.getLeaves.filter(
          leave => leave.priority === 'ANL-2' && leave.status !== 'Rejected'
        ).length > 0
      ) {
        priorityItems[2].disabled = true;
      }

      return priorityItems;
    }
  }
};
</script>

<style scoped></style>
