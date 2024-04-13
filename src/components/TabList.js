/**
 * @作者 Conor Sun
 * @开源仓库 $ http://github.com/jusdyxiao7
 * @创建时间 2024/4/13 0013 上午 11:11
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEdit, faTrash, faTimes} from '@fortawesome/free-solid-svg-icons'
import './TabList.scss'

const TabList = ({files, activeId, unSaveIds, onTabClick, onCloseTab}) => {
    return (
        <ul
            className="nav nav-pills tablist-component"
        >
            {
                files.map(file => {
                    const withUnsaveMark = unSaveIds.includes(file.id)

                    const fClassName = classNames({
                        'nav-link': true,
                        'active': file.id === activeId,
                        'withUnsaved': withUnsaveMark
                    })

                    return (
                        <li className="nav-item" key={file.id}>
                            <a
                                href="#"
                                className={fClassName}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onTabClick(file.id)
                                }}
                            >
                                {file.title}
                                <span
                                    className="ms-2 close-icon"
                                    onClick={(e) => {
                                        // 阻止冒泡
                                        e.stopPropagation();
                                        e.preventDefault();
                                        onCloseTab(file.id)
                                    }}
                                >
                                    <FontAwesomeIcon
                                        title="关闭"
                                        size="lg"
                                        icon={faTimes}
                                    />
                                </span>
                                {
                                    withUnsaveMark &&
                                    (
                                        <span
                                         className="rounded-circle ms-2 unsaved-icon"
                                        >

                                        </span>
                                    )
                                }
                            </a>
                        </li>
                    )
                })
            }
        </ul>
    )
}

TabList.propTypes = {
    files: PropTypes.array,
    activeId: PropTypes.string,
    unSaveIds: PropTypes.array,
    onTabClick: PropTypes.func,
    onCloseTab: PropTypes.func,
}

// 默认属性
TabList.defaultProps = {
    unSaveIds: []
}

export default TabList;
