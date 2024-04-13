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

function App() {
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
          <div className="row g-0">
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
          <TabList
            files={defaultFiles}
            onTabClick={(id) => {
              console.log(id)
            }}
            activeId={'1'}
            onCloseTab={(id) => {
              console.log('closing ', id)
            }}
            unSaveIds={['1', '2', '3']}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
