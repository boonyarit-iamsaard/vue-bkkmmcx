<template>
  <v-container>
    <Details />
    <LeaveList />
    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn color="primary" to="/apply" dark>
          <span class="font-weight-regular">Apply for Leave</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Details from '@/components/Details';
import LeaveList from '@/components/LeaveList';
export default {
  name: 'Profile',
  components: {
    LeaveList,
    Details
  }
};
</script>

<style scoped></style>
