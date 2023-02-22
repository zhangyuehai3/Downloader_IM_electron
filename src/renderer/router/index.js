/*
 * @Descripttion: 
 * @version: 
 * @Author: zhangyuehai
 * @Date: 2022-06-13 17:18:53
 * @LastEditors: zhangyuehai
 * @LastEditTime: 2022-06-24 14:04:29
 */
import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
// 引入路由表
import asyncRouterMap from './constantRouterMap'

Vue.use(Router)


export const constantRouterMap = [ {
  path: '/login',
  component: () => import('@/views/login'),
  hidden: true
}, {
  path: '*',
  component: () => import('@/views/404'),
  hidden: true
}]
export const asyncRoutes = asyncRouterMap

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}
const router = createRouter()

export default router