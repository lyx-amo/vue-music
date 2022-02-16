import { setUserId, getUserId } from '@/utils/userAbout'
import { reqUserLogin,reqUserDetail } from '@/api'
import {Message} from "element-ui";
const state = {
    //    token:'',
    userId: getUserId(),
    userInfo:{},
    // 用户详情信息
    userDetail:{},
    // 是否登录
    isLogin:false
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
    }
   
}
const actions = {
    // 获取用户登录id
    async userLogin({ commit }, userForm) {
        let result = await reqUserLogin(userForm)
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