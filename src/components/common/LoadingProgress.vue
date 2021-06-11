<template>
  <v-dialog max-width="290" persistent :value="isLoading">
    <v-card>
      <v-card-text class="d-flex align-center pa-4">
        <v-progress-circular
          class="mr-4"
          color="primary"
          indeterminate
        ></v-progress-circular>

        <span class="subtitle-1">Processing....</span>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'LoadingProgress',

  computed: {
    ...mapGetters({
      isLoading: 'getIsLoading'
    })
  }
};
</script>

<style lang="scss" scoped></style>
