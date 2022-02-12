<template>
  <!-- 歌单详情页 -->
  <div class="songListDetailContainer">
    <!-- 歌单信息 -->
    <div class="songListInfo">
      <div class="listLeft">
        <img :src="songListDetail.coverImgUrl" alt="" />
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
          <div class="playAll">
            <i class="el-icon-plus"></i>
            <span>播放全部</span>
          </div>
          <!-- 收藏 -->
          <div class="collect">
            <i class="el-icon-plus"></i>
            <span>收藏</span>
          </div>
          <!-- 分享 -->
          <div class="share">
            <i class="el-icon-plus"></i>
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
            :data="tracks"
            size="mini"
            highlight-current-row
            stripe
            lazy
            style="width: 100%"
            :cell-style="tableStyle"
            @row-dblclick="playMusic"
          >
            <el-table-column type="index" :index="indexMethod" width="35"> </el-table-column>
            <el-table-column label="操作" width="50">
              <div class="musicDownload">
                <i class="el-icon-download"></i>  
              </div>  
            </el-table-column>
            <el-table-column prop="name" label="标题" min-width="200">
            </el-table-column>
            <el-table-column prop="ar[0].name" label="歌手" min-width="100">
            </el-table-column>
            <el-table-column prop="al.name" label="专辑" min-width="180"> </el-table-column>
            <el-table-column prop="dt" label="时间" width="180" >
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="评论(999+)" name="1">
          <Comment></Comment>
        </el-tab-pane>
        <el-tab-pane label="收藏者" name="2">
          <UserListCard></UserListCard>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import dayjs from'dayjs'
import Comment from "@/components/Comment";
import UserListCard from "@/components/UserListCard";
import { handleMusicTime } from '@/utils/handleTime'

export default {
  name: "songListDetail",
  props: ["params"],
  components: {
    Comment,
    UserListCard,
  },
  data() {
    return {
      // 是否展开简介
      unfold: false,
    };
  },
  created() {
    this.getSongListDetail();
  },
  mounted() {

  },
  computed: {
    // 获取歌单详情
    songListDetail(){
        return this.$store.state.recommend.songListDetail || {}
    },
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
      // 如果数字大于10000 则保留1
      let num = this.songListDetail.playCount
      num =  num > 10000 ? Math.trunc((Math.floor(num/1000)/10))  + '万' : num
      return num
    },
    // 音乐标题时长等信息
    tracks() {
      let tracks = this.songListDetail.tracks || []
       // 处理音乐时长

      tracks.forEach((item,index) => {
        tracks[index].dt =  handleMusicTime(item.dt)
      });
      return tracks
    }
    
  },
  methods: {
    // 点击展开简介
    Unfold() {
      if (!this.unfold) {
        this.unfold = true;
      } else {
        this.unfold = false;
      }
    },
    // 获取歌单详情
    getSongListDetail() {
        // console.log('id:',this.$props.params);
      this.$store.dispatch("recommend/getSongListDetail", this.$props.params);
    },
    // 点击切换tab
    clickTab() {},
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
      if(this.songListDetail.id !== this.$store.state.playMusic.songListId) {
        this.$store.commit("playMusic/updateSongList", {
          songList: this.tracks,
          songListId: this.songListDetail.id,
        });
      }


      // 修改音乐播放状态
      this.$store.state.playMusic.isPlay = false
    },
    // 歌曲列表的序号处理
    indexMethod(index) {
        return index < 9 ? '0' + (index + 1)  : index + 1
    },
    // 表格单列样式
    tableStyle(row) {
      if(row.columnIndex === 5 || row.columnIndex < 2) {
        return "color:#9F9F9F;"
      }
      if(row.columnIndex !== 2) {
        return "color:#656565;"
      }
      if(row.columnIndex === 2) {
        return "color:#333333;"
      }
    }
  },
};
</script>

<style lang="less" scoped>
.songListDetailContainer {
  padding: 30px 30px 0px;
  overflow-x: hidden;
  overflow-y: scroll;  
  height: calc(100vh - 120px);
}
.songListInfo {
  display: flex;

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
    i {
      padding-right: 5px;
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
  }
}
.Unfold {
  i {
    cursor: pointer;
    line-height: 20px;
  }
}
.musicList {
  margin-top: 30px;
}

</style>
