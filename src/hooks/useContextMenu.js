/**
 * @作者 Conor Sun
 * @开源仓库 $ http://github.com/jusdyxiao7
 * @创建时间 2024/4/13 0013 下午 18:47
 */
import {useEffect, useRef} from 'react'
// 高版本需要安装新依赖，并做相关配置后使用
const remote = window.require('@electron/remote')
const {Menu, MenuItem} = remote

// deps 解决 闭包不更新的问题，根据外部传入的依赖项，重新渲染
const useContextMenu = (itemArr, targetSelector, deps) => {
    let clickedElement = useRef(null)

    useEffect(() => {
        const menu = new Menu()
        itemArr.forEach(item => {
            menu.append(new MenuItem(item))
        })
        const handleContextMenu = (e) => {
            // only show the context menu on current dom element or targetSelector contains target
            if (document.querySelector(targetSelector).contains(e.target)) {
                clickedElement.current = e.target
                menu.popup({
                    window: remote.getCurrentWindow()
                })
            }
        }
        document.addEventListener('contextmenu', handleContextMenu)
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu)
        }
    }, deps)
    return clickedElement
}

export default useContextMenu
