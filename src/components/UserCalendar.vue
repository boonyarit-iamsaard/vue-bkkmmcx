<template>
  <v-row class="fill-height">
    <v-col class="pt-0">
      <v-sheet tile height="64" class="d-flex">
        <Spinner v-if="loading" />
        <v-toolbar flat>
          <v-btn dark fab small color="primary" to="/apply">
            <v-icon>mdi-plus</v-icon>
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
          @click:more="viewWeek"
          @click:event="showEvent"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card min-width="300px" rounded="lg" flat>
            <v-toolbar :color="selectedEvent.color" dark flat>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="selectedOpen = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <p><strong>Start:</strong> {{ selectedEvent.start }}</p>
              <p class="mb-0"><strong>End:</strong> {{ selectedEvent.end }}</p>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
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
      selectedOpen: false,
      selectedElement: null,
      selectedEvent: {},
      type: 'month',
      typeLabel: {
        month: 'Month',
        week: 'Week'
      },
      focus: this.$route.params.focus || '2020-12-01',
      events: [],
      eventColor: [
        'secondary',
        'accent',
        'primary',
        'indigo lighten-1',
        'pink darken-1'
      ]
    };
  },
  computed: {
    ...mapGetters([
      'getLeaves',
      'getUserDaysOff',
      'getPublic',
      'getUserProfile'
    ])
  },
  methods: {
    ...mapActions(['fetchLeaves', 'fetchUserDaysOff', 'fetchPublic']),
    addEvents() {
      let events = [];
      // add leaves to events
      for (let leave of this.getLeaves) {
        let event = {
          name: `${leave.phase} | ${this.getUserProfile.firstName} : ${leave.priority}`,
          start: `${leave.startDate}`,
          end: `${leave.endDate}`,
          color: this.setEventColor(leave.priority)
        };
        events.push(event);
      }

      // add days off to events
      for (let dayOff of this.getUserDaysOff) {
        let event = {
          name: 'Day Off',
          start: `${dayOff.startDate}`,
          end: `${dayOff.endDate}`,
          color: 'grey'
        };
        events.push(event);
      }

      // add public holidays to events
      for (let ph of this.getPublic) {
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
    viewWeek({ date }) {
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
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => {
          this.selectedOpen = true;
        }, 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    }
  },
  created() {
    this.fetchLeaves();
    this.fetchUserDaysOff();
    this.fetchPublic();
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
