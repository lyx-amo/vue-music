<template>
  <!-- 每日推荐 -->
  <div class="recommendContainer">
    <div class="header">
      <div class="calendar">
        <div class="week">{{getCurrentWeek()}}</div>
        <div class="day">{{getCurrentDate()}}</div>
        <i></i>
      </div>
      <div class="describe">
        <div class="title">每日歌曲推荐</div>
        <div class="replenish">根据你的音乐口味生成，每天6:00更新</div>
      </div>
    </div>
    <!-- 播放全部按钮 -->
    <div class="controlButton">
      <!-- 播放全部 -->
      <div class="playAll" @click="playAll">
        <i class="el-icon-plus"></i>
        <span>播放全部</span>
      </div>
      <!-- 收藏 -->
      <button class="collect" >
        <!-- <i class="iconfont" :class="isCollect ? 'icon-collectSonglist' : 'icon-cencel_collectSonglist'"></i> -->
        <i class="iconfont icon-cencel_collectSonglist"></i>
        <span>收藏</span>
      </button>
    </div>
  <!-- 歌曲列表 -->
    <div class="musicList">
      <el-table
        :data="recommendMusics"
        size="mini"
        highlight-current-row
        stripe
        lazy
        style="width: 100%;"
        :cell-style="tableStyle"
        @row-dblclick="playMusic"
        
      >
        <el-table-column type="index" :index="indexMethod" min-width="60" width="60"></el-table-column>
        <el-table-column  min-width="50" width="50">
          <!-- scope.row.id 通过插槽获取单行数据   -->
          <template slot-scope="scope">
            <div :key="itemKey"  @click="changeLike(scope.row)" class="likeMusic iconfont" :class="getMusicLike(scope.row.id) ? 'icon-xihuan' : 'icon-xihuan1'" ></div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="50">
          <div class="musicDownload">
            <i class="el-icon-download"></i>  
          </div>  
        </el-table-column>
        <el-table-column prop="name" label="音乐标题" min-width="200">
        </el-table-column>
        <el-table-column prop="ar[0].name" label="歌手" min-width="100">
        </el-table-column>
        <el-table-column prop="al.name" label="专辑" min-width="180"> </el-table-column>
        <el-table-column prop="dt" label="时间" width="180" >
        </el-table-column>
      </el-table>
      <div class="placeholder"></div>
    </div>
  </div>
</template>

<script>
import { getUserId } from '@/utils/userAbout';
import {handleMusicTime} from '@/utils/handleTime'
export default {
  name: 'RecommendMusic',
  data(){
    return {
      recommendMusics:[],
      // 是否还有更多音乐
      isMusicMore:false,
      itemKey:'',
      likeIds:[]
    }
  },
  created(){
    this.getMusicIds()
  },
  async mounted(){
    await this.ReqRecommendMusics()
    // this.getCurrentDate()
    this.$nextTick(()=>{
      // console.log(this.$route.params.songListId ,'--------',this.$store.state.playMusic.songListId);
      if(this.$route.params.songListId == this.$store.state.playMusic.songListId) {
        // console.log('是相同歌单','------------',this.$store.state.playMusic.musicId);
        this.handleTableDOM(this.$store.state.playMusic.musicId)
      }
    })
  },
  methods:{
    // 获取用户喜欢音乐id列表
    async getMusicIds() {
      // 用户没登陆不请求获取列表,会报301
      if(getUserId() !== null) {
         let timestamp = Date.now()
        let result =  await this.$API.reqLikeMusicList(getUserId(),timestamp)
        if(result.code === 200) {
          // console.log(result.ids);
          this.likeIds = result.ids
          // this.likeIds = this.$store.state.user.likeMusicList
          this.$store.commit('user/RECEIVE_LIKELIST',result.ids)
          // this.getMusicLike()
        }
      }
      this.itemKey = Math.random()

    },
    // 喜欢歌曲
    async changeLike(row){
      let timestamp = Date.now()
      if(this.$store.state.user.isLogin){
        
        this.like = this.getMusicLike(row.id)
        // this.like = !this.like
        if(!this.like) {
          let result =  await this.$API.reqLikeMusic(row.id,true,timestamp)
          if(result.code === 200) {
            this.$message.success('已添加到我喜欢的音乐')
            this.getMusicIds()
          }else {
            this.$message.success('喜欢音乐失败')
          }
        }else{
          let result =  await this.$API.reqLikeMusic(row.id,false,timestamp)
          if(result.code === 200) {
            this.$message.success('取消喜欢')
            this.getMusicIds()
          }else {
            this.$message.success('取消喜欢失败')
          }
        }
      }else {
        this.$message.warning('请先登录!')
      }
    },
    // 判断歌单中音乐是否在喜欢音乐列表中
    getMusicLike(musicId) {
      // c传入当前行的id,在likeId列表中查找,找到就是true
      // let musicId1 =  33255931
      if(this.likeIds) {
        // let likeMusic = this.likeIds.indexOf(musicId)
        let likeMusic = this.likeIds.includes(musicId)
        if(likeMusic) {
          return true
        }
        // if(likeMusic != -1) {
        //   return true
        // }
      }
    },
    // 获取当前日期时间
    getCurrentDate() {
      let date = new Date()
      // 当前日期
      let currentDay = date.getUTCDate()
      return currentDay     
    },
    // 当前星期
    getCurrentWeek() {
      
      let date = new Date()
      let currentWeek = date.getUTCDay()
      switch (currentWeek) {
        case 1:
          return '星期一'
        case 2:
          return '星期二'
        case 3:
          return '星期三'
        case 4:
          return '星期四'
        case 5:
          return '星期五'
        case 6:
          return '星期六'
        case 0:
          return '星期日'
      }
      console.log(currentWeek);
    },
    // 获取每日推荐歌曲列表
    async ReqRecommendMusics(){
      let result =  await this.$API.reqUserRecommendMusic()
      if(result.code == 200) {
        let recommendMusics = result.data.dailySongs
        recommendMusics.forEach(item => {
          item.dt = handleMusicTime(item.dt)
        });

        this.recommendMusics = recommendMusics 
      }else {
        this.$message.error('歌单获取失败')
      }
    },
     // 表格单列样式
    tableStyle(row) {
      if(row.columnIndex === 5 || row.columnIndex < 2) {
        return "color:#9F9F9F;"
      }
      if(row.columnIndex !== 2) {
        return "color:#5d5d5d;"
      }
      if(row.columnIndex === 2) {
        return "color:#333333;"
      }
    },
    // 双击播放音乐
    playMusic(row) {
      // 双击调用控制器中的回调
      // console.log(row);
      this.$store.commit('playMusic/updateMusicId',row.id)
      // 双击拿到id row.id
      // this.$store.dispatch('playMusic/getMusicUrl',row.id)

      // 将row传给buttomControl组件
      // this.$bus.$emit('getMusicInfo',row)
      // // 将歌曲列表传给buttomControl组件
      // this.$bus.$emit('getMusicListInfo',this.songListDetail)

      // 当前歌单id变化,更新歌单列表至vuex
      // if(this.songListDetail.id !== this.$store.state.playMusic.songListId) {
        // 直接更新,不用看歌单变化,否则会导致抽屉内歌曲无法全部加载,超过懒加载后的歌曲显示不了歌曲详情
        this.$store.commit("playMusic/updateSongList", {
          songList: this.recommendMusics,
          songListId: this.recommendMusics.id,
        });
      // }


      // 修改音乐播放状态
      if(this.$store.state.playMusic.isPlay == false) {
        this.$store.state.playMusic.isPlay = true
      }

    },
    // 播放全部
    playAll() {
      // 点击播放全部 更新歌单列表 并播放当前歌单列表中第一个
      this.$store.commit('playMusic/updateMusicId',this.recommendMusics[0].id)
      this.$store.commit("playMusic/updateSongList", {
        songList: this.recommendMusics,
        songListId: this.recommendMusics.id,
      });
    },
    // 歌曲列表的序号处理
    indexMethod(index) {
        return index < 9 ? '0' + (index + 1)  : index + 1
    },
    // 修改当前播放音乐的样式
    handleTableDOM(current,old) {
      if(document.querySelector('.recommendContainer')) {
        let tableRows = document.querySelector('.recommendContainer').querySelectorAll('.el-table__row')
        let index = this.recommendMusics.findIndex(item =>{
          return item.id == current
        })
        // console.log(index);
        if(index != -1) {
          tableRows[index].children[0].querySelector('.cell').innerHTML = '<div><i class="iconfont icon-trumpet"></i></div>'
          tableRows[index].children[3].querySelector('.cell').classList.add('currentRow')
          tableRows[index].children[0].querySelector('.cell').classList.add('currentRow','currentRow3')
        }
        // 清除上一首样式
        if(old != -1) {
          let oldIndex = this.recommendMusics.findIndex(item =>{
            return item.id == old
          })
          
          if(oldIndex != -1) {
            tableRows[oldIndex].children[0].querySelector('.cell').innerHTML = `<div>${oldIndex + 1 < 9 ? '0' + (oldIndex + 1) : oldIndex + 1 }</div>`
            tableRows[oldIndex].children[3].querySelector('.cell').classList.remove('currentRow')
            tableRows[oldIndex].children[0].querySelector('.cell').classList.remove('currentRow','currentRow3')
          }
        }
      }  
    },
  },
  watch:{
    '$store.state.playMusic.musicId'(current,old) {
      // 当音乐id变化时修改当前播放音乐的样式
      this.handleTableDOM(current,old)
    },
  }
}
</script>

<style lang="less" scoped>
  .icon-xihuan {
    color: red;
  }

  .recommendContainer {
    padding: 0 30px;
  }
  
  .header {
    display: flex;
    margin-top: 30px;
    .calendar {
      position: relative;
      display: flex;
      flex-flow: column;
      // justify-content: center;
      width:115px ;
      height: 115px;
      text-align: center;
      // background-color: skyblue;
      background: url('../../assets/img/date.png')  0 -270px no-repeat ;
      transform: scale(.8);
     .week {
       color: white;
       z-index: 99;
       padding-top: 5px;
       font-size: 14px;
     }
     .day {
       margin-top: 20px;
       font-size: 40px;
       font-weight: 900;
       color: #333;
     }
      i {
        position: absolute;
        width: 115px;
        height: 26px;
        background-color: #333;
        top: 0;left: 0;
        border-radius: 10px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
    .describe {
      display: flex;
      flex-flow: column;
      // align-items: center;
      justify-content: center;
      height: 100px;
      padding: 0 20px;
      line-height: 25px;
      .title {
        font-size: 20px;
        font-weight: 600;
      }
      .replenish {
        color: #676767;
      }
    }
  }
  .controlButton {
    padding: 20px 0px;
    display: flex;
    .playAll,
    .collect{
      margin-right: 10px;
      border-radius: 100px;
      font-size: 12px;
      border: 1px solid #ddd;
      line-height: 30px;
      text-align: center;
      cursor: pointer;
      background-color: #fff;
      i {
        padding-right: 5px;
      }
    }

    .playAll {
      width: 100px;
      height: 30px;
      background-color: #333333;
      color: white;
    }
    .collect {
      width: 80px;
      height: 30px;
    }

    .collect{
      i{
        vertical-align: -1px;
      }
    }
    .playAll:hover {
      background-color: black;
    }
    .collect {
      &:hover {
        background-color: #eee;
      }
    }
    .icon-collectSonglist {
      color: red;
    }
  }
  
  .likeMusic {
    cursor: pointer;
  }
  .placeholder {
    width: 100%;
    height: 80px;
    // background-color: skyblue;
  }
  
</style>
