<template>
  <v-form @submit.prevent="updateLeaveHandler" v-model="valid" ref="form">
    <v-container>
      <v-row>
        <v-col sm="6" md="4" class="mx-auto">
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
                      color="primary"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="startDate"
                    @input="startMenu = false"
                    @change="changeEndDate"
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
                  type="submit"
                  color="primary"
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
import { auth } from '@/plugins/firebase';
import { mapActions } from 'vuex';
import * as firebase from '@/plugins/firebase';

export default {
  name: 'UpdateLeave',
  props: {
    item: Object
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
      statusItems: [{ text: 'Pending' }, { text: 'Approved' }],
      disablePriorityItems: [],
      startDate: this.item.startDate,
      endDate: this.item.endDate,
      priority: this.item.priority,
      status: this.item.status,
      startMenu: false,
      endMenu: false
    };
  },
  methods: {
    ...mapActions(['updatePriorityQuata']),
    changeEndDate() {
      return (this.endDate = this.startDate);
    },

    async updateLeave(updatedLeave) {
      try {
        await firebase.leavesCollection
          .doc(updatedLeave.docId)
          .update({
            startDate: updatedLeave.startDate,
            endDate: updatedLeave.endDate,
            days: updatedLeave.days,
            priority: updatedLeave.priority,
            status: updatedLeave.status
          })
          .then(() => {
            this.$store.dispatch('fetchLeaves');
            console.log('updateLeave successful');
          });
      } catch (error) {
        console.log(error.message);
      }
    },

    async updateLeaveHandler() {
      if (this.$refs.form.validate()) {
        let anl1 = 0;
        let anl2 = 0;
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
        }

        const updatedPriorityQuata = {
          userId: auth.currentUser.uid,
          anl1: anl1,
          anl2: anl2
        };

        const updatedLeave = {
          docId: this.item.id,
          startDate: this.startDate,
          endDate: this.endDate,
          days: this.days(),
          priority: this.priority,
          status: this.status
        };

        const targetMonth = new Date(`${this.startDate}`);
        targetMonth.setMonth(targetMonth.getMonth() - 1);

        await this.updatePriorityQuata(updatedPriorityQuata);
        await this.updateLeave(updatedLeave);

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
  }
};
</script>

<style></style>
