/**
 * @作者 Conor Sun
 * @开源仓库 $ https://github.com/jusdyxiao7
 * @创建时间 2024/4/12 星期五 上午 8:40
 */
const { app, BrowserWindow } = require('electron')

// 老版本使用下面的方式
// const isDev = require('electron-is-dev')

// 引入报错，import关键字不支持 => 待解决
// import isDev from 'electron-is-dev'


// 高版本引入 electron-store
const Store = require('electron-store')
Store.initRenderer()

let mainWindow = null;

const isDev = process.env.NODE_ENV !== 'production'

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 680,
    // frame: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      // 解决window.require is not a function 问题
      contextIsolation: false,
      enableRemoteModule: true,
    }
  })
  // 开启remote模块
  require('@electron/remote/main').initialize()
  require('@electron/remote/main').enable(mainWindow.webContents)
  const urlLocation = isDev ? 'http://localhost:3000' : 'dummyUrl'
  mainWindow.loadURL(urlLocation);
})
