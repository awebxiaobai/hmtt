import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/Login'
import Layout from '../views/Layout'
import Home from '../views/Home'
import Detail from '../views/Home/Detail'
import SearchNews from '../views/Home/SearchNews'
import QueAndAsk from '../views/QueAndAns'
import Video from '../views/Video'
import Mine from '../views/Mine'
import Edit from '../views/Mine/Edit'
import Cropper from '../views/Mine/Edit/Cropper'

import store from '../store'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login,
    meta: { hasLogin: true }
  },
  {
    path: '/layout/mine/edit',
    component: Edit,
    meta: { hasToken: true }
  },
  {
    path: '/layout/mine/edit/cropper',
    component: Cropper
  },
  {
    path: '/layout/home/detail',
    component: Detail
  },
  {
    path:'/layout/home/searchnews',
    component:SearchNews
  },
  {
    path: '/layout',
    component: Layout,
    children: [
      {
        path: 'home',
        component: Home
      },
      {
        path: 'queandask',
        component: QueAndAsk
      },
      {
        path: 'video',
        component: Video
      },
      {
        path: 'mine',
        component: Mine,
        meta: { hasToken: true }
      },
      {
        path: '',
        redirect: 'home'
      }
    ]
  },
  {
    path: '',
    redirect: 'layout'
  }
]
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location, onResolve, onReject) {
//     if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//     return originalPush.call(this, location).catch(err => err)
// }
const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // if (to.meta.hasLogin) {
  //   if (store.state.tokenObj.token) {
  //     next('/layout/home')
  //   }
  // } 
  if (to.meta.hasToken) {
    if (store.state.tokenObj.token) {
      next()
    } else {
      Vue.prototype.$toast.fail('请先登录')
      next({
        path: '/login',
        query: {
          backPath: to.path
        }
      })
    }
  } else {
    next()
  }

})
export default router
