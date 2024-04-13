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

function App() {

  const [files, setFiles] = useState(defaultFiles)
  const [activeFileId, setActiveFileId] = useState('')
  const [openedFileIds, setOpenedFileIds] = useState([])
  const [unsavedFileIds, setUnsavedFileIds] = useState([])
  const [searchedFiles, setSearchedFiles] = useState([])

  const openedFiles = openedFileIds.map(openId => {
    return files.find(file => file.id === openId)
  })
  const activeFile = files.find(file => file.id === activeFileId)
  const fileListArr = (searchedFiles.length > 0) ? searchedFiles : files
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
    const newFiles = files.map(file => {
      if (file.id === id) {
        file.body = value
      }
      return file
    })
    setFiles(newFiles)
    // update unsavedIds
    if (!unsavedFileIds.includes(id)) {
      setUnsavedFileIds([...unsavedFileIds, id])
    }
  }

  const deleteFile = (id) => {
    // filter out the current file id
    const newFiles = files.filter(file => file.id !== id)
    setFiles(newFiles)
    // close the tab if opened
    tabClose(id)
  }

  const updateFileName = (id, title) => {
    // loop through files, and update the title
    const newFiles = files.map(file => {
      if (file.id === id) {
        file.title = title
      }
      return file
    })
    setFiles(newFiles)
  }

  const fileSearch = (keyword) => {
    // filter out the new files based on the keyword
    const newFiles = files.filter(file => file.title.includes(keyword))
    setSearchedFiles(newFiles)
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
                    minHeight: '515px'
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
