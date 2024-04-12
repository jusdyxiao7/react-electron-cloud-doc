/**
 * @作者 Conor Sun
 * @开源仓库 $ https://github.com/jusdyxiao7
 * @创建时间 2024/4/12 星期五 下午 13:59
 */
import React, {useState, useEffect, useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'

const FileSearch = ({title, onFileSearch}) => {
  const [inputActive, setInputActive] = useState(false);
  const [value, setValue] = useState('');

  // 保存可变值
  // let number = useRef(1)
  // number.current++
  // console.log(number.current)

  let node = useRef(null)

  const closeSearch = (e) => {
    e.preventDefault()
    setInputActive(false)
    setValue('')
  }

  // 增加键盘回车和Esc事件
  useEffect(() => {
    const handleInputEvent = (event) => {
      const {keyCode} = event
      // 回车 13
      // Ese 27
      if (keyCode === 13 && inputActive) {
        onFileSearch(value)
      } else if (keyCode === 27 && inputActive) {
        closeSearch(event)
      }
    }
    document.addEventListener('keyup', handleInputEvent)
    return () => {
      document.removeEventListener('keyup', handleInputEvent)
    }
  })

  // input焦点 focus 高亮
  useEffect(() => {
    if (inputActive) {
      node.current.focus()
    }
  }, [inputActive])

  // 根据激活状态来区分两种显示框
  return (
    <div className="alert alert-primary d-flex justify-content-between align-items-center">
      {
        !inputActive && (
          <>
            <span>{title}</span>
            <button
              type="button"
              className="icon-button"
              onClick={() => {
                setInputActive(true)
              }}
            >
              <FontAwesomeIcon
                title="搜索"
                size="lg"
                icon={faSearch}
              />
            </button>
          </>
        )
      }
      {
        inputActive && (
          <>
            <input
              className="form-control"
              value={value}
              ref={node}
              onChange={(e) => {
                setValue(e.target.value)
              }}
            />
            <button
              type="button"
              className="icon-button"
              onClick={closeSearch}>
              <FontAwesomeIcon
                title="关闭"
                size="lg"
                icon={faTimes}
              />
            </button>
          </>
        )
      }
    </div>
  )
}

export default FileSearch;

