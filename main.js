/**
 * @作者 Conor Sun
 * @开源仓库 $ https://github.com/jusdyxiao7
 * @创建时间 2024/4/12 星期五 上午 8:40
 */
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')

// 老版本使用下面的方式
// const isDev = require('electron-is-dev')

// 引入报错，import关键字不支持 => 待解决
// import isDev from 'electron-is-dev'


// 高版本引入 electron-store
const Store = require('electron-store')
Store.initRenderer()

// 引入原生菜单
const menuTemplate = require('./src/menuTemplate')
const AppWindow = require('./src/AppWindow')

let mainWindow, settingsWindow

const isDev = process.env.NODE_ENV !== 'production'

app.on('ready', () => {
  const mainWindowConfig = {
    width: 1440,
    height: 768,
  }
  const urlLocation = isDev ? 'http://localhost:3000' : 'dummyUrl'
  mainWindow = new AppWindow(mainWindowConfig, urlLocation)

  // mainWindow = new BrowserWindow({
  //   width: 1440,
  //   height: 768,
  //   // frame: false,
  //   webPreferences: {
  //     nodeIntegration: true,
  //     webSecurity: false,
  //     // 解决window.require is not a function 问题
  //     contextIsolation: false,
  //     enableRemoteModule: true,
  //   }
  // })

  mainWindow.on('closed', () => {
    mainWindow = null
  })


  // hook up main events
  ipcMain.on('open-settings-window', () => {
    const settingsWindowConfig = {
      width: 500,
      height: 400,
      parent: mainWindow
    }
    const settingsFileLocation = `file://${path.join(__dirname, './settings/settings.html')}`
    settingsWindow = new AppWindow(settingsWindowConfig, settingsFileLocation)
    settingsWindow.on('closed', () => {
      settingsWindow = null
    })

    // 开启remote模块
    require('@electron/remote/main').enable(settingsWindow.webContents)

  })


  // 开启remote模块
  require('@electron/remote/main').initialize()
  require('@electron/remote/main').enable(mainWindow.webContents)

  // mainWindow.loadURL(urlLocation);

  // set menu
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
})
