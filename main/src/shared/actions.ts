// 第一中通信方式：qiankun官方提供的 - actions
// initGlobalState方法用于注册 MicroAppStateActions 实例用于通信，该实例有三个方法，分别是：
// 1. setGlobalState: 设置 globalState 设置新的值时，内部将执行浅检查，如果检查到 globalState 发生改变则触发通知，通知所有的观察者函数
// 2. onGlobalStateChange: 注册 观察者 函数 - 响应 globalState 变化，在 globalState 发生变化时触发该观察者函数
// 3. offGlobalStateChange: 取消观察者函数 - 该实例不再响应 globalState 变化。
import { initGlobalState, MicroAppStateActions } from "qiankun";

const initialState = {};
// 定义全局状态，并返回通信方法，建议在主应用使用，微应用通过 props 获取通信方法
const actions: MicroAppStateActions = initGlobalState(initialState);

export default actions;