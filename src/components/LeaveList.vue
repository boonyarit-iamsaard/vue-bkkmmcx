<template>
  <v-container>
    <Spinner v-if="loading" />
    <v-data-table
      :headers="headers"
      :items="getLeaves"
      :items-per-page="5"
      class="elevation-2"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-toolbar-title>Leave History</v-toolbar-title>
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
  </v-container>
</template>

<script>
import Spinner from '@/components/Spinner.vue';
import { auth } from '@/plugins/firebase';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'LeaveList',
  components: {
    Spinner
  },
  computed: {
    ...mapGetters(['getLeaves'])
  },
  methods: {
    ...mapActions(['fetchLeaves', 'deleteLeave', 'updatePriorityQuata']),
    editItem(item) {
      this.$router.push({
        name: 'EditLeave',
        params: { item: item }
      });
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

      await this.updatePriorityQuata({
        userId: auth.currentUser.uid,
        anl1: anl1,
        anl2: anl2
      });

      await this.deleteLeave(item.id).then(() => (this.loading = false));

      // this.$router.push({ name: 'Home' });
    }
  },
  data() {
    return {
      loading: false,
      headers: [
        { text: 'Start Date', value: 'startDate', align: 'center' },
        { text: 'End Date', value: 'endDate', align: 'center' },
        { text: 'Days', value: 'days', align: 'center' },
        { text: 'Priority', value: 'priority', align: 'center' },
        { text: 'Status', value: 'status', align: 'center' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'center' }
      ]
    };
  },
  created() {
    this.fetchLeaves(auth.currentUser);
  }
};
</script>

<style scoped></style>
