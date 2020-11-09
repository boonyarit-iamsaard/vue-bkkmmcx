<template>
  <v-container>
    <v-sheet tile height="64" class="d-flex">
      <v-toolbar flat>
        <v-btn color="#156665" to="/apply" dark>
          <span class="font-weight-regular">Apply for Leave</span>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-toolbar-title v-if="$refs.calendar">
          {{ $refs.calendar.title }}
        </v-toolbar-title>
        <v-btn icon class="ma-2" @click="$refs.calendar.next()">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-menu bottom right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn outlined color="grey" v-bind="attrs" v-on="on">
              <span class="font-weight-regular">{{ typeLabel[type] }}</span>
              <v-icon right>
                mdi-menu-down
              </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="type = 'day'">
              <v-list-item-title>Day</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'week'">
              <v-list-item-title>Week</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'month'">
              <v-list-item-title>Month</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        ref="calendar"
        v-model="focus"
        :type="type"
        :show-month-on-first="showMonthOnFirst"
        :events="events"
        :event-color="getEventColor"
        @click:more="viewDay"
      ></v-calendar>
    </v-sheet>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Home',
  computed: {
    ...mapGetters(['getLeaves', 'userProfile'])
  },
  methods: {
    ...mapActions(['fetchLeaves']),
    addEvents() {
      let events = [];
      for (let leave of this.getLeaves) {
        let event = {
          name: `${this.userProfile.firstName} : ${leave.priority}`,
          start: `${leave.startDate}`,
          end: `${leave.endDate}`,
          color: this.setEventColor(leave.priority)
        };
        events.push(event);
      }
      return events;
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = 'day';
    },
    getEventColor(event) {
      return event.color;
    },
    setEventColor(priority) {
      switch (priority) {
        case 'ANL-1':
          return this.eventColor[0];
        case 'ANL-2':
          return this.eventColor[1];
        case 'ANL-3':
          return this.eventColor[2];
        default:
          return this.eventColor[-1];
      }
    }
  },
  data() {
    return {
      showMonthOnFirst: false,
      type: 'month',
      typeLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day'
      },
      focus: this.$route.params.focus || '2020-12-01',
      events: [],
      eventColor: ['#a51d36', '#c0b498', '#156665', 'gray']
    };
  },
  created() {
    this.fetchLeaves();
  },
  mounted() {
    this.events = this.addEvents();
    this.$refs.calendar.move();
  }
};
</script>

<style scoped>
/deep/ .v-toolbar__content {
  padding: 1rem 0 !important;
}
</style>
