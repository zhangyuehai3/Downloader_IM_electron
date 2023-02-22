/*
 * @Descripttion: 
 * @version: 
 * @Author: zhangyuehai
 * @Date: 2022-06-23 10:46:00
 * @LastEditors: zhangyuehai
 * @LastEditTime: 2022-06-23 10:47:39
 */

export function ToggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
}

export function CloseSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
}
export function ToggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
}