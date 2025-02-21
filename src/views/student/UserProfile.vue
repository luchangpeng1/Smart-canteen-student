<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="merchant-info">
        <el-avatar :size="64" :src="userInfo.avatar" class="merchant-avatar">
          {{ userInfo.name.charAt(0) }}
        </el-avatar>
        <div class="merchant-detail">
          <div class="merchant-name">{{ userInfo.name }}</div>
          <div class="merchant-id">学号: {{ userInfo.studentId }}</div>
          <div class="registration-date">注册日期: {{ userInfo.registrationDate }}</div>
        </div>
        <el-button class="edit-profile-btn" type="primary" link @click="showEditProfile">
          <el-icon><Edit /></el-icon>
        </el-button>
      </div>
      <div class="income-overview">
        <div class="overview-item">
          <div class="item-value">¥{{ userInfo.balance.toFixed(2) }}</div>
          <div class="item-label">账户余额</div>
        </div>
        <div class="overview-item">
          <div class="item-value">{{ userInfo.points }}</div>
          <div class="item-label">积分</div>
        </div>
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="feature-section">
      <div class="section-title">账户管理</div>
      <div class="feature-grid">
        <div class="feature-item" @click="navigateTo('/student/wallet')">
          <el-icon class="menu-icon"><WalletFilled /></el-icon>
          <span>我的钱包</span>
        </div>
        <div class="feature-item" @click="navigateTo('/student/transactions')">
          <el-icon class="menu-icon"><Document /></el-icon>
          <span>消费记录</span>
        </div>
        <div class="feature-item" @click="navigateTo('/student/favorites')">
          <el-icon class="menu-icon"><StarFilled /></el-icon>
          <span>我的收藏</span>
        </div>
        <div class="feature-item" @click="navigateTo('/student/reviews')">
          <el-icon class="menu-icon"><ChatDotSquare /></el-icon>
          <span>历史评价</span>
          <el-badge v-if="unreadCount > 0" :value="unreadCount" class="notification-badge" />
        </div>
      </div>
    </div>

    <div class="feature-section">
      <div class="section-title">反馈与建议</div>
      <div class="feature-list">
        <div class="list-item" @click="navigateTo('/student/feedback-list')">
          <div class="item-left">
            <el-icon><EditPen /></el-icon>
            <span>提交建议</span>
          </div>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
        <div class="list-item" @click="navigateTo('/student/feedback-list')">
          <div class="item-left">
            <el-icon><Document /></el-icon>
            <span>我的建议</span>
          </div>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>

    <div class="feature-section">
      <div class="section-title">设置</div>
      <div class="feature-list">
        <div class="list-item" @click="navigateTo('/student/notification-settings')">
          <div class="item-left">
            <el-icon><Bell /></el-icon>
            <span>通知设置</span>
          </div>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
        <div class="list-item" @click="navigateTo('/student/preferences')">
          <div class="item-left">
            <el-icon><Setting /></el-icon>
            <span>偏好设置</span>
          </div>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>
    
    <div class="feature-section">
      <div class="section-title">信息与积分</div>
      <div class="feature-list">
        <div class="list-item" @click="handleMenuClick('PointsHistory')">
          <div class="item-left">
            <el-icon><InfoFilled /></el-icon>
            <span>关于我们</span>
          </div>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
        <div class="list-item" @click="navigateTo('/student/points-history')">
          <div class="item-left">
            <el-icon><Histogram /></el-icon>
            <span>积分历史</span>
          </div>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
        <div class="list-item" @click="navigateTo('/student/points-rules')">
          <div class="item-left">
            <el-icon><Document /></el-icon>
            <span>积分规则</span>
          </div>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
        <div class="list-item" @click="navigateTo('/student/points-exchange')">
          <div class="item-left">
            <el-icon><Present /></el-icon>
            <span>积分兑换</span>
          </div>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>

    <div class="feature-section">
      <div class="section-title">操作</div>
      <div class="feature-list">
        <div class="list-item" @click="navigateTo('/student/change-password')">
          <div class="item-left">
            <el-icon><Edit /></el-icon>
            <span>修改密码</span>
          </div>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
        <div class="list-item" @click="navigateTo('/student/bind-phone')">
          <div class="item-left">
            <el-icon><Phone /></el-icon>
            <span>绑定手机号</span>
          </div>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
        <div class="list-item" @click="navigateTo('/student/bind-wechat')">
          <div class="item-left">
            <el-icon><Share /></el-icon>
            <span>绑定微信</span>
          </div>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
      </div>
      <el-button type="danger" @click="handleLogout">退出登录</el-button>
    </div>

    <el-dialog v-model="profileEditVisible" title="编辑个人信息" width="90%" :close-on-click-modal="false">
      <el-form ref="profileFormRef" :model="profileForm" :rules="profileFormRules" label-width="80px">
        <el-form-item label="头像">
          <el-upload class="avatar-uploader" action="#" :show-file-list="false" :auto-upload="false" :on-change="handleAvatarChange" accept="image/*">
            <img v-if="profileForm.avatar" :src="profileForm.avatar" class="avatar" />
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
        <el-button type="primary" @click="updateProfile" :loading="isUpdatingProfile">保存</el-button>
      </template>
    </el-dialog>
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
  Present,
  Phone,
  Share
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
    Present,
    Phone,
    Share
  },
  setup() {
    const router = useRouter()
    const store = useStore()

    // 定义 unreadCount
    const unreadCount = ref(0); // 初始化为 0，您可以根据需要更新这个值

    const userInfo = computed(() => {
      try {
        return store?.getters?.['user/userInfo'] || {
          name: '',
          studentId: '',
          avatar: '',
          balance: 0,
          points: 0,
          registrationDate: '未知',
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
          registrationDate: '未知',
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

    const navigateTo = (path) => {
      router.push(path)
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

    const accountManagementItems = [
      { id: 1, label: '我的钱包', value: '¥{{ userInfo.balance }}', command: 'wallet', icon: WalletFilled },
      { id: 2, label: '消费记录', command: 'transactions', icon: List },
      { id: 3, label: '我的收藏', value: '{{ userInfo.favorites }}个菜品', command: 'favorites', icon: StarFilled },
      { id: 4, label: '历史评价', command: 'reviews', icon: ChatDotSquare }
    ];

    const feedbackItems = [
      { id: 5, label: '提交建议', command: 'feedback', icon: EditPen },
      { id: 6, label: '我的建议', value: '{{ userInfo.feedbacks }}条', command: 'my-feedbacks', icon: Message }
    ];

    const settingsItems = [
      { id: 7, label: '通知设置', command: 'notification-settings', icon: Bell },
      { id: 8, label: '偏好设置', command: 'preferences', icon: Setting }
    ];

    const informationItems = [
      { id: 9, label: '关于我们', command: 'about', icon: InfoFilled },
      { id: 10, label: '积分历史', command: 'points-history', icon: Histogram },
      { id: 11, label: '积分规则', command: 'points-rules', icon: Document },
      { id: 12, label: '积分兑换', command: 'points-exchange', icon: Present }
    ];

    const menuItems = [
      ...accountManagementItems,
      ...feedbackItems,
      ...settingsItems,
      ...informationItems
    ];

    const otherServiceItems = [
      { id: 1, label: '帮助中心', command: 'help-center', icon: 'HelpIcon' },
      { id: 2, label: '关于我们', command: 'about-us', icon: 'InfoIcon' }
    ];

    return {
      userInfo,
      unreadCount,
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
      navigateTo,
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
      handleExchange,
      menuItems,
      otherServiceItems
    }
  }
}
</script>

<style scoped>

.feature-section {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}


.section-title {
  font-size: 15px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 16px;
}


.feature-grid {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 0;
}


.feature-item {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 4px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
}


.feature-list {
  display: flex;
  flex-direction: column;
}


.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 12px;
}


.arrow-icon {
  color: rgba(0, 0, 0, 0.25);
  transition: transform 0.2s ease;
}


.profile-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 16px;
}

.profile-header {
  background: linear-gradient(135deg, #ffd000, #ffbb00);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  color: #2c3e50;
}

.merchant-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.merchant-avatar {
  border: 2px solid rgba(255, 255, 255, 0.8);
  background: #fff;
  color: #e17b00;
  font-weight: 600;
}

.merchant-detail {
  margin-left: 16px;
  flex: 1;
}

.merchant-name {
  font-size: 20px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
  margin-bottom: 4px;
}

.merchant-id {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
}

.registration-date {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
}

.edit-profile-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: rgba(0, 0, 0, 0.7);
}

.income-overview {
  display: flex;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 16px;
}

.overview-item {
  flex: 1;
  text-align: center;
}

.item-value {
  font-size: 18px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
  margin-bottom: 4px;
}

.item-label {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
}

.feature-section {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.section-title {
  font-size: 15px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 16px;
}

.menu-list {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 0;
}

.menu-card {
  padding: 12px;
  font-size: 16px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ff9800;
  background-color: #fff;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.menu-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  background-color: #f0f0f0;
}

.menu-icon {
  font-size: 28px;
  color: #ff9800;
}

.menu-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 4px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
}



.avatar-uploader .avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 120px;
}

.avatar-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.small-card {
  padding: 10px;
  font-size: 14px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 