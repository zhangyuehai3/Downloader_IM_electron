import store from '../'
import config from '../../configs'
import util from '../../utils'
import { Notification } from 'element-ui';
export function formatMsg(msg) {
  const nim = store.state.nim
  if (msg.type === 'robot') {
    if (msg.content && msg.content.flag === 'bot') {
      if (msg.content.message) {
        msg.content.message = msg.content.message.map(item => {
          switch (item.type) {
            case 'template':
              item.content = nim.parseRobotTemplate(item.content)
              break
            case 'text':
            case 'image':
            case 'answer':
              break
          }
          return item
        })
      }
    }
  }
  return msg
}

export function onRoamingMsgs(obj) {
  let msgs = obj.msgs.map(msg => {
    return formatMsg(msg)
  })
  store.commit('updateMsgs', msgs)
}

export function onOfflineMsgs(obj) {
  let msgs = obj.msgs.map(msg => {
    return formatMsg(msg)
  })
  store.commit('updateMsgs', msgs)
}

export function onNewMsg(msg) {
  let newMsg = formatMsg(msg)
  store.commit('updateNewMsg', newMsg)
  onMsg(msg)
}

function onMsg(msg) {
  msg = formatMsg(msg)
  store.commit('putMsg', msg)
  if (msg.sessionId === store.state.currSessionId) {
    store.commit('updateCurrSessionMsgs', {
      type: 'put',
      msg
    })
    // 发送已读回执
    store.dispatch('sendMsgReceipt')
  }
  if (msg.scene === 'team' && msg.type === 'notification') {
    store.dispatch('onTeamNotificationMsg', msg)
  }
}

function onSendMsgDone(error, msg) {
  store.dispatch('hideLoading')
  if (error) {
    // 被拉黑
    if (error.code === 7101) {
      msg.status = 'success'
      alert(error.message)
    } else {
      alert(error.message)
    }
  }
  onMsg(msg)
}

// 消息撤回
export function onRevocateMsg(error, msg) {
  const nim = store.state.nim
  if (error) {
    if (error.code === 508) {
      alert('发送时间超过2分钟的消息，不能被撤回')
    } else {
      alert(error)
    }
    return
  }
  let tip = ''
  if (msg.from === store.state.userUID) {
    tip = '你撤回了一条消息'
  } else {
    let userInfo = store.state.userInfos[msg.from]
    if (userInfo) {
      tip = `${util.getFriendAlias(userInfo)}撤回了一条消息`
    } else {
      tip = '对方撤回了一条消息'
    }
  }
  nim.sendTipMsg({
    isLocal: true,
    scene: msg.scene,
    to: msg.to,
    tip,
    time: msg.time,
    done: function sendTipMsgDone(_error, tipMsg) {
      let idClient = msg.deletedIdClient || msg.idClient
      store.commit('replaceMsg', {
        sessionId: msg.sessionId,
        idClient,
        msg: tipMsg
      })
      if (msg.sessionId === store.state.currSessionId) {
        store.commit('updateCurrSessionMsgs', {
          type: 'replace',
          idClient,
          msg: tipMsg
        })
      }
    }
  })
}

export function revocateMsg({ state, commit }, msg) {
  const nim = state.nim
  let { idClient } = msg
  msg = Object.assign(msg, state.msgsMap[idClient])
  nim.deleteMsg({
    msg,
    done: function deleteMsgDone(error) {
      onRevocateMsg(error, msg)
    }
  })
}

// 发送普通消息
export function sendMsg({ state, commit }, obj) {
  const nim = state.nim
  obj = obj || {}
  let type = obj.type || ''
  store.dispatch('showLoading')
  switch (type) {
    case 'text':
      nim.sendText({
        scene: obj.scene,
        to: obj.to,
        text: obj.text,
        done: onSendMsgDone,
        needMsgReceipt: obj.needMsgReceipt || false
      })
      break
    case 'custom':
      nim.sendCustomMsg({
        scene: obj.scene,
        to: obj.to,
        pushContent: obj.pushContent,
        content: JSON.stringify(obj.content),
        done: onSendMsgDone
      })
  }
}

// 发送文件消息
export function sendFileMsg({ state, commit }, obj) {
  const nim = state.nim
  let { scene, to, fileInput } = obj
  let type = 'file'
  let fileName =fileInput.value
  let userInfo = store.state.userInfos[to]
  if (/\.(png|jpg|bmp|jpeg|gif)$/i.test(fileInput.value)) {
    type = 'image'
  } else if (/\.(mov|mp4|ogg|webm)$/i.test(fileInput.value)) {
    type = 'video'
  }
  commit('changeDownLoadMessage',
  {
    [fileName]: Notification({
      dangerouslyUseHTMLString: true,
      duration: 0,
      showClose: false,
      offset: 45,
      message: '',
      customClass: "GONotificationClass"
    })
  }
  )
  // console.log(store.state.downLoadMessage,"store.state.downLoadMessagestore.state.downLoadMessage");
  nim.sendFile({
    scene,
    to,
    type,
    fileInput,
    beforesend: function (_msg) {
      console && console.log('正在发送消息, id=', _msg);
    },
    uploadprogress: function (_data) {
      store.state.downLoadMessage[fileName].message = `
      <div>
                 <div style="display: flex;">
                 <img width="25px" src="${userInfo.avatar}"></img>
                 <span style="line-height: 25px;margin-left: 5px;">${userInfo.nick} </span>
                 </div>
                <div>
                <span>${fileName.split('\\').pop()}正在发送中</span>
                <span> ${_data.percentageText}</span>
                </div>
               </div>
        `

    },
    uploaderror: function () {
      console && console.log('上传失败')
    },
    uploaddone: function (_error, _file) {

    },
    done: function (error, msg) {
      store.state.downLoadMessage[fileName].close()
      onSendMsgDone(error, msg)
    }
  })
}

// 发送机器人消息
export function sendRobotMsg({ state, commit }, obj) {
  const nim = state.nim
  let { type, scene, to, robotAccid, content, params, target, body } = obj
  scene = scene || 'p2p'
  if (type === 'text') {
    nim.sendRobotMsg({
      scene,
      to,
      robotAccid: robotAccid || to,
      content: {
        type: 'text',
        content
      },
      body,
      done: onSendMsgDone
    })
  } else if (type === 'welcome') {
    nim.sendRobotMsg({
      scene,
      to,
      robotAccid: robotAccid || to,
      content: {
        type: 'welcome'
      },
      body,
      done: onSendMsgDone
    })
  } else if (type === 'link') {
    nim.sendRobotMsg({
      scene,
      to,
      robotAccid: robotAccid || to,
      content: {
        type: 'link',
        params,
        target
      },
      body,
      done: onSendMsgDone
    })
  }
}

// 发送消息已读回执
export function sendMsgReceipt({ state, commit }) {
  // 如果有当前会话
  let currSessionId = store.state.currSessionId
  if (currSessionId) {
    // 只有点对点消息才发已读回执
    if (util.parseSession(currSessionId).scene === 'p2p') {
      // let msgs = store.state.currSessionMsgs
      const nim = state.nim
      if (state.sessionMap[currSessionId]) {
        nim.sendMsgReceipt({
          msg: state.sessionMap[currSessionId].lastMsg,
          done: function sendMsgReceiptDone(_error, _obj) {
            // do something
          }
        })
      }
    }
  }
}

/*
function sendMsgReceiptDone (error, obj) {
  console.log('发送消息已读回执' + (!error ? '成功' : '失败'), error, obj)
}
*/

export function getHistoryMsgs({ state, commit }, obj) {
  const nim = state.nim
  if (nim) {
    let { scene, to } = obj
    let options = {
      scene,
      to,
      reverse: false,
      asc: true,
      limit: config.localMsglimit || 20,
      done: function getHistoryMsgsDone(_error, obj) {
        if (obj.msgs) {
          if (obj.msgs.length === 0) {
            commit('setNoMoreHistoryMsgs')
          } else {
            let msgs = obj.msgs.map(msg => {
              return formatMsg(msg)
            })
            commit('updateCurrSessionMsgs', {
              type: 'concat',
              msgs: msgs
            })
          }
        }
        store.dispatch('hideLoading')
      }
    }
    if (state.currSessionLastMsg) {
      options = Object.assign(options, {
        lastMsgId: state.currSessionLastMsg.idServer,
        endTime: state.currSessionLastMsg.time
      })
    }
    store.dispatch('showLoading')
    nim.getHistoryMsgs(options)
  }
}

export function resetNoMoreHistoryMsgs({ commit }) {
  commit('resetNoMoreHistoryMsgs')
}

// 继续与机器人会话交互
export function continueRobotMsg({ commit }, robotAccid) {
  commit('continueRobotMsg', robotAccid)
}
