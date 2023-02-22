/*
 * @Descripttion: 
 * @version: 
 * @Author: zhangyuehai
 * @Date: 2022-06-23 11:34:31
 * @LastEditors: zhangyuehai
 * @LastEditTime: 2022-06-23 17:16:13
 */
var config = {
  sdk: 'NIM_Web_SDK_v8.1.0',
  // 用户自定义的登录注册地址
  loginUrl: '#/',
  registUrl: '/webdemo/h5/regist.html',
  homeUrl: '#/mainpage/session',
  // default icon
  defaultIcon: './static/default.png',
  // 资源路径根目录，为了方便用户部署在二级以上URL路径上
  resourceUrl: 'http://yx-web.nos.netease.com/webdoc/h5',
  // 用户logo地址
  logo: 'http://yx-web.nos.netease.com/webdoc/h5/im/logo.png',
  // 默认用户头像
  defaultUserIcon: 'http://yx-web.nos.netease.com/webdoc/h5/im/default-icon.png',
  // 默认普通群头像
  defaultGroupIcon: 'http://yx-web.nos.netease.com/webdoc/h5/im/default-group.png',
  // 默认高级群头像
  defaultAdvancedIcon: 'http://yx-web.nos.netease.com/webdoc/h5/im/default-advanced.png',
  // 系统通知图标
  noticeIcon: 'http://yx-web.nos.netease.com/webdoc/h5/im/notice-icon.png',
  // 我的手机图标
  myPhoneIcon: 'http://yx-web.nos.netease.com/webdoc/h5/im/my-phone.png',
  // 本地消息显示数量，会影响性能
  localMsglimit: 36
}

const env = 'online'
let appConfig = {
  // 用户的appkey
  // 用于在web demo中注册账号异步请求demo 服务器中使用
  test: {
    appkey: '177ae66b6518690e7a91923115bde376',
    postUrl: 'https://apptest.netease.im'
  },
  online: {
    appkey: '177ae66b6518690e7a91923115bde376',
    postUrl: 'https://app.netease.im'
  }
}



config = Object.assign(config, appConfig[env])

export default config
