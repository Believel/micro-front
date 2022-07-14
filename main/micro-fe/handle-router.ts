import { importHTML } from './import-html';
import { getApps } from './index'
// 处理路由变化
export const handleRouter = async () => {
  // 2. 匹配子应用
  // 2.1 获取当前地址路径
  const pathname = window.location.pathname
  // 2.2 从注册的应用中去匹配
  const apps = getApps();
  const app = apps.find(app => pathname.startsWith(app.activeRule))
  if (!app) return

  // 3. 加载子应用
  // 3.1 请求获取子应用的资源： HTML、CSS、JS


  // const html = await fetch(app.entry).then(res => res.text())
  const container = document.querySelector(app.container)

  // 1. 客户端渲染需要通过执行 JavaScript 来生成内容
  // 2. 浏览器处于安全考虑，innerHTML 中的script不会加载执行
  // container.innerHTML = html

  const { template, execScripts } = await importHTML(app.entry)

  container.appendChild(template)

  // 配置全局的环境变量
  window.__POWERED_BY_QIANKUN__ = true

  execScripts()




  // 4. 渲染子应用
}