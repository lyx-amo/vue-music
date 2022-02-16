<template>
  <div class="disCoverContainer">
    <!-- 发现音乐 -->
    <TabBar @handleTabBarItem="handleTabBarItem" :tabBarList="tabBarList"></TabBar>
    <router-view class="disCover"></router-view>
  </div>
</template>

<script>
import TabBar from '@/components/TabBar'
export default {
  name: 'DisCoverMusic',
  components:{
    TabBar
  },
  data(){
    return {
      tabBarList:[
        { name:'个性推荐', path:'/disCoverMusic/recommend' },
        { name:'歌单', path:'/disCoverMusic/songList' },
        { name:'排行榜', path:'/disCoverMusic/rankingList' },
        { name:'歌手', path:'/disCoverMusic/singer' }
      ]
    }
  },
  methods:{
    //处理tabBar的点击事件
    handleTabBarItem(path){
      this.$router.push(path)
    }
  }
}
</script>

<style lang="less" scoped>
  .disCoverContainer {
    overflow: hidden;
  }
  .disCover {
    overflow-x: hidden;
    overflow-y: auto;
    // height: calc(90vh - 120px);
  }
</style>
