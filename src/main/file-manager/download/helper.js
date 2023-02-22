import store from '../../store/index.js'
import { app, BrowserWindow, DownloadItem, WebContents } from 'electron'
import { getBase64Bytes, getFileIcon, getFileName, pathJoin, uuidV4 } from '../util'

/**
 * 获取下载中的字节数据
 * @param data - 下载项
 */
export const getDownloadBytes = (data) => {
  const allBytes = data.reduce(
    (prev, current) => {
      if (current.state === 'progressing') {
        prev.receivedBytes += current.receivedBytes
        prev.totalBytes += current.totalBytes
      }

      return prev
    },
    { receivedBytes: 0, totalBytes: 0 },
  )

  return allBytes
}

/**
 * 获取下载项
 * @param data - 下载记录
 * @param id - 下载项 id
 */
export const getDownloadItem = (data, id ) => {
  const newData = data.filter(item => item.id === id)

  if (!newData.length) return null
  return newData[0]?._sourceItem || null
}

/**
 * 获取下载项下标
 * @param data - 下载记录
 * @param id - 下载项 id
 */
export const getDownloadIndex = (data, id) =>
  data.findIndex(item => item.id === id)

/**
 * 是否存在下载项
 * @param url - 下载地址
 * @param data - 下载记录
 */
export const isExistItem = (url, data) => {
  const item = data.filter(d => d.url === url)

  return item.length ? item[0] : null
}

/**
 * 下载
 * @param win - 窗口
 * @param url - 下载地址
 */
export const download = (url, win) => {
  if (!win) return
  win.webContents.downloadURL(url)
}

/**
 * 保存下载记录
 * @param data - 下载项
 */
export const setDownloadStore = (data) => {
  store.set('downloadManager', data)
}

/**
 * 获取下载记录
 */
export const getDownloadStore = () =>
  store.get('downloadManager', [])

/**
 * 设置任务栏
 */
export const setTaskbar = (
  data,
  completedData,
  progress,
  win,
) => {
  const count = data.length - completedData.length

  if (win) {
    win.setProgressBar(count < 1 ? -1 : progress)
  }

  if (process.platform === 'darwin') {
    app.badgeCount = count
  }
}

/**
 * 添加下载项
 * @param param
 */
export const addDownloadItem = async ({
  item,
  downloadIds,
  data,
  newDownloadItem,
}) => {
  const id = downloadIds.shift() || ''
  // 判断下载项是否存在，存在先移除，再添加
  const itemIndex = getDownloadIndex(data, id)

  const fileUrl = item.getURL()
  const fileName = getFileName(newDownloadItem?.fileName || '', item.getFilename())
  const startTime = item.getStartTime() * 1000
  const totalBytes = getBase64Bytes(fileUrl) || item.getTotalBytes()

  let fileId = uuidV4()
  const savePath = newDownloadItem?.path || app.getPath('downloads')

  if (itemIndex > -1) {
    const newItems = data.splice(itemIndex, 1)
    const newItem = newItems[0]

    fileId = newItem.id
    if (newItem.paused) {
      item.pause()
    }
  }

  // 阻止系统保存对话框
  item.setSavePath(savePath)

  const fileIcon = await getFileIcon(savePath)
  const downloadItem = {
    id: fileId,
    url: fileUrl,
    icon: fileIcon,
    fileName,
    path: savePath,
    state: item.getState(),
    startTime,
    speed: 0,
    progress: 0,
    totalBytes,
    receivedBytes: item.getReceivedBytes(),
    paused: item.isPaused(),
    _sourceItem: item,
  }

  data.unshift(downloadItem)
  setDownloadStore(data)
  // 清空缓存数据
  newDownloadItem = null

  return downloadItem
}

/**
 * 更新下载中数据
 * @param item - 下载项，electron 生成的对象
 * @param downloadItem - 更新的下载项
 * @param prevReceivedBytes - 上一次下载字节数
 * @param state - 下载状态
 */
export const updateDownloadItem = ({
  item,
  downloadItem,
  data,
  prevReceivedBytes,
  state,
}) => {
  const receivedBytes = item.getReceivedBytes()

  downloadItem.receivedBytes = receivedBytes
  // 计算每秒下载的速度
  downloadItem.speed = receivedBytes - prevReceivedBytes

  downloadItem.progress = receivedBytes / downloadItem.totalBytes
  downloadItem.state = state
  downloadItem.paused = item.isPaused()

  setDownloadStore(data)
  return receivedBytes
}

// 初始化下载数据，并按时间倒序排
export const initDownloadData = ()=> {
  const data = getDownloadStore().sort((a, b) => Math.floor(b.startTime) - Math.floor(a.startTime))

  return data
}

/**
 * 移除下载数据中的 _sourceItem 属性
 * @param data - 下载数据
 */
export const deleteSourceItem = (data) => {
  data = data.map(item => ({ ...item, _sourceItem: undefined }))
  return data
}

/**
 * 分页获取下载数据
 * @param param
 * pageIndex - 当前页
 * pageCount - 每页数
 */
export const getDownloadData = (
  data,
  { pageIndex = 1, pageCount = 10 },
) => {
  data = deleteSourceItem(data)

  const query = (pageIndex - 1) * pageCount
  const newData =
    query + pageCount >= data.length
      ? data.slice(query, data.length)
      : data.slice(query, query + pageCount)

  return newData
}
