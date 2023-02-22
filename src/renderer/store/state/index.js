/*
 * @Descripttion: 
 * @version: 
 * @Author: zhangyuehai
 * @Date: 2022-06-23 11:04:20
 * @LastEditors: zhangyuehai
 * @LastEditTime: 2022-06-23 12:00:23
 */
const files = require.context('.', false, /\.js$/)
let modules = {}

files.keys().forEach(key => {
  if (key === './index.js') return
   modules = {...modules,...files(key).default}
})

export default modules