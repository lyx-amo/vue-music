import {
    reqBanner,
    reqRecommendSongList,
    reqSongListDetail,
    reqUserRecommendSongList
} from '@/api'
import store from '..'

const state = {
    banners : [],
    recommendSongList:[],
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
        if(store.state.user.userId) {
            let timestamp = Date.now()
            const result = await reqUserRecommendSongList()
            const result1 = await reqRecommendSongList(timestamp)
            if(result.code === 200) {
                // const recommendSongList = result.recommend.slice(0,10)
                // 避免推荐的歌单不够十条,拼接一下
                const recommendSongList = result.recommend.concat(result1.result).slice(0,10)
                commit('RECEIVE_RECOMMENDSONGLIST',recommendSongList)
            }        
        }else {
            let timestamp = Date.now()
            const result = await reqRecommendSongList(timestamp)
            if(result.code === 200) {
                const recommendSongList = result.result
                commit('RECEIVE_RECOMMENDSONGLIST',recommendSongList)
            }
        }
        

    },
    // 获取歌单详情
    async getSongListDetail({commit},id) {
        let timestamp = Date.now()
        const result = await reqSongListDetail(id,timestamp)
        if(result.code === 200) {
            let songListDetail = result.playlist
            commit('RECEIVE_SONGLISTDETAIL',songListDetail)
            return 'ok'
        }else {
            return Promise.reject(new Error('failed,歌单详情获取失败'))
        }
    }
    
}
const getters = {
    
}

export default {
    namespaced:true,
    state,
    mutations,
    actions,
    getters
}
