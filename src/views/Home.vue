<template>
  <v-container>
    <v-sheet tile height="64" class="d-flex">
      <v-toolbar flat>
        <v-btn color="#c0b498" to="/profile" dark>
          <span class="font-weight-regular">Profile</span>
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
    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn color="#156665" to="/apply" dark>
          <span class="font-weight-regular">Apply for Leave</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      showMonthOnFirst: false,
      type: "month",
      typeLabel: {
        month: "Month",
        week: "Week",
        day: "Day"
      },
      focus: this.$route.params.focus || "2020-12-01",
      events: [],
      eventColor: ["#a51d36", "#c0b498", "#156665", "gray"],
      leaves: null,
      staffs: null
    };
  },
  methods: {
    getLeaves() {
      for (let leave of this.leaves) {
        for (let staff of this.staffs) {
          if (staff.id === leave.staffId) {
            let event = {
              name: `${staff.firstName} : ${leave.priority}`,
              start: `${leave.startDate}`,
              end: `${leave.endDate}`,
              color: this.setEventColor(leave.priority)
            };
            this.events.push(event);
          }
        }
      }
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setEventColor(priority) {
      switch (priority) {
        case "ANL-1":
          return this.eventColor[0];
        case "ANL-2":
          return this.eventColor[1];
        case "ANL-3":
          return this.eventColor[2];
        default:
          return this.eventColor[-1];
      }
    }
  },
  mounted() {
    this.$refs.calendar.move();
    this.leaves = this.$store.getters.getLeaves;
    this.staffs = this.$store.state.staffs;
    this.getLeaves();
  }
};
</script>

<style scoped>
/deep/ .v-toolbar__content {
  padding: 1rem 0 !important;
}
</style>
