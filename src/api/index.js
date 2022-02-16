// 接口请求函数
import request from '@/utils/request'

let timestamp = Date.now()

// 热搜列表(详细)接口地址 : /search/hot/detail

export const reqHotList = () => request.get('/search/hot/detail')

// 搜索建议列表 调用例子 : /search/suggest?keywords= 海阔天空

export const reqSuggestList = (keywords) => {
    return request({
        url:`/search/suggest?keywords=${keywords}`
    })
}

// 轮播图
export const reqBanner = () => request.get('/banner')

// 个性推荐中的推荐歌单
export const reqRecommendSongList = () => request.get(`/personalized?limit=10&timestamp=${timestamp}`)

// 获取歌单详情
export const reqSongListDetail = (id) => request.get(`/playlist/detail?id=${id}`)


// 通过id获取音乐url
export const reqMusicUrl = (id) => request.get(`/song/url?id=${id}`)


// 获取更多音乐详情
export const reqMoreMusicDetail = (ids) => request.get(`/song/detail?ids=${ids}`)

// 登录获取用户id
export const reqUserLogin = (userForm) => {
    return request({
        url:`/login/cellphone?timestamp=${timestamp}`,
        method:'post',
        withCredentials:true,
        data:{
            phone:userForm.phone,
            password:userForm.password,
        }
    })
}

// 登录后获取账号信息
// export const reqUserInfo = () => request.get(`/user/account?timestamp=${timestamp}`)
export const reqUserInfo = () => request.get(`/user/account?timestamp=${timestamp}`)


// 获取用户详情信息
export const reqUserDetail = (id) => request.get(`/user/detail?uid=${id}`)

// 退出登录
export const reqLogout = () => request.get(`/logout`)
