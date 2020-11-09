<template>
  <v-container>
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
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'LeaveList',
  computed: {
    ...mapGetters(['getLeaves'])
  },
  methods: {
    ...mapActions(['fetchLeaves']),
    editItem(item) {
      this.$router.push({
        name: 'EditLeave',
        params: { item: item }
      });
    },
    deleteItem(item) {
      console.log(item);
    }
  },
  data() {
    return {
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
    this.fetchLeaves();
  }
};
</script>

<style scoped></style>
