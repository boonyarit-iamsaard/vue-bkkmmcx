<template>
  <v-container class="px-0">
    <Progress v-if="loading" />
    <v-data-table
      :headers="headers"
      :items="leaves"
      :items-per-page="5"
      :sort-by="['startDate']"
      class="elevation-2 rounded-lg"
    >
      <template v-slot:top>
        <v-toolbar flat class="rounded-t-lg">
          <v-btn
            dark
            small
            fab
            color="primary"
            to="/apply"
            v-if="isCurrentUser"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-title>Leave History</v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <v-chip outlined :color="getColor(item.status)">
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:[`item.actions`]="{ item }" v-if="isAdmin">
        <v-icon color="primary" class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon color="secondary" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="editDialog" width="400">
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
          <p class="mb-0">
            <span class="subtitle-2">Priority:</span>
            {{ deleteDialogItem.priority }}
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
  name: 'LeaveList',
  components: {
    Progress,
    UpdateLeave
  },
  data() {
    return {
      userId: this.$route.params.id,
      loading: false,
      deleteDialog: false,
      deleteDialogItem: {},
      deleteResult: false,
      editDialog: false,
      editDialogItem: null,
      message: null,
      headers: [
        { text: 'Start Date', value: 'startDate', align: 'center' },
        { text: 'End Date', value: 'endDate', align: 'center' },
        { text: 'Days', value: 'days', align: 'center' },
        { text: 'Priority', value: 'priority', align: 'center' },
        { text: 'Status', value: 'status', align: 'center' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'left' }
      ]
    };
  },
  computed: {
    ...mapGetters(['getUserProfile', 'getAllLeaves', 'getAllUsers']),
    leaves() {
      return this.getAllLeaves.filter(leave => leave.userId === this.userId);
    },
    profile() {
      return this.getAllUsers.find(user => user.id === this.userId);
    },
    isAdmin() {
      return this.getUserProfile.isAdmin;
    },
    isCurrentUser() {
      if (this.getUserProfile.id === this.$route.params.id) {
        return true;
      } else {
        return false;
      }
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
        name: `${this.profile.firstName} ${this.profile.lastName}`,
        start: item.startDate,
        end: item.endDate,
        days: item.days,
        priority: item.priority
      };
    },
    async deleteLeaveHandler() {
      this.loading = true;
      this.deleteDialog = false;

      // let anl1 = 0;
      // let anl2 = 0;
      // let tyc = 0;
      // if (this.deleteDialogItem.priority === 'ANL-1') {
      //   anl1 = -1;
      // } else if (this.deleteDialogItem.priority === 'ANL-2') {
      //   anl2 = -1;
      // } else if (this.deleteDialogItem.priority === 'TYC') {
      //   tyc = -1;
      // }

      // try {
      //   await this.updatePriorityQuota({
      //     userId: this.deleteDialogItem.userId,
      //     anl1: anl1,
      //     anl2: anl2,
      //     tyc: tyc
      //   });
      // } catch (error) {
      //   console.log(error.message);
      // }

      try {
        await this.deleteLeave(this.deleteDialogItem.id).then(() => {
          this.message = 'Deleted';
          this.deleteResult = true;
        });
      } catch (error) {
        console.log(error.message);
      }

      this.loading = false;
    }
  },
  created() {
    this.fetchAllLeaves();
  }
};
</script>

<style scoped></style>
