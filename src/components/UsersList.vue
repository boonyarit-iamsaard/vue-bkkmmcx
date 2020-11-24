<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="10"
      :search="search"
      :sort-by="['sortIndex', 'firstName', 'lastName']"
      class="elevation-2"
    >
      <template v-slot:top>
        <v-toolbar flat class="rounded-t-lg">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-toolbar-title>Summary</v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:[`item.position`]="{ item }">
        <span class="d-inline-block text-truncate" style="max-width: 100px;">
          {{ item.position }}
        </span>
      </template>
      <template v-slot:[`item.lastName`]="{ item }">
        <span class="d-inline-block text-truncate" style="max-width: 100px;">
          {{ item.lastName }}
        </span>
      </template>
      <template v-slot:[`item.usedPercent`]="{ item }">
        <v-chip outlined :color="getColor(item.used, item.entitled)">
          {{ item.usedPercent }}
        </v-chip>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              color="gray"
              @click="viewProfile(item)"
              v-bind="attrs"
              v-on="on"
            >
              mdi-account
            </v-icon>
          </template>
          <span>View Profile</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import Progress from '@/components/Progress.vue';
import UpdateLeave from '@/components/UpdateLeave.vue';
import ProfileDialog from '@/components/ProfileDialog';
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'UsersList',
  components: {
    Progress,
    UpdateLeave,
    ProfileDialog
  },
  data() {
    return {
      loading: false,
      headers: [
        { text: 'Position', value: 'position', align: 'left' },
        { text: 'Firstname', value: 'firstName', align: 'left' },
        { text: 'Lastname', value: 'lastName', align: 'left' },
        { text: 'Entitled', value: 'entitled', align: 'left' },
        { text: 'Used', value: 'used', align: 'left' },
        { text: 'Used (%)', value: 'usedPercent', align: 'left' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'left' }
      ],
      items: [],
      leavePerUser: [],
      search: null
    };
  },
  computed: {
    ...mapGetters(['getAllUsers', 'getAllLeaves'])
  },
  methods: {
    ...mapActions([
      'fetchAllUsers',
      'fetchAllLeaves',
      'deleteLeave',
      'updatePriorityQuota'
    ]),

    getColor(used, entitled) {
      let result = (used / entitled) * 100;
      if (result >= 50) {
        return 'primary';
      } else if (result > 0) {
        return 'accent';
      } else {
        return 'secondary';
      }
    },

    setItems() {
      let items = [];
      this.getAllUsers.forEach(user => {
        let leavePerUser = [];
        let anlUsed = [];
        this.getAllLeaves.forEach(leave => {
          if (leave.userId === user.id) {
            leavePerUser.push(leave);
          }
          if (leave.userId === user.id && leave.priority !== 'H') {
            anlUsed.push(leave);
          }
        });
        let used = this.leaveUsed(anlUsed);
        let usedPercent = (used / user.entitled) * 100;
        items.push({
          id: user.id,
          sortIndex: user.sortIndex,
          position: user.position,
          firstName: user.firstName,
          lastName: user.lastName,
          entitled: user.entitled.toFixed(1),
          leavePerUser: leavePerUser,
          used: used,
          usedPercent: usedPercent.toFixed(1) + ' %'
        });
      });
      return items;
    },

    leaveUsed(leavePerUser) {
      return leavePerUser.reduce((a, b) => a + b.days, 0);
    },

    viewProfile(item) {
      this.$router.push({ name: 'Profile', params: { id: item.id } });
    }
  },

  created() {
    this.fetchAllUsers();
    this.fetchAllLeaves();
  },

  beforeMount() {
    this.items = this.setItems();
  },

  beforeUpdate() {
    this.fetchAllLeaves();
    this.fetchAllUsers();
    this.items = this.setItems();
  }
};
</script>

<style lang="scss" scoped></style>
