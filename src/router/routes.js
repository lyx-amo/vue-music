
const disCoverMusic = () => import('@/views/disCoverMusic')
const favorites = () => import('@/views/favorites')
const recommendMusic = () => import('@/views/recommendMusic')
const video = () => import('@/views/video')
const videoDetail = () => import('@/views/videoDetail')



export default [
    //发现音乐
    {
        path:'/',
        component: disCoverMusic
    },
    //收藏
    { 
        path:'/favorites', 
        component: favorites
    },
    //每日推荐
    {
        path:'/recommendMusic',  
        component: recommendMusic
    },
    //视频
    {
        path:'/video', 
        component: video
    },
    //视频详情
    { 
        path:'/videoDetail', 
        component: videoDetail
    },
]