<template>
  <router-view v-slot="{ Component }">
    <!-- 添加页面切换动画 -->
    <transition 
      name="fade"
      mode="out-in"
      @before-leave="beforeLeave"
      @enter="enter"
      @after-enter="afterEnter">
      <keep-alive>
        <component 
          :is="Component" 
          v-if="$route.meta.keepAlive" />
      </keep-alive>
    </transition>
    <transition name="fade" mode="out-in">
      <component 
        :is="Component" 
        v-if="!$route.meta.keepAlive" />
    </transition>
  </router-view>
</template>

<script setup>
import { onMounted } from 'vue'
import { nextTick } from 'vue'
import { App } from '@capacitor/app'
import { StatusBar } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'

// 初始化Capacitor功能
onMounted(async () => {
  // 检查是否在移动端环境
  const isMobileApp = window.Capacitor && window.Capacitor.isNative

  if (isMobileApp) {
    // 设置状态栏
    try {
      await StatusBar.setBackgroundColor({ color: '#FFFFFF' })
      await StatusBar.setStyle({ style: 'dark' })
    } catch (e) {
      console.warn('Status bar not available', e)
    }

    // 处理返回按钮
    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back()
      } else {
        App.exitApp()
      }
    })

    // 隐藏启动画面
    await SplashScreen.hide()
  }
})

// 页面切换过渡钩子
const beforeLeave = (el) => {
  // 离开前保存滚动位置
  el._scrollPosition = window.scrollY
}

const enter = (el) => {
  // 进入时恢复滚动位置
  if(el._scrollPosition) {
    nextTick(() => {
      window.scrollTo(0, el._scrollPosition)
    })
  }
}

const afterEnter = () => {
  // 过渡完成后清理
  window.scrollTo(0, 0)
}
</script>

<style>
:root {
  /* 主题色 */
  --primary-color: #3B82F6;
  --primary-light: #60A5FA;
  --primary-dark: #2563EB;
  --primary-gradient: linear-gradient(135deg, #3B82F6, #2563EB);
  
  /* 功能色 */
  --success-color: #10B981;
  --warning-color: #F59E0B;
  --danger-color: #EF4444;
  --info-color: #6B7280;
  
  /* 中性色 */
  --text-primary: #1F2937;
  --text-regular: #4B5563;
  --text-secondary: #9CA3AF;
  --border-color: #E5E7EB;
  --background: #F3F4F6;
  
  /* 投影 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  /* 圆角 */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  
  /* 动画 */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.25s ease;
  --transition-slow: 0.35s ease;
}

/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: var(--text-primary);
  background: var(--background);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Element Plus 主题覆盖 */
:deep(.el-button--primary) {
  background: var(--primary-gradient);
  border: none;
  font-weight: 500;
}

:deep(.el-button--primary:hover) {
  opacity: 0.9;
  transform: translateY(-1px);
}

:deep(.el-card) {
  border: none;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
}

:deep(.el-card:hover) {
  box-shadow: var(--shadow-md);
}

/* 统一卡片样式 */
.app-card {
  background: white;
  border-radius: var(--radius-md);
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-normal);
}

.app-card:hover {
  box-shadow: var(--shadow-md);
}

/* 底部导航栏样式 */
.nav-bar {
  background: white;
  border-top: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(10px);
}

.nav-item {
  color: var(--text-secondary);
  transition: var(--transition-fast);
}

.nav-item.active {
  color: var(--primary-color);
}

/* 页面过渡动画 */
.page-enter-active,
.page-leave-active {
  transition: opacity var(--transition-normal);
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* 加载状态样式 */
.loading-skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  :root {
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
  }
  
  .app-card {
    padding: 0.75rem;
  }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  :root {
    --text-primary: #F9FAFB;
    --text-regular: #D1D5DB;
    --text-secondary: #9CA3AF;
    --border-color: #374151;
    --background: #111827;
    
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
  }
  
  .app-card,
  :deep(.el-card) {
    background: #1F2937;
  }
  
  .nav-bar {
    background: rgba(31, 41, 55, 0.8);
  }
}

/* 优化过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 优化滚动性能 */
* {
  -webkit-overflow-scrolling: touch;
}

/* 禁用不必要的动画 */
* {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

/* 使用硬件加速 */
.page-content {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
}
</style> 