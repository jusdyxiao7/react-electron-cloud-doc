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


目录结构

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




