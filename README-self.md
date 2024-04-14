# 个人笔记


## React 哲学

- 将设计好的UI划分为组件层级
- 创建应用的静态版本


## 初始化环境


基础配置

```shell
npx create-react-app cloud-doc
npm install electron --save-dev
```

测试和生产url区分

```
npm install electron-is-dev --save-dev
```


## 标准的electron入口文件 main.js


main.js


```
const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')
let mainWindow

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 680,
    webPreferences: {
      nodeIntegration: true
    }
  })
  const urlLocation = isDev ? 'http://localhost:3000' : 'dummyurl'
  mainWindow.loadURL(urlLocation)
})
```

package.json 新增入口配置

```
"main": "main.js",
```

concurrently并发执行多个命令

wait-on解决执行顺序问题

否则会出现白屏问题

按顺序先启动web，然后再启动electron

cross-env解决跨平台设置环境变量问题

```
npm install concurrently --save-dev
npm install wait-on --save-dev
npm install cross-env --save-dev
```

package.json 新增组合启动命令

```
"dev": "concurrently \"wait-on http://localhost:3000 && electron .\" \"cross-env BROWSER=none npm start\""
```


### 环境搭建问题处理


采用新版本的 electron-is-dev，无法正确引入，问题待修正

> // 老版本使用下面的方式
> const isDev = require('electron-is-dev')
>
> // 新版本使用方式
> import isDev from 'electron-is-dev'


新的引入方式，同样会导致两种js无法共存，处理办法暂无，待解决

https://github.com/sindresorhus/electron-is-dev


## 目录结构

避免多层嵌套

不要过度思考

- components->ComponentName.js+ComponentName.css
- hooks->useHook.js
- utils



## 引入Bootstrap样式库


```
npm install bootstrap --save
```

App.js 文件中引入的样式

```
// 引入bootstrap样式库文件
import 'bootstrap/dist/css/bootstrap.min.css';
```


注意直接写在input下的className会跟本身的 form-control 有冲突


- 错误写法
  - `className="form-control col-8"`

- 正确写法
  - `<div className="col-8"><input className="form-control" /></div>`


```
<div className="row">
  <div className="col-8">
    <input
      className="form-control col-8"
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
      }}
    />
  </div>
  <button
    type="button"
    className="btn btn-primary col-4"
    onClick={() => {
      setInputActive(false)
    }}>
    关闭
  </button>
</div>
```


## 为项目选择图标库

- 使用 svg 图标库，而不是 font icon
- 使用 fontawesome react

```
npm install --save @fortawesome/fontawesome-svg-core
npm install --save @fortawesome/free-solid-svg-icons
npm install --save @fortawesome/free-regular-svg-icons
npm install --save @fortawesome/free-brands-svg-icons
npm install --save @fortawesome/react-fontawesome
```

https://docs.fontawesome.com/web/setup/packages


## 使用 PropTypes 检查属性类型


- 类型检查可以帮助我们更好的发现 Bug
- React 内置了 PropTypes 来完成这个任务 

> main.afc48e79b3c4b64a3404.hot-update.js:36 Warning: Failed prop type: Invalid prop `title` of type `number` supplied to `FileSearch`, expected `string`.
> at FileSearch (http://localhost:3000/static/js/bundle.js:195:3)
> at App


## 使用 classnames 库


```
npm install classnames --save
```

动态设置各种样式组合

```
import classNames from 'classnames'

const fClassName = classNames({
      'nav-link': true,
      'active': file.id === activeId
  })
```


## 安装 node-sass

```
npm install node-sass --save
```

安装报错，选择匹配node的正确版本即可

https://www.npmjs.com/package/node-sass


## Markdown编辑器

https://www.tiny.cloud/

基本要求

- 支持预览模式
- 支持高亮显示不同内容
- 支持自定义工具栏

Github上搜索相关仓库 => 再看下有没有fork后继续更新的

开源精神

最终选择

https://github.com/RIP21/react-simplemde-editor

```
npm install --save react-simplemde-editor easymde
```


## State设计原则

- 最小化 State 原则
- DRY - Don't Repeat Yourself
- 有些数据可以根据已有 State 计算得出
- 使用多个 State 变量


App State 分析

1. 文件列表
2. 搜索后的文件列表
3. 未保存的文件列表
4. 已经打开的文件列表
5. 当前被选中的文件


单向数据流


## uuid


新建文件生成uuid

```
npm install uuid --save
```


## Flatten State


复杂数据结构打平

- 解决数组冗余
- 数据处理更加方便



## 解决 window.require() is not a function 问题


https://github.com/electron/electron/issues/7300

https://stackoverflow.com/questions/56091343/typeerror-window-require-is-not-a-function/56095485


```
webPreferences: {
  nodeIntegration: true,
  webSecurity: false,
  // 解决window.require is not a function 问题
  contextIsolation: false
}
```

https://github.com/reZach/secure-electron-template


## 关于Electron中设置enableRemoteModule:true，渲染进程中依旧无法使用remote模块的问题


低版本中 App.js 可以采用如下方式直接引入进来

```
// 低版本中可以正常引入
const {remote} = window.require('electron')
console.log(remote)

const saveLocation = remote.app.getPath('documents')
```

高本本中需要额外处理


1. 安装依赖

```
npm install @electron/remote --save
```

2. 主进程中开启 `enableRemoteModule: true`，同时在创建窗口后引入模块

```
require('@electron/remote/main').initialize()
require('@electron/remote/main').enable(mainWindow.webContents)
```

3. 渲染进程中导入 remote 模块

```
const {remote} = window.require('@electron/remote')
```


## 数据持久化解决方案


```
npm install electron-store --save
```


## 渲染进程引入 electron-store 启动白屏问题


低版本中可以直接在渲染进程中引入 electron-store

高版本需要额外做如下处理

1. 主进程 main.js 中引入，并开启

```
// 高版本引入 electron-store
const Store = require('electron-store')
Store.initRenderer()
```

2. 渲染进程 App.js 中引入使用即可

```
const Store = window.require('electron-store')

const store = new Store()
store.set('name', 'viking')
console.log(store.get('name'))
```

https://github.com/sindresorhus/electron-store/issues/268


## 上下文菜单


1. useContextMenu.js 钩子函数

```
import {useEffect, useRef} from 'react'
// 高版本需要安装新依赖，并做相关配置后使用
const remote = window.require('@electron/remote')
const {Menu, MenuItem} = remote

// deps 解决 闭包不更新的问题，根据外部传入的依赖项，重新渲染
const useContextMenu = (itemArr, targetSelector, deps) => {
    let clickedElement = useRef(null)

    useEffect(() => {
        const menu = new Menu()
        itemArr.forEach(item => {
            menu.append(new MenuItem(item))
        })
        const handleContextMenu = (e) => {
            // only show the context menu on current dom element or targetSelector contains target
            if (document.querySelector(targetSelector).contains(e.target)) {
                clickedElement.current = e.target
                menu.popup({
                    window: remote.getCurrentWindow()
                })
            }
        }
        document.addEventListener('contextmenu', handleContextMenu)
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu)
        }
    }, deps)
    return clickedElement
}

export default useContextMenu
```

2. 根据dom元素找到具体需要添加上下文菜单的区域和菜单点击操作事件

```
// 添加上下文菜单
    // 使用hooks函数重构
    const clickedItem = useContextMenu(
[{
    label: '打开',
    click: () => {
        const parentElement = getParentNode(clickedItem.current, 'file-item')
        if (parentElement) {
            onFileClick(parentElement.dataset.id)
        }
        // console.log(parentElement)
        // console.log(parentElement.dataset)
        // console.log(parentElement.dataset.id)
        // console.log('打开 clicking', clickedItem.current)
    }
},
{
    label: '重命名',
    click: () => {
        console.log('重命名 clicking', clickedItem.current)
    }
},
{
    label: '删除',
    click: () => {
        console.log('删除 clicking', clickedItem.current)
    }
}], '.file-list', [files])
```


## 原生菜单


https://github.com/carter-thaxton/electron-default-menu/blob/master/index.js


1. 渲染进程 App.js 引入依赖，并监听函数

```
// 引入ipcRenderer正常
const {ipcRenderer} = window.require('electron')


// 接收ipc原生菜单按钮事件
useEffect(() => {
  const callback = () => {
    console.log('hello from menu')
  }
  ipcRenderer.on('create-new-file', callback)
  return () => {
    ipcRenderer.removeListener('create-new-file', callback)
  }
})
```

2. 设置定义的原生菜单模板 menuTemplage.js

```
const { app, shell, ipcMain } = require('electron')
const Store = require('electron-store')
const settingsStore = new Store({ name: 'Settings'})

const qiniuIsConfiged =  ['accessKey', 'secretKey', 'bucketName'].every(key => !!settingsStore.get(key))
let enableAutoSync = settingsStore.get('enableAutoSync')
let template = [{
  label: '文件',
  submenu: [{
    label: '新建',
    accelerator: 'CmdOrCtrl+N',
    click: (menuItem, browserWindow, event) => {
      browserWindow.webContents.send('create-new-file')
    }
  },{
    label: '保存',
    accelerator: 'CmdOrCtrl+S',
    click: (menuItem, browserWindow, event) => {
      browserWindow.webContents.send('save-edit-file')
    }
  },{
    label: '搜索',
    accelerator: 'CmdOrCtrl+F',
    click: (menuItem, browserWindow, event) => {
      browserWindow.webContents.send('search-file')
    }
  },{
    label: '导入',
    accelerator: 'CmdOrCtrl+O',
    click: (menuItem, browserWindow, event) => {
      browserWindow.webContents.send('import-file')
    }
  }]
},
{
  label: '编辑',
  submenu: [
    {
      label: '撤销',
      accelerator: 'CmdOrCtrl+Z',
      role: 'undo'
    }, {
      label: '重做',
      accelerator: 'Shift+CmdOrCtrl+Z',
      role: 'redo'
    }, {
      type: 'separator'
    }, {
      label: '剪切',
      accelerator: 'CmdOrCtrl+X',
      role: 'cut'
    }, {
      label: '复制',
      accelerator: 'CmdOrCtrl+C',
      role: 'copy'
    }, {
      label: '粘贴',
      accelerator: 'CmdOrCtrl+V',
      role: 'paste'
    }, {
      label: '全选',
      accelerator: 'CmdOrCtrl+A',
      role: 'selectall'
    }
  ]
},
{
  label: '云同步',
  submenu: [{
    label: '设置',
    accelerator: 'CmdOrCtrl+,',
    click: () => {
      ipcMain.emit('open-settings-window')
    }
  }, {
    label: '自动同步',
    type: 'checkbox',
    enabled: qiniuIsConfiged,
    checked: enableAutoSync,
    click: () => {
      settingsStore.set('enableAutoSync', !enableAutoSync)
    }
  }, {
    label: '全部同步至云端',
    enabled: qiniuIsConfiged,
    click: () => {
      ipcMain.emit('upload-all-to-qiniu')
    }
  }, {
    label: '从云端下载到本地',
    enabled: qiniuIsConfiged,
    click: () => {

    }
  }]
},
{
  label: '视图',
  submenu: [
    {
      label: '刷新当前页面',
      accelerator: 'CmdOrCtrl+R',
      click: (item, focusedWindow) => {
        if (focusedWindow)
          focusedWindow.reload();
      }
    },
    {
      label: '切换全屏幕',
      accelerator: (() => {
        if (process.platform === 'darwin')
          return 'Ctrl+Command+F';
        else
          return 'F11';
      })(),
      click: (item, focusedWindow) => {
        if (focusedWindow)
          focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
      }
    },
    {
      label: '切换开发者工具',
      accelerator: (function() {
        if (process.platform === 'darwin')
          return 'Alt+Command+I';
        else
          return 'Ctrl+Shift+I';
      })(),
      click: (item, focusedWindow) => {
        if (focusedWindow)
          focusedWindow.toggleDevTools();
      }
    },
  ]
},
{
  label: '窗口',
  role: 'window',
  submenu: [{
    label: '最小化',
    accelerator: 'CmdOrCtrl+M',
    role: 'minimize'
  }, {
    label: '关闭',
    accelerator: 'CmdOrCtrl+W',
    role: 'close'
  }]
},
{
  label: '帮助',
  role: 'help',
  submenu: [
    {
      label: '学习更多',
      click: () => { shell.openExternal('http://electron.atom.io') }
    },
  ]
},
]

// macOS 特有的
if (process.platform === 'darwin') {
  const name = app.getName()
  template.unshift({
    label: name,
    submenu: [{
      label: `关于 ${name}`,
      role: 'about'
    }, {
      type: 'separator'
    }, {
      label: '设置',
      accelerator: 'Command+,',
      click: () => {
        ipcMain.emit('open-settings-window')
      }
    }, {
      label: '服务',
      role: 'services',
      submenu: []
    }, {
      type: 'separator'
    }, {
      label: `隐藏 ${name}`,
      accelerator: 'Command+H',
      role: 'hide'
    }, {
      label: '隐藏其它',
      accelerator: 'Command+Alt+H',
      role: 'hideothers'
    }, {
      label: '显示全部',
      role: 'unhide'
    }, {
      type: 'separator'
    }, {
      label: '退出',
      accelerator: 'Command+Q',
      click: () => {
        app.quit()
      }
    }]
  })
} else {
  template[0].submenu.push({
    label: '设置',
    accelerator: 'Ctrl+,',
    click: () => {
      ipcMain.emit('open-settings-window')
    }
  })
}

module.exports = template
```

3. 主进程中 Main.js 引入依赖，并开启云生菜单

```
const { Menu } = require('electron')

// 引入原生菜单
const menuTemplate = require('./src/menuTemplate')

// set menu
const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)
```


## 设置窗口


- 当前应内用设置页面
- 单独设置窗口

选取弹窗窗口的原因
1. 不用增加复杂度，相对独立
2. 配置选项相对简单，不需要任何框架
3. 可以学习和巩固原生js水平

引用原生html和js文件，就可以正常引用。无需处理es6混合语法的问题

页面HTML文件

```
<link rel="stylesheet" href="../node_modules/bootstrap/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="./settings.css">
    
<script>
  require('./settings.js')
</script>
```

js头部文件

```
const { ipcRenderer } = require('electron')
// 高版本需要安装新依赖，并做相关配置后使用
const remote = require('@electron/remote')

const Store = require('electron-store')
const settingsStore = new Store({name: 'Settings'})
```


## 独立抽取一个弹窗组件


```
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

```


## main.js中引用调用两个窗口示例


支持开启两个窗口的ipc通信


```
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')

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
```


## 网络存储方式


- 块存储
- 文件存储
- 对象存储


### 七牛云优势

1. 中文平台，文档更新及时并且准确
2. 可以免费体验
3. 提供丰富的SDK，包括Node.js

https://www.qiniu.com/

https://developer.qiniu.com/sdk#official-sdk

https://developer.qiniu.com/kodo/1289/nodejs

```
npm install qiniu --save
npm install axios --save
```

https://www.unixtimestamp.com/

https://carbon.now.sh/


