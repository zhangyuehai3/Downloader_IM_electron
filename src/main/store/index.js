/*
 * @Descripttion: 
 * @version: 
 * @Author: zhangyuehai
 * @Date: 2022-06-15 13:44:54
 * @LastEditors: zhangyuehai
 * @LastEditTime: 2022-06-15 13:46:14
 */
// store存储
import Store from 'electron-store'
import schema from './schema'

const store = new Store({
  schema,
  // 每当升级版本时，都可以使用migrations对store执行回调操作
  migrations: {
    '0.0.2': store => {
      store.set('foo', 'package change string change too')
    }
  },
})

export default store
