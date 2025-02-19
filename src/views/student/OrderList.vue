<template>
  <div class="order-list-container">
    <div class="order-list">
      <div class="page-header">
        <div class="header-left">
          <h2 class="page-title">我的订单</h2>
          <div class="order-stats">
            <div class="stat-card">
              <span class="stat-item">
                <strong>{{ ongoingOrders.length }}</strong>
                <span>进行中</span>
                <small>预计15分钟内可取餐</small>
              </span>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索订单..."
            prefix-icon="Search"
            clearable
            class="search-input"
          />
          <el-button class="refresh-btn" @click="refreshOrders">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
          <el-button 
            type="primary" 
            class="history-btn"
            @click="goToHistory">
            <el-icon><Calendar /></el-icon>
            历史订单
          </el-button>
        </div>
      </div>

      <div v-if="hasReadyOrder" class="order-alert">
        <el-alert
          type="success"
          show-icon
          :closable="false">
          <template #title>
            <span class="alert-content">
              您有订单可以取餐啦！请尽快前往取餐点取餐
              <el-button type="success" link @click="scrollToReadyOrder">
                查看订单 <el-icon><ArrowRight /></el-icon>
              </el-button>
            </span>
          </template>
        </el-alert>
      </div>

      <el-tabs v-model="activeTab" class="custom-tabs">
        <el-tab-pane label="进行中" name="ongoing">
          <div class="filter-bar">
            <el-radio-group v-model="orderFilter" size="small">
              <el-radio-button value="all">全部</el-radio-button>
              <el-radio-button value="preparing">制作中</el-radio-button>
              <el-radio-button value="ready">待取餐</el-radio-button>
            </el-radio-group>
          </div>

          <el-empty 
            v-if="filteredOngoingOrders.length === 0" 
            description="暂无进行中的订单"
            :image-size="120">
            <template #image>
              <el-icon class="empty-icon"><TakeawayBox /></el-icon>
            </template>
            <template #description>
              <p class="empty-text">暂无进行中的订单</p>
              <el-button type="primary" @click="goToHome">去点餐</el-button>
            </template>
          </el-empty>
          
          <div class="order-grid">
            <el-card 
              v-for="order in filteredOngoingOrders" 
              :key="order.id" 
              class="order-card"
              :class="{ 'ready-status': order.status === 'ready' }"
              :ref="order.status === 'ready' ? 'readyOrder' : null">
              <div class="status-badge" :class="order.status">
                {{ getStatusText(order.status) }}
              </div>
              
              <div class="order-header">
                <div class="window-info">
                  <el-icon><Shop /></el-icon>
                  <div class="location-info">
                    <span class="canteen-name">{{ order.canteenName }}</span>
                    <span class="window-name">{{ order.windowName }}</span>
                  </div>
                </div>
                <span class="order-time">{{ order.createTime }}</span>
              </div>

              <div class="order-content">
                <div class="dish-list">
                  <div class="dish-item" v-for="dish in order.dishes" :key="dish.id">
                    <div class="dish-image">
                      <img :src="dish.image_url" :alt="dish.name">
                    </div>
                    <div class="dish-content">
                      <div class="dish-info">
                        <div class="dish-name-wrapper">
                          <span class="dish-name">{{ dish.name }}</span>
                        </div>
                        <div class="dish-price-wrapper">
                          <span class="dish-quantity">x{{ dish.quantity }}</span>
                          <span class="dish-price">¥{{ dish.price.toFixed(2) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="order-progress" v-if="order.status !== 'cancelled'">
                  <el-steps :active="getProgressStep(order.status)" finish-status="success">
                    <el-step title="已接单" />
                    <el-step title="制作中" />
                    <el-step title="待取餐" />
                  </el-steps>
                </div>

                <div class="order-footer">
                  <div class="price-info">
                    <span class="total-label">合计</span>
                    <span class="total-price">¥{{ order.totalPrice.toFixed(2) }}</span>
                  </div>
                  <div class="actions">
                    <el-popconfirm
                      v-if="order.status === 'ordered'"
                      title="确定要取消订单吗？"
                      confirm-button-text="确定"
                      cancel-button-text="再想想"
                      @confirm="cancelOrder(order)">
                      <template #reference>
                        <el-button type="danger" plain size="small">
                          取消订单
                        </el-button>
                      </template>
                    </el-popconfirm>
                    <el-button 
                      type="primary" 
                      link
                      size="small"
                      @click="viewOrderDetail(order)">
                      查看详情
                    </el-button>
                  </div>
                </div>
              </div>

              <div class="waiting-time" v-if="order.status === 'preparing'">
                <el-icon><Timer /></el-icon>
                预计等待时间：{{ order.estimatedTime || '15' }}分钟
              </div>

              <div class="pickup-info" v-if="order.status === 'ready'">
                <div class="pickup-header">
                  <el-icon><Bell /></el-icon>
                  <span>您的餐品已准备就绪</span>
                </div>
                <div class="pickup-location">
                  取餐点：{{ order.pickupLocation || '一楼取餐处' }}
                </div>
                <el-button 
                  type="success" 
                  class="show-qr-btn" 
                  @click="showQRCode(order)">
                  <el-icon><Ticket /></el-icon>
                  显示取餐码
                </el-button>
                <div class="pickup-tips">
                  <p>请在15分钟内完成取餐</p>
                  <p>为保证餐品品质，请尽快取餐</p>
                </div>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>

      <el-dialog
        v-model="qrDialogVisible"
        title="取餐码"
        width="300px"
        center
        class="qr-dialog"
        :show-close="true"
        :close-on-click-modal="false"
        :modal="false">
        <div class="qr-dialog-content">
          <div class="qr-header">
            <div class="window-info">
              <span class="canteen-name">{{ currentOrder?.canteenName }}</span>
              <span class="window-name">{{ currentOrder?.windowName }}</span>
              <span class="pickup-location">{{ currentOrder?.pickupLocation }}</span>
            </div>
            <div class="order-info">
              <span class="order-time">{{ currentOrder?.createTime }}</span>
              <span class="order-amount">¥{{ currentOrder?.totalPrice.toFixed(2) }}</span>
            </div>
          </div>
          
          <div class="qr-code-wrapper">
            <qrcode-vue
              v-if="currentOrder"
              :value="generateQRValue(currentOrder)"
              :size="200"
              level="H"
              class="pickup-qr"
              render-as="svg"
            />
            <div class="qr-border"></div>
          </div>

          <div class="qr-footer">
            <div class="qr-tip">
              <el-icon><Ticket /></el-icon>
              <span>请向取餐人员出示此码</span>
            </div>
            <div class="validity-info">
              <el-icon><Timer /></el-icon>
              <span>有效期15分钟</span>
            </div>
          </div>
        </div>
      </el-dialog>

      <div class="test-button" v-if="isDevelopment">
        <el-button 
          type="warning" 
          circle 
          @click="testFeatures"
          class="float-button test-float-button">
          <el-icon><Tools /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Calendar, 
  Shop, 
  TakeawayBox,
  Check,
  Refresh,
  Timer,
  ArrowRight,
  Bell,
  Ticket,
  Tools
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import QrcodeVue from 'qrcode.vue'

export default {
  name: 'OrderList',
  components: {
    Calendar,
    Shop,
    TakeawayBox,
    Check,
    Refresh,
    Timer,
    ArrowRight,
    Bell,
    QrcodeVue,
    Ticket,
    Tools
  },
  setup() {
    const router = useRouter()
    const activeTab = ref('ongoing')
    const ongoingOrders = ref([])

    // 测试数据
    const mockOrders = [
      {
        id: 1,
        canteenName: '第一食堂',
        windowName: '特色炒菜',
        status: 'preparing',
        dishes: [
          { id: 1, name: '宫保鸡丁', quantity: 1, price: 15 },
          { id: 2, name: '青椒肉丝', quantity: 1, price: 12 }
        ],
        totalPrice: 27,
        createTime: '2024-01-20 12:30:00',
        pickupLocation: '一楼3号窗口',
        estimatedTime: '5'
      },
      {
        id: 2,
        canteenName: '第二食堂',
        windowName: '面食档口',
        status: 'preparing',
        dishes: [
          { id: 3, name: '牛肉面', quantity: 1, price: 18 },
          { id: 4, name: '煎蛋', quantity: 1, price: 2 }
        ],
        totalPrice: 20,
        createTime: '2024-01-20 12:35:00',
        pickupLocation: '一楼1号窗口',
        estimatedTime: '10'
      },
      {
        id: 3,
        canteenName: '第一食堂',
        windowName: '盖浇饭窗口',
        status: 'ready',
        dishes: [
          { id: 5, name: '红烧排骨饭', quantity: 1, price: 22 }
        ],
        totalPrice: 22,
        createTime: '2024-01-20 12:25:00',
        pickupLocation: '一楼2号窗口',
        pickupCode: 'B789'
      }
    ]

    const getStatusType = (status) => {
      const types = {
        ordered: 'info',
        preparing: 'primary',
        ready: 'success',
        completed: 'info',
        cancelled: 'danger'
      }
      return types[status] || 'info'
    }

    const getStatusText = (status) => {
      const texts = {
        ordered: '已接单',
        preparing: '制作中',
        ready: '待取餐',
        completed: '已完成',
        cancelled: '已取消'
      }
      return texts[status] || '未知状态'
    }

    const goToHistory = () => {
      router.push('/student/order-history')
    }

    const requestNotificationPermission = async () => {
      try {
        if ('Notification' in window) {
          const permission = await Notification.requestPermission()
          if (permission === 'denied') {
            ElMessage({
              message: '为了及时收到取餐通知，建议您允许通知权限',
              type: 'warning',
              duration: 5000,
              showClose: true
            })
          }
        }
      } catch (error) {
        console.warn('通知权限请求失败:', error)
      }
    }

    onMounted(() => {
      // 修改加载数据逻辑，只加载进行中的订单
      ongoingOrders.value = mockOrders.filter(order => 
        ['preparing', 'ready'].includes(order.status)
      )

      // 模拟定时检查订单状态（实际项目中应该使用WebSocket）
      setInterval(mockStatusUpdate, 30000) // 每30秒检查一次

      // 添加测试事件监听
      document.addEventListener('test-notification', testNotification)
      document.addEventListener('test-vibration', testVibration)

      // 只在首次加载时请求通知权限
      if (localStorage.getItem('notificationRequested') !== 'true') {
        requestNotificationPermission()
        localStorage.setItem('notificationRequested', 'true')
      }
    })

    // 在组件卸载时清定时器
    onUnmounted(() => {
      clearInterval(mockStatusUpdate)

      // 移除测试事件监听
      document.removeEventListener('test-notification', testNotification)
      document.removeEventListener('test-vibration', testVibration)
    })

    // 获取订单进度步骤
    const getProgressStep = (status) => {
      const steps = {
        'ordered': 1,
        'preparing': 2,
        'ready': 3,
        'completed': 3
      }
      return steps[status] || 0
    }

    const orderFilter = ref('all')
    const searchKeyword = ref('')
    const readyOrderRef = ref(null)

    // 计算属性：过滤后的订单列表
    const filteredOngoingOrders = computed(() => {
      let result = ongoingOrders.value
      
      // 应用状态筛选
      if (orderFilter.value !== 'all') {
        result = result.filter(order => order.status === orderFilter.value)
      }
      
      // 应用搜索关键词
      if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase()
        result = result.filter(order => 
          order.windowName.toLowerCase().includes(keyword) ||
          order.dishes.some(dish => dish.name.toLowerCase().includes(keyword))
        )
      }
      
      return result
    })

    // 检查是否有待取餐订单
    const hasReadyOrder = computed(() => {
      return ongoingOrders.value.some(order => order.status === 'ready')
    })

    // 刷新订单列表
    const refreshOrders = async () => {
      // 实际项目中这里应该调用API刷新数据
      ElMessage.success('订单已更新')
    }

    // 滚动到待取餐订单
    const scrollToReadyOrder = () => {
      if (readyOrderRef.value) {
        readyOrderRef.value.$el.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
      }
    }

    // 跳转到点餐页面
    const goToHome = () => {
      router.push('/student/home')
    }


    // 生成二维码内容
    const generateQRValue = (order) => {
      if (!order) return ''
      
      // 创建包含必要信息的对象
      const qrData = {
        orderId: order.id,
        userId: localStorage.getItem('userId'), // 从登录信息中获取
        windowId: order.windowId,
        timestamp: new Date(order.createTime).getTime(),
        dishes: order.dishes.map(dish => ({
          id: dish.id,
          name: dish.name,
          quantity: dish.quantity
        }))
      }
      
      // 添加签名以增加安全性（实际项目中应该使用更安全的加密方法）
      const signature = `${qrData.orderId}-${qrData.timestamp}-${qrData.userId}`
      qrData.sign = signature
      
      // 将对象转换为字符串
      return JSON.stringify(qrData)
    }

    const qrDialogVisible = ref(false)
    const currentOrder = ref(null)

    // 显示二维码弹窗
    const showQRCode = (order) => {
      currentOrder.value = order
      qrDialogVisible.value = true
    }

    // 取消订单
    const cancelOrder = async (order) => {
      try {
        // 这里应该调用API取消订单
        await new Promise(resolve => setTimeout(resolve, 1000))
        ElMessage.success('订单已取消')
        // 更新订
        const index = ongoingOrders.value.findIndex(o => o.id === order.id)
        if (index !== -1) {
          ongoingOrders.value[index].status = 'cancelled'
          ongoingOrders.value.splice(index, 1)
        }
      } catch (error) {
        ElMessage.error('取消订单失败，请重试')
      }
    }

    // 监听订单状态变化
    const watchOrderStatus = (order) => {
      if (order.status === 'ready') {
        // 显示通知
        showNotification(order)
        // 震动提醒
        vibrateDevice()
        // 显示提示弹窗
        ElMessage({
          message: '您的餐品已准备就绪，请及时取餐！',
          type: 'success',
          duration: 5000,
          showClose: true,
          customClass: 'ready-notification'
        })
      }
    }

    // 显示系统通知
    const showNotification = (order) => {
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('餐品已准备就绪', {
              body: `您在${order.windowName}的餐品已准备完成，请及时取餐`,
              icon: '/favicon.ico', // 添加应用图标
              tag: 'food-ready',
              renotify: true
            })
          }
        })
      }
    }

    // 设备震动
    const vibrateDevice = () => {
      if ('vibrate' in navigator) {
        // 震动模式：震动200ms，暂停100ms，再震动200ms
        navigator.vibrate([200, 100, 200])
      }
    }

    // 模拟订单状态更新（实际项目中应该通过WebSocket或轮询获取）
    const mockStatusUpdate = () => {
      const preparingOrders = ongoingOrders.value.filter(order => order.status === 'preparing')
      if (preparingOrders.length > 0) {
        const randomOrder = preparingOrders[Math.floor(Math.random() * preparingOrders.length)]
        randomOrder.status = 'ready'
        watchOrderStatus(randomOrder)
      }
    }

    // 判断是否为开发环境
    const isDevelopment = ref(import.meta.env.MODE === 'development')

    // 测试功能相关函数
    const testNotification = () => {
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            ElMessage.success('测试：通知权限已获取')
          } else {
            ElMessage.warning('测试：请允许通知权限以接收提醒')
          }
        })
      }
    }

    const testVibration = () => {
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200])
        ElMessage.success('测试：设备震动测试')
      } else {
        ElMessage.warning('测试：当前设备不支持震动功能')
      }
    }

    // 添加测试功能按钮的处理函数
    const testFeatures = () => {
      // 1. 测试订单状态变更
      const testStatusChange = () => {
        const preparingOrder = ongoingOrders.value.find(order => order.status === 'preparing')
        if (preparingOrder) {
          preparingOrder.status = 'ready'
          watchOrderStatus(preparingOrder)
          ElMessage.success('测试：订单状态已更新为待取餐')
        }
      }

      // 创建测试菜单
      ElMessageBox.confirm(
        '请选择要测试的功能：\n\n' +
        '1. 测试订单状态变更和提醒\n' +
        '2. 测试通知权限\n' +
        '3. 测试设备震动\n',
        '功能测试',
        {
          confirmButtonText: '测试状态变更',
          cancelButtonText: '取消',
          distinguishCancelAndClose: true,
          showClose: true,
          closeOnClickModal: false,
          customClass: 'test-dialog'
        }
      ).then(() => {
        testStatusChange()
      }).catch(action => {
        if (action === 'cancel') {
          return
        }
      })

      // 添加额外的测试按钮
      ElMessage({
        message: '点击测试其他功能',
        type: 'info',
        duration: 5000,
        showClose: true,
        customClass: 'test-message',
        dangerouslyUseHTMLString: true,
        message: `
          <div class="test-buttons">
            <button onclick="document.dispatchEvent(new CustomEvent('test-notification'))">
              测试通知
            </button>
            <button onclick="document.dispatchEvent(new CustomEvent('test-vibration'))">
              测试震动
            </button>
          </div>
        `
      })
    }

    // 通过点击"查看详情"按钮跳转
    const viewOrderDetail = (order) => {
      router.push({
        path: `/student/current-orders/${order.id}`,
        query: {
          status: order.status,
          createTime: order.createTime,
          canteenName: order.canteenName,
          windowName: order.windowName,
          pickupLocation: order.pickupLocation,
          totalAmount: order.totalAmount,
          dishes: JSON.stringify(order.dishes)
        }
      })
    }

    return {
      activeTab,
      ongoingOrders,
      getStatusType,
      getStatusText,
      goToHistory,
      getProgressStep,
      orderFilter,
      searchKeyword,
      filteredOngoingOrders,
      hasReadyOrder,
      refreshOrders,
      scrollToReadyOrder,
      goToHome,
      readyOrderRef,
      generateQRValue,
      qrDialogVisible,
      currentOrder,
      showQRCode,
      cancelOrder,
      testFeatures,
      isDevelopment,
      testNotification,
      testVibration,
      viewOrderDetail
    }
  }
}
</script>

<style scoped>
.order-list-container {
  width: 100%;
  min-height: 100%;
  background-color: #f5f7fa;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.order-list {
  padding: 6px 4px;
  background: #f5f7fa;
  min-height: calc(100vh - 120px);
}

.page-header {
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 6px;
  background: white;
}

.header-left {
  gap: 8px;
}

.order-stats {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.stat-card {
  padding: 6px 8px;
  border-radius: 4px;
}

.stat-item strong {
  font-size: 15px;
}

.stat-item span {
  font-size: 11px;
}

.stat-item small {
  font-size: 10px;
}

.header-actions {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.search-input {
  width: 180px;
  margin-right: auto; /* 让搜索框占据左侧空间 */
}

.search-input :deep(.el-input__inner) {
  height: 28px;
  line-height: 28px;
  font-size: 12px;
}

.search-input :deep(.el-input__prefix) {
  line-height: 28px;
}

.refresh-btn,
.history-btn {
  height: 28px;
  padding: 0 10px;
  font-size: 12px;
}

.custom-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: #e4e7ed;
}

.custom-tabs :deep(.el-tabs__item) {
  font-size: 14px;
  padding: 0 16px;
  height: 36px;
  line-height: 36px;
}

.custom-tabs :deep(.el-tabs__item.is-active) {
  font-weight: 600;
}

.order-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  padding: 0;
  margin-top: 8px;
}

.order-card {
  margin: 0;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  background: #fff;
  overflow: hidden;
  position: relative;
  font-size: 12px;
  transition: all 0.3s ease;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.ready-status {
  border: 1px solid #67c23a;
}

.ready-status .pickup-info {
  margin: 6px;
  padding: 8px;
  background: #f0f9eb;
  border-radius: 4px;
  border: 1px solid #e1f3d8;
}

.ready-status .pickup-header {
  font-size: 12px;
  margin-bottom: 6px;
}

.ready-status .pickup-location {
  font-size: 12px;
  margin-bottom: 6px;
}

.ready-status .pickup-tips p {
  font-size: 10px;
  margin: 2px 0;
}

.status-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: normal;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: badgePop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes badgePop {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.status-badge.ordered { background-color: var(--el-color-info); }
.status-badge.preparing { background-color: var(--el-color-primary); }
.status-badge.ready { background-color: var(--el-color-success); }
.status-badge.cancelled { background-color: var(--el-color-danger); }

.window-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.location-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.canteen-name {
  font-size: 11px;
  color: #909399;
}

.window-name {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.order-time {
  font-size: 10px;
  color: #999;
}

.dish-list {
  margin: 6px;
  padding: 6px;
  background: #f8f9fa;
  border-radius: 4px;
}

.dish-item {
  padding: 6px;
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.dish-item:not(:last-child) {
  border-bottom: 1px dashed #eee;
  margin-bottom: 4px;
  padding-bottom: 4px;
}

.dish-image {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 3px;
  overflow: hidden;
}

.dish-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dish-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dish-info {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;
}

.dish-name-wrapper {
  width: 100%;
}

.dish-name {
  font-size: 12px;
  color: #333;
  margin: 0;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dish-price-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  width: 100%;
}

.dish-quantity {
  font-size: 10px;
  color: #999;
}

.dish-price {
  font-size: 12px;
  color: #f56c6c;
  font-weight: 500;
}

.order-progress {
  margin: 6px;
  padding: 0 4px;
}

:deep(.el-step__title) {
  font-size: 10px;
}

:deep(.el-step__description) {
  font-size: 9px;
}

.order-footer {
  margin: 0 6px 6px;
  padding-top: 6px;
  border-top: 1px solid #f0f0f0;
}

.price-info {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.total-label {
  font-size: 11px;
  color: #999;
}

.total-price {
  font-size: 14px;
  font-weight: 600;
  color: #f56c6c;
}

.actions {
  gap: 8px;
}

.actions :deep(.el-button--small) {
  padding: 4px 8px;
  font-size: 11px;
  height: 24px;
}

.empty-icon {
  font-size: 32px;
  color: #909399;
}

.stat-card {
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s;
}

.stat-card:hover {
  background: #eef2f6;
  transform: translateY(-2px);
}

.stat-item {
  flex-direction: column;
  align-items: flex-start;
}

.stat-item small {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.waiting-time {
  margin: 6px;
  padding: 4px 8px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 11px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
}

.waiting-time .el-icon {
  color: #909399;
  font-size: 12px;
}

.pickup-info {
  margin-top: 8px;
  padding: 12px;
  background: #f0f9eb;
  border-radius: 6px;
  border: 1px solid #e1f3d8;
}

.pickup-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #67c23a;
  font-size: 14px;
  font-weight: 500;
}

.pickup-location {
  font-size: 14px;
  margin-bottom: 8px;
  text-align: center;
}

.pickup-tips {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #e1f3d8;
}

.pickup-tips p {
  margin: 2px 0;
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 4px;
}

.qr-dialog :deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  height: 80vh;
  display: flex;
  flex-direction: column;
  margin: 10vh auto !important;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: dialogZoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: #fff;
}

@keyframes dialogZoom {
  from {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

.qr-dialog :deep(.el-dialog__header) {
  margin: 0;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f9fa;
  text-align: center;
}

.qr-dialog :deep(.el-dialog__body) {
  flex: 1;
  overflow: hidden;
  padding: 0;
}

.qr-dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.qr-header {
  width: 100%;
  margin-bottom: 20px;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.window-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
  position: relative;
  padding-bottom: 12px;
}

.window-info::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 1px;
  background: linear-gradient(to right, transparent, #e4e7ed, transparent);
}

.canteen-name {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  background: linear-gradient(120deg, #409EFF, #67c23a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.qr-code-wrapper {
  position: relative;
  padding: 10px;
  margin: auto 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  animation: qrCodeFadeIn 0.5s ease-out 0.2s backwards;
}

@keyframes qrCodeFadeIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.qr-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px dashed #e4e7ed;
  border-radius: 4px;
  animation: borderBlink 3s infinite;
}

@keyframes borderBlink {
  0% { border-color: #e4e7ed; }
  50% { border-color: #67c23a; }
  100% { border-color: #e4e7ed; }
}

.qr-footer {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  margin-top: 20px;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.qr-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #67c23a;
  font-size: 14px;
  font-weight: 500;
  background: #f0f9eb;
  padding: 8px 16px;
  border-radius: 20px;
  width: fit-content;
}

.validity-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #909399;
  font-size: 13px;
  background: #f4f4f5;
  padding: 6px 12px;
  border-radius: 16px;
  width: fit-content;
}

.qr-tip .el-icon,
.validity-info .el-icon {
  font-size: 16px;
}

.order-alert {
  margin: 8px 0;
}

.alert-content {
  font-size: 12px;
}

.alert-content :deep(.el-button) {
  padding: 4px 8px;
  font-size: 12px;
}

.qr-dialog :deep(.el-dialog) {
  width: 90% !important;
  max-width: 300px;
}

.qr-dialog :deep(.el-dialog__header) {
  padding: 12px;
}

.qr-dialog :deep(.el-dialog__title) {
  font-size: 15px;
}

.qr-dialog :deep(.el-dialog__body) {
  padding: 16px 12px;
}

.qr-code-container {
  padding: 12px;
  width: 100%;
}

.pickup-qr {
  width: 100%;
  max-width: 200px;
  height: auto;
  margin: 0 auto;
}

.show-qr-btn {
  height: 28px;
  font-size: 11px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.show-qr-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s ease-out, height 0.6s ease-out;
}

.show-qr-btn:hover::after {
  width: 200%;
  height: 200%;
}

.refresh-btn {
  transition: transform 0.3s ease;
}

.refresh-btn:active {
  transform: rotate(180deg);
}

.order-progress :deep(.el-step__head.is-process),
.order-progress :deep(.el-step__head.is-success) {
  animation: stepPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes stepPop {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@media screen and (max-width: 393px) {
  .dish-name {
    font-size: 11px;
  }
  
  .dish-quantity {
    font-size: 10px;
  }
  
  .dish-price {
    font-size: 11px;
  }
  
  .show-qr-btn {
    height: 28px;
    font-size: 11px;
  }
  
  .show-qr-btn .el-icon {
    font-size: 12px;
  }
}

@media screen and (max-width: 768px) {
  .qr-dialog :deep(.el-dialog) {
    width: 90% !important;
    height: 90vh;
  }

  .qr-dialog-content {
    padding: 16px;
  }
}
</style> 
