<template>
  <v-container>
    <SignIn />
  </v-container>
</template>

<script>
import SignIn from "@/components/LoginForm";
export default {
  name: "SignInView",
  components: { SignIn }
};
</script>

<style scoped></style>
