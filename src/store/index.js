import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    apiURL: "https://alpha-vantage.p.rapidapi.com/query",
    headers: {
      "x-rapidapi-host": "alpha-vantage.p.rapidapi.com",
      "x-rapidapi-key": "67a042a49amsha64a877341a3cf7p1cba01jsn09fe2d6747f6",
    },
    searchResults: [],
    dailyResults: [],
    weeklyResults:[],
    monthlyResults:[],
    pathMoves:[]
  },
  mutations: {
    // Set company market values by search
    SET_COMPANY_SEARCH_RESULT(state, payload) {
      state.searchResults = payload;
    },
    // Set company market values daily
    SET_COMPANY_DAILY_DETAIL(state, payload) {
      state.dailyResults = payload;
    },
    // Set company market values weekly
    SET_COMPANY_WEEKLY_DETAIL(state,payload) {
      state.weeklyResults = payload
    },
    // Set company market values monthly
    SET_COMPANY_MONTHLY_DETAIL(state,payload){
      state.monthlyResults = payload
    },
    SET_PATH_MOVES(state,payload){
      state.pathMoves.push(payload)
    }
  },
  actions: {
    // Get company markets values by search
    searchCompanyByName({ state, commit }, payload) {
      return axios
        .get(`${state.apiURL}`, {
          headers: { ...state.headers },
          params: { keywords: payload, function: "SYMBOL_SEARCH" },
        })
        .then((res) => {
         
          commit("SET_COMPANY_SEARCH_RESULT", res.data.bestMatches); //Search result gives best matches
        })
        .catch((err) => console.log(err));
    },
    // Get company daily stock values with market symbol
    getCompanyDailyStockValues({ state, commit }, payload) {
      return axios
        .get(`${state.apiURL}`, {
          headers: { ...state.headers },
          params: {
            symbol: payload,
            function: "TIME_SERIES_DAILY",
          },
        })
        .then((res) => {
         
          commit("SET_COMPANY_DAILY_DETAIL", res.data["Time Series (Daily)"]);
        });
    },
    // Get company weekly stock values with market symbol
    getCompanyWeeklyStockValues({state,commit},payload){
      return axios
        .get(`${state.apiURL}`,{
          headers:{...state.headers},
          params:{
            symbol:payload,
            function: 'TIME_SERIES_WEEKLY'
          },
        })
        .then((res)=>{
         
          commit('SET_COMPANY_WEEKLY_DETAIL',res.data['Weekly Time Series'])
        })
    },
    // Get company monthly stock values with market symbol
    getCompanyMonthlyStockValues({state,commit},payload){
      return axios.get(`${state.apiURL}`,{
        headers:{...state.headers},
        params:{function:'TIME_SERIES_MONTHLY', symbol:payload}
      })
      .then((res)=>{
        commit('SET_COMPANY_MONTHLY_DETAIL',res.data['Monthly Time Series'])
      })
    },
    // Get path moves as a log records
    getPathMoves({commit},payload){
      return commit('SET_PATH_MOVES',payload)
    },
  },
  getters: {
    setDailyResultsThirty(state) { // Sets daily results 30 day
      return Object.values(state.dailyResults).slice(0, 30);
    },
    setDailyDatesThirty(state) { // Sets daily results 30 date
      return Object.keys(state.dailyResults).slice(0, 30);
    },
    setWeeklyResultsThirty(state){ // Sets weekly results 30 date
      return Object.values(state.weeklyResults).slice(0,30)
    },
    setWeeklyDatesThirty(state){ // Sets weekly results 30 date
      return Object.keys(state.weeklyResults).slice(0,30)
    },
    setMonthlyResultsThirty(state){ // Sets montly results 30 date
      return Object.values(state.monthlyResults).slice(0,30)
    },
    setMontlyDatesThirty(state){ // Sets monthly results 30 date
      return Object.keys(state.monthlyResults).slice(0,30)
    },
  
  },

  modules: {},
});
