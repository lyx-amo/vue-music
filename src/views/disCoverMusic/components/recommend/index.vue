<template>
  <div class="recommendContainer">
    <div class="bannerContainer">
      <el-carousel :interval="4000" type="card" height="200px">
        <el-carousel-item v-for="(banner,index) in banners" :key="index">
          <div class="banner"><img :src="banner.imageUrl" :alt="banner.typeTitle"></div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="RsongList">
      <div class="title">
        推荐歌单 <i class="el-icon-arrow-right"></i>
      </div>
      <div class="list" >
        <div class="songItem" v-for="(item,index) in songList" :key="index" @click="clickSongList(item.id)">
          <div class="item">
            <img :src="item.picUrl" alt="">
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
import { mapGetters } from 'vuex'
export default {
  name: 'recommend',
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
    }
  },
  computed:{
    // 轮播图
    banners(){
      return this.$store.state.recommend.banners || [] 
    },
    ...mapGetters('recommend',['songList','hasTaste'])
  }
}
</script>

<style lang="less" scoped>
  .bannerContainer {
    width: 1100px;
    margin: auto;
  }
  .banner {
    // width: 550px;
    height: 200px;
    img {
      // width: 100%;
      height: 100%;
      border-radius: 10px;
    }
  }
 
  .el-carousel__item {
    // width: 550px;
    height: 200px;
  }
  
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
          img{
            width: 100%;
            height: 100%;
            border-radius: 10px;
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
