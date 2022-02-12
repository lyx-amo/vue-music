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
export const reqRecommendSongList = () => request.get('/personalized?limit=10')

// 获取歌单详情
export const reqSongListDetail = (id) => request.get(`/playlist/detail?id=${id}`)


// 通过id获取音乐url
export const reqMusicUrl = (id) => request.get(`/song/url?id=${id}`)

