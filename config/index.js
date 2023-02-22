/*
 * @Descripttion: 
 * @version: 
 * @Author: zhangyuehai
 * @Date: 2022-06-13 17:18:53
 * @LastEditors: zhangyuehai
 * @LastEditTime: 2022-06-22 11:54:02
 */
module.exports = {
  build: {
    env: require('./prod.env'),
    DisableF12: true,
    cleanConsole: true,
    openDevTools: false,
    hotPublishUrl: "",
    hotPublishConfigName: "update-config"
  },
  dev: {
    env: require('./dev.env'),
    removeElectronJunk: true,
    chineseLog: false,
    port: 8080
  },
  development: require('./dev.env'),
  production: require('./prod.env'),
  UseStartupChart: true,
  IsUseSysTitle: false,
  DllFolder: '',
  BuiltInServerPort: 25565,
  UseJsx: true
}
