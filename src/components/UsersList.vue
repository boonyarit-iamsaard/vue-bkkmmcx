<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="setItems"
      :items-per-page="10"
      :search="search"
      :sort-by="['sortIndex', 'name']"
      class="elevation-0"
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
      <template v-slot:item.actions="{ item }">
        <div class="d-flex align-center">
          <v-icon class="mr-2" @click="viewProfile(item)">
            mdi-account
          </v-icon>

          <v-icon @click="editUser(item)">
            mdi-pencil
          </v-icon>
        </div>
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
    ProfileDialog,
    Progress,
    UpdateLeave
  },
  data() {
    return {
      loading: false,
      headers: [
        { text: 'Position', value: 'position', align: 'left' },
        { text: 'Name', value: 'name', align: 'left' },
        { text: 'ANL', value: 'entitled', align: 'left' },
        { text: 'ANL-Used', value: 'used', align: 'left' },
        { text: 'ANL-Used (%)', value: 'usedPercent', align: 'left' },
        { text: 'SLS4', value: 'slsEntitled', align: 'left' },
        { text: 'SLS4-Used', value: 'sls', align: 'left' },
        { text: 'SLS4-Remains', value: 'slsRemains', align: 'left' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'left' }
      ],
      search: null
    };
  },
  computed: {
    ...mapGetters(['getAllUsers', 'getAllLeaves']),
    setItems() {
      let items = [];
      this.getAllUsers.forEach(user => {
        let sls = this.getAllLeaves.filter(
          leave =>
            leave.type === 'SLS4' &&
            leave.userId === user.id &&
            leave.status !== 'Rejected'
        );
        let anl = this.getAllLeaves.filter(
          leave =>
            leave.userId === user.id &&
            leave.priority !== 'H' &&
            leave.status !== 'Rejected' &&
            leave.type !== 'SLS'
        );
        let anlUsed = this.leaveUsed(anl);
        let slsUsed = this.leaveUsed(sls);
        let usedPercent = (anlUsed / user.entitled) * 100;
        items.push({
          id: user.id,
          sortIndex: user.sortIndex,
          position: user.position,
          name: `${user.firstName} ${user.lastName.slice(0, 1)}.`,
          lastName: user.lastName,
          entitled: user.entitled.toFixed(1),
          used: anlUsed,
          usedPercent: usedPercent.toFixed(1) + ' %',
          slsEntitled: user.sls4 || 0,
          sls: slsUsed,
          slsRemains: user.sls4 - slsUsed || 0
        });
      });
      return items;
    }
  },
  methods: {
    ...mapActions(['fetchAllUsers', 'fetchAllLeaves', 'deleteLeave']),

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

    leaveUsed(leave) {
      return leave.reduce((a, b) => a + b.days, 0);
    },

    viewProfile(item) {
      this.$router.push({ name: 'Profile', params: { id: item.id } });
    },

    editUser(item) {
      this.$router.push({
        name: 'AdminUsersDetailsForm',
        params: { id: item.id }
      });
    }
  },

  created() {
    this.fetchAllUsers();
    this.fetchAllLeaves();
  }
};
</script>

<style lang="scss" scoped></style>
