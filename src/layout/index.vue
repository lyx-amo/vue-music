<template>
    <el-container>
        <el-header>
            <HeaderBar></HeaderBar>
        </el-header>
        <el-container>
            <!-- 侧边栏 -->
            <el-aside width="160px">
                <el-menu router default-active="/disCoverMusic" active-text-color="black">
                    <el-menu-item index="/disCoverMusic">
                        <!-- <i class="el-icon-circle-plus"></i> -->
                        发现音乐
                    </el-menu-item>
                    <el-menu-item index="/favorites">
                        <!-- <i class="el-icon-circle-plus"></i> -->
                        收藏
                    </el-menu-item>
                    <el-menu-item index="/video">
                        <!-- <i class="el-icon-circle-plus"></i> -->
                        视频
                    </el-menu-item>
                    <el-menu-item index="/recommendMusic">
                        <!-- <i class="el-icon-circle-plus"></i> -->
                        每日推荐
                    </el-menu-item>
                </el-menu>
            </el-aside >
            <el-main>
                <router-view></router-view>
            </el-main>
                <ButtomControl></ButtomControl>
        </el-container>
    </el-container>
</template>

<script>
import HeaderBar from '../components/HeaderBar'
import ButtomControl from '../components/ButtomControl'
export default {
  name: 'Layout',
  components: {
    HeaderBar,
    ButtomControl
  }
}
</script>

<style lang="less" scoped>
    .is-active {
        background-color: #f2f2f2;
        font-size: 15px;
        font-weight: 600;
    }
    
</style>
