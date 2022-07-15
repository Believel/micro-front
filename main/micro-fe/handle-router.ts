import { importHTML } from './import-html';
import { getApps } from './index'
import { getNextRoute, getPrevRoute } from './rewrite-router';

interface App {
  name: string
  entry: string
  container: string
  activeRule: string
  bootstrap?: () => void
  mount?: (props: any) => void
  unmount?: () => void
}
// 处理路由变化
export const handleRouter = async () => {
  // 2. 匹配子应用
  const apps = getApps();
  // 卸载上一个路由应用
  const prevApp = apps.find(app => getPrevRoute().startsWith(app.activeRule))
  // 获取下一个路由应用
  const app = apps.find(app => getNextRoute().startsWith(app.activeRule))
  // 如果有上一个应用，则先销毁
  if (prevApp) {
    await unmount(prevApp)
  }
  
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
  // 指定是子应用环境
  window.__POWERED_BY_QIANKUN__ = true
  // 动态设置 publicPath 地址，方便在子应用中动态注册使用
  window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = app.entry + '/'

  const appExports: any = await execScripts()

  app.bootstrap = appExports.bootstrap
  app.mount = appExports.mount
  app.unmount = appExports.unmount

  await bootstrap(app)
  await mount(app)

  // 4. 渲染子应用
}


async function bootstrap(app: App) {
  app.bootstrap && (await app.bootstrap())
}
async function mount(app: App) {
  app.mount && (await app.mount({
    container: app.container
  }))
}

async function unmount(app: App) {
  app.unmount && (await app.unmount())
}