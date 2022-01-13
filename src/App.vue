<template>
  <div id="app">
    <HeaderBar></HeaderBar>
    <!-- 一级路由显示 -->
    <router-view></router-view>
    <ButtomControl></ButtomControl>
  </div>
</template>

<script>
import HeaderBar from './components/HeaderBar'
import ButtomControl from './components/ButtomControl'

export default {
  name: 'App',
  components: {
    HeaderBar,
    ButtomControl
  }
}
</script>

<style>

</style>
