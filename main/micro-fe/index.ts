import { handleRouter } from "./handle-router";
import { rewriteRouter } from "./rewrite-router"
let microApps: any[] = []

export const getApps = () => microApps;

export const registerMicroApps = (apps: any[]) => {
  microApps = apps
}

export const start = () => {
  // 微前端运行原理：
  // 1. 监视路由变化
  // hash  onhashchange
  rewriteRouter()

  // 初始执行匹配
  handleRouter()
}
start()