<template>
    <!-- 歌单评论 -->
  <div class="commentContainer">
    <!-- 发表评论 -->
    <div class="publishComments" v-if="ishotComments && commentType == 'musicList'">
      <el-input
        class="commentArea"
        type="textarea"
        :rows="3"
        maxlength="140"
        resize="none"
        show-word-limit
        v-model="userComment">
      </el-input>
      <div class="commentsButtons">
        <div class="left">
          <i class="iconfont icon-aite"></i>
          <i class="iconfont icon-jinghao"></i>
        </div>
        <div class="commentsButton" @click=" !isfloorComment ?  publishComment() : publishFloorComment()">评论</div>
      </div>
    </div>
    <div class="musicCardComment" v-if="commentType == 'musicDetailCard'">
      <div class="publishComment" @click="openDialog"><i class="iconfont icon-shuxie"></i> 写评论</div>


      <el-dialog
        :visible="isDialogShow"
        top="40vh"
        title="评论"
        :modal="false"
        width="500px"
        :before-close="closeDialog">
        <el-input
          class="commentArea "
          type="textarea"
          :rows="3"
          maxlength="140"
          resize="none"
          show-word-limit
          v-model="userComment">
        </el-input>
        <div class="commentsButtons">
        <div class="left">
          <i class="iconfont icon-aite"></i>
          <i class="iconfont icon-jinghao"></i>
        </div>
        <div class="commentsButton" @click=" !isfloorComment ?  publishComment() : publishFloorComment()">评论</div>
      </div>
      </el-dialog>
    </div>
    <!-- 评论区 -->
    <div class="commentsHeader" >
    <!-- <div :class="{'musicCardHeader':commentType == 'musicDetailCard','commentsHeader':commentType == 'musicList'}"> -->
      <slot name="title"></slot>
    </div>
    <!-- 评论个体 -->
    <div class="commentItem" v-for="(item,index) in comments" :key="item.commentId" @mouseenter="enteritem(item)" @mouseleave="leaveItem(item)">
      <div class="commentCreator" >
        <img :src="item.user.avatarUrl" :draggable="false" alt="">
      </div>
      <div class="commentMain">
        <div class="commentContent">
          <span class="nickName">{{item.user.nickname}}:&nbsp;</span>
          <span class="content">{{item.content}}</span>
        </div>
        <!-- 回复 -->
        <div class="replied" v-if="item.beReplied.length > 0 ">
          <span class="nickName">@{{item.beReplied[0].user.nickname}}:&nbsp;</span>
          <span class="content">{{item.beReplied[0].content}}</span>
        </div>
        <!-- 楼层回复按钮 -->
        <div class="commentBottom">
          <div class="commentTime">{{item.timeStr == '刚刚' ? item.timeStr : $options.filters['handleCommentTime'](item.time) }}</div>
          <div class="buttons">
            <div class="like">
              <div class="delete" v-show="item.showDelete">
                <el-button type="text" @click="deleteComment(item.commentId)">删除</el-button>
              </div>
              <div class="likeIcon" @click="goToLike(item.commentId,index)">
                <!-- <i :class="comments &&  comments[index].liked ? 'iconfont icon-dianzan': 'iconfont icon-dianzan1'"></i>  -->
                <i :class="item.liked ? 'iconfont icon-dianzan': 'iconfont icon-dianzan1'"></i> 
              </div>
              <span class="likeCount">{{item.likedCount}}</span>
            </div>
            <div><i class="iconfont icon-fenxiang"></i></div>
            <div @click="floorComment(item.commentId,item.user.nickname)">
              
              <i class="iconfont icon-pinglun"></i></div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import {handleCommentTime} from '@/utils/handleTime'
export default {
  name: 'Comment',
  props:{
    // 评论
    comments:{
      type:Array,
      default(){
        return []
      }
    },
    // 评论类型
    commentType:{
      type:String,
      default(){
        return ''
      }
    },
    // 资源id
    resourceId:{
      type:String,
      default() {
        return ''
      }
    },
    // 是否是热评
    ishotComments:{
      type:Boolean,
      default(){
        return true
      }
    }
  },
  data() {
    return {
      // 用户输入的评论
      userComment:'',
      // 是否是楼层回复
      isfloorComment:false,
      // 保存加@nickName的length
      floorCommentInputLength:'',
      // 临时保存的评论id
      floorCommentId:'',
      showDelete:false,
      isDialogShow:false
    }
  },
  mounted(){
    // this.$bus.$on('openDialog',this.openDialog) 
  },
  methods:{
    openDialog() {
      this.isDialogShow = true
    },
    // 关闭dialog
    closeDialog() {
      this.isDialogShow = false
    },
    // 给评论点赞
    async goToLike(cid,index) {
      if(!this.$store.state.user.userId) {
        this.$message.warning('登录后才能点赞哦!')
        return
      }
      let timestamp = Date.now()
      let id = this.resourceId
      let t;
      let type;
      switch (this.commentType) {
        case 'musicList':
          type = 2
          break;
        case 'musicDetailCard':
          type = 0
        break;
      }
      // console.log(this.comments[index].liked);
      if(!this.comments[index].liked) {
        let result =  await this.$API.reqCommentLike({id,cid,t:1,type,timestamp})
        if(result.code == 200) {
          this.$set(this.comments[index],'liked',true)
          this.$set(this.comments[index],'likedCount',this.comments[index].likedCount + 1)
          console.log(this.comments[index].liked,"点赞");
        } 
      }else {
        let result =  await this.$API.reqCommentLike({id,cid,t:0,type,timestamp})
        if(result.code == 200) {
          this.$set(this.comments[index],'liked',false)
          this.$set(this.comments[index],'likedCount',this.comments[index].likedCount -1)
          console.log(this.comments[index].liked,"取消点赞");
        } 
      }
    },
    // 发布/回复评论
    async publishComment() {
      // 拿到input输入的值发请求
      if(!this.$store.state.user.userId) {
        this.$message.warning('请登录后再发表评论!')
        return
      }
      // 判断评论是否为空
      if(this.userComment == '') {
        this.$message.warning('请输入文字后再回复哦!')
        return
      }

      let type;
      switch (this.commentType) {
        case 'musicList':
          type = 2
          break;
        case 'musicDetailCard':
          type = 0
        break;  
      }

      // /comment?t=1&type=1&id=5436712&content=test
      let result = await this.$API.reqPublishComment({id:this.resourceId,t:1,type,content:this.userComment})
       
      if(result.code == 200) {
        // console.log(result);
        this.userComment = ''
        this.$message.success('评论成功')
        this.closeDialog()
        this.$nextTick(()=>{
          this.$emit('getComments')
        })
      }
    },
    // 楼层回复
    floorComment(cid,nickName){
      console.log(cid,nickName);
      // 最新评论没有评论框,需要转交给hotComment处理
      if(this.ishotComments == false) {
        this.$emit('transToHotComment',{cid,nickName})
      }
      /*  
      先跳转至输入框,预先输入@nikeName,并获得焦点,
      待用户输入内容后点击评论按钮发送请求回复评论,重新获取comments数据
      */
      // 要判断下评论类型,如果是歌曲评论的话不用滚动
      if(this.commentType !==  'musicDetailCard'){
        // this.isDialogShow = true
        this.$emit('scrollToPublishComment')
        let input = document.querySelector('.commentArea')
        input.children[0].focus({ preventScroll: true })
        // return
      }else {
        this.openDialog()
      }
      // this.$emit('scrollToPublishComment')
      
      // console.dir(input);
      // preventScroll 表示只聚焦不滚动 反之不阻止聚焦滚动
      this.userComment = '@' + nickName + ' : '

      this.floorCommentInputLength = this.userComment.length
      // 临时保存cid
      this.floorCommentId = cid
      // 是否是楼层回复
      this.isfloorComment = true
    },
    async publishFloorComment() {
      // 拿到input输入的值发请求
      if(!this.$store.state.user.userId) {
        this.$message.warning('请登录后再发表评论!')
        return
      }
      // 判断评论是否为空
      if(this.userComment == this.floorCommentInputLength) {
        this.$message.warning('请输入文字后再回复哦!')
        return
      }

      let type;
      switch (this.commentType) {
        case 'musicList':
          type = 2
          break;
        case 'musicDetailCard':
          type = 0
        break;
      }
      let content = this.userComment.split(':')[1]
      // /comment?t=1&type=1&id=5436712&content=test
      let result = await this.$API.reqPublishComment({id:this.resourceId,t:2,type,content,commentId:this.floorCommentId})
       
      if(result.code == 200) {
        console.log(result);
        this.userComment = ''
        this.$message.success('回复成功')
        this.closeDialog()
        this.$nextTick(()=>{
          this.$emit('getComments')
        })
      }
    },
    // 删除评论
     deleteComment(cid) {
      this.$confirm('确定删除该评论?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(async() => {
        console.log(cid);
        let type;
        switch (this.commentType) {
          case 'musicList':
            type = 2
            break;
        }

        let result = await this.$API.reqPublishComment({id:this.resourceId,t:0,type,commentId:cid})
       
        if(result.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.$nextTick(()=>{
            this.$emit('getComments')
          })
        }
        
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        });          
      });
    },
    enteritem(item) {
      // console.log('鼠标进入');
      if(item.user.userId  == this.$store.state.user.userId) {
        
        console.log('鼠标进入本体');
        // this.showDelete = true
        // item.showDelete = true
        this.$set(item,'showDelete',true)
      }
      // this.$set(item,'showDelete',false)
    },
    leaveItem(item) {
      this.$set(item,'showDelete',false)
    }
  },
  watch:{
    comments() {
      this.userComment = ''
      this.isfloorComment = false
      this.floorCommentId = ''

    }
  },
  filters:{
    handleCommentTime
  },
  beforeDestroy() {
    this.$bus.$off('openDialog')
  }
}
</script>

<style lang="less" scoped>

  .publishComment {
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translate(-50%,0);
    width: 150px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 200px;
    color: #2d2d2d;
    background-color: #f1f1f1;
    cursor: pointer;
    &:hover {
      background-color: #e1e1e1;
    }
  }

  .commentContainer {
    overflow-x: hidden;
    overflow-y: auto;
  } 
  // .publishComments {
  //   .commentsButtons {
  //     display: flex;
  //     justify-content: space-between;
  //     margin-top: 15px;
  //     .left {
  //       .iconfont {
  //         margin-right: 10px;
  //         color: #666666;
  //         &:hover {
  //           color: #333333;
  //         }
  //       }
  //     }
  //     .commentsButton {
  //       width: 60px;
  //       height: 30px;
  //       text-align: center;
  //       line-height: 30px;
  //       background-color: #fff;
  //       border: 1px solid #d8d8d8;
  //       border-radius: 15px;
  //       font-size: 14px;
  //       cursor: pointer;
  //       &:hover {
  //         background-color: #f2f2f2;
  //       }
  //     }
  //   }
  // }

  .commentsButtons {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
      .left {
        .iconfont {
          margin-right: 10px;
          color: #666666;
          &:hover {
            color: #333333;
          }
        }
      }
      .commentsButton {
        width: 60px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        background-color: #fff;
        border: 1px solid #d8d8d8;
        border-radius: 15px;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          background-color: #f2f2f2;
        }
      }
    }

  .commentsHeader {
    margin: 30px  0 20px 0;
    font-weight: 600;
    font-size: 14px;
  }

  .commentItem {
    display: flex;
    justify-content: flex-start;
    border-bottom: 1px solid #f2f2f2;
    padding-top:15px ;
    &:nth-child(50n + 1) {
      border: none;
    }
    .commentCreator {
      width: 40px;
      height: 40px;
      margin: 0 10px 0 0 ;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        image-rendering: -moz-crisp-edges; /* Firefox */     
        image-rendering: -o-crisp-edges; /* Opera */      
        image-rendering: -webkit-optimize-contrast; /*Webkit (non-standard naming) */ image-rendering: crisp-edges; 
        -ms-interpolation-mode: nearest-neighbor; /* IE (non-standard property) */
      }
    }
    .commentMain {
      width: calc(100% - 50px);
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 18px;
      .commentContent {
        .nickName {
          color: #0b58b0;
          cursor: pointer;
        }
        .content {
          color: #373737;
        }
      }

      .replied {
        margin-top: 10px;
        padding: 10px;
        background-color: #f4f4f4;
        .nickName {
          color: #0b58b0;
          cursor: pointer;
        }
        .content {
          color: #636363;
        }
      }
      .commentBottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0 15px 0;
        .commentTime {
          // padding: 5px 0;
          color: #9f9f9f;
          font-weight: 400;
          font-size: 12px;
        }
        .buttons {
          display: flex;
          
          div {
            margin-right: 15px;
            .iconfont {
              cursor: pointer;
            }
            .icon-dianzan {
              color: #ff3a3a;
            }
            span {
              padding-left: 5px;
              color: #676767;
            }
          }
          .like {
            display: flex;
            .likeIcon {
              margin-right: 0px;
            }
          }
        }
      }
    }
  }


  ::v-deep .el-textarea__inner:focus {
    border-color: #666666;
  }

  ::v-deep .el-button--text {
    color: #333;
    font-size: 12px;
  }

  ::v-deep .el-button {
    padding:0;
  }
  ::v-deep .el-button:hover {
    text-decoration:underline;
  }
</style>
