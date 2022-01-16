// 接口请求函数
import ajax from './ajax'
// 热搜列表(详细)接口地址 : /search/hot/detail

export const reqHotList = () => ajax.get('/search/hot/detail')
// export function reqHotList() {
//     return ajax.get('/search/hot/detail')
// }
