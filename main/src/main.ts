import Vue from "vue";
import Antd from "ant-design-vue";
import VueRouter from "vue-router";

import App from "./App.vue";
import routes from "./routes";
import startQiankun from "./micro";
import "./assets/styles/locale.antd.css";

Vue.use(VueRouter);
Vue.use(Antd);
Vue.config.productionTip = false;

startQiankun({
  // 是否开启沙箱，默认为true
  // 默认情况下沙箱可以确保单实例场景子应用之间的样式隔离，但是无法确保主应用跟子应用、或者多实例场景的子应用样式隔离
  sandbox: {
    // strictStyleIsolation: true, // 表示开启严格的样式隔离模式，这种模式下 qiankun 会为每个微应用的容器包裹上一个 shadow dom 节点，从而确保微应用的样式不会对全局造成影响。
    experimentalStyleIsolation: true // 通过选择器来解决样式冲突
  }
});



/**
 * 注册路由实例
 * 即将开始监听 location 变化，触发路由规则
 */
const router = new VueRouter({
  mode: "history",
  routes,
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#main-app");


// 测试   --- start
// import apps from "./micro/apps"
// import { registerMicroApps as myregisterMicroApps, start as myStart} from "../micro-fe"
// myregisterMicroApps(apps)
// myStart()

// 测试 ---- end
