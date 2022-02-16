
import Vue from 'vue';
import VueRouter from 'vue-router'

import routes from './routes.js'

Vue.use(VueRouter)


const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch((err) => {
    if (VueRouter.isNavigationFailure(err)) {
      // resolve err
      return err
    }
    // rethrow error
    return Promise.reject(err)
  })
}

VueRouter.prototype.replace = function push(location, onResolve, onReject) {
    if (onResolve || onReject)
      return originalReplace.call(this, location, onResolve, onReject)
    return originalReplace.call(this, location).catch((err) => {
      if (VueRouter.isNavigationFailure(err)) {
        // resolve err
        return err
      }
      // rethrow error
      return Promise.reject(err)
    })
  }


const router = new VueRouter({
    mode:'history',
    routes
})

export default router