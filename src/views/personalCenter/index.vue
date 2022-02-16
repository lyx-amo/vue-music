<template>
  <div class="personalCenterContainer">
    
    <div class="logout" @click="logout">退出登录</div>
  </div>
</template>

<script>
import {removeUserId} from '@/utils/userAbout'
export default {
  name: '',
  data(){
    return {

    }
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
        }
    } 
  }
}
</script>

<style lang="less" scoped>
    .logout {
        text-align: center;
        line-height: 80px;
        cursor: pointer;
    }
</style>
