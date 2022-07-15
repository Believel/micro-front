import { handleRouter } from "./handle-router"

let prevRoute = '' // 上一个路由
let nextRoute = window.location.pathname // 下一个路由

export const getPrevRoute = () => prevRoute
export const getNextRoute = () => nextRoute

export const rewriteRouter = function(){
  // history 路由
  // history.go(),history.forward(),history.back() 使用 popstate事件
  window.addEventListener('popstate', () => {
    // popstate 触发的时候，路由已经完成导航了
    prevRoute = nextRoute  // 之前的路由
    nextRoute = window.location.pathname // 现在的路由
    handleRouter()
  })
  // pushState、replaceState 需要通过函数重写的方式进行劫持
  const rawPushState = window.history.pushState
  window.history.pushState = (...args) => {
    // 导航前
    prevRoute = window.location.pathname
    rawPushState.apply(window.history, args)
    // 导航后
    nextRoute = window.location.pathname
    handleRouter()
  }
  const rawReplaceState = window.history.replaceState
  window.history.replaceState = (...args) => {
    // 导航前
    prevRoute = window.location.pathname
    rawReplaceState.apply(window.history, args)
    // 导航后
    nextRoute = window.location.pathname
    handleRouter()
  }
}