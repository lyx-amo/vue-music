<template>
  <div class="headerBar">
      <div id="logo"></div>
      <div class="center">
        <div class="button">
          <i class="iconfont icon-shangyiye"></i>
          <i class="iconfont icon-xiayiye"></i>
        </div>
        <div class="search">
          <el-popover placement="bottom" width="300" trigger="focus">
            <!-- 搜索框 -->
            <el-input class="searchInput" v-model="searchInput" prefix-icon="el-icon-search" size="mini" slot="reference" placeholder="搜索">
            </el-input>
            <!-- 热搜榜 start -->
            <div class="hotSearch">
              <div class="hotSearchTitle">热搜榜</div>
              <!-- 歌曲项 -->
              <div class="hotSearchItem">
                <div class="hotSearchIndex">1</div>
                <div class="hotSearchInfo">
                  <div class="hotSearchName">孤勇者</div>
                  <div class="hotSearchContent">就算只能呜咽,也能怀着卑微却孤高的梦,也能怀着卑微却孤高的梦,也能怀着卑微却孤高的梦,也能怀着卑微却孤高的梦,也能怀着卑微却孤高的梦</div>
                </div>
                
              </div>
            </div>
            <!-- 热搜榜 end -->

          </el-popover>
        </div>
      </div>
      <div class="right ">
        登录
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'HeaderBar',
  data(){
    return {
      // 搜索的内容
      searchInput: "",
    }
  },
  // mounted(){
  //   // reqHotList().then(result => {
  //   //   console.log(result);
  //   // })

  //   this.$store.dispatch('getHotList')
  // }
  computed:{
    ...mapState({
      // 热搜列表
      hotList: state => state.home.hotList 
    })
  }
}
</script>

<style lang="less" scoped>
  @import "./headerBar_element.css";
  .headerBar {
    position: relative;
    width: 100%;
    height: 50px;
    background-color: rgb(60,57,70);
    // logo
    #logo {
      float: left;
      justify-content: flex-start;
      width: 176px;
      height: 50px;
      background: url('../../assets/img/topbar.png') 0px -10px no-repeat ;
      transform: scale(.8);
      margin-right: 80px;
    }
    .center {
      display: flex;
      .button{
        width: 80px;
        margin-right: 50px;
        line-height: 50px;
        color: white;
        .icon-shangyiye {
          margin-right: 10px;
        }
        i {
          padding: 5px;
          background: #373440;
          border-radius: 50%;
        }
      }
      // 搜索框
      .search {
        display: flex;
        align-items: center;
        width: 200px;
        height: 50px;
      }
    }
    // 登录
    .right{
      position: absolute;
      top: 0px;
      right: 50px;
      width: 100px;
      height: 50px;
      text-align: center;
      line-height: 50px;
      color: white;
    }
  }
  // 热搜榜 start
  .hotSearch {
    .hotSearchTitle {
      margin: 0 0 10px 0;
      color: #676767;
    }
    .hotSearchItem {
      display: flex;
      align-items: center;
      .hotSearchIndex{
        margin-right: 15px;
        font-size: 13px;
        color: red;
      }
      .hotSearchInfo {
        font-size: 12px;
        overflow:hidden;
        white-space:nowrap;
        text-overflow: ellipsis;
        .hotSearchName {
          font-weight: 800;
        }
        .hotSearchContent {
          font-size: 12px;
          color: #676767;
        }
      }
    }
    .hotSearchItem:hover {
      cursor: pointer;
      background-color: #f2f2f2;
    }
  }
</style>
