<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-card>
          <v-card-title class="justify-center">
            <h1 class="display-1 font-weight-light">
              {{ getFullName() }}
            </h1>
          </v-card-title>
          <v-card-subtitle class="pb-0 pt-4">
            <p class="subtitle-2">{{ userProfile.id }}</p>
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
      <v-col>
        <v-card class="rounded-lg">
          <v-card-text>
            <p class="title">ANL-1</p>
            <p class="display-1" v-if="userProfile.anl1 === 1">
              {{ userProfile.anl1 }}
            </p>
            <p class="display-1 red--text text--darken-3" v-else>
              {{ userProfile.anl1 }}
            </p>
            <p>remains</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="rounded-lg">
          <v-card-text>
            <p class="title">ANL-2</p>
            <p class="display-1" v-if="userProfile.anl2 === 1">
              {{ userProfile.anl2 }}
            </p>
            <p class="display-1 red--text text--darken-3" v-else>
              {{ userProfile.anl2 }}
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
import { auth } from '@/plugins/firebase';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Profile',
  created() {
    this.fetchLeaves();
    this.fetchUserProfile(auth.currentUser);
  },
  mounted() {
    this.leaveUsed();
  },
  methods: {
    ...mapActions(['fetchLeaves', 'fetchUserProfile']),
    priorityRemains() {
      return this.userProfile.entitled - this.leaveUsed();
    },
    leaveUsed() {
      return this.getLeaves.reduce((a, b) => a + b.days, 0);
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
