/**
 * @作者 Conor Sun
 * @开源仓库 $ https://github.com/jusdyxiao7
 * @创建时间 2024/4/12 星期五 下午 13:59
 */
import React, {useState, useEffect, useRef} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEdit, faTrash, faTimes} from '@fortawesome/free-solid-svg-icons'
import {faMarkdown} from '@fortawesome/free-brands-svg-icons'
import PropTypes from 'prop-types'
import useKeyPress from "../hooks/useKeyPress";

const FileList = ({files, onFileClick, onSaveEdit, onFileDelete}) => {
    const [editStatus, setEditStatus] = useState(false)
    const [value, setValue] = useState('');

    const enterPressed = useKeyPress(13)
    const escPressed = useKeyPress(27)

    const closeSearch = (editItem) => {
        // e.preventDefault()
        setEditStatus(false)
        setValue('')
        // if we are editing a newly crated file, we should delete this file when pressing esc
        if (editItem.isNew) {
            onFileDelete(editItem.id)
        }
    }

    // 增加键盘回车和Esc事件
    useEffect(() => {
        const editItem = files.find(file => file.id === editStatus)
        // 使用hooks函数重构精简代码，跟下方等价
        // 防止空名称也能保存
        if (enterPressed && editStatus && value.trim() !== '') {
            onSaveEdit(editItem.id, value)
            setEditStatus(false)
            setValue('')
        }
        if (escPressed && editStatus) {
            closeSearch(editItem)
        }

        // const handleInputEvent = (event) => {
        //     const {keyCode} = event
        //     // 回车 13
        //     // Ese 27
        //     if (keyCode === 13 && editStatus) {
        //         const editItem = files.find(file => file.id === editStatus)
        //         onSaveEdit(editItem.id, value)
        //         setEditStatus(false)
        //         setValue('')
        //     } else if (keyCode === 27 && editStatus) {
        //         closeSearch(event)
        //     }
        // }
        // document.addEventListener('keyup', handleInputEvent)
        // return () => {
        //     document.removeEventListener('keyup', handleInputEvent)
        // }
    })

    // 新增按钮的时候保证也是input的状态
    useEffect(() => {
        const newFile = files.find(file => file.isNew)
        console.log(newFile)
        if (newFile) {
            setEditStatus(newFile.id)
            setValue(newFile.title)
        }
    }, [files])

    return (
        <ul className="list-group list-group-flush file-list">
            {
                files.map(file => (
                    <li
                        className="list-group-item bg-light d-flex align-items-center row g-0"
                        key={file.id}
                    >
                        { (editStatus !== file.id && !file.isNew) && (
                            <>
                                <span className="col-2">
                                <FontAwesomeIcon
                                    size="lg"
                                    icon={faMarkdown}
                                />
                                </span>
                                <span
                                    className="col-8 c-link"
                                    onClick={() => onFileClick(file.id)}
                                >{file.title}
                                </span>
                                <button
                                    type="button"
                                    className="icon-button col-1"
                                    onClick={() => {
                                        setEditStatus(file.id);
                                        setValue(file.title)
                                    }}>
                                    <FontAwesomeIcon
                                        title="编辑"
                                        size="lg"
                                        icon={faEdit}
                                    />
                                </button>
                                <button
                                    type="button"
                                    className="icon-button col-1"
                                    onClick={() => onFileDelete(file.id)}>
                                    <FontAwesomeIcon
                                        title="删除"
                                        size="lg"
                                        icon={faTrash}
                                    />
                                </button>
                            </>
                        )}
                        {
                            (editStatus === file.id || file.isNew) && (
                                <>
                                    <div className="col-10">
                                        <input
                                            className="form-control"
                                            value={value}
                                            placeholder="请输入文件名称"
                                            onChange={(e) => {
                                                setValue(e.target.value)
                                            }}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        className="icon-button col-2"
                                        onClick={() => closeSearch(file)}>
                                        <FontAwesomeIcon
                                            title="关闭"
                                            size="lg"
                                            icon={faTimes}
                                        />
                                    </button>
                                </>
                            )
                        }
                    </li>
                ))
            }

        </ul>
    )
}

FileList.protoTypes = {
    files: PropTypes.array,
    onFileClick: PropTypes.func,
    onSaveEdit: PropTypes.func,
    onFileDelete: PropTypes.func,
}
export default FileList;
