<template>
  <v-container class="container--fluid">
    <v-row class="header" >
      <v-col class="d-flex justify-start "><span @click="homePage()" class="dollar"><i class="fas fa-dollar-sign"></i></span></v-col>
      <v-col class="d-flex justify-end">
        <div>
          <select name="user" id="user" class="user-select" v-model="selected">
            <option value="guest">Guest</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <span @click="goAdminPage"><i class="fas fa-user"></i></span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'Header',
    data(){
      return{
        selected:'guest'
      }
    },
    methods:{
      homePage(){
        this.$router.push({path:'/'})
      },
      goAdminPage(){
        if(this.selected == 'guest'){
          this.$router.push({path:'/error'})
        }else if(this.selected == 'admin'){
          this.$router.push({path:'/admin'})
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .header{
     background-color: #202124;
     border-bottom: 3px solid white;
    height: 100px;
    align-items: center;
    padding: 0rem 10rem;
    display: flex;
  }
  .header span{
    color: white;
  }
  .dollar{
    cursor: pointer;
  }
  .user-select{
    margin-right: 1rem;
    color: white;
    width: 4rem;
    cursor: pointer;
  }
  .fa-user{
    cursor: pointer;
  }
</style>
