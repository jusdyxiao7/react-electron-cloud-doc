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
import useContextMenu from "../hooks/useContextMenu";
import {getParentNode} from "../utils/helper";

// 高版本需要安装新依赖，并做相关配置后使用
const remote = window.require('@electron/remote')
const {Menu, MenuItem} = remote

const FileList = ({files, onFileClick, onSaveEdit, onFileDelete}) => {
    const [editStatus, setEditStatus] = useState(false)
    const [value, setValue] = useState('');

    const enterPressed = useKeyPress(13)
    const escPressed = useKeyPress(27)

    let node = useRef(null)

    // input焦点 focus 高亮
    useEffect(() => {
        if (editStatus) {
            node.current.focus()
        }
    }, [editStatus])

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
            onSaveEdit(editItem.id, value, editItem.isNew)
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
        // console.log(newFile)
        if (newFile) {
            setEditStatus(newFile.id)
            setValue(newFile.title)
        }
    }, [files])


    // 添加上下文菜单
    // 使用hooks函数重构
    const clickedItem = useContextMenu(
[{
            label: '打开',
            click: () => {
                const parentElement = getParentNode(clickedItem.current, 'file-item')
                if (parentElement) {
                    onFileClick(parentElement.dataset.id)
                }
                // console.log(parentElement)
                // console.log(parentElement.dataset)
                // console.log(parentElement.dataset.id)
                // console.log('打开 clicking', clickedItem.current)
            }
        },
        {
            label: '重命名',
            click: () => {
                const parentElement = getParentNode(clickedItem.current, 'file-item')
                if (parentElement) {
                    const { id, title } = parentElement.dataset
                    setEditStatus(id)
                    setValue(title)
                }
            }
        },
        {
            label: '删除',
            click: () => {
                const parentElement = getParentNode(clickedItem.current, 'file-item')
                if (parentElement) {
                    onFileDelete(parentElement.dataset.id)
                }
            }
        }], '.file-list', [files])
    // console.log(clickedItem.current)


    // useEffect(() => {
    //     const menu = new Menu()
    //     menu.append(new MenuItem({
    //         label: '打开',
    //         click: () => {
    //             console.log('打开 clicking')
    //         }
    //     }))
    //     menu.append(new MenuItem({
    //         label: '重命名',
    //         click: () => {
    //             console.log('重命名 clicking')
    //         }
    //     }))
    //     menu.append(new MenuItem({
    //         label: '删除',
    //         click: () => {
    //             console.log('删除 clicking')
    //         }
    //     }))
    //
    //     const handleContextMenu = (e) => {
    //       menu.popup({
    //           window: remote.getCurrentWindow()
    //       })
    //     }
    //     document.addEventListener('contextmenu', handleContextMenu)
    //     return () => {
    //         document.removeEventListener('contextmenu', handleContextMenu)
    //     }
    // })

    return (
        <ul className="list-group list-group-flush file-list">
            {
                files.map(file => (
                    <li
                        className="file-item list-group-item bg-light d-flex align-items-center row g-0"
                        key={file.id}
                        data-id={file.id}
                        data-title={file.title}
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
                                    onClick={(e) => {
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
                                            ref={node}
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
