// 子应用自身的 shared ,子应用独立运行时将使用该 shared ,子应用的 shared 使用 localStorage 来操作 token
class Shared {
  /**
   * 获取 Token
   */
  getToken() {
    // 子应用独立运行时，在 localStorage 中获取 token
    return localStorage.getItem("token") || "";
  }

  /**
   * 设置 Token
   */
  setToken(token) {
    // 子应用独立运行时，在 localStorage 中设置 token
    localStorage.setItem("token", token);
  }
}

// 用于管理 shared ,例如重载 shared 实例、获取 shared实例
class SharedModule {
  static shared = new Shared();

  /**
   * 重载 shared
   */
  static overloadShared(shared) {
    SharedModule.shared = shared;
  }

  /**
   * 获取 shared 实例
   */
  static getShared() {
    return SharedModule.shared;
  }
}

export default SharedModule;