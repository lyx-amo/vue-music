<template>
  <el-container >
    <el-header>
      <HeaderBar></HeaderBar>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu
          router
          :default-active="defaultActive"
          active-text-color="black"
          :default-openeds="openeds"
        >
          <el-menu-item index="/disCoverMusic">
            <!-- <i class="el-icon-circle-plus"></i> -->
            发现音乐
          </el-menu-item>
          <el-menu-item index="/video">
            <!-- <i class="el-icon-circle-plus"></i> -->
            视频
          </el-menu-item>
          <el-menu-item index="/favorites">
            <!-- <i class="el-icon-circle-plus"></i> -->
            收藏
          </el-menu-item>
          <el-menu-item index="/recommendMusic">
            <!-- <i class="el-icon-circle-plus"></i> -->
            每日推荐
          </el-menu-item>
          <!-- 登录后显示我喜欢的音乐 //userCreateList.length != 0 -->
          <template v-if="$store.state.user.userId"  >  
            <el-submenu index="1" >
              <span slot="title">创建的歌单</span>
              <el-menu-item 
              v-for="(item,index) in userCreateList"  
              :key="index" 
              :index="'/songListDetail/' + item.id">
                {{item.name.search('喜欢的音乐') != -1 ? '我喜欢的音乐' : item.name }}
              </el-menu-item>
            </el-submenu>

            <el-submenu index="2" >
              <span slot="title">收藏的歌单</span>
              <el-menu-item v-for="(item,index) in collectSonglist"  :key="index" :index="`/songListDetail/${item.id}`">{{item.name}}</el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-main>
        <keep-alive :exclude="['songListDetail','recommend']">
          <router-view v-if="isRouterAlive" class="routerView" @userSongList="userSongList"></router-view>
        </keep-alive>
      </el-main>
      <ButtomControl></ButtomControl>
      <MusicDetailCard></MusicDetailCard>
    </el-container>
  </el-container>
</template>

<script>

import HeaderBar from "../components/HeaderBar";
import ButtomControl from "../components/ButtomControl";
import MusicDetailCard from "../components//MusicDetailCard";

export default {
  name: "Layout",
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      // 当前激活菜单的index
      defaultActive:'',
      // 登录后重新加载推荐歌单
      isRouterAlive: true,
      // 当前默认打开submenu的数组
      openeds:['1','2'],
      // 用户创建的歌单
      userCreateList:[],
      // 用户收藏的歌单
      collectSonglist:[],
    };
  },
  created(){
    if(this.$route.path.search('/songListDetail') == -1) {
      this.defaultActive = '/' + this.$route.path.split('/')[1]
    }else {
      this.defaultActive = this.$route.path
    }
  },
  mounted() {
    this.userSongList()
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    },
    async userSongList() {
      let timestamp = Date.now()
      // this.$store.dispatch('user/updateUserSongList',)  updateUserSongList
      let result = await this.$API.reqUserSonglist({uid:this.$store.state.user.userId,timestamp})

      if(result.code == 200) {
        // console.log(result.playlist);
        let userSongList = result.playlist
        // 用户创建的歌单
        this.userCreateList = userSongList.filter(item => {
          return item.creator.userId == this.$store.state.user.userId
        })
        // 用户收藏的歌单
        this.collectSonglist = userSongList.filter(item => {
          return item.subscribed == true
        })
        this.$store.commit('user/updateUserSongList',{userCreateList:this.userCreateList,collectSonglist:this.collectSonglist})
      }
    }
  },
  computed:{

  },
  components: {
    HeaderBar,
    ButtomControl,
    MusicDetailCard,
  },
  watch:{
    '$store.state.user.userId'() {
      this.userCreateList = []
      this.collectSonglist = []
      // 当用户id发生变化时重新请求获取创建/收藏歌单
      this.userSongList()
    }
  }
};
</script>

<style lang="less" scoped>


.is-active {
  background-color: #f2f2f2;
  font-size: 15px;
  font-weight: 600;
}
.routerView {
  // padding: 0 30px;
  // padding: 30px 30px 0px;
  margin: 0;
  width: 100%;
  height: calc(100vh - 120px);
}

::v-deep .el-aside {
  overflow-x: hidden;
  overflow-y: auto;
}

// ::v-deep ::-webkit-scrollbar-thumb {
//   display: none;
// }


::v-deep .el-menu :hover {
  background-color: #fff;
}
::v-deep .el-menu-item:focus, .el-menu-item:hover {
  outline: 0;
  background-color: #f2f2f2;
}

::v-deep .el-submenu__title:focus, .el-submenu__title:hover {
  outline: 0;
  background-color: #fff;
  color:#9f9f9f ;
}

::v-deep .el-submenu {
  background-color: #fff;
  font-size: 12px;
  font-weight: 500;
}

::v-deep .el-submenu__title {
  color: #9f9f9f;
}



::v-deep .el-submenu .is-active {
  background-color: #f2f2f2;
  font-size: 12px;
  font-weight: 500;
}

::v-deep .el-submenu .el-menu-item{
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  padding: 0 20px;
  // width: 80px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap
}




  


</style>
