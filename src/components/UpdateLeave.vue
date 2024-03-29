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
                v-model="item.startDate"
                label="Start Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                color="primary"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="item.startDate"
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
                v-model="item.endDate"
                label="End Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                color="red darken-3"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="item.endDate"
              @input="endMenu = false"
              :max="maxDate"
              :min="minDate"
              color="red darken-3"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12">
          <v-select
            :items="leaveTypeItems"
            @change="onLeaveTypeChanged"
            v-model="item.type"
            label="Leave Type"
          ></v-select>
        </v-col>
        <v-col cols="12" v-if="item.type === 'ANL' || item.type === 'H'">
          <v-select
            :items="phaseItems"
            v-model="item.phase"
            label="Phase"
          ></v-select>
        </v-col>
        <v-col cols="12" v-if="item.type === 'ANL' || item.type === 'H'">
          <v-select
            :items="disabledPriority"
            :rules="priorityRules"
            :readonly="isPhaseB"
            v-model="item.priority"
            label="Priority"
            color="primary"
            required
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-select
            :items="statusItems"
            v-model="item.status"
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
      statusItems: [
        { text: 'Pending' },
        { text: 'Approved' },
        { text: 'Rejected' }
      ],
      leaveTypeItems: [
        {
          text: 'ANL',
          value: 'ANL'
        },
        {
          text: 'H',
          value: 'H'
        },
        {
          text: 'SLS4',
          value: 'SLS4'
        },
        {
          text: 'Vaccination Leave',
          value: 'VCL'
        }
      ],
      phaseItems: ['A', 'B'],
      leaveType: '',
      phase: 'B',
      startMenu: false,
      endMenu: false
    };
  },

  computed: {
    isPhaseB() {
      if (this.item.phase === 'B') {
        return true;
      } else return false;
    },

    minDate() {
      return this.item.startDate;
    },

    maxDate() {
      let start =
        new Date(`${this.item.startDate}T00:00:00`).getTime() + 5 * 86400000;
      start = new Date(start);
      return start.toISOString().substr(0, 10);
    },

    disabledPriority() {
      let priorityItems = [
        { text: 'TYC', disabled: false },
        { text: 'H', disabled: false },
        { text: 'ANL', disabled: false },
        { text: 'ANL-1', disabled: false },
        { text: 'ANL-2', disabled: false },
        { text: 'ANL-3', disabled: false }
      ];

      if (this.item.phase === 'A') {
        priorityItems[1].disabled = true;
        priorityItems[2].disabled = true;
      }
      return priorityItems;
    }
  },
  methods: {
    ...mapActions(['updatePriorityQuota', 'updateLeave']),

    onLeaveTypeChanged() {
      if (this.item.type === 'ANL' || this.item.type === 'H') {
        this.item.phase = this.phase;
        this.item.priority = this.item.type;
      }
    },

    changeEndDate() {
      return (this.item.endDate = this.item.startDate);
    },

    async updateLeaveHandler() {
      this.loading = true;
      let priority;
      let phase;

      if (this.item.type === 'SLS') {
        priority = 'SLS';
        phase = 'None';
      } else if (this.item.type === 'SLS4') {
        priority = 'SLS4';
        phase = 'None';
      } else {
        priority = this.item.priority;
        phase = this.item.phase;
      }

      if (this.$refs.form.validate()) {
        await this.updateLeave({
          docId: this.item.id,
          startDate: this.item.startDate,
          endDate: this.item.endDate,
          days: this.days(),
          type: this.item.type,
          phase: phase,
          priority: priority,
          status: this.item.status
        });

        this.loading = false;
        this.$emit('close');
      }
    },

    days() {
      let start = new Date(`${this.item.startDate}T00:00:00`);
      let end = new Date(`${this.item.endDate}T23:59:59`);
      let days = (end.getTime() - start.getTime()) / 86400000;
      return Math.round(days);
    },

    validate() {
      this.$refs.form.validate();
    }
  }
};
</script>
