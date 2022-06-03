<template>
  <div class="recommendContainer">
    <div class="bannerContainer">
      <el-carousel :interval="4000" type="card" height="200px" >
        <el-carousel-item v-for="(banner,index) in banners" :key="index">
          <div class="banner"><img :src="banner.imageUrl" :alt="banner.typeTitle" :draggable="false"></div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="RsongList">
      <div class="title">
        推荐歌单 <i class="el-icon-arrow-right"></i>
      </div>
      <div class="list" >
        <div class="songItem" v-for="(item,index) in recommendSongList" :key="index" @click="clickSongList(item.id)">
          <div class="item">
            <div class="playCount"><i class="iconfont icon-playLinear"></i>{{item.playcount ? item.playcount : item.playCount | handlePlayCount}}</div>
            <img :src="item.picUrl" alt="" :draggable="false">
          </div>
          <div class="songName">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import {handlePlayCount} from '@/utils/handleTime'
export default {
  name: 'recommend',
  // 登录状态发生变化刷新组件
  inject:['reload'],
  data() {
    return {

    }
  },
  mounted(){
    this.getBanners(),
    this.getRecommendSongList()
  },
  methods:{
    getBanners(){
      this.$store.dispatch('recommend/getBannerList')
    },
    getRecommendSongList() {
      this.$store.dispatch('recommend/getRecommendSongList')
    },
    //点击进入歌单详情界面,把歌单id给切换的组件
    clickSongList(songListId){
      // console.log('songListId',songListId);
      this.$router.push({name:'songListDetail',params:{songListId}})
    },
  },
  computed:{
    // 轮播图
    banners(){
      return this.$store.state.recommend.banners || [] 
    },
    recommendSongList() {
      return this.$store.state.recommend.recommendSongList || []
    },
    // ...mapGetters('recommend')
  },
  filters:{
    handlePlayCount
  },
  watch:{
    '$store.state.user.userId'() {
      // 当登录状态发生变化,则刷新组件
      this.reload()
    }
  }
}
</script>

<style lang="less" scoped>

  .bannerContainer {
    max-width: 1100px;
    margin: auto;
  }
  .banner {
    // width: 550px;
    height: 200px;
    img {
      // width:100%;
      height: 100%;
      border-radius: 10px;
    }
  }
 
  // ::v-deep .el-carousel__item {
  //   width: 100%;
  //   height: 200px;
  // }

  // ::v-deep .el-carousel__item--card {
  //   width: 70%;
  // }
  
  .RsongList {
    max-width: 1100px;
    margin: auto;
    .title {
      width: 100px;
      cursor: pointer;
      font-size: 17px;
      font-weight: 600;
    }
    .list {
      margin-top: 15px;
      width: 100%;
      display: flex;
      // justify-content: space-between;
      flex-wrap: wrap;
      .songItem {
        width: 18.4%;
        // margin-bottom: 40px;
        margin: 0 2% 20px 0;
        // overflow: hidden;
        cursor: pointer;
        .item {
          width:100%;
          // max-width: 200px;
          position: relative;
          border: none;
          &::before {
            position: absolute;
            content: '';
            width: 100%;
            height: 50px;
            // 鼠标会直接穿透过去,不会被当成target
            pointer-events: none;
            background: linear-gradient(to bottom ,rgba(0, 0, 0,.3),transparent);            
            // background-color: red;
            border-radius: 10px;
          }
          .playCount {
            position: absolute;
            top: 0;
            right: 0;
            color: white;
            padding: 6px;
            font-size: 12px;
            .iconfont {
              font-size: 12px;
              padding-right: 5px;
            }
          }
          img{
            width: 100%;
            height: 100%;
            border-radius: 10px;
          }
          &::after {
            content: "";
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background: url("../../../../assets/img/imgLoading.png") no-repeat center;
            background-size: contain;
            border-radius: 10px;
            z-index: -1;
          }
        }
        &:nth-child(5n) {
            margin-right: 0;
        }
        .songName {
          width: 100%;
          padding: 5px 5px 0px 5px;
          font-size: 12px;
          color: #373737;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          &:hover {
            color: black;
          }
        }
      }
      
    }
  }
  
</style>
