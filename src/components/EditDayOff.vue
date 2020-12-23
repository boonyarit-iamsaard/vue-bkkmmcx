<template>
  <v-form @submit.prevent="updateDayOffHandler" v-model="valid" ref="form">
    <Progress v-if="loading" />
    <v-card class="pa-4 rounded-lg">
      <p class="display-1 text-center">
        Edit Day Off
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
                v-model="dayOff.start"
                label="Start Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                color="primary"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="dayOff.start"
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
                v-model="dayOff.end"
                label="End Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                color="red darken-3"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="dayOff.end"
              @input="endMenu = false"
              :max="maxDate"
              :min="minDate"
              color="red darken-3"
            ></v-date-picker>
          </v-menu>
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
  name: 'EditDayOff',
  props: {
    dayOff: Object
  },
  components: {
    Progress
  },
  data() {
    return {
      loading: false,
      valid: true,
      startMenu: false,
      endMenu: false
    };
  },
  methods: {
    ...mapActions(['updateDayOff']),
    changeEndDate() {
      let start =
        new Date(`${this.dayOff.start}T00:00:00`).getTime() + 4 * 86400000;
      start = new Date(start);
      return (this.dayOff.end = start.toISOString().substr(0, 10));
    },
    async updateDayOffHandler() {
      this.loading = true;
      if (this.$refs.form.validate()) {
        await this.updateDayOff({
          id: this.dayOff.id,
          start: this.dayOff.start,
          end: this.dayOff.end
        });

        this.loading = false;
        this.$emit('close');
      }

      // await console.log(this.dayOff.id, this.dayOff.start, this.dayOff.end);
      // this.loading = false;
    }
  },
  computed: {
    minDate() {
      return this.dayOff.start;
    },

    maxDate() {
      let start =
        new Date(`${this.dayOff.start}T00:00:00`).getTime() + 4 * 86400000;
      start = new Date(start);
      return start.toISOString().substr(0, 10);
    }
  }
};
</script>

<style lang="scss" scoped></style>
