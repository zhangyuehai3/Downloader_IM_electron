/*
 * @Descripttion: 
 * @version: 
 * @Author: zhangyuehai
 * @Date: 2022-06-23 11:00:40
 * @LastEditors: zhangyuehai
 * @LastEditTime: 2022-06-23 11:00:47
 */
// app

export default {
    sidebar: {
        opened: !+localStorage.getItem('sidebarStatus'),
        withoutAnimation: false
    },
    device: 'desktop'
}
