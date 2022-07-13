<template>
  <section class="login-container">
    <a-button size="large" type="primary" @click="login">shared Login</a-button>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
/* eslint-disable */
import VueRouter from "vue-router";

import shared from "@/shared";
import { ApiLogin } from "@/apis";

@Component
export default class Login extends Vue {
  $router!: VueRouter;

  async login() {
    const result = await ApiLogin();
    const token = result.data;

    // 使用 shared 的 setToken 记录 token
    shared.setToken(token);
    this.$router.push("/");
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/styles/flex.less";

.login-container {
  padding: 30px;
}
</style>
