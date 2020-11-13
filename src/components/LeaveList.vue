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
          <v-spacer></v-spacer>
          <v-toolbar-title>Leave History</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import Progress from '@/components/Progress.vue';
import { auth } from '@/plugins/firebase';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'LeaveList',
  components: {
    Progress
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
        { text: 'Status', value: 'status', align: 'center' }
      ]
    };
  },
  created() {
    this.fetchLeaves(auth.currentUser);
  }
};
</script>

<style scoped></style>
