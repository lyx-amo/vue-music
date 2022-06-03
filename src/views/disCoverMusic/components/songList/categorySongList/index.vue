<template>
  <div class="songlistContainer">
    <!-- v-loading="isLoading"
    element-loading-background="white" -->
    <div class="wrap">
      <header class="header">
        <div class="highquality" @click="toHighqualityList" v-if="currentHighquality">
          <div class="left">
            <img
              :src="currentHighquality.coverImgUrl"
              alt=""
              :draggable="false"
            />
          </div>
          <div class="right" >
            <!-- 精品歌单入口 -->
            <div class="highqualityEntry" >
              <i class="iconfont icon-jingpin"></i>
              <span>精品歌单</span>
            </div>
            <div class="describe">
              <div class="title">{{ currentHighquality.name }}</div>
              <div class="subhead">{{ currentHighquality.copywriter }}</div>
            </div>
          </div>
          <div class="bg">
            <img
              :src="currentHighquality.coverImgUrl"
              :draggable="false"
              alt=""
            />
          </div>
        </div>
      </header>
      <!-- 歌单展示部分 -->
      <div class="listContainer">
        <!-- 导航标签 -->
        <div class="nav">
          <el-popover
            ref="popover"
            popper-class="listTagPop"
            placement="bottom-start"
            width="750"
            trigger="click"
            v-model="isPopover"
          >
            <div class="popover" slot="reference" @click="openPopover">
              {{ currentTag.name }}
              <i class="iconfont icon-xiayiye"></i>
            </div>
            <!-- 标签分类 -->
            <div class="categoryTagsWrap">
              <!-- :class="{'categoryActive': categoryActive == allOption.name}" -->
              <div class="AllList" @click="clickCategoryItem(allOption.name,'',5)">
                <span :class="{'allListClass' :categoryActive == allOption.name} " >
                  {{allOption.name}}
                </span>
              </div>
              <div class="categoryTags">
                <div class="title">
                  <i class="iconfont icon-yuzhong"></i>{{ categories["0"] }}
                </div>
                <ul>
                  <li v-for="(item, index) in category0" :key="item.name" @click="clickCategoryItem(item.name,index,0)" >
                    <span
                      :class="{
                        'hotIcon': item.hot,
                        'categoryActive': categoryActive == item.name,
                      }"
                      >{{ item.name }}
                    </span>
                  </li>
                </ul>
              </div>
              
              <div class="categoryTags">
                <div class="title">
                  <i class="iconfont icon-fengge"></i>{{ categories["1"] }}
                </div>
                <ul>
                  <li v-for="(item, index) in category1" :key="item.name" @click="clickCategoryItem(item.name,index,1)" >
                     <span
                      :class="{
                        'hotIcon': item.hot,
                        'categoryActive': categoryActive == item.name,
                      }"
                      >{{ item.name }}
                    </span>
                  </li>
                </ul>
              </div>

              <div class="categoryTags">
                <div class="title">
                  <i class="iconfont icon-kafei"></i>{{ categories["2"] }}
                </div>
                <ul>
                  <li v-for="(item, index) in category2" :key="item.name" @click="clickCategoryItem(item.name,index,2)">
                     <span
                      :class="{
                        'hotIcon': item.hot,
                        'categoryActive': categoryActive == item.name,
                      }"
                      >{{ item.name }}
                    </span>
                  </li>
                </ul>
              </div>

              <div class="categoryTags">
                <div class="title">
                  <i class="iconfont icon-xiaolian"></i>{{ categories["3"] }}
                </div>
                <ul>
                  <li v-for="(item, index) in category3" :key="item.name" @click="clickCategoryItem(item.name,index,3)">
                    <span
                      :class="{
                        'hotIcon': item.hot,
                        'categoryActive': categoryActive == item.name,
                      }"
                      >{{ item.name }}
                    </span>
                  </li>
                </ul>
              </div>

              <div class="categoryTags">
                <div class="title">
                  <i class="iconfont icon-zhuti"></i>{{ categories["4"] }}
                </div>
                <ul>
                  <li v-for="(item, index) in category4" :key="item.name" @click="clickCategoryItem(item.name,index,4)">
                    <span
                      :class="{
                        'hotIcon': item.hot,
                        'categoryActive': categoryActive == item.name,
                      }"
                      >{{ item.name }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </el-popover>

          <div class="hotNav">
            <!-- <div class="active tag">华语</div> -->
            <div
              v-for="(tag, index) in hotTags"
              :key="tag.id"
              @click="clickSecondBarItem(index,tag.name)"
              class="tag"
              :class=" activeHotName !== tag.name ? '' : 'active'"
            >
            <!-- index == activeNum || -->
              {{ tag.name }}
            </div>
          </div>
        </div>
        <!-- 歌单 -->
        <div
          class="listWrap"
          v-loading="isLoading"
          element-loading-background="white"
        >
          <!-- 
            v-infinite-scroll="$store.state.user.userId ? loadMore : ''"
            :infinite-scroll-disabled="scrollLoadDisabled"
            :infinite-scroll-distance="1500"
            :infinite-scroll-immediate="false"
          -->
          <div class="list">
            <div
              class="listItem"
              v-for="(item,index) in currentSongList"
              :key="index"
              @click="toDetail(item.id)"
            >
              
            <!-- :key="item.id" -->
              <div class="coverImg">
                <div class="playCount">
                  <i class="iconfont icon-playLinear"></i
                  >{{
                    item.playcount
                      ? item.playcount
                      : item.playCount | handlePlayCount
                  }}
                </div>
                <img :src="item.coverImgUrl" alt="" :draggable="false" />
                <!-- <img src="../../../../assets/img/109951165545967215.jpg" alt="" :draggable="false" /> -->
              </div>
              <div class="listName">{{ item.name }}</div>
              <!-- <div class="placeholder"></div>
            <div class="placeholder"></div>
            <div class="placeholder"></div>
            <div class="placeholder"></div>
            <div class="placeholder"></div> -->
            </div>
          </div>
          <el-pagination
            background
            :pager-count="9"
            :page-size="100"
            layout="prev, pager, next"
            :total="total"
            :current-page="currentPage"
            @current-change="changeCurrentPage"
            v-if="currentSongList"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { handlePlayCount } from "@/utils/handleTime";
export default {
  name: "categorySongList",
  data() {
    return {
      isLoading: true,
      listLoading: false,
      // 热门分类标签
      hotTags: {},
      isPopover: false,
      // 当前点击热门标签
      currentTag: {},
      // 分类标签
      categoryTags: {},
      // 分类歌单
      currentSongList: [],
      // 精品歌单 在父组件请求,传给子组件,子组件获取数据向父组件通信调用回调请求
      highqualityList: [],
      currentHighquality: [],
      // 当前hotTag
      activeHotName: '',
      // 当前categoryTag
      categoryActive:'',
      // 当前评论页数
      currentPage: 1,
      total: 0,
      sub:[],
      category0: [],
      category1: [],
      category2: [],
      category3: [],
      category4: [],
      allOption:{},
      scrollLoadDisabled:false
    };
  },
  created() {
    
  },
  async mounted() {
    // this.isLoading = true;
    // 当标签获取完成后再调用获取歌单,避免初始化获取不到'华语标签'
    await this.getHotTags();
    await this.getHighqualityFirst();
    this.getCurrentList();
    this.getCategoryTags()
    // this.handleCategoryTags()
    // this.isLoading = false;
  },
  computed: {
    categories() {
      return this.categoryTags.categories || {};
    },
  },
  methods: {
    handleCategoryTags() {
      this.category0 = this.sub.filter((item, index) => {
        return item.category == 0;
      });
      this.category1 = this.sub.filter((item, index) => {
        return item.category == 1;
      });
      this.category2 = this.sub.filter((item, index) => {
        return item.category == 2;
      });
      this.category3 = this.sub.filter((item, index) => {
        return item.category == 3;
      });
      this.category4 = this.sub.filter((item, index) => {
        return item.category == 4;
      });
      this.allOption = this.categoryTags.all
    },
    // 获取热门分类标签
    async getHotTags() {
      let result = await this.$API.reqHotSonglist_Category();
      if (result.code == 200) {
        this.hotTags = result.tags;
        this.currentTag = result.tags[0];
      }
    },
    // 获取分类标签
    async getCategoryTags() {

      let result = await this.$API.reqCatlist();

      if (result.code == 200) {
        this.categoryTags = result;
        this.sub = result.sub
        this.handleCategoryTags();
        this.clickSecondBarItem(0,'华语')
        // this.clickCategoryItem('华语',0,0)
      }
    },
    // 开关popover
    openPopover() {
      // if (!this.isPopover) {
      //   this.getCategoryTags();
      // }
    },
    // 获取当前歌单列表
    async getCurrentList() {
      this.isLoading = true;
      this.currentSongList = [];
      let result = await this.$API.reqHotSonglist({
        cat: this.currentTag.name,
        limit: 50,
        offset: (this.currentPage - 1) * 50,
      });
      if (result.code == 200) {
        // this.currentSongList = result.playlists;
        this.currentSongList = [...new Set(result.playlists)];

        this.total = result.total;
        this.isLoading = false;
      }
    },
    // 点击当前分类标签
    clickCategoryItem(name,index,flag){
      this.isPopover = false
      if(this.categoryActive == name) return
      switch (flag) {
        case 0:
          this.currentTag = this.category0[index]
          break
        case 1:
          this.currentTag = this.category1[index]
          break 
        case 2:
          this.currentTag = this.category2[index]
          break 
        case 3:
          this.currentTag = this.category3[index]
          break
        case 4:
          this.currentTag = this.category4[index]
          break
        case 5:
          this.currentTag = this.allOption
        break
      }
      console.log(name);
      this.categoryActive = name
      // 点击分类tag,tag不在热门tag的数组中时,清空热门tag的样式
      this.activeHotName = name;

      // console.log("category",name,this.categoryActive);
      // 回来搞这个,分类标签的active并且发送请求获取相应歌单数据
      // console.log(this.categoryActive);
      // console.log(this.currentTag);

      // 点击后关闭popover
      this.getHighqualityFirst()
      this.getCurrentList()
    },
    // 点击当前hotTag
    clickSecondBarItem(index,name) {
      if (name == this.activeHotName) return;
      this.activeHotName = name;
      this.categoryActive = name
      // console.log("hotTag",name,this.categoryActive);
      this.currentTag = this.hotTags[index];
      this.currentPage = 1;
      this.getHighqualityFirst();
      this.getCurrentList();
      // 通过index来改变当前选中样式,并获取到当前点击的热门标签
      // 通过当前点击的热门标签发送请求获取对应标签的歌单列表
    },
    // 精品歌单的第一个展示用
    async getHighqualityFirst() {
      let result = await this.$API.reqHighquality_list({
        tag: this.currentTag.name,
      });
      if (result.code == 200) {
        this.currentHighquality = result.playlists[0];
      }
    },
    
    // 去到歌单详情页
    toDetail(id) {
      this.$router.push({ name: "songListDetail", params: { songListId: id } });
    },
    // 翻页
    changeCurrentPage(page) {
      this.currentPage = page;
      this.getCurrentList();
      this.scrollToTop();
    },
    // 翻页后置顶
    scrollToTop() {
      let songList = document.querySelector(".songlistContainer");
      songList.scrollTo({
        top: 0,
        left: 0,
        // behavior: 'smooth'
      });
    },
    loadMore(){
      
    },
    // 点击精品歌单跳转界面
    toHighqualityList(){
      // 跳转带当前tag
      this.$router.push({
        name:'highqualityList',
        params:{name: this.currentTag.name,}
      })
    }
  },
  filters: {
    handlePlayCount,
  },
};
</script>

<style lang="less" scoped>
.categoryTagsWrap {
  margin: 20px 10px;
  .AllList {
    width: 100%;
    height: 40px;
    line-height: 30px;
    font-size: 14px;
    padding-left: 10px;
    color: #373737;
    border-bottom:1px solid #e5e5e5;
    cursor: pointer;
    span {
      padding: 8px;
    }
  }
  .allListClass {
    // padding: 8px;
    background-color: #f4f4f4;
    border-radius: 200px;
  }
  .categoryTags {
    display: flex;
    margin-top: 20px;
    .title {
      width: 10%;
      height: 25px;
      font-size: 13px;
      // text-align: center;
      line-height: 25px;
      color: #cfcfcf;
      box-sizing: border-box;
      font-weight: 300;
      .iconfont {
        font-size: 25px;
        vertical-align: -4px;
        padding-right: 3px;
        color: #373737;
      }
    }
    ul {
      display: flex;
      width: 90%;
      padding-left: 30px;
      // align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
      li {
        width: 16%;
        // width: 80px;
        // height: 25px;
        font-size: 13px;
        line-height: 25px;
        margin: 0 10px 10px;
        // padding:0 10px 10px ;
        // text-align: center;
        // border-radius: 200px;
        color: #373737;
        cursor: pointer;
        // background-color: #f4f4f4;
        .categoryActive {
          position: relative;
          // background-color: #f4f4f4;
          // border-radius: 200px;
          &::before {
            content: "";
            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%);
            left: 50%;
            width: 250%;
            height: 25px;
            background-color: #f4f4f4;
            border-radius: 200px;
            z-index: -1;
          }
        }
        .hotIcon {
          position: relative;
          &::after {
            position: absolute;
            top: -8px;
            right: -20px;
            content: "HOT";
            font-size: 12px;
            // width:10px ;
            // height: 5px;
            // background-color: pink;
            transform: scale(0.5);
            color: red;
          }
        }
      }
    }
  }
}

.songlistContainer {
  width: 100%;
  min-width: 1000px;
  padding: 0 30px;
  overflow-y: scroll;
  height: calc(100vh - 180px);
  .wrap {
    max-width: 1100px;
    margin: auto;
    .highquality {
      position: relative;
      display: flex;
      justify-content: left;
      align-items: center;
      width: 100%;
      height: 200px;
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
      .bg {
        position: absolute;
        left: 0;
        top: 0;
        z-index: -1;
        width: 1100px;
        height: 100%;
        background: no-repeat;
        // url('../../../../assets/img/109951165545967215.jpg')
        // background-size: 1100px 300px;
        filter: blur(30px) brightness(65%) saturate(1.5);
        img {
          position: absolute;
          top: -50px;
          left: 0;
          width: 100%;
          height: 200%;
        }
      }
      .left {
        width: 160px;
        height: 160px;
        margin: 0 20px;
        // background-color: #ffc0cb;
        border-radius: 10px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
      }
      .right {
        display: flex;
        flex-flow: column;
        .highqualityEntry {
          width: 100px;
          height: 30px;
          margin-bottom: 30px;
          text-align: center;
          border: 1px solid #e7aa5a;
          border-radius: 200px;
          color: #e7aa5a;
          font-size: 13px;
          line-height: 30px;
          span {
            margin-left: 3px;
            vertical-align: 1px;
          }
        }
        .describe {
          .title {
            margin-bottom: 10px;
            color: #ffffff;
            font-size: 16px;
            font-weight: 500;
          }
          .subhead {
            color: #c3bbae;
            font-size: 12px;
          }
        }
      }
    }
    // 歌单展示
    .listContainer {
      .nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 50px;
        margin: 15px 0;
        // background-color: #ffc0cb;

        .popover {
          width: 100px;
          height: 30px;
          background-color: white;
          border-radius: 200px;
          text-align: center;
          line-height: 30px;
          font-size: 13px;
          color: #373737;
          border: 1px solid #dddddd;
          cursor: pointer;
          &:hover {
            background-color: #f2f2f2;
          }
          i {
            vertical-align: -1px;
          }
        }
        .hotNav {
          display: flex;
          color: #676767;
          .active {
            background-color: #f4f4f4;
            border-radius: 200px;
            color: #373737;
          }
          .tag {
            margin-left: 10px;
            padding: 4px 6px;
            cursor: pointer;
            &:hover {
              color: #373737;
            }
          }
        }
      }
      .listWrap {
        // text-align: center;
        // align-content: flex-start;
        // &::after {
        //   content: "";
        //   display: block;
        //   flex: 1 1 auto;
        // }
        .placeholder {
          width: 200px;
          height: 200px;
          // background-color: #ffc0cb;
        }
        .list {
          min-height: 700px;
          display: flex;
          justify-content: space-between;
          flex-flow: wrap;
          .listItem {
            // display: flex;
            // flex-flow: column;
            // width: 18.4%;
            // max-width: 200px;
            width: 200px;
            // margin: 0 20px 20px 0;
            margin-bottom: 20px;
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
            .coverImg {
              // width: 100%;
              width: 200px;
              position: relative;
              border: none;
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
                // position: relative;
                width: 200px;
                height: 200px;
                // z-index: -1;
                border-radius: 10px;
               
              }
            }
            // &:nth-child(5n) {
            //   margin-right: 0;
            // }
            .listName {
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
    }
  }
}
</style>
