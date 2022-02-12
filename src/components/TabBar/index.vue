<template>
  <div class="tabBarContainer">
    <div class="tabBar">
      <div
        class="tabBarItem"
        :class="index == tabBarNum ? 'active' : ''"
        v-for="(item,index) in tabBarList" :key="index"
        @click="handleTabBarItem(index,item.path)"
        >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  props:{
    tabBarList:{
      type: Array,
    }
  },
  data(){
    return {
      // 当前显示样式的项
      tabBarNum:'0'
    }
  },
  created(){
    // 组件实例创建完成,完成数据代理,可以发送首屏请求
    // 通过path修改当前选择的tab选项
    // console.log(this.$route.path);
    // console.log(decodeURI(this.$route.path));
    // this.tabBarList.forEach((item,index) => {
    //   if(decodeURI(this.$route.path).search(item.path) !== -1) {
    //     this.tabBarNum = index
    //   }
    // })
  },
  methods:{
    handleTabBarItem(index,path){
      // 点击后将index存起来,并切换路由显示
      if(this.tabBarNum == index) {
        return
      }
      this.tabBarNum = index
      this.$emit('handleTabBarItem',path)
    }
  }
}
</script>

<style lang="less" scoped>
  .tabBarContainer{
    z-index: 2;
  } 
  .tabBar {
    display: flex;
    margin-left: 10px;
  }
  .tabBarItem {
    margin: 20px 0 20px 20px ;
    cursor: pointer;
    font-size: 15px;
  }
  .active {
    position: relative;
    font-size:17px ;
    font-weight: 600;
    transform: translateY(-3px);
    // padding-bottom:5px ;
    // border-bottom: 3px solid black;
  }
  .active::before {
    content: '';
    position: absolute;
    bottom: -30px;
    top: 0;
    right: 0;
    left: 0px;
    width: 80%;
    height: 3px;
    margin: auto;
    background-color: rgb(60,57,70);
  }
</style>
