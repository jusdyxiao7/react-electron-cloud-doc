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

main.js

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

main.js
"main": "main.js",

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

"dev": "concurrently \"wait-on http://localhost:3000 && electron .\" \"cross-env BROWSER=none npm start\""

components->ComponentName.js+ComponentName.css
hooks->useHook.js
utils

无能的人
