<template>
  <div class="headerBar">
      <div id="logo">
        <!-- <img  src="@/assets/img/logo.png" alt="网易云音乐"> -->
      </div>
      <div class="center">
        <div class="button">
          <i class="iconfont icon-shangyiye"></i>
          <i class="iconfont icon-xiayiye"></i>
        </div>
      </div>
      <div class="right">

      </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderBar',
}
</script>

<style lang="less" scoped>
  .headerBar {
    width: 100%;
    height: 50px;
    background-color: rgb(60,57,70);
    // logo
    #logo {
      float: left;
      width: 176px;
      height: 50px;
      // background-position: 0 -20px;
      background: url('../../assets/img/topbar.png') 15px -10px no-repeat;
    }

    .center {
      .button{
        color: white;
      }
    }
  }
</style>
