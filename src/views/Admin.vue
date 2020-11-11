<template>
  <v-container>
    <Spinner v-if="loading" />
    <v-row>
      <v-col sm="6" lg="4" class="text-center mx-auto">
        Admin Area is under construction.
        <v-btn block dark color="primary" to="/register"
          >Register New User</v-btn
        >
      </v-col>
      <v-col cols="12">
        <UsersList />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Spinner from '@/components/Spinner';
import UsersList from '@/components/UsersList';
export default {
  name: 'Admin',
  components: {
    Spinner,
    UsersList
  },
  data() {
    return {
      loading: false
    };
  }
};
</script>

<style scoped></style>
