// 接口请求函数
import request from '@/utils/request'


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
export const reqRecommendSongList = (timestamp) => request.get(`/personalized?limit=10&timestamp=${timestamp}`)


// 登录后推荐歌单 /recommend/resource
export const reqUserRecommendSongList = () => request.get('/recommend/resource')

// 登录后每日推荐歌曲   recommend/songs
export const reqUserRecommendMusic = () => request.get('/recommend/songs')

// 获取歌单详情
export const reqSongListDetail = (id,timestamp) => request.get(`/playlist/detail?id=${id}&timestamp=${timestamp}`)

// 收藏歌单 /playlist/subscribe
export const reqCollectSonglist = ({t,id,timestamp}) => request.get(`/playlist/subscribe?t=${t}&id=${id}&timestamp=${timestamp}`)

// 通过id获取音乐url &timestamp=${timestamp}
export const reqMusicUrl = (id) => request.get(`/song/url?id=${id}`)


// 获取更多音乐详情
export const reqMoreMusicDetail = (ids) => request.get(`/song/detail?ids=${ids}`)

// 登录获取用户id
export const reqUserLogin = (userForm,timestamp) => {
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
export const reqUserInfo = (timestamp) => request.get(`/user/account?timestamp=${timestamp}`)


// 获取用户详情信息
export const reqUserDetail = (id) => request.get(`/user/detail?uid=${id}`)

// 获取用户信息 , 歌单，收藏，mv, dj 数量 /user/subcount
export const reqSubcount = () => request.get(`/user/subcount`)

//获取用户歌单 /user/playlist?uid=32953014  creator.userId == 当前userId 那么就是创建的歌单
export const reqUserSonglist = ({uid,timestamp}) => request.get(`/user/playlist?uid=${uid}&timestamp=${timestamp}`)

// 退出登录
export const reqLogout = () => request.get(`/logout`)


// 喜欢音乐列表
export const reqLikeMusicList = (uid,timestamp) => request.get(`/likelist?uid=${uid}&timestamp=${timestamp}`)


// 喜欢该音乐
export const reqLikeMusic = (id,like,timestamp) => request.get(`/like?id=${id}&like=${like}&timestamp=${timestamp}`)


// 歌单评论
export const reqMusicListComments = ({id,limit,offset,timestamp}) => request({
    url:'/comment/playlist',
    method:'GET',
    params:{
        id,
        limit,
        offset,
        timestamp
    }
})

// 评论点赞
export const reqCommentLike = ({id,cid,t,type,threadId,timestamp}) => request({
    url:'/comment/like',
    method:'GET',
    params:{
        id,
        cid,
        t,
        type,
        threadId,
        timestamp
    }
})

// 发表评论 /comment?t=1&type=1&id=5436712&content=test
export const reqPublishComment = ({id,cid,t,type,content,commentId,threadId}) => request({
    url:'/comment',
    method:'GET',
    params:{
        id,
        cid,
        t,
        type,
        content,
        commentId,
        threadId,
    }
})



// 歌单收藏者 /playlist/subscribers?id=544215255&limit=30
export const reqSubscribers = ({id,offset,limit}) => request.get(`/playlist/subscribers?id=${id}&limit=${limit}&offset=${offset}`)




// 歌单

// /playlist/catlist 歌单分类标签 有category分类
export const reqCatlist = () => request.get(`/playlist/catlist`)

// /playlist/hot 热门歌单分类
export const reqHotSonglist_Category = () => request.get(`/playlist/hot`)

// /top/playlist?cat=华语&limit=100&offset=0 热门歌单列表
export const reqHotSonglist = ({cat,limit,offset}) => request.get(`/top/playlist?cat=${cat}&limit=${limit}&offset=${offset}`)

// /playlist/highquality/tags 精品歌单标签列表
export const reqHighquality_tags = () => request.get(`/playlist/highquality/tags`)

// /top/playlist/highquality 精品歌单 
/* 
cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从精品歌单标签列表接口获取(/playlist/highquality/tags)
limit: 取出歌单数量 , 默认为 20
before: 分页参数,取上一页最后一个歌单的 updateTime 获取下一页数据
cat="华语"&limit=72
*/
export const reqHighquality_list = ({tag}) => request.get(`/top/playlist/highquality?cat=${tag}&limit=73`)


// 歌曲卡片
// 歌词 /lyric?id=33894312
export const reqLyric = (id) => request.get(`/lyric?id=${id}`)

// 单曲评论 /comment/music?id=186016&limit=1
export const reqMusicComments = ({id,limit,timestamp}) => request.get(`/comment/music?id=${id}&limit=${limit}&timestamp=${timestamp}`)

