<template>
  <!-- 歌单详情页 -->
  <div class="songListDetailContainer" v-loading='isLoading' >
    <!-- 回到顶部, 目标容器必须有固定高度,且overflow-y: scroll; -->
    <el-backtop target=".songListDetailContainer" :visibility-height="500" :bottom="100">
      <div>
        <i class="iconfont icon-goTop" style="font-size:20px; color:#303030;"></i>
      </div>
    </el-backtop>
    <!-- 歌单信息 -->
    <div class="songListInfo">
      <div class="listLeft">
        <img :src="songListDetail.coverImgUrl" alt="" :draggable="false" />
      </div>
      <div class="listRight">
        <!-- 标题 -->
        <div class="listTitle">
          <div class="titleTag">歌单</div>
          <div class="titleContent">
            {{songListDetail.name}}
          </div>
        </div>
        <!-- 上传歌单用户 -->
        <div class="user">
          <div class="userImg">
            <img :src="creator.avatarUrl" alt="" />
          </div>
          <div class="userName">{{creator.nickname}}</div>
          <div class="createTime">{{createTime}} 创建</div>
        </div>
        <!-- 功能按钮 -->
        <div class="controlbutton">
          <!-- 播放全部 -->
          <div class="playAll" @click="playAll">
            <i class="el-icon-plus"></i>
            <span>播放全部</span>
          </div>
          <!-- 收藏 -->
          <button class="collect" @click="clickCollectSonglist()" :disabled="songListDetail.creator && songListDetail.creator.userId == $store.state.user.userId" >
            <i class="iconfont" :class="isCollect ? 'icon-collectSonglist' : 'icon-cencel_collectSonglist'"></i>
            <span>收藏</span>
          </button>
          <!-- 分享 -->
          <div class="share">
            <i class="iconfont icon-fenxiang"></i>
            <span>分享</span>
          </div>
        </div>
        <!-- 标签 -->
        <div class="tags">
          标签 :
          <div class="tagItem" v-for="(item,index) in tags" :key="index">{{item}}</div>
        </div>
        <!-- 歌曲数量及播放量 -->
        <div class="otherInfo">
          <div class="musicNum">歌曲 : <span>{{songListDetail.trackCount}}</span></div>
          <div class="playCount">播放 : <span>{{playCount}}</span></div>
        </div>
        <!-- 歌单简介 -->
        <div class="songListIntro">
          <div ref="intro" :class="unfold ? 'IntroContentUnfold ' : 'IntroContent '">
            <span class="introTitle"> 简介 : </span>
            {{songListDetail.description}}
          </div>
          <div class="Unfold" @click="Unfold">
            <i v-show="!unfold" class="el-icon-caret-bottom"></i>
            <i v-show="unfold" class="el-icon-caret-top"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- 歌曲列表 -->
    <div class="musicList">
      <el-tabs value="0" @tab-click="clickTab">
        <el-tab-pane label="歌曲列表" name="0">
          <!-- 歌曲列表表格 -->
          <el-table
            :data="songListDetail.tracks"
            size="mini"
            highlight-current-row
            stripe
            lazy
            style="width: 100%;"
            :cell-style="tableStyle"
            @row-dblclick="playMusic"
            
            
            v-infinite-scroll="$store.state.user.userId ? loadMore : ''"
            :infinite-scroll-disabled="scrollLoadDisabled"
            :infinite-scroll-distance="6000"
            :infinite-scroll-immediate="false"
          >
                                  
          <!-- v-infinite-scroll="$store.state.user.isLogin ? loadMore : ''"  userId   v-infinite-scroll="loadMore"-->
            <el-table-column type="index" :index="indexMethod" min-width="60" width="60"></el-table-column>
            <el-table-column  min-width="50" width="50">
              <!-- scope.row.id 通过插槽获取单行数据  -->
              <!-- <template slot-scope="scope"> -->
              <template v-slot="scope">
                <div :key="itemKey" @click="changeLike(scope.row)" class="likeMusic iconfont" :class="getMusicLike(scope.row.id) ? 'icon-xihuan' : 'icon-xihuan1'" ></div>
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
          <div class="isMusicMore" v-if="isMusicMore && !this.$store.state.user.isLogin">
            登录后查看更多
          </div>
          <div class="placeholder" v-else></div>
        </el-tab-pane>
        <el-tab-pane :label="commentTotal  ? `评论(${commentTotal})` : '评论'" name="1" 
          v-loading="isLoading" 
          element-loading-text="载入中..." 
          element-loading-spinner="el-icon-loading" >
          <div></div>
          <div class="commentsLoading" v-if="comments.comments" 
          >
            <Comment 
              :comments="comments.hotComments"
              :commentType="'musicList'"
              :resourceId="songListDetail.id + ''"
              @getComments="getMusicListComments"
              @scrollToPublishComment="scrollToPublishComment"
              ref="hotComment"
              v-if="comments.hotComments"
            ><div slot="title">精彩评论</div></Comment>
            <Comment 
              :comments="comments.comments"
              :commentType="'musicList'"
              :resourceId="songListDetail.id + ''"
              @getComments="getMusicListComments"
              @scrollToPublishComment="scrollToPublishComment"
              :ishotComments="comments.hotComments ? false : true"
              @transToHotComment="(info) => $refs.hotComment.floorComment(info.cid,info.nickName)"
              v-if="comments.comments"
            ><div slot="title">最新评论({{commentTotal}})</div></Comment>
            <!--  && isRenderComment -->
            <el-pagination
              background
              :pager-count="9"
              :page-size="50"
              layout="prev, pager, next"
              :total="commentTotal"
              :current-page="currentCommentPage"
              @current-change="changeCurrentPage"
              v-if="comments.comments">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="收藏者" name="2" 
          v-loading="isLoading" 
          element-loading-text="载入中..." 
          element-loading-spinner="el-icon-loading">

          <UserListCard :subscribers="subscribers"></UserListCard>
          <el-pagination
            background
            :pager-count="9"
            :page-size="60"
            layout="prev, pager, next"
            :total="subscribersTotal"
            :current-page="currentSubscribersPage"
            @current-change="changeSubscribersCurrentPage"
            v-if="subscribers">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import dayjs from'dayjs'
import Comment from "@/components/Comment";
import UserListCard from "@/components/UserListCard";
import { handleMusicTime ,handlePlayCount } from '@/utils/handleTime'
import { getUserId } from '@/utils/userAbout';

// import { getUserId } from '@/utils/userAbout';

export default {
  name: "songListDetail",
  props: ["params"],
  // 登录状态发生变化刷新组件
  inject:['reload'],
  components: {
    Comment,
    UserListCard,
  },
  data() {
    return {
      // 是否展开简介
      unfold: false,
      // 是否还有更多音乐
      isMusicMore:false,
      // 是否禁用滚动加载
      scrollLoadDisabled:false,
      // 歌单详情
      songListDetail:{},
      // 当前评论页数
      currentCommentPage:1,
      // 歌单评论
      comments:{},
      //评论总数
      commentTotal:0,
      // v-loading
      isLoading:false,
      // 是否渲染子组件
      isRenderComment:false,
      // 用户是否收藏该歌单
      isCollect:false,
      // 用户收藏歌单
      collectSonglist:[],
      // 当前收藏者页数
      currentSubscribersPage:1,
      // 收藏者总数
      subscribersTotal:0,
      // 收藏者列表
      subscribers:[],
      itemKey:''
    };
  },
  created() {
    this.isLoading = true
    this.getMusicIds()
  },
  async mounted() {
    if(this.$store.state.user.userId) {
      this.getCollectSonglist()
    }
    // 获取歌单详情
    await this.getSongListDetail();

    this.isLoading = false
    // 判断是否有喜欢的歌曲在歌单内
    // this.getMusicLike()
    // 判断是否和上次打开的歌单相同
    this.$nextTick(()=>{
      // console.log(this.$route.params.songListId ,'--------',this.$store.state.playMusic.songListId);
      console.log(this.$route.params);
      if(this.$route.params.songListId == this.$store.state.playMusic.songListId) {
        // console.log('是相同歌单','------------',this.$store.state.playMusic.musicId);
        this.handleTableDOM(this.$store.state.playMusic.musicId)
      }
    })
  },
  computed: {
    // likeIds() {
    //   return this.$store.state.user.likeMusicList || []
    // },
    // 创建歌单用户信息
    creator() {
      return this.songListDetail.creator || {}
    },
    // 歌单创建时间
    createTime() {
      let createTime = this.songListDetail.createTime
      createTime = dayjs(createTime).format('YYYY-MM-DD')
      return  createTime
    },
    // 歌单标签
    tags() {
      return this.songListDetail.tags || []
    },
    // 播放量单位转换
    playCount() {

      let num = handlePlayCount(this.songListDetail.playCount)
      // 如果数字大于10000 则保留1
      // let num = this.songListDetail.playCount
      // num =  num > 100000000 ? Math.trunc((Math.floor(num/10000000)/10))  + '亿' : num > 10000 ? Math.trunc((Math.floor(num/1000)/10))  + '万' : num
      return num
    },
  },
  methods: {

    /* 
     this.$nextTick(()=>{
      this.getMusicIds()
      this.getMusicLike()
    })
    
    */
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
    // 获取歌单收藏者列表
    async getSubscribers(type){

      let timestamp = Date.now()
      this.isLoading = true
      if (type == "changePage") {
        this.scrollToComment('subscribers');
      }
      
      let result = await this.$API.reqSubscribers({
        id:this.$route.params.songListId,
        limit:60,
        offset:(this.currentSubscribersPage - 1) * 60,
        timestamp
      })
      // console.log(result);

      if(result.code !== 200) {
        this.$message.error('获取收藏者失败,请重试')
      }

      if(result.code === 200) {
        this.subscribers = result.subscribers
        this.subscribersTotal = result.total
        this.isLoading = false
      }
      // if (type == "total") {
      //   this.subscribersTotal = result.total
      //   return
      // }
    },
    changeSubscribersCurrentPage(page){
      this.currentSubscribersPage = page
      this.getSubscribers('changePage')
    },
    // 点击展开简介
    Unfold() {
      if (!this.unfold) {
        this.unfold = true;
      } else {
        this.unfold = false;
      }
    },
    // 获取歌单详情
    async getSongListDetail() {
      // console.log('id:',this.$props.params);
      
      try {
        await this.$store.dispatch("recommend/getSongListDetail", this.$props.params);

        // console.log(this.$store.state.recommend.songListDetail);
        this.songListDetail = this.$store.state.recommend.songListDetail

        
        this.songListDetail.tracks.forEach((item,index) => {
          this.songListDetail.tracks[index].dt =  handleMusicTime(item.dt)
        });
        
        // 判断是否有更多音乐
        if(this.songListDetail.tracks.length < this.songListDetail.trackIds.length) {
          this.isMusicMore = true
          this.scrollLoadDisabled = false
        }
        // 提前获取评论总数显示
        this.getMusicListComments('total')
        // this.getSubscribers('total')
        // this.loadMore()

      } catch (error) {
        this.$message.error('获取歌单详情失败' + error)
      }
      
    },
    // 获取用户收藏歌单
    async getCollectSonglist() {
      let timestamp = Date.now()
      const result = await this.$API.reqUserSonglist({
        uid:this.$store.state.user.userId,
        timestamp
      })
      if(result.code === 200) {
        // let userSonglist = result.playlist
        // // 判断是否为收藏的歌单
        // let index = userSonglist.findIndex(item=> item.subscribed == true)
        // // 浅拷贝传入vuex
        // this.collectSonglist = userSonglist.slice(index)
        // // 找到当前对应歌单,显示已收藏

        // 用户收藏的歌单
        this.collectSonglist = result.playlist.filter(item => {
          return item.subscribed == true
        })

        this.isCollect = this.collectSonglist.find(item => {return  item.id == this.$route.params.songListId})

        this.$store.commit('user/updateCollectSonglist',this.collectSonglist)
      }
    },
    // 收藏歌单按钮点击的回调 
    async clickCollectSonglist(){  
      

      if(!this.$store.state.user.userId) {
        this.$message.warning('登录后才可收藏哦!')
        return
      }

      let timestamp = Date.now()
      // 状态为true取消收藏
      if(!this.isCollect) {
        const result = await this.$API.reqCollectSonglist({
          t:1,
          id:this.$route.params.songListId,
          timestamp
        })
        if(result.code === 200) {
          this.$message('已添加到我收藏的歌单')
          this.isCollect = true
        }
      }else {
        const result = await this.$API.reqCollectSonglist({
          t:2,
          id:this.$route.params.songListId,
          timestamp
        })
        if(result.code === 200) {
          this.$message('取消收藏')
          this.isCollect = false
        }
      }
      // 获取收藏歌单并添加至vuex
      this.getCollectSonglist()
      // 点击收藏后调用layout中的回调重新获取aside侧边栏参数
      this.$emit('userSongList')
    },
    // 获取歌单评论详情
    async getMusicListComments(type) {
      // let loadingInstance = this.$loading({
      //   target:'.commentsLoading',
      //   text:'载入中...',
      // })
      let timestamp = Date.now()
      this.isLoading = true
      // this.isRenderComment = false
      if (type == "changePage") {
        this.scrollToComment();
      }
      
      let id = this.$route.params.songListId
      let limit = 50
      let offset = (this.currentCommentPage - 1) * 50 

      let result = await this.$API.reqMusicListComments({id,limit,offset,timestamp})
      if(type == 'total') {
        this.commentTotal = result.total
        return
      }
      if (result.code !== 200) {
        this.$message.error("获取评论失败,请稍后重试!");
      }
      if(result.code == 200) {
        
        // this.$nextTick(()=> {
        //   loadingInstance.close()
        // })
        // this.$nextTick(()=>{
        //   this.isRenderComment = true
        // })
        this.comments = result
        this.isLoading = false
      }
    },
    // 分页 start
    // 当前页改变触发
    changeCurrentPage(page) {
      this.currentCommentPage = page
      this.getMusicListComments('changePage')
    },
    // 翻页后置顶
    scrollToComment(type) {
      let songList = document.querySelector('.songListDetailContainer')
      if(type == 'subscribers') {
        songList.scrollTo({
          top: 0,
          left: 0,
          // behavior: 'smooth'
        });
      }else {
         songList.scrollTo({
          top: 450,
          left: 0,
          // behavior: 'smooth'
        });
      }
    },  
    // 评论组件的滚动
    scrollToPublishComment() {
      let songList = document.querySelector('.songListDetailContainer')
      songList.scrollTo({
        top: 100,
        left: 0,
        // behavior: 'smooth'
      });
    },
    // 点击切换tab
    clickTab(e) {
      // 点击切换标签页再发送请求获取当前标签页的数据
      // console.log(e.index);
      if(e.index == 1 && !this.comments.comments) {
        this.getMusicListComments()
        // console.log(1,'.........');
      }else if(e.index == 2) {
        this.getSubscribers()
        // console.log(2,'.......');
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
          songList: this.songListDetail.tracks,
          songListId: this.songListDetail.id,
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
      this.$store.commit('playMusic/updateMusicId',this.songListDetail.tracks[0].id)
      this.$store.commit("playMusic/updateSongList", {
        songList: this.songListDetail.tracks,
        songListId: this.songListDetail.id,
      });
    },
    // 歌曲列表的序号处理
    indexMethod(index) {
        return index < 9 ? '0' + (index + 1)  : index + 1
    },
    // 歌曲详情
    async getMusicDetail(ids){
      if(this.isMusicMore == false) return

      this.scrollLoadDisabled = true
      
      let result = await this.$API.reqMoreMusicDetail(ids)

      if(result.code === 200) {
        
        result.songs.forEach((item,index)=> {
          result.songs[index].dt = handleMusicTime(item.dt)
        })


        this.songListDetail.tracks.push(...result.songs)
      }


      // 判断当前歌单列表中length是否小于ids的length
      if(this.songListDetail.tracks.length < this.songListDetail.trackIds.length) {
        // console.log();
        // 说明还有更多音乐需要发请求加载
        this.isMusicMore = true
        this.scrollLoadDisabled = false
      }else {
        this.isMusicMore = false
      }
    },
    // 无限滚动回调
    loadMore() {
      // console.log('loadMore start');
      // if (this.scrollLoadDisabled === false)
      this.scrollLoadDisabled = true

      // 已经登录
      if(!this.$store.state.user.userId) {
        this.$message.warning('登录获取更多音乐')
        return
      }

      // 处理id拼串发请求拿到更多音乐
      // 提取出去除之前内容的数组
      let arr = []
      if(this.songListDetail.trackIds && this.songListDetail.trackIds.length > 0) {
        arr = this.songListDetail.trackIds.slice(this.songListDetail.tracks.length)
      }


      // 每次最多拿100条
      if(arr.length > 100) {
        arr = arr.slice(0 , 100)
      }

      let ids = ''

      arr.forEach((item)=> {
        ids += item.id + ',';
      })
      ids = ids.substring(0,ids.length - 1)

      // 1200首歌,只调用了两次
      console.log(arr);

      this.getMusicDetail(ids)
    },
    
    // 修改当前播放音乐的样式
    handleTableDOM(current,old) {
      if(document.querySelector('.songListDetailContainer')) {
        let tableRows = document.querySelector('.songListDetailContainer').querySelectorAll('.el-table__row')
        let index = this.songListDetail.tracks.findIndex(item =>{
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
          let oldIndex = this.songListDetail.tracks.findIndex(item =>{
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
    }
  },
  watch:{
    '$store.state.playMusic.musicId'(current,old) {
      // 当音乐id变化时修改当前播放音乐的样式
      this.handleTableDOM(current,old)
    },
    '$store.state.user.userId'() {
      // 当登录状态发生变化,则刷新组件
      this.reload()
    },
    // comments() {
    //   this.getMusicListComments()
    // }
    '$route.path'(){
      this.reload()
    },
    
  },
  beforeDestroy() {
    this.$bus.$off(['getComments','scrollToPublishComment'])
  }
};
</script>

<style lang="less" scoped>

.songListDetailContainer {
  padding: 0px 30px ;
  // padding-left: 15px;
  overflow-x: hidden;
  // overflow-y: auto;  
  width: 100%;
  height: calc(100vh - 120px);
  overflow-y: scroll;
}
.songListInfo {
  display: flex;
  padding: 30px 0;
  .listLeft {
    width: 180px;
    height: 180px;
    img {
      width: 180px;
      height: 180px;
      border-radius: 5px;
    }
  }
}
.listRight {
  margin-left: 20px;
}
.listTitle {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  .titleTag {
    width: 40px;
    height: 20px;
    line-height: 20px;
    font-size: 13px;
    text-align: center;
    border-radius: 3px;
    color: #333333;
    border: 1px solid #838383;
  }
  .titleContent {
    margin-left: 10px;
    font-size: 22px;
    font-weight: 700;
    color: #373737;
    transform: translateY(-3px);
  }
}
.user {
  display: flex;
  .userImg {
    text-align: center;
    img {
      width: 25px;
      height: 25px;
      border-radius: 50%;
    }
  }
  .userName,
  .createTime {
    line-height: 25px;
    margin-left: 10px;
  }
  .userName {
    color: #507daf;
    font-size: 12px;
  }
  .createTime {
    font-size: 12px;
    font-weight: 300;
    color: #676767;
  }
}
.controlbutton {
  padding: 10px 0px;
  display: flex;
  .playAll,
  .collect,
  .share {
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
  .collect,
  .share{
    i{
      vertical-align: -1px;
    }
  }
  .playAll:hover {
    background-color: black;
  }
  .collect,
  .share {
    &:hover {
      background-color: #eee;
    }
  }
  .icon-collectSonglist {
    color: red;
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
  .share {
    width: 80px;
    height: 30px;
  }
}
.tags {
  line-height: 25px;
  display: flex;
  color: #373737;
  font-size: 12px;
  .tagItem {
    padding-left: 5px;
    color: #507daf;
  }
}
.otherInfo {
  display: flex;
  line-height: 20px;
  font-size: 12px;
  color: #373737;
  .musicNum,
  .playCount {
    padding-right: 5px;
    span {
      color: #676767;
    }
  }
}
.songListIntro {
  display: flex;
  font-size: 12px;
  color: #373737;
  .IntroContent {
    max-width:1300px ;
    line-height: 20px;
    color: #676767;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    
  }

  .IntroContentUnfold {
    max-width:1300px ;
    line-height: 20px;
    color: #676767;
    white-space:pre-wrap;
  }
}
.Unfold {
  i {
    cursor: pointer;
    line-height: 20px;
  }
}
.musicList {
  margin-top: 10px;
  // height: 100%;
  // overflow-y: auto;
}
.placeholder {
  width: 100%;
  height: 50px;
}

.isMusicMore {
  width: 100%;
  height: 50px;
  font-size: 12px;
  color: #aaa;
  text-align: center;
  line-height: 50px;
  // transform: scale(0.9);
}

.likeMusic {
  height: 23px;
  cursor: pointer;
  i{
    text-align: center;
  }
}

.icon-xihuan {
  color: red;
}

::v-deep .el-tabs__nav-wrap::after {
  width: 0;
}

::v-deep .el-tabs__item:hover {
  color: #373737;
}
::v-deep .el-tabs__item.is-active {
  font-weight: 800;
  color: #000;
  font-size: 18px;
}
::v-deep .el-tabs__active-bar {
  background-color:#373737 ;
}



  // ::v-deep .el-pagination {
  //   text-align: center;
  //   margin: 30px 0 70px 0;
  // }
  // ::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  //   background: #333333 !important;
  //   color: #fff !important;
  // }
   
  // ::v-deep  .el-pagination.is-background .el-pager li:not(.disabled):hover {
  //   color: #333;
  //   background-color: #f4f4f4;
  // }
  // ::v-deep    .el-pagination.is-background .el-pager li {
  //   background-color: #fff;
  //   border: 1px solid #e5e5e5;
  // }
  // ::v-deep  .el-pagination.is-background .btn-prev {
  //   background-color: #fff;
  //   border: 1px solid #e5e5e5;
  // }
  // ::v-deep  .el-pagination.is-background .btn-next {
  //   background-color: #fff;
  //   border: 1px solid #e5e5e5;
  // }
</style>
