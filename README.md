# 微前端架qiankun

## 介绍

> 微前端是一种类似于微服务的架构，它将微服务的理念应用于浏览器端，即将单页面前端应用由单一的单体应用转变为多个小型前端应用聚合为一的应用。各个前端应用还可以独立开发、独立部署。同时，它们也可以在共享组件的同时进行并行开发——这些组件可以通过 NPM 或者 Git Tag、Git Submodule 来管理。

本项目是基于 `qiankun` 搭建的微前端架构。

## 内容包括
1. qiankun 基本使用
2. qiankun 实现原理

## 如何运行
### 单个运行
1. 主应用
```js
cd main
yarn serve
// http://localhost:9999/
```
2. 微应用 - react
```js
cd app-react
yarn start
// http://localhost:3000
```
3. 微应用 - vue
```js
cd app-vue
yarn serve
// http://localhost:3001
```
4. 微应用 - static
```js
cd app-static
yarn start
// http://localhost:3002
```

### 全量运行
```js
yarn install
yarn examples:install
yarn examples:start
```



## 关于跨域

由于 `qiankun` 内部使用的是 `Fetch HTML` 的方式加载子应用，所以会遇到跨域问题。我们需要先解决跨域问题，使我们的主应用可以正常加载子应用相关资源。

在开发环境下，本项目配置了跨域解决方案，所以在直接运行项目并不会遇到跨域问题。

生产环境的跨域问题可以参考 `应用部署篇` 的方案。