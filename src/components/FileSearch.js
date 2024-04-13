/**
 * @作者 Conor Sun
 * @开源仓库 $ https://github.com/jusdyxiao7
 * @创建时间 2024/4/12 星期五 下午 13:59
 */
import React, {useState, useEffect, useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import useKeyPress from "../hooks/useKeyPress";

const FileSearch = ({title, onFileSearch}) => {
  const [inputActive, setInputActive] = useState(false);
  const [value, setValue] = useState('');

  const enterPressed = useKeyPress(13)
  const escPressed = useKeyPress(27)

  // 保存可变值
  // let number = useRef(1)
  // number.current++
  // console.log(number.current)

  let node = useRef(null)

  const closeSearch = () => {
    // e.preventDefault()
    setInputActive(false)
    setValue('')
    // 关闭按钮后也要重新搜索
    onFileSearch('')
  }

  // 增加键盘回车和Esc事件
  useEffect(() => {

    // 使用hooks函数重构精简代码，跟下方等价
    if (enterPressed && inputActive) {
      onFileSearch(value)
    }
    if (escPressed && inputActive) {
      closeSearch()
    }


    // const handleInputEvent = (event) => {
    //   const {keyCode} = event
    //   // 回车 13
    //   // Ese 27
    //   if (keyCode === 13 && inputActive) {
    //     onFileSearch(value)
    //   } else if (keyCode === 27 && inputActive) {
    //     closeSearch(event)
    //   }
    // }
    // document.addEventListener('keyup', handleInputEvent)
    // return () => {
    //   document.removeEventListener('keyup', handleInputEvent)
    // }
  })

  // input焦点 focus 高亮
  useEffect(() => {
    if (inputActive) {
      node.current.focus()
    }
  }, [inputActive])

  // 根据激活状态来区分两种显示框
  return (
    <div className="alert alert-primary d-flex justify-content-between align-items-center mb-0">
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

// 类型检查
FileSearch.propTypes = {
  title: PropTypes.string,
  onFileSearch: PropTypes.func.isRequired
}

// 默认属性
FileSearch.defaultProps = {
  title: '我的云文档'
}

export default FileSearch;

