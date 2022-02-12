import {
    reqHotList,
    reqSuggestList
} from "@/api"


const state = {
    // 热搜列表数据
    hotList : [],
    // 搜索建议列表
    suggestList:[]
}
const mutations = {
    RECEIVE_HOT_LIST(state,hotList) {
        state.hotList = hotList
    },
    RECEIVE_SUGGEST_LIST(state,suggestList) {
        state.suggestList = suggestList
    }
}
const actions = {
    async getHotList({commit}){
        const result = await reqHotList()
        if(result.code === 200) {
            const hotList = result.data
            commit('RECEIVE_HOT_LIST',hotList)
        }
    },
    async getSuggestList({commit},keywords) {
        const result = await reqSuggestList(keywords)
        if(result.code === 200) {
            commit('RECEIVE_SUGGEST_LIST',result.result)
        }
    }
}
const getters = {
    // 单曲
    songs() {
        return state.suggestList.songs || []
    },
    // 歌手
    artists() {
        return state.suggestList.artists || []
    },
    // 专辑
    albums() {
        return state.suggestList.albums || []
    }
}


export default {
    namespaced:true,// 命名空间
    state,
    mutations,
    actions,
    getters
}