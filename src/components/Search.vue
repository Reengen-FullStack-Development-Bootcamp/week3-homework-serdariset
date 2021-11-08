<template>
  <v-container>
    <v-row class="d-flex justify-center my-5">
      <v-col class="d-flex justify-center align-center">
        <input
          type="text"
          placeholder="Search any company"
          v-on:keydown.enter="search()"
          class="search-input"
          v-model="searchValue"
        />

      <button class="search-button" @click="search()">
          <i class="fas fa-search-dollar"></i>
        </button> 
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center" >
      <v-col class="d-flex justify-center">
        <v-progress-circular indeterminate color="indigo" v-show="loading"></v-progress-circular>
      </v-col>
    </v-row>
    <v-row v-if="searchQuantity != 0">
      <v-col cols="2" v-for="(item, index) in searchResults" :key="index">
        <div class="markets">
          <span class="market-symbol">{{ item["1. symbol"] }}</span>
          <span class="market-info">{{ item["2. name"] }}</span>
          <span class="market-info"
            >{{ item["5. marketOpen"] }} - {{ item["6. marketClose"] }}</span
          >
          <button class="show-button" @click="showMarket(item['1. symbol'])">
            Show Details
          </button>
        </div>
      </v-col>
    </v-row>
    <v-row v-else class="d-flex justify-center">
      <v-col class="d-flex justify-center">
        <h4>No match..</h4>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "Search",
  data() {
    return {
      searchValue: "",
      searchQuantity: 1,
      loading: false,
      
    };
  },
  computed: {
    ...mapState(["searchResults"]), // get search results
  },
  methods: {
    ...mapActions(["searchCompanyByName"]),
    // search companies with search bar
    search() {
      this.$router.push({name:'Home', query:{symbol:this.searchValue}})
      this.loading = true;
      this.searchCompanyByName(this.searchValue).then(() => { // send api request with search value
        this.searchQuantity = this.searchResults.length;
        this.loading = false;
      });
    },
    showMarket(symbol) {
      this.$router.push({ path: `/market/symbol/${symbol}/daily`  });
    },
  },
};
</script>
<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");

.search-input {
  width: 500px;
  height: 50px;
  border: 3px solid #e0e0e0;
  outline: none;
  border-radius: 10px;
  padding-left: 1rem;
  font-family: "Roboto", sans-serif;
  color: white;

  &:focus {
    border-color: #3f51b5;
  }
  &::placeholder {
    color: white;
  }
}
.search-button {
  width: 50px;
  height: 50px;
  min-width: 50px;
  background-color: transparent;
  border: 3px solid white;
  border-radius: 50%;
  display: flex;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  i {
    color: white;
    font-size: 1rem;
  }
  
}

.markets {
  border: 3px solid white;
  height: 300px;
  border-radius: 10px;
  display: flex;
  padding: 1rem;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  &:hover {
    border-color: #3f51b5;
  }
  .market-symbol {
    color: white;
    font-size: 1.5rem;
  }
  .market-info {
    color: white;
  }
  .show-button {
    width: 140px;
    height: 40px;
    background-color: white;
    border-radius: 10px;
    font-family: "Roboto", sans-serif;
    transition: 0.3s ease;
    &:hover {
      background-color: #3f51b5;
      color: white;
    }
  }
}
h4 {
  color: white;
  font-size: 2rem;
}
</style>
