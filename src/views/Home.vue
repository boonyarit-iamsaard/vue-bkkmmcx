<template>
  <v-container>
    <UserCalendar />
  </v-container>
</template>

<script>
import UserCalendar from '@/components/UserCalendar.vue';

export default {
  name: 'Home',
  components: {
    UserCalendar
  }
};
</script>

<style scoped></style>
