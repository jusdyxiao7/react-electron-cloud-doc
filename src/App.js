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

  const openedFiles = openedFileIds.map(openId => {
    return files.find(file => file.id === openId)
  })

  const activeFile = files.find(file => file.id === activeFileId)

  return (
    <div className="App container-fluid px-0">
      <div className="row g-0">
        <div className="col-3 bg-light left-panel ">
          <FileSearch
          title='我的云文档'
          onFileSearch={(value) => {console.log(value)}}
          />
          <FileList
            files={defaultFiles}
            onSaveEdit={(id, newValue) => {console.log(id); console.log(newValue);}}
            onFileClick={(id) => console.log('clicking', id)}
            onFileDelete={(id) => console.log('deleting', id)}
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
                    console.log(id)
                  }}
                  activeId={activeFileId}
                  onCloseTab={(id) => {
                    console.log('closing ', id)
                  }}
                  unSaveIds={unsavedFileIds}
              />
              <SimpleMDE
                  value={activeFile && activeFile.body}
                  onChange={(value) => {
                    console.log(value)
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
