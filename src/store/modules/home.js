import {
    reqHotList,
} from "@/api"


const state = {
    // 热搜列表数据
    hotList : []
}
const mutations = {
    RECEIVE_HOT_LIST(state,hotList) {
        state.hotList = hotList
    }
}
const actions = {
    async getHotList({commit}){
        const result = await reqHotList()
        if(result.code === 200) {
            const hotList = result.data
            commit('RECEIVE_HOT_LIST',hotList)
        }
    }
}
const getters = {}


export default {
    state,
    mutations,
    actions,
    getters
}