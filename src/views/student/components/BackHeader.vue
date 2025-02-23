<template>
  <div class="back-header">
    <el-button link @click="goBack">
      <el-icon><ArrowLeft /></el-icon>
      返回
    </el-button>
    <span class="title">{{ title }}</span>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

export default {
  name: 'BackHeader',
  components: { ArrowLeft },
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup() {
    const router = useRouter()
    
    const goBack = () => {
      router.push('/student/profile')
    }
    
    return { goBack }
  }
}
</script>

<style scoped>
.back-header {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
  background: #fff;
}

.title {
  margin-left: 8px;
  font-size: 16px;
  font-weight: 500;
}
</style> 