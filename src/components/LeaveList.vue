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
    </v-data-table>
  </v-container>
</template>

<script>
import Progress from '@/components/Progress.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'LeaveList',
  components: {
    Progress
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
        { text: 'Status', value: 'status', align: 'center' }
      ]
    };
  },
  computed: {
    ...mapGetters(['getLeaves', 'userProfile'])
  },
  methods: {
    ...mapActions(['fetchLeaves'])
  },
  created() {
    this.fetchLeaves();
  }
};
</script>

<style scoped></style>
