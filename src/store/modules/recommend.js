import {
    reqBanner,
    reqRecommendSongList,
    reqSongListDetail
} from '@/api'

const state = {
    banners : [],
    recommendSongList:{},
    songListDetail:{}
}
const mutations = {
    RECEIVE_BANNERS (state,banners) {
        state.banners = banners
    },
    RECEIVE_RECOMMENDSONGLIST(state,recommendSongList) {
        state.recommendSongList = recommendSongList
    },
    RECEIVE_SONGLISTDETAIL(state,data) {
        state.songListDetail = data
    }
}
const actions = {
    // 获取轮播图
    async getBannerList({commit}) {
        const result = await reqBanner()
        if(result.code === 200) {
            commit('RECEIVE_BANNERS',result.banners)
        }
    },
    // 获取歌单列表
    async getRecommendSongList({commit}) {
        const result = await reqRecommendSongList()
        if(result.code === 200) {
            
            const recommendSongList = {
                // 是否为偏好歌单,需要登录
                hasTaste:result.hasTaste,
                songList:result.result
            }
            commit('RECEIVE_RECOMMENDSONGLIST',recommendSongList)
        }
    },
    // 获取歌单详情
    async getSongListDetail({commit},id) {
        const result = await reqSongListDetail(id)
        if(result.code === 200) {
            let songListDetail = result.playlist
            commit('RECEIVE_SONGLISTDETAIL',songListDetail)
        }
    }
    
}
const getters = {
    // 推荐的歌单
    songList(state) {
        return state.recommendSongList.songList || []
    },
    hasTaste(state) {
        return state.recommendSongList.hasTaste || ''
    },
    
}

export default {
    namespaced:true,
    state,
    mutations,
    actions,
    getters
}
