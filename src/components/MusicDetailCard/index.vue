<template>
  <div class="musicDetailCardContainer"  :class="isMusicDetailCardShow ? '' : 'hide'">
    <!--  -->
    <header class="header" v-if="!this.cleanCard && currentMusicDetail.al" >
      <div class="title">{{currentMusicDetail.name}}</div>
      <div class="singer">{{currentMusicDetail.ar[0].name + '-' +  currentMusicDetail.al.name}}</div>
    </header>
    <div class="coverContainer" v-if="!this.cleanCard && currentMusicDetail.al">
      <div class="coverImg">
        <div class="needle" :class="{'needleRotate':$store.state.playMusic.isPlay}">
          <img src="../../assets/img/MusicDetailCard/needle.png" alt="">
        </div>
        <div class="image" 
          :class="[ $store.state.playMusic.isPlay ? '' :'pause',$store.state.playMusic.musicload ? '' : 'discAnimation' ]" >
          <!-- 'pause':!$store.state.playMusic.isPlay -->
          <img class="discContainer" src="../../assets/img/MusicDetailCard/disc.png" alt="">
          <img class="musicImg" :src="currentMusicDetail.al.picUrl" alt="">
        </div>
      </div>
      <div class="lyric">
        <div class="placeholder"></div>
        <Lyric :lyric='lyric' ></Lyric>
      </div>
      <!-- <div class="musicOrigin"></div> -->
    </div>
    <!-- 评论 -->
    <div class="comment" 
      v-loading="isLoading" 
      element-loading-background="white"  
      element-loading-text="载入中..."
      element-loading-spinner="el-icon-loading">
      <!-- 热门评论 -->
      <Comment 
        :comments='comments.hotComments' 
        :commentType="'musicDetailCard'"
        @getComments="getMusicComments"
        :resourceId="$store.state.playMusic.musicId + ''"
        ref="hotComment"
        v-if="comments.hotComments"
      ><div slot="title">全部评论{{'('+ comments.total +')'}}</div></Comment>
      <!-- 全部评论 -->
      <Comment 
        :comments='comments.comments'
        :commentType="'musicDetailCard'"
        @getComments="getMusicComments"
        :resourceId="$store.state.playMusic.musicId + '' "
        :ishotComments="comments.hotComments ? false : true"

        v-if="comments.comments"
      ><div slot="title">最新评论</div></Comment>
    </div>
  </div>
  <!-- :class="isMusicDetailCardShow ? '' : 'hide'" -->
</template>

<script>
import Lyric from '../../components/Lyric'
import Comment from '../Comment/'
// 定时器
let timer;
export default {
  name: "MusicDetailCard",
  components:{
    Lyric,
    Comment
  },
  data() {
    return {
      // 控制音乐详情卡片的显隐
      isMusicDetailCardShow: false,
      // 当前播放音乐详情信息
      lyric:[],
      currentMusicDetail:{},
      cleanCard:true,
      isLoading:true,
      // 评论
      comments:{},
    };
  },
  async mounted(){
    // await this.getCurrentMusicDetail()
    // this.getLyric()
  },
  methods:{
    // 获取歌词
    async getLyric(id) {
      let result =  await this.$API.reqLyric(id)
      if(result.code == 200) {
        // this.lyric = result.lrc.lyric
        // 处理歌词
        let lyric = result.lrc.lyric
        
        let arr = lyric.split('\n')
        let array = []
        let time = ''
        let value = ''
        let res = []
        arr.forEach((item) => {
          if(item !== ''){
            array.push(item)
          }
        });
        arr = array

        arr.forEach(item => {
          time = item.split(']')[0]
          value = item.split(']')[1]
          var t = time.slice(1).split(':')
          res.push([parseInt(t[0],10) * 60 + parseInt(t[1]),value]) 
        })
        // console.log(res);
        this.lyric = res
      }
    },
    getCurrentMusicDetail() {
      if(this.$store.state.playMusic.currentMusicDetail.name == '') return
      this.currentMusicDetail = this.$store.state.playMusic.currentMusicDetail
    },
    // 获取评论
    async getMusicComments(id) {
      let timestamp = Date.now()
      
      let result = await this.$API.reqMusicComments({id:this.$store.state.playMusic.musicId,limit:50,timestamp})
      if(result.code == 200) {
        this.comments = result
        this.isLoading = false
      }
    }
  },
  computed:{
    // currentMusicDetail(){
    //   return this.$store.state.playMusic.currentMusicDetail || {}
    // },
  },
  watch:{
    '$store.state.playMusic.isMusicDetailCardShow'(isMusicDetailCardShow) {
      console.log(isMusicDetailCardShow);
      this.isMusicDetailCardShow = isMusicDetailCardShow

      clearTimeout(timer)

      // 卡片内容是否清空
      this.cleanCard = false


      if(isMusicDetailCardShow && !this.comments.comments && this.$store.state.playMusic.musicId !== '') {

        // this.getCurrentMusicDetail()
        this.getLyric(this.$store.state.playMusic.musicId)
        this.getMusicComments(this.$store.state.playMusic.musicId)
      }else if(isMusicDetailCardShow == false) {
        // 提升用户体验延迟3s删除内容
        timer = setTimeout(() => {
          this.cleanCard = true
        }, 3000);
      }
    },
    '$store.state.playMusic.musicId'(id){
      this.getCurrentMusicDetail()
      // 清空评论
      this.comments = {}
      // 优化性能,当card展示的时候再发请求 
      if(this.isMusicDetailCardShow) {
        // 当id变化重新获取歌词以及歌曲详情信息
        this.getLyric(id)
        this.getMusicComments(id)
      }
      
    }
    // '$store.state.playMusic.currentMusicDetail'(currentMusicDetail) {
    //   // console.log(currentMusicDetail,1);
    //   this.getCurrentMusicDetail()
    // }
  },
  beforeDestroy() {
    this.$bus.$off('getComments')
  }
};
</script>

<style lang="less" scoped>

  ::v-deep .el-loading-spinner .el-loading-text {
    color: #373737;
  }
  ::v-deep .el-loading-spinner i {
    color:#373737 ;
  }

  .placeholder{
    width: 100%;
    height: 40px;
  }
  .musicDetailCardContainer{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    // background-color: #f1efef;
    background-color: #ffffff;
    width: 100%;
    min-width: 1100px;
    height: calc(100vh - 70px);
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .hide {
    transform: translateY(calc(100vh - 70px));
    // bottom: calc(-100vh + 120px);
  }

  @keyframes disc {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .discAnimation {
    animation: disc 25s linear infinite ;
    animation-delay: .8s;
  }
  
  .header{
    width: 100%;
    height: 100px;
    padding-top: 40px;
    margin: 0 auto;
    text-align: center;
    .title {
      font-size: 25px;
      color: #373737;
      margin-bottom: 10px;
    } 
    .singer {
      color: #9b9b9b;
    } 
  }

  .coverContainer{
    display: flex;
    // background-color: skyblue;
    // justify-content: center;
    overflow: hidden;
    .coverImg{
      position: relative;
      // width: 33.3%;
      width: 50%;
      height: 500px;
      // text-align: center;
      // line-height: 500px;
      // background-color: pink;
      .needle{
        position:absolute;
        top: 30px;left: 50%;
        width: 130px;
        
        transform: rotate(-10deg)  ;
        transform-origin: 5px 5px ;
        z-index: 9;
        transition: transform .5s ;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .needleRotate{
        transform:  rotate(20deg)  ;
      }
      .image {
        width: 200px;
        height: 200px;
        position: absolute;
        top: 50%;left: 50%;
        margin-left: -100px;
        margin-top: -100px;
        // transform: translate(-50%,-50%);
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        .discContainer {
          position: absolute;
          width: 300px;
          height: 300px;
          top: 50%;left: 50%;
          transform: translate(-50%,-50%);
          border: 10px solid #d9d7d4;
        }
        .musicImg {
        }
      }
      .pause {
        animation-play-state: paused;
        -webkit-animation-play-state: paused;
      }
    }
    .lyric{
      // width: 33.3%;
      width: 30%;
      height: 500px;
      // background-color: skyblue;
    }
    .musicOrigin{
      width: 33.3%;
      height: 500px;
      background-color: pink;
    }
  }


  .comment {
    width: 50%;
    // transform: translateX();
    margin: auto;
  }

  // .publishComment {
  //   position: fixed;
  //   bottom: 50px;
  //   left: 50%;
  //   transform: translate(-50%,0);
  //   width: 200px;
  //   height: 100px;
  //   // line-height: 100px;
  //   text-align: center;
  //   background-color: pink;


  //   .publishItem {
  //     width: 150px;
  //     height: 30px;
  //     margin: 0 auto;
  //     line-height: 30px;
  //     border-radius: 200px;
  //     background-color: #f1f1f1;
  //     cursor: pointer;
  //     &:hover {
  //       background-color: #e1e1e1;
  //     }
  //   }
  // }
</style>
