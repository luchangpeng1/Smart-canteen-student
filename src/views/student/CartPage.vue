<template>
  <div class="cart-page">
    <div class="cart-header">
      <div class="header-left">
        <el-button 
          @click="goBack" 
          icon="ArrowLeft"
          text
          class="back-button">
          返回
        </el-button>
        <h2>购物车</h2>
      </div>
      <div class="header-right">
        <el-checkbox 
          v-if="hasCartItems"
          v-model="selectAll"
          @change="handleSelectAllChange"
          class="select-all">
          全选
        </el-checkbox>
        <el-button 
          type="danger" 
          plain 
          size="small" 
          @click="clearCart" 
          v-if="Object.keys(cartData).length > 0">
          清空购物车
        </el-button>
      </div>
    </div>

    <div class="cart-content">
      <template v-if="hasCartItems">
        <!-- 按窗口分组显示购物车商品 -->
        <div v-for="(items, windowId) in groupedCartItems" 
             :key="windowId" 
             class="cart-window-group">
          <div class="cart-window-header">
            <div class="window-header-left">
              <el-checkbox 
                v-model="windowSelected[windowId]"
                @change="(val) => handleWindowSelectChange(val, windowId)"
                class="window-checkbox">
              </el-checkbox>
              <el-tag size="small">{{ getWindowName(windowId) }}</el-tag>
            </div>
            <el-button 
              type="danger" 
              plain 
              size="small" 
              @click="clearWindowCart(windowId)">
              清空
            </el-button>
          </div>
          
          <div class="cart-items-list">
            <div v-for="item in items" 
                 :key="item.id" 
                 class="cart-item">
              <el-checkbox 
                v-model="item.selected"
                @change="() => handleItemSelectChange(item, windowId)"
                class="item-checkbox">
              </el-checkbox>
              <el-image 
                :src="item.image_url" 
                class="cart-item-image"
                fit="cover">
                <template #error>
                  <div class="image-placeholder">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              
              <div class="cart-item-info">
                <div class="cart-item-name">{{ item.name }}</div>
                <div class="cart-item-price">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
              </div>
              
              <div class="cart-item-actions">
                <el-input-number 
                  v-model="item.quantity" 
                  :min="0" 
                  :max="item.stock"
                  size="small"
                  @change="handleQuantityChange(item, windowId)"
                  controls-position="right">
                </el-input-number>
              </div>
            </div>
            <!-- 每个窗口的小计和结算按钮 -->
            <div class="window-cart-footer">
              <div class="window-total-info">
                <span class="total-label">小计:</span>
                <span class="total-price">¥{{ getWindowTotal(items).toFixed(2) }}</span>
              </div>
              <el-button 
                type="primary" 
                size="small"
                @click="goToCheckout(windowId)">
                结算 ({{ getWindowCount(items) }}件)
              </el-button>
            </div>
          </div>
        </div>
      </template>
      
      <div v-else class="empty-cart">
        <el-empty description="购物车是空的">
          <template #image>
            <el-icon :size="60" class="empty-cart-icon"><ShoppingCart /></el-icon>
          </template>
          <template #default>
            <el-button type="primary" @click="goBack">返回点餐</el-button>
          </template>
        </el-empty>
      </div>
    </div>

    <!-- 底部结算栏 -->
    <div class="cart-footer" v-if="hasCartItems">
      <div class="footer-left">
        <el-checkbox 
          v-model="selectAll"
          @change="handleSelectAllChange">
          全选
        </el-checkbox>
        <div class="total-info">
          <span>合计:</span>
          <span class="total-price">¥{{ totalSelectedPrice.toFixed(2) }}</span>
        </div>
      </div>
      <el-button 
        type="primary" 
        :disabled="!hasSelectedItems"
        @click="batchCheckout">
        结算({{ selectedItemsCount }}件)
      </el-button>
    </div>

    <!-- 结算确认对话框 -->
    <el-dialog
      v-model="checkoutDialogVisible"
      title="确认订单"
      width="400px">
      <div class="checkout-content">
        <div class="checkout-items">
          <div v-for="item in selectedItemsForCheckout" 
               :key="item.id" 
               class="checkout-item">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-quantity">x{{ item.quantity }}</span>
            <span class="item-price">¥{{ item.price * item.quantity }}</span>
          </div>
        </div>
        
        <el-divider></el-divider>
        
        <div class="checkout-form">
          <el-form :model="checkoutForm" :rules="checkoutRules" ref="checkoutFormRef">
            <el-form-item label="就餐时间" prop="diningTime">
              <el-time-select
                v-model="checkoutForm.diningTime"
                :picker-options="{
                  start: '10:30',
                  step: '00:15',
                  end: '20:00'
                }"
                placeholder="选择就餐时间">
              </el-time-select>
            </el-form-item>
            
            <el-form-item label="就餐方式" prop="diningType">
              <el-radio-group v-model="checkoutForm.diningType">
                <el-radio label="dine_in">堂食</el-radio>
                <el-radio label="take_out">打包</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="checkoutForm.remark"
                type="textarea"
                placeholder="请输入备注信息">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="checkoutDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitOrder">提交订单</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Picture, ShoppingCart, ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 从 localStorage 或 Vuex 获取购物车数据
const cartData = ref(JSON.parse(localStorage.getItem('cartData') || '{}'))

// 计算属性和方法
const hasCartItems = computed(() => {
  return Object.values(cartData.value).some(items => items.length > 0)
})

const groupedCartItems = computed(() => {
  return cartData.value
})

const checkoutDialogVisible = ref(false)
const checkoutFormRef = ref(null)
const currentWindowId = ref(null)
const currentWindowItems = computed(() => cartData.value[currentWindowId.value] || [])

const checkoutForm = reactive({
  diningTime: '',
  diningType: 'dine_in',
  remark: ''
})

const checkoutRules = {
  diningTime: [
    { required: true, message: '请选择就餐时间', trigger: 'change' }
  ],
  diningType: [
    { required: true, message: '请选择就餐方式', trigger: 'change' }
  ]
}

// 添加新的响应式数据
const selectAll = ref(false)
const windowSelected = ref({})
const selectedItemsForCheckout = ref([])

// 新增计算属性
const totalSelectedPrice = computed(() => {
  let total = 0
  Object.entries(cartData.value).forEach(([windowId, items]) => {
    items.forEach(item => {
      if (item.selected) {
        total += item.price * item.quantity
      }
    })
  })
  return total
})

const selectedItemsCount = computed(() => {
  let count = 0
  Object.values(cartData.value).forEach(items => {
    items.forEach(item => {
      if (item.selected) {
        count += item.quantity
      }
    })
  })
  return count
})

const hasSelectedItems = computed(() => selectedItemsCount.value > 0)

// 方法
const getWindowName = (windowId) => {
  // 这里需要根据实际情况获取窗口名称
  return `窗口 ${windowId}`
}

const getWindowTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0)
}

const getWindowCount = (items) => {
  return items.reduce((total, item) => total + item.quantity, 0)
}

const handleQuantityChange = (item, windowId) => {
  if (item.quantity === 0) {
    cartData.value[windowId] = cartData.value[windowId].filter(i => i.id !== item.id)
    if (cartData.value[windowId].length === 0) {
      delete cartData.value[windowId]
    }
  }
  saveCartData()
}

const clearWindowCart = (windowId) => {
  delete cartData.value[windowId]
  saveCartData()
  ElMessage.success('已清空该窗口购物车')
}

const clearCart = () => {
  cartData.value = {}
  saveCartData()
  ElMessage.success('购物车已清空')
}

const goToCheckout = (windowId) => {
  currentWindowId.value = windowId
  checkoutDialogVisible.value = true
}

const submitOrder = async () => {
  if (!checkoutFormRef.value) return
  
  try {
    await checkoutFormRef.value.validate()
    
    const orderData = {
      items: selectedItemsForCheckout.value,
      ...checkoutForm
    }
    
    // await request.post('/student/orders', orderData)
    
    ElMessage.success('下单成功')
    checkoutDialogVisible.value = false
    
    // 从购物车中移除已结算的商品
    selectedItemsForCheckout.value.forEach(item => {
      const windowId = item.windowId
      cartData.value[windowId] = cartData.value[windowId].filter(i => !i.selected)
      if (cartData.value[windowId].length === 0) {
        delete cartData.value[windowId]
      }
    })
    
    saveCartData()
    router.push('/student/orders')
  } catch (error) {
    console.error('下单失败:', error)
    ElMessage.error('下单失败')
  }
}

const saveCartData = () => {
  localStorage.setItem('cartData', JSON.stringify(cartData.value))
}

const goBack = () => {
  router.back()
}

// 修改初始化购物车数据的逻辑，添加选中状态
const initCartData = () => {
  const savedCart = JSON.parse(localStorage.getItem('cartData') || '{}')
  Object.entries(savedCart).forEach(([windowId, items]) => {
    savedCart[windowId] = items.map(item => ({
      ...item,
      selected: false
    }))
  })
  cartData.value = savedCart
}

// 在组件挂载时初始化数据
onMounted(() => {
  initCartData()
})

// 添加新的方法
const handleSelectAllChange = (val) => {
  Object.keys(cartData.value).forEach(windowId => {
    windowSelected.value[windowId] = val
    cartData.value[windowId].forEach(item => {
      item.selected = val
    })
  })
}

const handleWindowSelectChange = (val, windowId) => {
  cartData.value[windowId].forEach(item => {
    item.selected = val
  })
  updateSelectAllStatus()
}

const handleItemSelectChange = (item, windowId) => {
  const allSelected = cartData.value[windowId].every(item => item.selected)
  windowSelected.value[windowId] = allSelected
  updateSelectAllStatus()
}

const updateSelectAllStatus = () => {
  selectAll.value = Object.values(cartData.value).every(items => 
    items.every(item => item.selected)
  )
}

const batchCheckout = () => {
  selectedItemsForCheckout.value = []
  Object.entries(cartData.value).forEach(([windowId, items]) => {
    const selectedItems = items.filter(item => item.selected)
    if (selectedItems.length > 0) {
      selectedItemsForCheckout.value.push(...selectedItems)
    }
  })
  checkoutDialogVisible.value = true
}
</script>

<style scoped>
.cart-page {
  padding: 0;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f5f5f5;
  min-height: calc(100vh - 60px);
  position: relative;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  background: #fff;
  padding: 12px 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-button {
  font-size: 16px;
  padding: 0;
  height: auto;
  transition: all 0.3s ease;
}

.back-button:hover {
  color: var(--el-color-primary);
  transform: translateX(-2px);
}

.cart-header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
  font-weight: 600;
}

.cart-content {
  padding-bottom: 90px; /* 为底部结算栏留出空间 */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  height: calc(100vh - 60px);
}

.cart-window-group {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  border: none;
  position: relative;
  overflow: hidden;
}

.cart-window-group::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #409eff, #3a8ee6);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.cart-window-group:active::before {
  opacity: 1;
}

.cart-window-group:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.cart-window-header {
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
  border-radius: 8px 8px 0 0;
}

.cart-items-list {
  padding: 0 12px;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 10px 8px 10px 36px;
  border-bottom: 1px solid #f5f5f5;
  position: relative;
  transition: background-color 0.2s ease;
  animation: fadeInRight 0.3s ease;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item:active {
  background-color: #f9f9f9;
}

.cart-item-image {
  width: 65px;
  height: 65px;
  border-radius: 6px;
  margin-right: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  object-fit: cover;
  transition: transform 0.2s ease;
  background: #f8f8f8;
}

.cart-item-image:active {
  transform: scale(0.95);
}

.cart-item-info {
  flex: 1;
  min-width: 0;
}

.cart-item-name {
  font-size: 14px;
  margin-bottom: 4px;
  color: #333;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cart-item-price {
  color: #f56c6c;
  font-size: 15px;
  font-weight: 600;
  position: relative;
  display: inline-block;
  padding: 2px 6px;
  background: rgba(245, 108, 108, 0.1);
  border-radius: 4px;
}

.window-cart-footer {
  padding: 10px 12px;
  background: #fafafa;
  border-radius: 0 0 8px 8px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.window-total-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

.window-total-info .total-label {
  color: #909399;
}

.window-total-info .total-price {
  color: #f56c6c;
  font-size: 16px;
  font-weight: 600;
  background: rgba(245, 108, 108, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

:deep(.el-button--primary) {
  margin-left: auto;
}

.empty-cart {
  padding: 40px 20px;
  text-align: center;
  background: #fff;
  border-radius: 8px;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
}

.empty-cart::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #f56c6c, #ff9896);
  opacity: 0.5;
}

.empty-cart-icon {
  font-size: 40px;
  color: #909399;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.cart-footer {
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 800px;
  height: 60px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.total-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

.total-info span:first-child {
  color: #333;
}

.total-price {
  color: #ff5339;
  font-size: 20px;
  font-weight: 500;
}

.total-price::before {
  content: '¥';
  font-size: 14px;
  margin-right: 2px;
}

:deep(.el-button--primary) {
  background: #ff5339;
  border: none;
  border-radius: 20px;
  padding: 0 24px;
  height: 36px;
  font-size: 14px;
  font-weight: normal;
}

:deep(.el-button--primary.is-disabled) {
  background: #ffccc7;
  color: #fff;
  border: none;
}

:deep(.el-checkbox__input) {
  border-color: #ddd;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #ff5339;
  border-color: #ff5339;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .cart-content {
    padding-bottom: 120px;
  }

  .cart-footer {
    bottom: 50px;
    width: 100%;
  }

  .footer-left {
    gap: 8px;
  }

  .total-price {
    font-size: 18px;
  }

  :deep(.el-button--primary) {
    padding: 0 20px;
    height: 32px;
  }
}

/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  .cart-footer {
    background: rgba(26, 26, 26, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .total-info span:first-child {
    color: #e0e0e0;
  }

  :deep(.el-button--primary.is-disabled) {
    background: rgba(255, 83, 57, 0.4);
  }
}

/* 自定义复选框样式 */
:deep(.el-checkbox__inner) {
  border-radius: 4px;
  width: 18px;
  height: 18px;
  border: 2px solid #dcdfe6;
}

:deep(.el-checkbox__inner::after) {
  height: 8px;
  left: 5px;
  top: 2px;
  width: 3px;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  transform: scale(1.05);
}

:deep(.el-checkbox) {
  --el-checkbox-font-size: 15px;
  height: 24px;
  margin-right: 8px;
}

:deep(.el-checkbox__label) {
  padding-left: 10px;
  line-height: 24px;
}

/* 自定义按钮样式 */
:deep(.el-button--primary) {
  background: linear-gradient(135deg, #409eff, #3a8ee6);
  border: none;
  padding: 6px 16px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  height: 36px;
  display: flex;
  align-items: center;
}

:deep(.el-button--primary)::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(rgba(255, 255, 255, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.2s ease;
}

:deep(.el-button--primary:active)::after {
  opacity: 1;
}

:deep(.el-button--danger.is-plain) {
  background: #fff;
  border-color: #f56c6c;
  color: #f56c6c;
}

:deep(.el-button--danger.is-plain:hover) {
  background: #fef0f0;
  color: #f56c6c;
}

/* 自定义输入框样式 */
:deep(.el-input-number) {
  border-radius: 6px;
  width: 100px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

:deep(.el-input-number:focus-within) {
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.2);
}

:deep(.el-input-number .el-input-number__decrease),
:deep(.el-input-number .el-input-number__increase) {
  background: #f5f7fa;
  border-color: #e4e7ed;
  transition: all 0.2s ease;
}

:deep(.el-input-number .el-input-number__decrease:active),
:deep(.el-input-number .el-input-number__increase:active) {
  background: #e4e7ed;
}

/* 自定义标签样式 */
:deep(.el-tag) {
  border-radius: 4px;
  padding: 0 8px;
  height: 22px;
  line-height: 20px;
  font-size: 12px;
}

/* 添加暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .cart-page {
    background-color: #121212;
  }
  
  .cart-window-group,
  .cart-header,
  .empty-cart {
    background: #1e1e1e;
    border-color: #2c2c2c;
  }
  
  .cart-window-header {
    background: #242424;
    border-bottom-color: #2c2c2c;
  }

  .cart-item {
    border-bottom-color: #2c2c2c;
  }

  .cart-item:active {
    background-color: #242424;
  }

  .cart-item-name {
    color: #e0e0e0;
  }

  .window-cart-footer {
    background: #242424;
    border-top-color: #2c2c2c;
  }

  .cart-footer {
    background: rgba(30, 30, 30, 0.98);
  }

  .cart-window-group::before {
    background: linear-gradient(90deg, #409eff, #3a8ee6);
  }

  .cart-item-image {
    background: #2c2c2c;
  }

  .cart-item-price {
    background: rgba(245, 108, 108, 0.15);
  }

  :deep(.el-input-number .el-input-number__decrease),
  :deep(.el-input-number .el-input-number__increase) {
    background: #2c2c2c;
    border-color: #3a3a3a;
  }

  :deep(.el-input-number .el-input-number__decrease:active),
  :deep(.el-input-number .el-input-number__increase:active) {
    background: #3a3a3a;
  }

  .cart-content::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
  }

  .empty-cart::before {
    opacity: 0.3;
  }
}

/* 调整复选框容器样式 */
.header-right .select-all {
  margin-right: 16px;
}

.window-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 8px;
  position: relative;
}

.window-header-left .el-tag {
  position: relative;
  overflow: hidden;
}

.window-header-left .el-tag::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.cart-item {
  position: relative;
  padding-left: 48px;
}

.item-checkbox {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
}

/* 底部结算栏的复选框样式调整 */
.cart-footer .el-checkbox {
  margin-left: 12px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .cart-item {
    padding-left: 40px;
  }
  
  .item-checkbox {
    left: 8px;
  }
}

/* 添加触摸反馈 */
.cart-item,
.el-button,
.el-checkbox {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

/* 添加滑动流畅度优化 */
.cart-content {
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
  height: calc(100vh - 140px);
}

/* 优化加载状态 */
.cart-window-group {
  opacity: 0;
  animation: slideIn 0.3s ease forwards;
  animation-delay: calc(var(--index, 0) * 0.1s);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 滚动条美化 */
.cart-content::-webkit-scrollbar {
  width: 4px;
}

.cart-content::-webkit-scrollbar-track {
  background: transparent;
}

.cart-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

/* 添加商品切换动画 */
.cart-item {
  animation: fadeInRight 0.3s ease;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 添加涟漪效果 */
.cart-item:active::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(64, 158, 255, 0.2), transparent);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  animation: ripple 0.5s ease-out;
}

@keyframes ripple {
  to {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}
</style> 