<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="getAllUsers"
      :items-per-page="5"
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
        <v-icon disabled color="secondary" @click="deleteItem(item)">
          mdi-delete
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
        { text: 'Actions', value: 'actions', sortable: false, align: 'center' }
      ]
    };
  },
  computed: {
    ...mapGetters(['getAllUsers'])
  },
  methods: {
    ...mapActions(['fetchAllUsers']),

    editItem(item) {
      console.log(item);
      // this.$router.push({
      //   name: 'EditLeave',
      //   params: { item: item }
      // });
    },

    async deleteItem(item) {
      console.log(item);
    }
  },
  created() {
    this.fetchAllUsers();
  }
};
</script>

<style lang="scss" scoped></style>
