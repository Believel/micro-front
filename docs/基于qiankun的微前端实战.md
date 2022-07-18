# 项目目录说明
```js
.
|-- README.md
|-- app-react    // 微应用 - 接入 react
|-- app-static   // 微应用 - 接入 静态文件
|-- app-vue      // 微应用 - 接入 vue
|-- docs         // 文档
|-- main         // 主应用 - 基座 (引入的是vue项目)
|-- package.json
```
# 1. 主应用
## 1.1 创建微应用的承载容器
* js 配置
```js
// main/src/main.ts

import Vue from "vue";
import VueRouter from "vue-router";

import App from "./App.vue";
// 引入主应用的路由文件
// const routes = [
//   {
//     /**
//      * path: 路径为 / 时触发该路由规则
//      * name: 路由的 name 为 Home
//      * component: 触发路由时加载 `Home` 组件
//      */
//     path: "/",
//     name: "Home",
//     component: Home,
//   }
// ];
import routes from "./routes";

Vue.use(VueRouter);


/**
 * 注册路由实例
 * 即将开始监听 location 变化，触发路由规则
 */
const router = new VueRouter({
  mode: "history",
  routes,
});

// 创建 Vue 实例
// 挂载到 id 为 main-app 的节点上
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#main-app");
```
* 视图设置
```html
<!-- main/src/App.vue -->

<template>
  <a-config-provider prefixCls="cns">
    <section id="cns-main-app">
      <section class="cns-menu-wrapper">
        <main-menu :menus="menus" />
      </section>
      <section class="cns-frame-wrapper">
        <!-- 主应用渲染区，用于挂载主应用路由触发的组件 -->
        <router-view v-show="$route.name" />

        <!-- 子应用渲染区，用于挂载子应用节点 -->
        <section v-show="!$route.name" id="frame"></section>
      </section>
    </section>
  </a-config-provider>
</template>

```

## 1.2 注册微应用
```js
// main/src/micro/index.ts
import {
  registerMicroApps,
  addGlobalUncaughtErrorHandler,
  start,
} from "qiankun";

// 子应用注册信息
const apps = []

/**
 * 注册子应用
 * 第一个参数 - 子应用的注册信息
 * 第二个参数 - 全局生命周期钩子
 */
registerMicroApps(apps, {
  // qiankun 生命周期钩子 - 加载前
  beforeLoad: (app: any) => {
    console.log("before load", app.name);
    return Promise.resolve();
  },
  // qiankun 生命周期钩子 - 挂载后
  afterMount: (app: any) => {
    console.log("after mount", app.name);
    return Promise.resolve();
  },
});

/**
 * 添加全局的未捕获异常处理器
 */
addGlobalUncaughtErrorHandler((event: Event | string) => {
  console.error(event);
  const { message: msg } = event as any;
  // 加载失败时提示
  if (msg && msg.includes("died in status LOADING_SOURCE_CODE")) {
    message.error("子应用加载失败，请检查应用是否可运行");
  }
});

// 导出 qiankun 的启动函数
export default start;

```

## 1.3 启动主应用
> 在注册完微应用之后，一般在入口启动主应用 

```js
// main/src/main.ts
//...
import startQiankun from "./micro";

startQiankun();
```

# 2. 接入微应用 - react
## 2.1 在主应用中注册微应用的信息
```js
// main/src/micro/apps.ts

/**
   * name: 微应用名称 - 具有唯一性
   * entry: 微应用入口 - 通过该地址加载微应用，这里我们使用 config 配置
   * container: 微应用挂载节点 - 微应用加载完成后将挂载在该节点上
   * activeRule: 微应用触发的路由规则 - 触发路由规则后将加载该微应用
   */
  {
    name: "ReactMicroApp",
    entry: "http://localhost:3000",
    container: "#frame",
    activeRule: "/react",
  },
```

> 上面当我们通过主应用访问`/react`时，会进入react应用

## 2.2 配置微应用
```js
// app-react/src/index.js
import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";

import "./public-path";
import App from "./App.jsx";

/**
 * 渲染函数
 * 两种情况：主应用生命周期钩子中运行 / 微应用单独启动时运行
 */
function render(props) { 
  ReactDOM.render(<App />, document.getElementById("root"));
}

// 独立运行时，直接挂载应用(即单独访问应用时，是没有__POWERED_BY_QIANKUN__这个标志的)
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
// 生命周期
// 注意： 这些生命周期都是返回promise
/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log("ReactMicroApp bootstraped");
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  console.log("ReactMicroApp mount", props);
  render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  console.log("ReactMicroApp unmount");  
  ReactDOM.unmountComponentAtNode(document.getElementById("root"));
}
```

## 2.3 配置微应用的webpack

> 对微应用的打包成库，并且支持跨域

```js
// 采用脚手架方式构建的react项目，暴露出的 webpack 配置文件 方式配置
// app-react/config-overrieds.js
const path = require("path");

module.exports = {
  webpack: (config) => {
    // 微应用的包名，这里与主应用中注册的微应用名称一致
    config.output.library = `ReactMicroApp`;
    // 将你的 library 暴露为所有的模块定义下都可运行的方式
    config.output.libraryTarget = "umd";
    // 按需加载相关，设置为 webpackJsonp_[name] 即可
    config.output.jsonpFunction = `webpackJsonp_ReactMicroApp`;

    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },

  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      // 关闭主机检查，使微应用可以被 fetch
      config.disableHostCheck = true;
      // 配置跨域请求头，解决开发环境的跨域问题
      config.headers = {
        "Access-Control-Allow-Origin": "*",
      };
      // 配置 history 模式
      config.historyApiFallback = true;

      return config;
    };
  },
};

```

# 3. 接入微应用 - vue

## 3.1 在主应用中注册微应用的信息
```js
// main/src/micro/apps.ts
  {
    name: "VueMicroApp",
    entry: "http://localhost:3001",
    container: "#frame",
    activeRule: "/vue",
  },
```

> 上面当我们通过主应用访问`/vue`时，会进入vue应用
## 3.2 配置微应用

```js
// app-vue/src/main.js
import Vue from "vue";
import VueRouter from "vue-router";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

import "./public-path";
import App from "./App.vue";
import routes from "./routes";

Vue.use(VueRouter);
Vue.use(Antd);
Vue.config.productionTip = false;

let instance = null;
let router = null;

/**
 * 渲染函数
 * 两种情况：主应用生命周期钩子中运行 / 微应用单独启动时运行
 */
function render() {
  // 在 render 中创建 VueRouter，可以保证在卸载微应用时，移除 location 事件监听，防止事件污染
  router = new VueRouter({
    // 运行在主应用中时，添加路由命名空间 /vue
    base: window.__POWERED_BY_QIANKUN__ ? "/vue" : "/",
    mode: "history",
    routes,
  });

  // 挂载应用
  instance = new Vue({
    router,
    render: (h) => h(App),
  }).$mount("#app");
}

// 独立运行时，直接挂载应用
if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log("VueMicroApp bootstraped");
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  console.log("VueMicroApp mount", props);
  render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  console.log("VueMicroApp unmount");
  instance.$destroy();
  instance = null;
  router = null;
}

```

## 3.3 配置微应用的webpack

> 对微应用的打包成库，并且支持跨域

```js
// app-vue/vue.config.js
const path = require('path');

module.exports = {
  devServer: {
    // 监听端口
    port: 3001,
    // 关闭主机检查，使微应用可以被 fetch
    disableHostCheck: true,
    // 配置跨域请求头，解决开发环境的跨域问题
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    },
    output: {
      // 微应用的包名，这里与主应用中注册的微应用名称一致
      library: "VueMicroApp",
      // 将你的 library 暴露为所有的模块定义下都可运行的方式
      libraryTarget: 'umd',
      // 按需加载相关，设置为 webpackJsonp_VueMicroApp 即可
      jsonpFunction: `webpackJsonp_VueMicroApp`,
    }
  }
}
```

# 4. CSS隔离
## 4.1 方式1：采用Shadow DOM
```js
import { start } from 'qiankun'
// 在启动 qinakun 的时候 
start({
  // 是否开启沙箱，默认为true
  // 默认情况下沙箱可以确保单实例场景子应用之间的样式隔离，但是无法确保主应用跟子应用、或者多实例场景的子应用样式隔离
  sandbox: {
    strictStyleIsolation: true, // 表示开启严格的样式隔离模式，这种模式下 qiankun 会为每个微应用的容器包裹上一个 shadow dom 节点，从而确保微应用的样式不会对全局造成影响。
  }
});
```
* 显示效果

## 4.2 方式2：通过添加选择前缀解决样式冲突
```js
import { start } from 'qiankun'
// 在启动 qinakun 的时候 
start({
  // 是否开启沙箱，默认为true
  // 默认情况下沙箱可以确保单实例场景子应用之间的样式隔离，但是无法确保主应用跟子应用、或者多实例场景的子应用样式隔离
  sandbox: {
    experimentalStyleIsolation: true // 通过选择器来解决样式冲突
  }
});
```
* 显示效果

![](/imgs/data-qiankun.png)
