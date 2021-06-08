<template>
  <v-card max-width="599" class="mx-auto my-4 pa-4">
    <v-card-text>
      <span class="title">Users</span>
    </v-card-text>

    <v-data-table
      :headers="headers"
      :items="getAllUsers"
      :items-per-page="10"
      :sort-by="['firstName']"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon @click="clickEditIcon(item)">
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'AdminUserList',

  data() {
    return {
      headers: [
        { text: 'Firstname', value: 'firstName' },
        { text: 'Lastname', value: 'lastName' },
        { text: '', value: 'actions', align: 'right' }
      ]
    };
  },

  methods: {
    clickEditIcon(item) {
      console.log(item.id);
      this.$router.push({
        name: 'AdminUsersDetailsForm',
        params: { id: item.id }
      });
    }
  },

  computed: {
    ...mapGetters(['getAllUsers'])
  }
};
</script>

<style lang="scss" scoped></style>
