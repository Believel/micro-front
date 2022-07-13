// import axios from "axios";

// const instance = axios.create({
//   baseURL: "",
// });

// instance.interceptors.response.use(reply => reply.data);

/**
 * 快速登录
 */
export const ApiLogin = () => {
  return Promise.resolve({
    data: Math.floor(Math.random() * 1000) + ""
  })
};
