<template>
  <div class="highqualityListContainer">
    <!-- 精品歌单 -->
    <header class="header">
      <div class="title"> 精品歌单</div>
      <el-popover
        ref="popover"
          popper-class="listTagPop"
          placement="bottom-end"
          width="500"
          trigger="click"
          v-model="isPopover">
        <div class="popover" slot="reference"><i class="iconfont icon-jiubei"></i> {{currentTag}}</div>
        <div class="allTag" @click="clickHighqualityItem('全部歌单')" ><span >全部歌单</span></div>
        <!-- :class="{'active':currentTag == '全部歌单'}" -->
        <div class="tagsWrap">
          <div class="tagItem" 
            v-for="tag in highqualityTags" :key="tag.id" 
            @click="clickHighqualityItem(tag.name)"
            >
            <span :class="{'active':currentTag == tag.name}" >{{tag.name}}</span>
          </div>
        </div>
      </el-popover>
    </header>
    <div class="list">
      <div class="listItem" v-for="item in highqualityList" :key="item.id" >
        <div class="image" @click="toDetail(item.id)">
          <div class="playCount">
            <i class="iconfont icon-playLinear"></i>
            {{item.playcount? item.playcount : item.playCount | handlePlayCount }}
            </div>
          <img :src="item.coverImgUrl" alt="" />
        </div>
        <div class="intro">
          <div class="title" @click="toDetail(item.id)">{{item.name}}</div>
          <div class="createUser">by&nbsp;<span>{{item.creator.nickname}}</span></div>
          <div class="description">{{item.copywriter}}</div>
        </div>
      </div>
      <div class="fillWrap"></div>
      <div class="fillWrap"></div>
      <div class="fillWrap"></div>
    </div>
  </div>
</template>

<script>
import { handlePlayCount } from "@/utils/handleTime";
export default {
  name: "highqualityList",
  // 通过params参数发请求获取精品歌单,精品歌单的回调可以转到这个组件,点击分类时可以调用兄弟组件的回调获取歌单列表,或者在这个组件调
  data(){
    return {
      // 从分类歌单传递过来的tag 通过tag发请求获取精品歌单
      // 当前tag
      currentTag:'',
      // 精品歌单列表
      highqualityList:[],
      // 精品歌单分类标签
      highqualityTags:[],
      isPopover:false,
    }
  },
  mounted(){
    this.getHighqualityTags()
    this.getHighqualityList(this.$route.params.name)
  },
  methods:{
    // 获取精品歌单
    async getHighqualityList(tag='华语') {
      // if(this.currentTag == tag) return
      this.currentTag = tag
      // console.log(this.currentTag.name);
      let result = await this.$API.reqHighquality_list({
        tag
      });
      if (result.code == 200) {
        this.highqualityList = result.playlists;
        // console.log(this.currentSongList);
        // this.currentHighquality = result.playlists[0];
      }
    },
    async getHighqualityTags(){
      
      let result = await this.$API.reqHighquality_tags()
      if(result.code == 200) {
        this.highqualityTags = result.tags
      }
    },
    // 点击tag获取当前tag下的精品歌单
    clickHighqualityItem(name){
      if(this.currentTag == name) return
      this.highqualityList = []
      // console.log(name);
      this.currentTag = name
      this.getHighqualityList(name)
    },
    toDetail(id) {
      this.$router.push({name:'songListDetail',params:{songListId:id}})
    }
  },
  filters:{
    handlePlayCount
  }
};
</script>

<style lang="less" scoped>

.allTag {
  width: 100%;
  height: 30px;
  margin: 10px 10px;
  line-height: 30px;
  // background-color: aquamarine;
  border-bottom: 1px solid #e5e5e5;
  span {
    padding: 5px 10px;
    border-radius: 200px;
  }
}
.active {
  background-color: #f4f4f4;
}
.tagsWrap{
  margin: 10px 10px;
  display: flex;
  flex-flow: wrap;
 
  .tagItem {
    // padding: 5px 0;
    margin: 5px 0;
    width: 20%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    // background-color: pink;
    span {
      padding: 3px 10px;
      // background-color: #f4f4f4;
      border-radius: 200px;
    }
    
  }
}


.highqualityListContainer {
  padding: 0 60px;
  min-width: 820px;
  overflow-y:scroll ;
  height: calc(100vh - 180px);
}
.header {
  // padding: 0 30px;
  width: 100%;
  min-width: 820px;
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: space-between;
  // background-color: skyblue;
  .title {
    font-size: 16px;
    font-weight: 800;
  }
  .popover {
    // padding: 5px 20px;
    width: 90px;
    height: 25px;
    text-align: center;
    line-height: 25px;
    border-radius: 200px;
    cursor: pointer;
    background-color: white;
    font-size: 12px;
    color: #373737;
    border: 1px solid #dddddd;
    cursor: pointer;
    
    &:hover {
      background-color: #f2f2f2;
    }
    .iconfont {
      font-size: 12px;
    }
  }
  
}

.list {
  display: flex;
  flex-flow: wrap;
  justify-content: space-between;
  min-width: 820px;
  // width: 100%;
  .listItem {
    display: flex;
    min-width: 410px;
    // width: 530px;
    width: 33%;
    margin: 10px 0;
    .image{
      position: relative;
      width: 130px;
      height: 130px;
      cursor: pointer;
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
      &::before {
        position: absolute;
        content: "";
        width: 100%;
        height: 50px;
        // 鼠标会直接穿透过去,不会被当成target
        pointer-events: none;
        background: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0.3),
          transparent
        );
        // background-color: red;
        border-radius: 10px;
      }
      &::after {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: url("../../../../../assets/img/imgLoading.png") no-repeat center;
        background-size: contain;
        border-radius: 10px;
        z-index: -1;
      }
      img {
        width: 100%;
        height: 100%;
        border-radius: 8px;
      }
    }
    .intro {
      width: 0;
      flex: 1;
      padding: 20px  20px;
      .title {
        font-size: 14px;
        color: #373737;
        margin:0 0 20px 0;
        cursor: pointer;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap
      }
      .createUser{
        font-size: 12px;
        color:#9f9f9f;
        margin: 0 0 20px 0;
      }
      .description{
        font-size: 12px;
        color: #cfcfcf;
      }
    }
  }
  .fillWrap {
    min-width: 410px;
    // width: 530px;
    width: 33%;
    margin: 10px 0;
  }
}
</style>
