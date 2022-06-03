
const layout = () => import('@/layout')
const disCoverMusic = () => import('@/views/disCoverMusic')
const favorites = () => import('@/views/favorites')
const recommendMusic = () => import('@/views/recommendMusic')
const video = () => import('@/views/video')
const videoDetail = () => import('@/views/videoDetail')

const rankingList = () => import('@/views/disCoverMusic/components/rankingList')
const recommend = () => import('@/views/disCoverMusic/components/recommend')
const singer = () => import('@/views/disCoverMusic/components/singer')
const songList = () => import('@/views/disCoverMusic/components/songList')
const highqualityList = ()=> import('@/views/disCoverMusic/components/songList/highqualityList')
const categorySongList = ()=> import('@/views/disCoverMusic/components/songList/categorySongList')



const songListDetail = ()=> import('@/views/songListDetail')


const personalCenter = ()=> import('@/views/personalCenter')




export default [
    // 框架
    {
        path:'/',
        redirect:'/layout'
    },
    {
        path:'/layout',
        name:'Layout',
        redirect:'/disCoverMusic', //初始跳转至发现音乐
        component:layout,
        children:[
            //发现音乐
            {
                path:'/disCoverMusic',
                // name:'disCoverMusic',
                component: disCoverMusic,
                redirect:'/disCoverMusic/recommend',
                children:[
                    {
                        path:'recommend',
                        name:'recommend',
                        component:recommend
                    },
                    {
                        path:'songList',
                        name:'songList',
                        component:songList,
                        redirect:'/disCoverMusic/songList/categorySongList',
                        children:[
                            {
                                path:'highqualityList',
                                name:'highqualityList',
                                component:highqualityList,
                            },
                            {
                                path:'categorySongList',
                                name:'categorySongList',
                                component:categorySongList,
                            }
                        ]
                    },
                    {
                        path:'rankingList',
                        name:'rankingList',
                        component:rankingList
                    },
                    {
                        path:'singer',
                        name:'singer',
                        component:singer
                    }
                ]
            },
            //收藏
            { 
                path:'/favorites', 
                name:'favorites',
                component: favorites
            },
            //每日推荐
            {
                path:'/recommendMusic',
                name:'recommendMusic',  
                component: recommendMusic
            },
            //视频
            {
                path:'/video', 
                name:'video',
                component: video
            },
            //视频详情
            { 
                path:'/videoDetail', 
                name:'videoDetail',
                component: videoDetail
            },
            // 歌单详情页
            {
                path:'/songListDetail/:songListId',
                name:'songListDetail',
                component: songListDetail,
                props: (route) =>({
                    params:route.params.songListId
                })
                // 在需要映射的组件中使用props:['songListId'] 接收
            },
            // 个人中心
            {
                path:'personalCenter/:uid',
                name:'personalCenter',
                component:personalCenter,
                props:(route)=>({
                    uid:route.params.uid
                })
            },
            
        ]
    },
    
]