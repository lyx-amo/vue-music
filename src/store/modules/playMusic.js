// import { reqMusicUrl } from '@/api'
const state = {
    musicId:'',
    // 通过音乐id获取url
    musicUrl: '',
    // 当前播放音乐的索引
    currentMusicIndex: -1,
    // 歌单id
    songListId:'',
    // 歌单
    songList:[],
    // 当前歌曲详情
    currentMusicDetail:{},
    // 当前歌曲是否在加载中
    musicload:false,
    // 歌曲详情卡片打开状态
    isMusicDetailCardShow:false,
    // 音乐播放列表
    playList: null,
    // 音乐播放状态
    isPlay: false,
    // 当前实时播放时长
    currentTime:0
}
const mutations = {
    // 更新音乐播放状态
    CHANGEPLAYSTATE(state, isPlay) {
        state.isPlay = isPlay
    },
    updateMusicId(state,musicId){
        state.musicId = musicId
    },
    //更新当前音乐播放进度 s
    updateCurrentTime(state,currentTime) {
        state.currentTime = currentTime
    },
    updateSongList(state,payload){
        if (payload.songListId != state.songListId) {
            state.songListId = payload.songListId;
            state.currentMusicIndex = -1;
        }
        let songList = payload.songList.slice(0)
        state.songList = songList
    },
    // 当前播放音乐的索引
    updateCurrentIndex(state, index) {
        // console.log('updateCurrentIndex');
        state.currentMusicIndex = index;
        // console.log(state.currentMusicIndex);
    },
    // 改变歌曲详情卡片状态 
    changeMusicDetailCardState(state) {
        state.isMusicDetailCardShow = !state.isMusicDetailCardShow
    },
    // 更新当前歌曲详情信息
    updateCurrentMusicDetail(state,currentMusicDetail){
        state.currentMusicDetail = currentMusicDetail
    },
    // 当前歌曲是否在加载中
    updateMusicload(state,load) {
        state.musicload = load
    }
}
const actions = {
    // 改变播放状态
    changePlayState({ commit }, state) {
        commit('CHANGEPLAYSTATE', state)
    }
}
const getters = {

}


export default {
    namespaced:true,// 命名空间
    state,
    mutations,
    actions,
    getters
}