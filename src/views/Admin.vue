<template>
  <v-container>
    <Spinner v-if="loading" />
    <v-row>
      <v-col sm="6" lg="4" class="text-center mx-auto" v-if="!isBoonyarit">
        <v-btn block dark color="primary" to="/register"
          >Creat User Profile</v-btn
        >
      </v-col>
      <v-col cols="12">
        <UsersList />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { auth } from '@/plugins/firebase';
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
      loading: false,
      isBoonyarit: false
    };
  },
  created() {
    if (auth.currentUser.firstName === 'Boonyarit') {
      this.isBoonyarit = true;
    }
  }
};
</script>

<style scoped></style>
