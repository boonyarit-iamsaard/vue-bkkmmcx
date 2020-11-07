<template>
  <v-container>
    <UpdateLeave :item="item" />
  </v-container>
</template>

<script>
import UpdateLeave from '../components/UpdateLeave';
export default {
  name: 'EditLeave',
  components: { UpdateLeave },
  data() {
    return {
      item: this.$route.params.item
    };
  },
  created() {
    // console.log(JSON.stringify(this.item));
  }
};
</script>

<style></style>
