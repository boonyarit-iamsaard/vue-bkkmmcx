<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="leaves"
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
      <template v-slot:item.actions="{ item }">
        <v-icon color="#156665" class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon color="#a51d36" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  name: "LeaveList",
  data() {
    return {
      leaves: [],
      headers: [
        { text: "Start Date", value: "startDate", align: "center" },
        { text: "End Date", value: "endDate", align: "center" },
        { text: "Days", value: "days", align: "center" },
        { text: "Priority", value: "priority", align: "center" },
        { text: "Actions", value: "actions", sortable: false, align: "center" }
      ]
    };
  },
  methods: {
    editItem() {},
    deleteItem() {}
  },
  mounted() {
    this.leaves = this.$store.getters.getLeaves;
  }
};
</script>

<style scoped></style>
