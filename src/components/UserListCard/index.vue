<template>
  <div class="userListContainer">
    <div class="userItem" v-for="(item,index) in subscribers" :key="index">
        <div class="userImg">
            <img :src="item.avatarUrl" :draggable="false" alt="">
        </div>
        <div class="userInfo">
            <div class="userName">
                {{item.nickname}}
            </div>
            <div class="sign">
                {{item.signature}}
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserListCard',
  props:{
    subscribers:{
      type:Array,
      default(){
        return []
      }
    }
  },
  methods:{
    
  }
}
</script>

<style lang="less" scoped>
  .userListContainer {
    display: flex;  
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .userItem {
    display: flex;
    // border: 1px solid black;
    margin:0 50px 30px 0;
    .userImg{
      width: 80px;
      height: 80px;
      margin-right: 10px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .userInfo {
      display: flex;
      flex-flow: column;
      justify-content: center;
      width: 200px;
      .userName {
        font-size: 14px;
        padding-bottom: 10px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap
      }
      .sign {
        font-size: 12px;
        color: #373737;
        font-weight: 400;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap
      }
    }
  }
</style>
