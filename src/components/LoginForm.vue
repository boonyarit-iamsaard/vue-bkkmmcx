<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col md="8" lg="4" class="mx-auto">
          <v-card rounded-lg class="pa-4">
            <p class="display-1 font-weight-light text-center">Signin</p>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  filled
                  color="#156665"
                  label="E-Mail"
                  required
                ></v-text-field>
                <v-text-field
                  filled
                  color="#156665"
                  label="Password"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn block dark color="#156665">
                  <span class="font-weight-light">Signin</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  name: "SignIn"
};
</script>

<style scoped></style>
