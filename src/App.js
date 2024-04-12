import logo from './logo.svg';
import './App.css';
// 引入bootstrap样式库文件
import 'bootstrap/dist/css/bootstrap.min.css';
import FileSearch from "./components/FileSearch";
import FileList from "./components/FileList";
import defaultFiles from "./utils/defaultFiles";

function App() {
  return (
    <div className="App container-fluid">
      <div className="row">
        <div className="col-3 left-panel">
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
        </div>
        <div className="col-9 bg-primary right-panel">
          <h1>this is the left</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
