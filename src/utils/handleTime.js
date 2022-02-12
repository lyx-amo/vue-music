
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

