import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { errorHandler } from './utils/errorHandler'

const app = createApp(App)
const pinia = createPinia()

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 全局注册 Element Plus
app.use(ElementPlus, {
  locale: zhCn
})

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  // 忽略 ResizeObserver 错误
  if (err.message?.includes('ResizeObserver')) {
    return
  }
  errorHandler.handle(err, vm, info)
}

// 浏览器错误处理
window.onerror = (msg, src, line, col, error) => {
  // 忽略 ResizeObserver 错误
  if (msg.includes('ResizeObserver')) {
    return true
  }
  errorHandler.handle(error || new Error(msg))
  return true
}

app.use(store)
app.use(pinia)
app.use(router)

app.mount('#app') 