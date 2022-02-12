<template>
  <div class="buttomControl" >
    <!--底部播放器 -->
    <audio
      :src="musicUrl"
      ref="audioPlayer"
      autoplay
      @play="changeState(true)"
      @pause="changeState(false)"
      @ended="changeState('next')"
      @timeupdate="timeupdate"
    ></audio>

    <!-- controls -->
    <!-- left -->
    <div class="left"  >
      <div class="cover">
        <img
          v-if="musicDetail && musicDetail.al"
          :src="musicDetail.al.picUrl"
          alt=""
        />
        <img v-else src="../../assets/img/09.jpg" alt="" />
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
        <span>
          <i class="iconfont icon-suiji"></i>
          <!-- <i class="iconfont icon-liebiaoxunhuan"></i> -->
        </span>
        <span>
          <i class="iconfont icon-previous"></i>
        </span>
        <span class="play" @click="clickPlayButton">
          <i
            v-if="!this.$store.state.playMusic.isPlay"
            class="iconfont icon-play"
          ></i>
          <i v-else class="iconfont icon-zanting"></i>
        </span>
        <span>
          <i class="iconfont icon-next"></i>
        </span>
        <span>
          <i class="iconfont icon-ci"></i>
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
export default {
  name: "ButtomControl",
  data() {
    return {
      // musicSliderValue:0,
      // volumeValue:20,
      active: "",
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
      volume:15,
      // 是否静音
      isMuted:false,
      // 保存当前设置的音量
      volumeSave:0,
      // 是否显示drawer
      drawer:false,
      x:0,
      left:0,
      width1:0
    };
  },
  mounted() {
    
  },
  methods: {
    // 获取当前歌曲的信息
    async getMusicDetail(id){
      const result = await this.$API.reqMusicUrl(id)
      if (result.code === 200) {
        this.musicUrl = result.data[0].url
      }
    },
    // 根据id找到当前歌曲详细信息
    getMusicDetailFromSongList() {
      
      // 通过
      let index = this.songList.findIndex((item)=> item.id === this.$store.state.playMusic.musicId)

      if(index != -1) {
        this.currentMusicIndex = index
        this.$store.commit("playMusic/updateCurrentIndex", index);
        // 获取当前歌曲信息
        this.musicDetail = this.songList[index]
        // 获取当前歌曲实时进度条
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
    // 点击播放按钮后
    clickPlayButton() {
      // 修改音乐的播放状态 ,icon图标的显示 并播放/暂停音乐
      // false 未播放状态点击播放并修改icon
      !this.$store.state.playMusic.isPlay ? this.playMusic() : this.pauseMusic();
    },
    //播放音乐
    playMusic() {
      // audioPlayer
      this.$refs.audioPlayer.play();
    },
    // 暂停音乐
    pauseMusic() {
      this.$refs.audioPlayer.pause();
    },
    // 当currentTime发生变化触发的回调
    timeupdate() {
      // 拿到当前音乐的播放时间
      let time = this.$refs.audioPlayer.currentTime;
      // 保存至vuex
      // this.$store.commit('playMusic/updateCurrentTime',time)
      // 在渲染之前进行节流 1s一次
      time = Math.floor(time);
      // 更新实时时间
      this.currentTime = time;
      // 更新实时进度条长度
      this.updateCurrentBar();
    },
    // 更新实时进度条长度
    updateCurrentBar() {
      // 进度条长度跟随百分比进行变化 currentTime/durationTime
      this.currentWidth = (this.currentTime / this.durationNum) * 400;

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
    otherDown(e) {
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
    openDrawer(){
      this.drawer = !this.drawer
    },
    dbPlayMusic(row) {
      // 双击切歌
      this.changeMusic('dbClick',row.id)
    },
    // 切歌函数
    changeMusic(type,id) {
      // 
      if(type === 'dbClick') {
        this.$store.commit('playMusic/updateMusicId',id)
      }
    },
    // 表格单列样式
    tableStyle(row) {
      if(row.columnIndex === 2 ) { 
        return "color:#9F9F9F;"
      }
      if(row.columnIndex == 1) {
        return "color:#656565;"
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
    // 监听音乐id变化 修改音乐状态并调用播放函数
    "$store.state.playMusic.musicId"(id) {
      // console.log(id);
      // 当音乐id发生变化获取歌单列表
      this.songList = this.$store.state.playMusic.songList || []
      // 获取新的歌曲详情信息
      this.getMusicDetailFromSongList()
      // 获取新的音乐url
      this.getMusicDetail(id)
    },
    // 监听播放状态
    "$store.state.playMusic.isPlay"(isPlay) {
      if (!isPlay) {
        this.pauseMusic();
      } else {
        this.playMusic();
      }
    },
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
</style>
