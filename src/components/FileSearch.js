/**
 * @作者 Conor Sun
 * @开源仓库 $ https://github.com/jusdyxiao7
 * @创建时间 2024/4/12 星期五 下午 13:59
 */
import React, {useState} from 'react';

const FileSearch = ({title, onFileSearch}) => {
  const [inputActive, setInputActive] = useState(false);
  const [value, setValue] = useState('');

  // 根据激活状态来区分两种显示框
  return (
    <div className="alert alert-primary">
      {
        !inputActive && (
          <div className="d-flex justify-content-between align-items-center">
            <span>{title}</span>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setInputActive(true)
              }}
            >
              搜索
            </button>
          </div>
        )
      }
      {
        inputActive && (
          <div className="row">
            {/*<div className="input-group">*/}
              <div className="col-8">
                <input
                  className="form-control"
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
            {/*</div>*/}
          </div>
        )
      }
    </div>
  )
}

export default FileSearch;

