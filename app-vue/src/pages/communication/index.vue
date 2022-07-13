<template>
  <section>
    <a-card title="Vue 微应用shared通信页">
      <h2>姓名：{{info.name}}</h2>
    </a-card>
  </section>
</template>

<script>
import sharedModule from "@/shared/index"
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
    const shared = sharedModule.getShared()
    const token = shared.getToken()
    if (!token) {
        this.$message.error("未检测到登录信息");
        this.$router.push('/')
        return
      }
      this.info = {
        name: '张三'
    }
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
