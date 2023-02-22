import { ipcRenderer, IpcRendererEvent, remote } from 'electron'


/**
 * 添加 ipc 调用监听事件
 * @param eventName - ipc 事件名
 * @param callback - 回调函数
 */
export const ipcRendererListener = (
  eventName,
  callback,
)=> {
  ipcRenderer.on(eventName, (event, ...args) => {
    callback(event, ...args)
  })
}

/**
 * 调用 ipc 的处理事件
 * @param eventName - ipc 事件名
 * @param args - 参数
 * @returns `Promise<any>`
 */
export const ipcRendererInvoke = (eventName, ...args) =>
  ipcRenderer.invoke(eventName, ...args)

/**
 * 获取下载路径
 */
export const getDownloadPath = () => {
 return ipcRendererInvoke('getPath')
}

/**
 * 打开文件
 * @param path - 路径
 */
export const openFile = (path) => ipcRendererInvoke('openFile', path)

/**
 * 打开下载管理器
 */
export const openDownloadManager = () => {
  ipcRendererInvoke('openDownloadManager', '/download-manager/demo')
}

/**
 * 新建下载项
 * @param formData - 下载数据
 */
export const newDownloadFile = (formData)=>
  ipcRendererInvoke('newDownloadFile', formData)

/**
 * 重新下载
 */
export const retryDownloadFile = (item) =>
  ipcRendererInvoke('retryDownloadFile', item)

/**
 * 打开选择保存位置对话框
 * @param path - 路径
 */
export const openFileDialog = (path) =>
  ipcRendererInvoke('openFileDialog', path)

/**
 * 暂停或恢复下载
 * @param item - 下载项
 */
export const pauseOrResume = (item) =>
  ipcRendererInvoke('pauseOrResume', item)

/**
 * 打开文件所在位置
 * @param path - 路径
 */
export const openFileInFolder = (path) =>
  ipcRendererInvoke('openFileInFolder', path)

/**
 * 获取下载数据
 * @param page - 分页
 */
export const getDownloadData = (page) =>
  ipcRendererInvoke('getDownloadData', page)

/**
 * 删除下载项。下载中的将先取消，再删除
 * @param item - 下载项
 * @param index - 下载项的下标
 */
export const removeDownloadItem = (item, index) =>
  ipcRendererInvoke('removeDownloadItem', item, index)

  /**
 *   获取下载数据的数量
 */
  export const getDownloadStore = (item, index) =>
  ipcRendererInvoke('getDownloadStore')
/**
 * 清空下载完成项
 */
export const clearDownloadDone = () =>
  ipcRendererInvoke('clearDownloadDone')

/**
 * 监听新建下载项事件
 * @param callback - 回调函数
 */
export const listenerNewDownloadItem = (
  callback,
) => ipcRendererListener('newDownloadItem', callback)

/**
 * 监听下载项更新事件
 * @param callback - 回调函数
 */
export const listenerDownloadItemUpdate = (
  callback,
)=> ipcRendererListener('downloadItemUpdate', callback)

/**
 * 监听下载项完成事件
 * @param callback - 回调函数
 */
export const listenerDownloadItemDone = (
  callback,
)=> ipcRendererListener('downloadItemDone', callback)
