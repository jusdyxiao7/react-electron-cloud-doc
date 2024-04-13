const { BrowserWindow } = require('electron')

class AppWindow extends BrowserWindow {
  constructor(config, urlLocation) {
    const basicConfig = {
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
        // 解决window.require is not a function 问题
        contextIsolation: false,
        enableRemoteModule: true,
      },
      show: false,
      backgroundColor: '#efefef',
    }
    const finalConfig = { ...basicConfig, ...config }
    super(finalConfig)
    this.loadURL(urlLocation)
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}

module.exports = AppWindow
