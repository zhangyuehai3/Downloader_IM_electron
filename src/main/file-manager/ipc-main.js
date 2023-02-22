/*
 * @Descripttion: 
 * @version: 
 * @Author: zhangyuehai
 * @Date: 2022-06-14 15:29:34
 * @LastEditors: zhangyuehai
 * @LastEditTime: 2022-06-14 17:19:58
 */
import { ipcMain, IpcMainInvokeEvent } from 'electron'


/**
 * 添加 ipc 调用的处理事件
 * @param eventName - ipc 事件名
 * @param listener - 回调事件
 */
export const ipcMainHandle = (
  eventName,
  listener,
)=> {
  ipcMain.handle(eventName, async (event, ...args) => {
    return listener(event, ...args)
  })
}
