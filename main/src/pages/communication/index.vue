<template>
  <section class="communication-container">
     <a-button size="large" type="primary" @click="login">action Login</a-button>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// 导入注册好的通信实例
import actions from '@/shared/actions';

@Component
export default class Communication extends Vue {
  mounted() {
    console.log('actions', actions)
    // 注册一个观察者函数
    actions.onGlobalStateChange((state, prevState) => {
      console.log('主应用观察者：token改变前的值为：', prevState.token)
      console.log('主应用观察者：登录状态发生变化后的token值为：', state.token)
    })
  }
  async login() {
    const res = await Promise.resolve({
      data: Math.floor(Math.random() * 1000)
    })
    const token = res.data;
    // 登录成功之后，设置token
    actions.setGlobalState({ token });
    // 跳转 到 home 页
    // this.$router.push('/');
  }
}
</script>

<style lang="less" scoped>
.communication-container {
  padding: 30px;
}
</style>
