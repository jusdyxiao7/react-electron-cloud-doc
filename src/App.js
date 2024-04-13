import logo from './logo.svg';
import './App.css';
// 引入bootstrap样式库文件
import 'bootstrap/dist/css/bootstrap.min.css';
import FileSearch from "./components/FileSearch";
import FileList from "./components/FileList";
import defaultFiles from "./utils/defaultFiles";
import BottomBtn from "./components/BottomBtn";
import { faPlus, faFileImport, faSave } from '@fortawesome/free-solid-svg-icons'
import TabList from "./components/TabList";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import {flattenArr, objToArr} from "./utils/helper";
import fileHelper from "./utils/fileHelper";

// require node.js modules
// const fs = window.require('fs')
// console.dir(fs)
const {join} = window.require('path')

// 低版本中可以正常引入
// const {remote} = window.require('electron')

// 高版本需要安装新依赖，并做相关配置后使用
const remote = window.require('@electron/remote')
// const remote = window.require('@electron/remote')
// console.log(remote)

const Store = window.require('electron-store')

// const store = new Store()
// store.set('name', 'viking')
// console.log(store.get('name'))

const fileStore = new Store({'name': 'Files Data'})

// 新建、更新、删除时操作即可
const saveFilesToStore = (files) => {
  // we don't have to store any info in file system, eg: isNew, body, etc...
  const fileStoreObj = objToArr(files).reduce((result, file) => {
    const {id, path, title, createdAt} = file
    result[id] = {
      id,
      path,
      title,
      createdAt
    }
    return result
  }, {})
  fileStore.set('files', fileStoreObj)
}


function App() {

  // const [files, setFiles] = (useState(flattenArr(defaultFiles)))
  const [files, setFiles] = (useState(fileStore.get('files') || {}))
  const filesArr = objToArr(files)
  // console.log(files)
  // console.log(filesArr)
  const [activeFileId, setActiveFileId] = useState('')
  const [openedFileIds, setOpenedFileIds] = useState([])
  const [unsavedFileIds, setUnsavedFileIds] = useState([])
  const [searchedFiles, setSearchedFiles] = useState([])

  // electron保存的路径
  const saveLocation = remote.app.getPath('documents')
  // const saveLocation = 'documents'

  const openedFiles = openedFileIds.map(openId => {
    return files[openId]
  })
  const activeFile = files[activeFileId]
  const fileListArr = (searchedFiles.length > 0) ? searchedFiles : filesArr
  // console.log(files)
  // console.log(setSearchedFiles)
  // console.log(fileListArr)

  // 文本内容和状态信息不需要持久化存储到store中
  const fileClick = (fileId) => {
    // set current active file
    setActiveFileId(fileId)
    const currentFile = files[fileId]
    if (!currentFile.isLoaded) {
      fileHelper.readFile(currentFile.path).then(value => {
        const newFile = {...files[fileId], body: value, isLoaded: true}
        setFiles({...files, [fileId]: newFile})
      })
    }

    // if openedFiles don't have the currentId
    // then add new fileId to openedFileId
    if (!openedFileIds.includes(fileId)) {
      setOpenedFileIds([...openedFileIds, fileId])
    }
  }

  const tabClick = (fileId) => {
    // set current active file
    setActiveFileId(fileId)
  }

  const tabClose = (id) => {
    // remove currentId from openFileIds
    const tabsWithout = openedFileIds.filter(fileId => fileId !== id)
    setOpenedFileIds(tabsWithout)
    // set the active to the first opened tab if still tabs left
    if (tabsWithout.length > 0) {
      setActiveFileId(tabsWithout[0])
    } else {
      setActiveFileId('')
    }
  }

  const fileChange = (id, value) => {
    // loop through file array to update to new value
    // const newFiles = filesArr.map(file => {
    //   if (file.id === id) {
    //     file.body = value
    //   }
    //   return file
    // })
    // setFiles(newFiles)


    // state is immutable
    // files[id].body = value


    const newFile = { ...files[id], body: value}
    setFiles({...files, [id]: newFile})

    // update unsavedIds
    if (!unsavedFileIds.includes(id)) {
      setUnsavedFileIds([...unsavedFileIds, id])
    }
  }

  // 新增文件直接esc退出会出问题，需要判断中间态文件
  const deleteFile = (id) => {
    if (files[id].isNew) {
      // 优雅写法，除了id以外的所有值 => afterDelete
      const {[id]: value, ...afterDelete} = files
      setFiles(afterDelete)

      // delete files[id]

      // 错误写法一
      // setFiles(files)

      // 修正的写法，但是不推荐
      // setFiles({...files})
    } else {
      // 已经是持久化文件
      // filter out the current file id
      fileHelper.deleteFile(files[id].path).then(() => {
        const {[id]: value, ...afterDelete} = files
        setFiles(afterDelete)
        saveFilesToStore(afterDelete)

        // delete files[id]
        // setFiles({...files})
        // saveFilesToStore({...files})

        // const newFiles = files.filter(file => file.id !== id)
        // setFiles(newFiles)
        // close the tab if opened
        tabClose(id)
      })
    }
  }

  const updateFileName = (id, title, isNew) => {
    // loop through files, and update the title
    // const newFiles = filesArr.map(file => {
    //   if (file.id === id) {
    //     file.title = title
    //     // 不设置的话会一直循环调用
    //     file.isNew = false
    //   }
    //   return file
    // })
    // setFiles(newFiles)

    const newPath = join(saveLocation, `${title}.md`)
    const modifiedFile = { ...files[id], title, isNew: false, path: newPath}
    const newFiles = {...files, [id]: modifiedFile}

    if (isNew) {
      console.log(saveLocation)
      fileHelper.writeFile(newPath, files[id].body).then(() => {
        setFiles(newFiles)
        saveFilesToStore(newFiles)
      })
    } else {
      const oldPath = join(saveLocation, `${files[id].title}.md`)
      fileHelper.renameFile(oldPath, newPath).then(() => {
        setFiles(newFiles)
        saveFilesToStore(newFiles)
      })
    }
  }

  const fileSearch = (keyword) => {
    // filter out the new files based on the keyword
    const newFiles = filesArr.filter(file => file.title.includes(keyword))
    setSearchedFiles(newFiles)
  }

  const createNewFile = () => {
    const newId = uuidv4()
    // const newFiles = [
    //     ...filesArr,
    //   {
    //     id: newId,
    //     title: '',
    //     body: '## 请输出 Markdown',
    //     createdAt: new Date().getTime(),
    //     isNew: true
    //   }
    // ]
    // setFiles(newFiles)


    const newFile = {
      id: newId,
      title: '',
      body: '## 请输出 Markdown',
      createdAt: new Date().getTime(),
      isNew: true
    }
    setFiles({...files, [newId]: newFile})

  }

  const saveCurrentFile = () => {
    fileHelper.writeFile(join(saveLocation, `${activeFile.title}.md`), activeFile.body).then(() => {
      setUnsavedFileIds(unsavedFileIds.filter(id => id !== activeFile.id))
    })
  }

  return (
    <div className="App container-fluid px-0">
      <div className="row g-0">
        <div className="col-3 bg-light left-panel ">
          <FileSearch
          title='我的云文档'
          onFileSearch={fileSearch}
          />
          <FileList
            files={fileListArr}
            onSaveEdit={updateFileName}
            onFileClick={fileClick}
            onFileDelete={deleteFile}
          />
          <div className="row g-0 button-group">
            <div className="col">
              <BottomBtn
               text="新建"
               colorClass="btn-primary"
               icon={faPlus}
               onBtnClick={createNewFile}
              />
            </div>
            <div className="col">
              <BottomBtn
               text="导入"
               colorClass="btn-success"
               icon={faFileImport}
              />
            </div>
          </div>
        </div>
        <div className="col-9 right-panel">
          { !activeFile &&
              (
                  <div className="start-page">
                    选择或者创建新的 Markdown 文档
                  </div>
              )
          }
          {
            activeFile &&
            <>
              <TabList
                  files={openedFiles}
                  onTabClick={(id) => {
                    tabClick(id)
                  }}
                  activeId={activeFileId}
                  onCloseTab={(id) => {
                    tabClose(id)
                  }}
                  unSaveIds={unsavedFileIds}
              />
              <SimpleMDE
                  key={activeFile && activeFile.id}
                  value={activeFile && activeFile.body}
                  onChange={(value) => {
                    fileChange(activeFile.id, value)
                  }}
                  options={{
                    minHeight: '515px',
                    autofocus: true,
                    spellChecker: true,
                  }}
              />
              {/*<BottomBtn*/}
              {/*  text="保存"*/}
              {/*  colorClass="btn-success"*/}
              {/*  icon={faSave}*/}
              {/*  onBtnClick={saveCurrentFile}*/}
              {/*/>*/}
            </>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
