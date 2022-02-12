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
    // 音乐播放列表
    playList: null,
    // 音乐播放状态
    isPlay: false,
    // 实时播放时长
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
        // if (payload.songListId != state.songListId) {
            state.songListId = payload.songListId;
        //     state.currentMusicIndex = -1;
        // }
        // let songList = songListInfo.songList.slice(0)
        state.songList = payload.songList
    },
    // 当前播放音乐的索引
    updateCurrentIndex(state, index) {
        // console.log('updateCurrentIndex');
        state.currentMusicIndex = index;
        // console.log(state.currentMusicIndex);
    },    
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