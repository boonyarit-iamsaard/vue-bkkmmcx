<template>
  <v-form @submit.prevent="updateLeaveHandler" v-model="valid" ref="form">
    <Progress v-if="loading" />
    <v-card class="pa-4 rounded-lg">
      <p class="display-1 text-center">
        Edit Leave
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
                color="primary"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="startDate"
              @input="startMenu = false"
              @change="changeEndDate"
              min="2021-01-01"
              max="2021-12-31"
              color="primary"
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
              :max="max"
              :min="min"
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
            color="primary"
            required
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-select
            :items="statusItems"
            v-model="status"
            label="Status"
            color="primary"
            required
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-btn
            block
            :disabled="!valid"
            class="white--text"
            type="submit"
            color="primary"
            >EDIT
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-form>
</template>

<script>
import Progress from '@/components/Progress.vue';
import { mapActions } from 'vuex';

export default {
  name: 'UpdateLeave',
  props: {
    item: Object
  },
  components: {
    Progress
  },
  data() {
    return {
      loading: false,
      valid: true,
      priorityRules: [v => v.length > 0 || 'Priority is required.'],
      priorityItems: [
        { text: 'TYC', disabled: false },
        { text: 'ANL-1', disabled: false },
        { text: 'ANL-2', disabled: false },
        { text: 'ANL-3', disabled: false },
        { text: 'H', disabled: false }
      ],
      statusItems: [{ text: 'Pending' }, { text: 'Approved' }],
      disablePriorityItems: [],
      startDate: this.item.startDate,
      endDate: this.item.endDate,
      priority: this.item.priority,
      status: this.item.status,
      startMenu: false,
      endMenu: false,
      max: null,
      min: null
    };
  },
  methods: {
    ...mapActions(['updatePriorityQuota', 'updateLeave']),
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

    async updateLeaveHandler() {
      this.loading = true;
      if (this.$refs.form.validate()) {
        let anl1 = 0;
        let anl2 = 0;
        let tyc = 0;

        if (this.priority === 'ANL-1' && this.item.priority === 'ANL-2') {
          anl1 = 1;
          anl2 = -1;
        } else if (
          this.priority === 'ANL-1' &&
          this.item.priority === 'ANL-3'
        ) {
          anl1 = 1;
        } else if (
          this.priority === 'ANL-2' &&
          this.item.priority === 'ANL-1'
        ) {
          anl1 = -1;
          anl2 = 1;
        } else if (
          this.priority === 'ANL-2' &&
          this.item.priority === 'ANL-3'
        ) {
          anl2 = 1;
        } else if (
          this.priority === 'ANL-3' &&
          this.item.priority === 'ANL-1'
        ) {
          anl1 = -1;
        } else if (
          this.priority === 'ANL-3' &&
          this.item.priority === 'ANL-2'
        ) {
          anl2 = -1;
        } else if (this.priority === 'ANL-1' && this.item.priority === 'H') {
          anl1 = 1;
        } else if (this.priority === 'ANL-2' && this.item.priority === 'H') {
          anl2 = 1;
        } else if (this.priority === 'H' && this.item.priority === 'ANL-1') {
          anl1 = -1;
        } else if (this.priority === 'H' && this.item.priority === 'ANL-2') {
          anl2 = -1;
        } else if (this.priority === 'TYC' && this.item.priority === 'ANL-1') {
          anl1 = -1;
          tyc = 1;
        } else if (this.priority === 'TYC' && this.item.priority === 'ANL-2') {
          anl2 = -1;
          tyc = 1;
        } else if (this.priority === 'TYC' && this.item.priority === 'ANL-3') {
          tyc = 1;
        } else if (this.priority === 'TYC' && this.item.priority === 'H') {
          tyc = 1;
        } else if (this.priority === 'ANL-1' && this.item.priority === 'TYC') {
          tyc = -1;
          anl1 = 1;
        } else if (this.priority === 'ANL-2' && this.item.priority === 'TYC') {
          tyc = -1;
          anl2 = 1;
        } else if (this.priority === 'ANL-3' && this.item.priority === 'TYC') {
          tyc = -1;
        } else if (this.priority === 'H' && this.item.priority === 'TYC') {
          tyc = -1;
        }

        await this.updatePriorityQuota({
          userId: this.item.userId,
          anl1: anl1,
          anl2: anl2,
          tyc: tyc
        });

        await this.updateLeave({
          docId: this.item.id,
          startDate: this.startDate,
          endDate: this.endDate,
          days: this.days(),
          priority: this.priority,
          status: this.status
        });
        this.loading = false;
        this.$emit('close');
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
    this.max = this.maxDate();
    this.min = this.minDate();
  },

  beforeUpdate() {
    this.max = this.maxDate();
    this.min = this.minDate();
  },

  watch: {
    leaves: 'disabledPriority'
  }
};
</script>

<style></style>
