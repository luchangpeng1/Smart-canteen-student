<template>
  <div class="current-order-detail">
    <!-- 返回按钮 -->
    <div class="back-button">
      <el-button 
        @click="goBack" 
        class="custom-back-btn"
        link>
        <div class="back-content">
          <el-icon class="back-icon"><ArrowLeft /></el-icon>
          <span class="back-text">返回上一页</span>
        </div>
      </el-button>
    </div>

    <div class="detail-content" v-loading="loading">
      <!-- 订单状态卡片 -->
      <el-card class="status-card">
        <!-- 与 OrderDetail.vue 类似的基本结构，但增加实时状态更新 -->
        <div class="status-header">
          <div class="order-info">
            <h2 class="order-number">订单号：{{ order.orderNumber }}</h2>
            <el-tag :type="getStatusType(order.status)" class="status-tag" size="large">
              {{ getStatusLabel(order.status) }}
            </el-tag>
          </div>
          <div class="order-time">
            <div class="time-item">
              <span class="label">下单时间：</span>
              <span class="value">{{ order.createTime }}</span>
            </div>
            <div class="time-item">
              <span class="label">预计取餐时间：</span>
              <span class="value">{{ order.estimatedPickupTime || '15分钟内' }}</span>
            </div>
          </div>
          <div class="location-info">
            <div class="info-item">
              <span class="label">取餐位置：</span>
              <span class="value">
                <el-tag size="small" type="info" class="location-tag">
                  {{ order.canteenName }}
                </el-tag>
                <el-divider direction="vertical" />
                <el-tag size="small" type="primary" class="location-tag">
                  {{ order.windowName }}
                </el-tag>
              </span>
            </div>
            <div class="info-item" v-if="order.pickupLocation">
              <span class="label">取餐点：</span>
              <span class="value">{{ order.pickupLocation }}</span>
            </div>
          </div>
        </div>

        <!-- 添加进度条 -->
        <div class="order-progress" v-if="order.status !== 'cancelled'">
          <el-steps :active="getProgressStep(order.status)" finish-status="success">
            <el-step title="已接单" />
            <el-step title="制作中" />
            <el-step title="待取餐" />
          </el-steps>
        </div>

        <!-- 添加预计等待时间 -->
        <div class="waiting-time" v-if="order.status === 'preparing'">
          <el-icon><Timer /></el-icon>
          预计等待时间：{{ order.estimatedTime || '15' }}分钟
        </div>

        <!-- 添加取餐信息 -->
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
            @click="showQRCode">
            <el-icon><Ticket /></el-icon>
            显示取餐码
          </el-button>
        </div>
      </el-card>

      <!-- 菜品详情卡片 -->
      <el-card class="dishes-card">
        <template #header>
          <div class="card-header">
            <h3>菜品详情</h3>
            <span class="window-name">{{ order.windowName }}</span>
          </div>
        </template>
        
        <div class="dishes-list">
          <div v-for="dish in order.dishes" :key="dish.id" class="dish-item">
            <el-image 
              :src="dish.image_url" 
              :alt="dish.name"
              class="dish-image">
              <template #error>
                <div class="image-placeholder">暂无图片</div>
              </template>
            </el-image>
            
            <div class="dish-info">
              <h4 class="dish-name">{{ dish.name }}</h4>
              <div class="dish-meta">
                <span class="dish-price">¥{{ dish.price }}</span>
                <span class="dish-quantity">× {{ dish.quantity }}</span>
              </div>
            </div>
            
            <div class="dish-subtotal">
              ¥{{ (dish.price * dish.quantity).toFixed(2) }}
            </div>
          </div>
        </div>

        <div class="price-summary">
          <div class="price-item">
            <span>商品总额</span>
            <span>¥{{ order.totalAmount }}</span>
          </div>
          <div class="price-item total">
            <span>实付金额</span>
            <span class="final-price">¥{{ order.totalAmount }}</span>
          </div>
        </div>
      </el-card>

      <!-- 底部操作按钮 -->
      <div class="action-buttons">
        <el-button 
          v-if="order.status === 'ordered'"
          type="danger"
          @click="cancelOrder">
          取消订单
        </el-button>
      </div>
    </div>

    <!-- 取餐码弹窗 -->
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
            <span class="canteen-name">{{ order.canteenName }}</span>
            <span class="window-name">{{ order.windowName }}</span>
            <span class="pickup-location">{{ order.pickupLocation }}</span>
          </div>
          <div class="order-info">
            <span class="order-time">{{ order.createTime }}</span>
            <span class="order-amount">¥{{ order.totalAmount.toFixed(2) }}</span>
          </div>
        </div>
        
        <div class="qr-code-wrapper">
          <qrcode-vue
            v-if="order"
            :value="generateQRValue(order)"
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
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Timer, Bell, Ticket } from '@element-plus/icons-vue'
import QrcodeVue from 'qrcode.vue'

export default {
  name: 'CurrentOrderDetail',
  components: {
    ArrowLeft,
    Timer,
    Bell,
    Ticket,
    QrcodeVue
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(false)
    const order = ref({})
    const qrDialogVisible = ref(false)
    let pollingTimer = null

    // 获取订单详情
    const fetchOrderDetail = async () => {
      loading.value = true
      try {
        // 从路由查询参数中获取订单信息
        const { status, createTime, canteenName, windowName, pickupLocation, totalAmount, dishes } = route.query
        
        // 测试数据
        order.value = {
          id: route.params.id,
          orderNumber: 'ORD202403150001',
          status: status || 'preparing',
          createTime: createTime || '2024-03-15 12:30:00',
          estimatedTime: '15',
          canteenName: canteenName || '第一食堂',
          windowName: windowName || '特色炒菜',
          pickupLocation: pickupLocation || '一楼3号窗口',
          totalAmount: Number(totalAmount) || 45.00,
          dishes: dishes ? JSON.parse(dishes) : [
            {
              id: 1,
              name: '宫保鸡丁',
              price: 15.00,
              quantity: 2,
              image_url: 'https://example.com/dish1.jpg'
            },
            {
              id: 2,
              name: '麻婆豆腐',
              price: 15.00,
              quantity: 1,
              image_url: 'https://example.com/dish2.jpg'
            }
          ]
        }
      } catch (error) {
        console.error('获取订单详情失败:', error)
        ElMessage.error('获取订单详情失败')
      } finally {
        loading.value = false
      }
    }

    // 获取状态标签
    const getStatusLabel = (status) => {
      const statusMap = {
        'ordered': '已接单',
        'preparing': '制作中',
        'ready': '待取餐',
        'cancelled': '已取消'
      }
      return statusMap[status] || status
    }

    // 获取状态标签类型
    const getStatusType = (status) => {
      const typeMap = {
        'ordered': 'info',
        'preparing': 'primary',
        'ready': 'success',
        'cancelled': 'info'
      }
      return typeMap[status] || ''
    }

    // 获取进度步骤
    const getProgressStep = (status) => {
      const steps = {
        'ordered': 1,
        'preparing': 2,
        'ready': 3
      }
      return steps[status] || 0
    }

    // 显示取餐码
    const showQRCode = () => {
      qrDialogVisible.value = true
    }

    // 取消订单
    const cancelOrder = async () => {
      try {
        await ElMessage.confirm('确定要取消这个订单吗？', '提示', {
          type: 'warning'
        })
        // 在实际开发中替换为真实的API调用
        // await request.post(`/student/orders/${order.value.id}/cancel`)
        ElMessage.success('订单已取消')
        router.push('/student/orders')
      } catch (error) {
        if (error !== 'cancel') {
          console.error('取消订单失败:', error)
          ElMessage.error('取消订单失败')
        }
      }
    }

    // 返回上一页
    const goBack = () => {
      router.push('/student/orders')
    }

    // 轮询更新订单状态
    const startPolling = () => {
      pollingTimer = setInterval(async () => {
        try {
          // 在实际开发中替换为真实的API调用
          // const response = await request.get(`/student/current-orders/${route.params.id}/status`)
          // if (response.data.status !== order.value.status) {
          //   order.value.status = response.data.status
          // }
        } catch (error) {
          console.error('获取订单状态失败:', error)
        }
      }, 10000) // 每10秒更新一次
    }

    // 生成取餐码内容
    const generateQRValue = (order) => {
      return JSON.stringify({
        orderId: order.id,
        orderNumber: order.orderNumber,
        timestamp: new Date().getTime()
      })
    }

    onMounted(() => {
      fetchOrderDetail()
      // 只有进行中的订单才需要轮询
      if (['ordered', 'preparing'].includes(route.query.status)) {
        startPolling()
      }
    })

    onUnmounted(() => {
      if (pollingTimer) {
        clearInterval(pollingTimer)
      }
    })

    return {
      order,
      loading,
      qrDialogVisible,
      getStatusLabel,
      getStatusType,
      getProgressStep,
      showQRCode,
      cancelOrder,
      goBack,
      generateQRValue
    }
  }
}
</script>

<style scoped>
.current-order-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.back-button {
  margin-bottom: 24px;
  padding: 0 20px;
}

.custom-back-btn {
  height: auto;
  padding: 8px 0;
  transition: all 0.3s ease;
}

.back-content {
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #606266;
}

.back-icon {
  margin-right: 8px;
  font-size: 16px;
  transition: transform 0.3s ease;
}

.custom-back-btn:hover .back-content {
  color: #409EFF;
}

.custom-back-btn:hover .back-icon {
  transform: translateX(-4px);
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.status-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
}

.status-header {
  padding: 20px;
}

.order-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.order-number {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.status-tag {
  font-size: 14px;
  padding: 0 16px;
  height: 32px;
  line-height: 30px;
  border-radius: 16px;
}

.order-time {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  color: #909399;
  font-size: 14px;
}

.time-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.time-item:last-child {
  margin-bottom: 0;
}

.label {
  color: #909399;
  margin-right: 8px;
}

.value {
  color: #303133;
}

.location-info {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #ebeef5;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.location-tag {
  margin-right: 4px;
}

.location-tag:last-child {
  margin-right: 0;
}

.location-info :deep(.el-divider--vertical) {
  margin: 0 8px;
  height: 14px;
}

.order-progress {
  padding: 20px;
  border-top: 1px solid #ebeef5;
}

.waiting-time {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  background-color: #f0f9eb;
  color: #67c23a;
  font-size: 14px;
  border-top: 1px solid #ebeef5;
}

.pickup-info {
  padding: 20px;
  background-color: #f0f9eb;
  border-top: 1px solid #ebeef5;
}

.pickup-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #67c23a;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
}

.pickup-location {
  font-size: 14px;
  color: #606266;
  margin-bottom: 16px;
}

.show-qr-btn {
  width: 100%;
  margin-bottom: 12px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
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

.qr-dialog :deep(.el-dialog__header) {
  margin: 0;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f9fa;
  text-align: center;
}

.qr-dialog :deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  display: block;
  text-align: center;
  padding: 0 30px;
}

.qr-dialog :deep(.el-dialog__headerbtn) {
  top: 16px;
  right: 16px;
  z-index: 1;
}

.qr-dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
  padding: 24px 20px;
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
  background: linear-gradient(120deg, #409EFF, #67c23a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.window-name,
.pickup-location {
  font-size: 14px;
  color: #606266;
}

.order-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #909399;
}

.qr-code-wrapper {
  position: relative;
  padding: 10px;
  margin: 20px 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease;
}

.qr-code-wrapper:hover {
  transform: translateY(-2px);
}

.pickup-qr {
  display: block;
  margin: 0 auto;
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

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .current-order-detail {
    padding: 12px;
  }

  .back-button {
    margin-bottom: 16px;
    padding: 0 12px;
  }

  .order-number {
    font-size: 16px;
  }

  .status-tag {
    font-size: 12px;
    height: 28px;
    line-height: 26px;
  }

  .status-header,
  .order-progress,
  .waiting-time,
  .pickup-info {
    padding: 12px 16px;
  }

  .pickup-header {
    font-size: 14px;
  }

  .pickup-location {
    font-size: 13px;
  }

  .action-buttons {
    margin-top: 16px;
  }

  .qr-dialog :deep(.el-dialog) {
    width: 90% !important;
    margin: 20px auto !important;
  }

  .qr-dialog-content {
    padding: 16px;
  }

  .canteen-name {
    font-size: 15px;
  }

  .window-name,
  .pickup-location {
    font-size: 13px;
  }
}

/* 添加动画效果 */
.action-buttons .el-button {
  transition: all 0.3s ease;
}

.action-buttons .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

/* 步骤条样式调整 */
:deep(.el-step__title) {
  font-size: 14px;
}

:deep(.el-step__description) {
  font-size: 12px;
}

/* 确保内容区域平滑滚动 */
.current-order-detail {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

.dishes-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.window-name {
  color: #909399;
  font-size: 14px;
}

.dishes-list {
  margin-bottom: 20px;
}

.dish-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #ebeef5;
}

.dish-item:last-child {
  border-bottom: none;
}

.dish-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  margin-right: 12px;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 12px;
}

.dish-info {
  flex: 1;
}

.dish-name {
  margin: 0 0 6px;
  font-size: 14px;
  color: #303133;
}

.dish-meta {
  color: #606266;
  font-size: 13px;
}

.dish-price {
  color: #f56c6c;
  margin-right: 8px;
}

.dish-subtotal {
  font-size: 14px;
  color: #f56c6c;
  font-weight: 500;
}

.price-summary {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 4px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #606266;
  font-size: 14px;
}

.price-item.total {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
  color: #303133;
  font-weight: 500;
}

.final-price {
  color: #f56c6c;
  font-size: 16px;
}
</style> 