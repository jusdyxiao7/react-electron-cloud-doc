import logo from './logo.svg';
import './App.css';
// 引入bootstrap样式库文件
import 'bootstrap/dist/css/bootstrap.min.css';
import FileSearch from "./components/FileSearch";
import FileList from "./components/FileList";
import defaultFiles from "./utils/defaultFiles";
import BottomBtn from "./components/BottomBtn";
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'
import TabList from "./components/TabList";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import {flattenArr, objToArr} from "./utils/helper";

const fs = window.require('fs')
console.dir(fs)

function App() {

  const [files, setFiles] = (useState(flattenArr(defaultFiles)))
  const filesArr = objToArr(files)
  // console.log(files)
  // console.log(filesArr)
  const [activeFileId, setActiveFileId] = useState('')
  const [openedFileIds, setOpenedFileIds] = useState([])
  const [unsavedFileIds, setUnsavedFileIds] = useState([])
  const [searchedFiles, setSearchedFiles] = useState([])

  const openedFiles = openedFileIds.map(openId => {
    return files[openId]
  })
  const activeFile = files[activeFileId]
  const fileListArr = (searchedFiles.length > 0) ? searchedFiles : filesArr
  // console.log(files)
  // console.log(setSearchedFiles)
  // console.log(fileListArr)

  const fileClick = (fileId) => {
    // set current active file
    setActiveFileId(fileId)
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

  const deleteFile = (id) => {
    // filter out the current file id
    delete files[id]
    setFiles(files)

    // const newFiles = files.filter(file => file.id !== id)
    // setFiles(newFiles)
    // close the tab if opened
    tabClose(id)
  }

  const updateFileName = (id, title) => {
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


    const modifiedFile = { ...files[id], title, isNew: false}
    setFiles({...files, [id]: modifiedFile})

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

  return (
    <div className="App container-fluid px-0">
      <div className="row g-0">
        <div className="col-3 bg-light left-panel ">
          <FileSearch
          title='我的云文档'
          onFileSearch={(keyword) => {fileSearch(keyword)}}
          />
          <FileList
            files={fileListArr}
            onSaveEdit={(id, title) => {updateFileName(id, title)}}
            onFileClick={(id) => fileClick(id)}
            onFileDelete={(id) => deleteFile(id)}
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
            </>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
