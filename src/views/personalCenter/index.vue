<template>
  <div class="personalCenterContainer">
    <div class="logout" @click="logout">退出登录</div>
    <!-- 用户信息展示 -->
    <div class="userInfo">
      <div class="userAvatar">
        <img v-if="userDetail && userDetail.profile" :src="userDetail.profile.avatarUrl" :draggable="false" alt="">
      </div>
      <!-- right -->
      <div class="right">
        <div class="top">
          <div class="nikeName">{{userDetail_profile.nickname}}</div>
          <div class="lever_gender">
            <div class="level">Lv{{userDetail.level}}</div>
            <i class="iconfont" v-if="userDetail && userDetail.profile" :class="userDetail.profile.gender == 1 ? 'icon-man' : 'icon-woman' "></i>
          </div>
        </div>

        <div class="bottom">
          <!-- 社交功能 -->
          <div class="social">
            <div class="eventCount">{{userDetail_profile.eventCount}}<div>动态</div> </div>
            <div class="follows">{{userDetail_profile.follows}}<div>关注</div></div>
            <div class="followeds">{{userDetail_profile.followeds}}<div>粉丝</div> </div>
          </div>
          <div class="information">
            <div class="city">所在地区: <span>{{userDetail_profile.city}}</span> </div>
            <div class="signature">个人介绍: <span>{{userDetail_profile.signature}}</span></div>
          </div>
        </div>
      </div>
    </div>
    <!-- el-tabs 用户歌单显示-->
    <div class="userSongListShow">
      <el-tabs value="0" @tab-click="clickTab">
        <el-tab-pane label="创建的歌单" name="0">
          <div class="SongList">
            <div class="SongListItem" v-for="item in $store.state.user.userCreateList" :key="item.id">
              <div class="img" @click="goToSongList(item.id)">
                <div class="playCount"><i class="iconfont icon-playLinear"></i>{{item.playCount | handlePlayCount}}</div>
                <img :src="item.coverImgUrl"  alt="" :draggable="false">
              </div>
              <div class="description"><span>{{item.name.search('喜欢的音乐') != -1 ? '我喜欢的音乐' : item.name }}</span><span>{{item.trackCount}}首</span></div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="收藏的歌单" name="1">
          <div class="SongList">
            <div class="SongListItem" v-for="item in $store.state.user.collectSonglist" :key="item.id">
              <div class="img" @click="goToSongList(item.id)">
                <div class="playCount"><i class="iconfont icon-playLinear"></i>{{item.playCount | handlePlayCount}}</div>
                <img :src="item.coverImgUrl"  alt="" :draggable="false">
              </div>
              <div class="description"><span>{{item.name}}</span><span>{{item.trackCount}}首</span></div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {removeUserId} from '@/utils/userAbout'
import { handlePlayCount } from "@/utils/handleTime";
export default {
  name: '',
  data(){
    return {
      // 用户详情信息
      // userDetail:{}
    }
  },
  mounted(){
    this.getUserDetail()
  },
  methods:{
    //   退出登录
    async logout() {
        let result =  await this.$API.reqLogout()
        if(result.code === 200) {
          this.$message.success('退出登录')
          // 修改登录状态,删除userId
          removeUserId()
          this.$store.state.user.userId = null
          this.$store.dispatch('user/updataLoginState',false)
          this.$router.push('/disCoverMusic/recommend')
        }
    },
    // 获取用户详情信息
    getUserDetail() {
      this.$store.dispatch('user/getUserDetail',this.$store.state.user.userId)
    },
    // 切换tabs
    clickTab(){
      // console.log(e.index);
    },
    // 通过歌单id跳转对应歌单
    goToSongList(id){
      this.$router.push('/songListDetail/' + id)
    }
  },
  computed:{
    userDetail() {
      return this.$store.state.user.userDetail || {}
    },
    userDetail_profile(){
      return this.$store.state.user.userDetail.profile || {}
    }
  },
  filters:{
    handlePlayCount
  }
}
</script>

<style lang="less" scoped>
    .personalCenterContainer{
      position: relative;
      padding: 0 30px;
    }
    .logout {
      position: absolute;
      top: 50px;
      right: 50px;
      width: 80px;
      height: 30px;
      background-color:#f1f1f1 ;
      text-align: center;
      line-height: 30px;
      border-radius: 200px;
      cursor: pointer;
      &:hover {
        background-color: #e1e1e1;
      }
    }
  
    .userInfo {
      display: flex;
      padding: 30px 0 30px;
    }
    .userAvatar {
      width:180px;
      height: 180px;
      margin-right: 20px;
      flex:0 0 180px;
      img {
        width:100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .right {
      width: 80%;
      .top {
        // position: relative ;\
        border-bottom: 1px solid #e5e5e5;
        .nikeName {
          font-size: 20px;
          font-weight: 700;
          padding-bottom: 10px;
        }
        .lever_gender {
          display: flex;
          padding-bottom: 10px;
          .level {
            width: 35px;
            height: 16px;
            line-height: 15px;
            border-radius: 100px;
            background-color: #f0f0f0;
            color: #333333;
            text-align: center;
            margin-right: 6px;
            transform:scale(.9);
          }
          .iconfont {
            font-size: 12px;
            transform:scale(.9);
          }
          .icon-man {
            color: #1296db;
          }
          .icon-woman {
            color: #d4237a;
          }
        }
      }
    }

    .bottom {
      padding-top:10px ;
      .social {
        display: flex;
        margin-left: -22px;
        .eventCount,.follows,.followeds {
          display: flex;
          flex-flow: column;
          text-align: center;
          width: 80px;
          font-size: 18px;
          border-right: 1px solid #e5e5e5;
          div {
            padding-top: 2px;
            font-size: 12px;
            color: #676767;
            transform: scale(.9);
          }
        }
        .followeds {
          border: none;
        }
      }

      .information {
        padding-top: 10px;
        .city,.signature {
          padding-bottom: 10px;
          color: #373737;
          line-height: 18px;
        }
        span {
          color: #676767;
          transform: scale(.9);
        }
      }
    }

    // .userSongListShow {
      
    // }

    .SongList {
      display: flex;
      flex-wrap: wrap;
      .SongListItem {
        position: relative;
        display: flex;
        flex-flow: column ;
        width: 18.4%;
        margin: 0 2% 20px 0;
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
        img {
          width: 100%;
          height: 100%;
          border-radius: 10px;
          cursor: pointer;
        }
        .description {
          display: flex;
          flex-flow: column;
          line-height: 18px;
          color: #000;
          font-weight: 500;
          font-size: 13px;
          padding:10px 0 10px 0;
          :nth-child(2) {
            font-size: 12px;
            font-weight: 400;
            color: #9f9f9f;
          }
        }
        &:nth-child(5n) {
          margin-right: 0;
        }
      }
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
</style>
