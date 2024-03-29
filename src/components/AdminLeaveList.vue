<template>
  <v-container>
    <Progress v-if="loading" />
    <v-data-table
      :headers="headers"
      :items="leaves"
      :items-per-page="10"
      :sort-by="['startDate', 'phase', 'added']"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar flat class="rounded-t-lg">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            clearable
            single-line
            hide-details
          ></v-text-field>

          <v-spacer></v-spacer>

          <v-toolbar-title>All Leaves</v-toolbar-title>
        </v-toolbar>
      </template>

      <template v-slot:[`item.status`]="{ item }">
        <v-avatar size="32" :color="getColor(item.status)">
          <span class="white--text">{{ item.status.substr(0, 1) }}</span>
        </v-avatar>
      </template>

      <template v-slot:[`item.priority`]="{ item }">
        <v-chip outlined :color="setPriorityColor(item.priority)">
          {{ item.priority }}
        </v-chip>
      </template>

      <template v-slot:[`item.added`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-if="item.added"
              color="grey"
              dark
              v-bind="attrs"
              v-on="on"
            >
              mdi-clock
            </v-icon>

            <span v-else>N/A</span>
          </template>

          <span v-if="item.added">{{ new Date(item.added) }}</span>
        </v-tooltip>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>

        <v-icon @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="editDialog" width="435">
      <UpdateLeave :item="editDialogItem" v-on:close="editDialog = false" />
    </v-dialog>

    <v-dialog v-model="deleteDialog" width="400">
      <v-card rounded-lg>
        <v-toolbar color="secondary" dark flat>
          <v-spacer></v-spacer>

          <v-toolbar-title class="justify-center"
            >Confirm Delete</v-toolbar-title
          >

          <v-spacer></v-spacer>
        </v-toolbar>

        <v-card-text class="pa-4">
          <p class="subtitle-2">{{ deleteDialogItem.name }}</p>

          <p>
            <span class="subtitle-2">From:</span> {{ deleteDialogItem.start }}
          </p>

          <p><span class="subtitle-2">End:</span> {{ deleteDialogItem.end }}</p>

          <p>
            <span class="subtitle-2">Days:</span> {{ deleteDialogItem.days }}
          </p>

          <p>
            <span class="subtitle-2">Type: </span>
            {{ deleteDialogItem.type }}
          </p>

          <p>
            <span class="subtitle-2">Priority: </span>
            {{ deleteDialogItem.priority }}
          </p>

          <p class="mb-0">
            <span class="subtitle-2">Phase: </span>
            {{ deleteDialogItem.phase }}
          </p>
        </v-card-text>

        <v-card-actions class="justify-center pb-4 pt-0 px-4">
          <v-btn outlined color="secondary" @click="deleteLeaveHandler">
            delete
            <v-icon class="ml-2">mdi-delete</v-icon>
          </v-btn>

          <v-btn outlined color="primary" @click="deleteDialog = false">
            cancel
            <v-icon class="ml-2">mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteResult" width="400">
      <v-alert type="success" color="primary" class="mb-0" border="left">
        {{ message }}
      </v-alert>
    </v-dialog>
  </v-container>
</template>

<script>
import Progress from '@/components/Progress.vue';
import UpdateLeave from '@/components/UpdateLeave';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'AdminLeaveList',
  components: {
    Progress,
    UpdateLeave
  },
  data() {
    return {
      search: null,
      loading: false,
      yearFilter: 2021,
      monthFilter: 0,
      deleteDialog: false,
      deleteDialogItem: {},
      deleteResult: false,
      editDialog: false,
      editDialogItem: null,
      message: null,
      headers: [
        { text: 'Start Date', value: 'startDate', align: 'center' },
        { text: 'End Date', value: 'endDate', align: 'center' },
        { text: 'Name', value: 'name', align: 'left' },
        { text: 'Days', value: 'days', align: 'center' },
        { text: 'Type', value: 'type', align: 'center' },
        { text: 'Priority', value: 'priority', align: 'center' },
        { text: 'Phase', value: 'phase', align: 'center' },
        { text: 'Status', value: 'status', align: 'left' },
        { text: 'Added', value: 'added', align: 'left' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'left' }
      ],
      eventColor: [
        'secondary',
        'accent',
        'primary',
        'indigo lighten-1',
        'pink darken-1',
        'amber darken-4',
        'blue-grey darken-1'
      ]
    };
  },
  computed: {
    ...mapGetters(['getUserProfile', 'getAllLeaves', 'getAllUsers']),
    leaves() {
      const leaves = this.getAllLeaves;
      const users = this.getAllUsers;

      leaves.forEach(leave => {
        if (!leave.type && leave.priority !== 'H') {
          leave.type = 'ANL';
        } else if (!leave.type && leave.priority === 'H') {
          leave.type = 'H';
        }

        users.forEach(user => {
          if (user.id === leave.userId) {
            leave.name = `${user.firstName} ${user.lastName[0]}.`;
          }
        });
      });

      return leaves;
    }
  },
  methods: {
    ...mapActions(['fetchAllLeaves', 'deleteLeave', 'updatePriorityQuota']),
    getColor(status) {
      if (status === 'Pending') {
        return 'accent';
      } else if (status === 'Approved') {
        return 'primary';
      } else {
        return 'secondary';
      }
    },
    editItem(item) {
      this.editDialog = true;
      this.editDialogItem = Object.assign({}, item);
    },
    deleteItem(item) {
      this.deleteDialog = true;
      this.deleteDialogItem = {
        id: item.id,
        userId: item.userId,
        name: item.name,
        start: item.startDate,
        end: item.endDate,
        days: item.days,
        type: item.type,
        phase: item.phase,
        priority: item.priority
      };
    },
    async deleteLeaveHandler() {
      this.loading = true;
      this.deleteDialog = false;

      try {
        await this.deleteLeave(this.deleteDialogItem.id).then(() => {
          this.message = 'Deleted';
          this.deleteResult = true;
        });
      } catch (error) {
        console.log(error.message);
      }

      this.loading = false;
    },
    setPriorityColor(priority) {
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
        case 'VCL':
          return this.eventColor[5];
        default:
          return this.eventColor[6];
      }
    }
  },
  created() {
    this.fetchAllLeaves();
  }
};
</script>

<style lang="scss" scoped>
::v-deep th > span {
  display: block;
}

::v-deep th {
  color: rgba(0, 0, 0, 0.87) !important;
  font-size: 0.8rem;
  height: auto !important;
  padding: 8px 16px !important;
  vertical-align: top !important;
}
</style>
