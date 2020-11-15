<template>
  <v-container>
    <v-row>
      <v-col md="10" class="text-center mx-auto">
        <Details />
        <LeaveList />
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
