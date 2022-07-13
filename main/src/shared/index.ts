// 第二种通信方式- shared 
// 原理：主应用基于redux维护一个状态池，通过shared实例暴露一些方法给子应用使用。同时，子应用需要单独维护一份shared实例，在独立运行时使用自身的shared实例，在嵌入主应用时使用主应用的shared实例，这样就可以保证在使用和表现上一致。
import store from "./store";

class Shared {
  /**
   * 获取 Token
   */
  public getToken(): string {
    const state = store.getState();
    return state.token || "";
  }

  /**
   * 设置 Token
   */
  public setToken(token: string): void {
    // 将 token 的值记录在 store 中
    store.dispatch({
      type: "SET_TOKEN",
      payload: token
    });
  }
}

const shared = new Shared();
export default shared;