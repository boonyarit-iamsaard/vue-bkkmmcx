<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-card>
          <v-card-title class="justify-center">
            <h1 class="display-1">
              {{ getFullName() }}
            </h1>
          </v-card-title>
          <v-card-subtitle class="pb-0 pt-4">
            <p class="subtitle-1">{{ userProfile.position }}</p>
            <p class="subtitle-1">{{ userProfile.ern }}</p>
          </v-card-subtitle>
          <v-divider class="mx-4"></v-divider>
          <v-card-text>
            <v-row>
              <v-col>
                <p class="title">Entitled</p>
                <p class="display-1">{{ userProfile.entitled }}</p>
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
      <v-col v-for="(item, index) in this.prioritySummary" :key="index">
        <v-card class="rounded-lg">
          <v-card-text>
            <p class="title">{{ item.title }}</p>
            <p
              class="display-1 error--text text--darken-3"
              v-if="item.value === 0"
            >
              {{ item.value }}
            </p>
            <p class="display-1" v-else>
              {{ item.value }}
            </p>
            <p>remains</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { auth } from '@/plugins/firebase';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Profile',
  data() {
    return {
      prioritySummary: []
    };
  },
  created() {
    this.fetchLeaves();
    this.fetchUserProfile(auth.currentUser);
  },
  mounted() {
    // this.prioritySummary = this.setPrioritySummary();
    this.leaveUsed();
  },
  beforeUpdate() {
    this.fetchLeaves();
    this.fetchUserProfile(auth.currentUser);
    this.prioritySummary = this.setPrioritySummary();
  },
  methods: {
    ...mapActions(['fetchLeaves', 'fetchUserProfile']),
    setPrioritySummary() {
      return [
        { title: 'TYC', value: this.userProfile.tyc },
        { title: 'ANL-1', value: this.userProfile.anl1 },
        { title: 'ANL-2', value: this.userProfile.anl2 },
        { title: 'ANL-3', value: this.priorityRemains() }
      ];
    },
    priorityRemains() {
      return this.userProfile.entitled - this.leaveUsed();
    },
    leaveUsed() {
      let leave = this.getLeaves.filter(leave => leave.priority !== 'H');
      return leave.reduce((a, b) => a + b.days, 0);
    },
    percentUsed() {
      let percent = (this.leaveUsed() / this.userProfile.entitled) * 100;
      return percent.toPrecision(4);
    },
    leaveRemains() {
      return this.userProfile.entitled - this.leaveUsed();
    },
    percentRemains() {
      let percent = (this.leaveRemains() / this.userProfile.entitled) * 100;
      return percent.toPrecision(4);
    },
    getFullName() {
      return `${this.userProfile.firstName} ${this.userProfile.lastName}`;
    }
  },
  computed: {
    ...mapGetters(['getLeaves', 'userProfile'])
  }
};
</script>
