<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="50"
      :sort-by="['firstName', 'lastName']"
      class="elevation-2"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-toolbar-title>All Users</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon disabled color="primary" class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'UsersList',
  data() {
    return {
      headers: [
        { text: 'Firstname', value: 'firstName', align: 'left' },
        { text: 'Lastname', value: 'lastName', align: 'left' },
        { text: 'Entitled', value: 'entitled', align: 'left' },
        { text: 'Used', value: 'used', align: 'left' },
        { text: '%', value: 'usedPercent', align: 'left' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'center' }
      ],
      items: []
    };
  },
  computed: {
    ...mapGetters(['getAllUsers', 'getAllLeaves'])
  },
  methods: {
    ...mapActions(['fetchAllUsers', 'fetchAllLeaves']),

    setItems() {
      let items = [];
      this.getAllUsers.forEach(user => {
        let leavePerUser = [];
        this.getAllLeaves.forEach(leave => {
          if (leave.userId === user.id && leave.priority !== 'H') {
            leavePerUser.push(leave);
          }
        });
        let used = this.leaveUsed(leavePerUser);
        items.push({
          firstName: user.firstName,
          lastName: user.lastName,
          entitled: user.entitled,
          used: used,
          usedPercent: (used / user.entitled) * 100
        });
      });
      return items;
    },

    leaveUsed(leavePerUser) {
      return leavePerUser.reduce((a, b) => a + b.days, 0);
    },

    editItem(item) {
      console.log(item);
      // this.$router.push({
      //   name: 'EditLeave',
      //   params: { item: item }
      // });
    }
  },
  created() {
    this.fetchAllUsers();
    this.fetchAllLeaves();
  },
  beforeMount() {
    this.items = this.setItems();
  },
  mounted() {}
};
</script>

<style lang="scss" scoped></style>
