<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-card>
          <v-card-title class="justify-center">
            <h1 class="display-1 font-weight-light">
              {{ getFullName }}
            </h1>
          </v-card-title>
          <v-card-subtitle class="pb-0 pt-4">
            <p class="subtitle-2">{{ staff.id }}</p>
          </v-card-subtitle>
          <v-divider class="mx-4"></v-divider>
          <v-card-text>
            <v-row>
              <v-col>
                <p class="title">Entitled</p>
                <p class="display-1">{{ staff.entitled }}</p>
                <p>days</p>
              </v-col>
              <v-col>
                <p class="title">Used</p>
                <p>
                  <span class="display-1">{{ leaveUsed() }}</span>
                  <span class="subtitle-1"> ({{ percentUsed() }}%)</span>
                </p>
                <p>days</p>
              </v-col>
              <v-col>
                <p class="title">Remains</p>
                <p>
                  <span class="display-1">{{ leaveRemains() }}</span>
                  <span class="subtitle-1"> ({{ percentRemains() }}%)</span>
                </p>
                <p>days</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="rounded-lg">
          <v-card-text>
            <p class="title">ANL-1</p>
            <p class="display-1" v-if="staff.anl1 === 1">
              {{ staff.anl1 }}
            </p>
            <p class="display-1 red--text text--darken-3" v-else>
              {{ staff.anl1 }}
            </p>
            <p>remains</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="rounded-lg">
          <v-card-text>
            <p class="title">ANL-2</p>
            <p class="display-1" v-if="staff.anl2 === 1">
              {{ staff.anl2 }}
            </p>
            <p class="display-1 red--text text--darken-3" v-else>
              {{ staff.anl2 }}
            </p>
            <p>remains</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="rounded-lg">
          <v-card-text>
            <p class="title">ANL-3</p>
            <p class="display-1">{{ priorityRemains() }}</p>
            <p>remains</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Profile",
  data() {
    return {
      staff: null,
      leave: null
    };
  },
  created() {
    this.staff = this.staffsList.find(staff => staff.id === "124430K");
    this.leave = this.leavesList.filter(leave => leave.staffId === "124430K");
  },
  mounted() {
    this.leaveUsed();
  },
  methods: {
    priorityRemains() {
      return this.staff.entitled - this.leaveUsed();
    },
    leaveUsed() {
      return this.leave.reduce((a, b) => a + b.days, 0);
    },
    percentUsed() {
      let percent = (this.leaveUsed() / this.staff.entitled) * 100;
      return percent.toPrecision(4);
    },
    leaveRemains() {
      return this.staff.entitled - this.leaveUsed();
    },
    percentRemains() {
      let percent = (this.leaveRemains() / this.staff.entitled) * 100;
      return percent.toPrecision(4);
    }
  },
  computed: {
    ...mapGetters(["leavesList", "staffsList"]),
    getFullName() {
      return `${this.staff.firstName} ${this.staff.lastName}`;
    }
  }
};
</script>
