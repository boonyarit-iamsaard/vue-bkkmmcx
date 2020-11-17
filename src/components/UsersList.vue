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
        <v-toolbar flat>
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
      <template v-slot:[`item.usedPercent`]="{ item }">
        <v-chip dark :color="getColor(item.used, item.entitled)">
          {{ item.usedPercent }}
        </v-chip>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon disabled class="mr-2">
          mdi-gift
        </v-icon>
        <v-icon color="primary" class="mr-2" @click="viewItem(item)">
          mdi-calendar
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" width="800">
      <Progress v-if="loading" />
      <v-data-table
        :headers="headersPerUser"
        :items="leavePerUser"
        :items-per-page="15"
        :sort-by="['startDate']"
        class="elevation-2"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <v-toolbar-title>{{ dialogName }}</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon color="primary" class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon color="secondary" @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-dialog>
    <v-dialog v-model="editDialog" width="400">
      <UpdateLeave :item="editDialogItem" v-on:close="editDialog = false" />
    </v-dialog>
  </v-container>
</template>

<script>
import Progress from '@/components/Progress.vue';
import UpdateLeave from '@/components/UpdateLeave.vue';
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'UsersList',
  components: {
    Progress,
    UpdateLeave
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
        { text: 'Actions', value: 'actions', sortable: false, align: 'center' }
      ],
      headersPerUser: [
        { text: 'Start Date', value: 'startDate', align: 'left' },
        { text: 'End Date', value: 'endDate', align: 'left' },
        { text: 'Days', value: 'days', align: 'left' },
        { text: 'Priority', value: 'priority', align: 'left' },
        { text: 'Status', value: 'status', align: 'left' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'center' }
      ],
      items: [],
      leavePerUser: [],
      dialogName: null,
      search: null,
      dialog: false,
      editDialog: false,
      editDialogItem: null
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
      'updatePriorityQuata'
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

    viewItem(item) {
      this.leavePerUser = item.leavePerUser;
      this.dialogName = `${item.firstName} ${item.lastName}`;
      this.dialog = true;
    },

    async deleteItem(item) {
      this.loading = true;
      let anl1 = 0;
      let anl2 = 0;
      if (item.priority === 'ANL-1') {
        anl1 = -1;
      } else if (item.priority === 'ANL-2') {
        anl2 = -1;
      }
      console.log(item.userId);

      await this.updatePriorityQuata({
        userId: item.userId,
        anl1: anl1,
        anl2: anl2
      });

      await this.deleteLeave(item.id).then(() => (this.loading = false));
      this.dialog = false;
    },

    editItem(item) {
      this.editDialog = true;
      this.dialog = false;
      this.editDialogItem = item;
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
    this.items = this.setItems();
  }
};
</script>

<style lang="scss" scoped></style>
