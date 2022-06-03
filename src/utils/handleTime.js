import dayjs from'dayjs'

// 处理音乐时长
export function handleMusicTime(time) {
    time = parseInt(time)  //将一个字符串转换成数字类型
    // 10000 ms 转换为s
    if(time > 10000) {
        time = Math.floor(time / 1000)
    }else {
        time = Math.floor(time)
    }
    // min
    let m = Math.floor(time / 60)
    let s = Math.floor(time % 60)
    m = m < 10 ? '0' + m : m
    s = s < 10 ? '0' + s : s
    return m + ':' + s ;
}



export function returnSecond(time) {
    time =  time.split(':')
    let m = parseInt(time[0]) 
    let s = parseInt(time[1])
    
    return m * 60 + s ;
}

// 处理播放量
export function handlePlayCount(num) {
    num =  num > 100000000 ? Math.trunc((Math.floor(num/10000000)/10))  + '亿' : num > 10000 ? Math.trunc((Math.floor(num/1000)/10))  + '万' : num
    return num
}

export function handleCommentTime(time) {
    return dayjs(time).format('YYYY年MM月DD日HH:mm')
    // return dayjs(time).format('HH:mm')
}   