<template>
  <v-data-table
    :items="getUserDaysOff"
    :sort-by="['startDate']"
    :headers="headers"
    class="elevation-2 rounded-lg mb-0"
  >
    <template v-slot:top>
      <v-toolbar flat class="rounded-t-lg">
        <v-spacer></v-spacer>
        <v-toolbar-title>Days Off</v-toolbar-title>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{}">
      <v-icon color="primary" class="mr-2">
        mdi-pencil
      </v-icon>
      <v-icon color="secondary">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'DaysOffList',
  props: ['userId'],
  data() {
    return {
      headers: [
        { text: 'Start Date', value: 'startDate', align: 'center' },
        { text: 'End Date', value: 'endDate', align: 'center' },
        { text: 'Actions', value: 'actions', align: 'center', sortable: false }
      ]
    };
  },
  methods: {
    ...mapActions(['fetchUserDaysOff'])
  },
  computed: {
    ...mapGetters(['getUserDaysOff'])
  },
  created() {
    this.fetchUserDaysOff(this.userId);
  }
};
</script>

<style lang="scss" scoped></style>
