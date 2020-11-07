<template>
  <v-form @submit.prevent="onUpdateLeave" v-model="valid" ref="form">
    <v-container>
      <v-row>
        <v-col md="8" lg="4" class="mx-auto">
          <v-card class="pa-4 rounded-lg">
            <p class="display-1 font-weight-light text-center">
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
                  type="submit"
                  color="teal darken-3"
                  class="white--text font-weight-light"
                  >EDIT
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
import { mapActions } from 'vuex';

export default {
  name: 'UpdateLeave',
  props: {
    item: Object
  },
  methods: {
    ...mapActions(['updatePriorityQuata', 'updateLeave']),
    changeEndDate() {
      return (this.endDate = this.startDate);
    },
    onUpdateLeave() {
      if (this.$refs.form.validate()) {
        let anl1Used = 0;
        let anl2Used = 0;
        if (this.priority === 'ANL-1' && this.item.priority === 'ANL-2') {
          anl1Used = 1;
          anl2Used = -1;
        } else if (
          this.priority === 'ANL-1' &&
          this.item.priority === 'ANL-3'
        ) {
          anl1Used = 1;
        } else if (
          this.priority === 'ANL-2' &&
          this.item.priority === 'ANL-1'
        ) {
          anl1Used = -1;
          anl2Used = 1;
        } else if (
          this.priority === 'ANL-2' &&
          this.item.priority === 'ANL-3'
        ) {
          anl2Used = 1;
        } else if (
          this.priority === 'ANL-3' &&
          this.item.priority === 'ANL-1'
        ) {
          anl1Used = -1;
        } else if (
          this.priority === 'ANL-3' &&
          this.item.priority === 'ANL-2'
        ) {
          anl2Used = -1;
        }

        const updatedPriorityQuata = {
          staffId: this.item.staffId,
          anl1Used: anl1Used,
          anl2Used: anl2Used
        };

        const updatedLeave = {
          id: this.item.id,
          staffId: this.item.staffId,
          startDate: this.startDate,
          endDate: this.endDate,
          days: this.days(),
          priority: this.priority,
          added: new Date().toISOString()
        };

        const targetMonth = new Date(`${this.startDate}`);
        targetMonth.setMonth(targetMonth.getMonth() - 1);

        this.updatePriorityQuata(updatedPriorityQuata);
        this.updateLeave(updatedLeave);

        this.priority = null;

        this.$router.push({
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
  data() {
    return {
      valid: false,
      priorityRules: [v => v.length > 0 || 'Priority is required.'],
      priorityItems: [
        { text: 'ANL-1', disabled: false },
        { text: 'ANL-2', disabled: false },
        { text: 'ANL-3', disabled: false }
      ],
      disablePriorityItems: [],
      staff: null,
      leaves: null,
      leaveId: 0,
      startDate: this.item.startDate,
      endDate: this.item.endDate,
      priority: this.item.priority,
      startMenu: false,
      endMenu: false
    };
  }
};
</script>

<style></style>
