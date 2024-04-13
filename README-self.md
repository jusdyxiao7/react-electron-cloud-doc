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


