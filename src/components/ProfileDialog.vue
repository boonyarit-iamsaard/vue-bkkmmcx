<template>
  <v-card>
    <v-card-title class="justify-center"
      >{{ profile.firstName }} {{ profile.lastName }}</v-card-title
    >
    <v-card-text>
      <v-row>
        <v-col>
          <p>{{ profile.entitled }}</p>
        </v-col>
        <v-col>
          <p>{{ profile.anl1 }}</p>
        </v-col>
        <v-col>
          <p>{{ profile.anl2 }}</p>
        </v-col>
        <v-col>
          <p>{{ profile.tyc }}</p>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'ProfileDialog',
  props: ['id'],
  data() {
    return {
      profile: null
    };
  },
  computed: {
    ...mapGetters(['getAllUsers'])
  },
  methods: {
    getProfile() {
      return this.getAllUsers.find(user => user.id === this.id.id);
    }
  },
  created() {
    this.profile = this.getProfile();
  }
};
</script>

<style scoped></style>
