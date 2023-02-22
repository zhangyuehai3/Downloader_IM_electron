/*
 * @Descripttion: 
 * @version: 
 * @Author: zhangyuehai
 * @Date: 2022-06-23 10:50:06
 * @LastEditors: zhangyuehai
 * @LastEditTime: 2022-06-23 13:37:11
 */
// 登录
export function Login({ commit }, data) {
    return new Promise((resolve, reject) => {
        if (data.username.includes("admin")) {
            commit("SET_TOKEN", "admin");
            commit("SET_NAME", "Super Admin");

        } else {
            commit("SET_TOKEN", "edit");
            commit("SET_NAME", "Edit");
        }

        resolve();
    });
}

// 登出
export function LogOut({ commit }) {
    return new Promise((resolve, reject) => {
        commit("SET_TOKEN", "");
        commit("SET_ROLES", []);
        resolve();
    });
}

// 前端 登出
export function FedLogOut({ commit }) {
    return new Promise((resolve) => {
        commit("SET_TOKEN", "");
        resolve();
    });
}
export function GetUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
        if (state.token.includes("admin")) {
            commit("SET_ROLES", ["admin"]);
        } else {
            commit("SET_ROLES", ["edit"]);
        }
        resolve(state);
    });
}