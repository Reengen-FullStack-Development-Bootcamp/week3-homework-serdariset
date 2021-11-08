<template>
  <v-app>
   
    <Header/>
    
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import Header from '@/components/Header.vue'
import { mapActions } from 'vuex';

export default {
  name: 'App',
 
  components:{
    Header,
    
  },
  methods:{
    ...mapActions(['getPathMoves']) // vuex path change method
  },

    // watch path changes
  watch:{
    $route(to,from){
 
      let date = new Date()
      let moves = {
        "date:": `${date}`,
        "to:":`${to.path}`,
        "from:":`${from.path}`
        }
      
      // send path changes to vuex
      this.getPathMoves(moves)
    }
  }


};
</script>
<style>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

</style>
