import { ipcMain, dialog, BrowserWindow } from 'electron'
import Server from '../server/index'
import { winURL } from '../config/StaticPath'
import downloadFile from './downloadFile'
import Update from './checkupdate'
import { updater } from './HotUpdater'

export default {
  Mainfunc(IsUseSysTitle) {
    const allUpdater = new Update();
    ipcMain.handle('IsUseSysTitle', async () => {
      return IsUseSysTitle
    })
    ipcMain.handle('windows-mini', (event, args) => {
      BrowserWindow.fromWebContents(event.sender)?.minimize()
    })
    ipcMain.handle('window-max', async (event, args) => {
      if (BrowserWindow.fromWebContents(event.sender)?.isMaximized()) {
        BrowserWindow.fromWebContents(event.sender)?.unmaximize()
        return { status: false }
      } else {
        BrowserWindow.fromWebContents(event.sender)?.maximize()
        return { status: true }
      }
    })
    ipcMain.handle('window-close', (event, args) => {
      BrowserWindow.fromWebContents(event.sender)?.close()
    })
    ipcMain.handle('start-download', (event, msg) => {
      downloadFile.download(BrowserWindow.fromWebContents(event.sender), msg.downloadUrL)
    })
    ipcMain.handle('check-update', (event, args) => {
      console.log(BrowserWindow.fromWebContents(event.sender),11111);
      allUpdater.checkUpdate(BrowserWindow.fromWebContents(event.sender))
    })
    ipcMain.handle('confirm-update', () => {
      allUpdater.quitInstall()
    })
    ipcMain.handle('hot-update', (event, arg) => {
      updater(BrowserWindow.fromWebContents(event.sender))
    })
    ipcMain.handle('open-messagebox', async (event, arg) => {
      const res = await dialog.showMessageBox(BrowserWindow.fromWebContents(event.sender), {
        type: arg.type || 'info',
        title: arg.title || '',
        buttons: arg.buttons || [],
        message: arg.message || '',
        noLink: arg.noLink || true
      })
      return res
    })
    ipcMain.handle('open-errorbox', (event, arg) => {
      dialog.showErrorBox(
        arg.title,
        arg.message
      )
    })
    ipcMain.handle('statr-server', async () => {
      try {
        const serveStatus = await Server.StatrServer()
        return serveStatus
      } catch (error) {
        dialog.showErrorBox(
          '??????',
          error
        )
      }
    })
    ipcMain.handle('stop-server', async (event, arg) => {
      try {
        const serveStatus = await Server.StopServer()
        return serveStatus
      } catch (error) {
        dialog.showErrorBox(
          '??????',
          error
        )
      }
    })
    let childWin = null;
    let cidArray = [];
    ipcMain.handle('open-win', (event, arg) => {
      let cidJson = { id: null, url: '' }
      let data = cidArray.filter((currentValue) => {
        if (currentValue.url === arg.url) {
          return currentValue
        }
      })
      if (data.length > 0) {
        //??????????????????
        let currentWindow = BrowserWindow.fromId(data[0].id)
        //????????????
        currentWindow.focus();
      } else {
        //???????????????ID
        let parentID = event.sender.id
        //????????????
        childWin = new BrowserWindow({
          width: arg?.width || 842,
          height: arg?.height || 595,
          //width ??? height ???????????? web ???????????????(??????: ???????????????), ??????????????????????????????????????????????????????????????????????????????????????? 
          useContentSize: true,
          //????????????????????????????????????Alt??????
          autoHideMenuBar: true,
          //???????????????????????????
          resizable: arg?.resizable ?? false,
          //?????????????????????
          minWidth: arg?.minWidth || 842,
          show: arg?.show ?? false,
          //???????????????
          opacity: arg?.opacity || 1.0,
          //????????????????????????ID
          parent: parentID,
          frame: IsUseSysTitle,
          webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            //??????webview?????? ????????????
            webviewTag: arg?.webview ?? false,
            // ?????????????????????????????????devTools
            devTools: process.env.NODE_ENV === 'development',
            // ???macos?????????????????????
            scrollBounce: process.platform === 'darwin',
            // ?????????????????????????????????
            contextIsolation: false
          }
        })
        childWin.loadURL(winURL + `#${arg.url}`)
        cidJson.id = childWin?.id
        cidJson.url = arg.url
        cidArray.push(cidJson)
        childWin.webContents.once('dom-ready', () => {
          childWin.show()
          childWin.webContents.send('send-data', arg.sendData)
          if (arg.IsPay) {
            // ???????????????????????????????????????
            const testUrl = setInterval(() => {
              const Url = childWin.webContents.getURL()
              if (Url.includes(arg.PayUrl)) {
                childWin.close()
              }
            }, 1200)
            childWin.on('close', () => {
              clearInterval(testUrl)
            })
          }
        })
        childWin.on('closed', () => {
          childWin = null
          let index = cidArray.indexOf(cidJson)
          if (index > -1) {
            cidArray.splice(index, 1);
          }
        })
      }
      childWin.on('maximize', () => {
        if (cidJson.id != null) {
          BrowserWindow.fromId(cidJson.id).webContents.send("w-max", true)
        }
      })
      childWin.on('unmaximize', () => {
        if (cidJson.id != null) {
          BrowserWindow.fromId(cidJson.id).webContents.send("w-max", false)
        }
      })
    })
  }
}
