/*
 * @Descripttion: 
 * @version: 
 * @Author: zhangyuehai
 * @Date: 2022-06-23 11:16:52
 * @LastEditors: zhangyuehai
 * @LastEditTime: 2022-06-23 13:36:28
 */
// 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
// this.$store.commit(method, params)
import { constantRouterMap, asyncRoutes } from '@/router'
export default {
  // permission.js
  SET_ROUTERS: (state, routers) => {
    state.addRouters = routers
    state.routers = constantRouterMap.concat(routers)
  },
  RESET_ROUTERS: (state, routers) => {
    state.addRouters = routers
    state.routers = routers
  },
}
