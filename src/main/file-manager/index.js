/*
 * @Descripttion: 
 * @version: 
 * @Author: zhangyuehai
 * @Date: 2022-06-14 15:29:34
 * @LastEditors: zhangyuehai
 * @LastEditTime: 2022-06-16 15:30:59
 */
import { BrowserWindow } from 'electron'
import { registerDownloadService } from './download'

export const registerFileManagerService = (win)=> {
  registerDownloadService()
}
