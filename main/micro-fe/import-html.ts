import { fetchResource } from './fetch-resource'
export const importHTML = async (url: string) => {
  const template = document.createElement("div")
  // 获取 html 代码
  const html = await fetchResource(url)
  template.innerHTML = html
  
  // 得到所有 script 元素的标签
  const scripts = template.querySelectorAll('script')

  // 获取所有 script 标签的代码
  async function getExternalScripts() {
    return Promise.all(Array.from(scripts).map(script => {
      const src = script.getAttribute("src")
      // 不是外链接形式引入的script标签
      if (!src) {
        return Promise.resolve(script.innerHTML)
      } else {
        // 是外链接的形式,去请求地址，但是要加上前缀地址
        return fetchResource(
          src.startsWith('http') ? src : `${url}${src}`
        )
      }
    }))
  }
  // 获取并执行所有的 script 脚本代码
  async function execScripts() {
    const scripts = await getExternalScripts()
    scripts.forEach(code => eval(code))
  }
  return {
    template,
    getExternalScripts,
    execScripts 
  }
}