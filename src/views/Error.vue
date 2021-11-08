<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col class="d-flex justify-center">
        <div class="giphy">
          <h3>Unauthorized login</h3>
          <img :src="require(`@/assets/giphy.gif`)" alt="lotr" />
          <button @click="backToHome()" class="backToHome">Back to Home</button>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Error",
  methods: {
    backToHome() {
      this.$router.push({ path: "/" });
    },
  },
};
</script>

<style scoped>
.giphy {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  flex-direction: column;
}
h3{
    color: white;
    margin-bottom: 2rem;
    font-size: 2rem;
}
.giphy img {
  width: 1000px;
}
.backToHome {
  margin-top: 2rem;
  border: 2px solid white;
  width: 9rem;
  height: 4rem;
  color: white;
}
.backToHome:hover {
  color: black;
  background-color: white;
}
</style>