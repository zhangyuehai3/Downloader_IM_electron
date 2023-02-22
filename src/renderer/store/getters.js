/*
 * @Descripttion: 
 * @version: 
 * @Author: zhangyuehai
 * @Date: 2022-06-13 17:18:53
 * @LastEditors: zhangyuehai
 * @LastEditTime: 2022-06-23 13:23:52
 */
/**
 * 在这里则是state.文件名.状态名
 */
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  routers: state => state.permission.routers
}

export default getters
