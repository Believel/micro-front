import { handleRouter } from "./handle-router"
export const rewriteRouter = function(){
  // history 路由
  // history.go(),history.forward(),history.back() 使用 popstate事件
  window.addEventListener('popstate', () => {
    handleRouter()
  })
  // pushState、replaceState 需要通过函数重写的方式进行劫持
  const rawPushState = window.history.pushState
  window.history.pushState = (...args) => {
    rawPushState.apply(window.history, args)
    handleRouter()
  }
  const rawReplaceState = window.history.replaceState
  window.history.replaceState = (...args) => {
    rawReplaceState.apply(window.history, args)
    handleRouter()
  }
}