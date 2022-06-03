<template>
  <div class="lyricContainer">
    <div class="placeholder"></div>

    <div class="lyricItem" v-for="(item,index) in lyric" :key="index" :class="lyricIndex -1 == index? 'currentLyric' : '' " > 
        {{item[1]}}
    </div>
    
    <div class="placeholder"></div>
  </div>
</template>

<script>
let placeholder = 0
export default {
  name: 'Lyric',
  props:{
    lyric:{
      type:Array,
      default(){
        return []
      }
    }
  },
  data(){
    return{
      lyricIndex:0
    }
  },
  methods:{
    lyricScroll(lyricIndex) {
      let lyricItems = document.querySelectorAll('.lyricItem')
      let lyricContainer = document.querySelector('.lyricContainer')

      if(placeholder == 0) {
        placeholder = lyricItems[0].offsetTop - lyricContainer.offsetTop
      }

      // 改变歌词容器的top属性实现滚动歌词
      if(lyricItems[lyricIndex -1]) {
        let distance =  lyricItems[lyricIndex -1].offsetTop - lyricContainer.offsetTop

        lyricContainer.scrollTo({
          top:distance - placeholder,
          behavior:'smooth'
        })
      }
    },
    // 通过当前歌曲时间获取当前歌词的index
    getLyricIndex(currentTime) {

      let lyricIndex = 0
      this.lyric.some(item => {
        // 当前音乐时长大于当前歌词的时长将lyricIndex + 1
        if(this.lyricIndex < this.lyric.length) {
          if(currentTime >= item[0]) {
            lyricIndex += 1
          } 
          return currentTime <= item[0];
        }
      })

      // console.log(lyricIndex,this.lyric.length);
      this.lyricIndex = lyricIndex 

    }
  },
  watch:{
    '$store.state.playMusic.currentTime' (currentTime,lastTime) {
      // 当旧时间大于当前的时间超过1s 表示拖动了进度条,需要更新当前歌词的index及位置 
      // 或者当前歌词的index== 0 的时候歌曲
      if((lastTime &&  Math.abs(lastTime - currentTime) >= 1) || (this.lyricIndex == 0 && this.lyric.length > 1)) {

        if(this.lyric.length > 1) {
          this.getLyricIndex(currentTime)
          this.lyricScroll(this.lyricIndex)
        }
      }

      // 根据实时音乐时间实现实时滚动
      if(this.lyricIndex < this.lyric.length) {
        if(currentTime >= this.lyric[this.lyricIndex][0]) {
          this.lyricIndex += 1
          this.lyricScroll(this.lyricIndex)
        }
      }
    },
    //歌曲发生变化初始化歌词的index
    '$store.state.palyMusic.musicId'() {
      this.lyricIndex = 0
    },
    // 
    lyric(current) {
      // 歌词可能延迟获取,当前时间变化需要校准歌词位置
      if(this.$store.state.playMusic.currentTime > 1) { 
        if(this.lyric.length > 1) {
          this.getLyricIndex(this.$store.state.playMusic.currentTime)
          // 数据更新后使用nextTick立刻获取更新后的数据
          this.$nextTick(()=> {
            this.lyricScroll(this.lyricIndex)
          })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
    .lyricContainer{
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
        // background-color: #f1efef;
        .placeholder {
          width:100%;
          height: 40%;
        }
        .lyricItem{
            // width: 40px;
            height: 40px;
            text-align: center;
            font-size: 14px;
            color: #656565;
            line-height: 40px;
        }
        .currentLyric {
            font-size: 16px;
            font-weight: 700;
            color: #000;
        }
    }
</style>
