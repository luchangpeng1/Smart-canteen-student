import { ElMessage } from 'element-plus'
import router from '@/router'

// 新建错误处理工具
export const errorHandler = {
  handle(error, vm, info) {
    console.error('Error:', error)
    console.error('Component:', vm)
    console.error('Info:', info)
    
    try {
      // 根据错误类型显示不同提示
      if (error.name === 'NetworkError') {
        ElMessage.error('网络连接失败，请检查网络设置')
      } else if (error.response?.status === 401) {
        ElMessage.error('登录已过期，请重新登录')
        router.push('/login')
      } else {
        ElMessage.error(error.message || '操作失败，请重试')
      }
    } catch (e) {
      console.error('Error in error handler:', e)
    }
  }
} 