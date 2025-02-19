<template>
  <div class="user-profile-container">
    <div class="user-profile">
      <!-- 用户基本信息卡片 -->
      <div class="user-info-card">
        <div class="user-info">
          <el-avatar :size="64" :src="userInfo.avatar">
            {{ userInfo.name.charAt(0) }}
          </el-avatar>
          <div class="info-content">
            <div class="name-wrapper">
              <h3>{{ userInfo.name }}</h3>
              <el-button 
                class="edit-btn" 
                type="primary" 
                link 
                @click="showEditProfile"
                :title="'编辑个人信息'"
              >
                <el-icon><Edit /></el-icon>
                <span class="edit-text">编辑资料</span>
              </el-button>
            </div>
            <p>{{ userInfo.studentId }}</p>
          </div>
        </div>
        <div class="balance-info">
          <div class="balance-item" @click="handleMenuClick('wallet')" style="cursor: pointer">
            <span class="amount">¥{{ userInfo.balance }}</span>
            <span class="label">余额</span>
          </div>
          <div class="balance-item" @click="navigateToPage('points-history')" style="cursor: pointer">
            <span class="amount">{{ userInfo.points }}</span>
            <span class="label">积分</span>
          </div>
        </div>
      </div>

      <!-- 功能菜单列表 -->
      <div class="menu-list">
        <el-card class="menu-card">
          <!-- 钱包相关 -->
          <div class="menu-item" @click="handleMenuClick('wallet')">
            <div class="menu-icon">
              <el-icon><WalletFilled /></el-icon>
            </div>
            <div class="menu-content">
              <span>我的钱包</span>
              <span class="menu-value">¥{{ userInfo.balance }}</span>
            </div>
          </div>
          <div class="menu-item" @click="navigateToPage('transactions')">
            <div class="menu-icon">
              <el-icon><List /></el-icon>
            </div>
            <div class="menu-content">
              <span>消费记录</span>
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
          
          <!-- 订餐相关 -->
          <div class="menu-item" @click="handleMenuClick('favorites')">
            <div class="menu-icon">
              <el-icon><StarFilled /></el-icon>
            </div>
            <div class="menu-content">
              <span>我的收藏</span>
              <span class="menu-value">{{ userInfo.favorites }}个菜品</span>
            </div>
          </div>
          <div class="menu-item" @click="handleMenuClick('reviews')">
            <div class="menu-icon">
              <el-icon><ChatDotSquare /></el-icon>
            </div>
            <div class="menu-content">
              <span>历史评价</span>
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
          
          <!-- 反馈相关 -->
          <div class="menu-item" @click="showFeedbackDialog">
            <div class="menu-icon">
              <el-icon><EditPen /></el-icon>
            </div>
            <div class="menu-content">
              <span>提交建议</span>
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
          <div class="menu-item" @click="handleMenuClick('my-feedbacks')">
            <div class="menu-icon">
              <el-icon><Message /></el-icon>
            </div>
            <div class="menu-content">
              <span>我的建议</span>
              <span class="menu-value">{{ userInfo.feedbacks }}条</span>
            </div>
          </div>

          <!-- 设置相关 -->
          <div class="menu-item" @click="handleMenuClick('notification-settings')">
            <div class="menu-icon">
              <el-icon><Bell /></el-icon>
            </div>
            <div class="menu-content">
              <span>通知设置</span>
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
          <div class="menu-item" @click="handleMenuClick('preferences')">
            <div class="menu-icon">
              <el-icon><Setting /></el-icon>
            </div>
            <div class="menu-content">
              <span>偏好设置</span>
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
          <div class="menu-item" @click="showAbout">
            <div class="menu-icon">
              <el-icon><InfoFilled /></el-icon>
            </div>
            <div class="menu-content">
              <span>关于我们</span>
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>

          <!-- 积分相关 -->
          <div class="menu-item" @click="navigateToPage('points-history')">
            <div class="menu-icon">
              <el-icon><Histogram /></el-icon>
            </div>
            <div class="menu-content">
              <span>积分历史</span>
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
          <div class="menu-item" @click="navigateToPage('points-rules')">
            <div class="menu-icon">
              <el-icon><Document /></el-icon>
            </div>
            <div class="menu-content">
              <span>积分规则</span>
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
          <div class="menu-item" @click="navigateToPage('points-exchange')">
            <div class="menu-icon">
              <el-icon><Present /></el-icon>
            </div>
            <div class="menu-content">
              <span>积分兑换</span>
              <div class="menu-value">
                <span class="points">{{ userInfo.points }}</span> 积分可用
                <el-icon><ArrowRight /></el-icon>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 退出登录按钮 -->
        <div class="logout-button">
          <el-button type="danger" plain @click="handleLogout">退出登录</el-button>
        </div>
      </div>

      <!-- 充值对话框 -->
      <el-dialog v-model="rechargeVisible" title="余额充值" width="90%">
        <div class="recharge-options">
          <div 
            v-for="amount in [20, 50, 100, 200]" 
            :key="amount"
            class="recharge-option"
            :class="{ active: rechargeForm.amount === amount }"
            @click="rechargeForm.amount = amount"
          >
            ¥{{ amount }}
          </div>
        </div>
        <el-form :model="rechargeForm" label-width="80px">
          <el-form-item label="其他金额">
            <el-input-number v-model="rechargeForm.amount" :min="0" :step="10" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="rechargeVisible = false">取消</el-button>
          <el-button type="primary" @click="handleRecharge">确认充值</el-button>
        </template>
      </el-dialog>

      <!-- 反馈对话框 -->
      <el-dialog v-model="feedbackVisible" title="提交建议" width="90%">
        <el-form :model="feedbackForm" label-width="80px">
          <el-form-item label="食堂">
            <el-select v-model="feedbackForm.canteen" placeholder="请选择食堂">
              <el-option
                v-for="canteen in canteens"
                :key="canteen.id"
                :label="canteen.name"
                :value="canteen.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="窗口" v-if="feedbackForm.canteen">
            <el-select v-model="feedbackForm.window" placeholder="请选择窗口">
              <el-option
                v-for="window in getWindows(feedbackForm.canteen)"
                :key="window.id"
                :label="window.name"
                :value="window.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="建议类型">
            <el-select v-model="feedbackForm.type" placeholder="请选择建议类型">
              <el-option label="菜品建议" value="dish" />
              <el-option label="服务建议" value="service" />
              <el-option label="环境建议" value="environment" />
              <el-option label="其他建议" value="other" />
            </el-select>
          </el-form-item>
          <el-form-item label="建议内容">
            <el-input
              v-model="feedbackForm.content"
              type="textarea"
              :rows="4"
              placeholder="请详细描述您的建议..."
            />
          </el-form-item>
          <el-form-item label="图片">
            <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :on-change="handleImageChange"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="feedbackVisible = false">取消</el-button>
          <el-button type="primary" @click="submitFeedback">提交建议</el-button>
        </template>
      </el-dialog>

      <!-- 个人信息编辑对话 -->
      <el-dialog 
        v-model="profileEditVisible" 
        title="编辑个人信息" 
        width="90%"
        :close-on-click-modal="false"
      >
        <el-form 
          ref="profileFormRef"
          :model="profileForm" 
          :rules="profileFormRules"
          label-width="80px"
        >
          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="handleAvatarChange"
              accept="image/*"
            >
              <img 
                v-if="profileForm.avatar" 
                :src="profileForm.avatar" 
                class="avatar" 
              />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="upload-tip">支持 jpg、png 格式，大小不超过 2MB</div>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="profileForm.name" maxlength="20" show-word-limit />
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="profileForm.phone" maxlength="11" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="profileForm.email" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="profileEditVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="updateProfile"
            :loading="isUpdatingProfile"
          >
            保存
          </el-button>
        </template>
      </el-dialog>

      <!-- 积分规则对话框 -->
      <el-dialog v-model="pointsRulesVisible" title="积分规则" width="90%">
        <div class="points-rules">
          <h4>获取积分</h4>
          <ul>
            <li>完成订单：<span class="points-value">+2分</span></li>
            <li>评价订单：<span class="points-value">+3分</span></li>
            <li>首次使用：<span class="points-value">+10分</span></li>
            <li>每日签到：<span class="points-value">+1分</span></li>
          </ul>
          <h4>积分等级</h4>
          <ul>
            <li>普通会员：0-100分</li>
            <li>白银会员：101-500分</li>
            <li>黄金会员：501-1000分</li>
            <li>钻石会员：1000分以上</li>
          </ul>
          <h4>会员特权</h4>
          <ul>
            <li>白银会员：订单享95折</li>
            <li>黄金会员：订单享9折</li>
            <li>钻石会员：订单享85折</li>
          </ul>
        </div>
      </el-dialog>

      <!-- 积分兑换对话框 -->
      <el-dialog v-model="pointsExchangeVisible" title="积分兑换" width="90%">
        <div class="exchange-list">
          <el-card v-for="item in exchangeItems" :key="item.id" class="exchange-item">
            <div class="exchange-content">
              <img :src="item.image" :alt="item.name" class="exchange-image">
              <div class="exchange-info">
                <h3>{{ item.name }}</h3>
                <p>{{ item.description }}</p>
                <div class="exchange-points">
                  需要 <span class="points-value">{{ item.points }}</span> 积分
                </div>
              </div>
            </div>
            <el-button 
              type="primary" 
              @click="handleExchange(item)"
              :disabled="userInfo.points < item.points"
            >
              立即兑换
            </el-button>
          </el-card>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  WalletFilled,
  List,
  StarFilled,
  ChatDotSquare,
  EditPen,
  Message,
  Bell,
  Setting,
  InfoFilled,
  Plus,
  ArrowRight,
  ChatSquare,
  Edit,
  Medal,
  Document,
  Histogram,
  Present
} from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'UserProfile',
  components: {
    WalletFilled,
    List,
    StarFilled,
    ChatDotSquare,
    EditPen,
    Message,
    Bell,
    Setting,
    InfoFilled,
    Plus,
    ArrowRight,
    ChatSquare,
    Edit,
    Medal,
    Document,
    Histogram,
    Present
  },
  setup() {
    const router = useRouter()
    const store = useStore()

    // 修改 userInfo 的获取方式，添加错误处理和默认值
    const userInfo = computed(() => {
      try {
        return store?.getters?.['user/userInfo'] || {
          name: '',
          studentId: '',
          avatar: '',
          balance: 0,
          points: 0,
          favorites: 0,
          feedbacks: 0,
          phone: '',
          email: ''
        }
      } catch (error) {
        console.error('Failed to get user info:', error)
        return {
          name: '',
          studentId: '',
          avatar: '',
          balance: 0,
          points: 0,
          favorites: 0,
          feedbacks: 0,
          phone: '',
          email: ''
        }
      }
    })

    // 添加错误处理的 store dispatch 包装函数
    const safeDispatch = async (action, payload) => {
      try {
        if (!store) {
          throw new Error('Store is not initialized')
        }
        return await store.dispatch(action, payload)
      } catch (error) {
        console.error(`Failed to dispatch ${action}:`, error)
        ElMessage.error('操作失败，请重试')
        throw error
      }
    }

    // 充值相关
    const rechargeVisible = ref(false)
    const rechargeForm = ref({
      amount: 50
    })

    // 反馈相关
    const feedbackVisible = ref(false)
    const feedbackForm = ref({
      canteen: '',
      window: '',
      type: '',
      content: '',
      images: []
    })

    // 测试数据
    const canteens = [
      { id: 1, name: '中央食堂' },
      { id: 2, name: '沁园餐厅' },
      // ... 其他食堂
    ]

    const getWindows = (canteenId) => {
      // 模拟根据食堂获取窗口列表
      return [
        { id: 1, name: '特色炒菜' },
        { id: 2, name: '食档口' },
        // ... 其他窗口
      ]
    }

    const showRecharge = () => {
      rechargeVisible.value = true
    }

    // 修改使用 store 的函数
    const handleRecharge = async () => {
      if (!rechargeForm.value.amount || rechargeForm.value.amount <= 0) {
        ElMessage.warning('请输入有效的充值金额')
        return
      }
      
      try {
        await safeDispatch('user/updateBalance', userInfo.value.balance + rechargeForm.value.amount)
        ElMessage.success(`成功充值 ${rechargeForm.value.amount} 元`)
        rechargeVisible.value = false
      } catch (error) {
        // 错误已在 safeDispatch 中处理
      }
    }

    const showFeedbackDialog = () => {
      feedbackVisible.value = true
    }

    const handleImageChange = (file) => {
      // 处理图片上传
      feedbackForm.value.images.push(file)
    }

    const submitFeedback = () => {
      // 添加表单验证
      if (!feedbackForm.value.type) {
        ElMessage.warning('请选择建议类型')
        return
      }
      if (!feedbackForm.value.content || feedbackForm.value.content.trim() === '') {
        ElMessage.warning('请填写建议内容')
        return
      }
      
      ElMessage.success('感谢您的建议，我们会认真考虑')
      feedbackVisible.value = false
      feedbackForm.value = {
        canteen: '',
        window: '',
        type: '',
        content: '',
        images: []
      }
    }

    const showAbout = () => {
      ElMessage({
        message: '校园食堂点餐系统 v1.0.0',
        type: 'info'
      })
    }

    const handleLogout = async () => {
      try {
        await ElMessageBox.confirm(
          '确定要退出登录吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )

        await safeDispatch('user/logout')
        
        ElMessage.success('已退出登录')
        
        // 使用 replace 而不是 push，避免返回到登出前的页面
        router.replace({
          path: '/login',
          query: { t: Date.now() }
        })

      } catch (error) {
        if (error !== 'cancel') {
          console.error('退出登录失败:', error)
          ElMessage.error('退出失败，请重试')
        }
      }
    }

    const navigateToPage = (path) => {
      try {
        // 确保路径格式正确
        const fullPath = path.startsWith('/') 
          ? path 
          : `/student/${path}`
        
        console.log('Navigating to:', fullPath) // 添加日志
        router.push(fullPath).catch(err => {
          if (err.name !== 'NavigationDuplicated') {
            console.error('Navigation error:', err)
            ElMessage.error('页面跳转失败')
          }
        })
      } catch (error) {
        console.error('Navigation setup error:', error)
        ElMessage.error('页面跳转失败')
      }
    }

    const handleMenuClick = (command) => {
      try {
        switch (command) {
          case 'wallet':
            navigateToPage('wallet')  // 修改这里，去掉前面的斜杠
            break
          case 'transactions':
            navigateToPage('transactions')
            break
          case 'favorites':
            navigateToPage('favorites')
            break
          case 'reviews':
            navigateToPage('reviews')
            break
          case 'notification-settings':
            navigateToPage('notification-settings')
            break
          case 'preferences':
            navigateToPage('preferences')
            break
          case 'my-feedbacks':
            navigateToPage('feedback-list')
            break
          case 'points':
            navigateToPage('points-history')
            break
          default:
            console.warn(`未处理的菜单命令: ${command}`)
            break
        }
      } catch (error) {
        console.error('Menu click error:', error) // 添加错误日志
        ElMessage.error('操作失败')
      }
    }

    const profileEditVisible = ref(false)
    const profileForm = ref({
      avatar: '',
      name: '',
      phone: '',
      email: ''
    })

    const profileFormRules = ref({
      name: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
      ],
      phone: [
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
      ],
      email: [
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
      ]
    })

    const profileFormRef = ref(null)
    const isUpdatingProfile = ref(false)

    const showEditProfile = () => {
      profileForm.value = {
        avatar: userInfo.value.avatar,
        name: userInfo.value.name,
        phone: userInfo.value.phone || '',
        email: userInfo.value.email || ''
      }
      profileEditVisible.value = true
    }

    const handleAvatarChange = (file) => {
      // 验证文件类型和大小
      const isImage = file.raw.type.startsWith('image/')
      const isLt2M = file.raw.size / 1024 / 1024 < 2

      if (!isImage) {
        ElMessage.error('只能上传图片文件!')
        return
      }
      if (!isLt2M) {
        ElMessage.error('图片大小不能超过 2MB!')
        return
      }

      // 创建临时URL预览
      profileForm.value.avatar = URL.createObjectURL(file.raw)
    }

    const updateProfile = async () => {
      if (!profileFormRef.value) return
      
      try {
        await profileFormRef.value.validate()
        
        isUpdatingProfile.value = true
        await safeDispatch('user/updateUserInfo', {
          ...userInfo.value,
          avatar: profileForm.value.avatar,
          name: profileForm.value.name,
          phone: profileForm.value.phone,
          email: profileForm.value.email
        })
        
        ElMessage.success('个人信息更新成功')
        profileEditVisible.value = false
      } catch (error) {
        if (error.message !== 'validation failed') {
          console.error('更新个人信息失败:', error)
          ElMessage.error('更新失败，请重试')
        }
      } finally {
        isUpdatingProfile.value = false
      }
    }

    const pointsRulesVisible = ref(false)
    const pointsExchangeVisible = ref(false)
    const exchangeItems = ref([
      {
        id: 1,
        name: '5元代金券',
        description: '可用于抵扣订单金额',
        points: 500,
        image: '/images/voucher.png'
      },
      {
        id: 2,
        name: '10元代金券',
        description: '可用于抵扣订单金额',
        points: 1000,
        image: '/images/voucher.png'
      },
      {
        id: 3,
        name: '免配送费券',
        description: '单次订单免配送费',
        points: 200,
        image: '/images/delivery.png'
      }
    ])

    const showPointsRules = () => {
      pointsRulesVisible.value = true
    }

    const showPointsExchange = () => {
      pointsExchangeVisible.value = true
    }

    const handleExchange = async (item) => {
      try {
        await safeDispatch('user/exchangePoints', {
          itemId: item.id,
          points: item.points
        })
        ElMessage.success('兑换成功')
      } catch (error) {
        // 错误已在 safeDispatch 中处理
      }
    }

    return {
      userInfo,
      rechargeVisible,
      rechargeForm,
      feedbackVisible,
      feedbackForm,
      canteens,
      showRecharge,
      handleRecharge,
      showFeedbackDialog,
      handleImageChange,
      submitFeedback,
      showAbout,
      handleLogout,
      getWindows,
      navigateToPage,
      handleMenuClick,
      profileEditVisible,
      profileForm,
      showEditProfile,
      handleAvatarChange,
      updateProfile,
      profileFormRef,
      profileFormRules,
      isUpdatingProfile,
      pointsRulesVisible,
      pointsExchangeVisible,
      exchangeItems,
      showPointsRules,
      showPointsExchange,
      handleExchange
    }
  }
}
</script>

<style scoped>
.user-profile-container {
  width: 100%;
  min-height: 100%;
  background-color: #f5f7fa;
}

.user-profile {
  padding: 12px 8px;
}

.user-info-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px 12px;
  margin-bottom: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.08);
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.info-content {
  margin-left: 16px;
}

.info-content h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  display: inline-block;
}

.info-content p {
  margin: 6px 0 0;
  color: #666;
  font-size: 14px;
}

.balance-info {
  display: flex;
  justify-content: space-around;
  padding-top: 12px;
  border-top: 1px solid #f5f5f5;
}

.balance-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.2s ease;
}

.balance-item:hover {
  opacity: 0.8;
  transform: scale(1.05);
}

.balance-item .amount {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-color-primary);
  user-select: none;  /* 防止文本被选中 */
}

.balance-item .label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  user-select: none;  /* 防止文本被选中 */
}

.menu-list {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin: 0 -8px;
}

.logout-button {
  padding: 16px;
  text-align: center;
}

.recharge-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.recharge-option {
  padding: 12px;
  text-align: center;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.recharge-option.active {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

:deep(.el-upload--picture-card) {
  width: 100px;
  height: 100px;
  line-height: 100px;
}

.menu-card {
  margin-bottom: 12px;
  border-radius: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.menu-item:hover {
  background-color: #f5f7fa;
}

.menu-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}

.menu-icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #409EFF;
}

.menu-value {
  color: #909399;
  font-size: 14px;
}

.edit-btn {
  margin-left: auto;
}

.avatar-uploader {
  text-align: center;
}

.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
}

.avatar-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.name-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-btn {
  padding: 4px 8px;
  height: 28px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  border-radius: 4px;
  transition: all 0.3s;
}

.edit-btn:hover {
  background-color: var(--el-color-primary-light-9);
}

.edit-btn .el-icon {
  font-size: 14px;
}

.edit-text {
  margin-left: 2px;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.points-rules {
  padding: 0 12px;
}

.points-rules h4 {
  margin: 16px 0 8px;
  color: #303133;
}

.points-rules ul {
  margin: 0;
  padding-left: 20px;
  color: #606266;
}

.points-rules li {
  margin: 8px 0;
}

.points-value {
  color: var(--el-color-primary);
  font-weight: 600;
}

.exchange-list {
  display: grid;
  gap: 12px;
  padding: 12px 0;
}

.exchange-item {
  border: 1px solid #ebeef5;
}

.exchange-content {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.exchange-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 16px;
}

.exchange-info h3 {
  margin: 0 0 8px;
  font-size: 16px;
}

.exchange-info p {
  margin: 0 0 8px;
  color: #909399;
  font-size: 14px;
}

.exchange-points {
  font-size: 14px;
}

.balance-item:hover {
  opacity: 0.8;
  transform: scale(1.02);
  transition: all 0.3s ease;
}

.points {
  color: var(--el-color-primary);
  font-weight: 500;
  margin-right: 4px;
}

.menu-value {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #909399;
  font-size: 14px;
}
</style> 