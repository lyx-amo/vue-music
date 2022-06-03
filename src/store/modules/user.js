import { setUserId, getUserId } from '@/utils/userAbout'
import { reqUserLogin,reqUserDetail ,reqSubcount} from '@/api'
import {Message} from "element-ui";
const state = {
    //    token:'',
    userId: getUserId(),
    userInfo:{},
    // 用户详情信息
    userDetail:{},
    // 是否登录
    isLogin:false,
    // 用户喜欢音乐列表
    likeMusicList:null,
    // 获取用户信息 , 歌单，收藏，mv, dj 数量
    subcount:null,
    // 用户收藏歌单
    collectSonglist:[],
    // 用户创建歌单
    userCreateList:[],
    isCollect:''
}
const mutations = {
    RECEIVE_TOKEN(state, token) {
        state.token = token
    },
    RECEIVE_USERID(state, userId) {
        state.userId = userId
    },
    RECEIVE_USERDETAIL(state, userDetail) {
        state.userDetail = userDetail
    },
    updataLoginState(state, isLogin = false) {
        state.isLogin = isLogin
    },
    updateUserInfo(state,userInfo) {
        state.userInfo = userInfo 
    },
    RECEIVE_LIKELIST(state,likeList) {
        state.likeMusicList = likeList 
    },
    RECEIVE_SUBCOUNT(state,subcount) {
        state.subcount = subcount
    },
    // 更新用户收藏歌单
    updateCollectSonglist(state,collectSonglist) {
        state.collectSonglist = collectSonglist
    },
    // 更新用户所有歌单
    updateUserSongList(state,{userCreateList,collectSonglist}) {
        state.userCreateList = userCreateList
        state.collectSonglist = collectSonglist
    },
    updateCollect(state,isCollect) {
        state.isCollect = isCollect
    }
}
const actions = {
    // 获取用户登录id
    async userLogin({ commit }, userForm) {
        let timestamp = Date.now()
        let result = await reqUserLogin(userForm,timestamp)
        if (result.code === 200) {
            // commit('RECEIVE_TOKEN',result.token)
            // 获取用户id
            commit('RECEIVE_USERID', result.profile.userId)

            commit('updateUserInfo', result.profile)

            
            // 将userId保存到localstorage
            setUserId(result.profile.userId)

            commit('updataLoginState',true)
            
            return 'ok'
        }else if (result.code == 400) {
            // 手机号错误
            Message.error("手机号错误!");
            return;
        } else if (result.code == 502) {
            // 密码错误
            Message.error("密码错误!");
            return;
        }else if (result.code == 509) {
            // 密码错误
            Message.error("密码错误超过限制!");
            return;
        }else {
            // 登录失败，请稍后重试
            Message.error("登录失败，请稍后重试!");
            return;
        }
    },
    // 获取用户详情
    async getUserDetail({commit},id) {
        let result = await reqUserDetail(id)
        if(result.code === 200) {
            commit('RECEIVE_USERDETAIL',result)
        }
    },
    // 改变登录状态
    updataLoginState({commit},isLogin) {
        commit('updataLoginState',isLogin)
    },
    // async getLikeMusicList({commit}) {
      
    //     let result = await reqLikeMusicList(state.userId)
        
    //     if(result === 200) {
    //         // 拿到的是喜欢音乐id的数组
    //         commit('RECEIVE_LIKELIST',result.ids)
    //         return 'ok'
    //     }else {
    //         return Promise.reject(new Error('failed'))
    //     }

    // },
    // 获取用户信息 , 歌单，收藏，mv, dj 数量
    async getSubcount({commit}) {
        const result = await reqSubcount()
        if(result.code === 200) {
            console.log(result);
            commit('RECEIVE_SUBCOUNT',result)
        }
    }
}
const getters = {

}


export default {
    namespaced: true,// 命名空间
    state,
    mutations,
    actions,
    getters
}