<template>
  <v-container class="px-0">
    <v-row class="text-center">
      <v-col>
        <v-card class="rounded-lg">
          <v-card-title class="justify-center">
            <h1
              class="display-1 d-inline-block text-truncate"
              style="max-width: 400px"
            >
              {{ profile.firstName }} {{ profile.lastName.slice(0, 1) }}.
              <!-- {{ getFullName }} -->
            </h1>
          </v-card-title>
          <v-card-subtitle class="pb-0 pt-4">
            <p class="subtitle-1">{{ profile.position }}</p>
            <!-- <p class="subtitle-1">{{ profile.ern }}</p> -->
          </v-card-subtitle>
          <v-divider class="mx-4"></v-divider>
          <v-card-text>
            <v-row>
              <v-col
                v-for="(item, index) in this.setProfileDetails"
                :key="index"
                class="py-0"
              >
                <p class="subtitle-1">{{ item.title }}</p>
                <p class="title">{{ item.value }}</p>
                <p class="caption" v-if="item.percent != null">
                  ({{ item.percent }} %)
                </p>
                <p class="caption mb-0">days</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mt-4 rounded-lg">
          <v-card-title class="d-flex">
            <span class="subtitle-1 text-center" style="width: 50%">
              Vaccination Leave
            </span>

            <span class="subtitle-1 text-center" style="width: 50%">
              Remains
            </span>
          </v-card-title>

          <v-card-text class="d-flex">
            <div class="title text-center" style="width: 50%">
              <div>
                2
              </div>

              <div class="caption mt-2">
                days
              </div>
            </div>

            <div class="title text-center" style="width: 50%">
              <div>
                {{ 2 - leaveUsed().vaccinationLeave || 0 }}
              </div>

              <div class="caption mt-2">
                days
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-row>
          <v-col class="pt-0">
            <v-card class="rounded-lg">
              <v-card-text>
                <v-row>
                  <v-col
                    v-for="(item, index) in this.setPrioritySummary"
                    :key="index"
                    class="py-0"
                  >
                    <p class="subtitle-1">{{ item.title }}</p>
                    <p
                      class="title error--text text--darken-3"
                      v-if="item.value === 0"
                    >
                      {{ item.value }}
                    </p>
                    <p class="title" v-else>
                      {{ item.value }}
                    </p>
                    <p class="caption mb-0">remains</p>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pt-0">
            <v-card class="rounded-lg">
              <v-card-text>
                <v-row>
                  <v-col
                    v-for="(item, index) in this.setSLS"
                    :key="index"
                    class="py-0"
                  >
                    <p class="subtitle-1">{{ item.title }}</p>
                    <p class="title">
                      {{ item.value }}
                    </p>
                    <p class="caption mb-0">days</p>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn
              outlined
              block
              class="mr-2"
              color="accent"
              @click="giftDialog = true"
              v-if="isAdmin"
            >
              Thank You Card
              <v-icon class="ml-4">mdi-gift</v-icon>
            </v-btn>
            <v-btn
              outlined
              block
              color="primary"
              dark
              v-if="isSuperUser"
              class="mt-4"
              @click="daysOffDialog = true"
              >Days Off
              <v-icon class="ml-4">mdi-calendar</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog v-model="giftDialog" width="400">
      <v-card>
        <v-card-title
          >{{ profile.firstName }}
          {{ profile.lastName.slice(0, 1) }}.</v-card-title
        >
        <v-card-text>
          <v-form @submit.prevent="addGift">
            <v-text-field
              name="gift"
              label="Thank You Card"
              type="number"
              v-model="gift"
            ></v-text-field>
            <v-btn block color="accent" type="submit">Submit</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="daysOffDialog" width="600">
      <DayOffList :userId="this.$route.params.id" />
    </v-dialog>
  </v-container>
</template>

<script>
import DaysOffList from '@/components/DayOffList';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Details',
  components: {
    DaysOffList
  },
  data() {
    return {
      valid: true,
      giftDialog: false,
      giftDialogItem: null,
      gift: null,
      daysOffDialog: false
    };
  },
  created() {
    this.fetchAllLeaves();
    this.fetchAllUsers();
  },
  mounted() {
    this.leaveUsed();
  },
  methods: {
    ...mapActions([
      'fetchUserProfile',
      'fetchAllUsers',
      'fetchAllLeaves',
      'updatePriorityQuota'
    ]),

    async addGift() {
      this.giftDialog = false;
      this.loading = true;
      let tyc = parseInt(this.gift, 10);
      await this.updatePriorityQuota({
        userId: this.profile.id,
        tyc: -tyc
      }).then(() => {
        this.loading = false;
        console.log('TYC added');
      });
    },

    priorityRemains() {
      return this.profile.entitled - this.leaveUsed().used;
    },

    leaveUsed() {
      let leave = this.getAllLeaves.filter(
        leave =>
          leave.priority !== 'H' &&
          leave.userId === this.profile.id &&
          leave.status !== 'Rejected'
      );

      let used = leave
        .filter(
          result =>
            result.type !== 'SLS' &&
            result.type !== 'SLS4' &&
            result.type !== 'VCL'
        )
        .reduce((a, b) => a + b.days, 0);

      let anl1 = leave.filter(result => result.priority === 'ANL-1').length;

      let anl2 = leave.filter(result => result.priority === 'ANL-2').length;

      let tyc = leave.filter(result => result.priority === 'TYC').length;

      let sls = leave
        .filter(result => result.type === 'SLS')
        .reduce((a, b) => a + b.days, 0);

      let sls4 = leave
        .filter(result => result.type === 'SLS4')
        .reduce((a, b) => a + b.days, 0);

      let vaccinationLeave = leave
        .filter(result => result.type === 'VCL')
        .reduce((a, b) => a + b.days, 0);

      return { used, anl1, anl2, tyc, sls, sls4, vaccinationLeave };
    },

    percentUsed() {
      let percent = (this.leaveUsed().used / this.profile.entitled) * 100;
      return percent.toFixed(1);
    },
    leaveRemains() {
      return this.profile.entitled - this.leaveUsed().used;
    },
    percentRemains() {
      let percent = (this.leaveRemains() / this.profile.entitled) * 100;
      return percent.toFixed(1);
    },
    setProfile() {
      return this.getAllUsers.find(user => user.id === this.$route.params.id);
    }
  },
  computed: {
    ...mapGetters(['getAllUsers', 'getAllLeaves', 'getUserProfile']),
    profile() {
      if (this.getUserProfile.id === this.$route.params.id) {
        return this.getUserProfile;
      } else {
        return this.getAllUsers.find(user => user.id === this.$route.params.id);
      }
    },
    isAdmin() {
      return this.getUserProfile.isAdmin;
    },
    isSuperUser() {
      let superUser = false;
      if (this.getUserProfile.firstName === 'Boonyarit') {
        superUser = true;
      }
      return superUser;
    },
    setProfileDetails() {
      return [
        {
          title: 'Entitled',
          value: this.profile.entitled,
          percent: null
        },
        {
          title: 'Used',
          value: this.leaveUsed().used,
          percent: this.percentUsed()
        },
        {
          title: 'Remains',
          value: this.leaveRemains(),
          percent: this.percentRemains()
        }
      ];
    },
    setPrioritySummary() {
      return [
        { title: 'TYC', value: this.profile.tyc - this.leaveUsed().tyc },
        { title: 'ANL-1', value: this.profile.anl1 - this.leaveUsed().anl1 },
        { title: 'ANL-2', value: this.profile.anl2 - this.leaveUsed().anl2 },
        { title: 'ANL-3', value: this.priorityRemains() }
      ];
    },
    setSLS() {
      return [
        { title: 'SLS-4', value: this.profile.sls4 || 0 },
        {
          title: 'Remains',
          value: this.profile.sls4 - this.leaveUsed().sls4 || 0
        }
      ];
    }
  }
};
</script>
