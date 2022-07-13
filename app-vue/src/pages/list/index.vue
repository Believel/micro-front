<template>
  <section>
    <a-card title="Vue 微应用action通信页">
      <h2>姓名：{{info.name}}</h2>
    </a-card>
  </section>
</template>

<script>
import actions from "@/shared/actions"
export default {
  name: "List",

  data() {
    return {
      info: {
        name: ""
      }
    }
  },
  mounted() {
    // 注册观察者函数
    actions.onGlobalStateChange(state => {
      const { token } = state
      if (!token) {
        this.$message.error("未检测到登录信息");
        this.$router.push('/')
        return
      }
      this.info = {
        name: '张三'
      }
    }, true)
  },
  
  methods: {
    
  }
}
</script>

<style lang="less" scoped>
.old-title {
  font-size: 26px;
  color: #fb4487;
}
</style>
