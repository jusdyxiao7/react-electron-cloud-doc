import { useEffect } from 'react'
const { ipcRenderer } = window.require('electron')

const useIpcRenderer = (keyCallbackMap) => {
  // keyCallbackMap key value 结构
  // 'create-file': () => {},
  // 'remove-file': () => {},
  useEffect(() => {
    Object.keys(keyCallbackMap).forEach(key => {
      ipcRenderer.on(key, keyCallbackMap[key])
    })
    return () => {
      Object.keys(keyCallbackMap).forEach(key => {
        ipcRenderer.removeListener(key, keyCallbackMap[key])
      })
    }
  })
}

export default useIpcRenderer
