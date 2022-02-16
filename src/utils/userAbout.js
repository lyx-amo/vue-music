let USERID_KEY = 'USERID_KEY'


function setUserId(userId) {
    localStorage.setItem(USERID_KEY,userId)
}    

function getUserId() {
    return localStorage.getItem(USERID_KEY)
}


function removeUserId() {
    localStorage.removeItem(USERID_KEY)
}

export {
    setUserId,
    getUserId,
    removeUserId
}
