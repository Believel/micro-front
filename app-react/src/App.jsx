import React, { Suspense, useState, useEffect } from "react";
import { Menu } from "antd";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import Home from "./pages/home";
// 子应用 action 通信 demo
import List from "./pages/list";

// 子应用shared 通信 demo
import Communication from "./pages/communication";

const menus = [
  {
    key: "react",
    route: "/",
    title: "主页",
  },
  {
    key: "react-list",
    route: "/list",
    title: "action通信页",
  },
  {
    key: "react-commuication",
    route: "/communication",
    title: "shared 通信页"
  }
];

const BASE_NAME = window.__POWERED_BY_QIANKUN__ ? "/react" : "";
const App = () => {
  const [refresh, setRefresh] = useState(0);
  const [selectedKeys, setSelectKeys] = useState(["react"]);
  useEffect(() => {
    const { pathname } = window.location;
    const menu = menus.find((item) => `${BASE_NAME}${item.route}` === pathname);
    setSelectKeys(() => [menu ? menu.key : "react"]);
  }, [refresh]);

  // 设置路由命名空间
  return (
    <Router basename={BASE_NAME}>
      <section>
        <Menu
          onClick={() => setRefresh((refresh) => ++refresh)}
          selectedKeys={selectedKeys}
          mode="horizontal"
        >
          {menus.map((item) => (
            <Menu.Item key={item.key}>
              <Link to={item.route}>{item.title}</Link>
            </Menu.Item>
          ))}
        </Menu>
        <Suspense fallback={null}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/list" component={List} />
            <Route path="/communication" component={Communication}/>
          </Switch>
        </Suspense>
      </section>
    </Router>
  );
};

export default App;
