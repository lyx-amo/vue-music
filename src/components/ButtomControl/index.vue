<template>
  <div class="buttomControl" >
    <!--底部播放器 -->
    <audio
      :src="musicUrl"
      ref="audioPlayer"
      autoplay
      @play="changeState(true)"
      @pause="changeState(false)"
      @ended="playAccomplish()"
      @timeupdate="timeupdate"
    ></audio>

    <!-- controls -->
    <!-- left -->
    <div class="left" >
      <div class="cover" @click="toMusicDetailCard">
        <img
          v-if="musicDetail && musicDetail.al"
          :src="musicDetail.al.picUrl"
          alt=""
          :draggable="false"
        />
        <img v-else src="../../assets/img/09.jpg" alt="" :draggable="false" />
      </div>
      <div class="info">
        <div class="musicName" v-if="musicDetail && musicDetail.name">
          {{ musicDetail.name }}
        </div>
        <div class="singer" v-if="musicDetail && musicDetail.ar">
          {{ musicDetail.ar[0].name }}
        </div>
      </div>
    </div>
    <!-- 中间部分 -->
    <div class="center" >
      <div class="control">
        <span @click="changePlayType">
          <i class="iconfont icon-liebiaoxunhuan" v-if="this.playType === 'order'"></i>
          <i class="iconfont icon-suiji" v-else-if="this.playType === 'random'"></i>
          <!-- 单曲循环 -->
          <i class="iconfont icon-danquxunhuan" v-else-if="this.playType === 'cycle'"></i>
        </span>
        <span>
          <i class="iconfont icon-previous" @click="changeMusic('pre')"></i>
        </span>
        <span class="play" @click="clickPlayButton">
          <i
            v-if="!this.$store.state.playMusic.isPlay"
            class="iconfont icon-play"
          ></i>
          <i v-else class="iconfont icon-zanting"></i>
        </span>
        <span>
          <i class="iconfont icon-next" @click="changeMusic('next')"></i>
        </span>
        <span>
          <i class="iconfont icon-ci"></i>
          <!-- <i class="iconfont icon-xihuan1" v-if="!this.like"></i>
          <i class="iconfont icon-xihuan" v-else></i> -->
        </span>
      </div>
      <!-- 进度条 -->
      <div class="progress">
        <!-- 实时播放时间 -->
        <span>{{ currentTime | handleMusicTime }}</span>
        <!-- 进度条容器 -->
        <div
          class="audioBarContainer"
          ref="audioBarContainer"
          @mouseenter="progressHover"
          @mouseleave="progressHover"
          @mousedown="audioBarContainerDown"
          :style="active"
        >
          <!-- 总进度条  -->
          <div ref="audioBar" class="audio_bar"  >
            <!-- 实时进度条  -->
            <div ref="currentBar" class="audio_currentTime_bar" >
              <!-- 小圆点 -->
              <div
                ref="other"
                class="other"
                @mousedown="otherDown"
                @mouseup="otherUp"
              ></div>
            </div>
          </div>
        </div>
        <span>{{ duration }}</span>
      </div>
    </div>
    <!-- 右边 -->
    <div class="right" >
      <!-- 控制音量 -->
      <div class="volume">
        <i class="iconfont icon-yinliang" @click="changeMutedState" ></i>
        <div class="sliderContainer">
          <el-slider
          class="volumeSlider"
          vertical
          v-model="volume"
          @input="changeVolume"
          :show-tooltip="false"
        ></el-slider>
        </div>
      </div>
      <!-- 展开播放列表 
        1.根据当前歌单id获取歌单列表
        2.通过表格渲染到页面
        3.选中当前播放的歌曲
        4.双击歌曲切换歌曲播放状态并更改歌曲id进行播放
      -->
      <div class="playList">
        <div class="iconfont icon-musiclist" @click="openDrawer"></div>
        
      </div>
    </div>
    <!-- 抽屉 -->
    <el-drawer
      title="当前播放"
      :visible.sync="drawer"
      direction="rtl"
      :with-header="false"
      :show-close="false"
      size="30%">
      <div class="drawerHeader">
        <div class="title">当前播放</div>
        <div class="musicNum">总{{songList.length}}首</div>
        </div>
      <el-table
        :data="songList"
        size="mini"
        stripe
        highlight-current-row
        lazy
        :cell-style="tableStyle"
        :show-header="false"
        @row-dblclick="dbPlayMusic" 
        style="width: 100%"
      >
      <!--   -->
        
        <el-table-column prop="name"  min-width="150">
        </el-table-column>
        <el-table-column prop="ar[0].name"  min-width="80">
        </el-table-column>
        <el-table-column prop="dt"  width="80" >
        </el-table-column>
      </el-table>
    </el-drawer>
    
  </div>
</template>

<script>
import { handleMusicTime, returnSecond } from "@/utils/handleTime";
// import { getUserId } from '@/utils/userAbout';
let timer;
export default {
  name: "ButtomControl",
  // inject:['reload'],
  data() {
    return {
      // musicSliderValue:0,
      // volumeValue:20,
      active: "",
      // 当前播放属性
      playType:'order',
      // 音乐链接
      musicUrl:'',
      // 当前播放歌曲信息
      musicDetail: {},
      // 歌单列表
      songList:[],
      // 总时间
      duration: "00:00",
      durationNum: 0,
      // 当前播放位置
      currentTime: 0,
      // 实时进度条长度
      currentWidth: 0,
      // 当前播放音乐的索引
      currentMusicIndex: 0,
      // 是否禁用播放器 用于播放列表为空
      // isDisablePlayer:true,
      // 播放器音量
      volume:6,
      // 是否静音
      isMuted:false,
      // 保存当前设置的音量
      volumeSave:0,
      // 是否显示drawer
      drawer:false,
      // 抽屉是否被打开
      hasDrawerOpend:false,
      // 用户是否喜欢该音乐
      like:false,
      // 喜欢音乐id列表
      likeIds:[],
      x:0,
      left:0,
      width1:0
    };
  },
  async created() {
    // this.getMusicIds()
  },
  mounted() {
  },
  methods: {
    // 前往musicDetailCard
    toMusicDetailCard(){
      this.$store.commit('playMusic/changeMusicDetailCardState')
      // 拿到歌曲的id  获取歌曲的歌词等详情信息
    },
    // 获取当前歌曲的信息
    async getMusicDetail(id){
      this.$store.commit('playMusic/updateMusicload',true)
      const result = await this.$API.reqMusicUrl(id)
      if (result.code === 200) {
        this.musicUrl = result.data[0].url
        if(result.data[0].url == null) {
          this.$message.warning('该歌曲暂无版权,将为您播放下一首歌曲')
          this.changeMusic('next')
          return
        }
        this.$store.commit('playMusic/updateMusicload',false)
      }
    },
    // 获取用户喜欢音乐id列表
    // async getMusicIds() {
    //   // 用户没登陆不请求获取列表,会报301
    //   if(getUserId() !== null) {
    //      let timestamp = Date.now()
    //     let result =  await this.$API.reqLikeMusicList(getUserId(),timestamp)
    //     if(result.code === 200) {
    //       // console.log(result.ids);
    //       this.likeIds = result.ids
    //       // this.likeIds = this.$store.state.user.likeMusicList
    //       this.$store.commit('user/RECEIVE_LIKELIST',result.ids)
    //       // this.getMusicLike()
    //     }
    //   }
    // },
    // 判断当前播放音乐是否为喜欢的音乐
    // getMusicLike() {
      
    //   let isLike =  this.likeIds.includes(this.musicDetail.id)
    //   this.like = isLike
    //   // console.log(isLike);
    //   if(this.musicDetail.like) {
    //     this.like = true
    //   }
    // },
    // 根据id找到当前歌曲详细信息
    getMusicDetailFromSongList() {
      // 通过
      let index = this.songList.findIndex((item)=> item.id === this.$store.state.playMusic.musicId)

      if(index != -1) {
        this.currentMusicIndex = index
        // 将当前歌曲索引存到vuex
        this.$store.commit("playMusic/updateCurrentIndex", index);
        // 获取当前歌曲信息
        this.musicDetail = this.songList[index]
        // 将当前歌曲详情信息保存至vuex
        this.$store.commit("playMusic/updateCurrentMusicDetail", this.musicDetail);
        // 获取当前歌曲总进度条
        this.duration = this.songList[index].dt;
        // 转换进度条单位
        this.durationNum = returnSecond(this.duration);

        // 更新实时进度条长度
        this.updateCurrentBar();

      }
    },
    
    // 修改当前音乐的播放状态
    changeState(state) {
      this.$store.dispatch("playMusic/changePlayState", state);
    },
    //修改列表播放状态 
    changePlayType() {
      // cycle
      if(this.playType === 'order') {
        this.playType = 'random'
      }else if(this.playType === 'random') {
        this.playType = 'cycle'
      }else if(this.playType === 'cycle') {
        this.playType = 'order'
      }
    },
    // 点击播放按钮后
    clickPlayButton() {
      // 修改音乐的播放状态 ,icon图标的显示 并播放/暂停音乐
      // false 未播放状态点击播放并修改icon
      !this.$store.state.playMusic.isPlay ? this.playMusic() : this.pauseMusic();
    },
    //播放音乐
    playMusic() {
      // 先清除定时器
      clearTimeout(timer)
      // audioPlayer
      timer = setTimeout(() => { // 这里音乐还没加载完就播放会报错DOMException: The element has no supported sources.这个元素没有支持的源
        this.$refs.audioPlayer.play();
      }, 1000);
    },
    // 暂停音乐
    pauseMusic() {
      this.$refs.audioPlayer.pause();
    },
    // 喜欢歌曲
    // async changeLike(){
    //   let timestamp = Date.now()
    //   if(this.$store.state.user.isLogin){
        
    //     // this.reload()
        
    //     // this.like = !this.like
    //     if(!this.like) {
    //       let result =  await this.$API.reqLikeMusic(this.musicDetail.id,true,timestamp)
    //       if(result.code === 200) {
    //         this.$message.success('已添加到我喜欢的音乐')
    //         this.like = true
    //         // this.getMusicIds()
    //         this.$set(this.musicDetail,'like',true)
    //       }else {
    //         this.$message.success('喜欢音乐失败')
    //         // this.like = false
    //       }
    //     }else{
    //       let result =  await this.$API.reqLikeMusic(this.musicDetail.id,false,timestamp)
    //       if(result.code === 200) {
    //         this.$message.success('取消喜欢')
    //         this.like = false
    //         // this.getMusicIds()
    //         this.$set(this.musicDetail,'like',false)
            
    //       }else {
    //         this.$message.success('取消喜欢失败')
    //         // this.like = true
    //       }
    //     }
    //   }else {
    //     this.$message.warning('请先登录!')
    //   }
    // },
    // 当前音乐播放完成
    playAccomplish() {
      if(this.playType =='cycle' && this.currentTime >= this.durationNum) {
        // this.$store.commit('playMusic/updateMusicId',this.$store.state.playMusic.musicId)
        this.currentTime = 0
        this.updateCurrentBar();
        this.$store.commit('playMusic/CHANGEPLAYSTATE',true)
        
      }else if(this.playType =='order' || this.playType =='random') {
        this.changeMusic('next')
      }
    },
    // 当currentTime发生变化触发的回调
    timeupdate() {
      // 拿到当前音乐的播放时间
      let time = this.$refs.audioPlayer.currentTime;
      // 保存至vuex
      // 在渲染之前进行节流 1s一次
      time = Math.ceil(time);
      this.$store.commit('playMusic/updateCurrentTime',time)
      // 更新实时时间
      this.currentTime = time;
      // 播放模式是单曲循环,并且进度条到达末尾,则重新开始播放当前音乐
      // if(this.playType =='cycle' && this.currentTime >= this.durationNum) {
      //   playAccomplish('cycle')
      // }
      // 更新实时进度条长度
      this.updateCurrentBar();
    },
    // 更新实时进度条长度
    updateCurrentBar() {
      // 进度条长度跟随百分比进行变化 currentTime/durationTime
      this.currentWidth =Math.floor((this.currentTime / this.durationNum) * 400);

      let currentBar = this.$refs.currentBar;
      // console.dir(currentBar);
      currentBar.style.width = this.currentWidth + "px";
    },
    // 鼠标移入改变进度条样式
    progressHover(e) {
      let audioBar = this.$refs.audioBar;
      let currentBar = this.$refs.currentBar;
      // 小圆点
      let other = this.$refs.other;
      if (e.type === "mouseenter") {
        audioBar.style.height = 4 + "px";
        currentBar.style.height = 4 + "px";
        other.style.opacity = 1;
      } else if (e.type === "mouseleave") {
        audioBar.style.height = 2 + "px";
        currentBar.style.height = 2 + "px";
        other.style.opacity = 0;
        // 在这清除move事件,否则会一直move
        document.removeEventListener('mousemove',this.audioBarContainerDown)
      }
    },
    // 点击总进度条修改实时进度条进度并更新实时播放进度
    audioBarContainerDown(e) {

      let audioBar = this.$refs.audioBar;
      let currentBar = this.$refs.currentBar;

      // if(e.type === 'mousemove') {
      //   this.pauseMusic()
      //   console.log('move');
      // }
      // 点击位置距离视口的位置
      // let x = e.clientX;
      this.x = e.clientX;
      // 当前元素距离左侧的位置
      // let left = currentBar.getBoundingClientRect().left;
      this.left = currentBar.getBoundingClientRect().left;
      // 点击后实时进度条的宽度
      // let width1 = x - left;
      this.width1 = this.x - this.left;
      // 边界处理
      if (this.width1 < 0) {
        this.width1 = 0;
      } else if (this.width1 > audioBar.offsetWidth) {
        this.width1 = audioBar.offsetWidth;
      }
      // 更新实时进度条的宽度 并且更新音乐当前播放位置
      this.currentWidth = this.width1;
      // 当前音乐播放的位置等于 点击位置 需要修改vuex中的数据
      this.$refs.audioPlayer.currentTime = (this.currentWidth / 400) * this.durationNum;
      // 更新进度条位置
      this.updateCurrentBar();
    },
    // 鼠标点击小圆点
    otherDown() {
      document.addEventListener('mousemove',this.audioBarContainerDown)
    },
    otherUp(){
      // this.playMusic()
      document.removeEventListener('mousemove',this.audioBarContainerDown)
    },
    // 改变音量
    changeVolume(e) {
      this.$refs.audioPlayer.volume = e / 100
      // console.dir(this.$refs.audioPlayer);
      // 有音量
      if(this.isMuted && e > 0) {
        this.isMuted = false
      }else if(e == 0 && !this.isMuted){
        this.isMuted = true
      }
    },
    // 点击喇叭
    changeMutedState() {
      // 点击喇叭后修改状态,1.保存当前音量 将音乐静音 2.回到之前的音量
      if(this.isMuted) {
        this.volume = this.volumeSave
      }else {
        this.volumeSave = this.volume
        this.volume = 0
      }
      // console.log(this.volumeSave, this.isMuted);
      this.isMuted = !this.isMuted
    },
    // 打开抽屉
    openDrawer(){
      this.drawer = !this.drawer
      this.hasDrawerOpend = true
      this.handleDrawerListDOM(this.currentMusicIndex)
    },
    dbPlayMusic(row) {
      // 双击切歌
      this.changeMusic('dbClick',row.id)
      this.handleDrawerListDOM(this.currentMusicIndex)
    },
    // 切歌函数
    changeMusic(type,id) {
      // 
      if(type === 'dbClick') {
        this.$store.commit('playMusic/updateMusicId',id)
      }else if(type === 'pre') {
        // 当点击上一首,根据修改的musicIndex更改音乐的id
        let currentMusicIndex = this.currentMusicIndex
        let preIndex;
        // 顺序播放
        if(this.playType === 'order' || this.playType === 'cycle') {
          // 当前切换上一首如果index -1 <0 切换到列表最后一首
          preIndex = currentMusicIndex - 1 < 0 ? this.songList.length - 1 : currentMusicIndex - 1 ; 
        }else if(this.playType === 'random') {
          if(this.songList.length == 1) {
            preIndex = currentMusicIndex
          }else {
            preIndex = currentMusicIndex
            if(preIndex == currentMusicIndex) {
              preIndex = Math.floor(Math.random() * this.songList.length -1)
            }
          }
        }
        this.$store.commit('playMusic/updateMusicId',this.songList[preIndex].id)
      }else if(type === 'next') {
        let currentMusicIndex = this.currentMusicIndex
        let nextIndex;
        if(this.playType === 'order' || this.playType === 'cycle') {
          nextIndex = currentMusicIndex + 1 > this.songList.length - 1 ? 0 : currentMusicIndex + 1;

        }else if(this.playType === 'random') {
          if(this.songList.length == 1) {
            nextIndex = currentMusicIndex
          }else {
            nextIndex = currentMusicIndex
            if(nextIndex == currentMusicIndex) {
              nextIndex = Math.floor(Math.random() * this.songList.length -1)
            }
          }
        }
        this.$store.commit('playMusic/updateMusicId',this.songList[nextIndex].id)
      }
      
    },
    // 处理抽屉中的DOM
    handleDrawerListDOM(currentIndex,oldIndex) {
      // 要等DOM更新后才能修改DOM否则拿不到
      this.$nextTick(function() {
        let tableRows = document.querySelector('.buttomControl').querySelectorAll('.el-table__row')
        if(tableRows[currentIndex]) {
          tableRows[currentIndex].children[0].classList.add('currentRow','currentRow1')
          tableRows[currentIndex].children[1].classList.add('currentRow')
        }

        // 清除上一首的样式
        if((oldIndex && oldIndex != -1 && tableRows[oldIndex]) || oldIndex === 0) {

          // console.log(oldIndex);
          tableRows[oldIndex].children[0].classList.remove('currentRow','currentRow1')
          tableRows[oldIndex].children[1].classList.remove('currentRow')
        }

        
      })

      
    },
    // 表格单列样式
    tableStyle(row) {
      if(row.columnIndex === 2 ) { 
        return "color:#b2b2b2;"
      }
      if(row.columnIndex == 1) {
        // return "color:#656565;"
        return "color:#b2b2b2;"
      }
      if(row.columnIndex === 0) {
        return "color:#333333;"
      }
    }
  },
  computed: {
    // musicUrl() {
    //   return this.$store.state.playMusic.musicUrl || "";
    // },
  },
  watch: {
    // 当歌单变化时获取最近歌单列表
    '$store.state.playMusic.songListId'() {
      // this.songList = []
      // 当音乐id发生变化获取歌单列表
      this.songList = this.$store.state.playMusic.songList || []
    },
    // 监听音乐id变化 修改音乐状态并调用播放函数
    "$store.state.playMusic.musicId"(id) {
      // console.log(this.songList[0].id);
      // console.log(id);
      if(this.songList) {
        // 获取新的歌曲详情信息
        this.getMusicDetailFromSongList()
        // 获取新的音乐url
        this.getMusicDetail(id)
        // this.$nextTick(()=>{
        //   this.getMusicIds()
        //   this.getMusicLike()
        // })
      }
    },
    // 监听播放状态
    "$store.state.playMusic.isPlay"(isPlay) {
      if (!isPlay) {
        this.pauseMusic();
      } else {
        this.playMusic();
      }
    },
    // 当索引变化修改索引的样式
    "$store.state.playMusic.currentMusicIndex"(currentIndex,oldIndex) {
      // 抽屉打开后再处理,否则会报错
      if(this.hasDrawerOpend) {
        this.handleDrawerListDOM(currentIndex,oldIndex)
      }
    }
  },
  filters: {
    handleMusicTime,
  },
};
</script>

<style lang="less" scoped>

.buttomControl {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  min-width: 1100px;
  height: 70px;
  z-index: 10000;
  border: 1px solid #eee;
  background: #ffffff;
  box-shadow: 0px -1px 1px #eee;
}

.left {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  // width: 200px;
  height: 50px;
  .cover {
    width: 50px;
    height: 50px;
    cursor: pointer;
    // &:hover {

    // }
    img {
      width: 100%;
      height: 100%;
      border-radius: 5px;
    }
  }
  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 10px;
    .musicName {
      font-size: 15px;
      color: #333;
      font-weight: 500;
      margin-bottom: 8px;
    }
    .singer {
      font-size: 13px;
      font-weight: 400;
      color: #454545;
    }
  }
}
.center {
  position: relative;
  top: 50%;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translateY(-50%);
  margin: auto;
  width: 500px;
  height: 60px;
  // background: #eee;
  .control {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: auto;
    width: 300px;
    height: 40px;
    // background-color: royalblue;
    span {
      cursor: pointer;
    }
    span:not(:nth-child(3)) {
      &:hover {
        color: #5b5b5b;
      }
    }
  }
}
.play {
  background-color: #f4f4f4;
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  border-radius: 50%;
  .iconfont {
    font-size: 19px;
  }
  &:hover {
    background-color: #e5e5e5;
  }
}

.right {
  display: flex;
  position: absolute;
  justify-content: space-around;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
  width: 80px;
  z-index: 2002;
  div {
    cursor: pointer;
  }
}
// 进度条
.progress {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 5px;

  span {
    display: inline-block;
    margin: 0 10px;
    color: #999999;
  }
  .audioBarContainer {
    position: relative;
    width: 400px;
    height: 8px;
    .audio_bar {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 400px;
      height: 2px;
      background-color: #cdcdcd;
      .audio_currentTime_bar {
        position: absolute;
        // width: 20px;
        height: 2px;
        background: #333;

        // 拖动的原点
        .other {
          position: absolute;
          top: -2px;
          right: -8px;
          width: 8px;
          height: 8px;
          background: #333;
          border-radius: 50%;
          opacity: 0;
        }
      }
    }
  }
}
// 音量控制
.volume {
  position: relative;
  .sliderContainer {
    position: absolute;
    bottom: 20px;
    left: -5px;
    width: 26px;
    padding: 8px 0;
    background: #ffffff;
    border: 1px solid #eee;
    border-radius: 5px;
    // opacity: 0;
    display: none;
    .volumeSlider {
      // width: 5px;
      height: 80px;
    }
  }
}

.icon-yinliang:hover + .sliderContainer,.volume:hover .sliderContainer{
  // opacity: 1;
  display: block;
}

.drawerHeader {
  padding: 20px 20px;
  .title {
    font-size: 20px;
    font-weight: 700;
    padding-bottom: 10px;
  }
  .musicNum {
    font-size: 12px;
    color: #cccccc;
  }
}

::v-deep .el-table .cell {
  padding-left:20px ;
}

.icon-xihuan {
  color: red;
}
</style>
