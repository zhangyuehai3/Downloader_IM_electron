/*
 * @Descripttion: 
 * @version: 
 * @Author: zhangyuehai
 * @Date: 2022-06-23 10:52:07
 * @LastEditors: zhangyuehai
 * @LastEditTime: 2022-06-23 13:14:07
 */
const files = require.context('.', false, /\.js$/)
let modules = {}

files.keys().forEach(key => {
  if (key === './index.js') return
   modules = {...modules,...files(key).default}
})

export default modules