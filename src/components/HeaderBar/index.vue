<template>
  <div class="headerBar">
      <div id="logo"></div>
      <div class="center">
        <div class="button">
          <i class="iconfont icon-shangyiye"></i>
          <i class="iconfont icon-xiayiye"></i>
        </div>
        <div class="search">
          <el-popover popper-class="searchPop" placement="bottom" width="300" trigger="focus" v-model="isPopover" >
            <!-- 搜索框 -->
            <el-input class="searchInput" v-model="searchInput" @input="inputChange" prefix-icon="el-icon-search" size="mini" slot="reference" placeholder="搜索">
            </el-input>
            <!-- 热搜榜 start -->
            <div class="hotSearch" v-if="!searchInput"> <!-- 输入框为空则显示热搜榜 -->
              <div class="hotSearchTitle">热搜榜</div>
              <!-- 歌曲项 -->
              <!-- <div class="hotSearchItem" v-for="(item,index) in $store.state.home.hotList" :key="index"> -->
              <div class="hotSearchItem" v-for="(item,index) in hotList" :key="index">
                <div class="hotSearchIndex" :class="index < 3 ? 'topThree': '' ">{{index + 1}}</div>
                <div class="hotSearchInfo">
                  <div class="hotSearchName">{{item.searchWord}}</div>
                  <div class="hotSearchContent">{{item.content}}</div>
                </div>
                
              </div>
            </div>
            <!-- 热搜榜 end -->
            <!-- 搜索建议 -->
            <div class="searchSuggest" v-if="searchInput"> <!-- 输入框有值则显示搜索建议 -->
              <div class="enterDetailPage">搜"<span>{{searchInput}}</span>"相关的结果 <i class="el-icon-arrow-right"></i> </div>
              <div class="singleItem" v-if="songs.length > 0">
                <div class="singleTitle"><i class="el-icon-headset"></i>单曲</div>
                <div class="single" v-for="item in songs" :key="item.id">
                  {{item.name+'-'+item.artists[0].name}}
                </div>
              </div>
              <div class="singerItem" v-if="artists.length > 0">
                <div class="singerTitle"><i class="el-icon-user"></i>歌手</div>
                <div class="singer" v-for="item in artists" :key="item.id">{{item.name}}</div>
              </div>
              <div class="albumItem" v-if="albums.length > 0">
                <div class="albumTitle"><i class="el-icon-magic-stick"></i>专辑</div>
                <div class="album"  v-for="item in albums" :key="item.id">{{item.name+'-'+item.artist.name}}</div>
              </div>
            </div>
          </el-popover>
        </div>
      </div>
      <div class="right ">
        登录
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// import {mapState} from 'vuex'
// 节流定时器
export default {
  name: 'HeaderBar',
  data(){
    return {
      // 是否显示Popover
      isPopover:false, 
      // 搜索的内容
      searchInput: "",
      // 节流定时器
      timer: null
    }
  },
  methods:{
    // 获取热搜列表
    getHotList(){
      this.$store.dispatch('home/getHotList')
    },
    // 获取搜索建议列表e
    getSuggestList(e){
      this.$store.dispatch('home/getSuggestList',e)
    },
    // 搜索框输入改变触发回调
    inputChange(e){
      // console.log(e);
      // 定时器没有的时候进入判断
      // clearTimeout(timer)
      // if(e !== '') {
      //   // 当输入框有值,获取搜索建议列表
      //   timer = setTimeout(() => {
      //     this.getSuggestList(e)
      //   }, 300);
      // 节流更好
      if(e !== '') {
        // 当输入框有值,获取搜索建议列表
        this.getSuggestList(e)
        this.timer = setTimeout(() => {
          this.timer = null
        }, 300);
      }
    }
  },
  mounted(){
    // 获取热搜列表
    this.getHotList()
    
  },
  computed:{
    // 获取搜索建议列表中的单曲 歌手 专辑
    ...mapGetters('home',['songs','artists','albums']),
    // ...mapState({
    //   hotList:state => state.home.hotList
    // }),
    // 热搜列表
    hotList(){
      return this.$store.state.home.hotList || []
    },
    // 搜索建议列表
    // suggestList(){
    //   return this.$store.state.home.suggestList || {}
    // }
  }
}

</script>

<style lang="less" scoped>
  .headerBar {
    // position: relative;
    position: fixed;
    z-index: 200;
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
    // padding: 12px;
    .hotSearchTitle {
      margin: 10px 10px ;
      color: #676767;
    }
    .hotSearchItem {
      display: flex;
      align-items: center;
      padding: 5px 10px;
      
      .hotSearchIndex{
        width: 20px;
        height: 20px;
        // text-align: center;
        padding: 0 10px;
        font-size: 14px;
        color: #DEDEDE;
      }
      .topThree {
        color: red;
        font-weight: 600;
      }
      .hotSearchInfo {
        margin-left:10px ;
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
  // 搜索建议列表
  /* 
    searchSuggest
    enterDetailPage
    singleTitle
    single
    singerTitle
    singer
    albumTitle
    album
  */
  .searchSuggest {
    .enterDetailPage{
      padding: 10px 10px;
      font-size: 12px;
      cursor: pointer;
      span {
        color: #507daf;
      }
    }
    .singleTitle,.singerTitle,.albumTitle{
      padding-left:5px ;
      height: 25px;
      line-height: 25px;
      background: rgb(245, 245, 247) ;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      i {
        display: inline-block;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        padding-right:3px ;
      }
    }
    .single,.singer,.album {
      padding:5px 0 5px 30px;
      font-size: 12px;
    }
    .single:hover,.singer:hover,.album:hover {
      cursor: pointer;
      background:#f2f2f2 ;
    }
  }
</style>
