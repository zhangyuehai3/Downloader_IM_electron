/*
 * @Descripttion: 
 * @version: 
 * @Author: zhangyuehai
 * @Date: 2022-06-23 11:17:53
 * @LastEditors: zhangyuehai
 * @LastEditTime: 2022-06-29 14:47:26
 */
// 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
// this.$store.commit(method, params)

export default {
  // user.js
  SET_TOKEN: (state, token) => {
    localStorage.setItem("token", JSON.stringify(token));
    state.token = token;
  },
  SET_NAME: (state, name) => {
    localStorage.setItem("name", JSON.stringify(name));
    state.name = name;
  },
  SET_ROLES: (state, roles) => {
    localStorage.setItem("roles", JSON.stringify(roles));
    state.roles = roles;
  },

}
