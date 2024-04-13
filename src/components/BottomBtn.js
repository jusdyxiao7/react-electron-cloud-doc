/**
 * @作者 Conor Sun
 * @开源仓库 $ http://github.com/jusdyxiao7
 * @创建时间 2024/4/13 0013 上午 9:45
 */
import React from 'react'
import PropTypes from 'prop-types'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const BottomBtn = ({text, colorClass, icon, onBtnClick}) => (
    <button
        type="button"
        className={`btn btn-block no-border w-100 ${colorClass}`}
        onClick={onBtnClick}
    >
        <FontAwesomeIcon
            className="me-2"
            size="lg"
            icon={icon}
        />
        {text}
    </button>
)

BottomBtn.protoTypes = {
    text: PropTypes.string,
    colorClass: PropTypes.string,
    icon: PropTypes.element.isRequired,
    onBtnClick: PropTypes.func
}

// 默认属性
BottomBtn.defaultProps = {
    text: '新建'
}

export default BottomBtn;
