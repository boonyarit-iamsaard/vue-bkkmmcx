<template>
  <v-row class="fill-height">
    <v-col class="py-0">
      <v-sheet tile class="d-flex">
        <Spinner v-if="loading" />
        <v-toolbar flat class="mt-4">
          <!-- <v-btn dark fab small color="primary" to="/apply">
            <v-icon>mdi-plus</v-icon>
          </v-btn> -->
          <v-select
            :items="selectedUser"
            item-text="name"
            item-value="id"
            v-model="user"
            return-object
            dense
            label="User"
          ></v-select>
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
      <v-sheet height="700">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :type="type"
          :show-month-on-first="showMonthOnFirst"
          :events="addEvents"
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
              <p><strong>End:</strong> {{ selectedEvent.end }}</p>
              <p><strong>Days:</strong> {{ selectedEvent.days }}</p>
              <p><strong>Status:</strong> {{ selectedEvent.status }}</p>
              <v-btn
                dark
                color="primary"
                @click="onEditDayOff(selectedEvent)"
                v-if="selectedEvent.name === 'Day Off'"
                >Edit</v-btn
              >
            </v-card-text>
          </v-card>
        </v-menu>
      </v-sheet>
      <v-dialog
        v-model="editDayOffDialog"
        max-width="435"
        transition="dialog-transition"
      >
        <EditDayOff
          :dayOff="selectedEvent"
          v-on:close="editDayOffDialog = false"
        />
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import Spinner from '@/components/Spinner.vue';
import EditDayOff from '@/components/EditDayOff.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'DayOffCalendar',
  components: {
    Spinner,
    EditDayOff
  },
  data() {
    return {
      loading: false,
      editDayOffDialog: false,
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
      eventColor: [
        'secondary',
        'accent',
        'primary',
        'indigo lighten-1',
        'pink darken-1',
        'amber darken-4',
        'blue-grey darken-1'
      ],
      user: { name: 'Adisorn', id: 'eIJDOnEV86eKak3eIZDtiXb9OTB3' }
    };
  },
  computed: {
    ...mapGetters([
      'getLeaves',
      'getAllLeaves',
      'getAllDaysOff',
      'getPublic',
      'getUserProfile',
      'getAllUsers'
    ]),
    addEvents() {
      let events = [];

      // add leaves to events
      this.getAllLeaves.forEach(leave => {
        if (leave.status !== 'Rejected' && leave.userId === this.user.id) {
          let event = {
            name: `${leave.priority} | ${this.user.name} : ${leave.phase}`,
            start: `${leave.startDate}`,
            end: `${leave.endDate}`,
            days: `${leave.days}`,
            status: `${leave.status}`,
            color: this.setEventColor(leave.priority)
          };
          events.push(event);
        }
      });

      // add days off to events
      this.getAllDaysOff.forEach(off => {
        if (off.userId === this.user.id) {
          let event = {
            id: off.id,
            name: 'Day Off',
            start: `${off.startDate}`,
            end: `${off.endDate}`,
            color: 'grey'
          };
          events.push(event);
        }
      });

      // add public holidays to events
      this.getPublic.forEach(ph => {
        let event = {
          name: `${ph.name}`,
          start: `${ph.startDate}`,
          end: `${ph.endDate}`,
          color: `${ph.color}`
        };
        events.push(event);
      });

      return events;
    },
    selectedUser() {
      const selectedUser = [];
      this.getAllUsers.forEach(user =>
        selectedUser.push({ name: user.firstName, id: user.id })
      );
      return selectedUser.sort(this.compare);
    }
  },
  methods: {
    ...mapActions(['fetchAllLeaves', 'fetchPublic', 'fetchAllDaysOff']),
    onEditDayOff(selectedEvent) {
      this.selectedOpen = false;
      this.editDayOffDialog = true;
      console.log(selectedEvent.id, selectedEvent.start, selectedEvent.end);
    },
    compare(a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
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
        case 'TYC':
          return this.eventColor[4];
        case 'SLS':
        case 'SLS4':
          return this.eventColor[5];
        default:
          return this.eventColor[6];
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
    this.fetchAllDaysOff();
    this.fetchAllLeaves();
    this.fetchPublic();
  },
  mounted() {
    this.$refs.calendar.move();
  }
};
</script>
