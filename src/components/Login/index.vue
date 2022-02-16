<template>
  <el-dialog 
    :visible.sync="isDialogShow" 
    :modal="false" 
    :before-close="closeLoginDialog"  
    width="500px" >
    <div class="loginTitle">登录</div>

    <el-form :model="userForm">
      <el-form-item>
        <el-input
          type="text"
          v-model="userForm.phone"
          autocomplete="off"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          type="password"
          v-model="userForm.password"
          autocomplete="off"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="loginButton">
      <div class="loginClick" @click="login">登录</div>
      <div class="registerClick">注册</div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "Login",
  props: {
    isDialogShow: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      userForm: {
        phone: "",
        password: "",
      },
    };
  },
  methods:{
    //   点击登录按钮发送请求
    async login(){

      try {
        await this.$store.dispatch("user/userLogin",this.userForm)

        // 修改登录状态为true
        this.$store.dispatch('user/updataLoginState',true)


        this.$emit("getUserInfo", this.$store.state.user.userInfo);


        this.$message({
            message:'登录成功',
            type:'success'
        })
        this.userForm.phone = ''
        this.userForm.password = ''
        // 不能直接修改isDialogShow的值,需要调用父组件的方法去关闭dialog
        this.$emit('closeLoginDialog')
      } catch (error) {

        this.$message.error('登录失败' + error)
      }
    },
    closeLoginDialog() {

      this.userForm.phone = ''
      this.userForm.password = ''

      this.$emit('closeLoginDialog')
    }
  }
};
</script>

<style lang="less" scoped>
.loginTitle {
  text-align: center;
  font-size: 20px;
  font-weight: 800;
  padding: 0 0 20px 0;
}
.loginButton {
  display: flex;
  flex-direction: column;
  align-items: center;
  .loginClick {
    width: 80px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    background: #333;
    color: white;
    border-radius: 5px;
    font-size: 12px;
    cursor: pointer;
  }
  .registerClick {
    text-align: center;
    margin-top: 20px;
    font-size: 12px;
    color: #333;
    text-decoration:underline;
    cursor: pointer;
  }
}


::v-deep .el-input__inner {
    background-color: #FFF ;
    border: 1px solid #DCDFE6;
    color: #606266 ;
    border-radius: 4px;
}
</style>
