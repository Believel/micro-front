import Home from "@/pages/home/index.vue";
// 第一种通信： actions
import Communication from "@/pages/communication/index.vue";
// 第二种通信：shared
import Login from "@/pages/login/index.vue"

const routes = [
  {
    /**
     * path: 路径为 / 时触发该路由规则
     * name: 路由的 name 为 Home
     * component: 触发路由时加载 `Home` 组件
     */
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: '/commu',
    name: "Communication",
    component: Communication
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  }
];

export default routes;
