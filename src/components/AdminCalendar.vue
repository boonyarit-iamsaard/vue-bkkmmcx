<template>
  <v-container>
    <v-sheet tile height="64" class="d-flex">
      <Spinned v-if="loading" />
      <v-toolbar flat>
        <v-btn color="primary" dark>
          Admin's calendar
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
              {{ typeLabel[type] }}
              <v-icon right>
                mdi-menu-down
              </v-icon>
            </v-btn>
          </template>
          <v-list>
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
        @click:more="viewMore"
      ></v-calendar>
    </v-sheet>
  </v-container>
</template>

<script>
import Spinner from '@/components/Spinner.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Home',
  components: {
    Spinner
  },
  data() {
    return {
      loading: false,
      showMonthOnFirst: false,
      type: 'month',
      typeLabel: {
        month: 'Month',
        week: 'Week'
      },
      focus: this.$route.params.focus || '2020-12-01',
      events: [],
      eventColor: ['secondary', 'accent', 'primary', 'indigo lighten-1', 'grey']
    };
  },
  computed: {
    ...mapGetters(['getPublics', 'getAllUsers', 'getAllLeaves'])
  },
  methods: {
    ...mapActions(['fetchAllLeaves', 'fetchAllUsers', 'fetchPublics']),

    addEvents() {
      let events = [];

      this.getAllUsers.forEach(user => {
        this.getAllLeaves.forEach(leave => {
          let event = {};
          if (leave.userId === user.id) {
            event = {
              name: `${user.firstName} : ${leave.priority}`,
              start: `${leave.startDate}`,
              end: `${leave.endDate}`,
              color: this.setEventColor(leave.priority)
            };
            events.push(event);
          }
        });
      });

      // add public holidays to events
      for (let ph of this.getPublics) {
        let event = {
          name: `${ph.name}`,
          start: `${ph.startDate}`,
          end: `${ph.endDate}`,
          color: `${ph.color}`
        };
        events.push(event);
      }

      return events;
    },
    viewMore({ date }) {
      this.focus = date;
      this.type = 'week';
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
        case 'H':
          return this.eventColor[3];
        default:
          return this.eventColor[4];
      }
    }
  },
  created() {
    this.fetchAllLeaves();
    this.fetchAllUsers();
    this.fetchPublics();
  },

  beforeMount() {
    this.events = this.addEvents();
  },

  mounted() {
    this.$refs.calendar.move();
  }
};
</script>

<style scoped></style>