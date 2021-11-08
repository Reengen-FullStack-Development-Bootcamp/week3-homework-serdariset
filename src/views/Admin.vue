<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col class="d-flex justify-center" cols="12"> 
        <v-treeview :items="items" dark open-on-click></v-treeview>
      </v-col>
     
   
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Admin",
  data() {
    return {


      items: [
        {
          id: 1,
          name: "Log records",
          children: [],
        },
        {
          id: 2,
          name: "Unauthorized logs",
          children: [
           
          ],
        },
      ],
    };
  },
  mounted(){
    
      
      for (let index = 0; index < this.pathMoves.length; index++) {
        if (this.pathMoves[index]['to:'] == "/error") {
          this.items[1].children.push({
            id:index,
            name:`${this.pathMoves[index]['date:'].slice(0,25)}`,
            children:[
              {id:index, name:`to: ${this.pathMoves[index]['to:']}`},
              {id:index, name:`from: ${this.pathMoves[index]['from:']}`}
            ]
          
            })
        }
      }
      for (let index = 0; index < this.pathMoves.length; index++) {
        if (this.pathMoves[index]['to:'] !== "/error") {
          this.items[0].children.push({
            id:index,
            name:`${this.pathMoves[index]['date:'].slice(0,25)}`,
            children:[
              {id:index, name:`to: ${this.pathMoves[index]['to:']}`},
              {id:index, name:`from: ${this.pathMoves[index]['from:']}`}
            ]
          
            })
        }
      }
      
   
  },
 
  computed: {
    ...mapState(["pathMoves"]),
    
    /* takeErrors() {
      let errors =[];
      for (let index = 0; index < this.pathMoves.length; index++) {
        if (this.pathMoves[index]['to:'] == "/error") {
          errors.push(this.pathMoves[index])
        }
      }
      return errors;
    }, */
  },
};
</script>

<style>
.v-treeview{
  width: 100%;
}
.v-treeview-node__root{
  border: 2px solid white;
}
</style>