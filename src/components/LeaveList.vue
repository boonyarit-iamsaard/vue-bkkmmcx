<template>
  <v-container>
    <Progress v-if="loading" />
    <v-data-table
      :headers="headers"
      :items="getLeaves"
      :items-per-page="5"
      :sort-by="['startDate']"
      class="elevation-2"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-btn dark small fab color="primary" to="/apply">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-title>Leave History</v-toolbar-title>
        </v-toolbar>
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
  </v-container>
</template>

<script>
import Progress from '@/components/Progress.vue';
import UpdateLeave from '@/components/UpdateLeave';
// import { auth } from '@/plugins/firebase';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'LeaveList',
  components: {
    Progress,
    UpdateLeave
  },
  data() {
    return {
      loading: false,
      isAdmin: false,
      editDialog: false,
      editDialogItem: null,
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
    ...mapGetters(['getLeaves', 'userProfile'])
  },
  methods: {
    ...mapActions(['fetchLeaves', 'deleteLeave', 'updatePriorityQuota']),
    editItem(item) {
      console.log(item);
      this.editDialog = true;
      // this.dialog = false;
      this.editDialogItem = item;
    },
    async deleteItem(item) {
      console.log(item);
      // this.loading = true;
      // let anl1 = 0;
      // let anl2 = 0;
      // if (item.priority === 'ANL-1') {
      //   anl1 = -1;
      // } else if (item.priority === 'ANL-2') {
      //   anl2 = -1;
      // }
      //
      // await this.updatePriorityQuota({
      //   userId: auth.currentUser.uid,
      //   anl1: anl1,
      //   anl2: anl2
      // });
      //
      // await this.deleteLeave(item.id).then(() => (this.loading = false));
    }
  },
  created() {
    this.fetchLeaves();
    this.isAdmin = this.userProfile.isAdmin;
  }
};
</script>

<style scoped></style>
