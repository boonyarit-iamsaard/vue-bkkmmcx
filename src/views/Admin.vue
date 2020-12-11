<template>
  <v-container>
    <Spinner v-if="loading" />
    <v-toolbar flat>
      <template>
        <v-tabs v-model="tab">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab v-for="item in items" :key="item">
            {{ item }}
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <UsersList />
      </v-tab-item>
      <v-tab-item>
        <AdminLeaveList />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import { auth } from '@/plugins/firebase';
import Spinner from '@/components/Spinner';
import UsersList from '@/components/UsersList';
import AdminLeaveList from '@/components/AdminLeaveList';

export default {
  name: 'Admin',
  components: {
    Spinner,
    UsersList,
    AdminLeaveList
  },
  data() {
    return {
      loading: false,
      isBoonyarit: false,
      items: ['USERS', 'LEAVES'],
      tab: null
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
