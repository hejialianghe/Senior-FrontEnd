import { useState, useEffect } from 'react'

const useData = (staticContext, initial, getData) => {

  // 初始化数据
  const getInitialData = () => {
    if (staticContext) {
      console.log('server render')
      return staticContext
    }
    if (window.__APP_DATA__) {
      console.log('client first render')
      return window.__APP_DATA__
    }
    return initial
  }
  const [data, setData] = useState(getInitialData())

  useEffect(() => {
    // 客户端首次执行完以后，把window.__APP_DATA__清除掉；下个路由就可以请求数据了
    if (window.__APP_DATA__) {
      window.__APP_DATA__ = undefined
      return
    }
    if (typeof getData === 'function') {
      console.log('spa render')
      getData().then(res => setData(res)).catch()
    }
  }, [])

  return [data, setData]

}

export default useData