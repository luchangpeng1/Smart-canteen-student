<template>
  <div class="layout-root">
    <div class="status-bar"></div>
    <div class="student-layout">
      <el-container>
        <el-header>
          <div class="header-title">GUET智慧食堂</div>
        </el-header>

        <el-main>
          <div 
            class="touch-container"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
          >
            <router-view v-slot="{ Component }">
              <transition
                name="page"
                mode="out-in"
                @enter="enter"
                @leave="leave"
                :css="false"
              >
                <keep-alive :include="['DishList', 'OrderList']">
                  <component 
                    :is="Component" 
                    class="page-container"
                    :style="{ zIndex: transitionDepth }"
                  />
                </keep-alive>
              </transition>
            </router-view>
          </div>
        </el-main>

        <el-footer height="55px" class="footer">
          <div class="nav-buttons">
            <div class="nav-button" :class="{ active: isActive('/home') }" @click="navigateTo('/home')">
              <el-icon><Food /></el-icon>
              <div class="button-text">首页</div>
            </div>
            <div class="nav-button" :class="{ active: isActive('/recommendations') }" @click="navigateTo('/recommendations')">
              <el-icon><ChatSquare /></el-icon>
              <div class="button-text">推荐广场</div>
            </div>
            <div class="nav-button" :class="{ active: isActive('/ai-chat') }" @click="navigateTo('/ai-chat')">
              <el-icon><ChatDotRound /></el-icon>
              <div class="button-text">AI助手</div>
            </div>
            <div class="nav-button" :class="{ active: isActive('/orders') }" @click="navigateTo('/orders')">
              <el-icon><List /></el-icon>
              <div class="button-text">订单</div>
            </div>
            <div class="nav-button" :class="{ active: isActive('/profile') }" @click="navigateTo('/profile')">
              <el-icon><User /></el-icon>
              <div class="button-text">我的</div>
            </div>
          </div>
        </el-footer>
      </el-container>
    </div>
  </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { provide, ref, onMounted } from 'vue'
import { Food, List, User, ChatSquare, ChatDotRound } from '@element-plus/icons-vue'
import gsap from 'gsap'

export default {
  name: 'StudentLayout',
  components: {
    Food,
    List,
    User,
    ChatSquare,
    ChatDotRound
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const activeTab = ref(router.currentRoute.value.path)
    const transitionDepth = ref(0)
    
    // 测试数据 - 食堂状态
    const canteenStatus = ref({
      '中央食堂': true,
      '沁园餐厅': true,
      '馨园餐厅': false,  // 已打烊
      '仲园餐厅': true,
      '雅园餐厅': true,
      '服务点': false,    // 已打烊
    })

    // 测试数据 - 窗口信息
    const floorWindows = ref({
      '中央食堂': {
        1: [
          { id: 1, name: '特色炒菜', operatingHours: '10:30-13:30, 16:30-19:00', status: true },
          { id: 2, name: '面食档口', operatingHours: '10:30-13:30, 16:30-19:00', status: true },
          { id: 3, name: '盖浇饭', operatingHours: '10:30-13:30, 16:30-19:00', status: false },
        ],
        2: [
          { id: 4, name: '清真档口', operatingHours: '10:30-13:30, 16:30-19:00', status: true },
          { id: 5, name: '粥品档口', operatingHours: '07:00-09:00', status: false },
        ],
        3: [
          { id: 6, name: '自选档口', operatingHours: '10:30-13:30, 16:30-19:00', status: true },
        ]
      },
      '沁园餐厅': {
        1: [
          { id: 7, name: '快餐', operatingHours: '10:30-13:30, 16:30-19:00', status: true },
          { id: 8, name: '小炒', operatingHours: '10:30-13:30, 16:30-19:00', status: true },
        ],
        2: [
          { id: 9, name: '面档', operatingHours: '10:30-13:30, 16:30-19:00', status: true },
        ]
      }
    })

    // 测试数据 - 拥挤程度
    const crowdLevels = ref({
      '中央食堂': { type: 'warning', text: '较拥挤' },
      '沁园餐厅': { type: 'success', text: '空闲' },
      '馨园餐厅': { type: 'info', text: '已打烊' },
      '仲园餐厅': { type: 'danger', text: '拥挤' },
      '雅园餐厅': { type: 'success', text: '空闲' },
      '服务点': { type: 'info', text: '已打烊' },
    })

    // 测试数据 - 窗口菜品数量
    const windowDishCounts = ref({
      1: 15,
      2: 8,
      3: 12,
      4: 10,
      5: 6,
      6: 20,
      7: 8,
      8: 12,
      9: 5,
    })

    // 提供函数实现
    const isCanteenOpen = (canteen) => canteenStatus.value[canteen?.name || canteen] || false
    const getFloorWindows = (canteenName, floor) => floorWindows.value[canteenName]?.[floor] || []
    const isWindowOpen = (window) => window?.status ?? false
    const getCrowdLevelType = (canteenName) => crowdLevels.value[canteenName]?.type || 'info'
    const getCrowdLevelText = (canteenName) => crowdLevels.value[canteenName]?.text || '未知'
    const getWindowDishCount = (windowId) => windowDishCounts.value[windowId] || 0

    // 提供给子组件
    provide('isCanteenOpen', isCanteenOpen)
    provide('getFloorWindows', getFloorWindows)
    provide('isWindowOpen', isWindowOpen)
    provide('getCrowdLevelType', getCrowdLevelType)
    provide('getCrowdLevelText', getCrowdLevelText)
    provide('getWindowDishCount', getWindowDishCount)

    // 判断当前路由是否激活
    const isActive = (path) => {
      if (!path.startsWith('/student/')) {
        path = '/student' + path
      }
      return route.path === path
    }

    // 导航处理函数
    const navigateTo = (path) => {
      if (!path.startsWith('/student/')) {
        path = '/student' + path
      }
      router.push(path)
    }

    // 添加状态栏高度检测
    onMounted(() => {
      // 获取状态栏高度
      const statusBarHeight = window.statusBarHeight || 0
      document.documentElement.style.setProperty('--status-bar-height', `${statusBarHeight}px`)
      
      // 获取底部安全区域高度
      const safeAreaBottom = window.safeAreaInsetBottom || 0
      document.documentElement.style.setProperty('--safe-area-inset-bottom', `${safeAreaBottom}px`)
    })

    // 进入动画
    const enter = (el, done) => {
      transitionDepth.value += 1
      
      gsap.fromTo(el,
        {
          opacity: 0,
          scale: 0.98,
          x: 40,
        },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 0.6,
          ease: 'power3.out',
          onComplete: done
        }
      )
    }

    // 离开动画
    const leave = (el, done) => {
      gsap.to(el,
        {
          opacity: 0,
          scale: 0.98,
          x: -40,
          duration: 0.4,
          ease: 'power3.in',
          onComplete: done
        }
      )
      
      transitionDepth.value -= 1
    }

    // 添加触摸相关的状态
    const touchStart = ref({ x: 0, y: 0 })
    const touchEnd = ref({ x: 0, y: 0 })
    const minSwipeDistance = 50 // 最小滑动距离
    const maxVerticalDistance = 50 // 最大垂直移动距离

    // 路由页面顺序配置
    const pageOrder = [
      '/student/home',
      '/student/recommendations',
      '/student/ai-chat',
      '/student/orders',
      '/student/profile'
    ]

    // 获取当前页面索引
    const getCurrentPageIndex = () => {
      return pageOrder.findIndex(path => route.path === path)
    }

    // 处理触摸开始
    const handleTouchStart = (event) => {
      touchStart.value = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      }
    }

    // 处理触摸移动
    const handleTouchMove = (event) => {
      touchEnd.value = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      }
    }

    // 处理触摸结束
    const handleTouchEnd = () => {
      const deltaX = touchEnd.value.x - touchStart.value.x
      const deltaY = Math.abs(touchEnd.value.y - touchStart.value.y)
      const currentIndex = getCurrentPageIndex()

      // 如果垂直移动距离太大，不触发页面切换
      if (deltaY > maxVerticalDistance) return

      // 检查是否满足最小滑动距离
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0 && currentIndex > 0) {
          // 向右滑动，切换到上一页
          router.push(pageOrder[currentIndex - 1])
        } else if (deltaX < 0 && currentIndex < pageOrder.length - 1) {
          // 向左滑动，切换到下一页
          router.push(pageOrder[currentIndex + 1])
        }
      }
    }

    return {
      isActive,
      navigateTo,
      activeTab,
      // 图标组件
      Food,
      List,
      User,
      ChatSquare,
      ChatDotRound,
      enter,
      leave,
      transitionDepth,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd
    }
  }
}
</script>

<style scoped>
.layout-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.status-bar {
  height: var(--status-bar-height, 0px);
  width: 100%;
  background-color: #fff;
}

.student-layout {
  height: calc(100vh - var(--status-bar-height, 0px));
  display: flex;
  flex-direction: column;
  perspective: 1000px;
  transform-style: preserve-3d;
}

.el-container {
  height: 100%;
}

.el-header {
  padding: 0 12px;
  height: 44px !important;
  line-height: 44px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
}

.header-right {
  margin-right: 20px;
}

.el-main {
  padding: 10px 8px;
  padding-bottom: calc(55px + var(--safe-area-inset-bottom, 0px));
  overflow-y: auto;
  flex: 1;
  -webkit-overflow-scrolling: touch;
  background-color: #f5f7fa;
  position: relative;
}

.footer {
  padding: 0;
  border-top: 1px solid #f5f5f5;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  box-shadow: 0 -1px 8px rgba(0, 0, 0, 0.05);
  padding-bottom: var(--safe-area-inset-bottom, 0px);
  width: 100%;
  z-index: 100;
}

.nav-buttons {
  display: flex;
  height: 100%;
  width: 100%;
}

.nav-button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6px 0;
  cursor: pointer;
  user-select: none;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background-color: transparent;
  border: none;
  outline: none;
}

.nav-button:active {
  transform: scale(0.95);
}

.nav-button.active {
  color: var(--el-color-primary);
}

.nav-button .el-icon {
  font-size: 24px;
  margin-bottom: 4px;
  color: #909399;
  transition: all 0.3s ease;
}

.nav-button.active .el-icon {
  color: var(--el-color-primary);
  transform: scale(1.1);
}

.button-text {
  font-size: 12px;
  color: #909399;
  transition: all 0.3s ease;
}

.nav-button.active .button-text {
  color: var(--el-color-primary);
  font-weight: 500;
}

/* 添加按钮点击涟漪效果 */
.nav-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background-color: var(--el-color-primary);
  opacity: 0;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.3s ease, opacity 0.3s ease;
  border-radius: 50%;
}

.nav-button:active::after {
  transform: translate(-50%, -50%) scale(1);
  opacity: 0.1;
}

/* 页面容器基础样式 */
.page-container {
  width: 100%;
  height: calc(100vh - 44px - 55px - var(--status-bar-height, 0px) - var(--safe-area-inset-bottom, 0px));
  contain: content;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  will-change: transform, opacity;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
}

/* 降级备用动画 */
.page-enter-active,
.page-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.98);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-40px) scale(0.98);
}

.touch-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style> 