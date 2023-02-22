import user from "../modules/user"

/*
 * @Descripttion: 
 * @version: 
 * @Author: zhangyuehai
 * @Date: 2022-06-23 11:02:20
 * @LastEditors: zhangyuehai
 * @LastEditTime: 2022-06-28 17:25:55
 */
// user
export default {
    token: JSON.parse(localStorage.getItem('token')),
    name: JSON.parse(localStorage.getItem('name')),
    roles: JSON.parse(localStorage.getItem('roles')),
}
