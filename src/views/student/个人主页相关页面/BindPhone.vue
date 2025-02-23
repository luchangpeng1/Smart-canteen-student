<template>
  <div class="bind-phone-container">
    <back-header title="绑定手机号" />
    <div class="bind-steps">
      <!-- 步骤指示器 -->
      <el-steps :active="currentStep" finish-status="success" align-center>
        <el-step title="验证手机号" />
        <el-step title="设置绑定" />
        <el-step title="完成绑定" />
      </el-steps>

      <!-- 步骤1：验证手机号 -->
      <div v-if="currentStep === 0" class="step-content">
        <div class="step-title">验证手机号</div>
        <el-form :model="form" ref="verifyFormRef" :rules="verifyRules" class="form-container">
          <el-form-item prop="phoneNumber">
            <el-input 
              v-model="form.phoneNumber" 
              placeholder="请输入手机号"
              maxlength="11"
              :disabled="isGettingCode"
            >
              <template #prefix>
                <el-icon><Phone /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="verificationCode">
            <div class="verification-code-container">
              <el-input 
                v-model="form.verificationCode" 
                placeholder="请输入验证码"
                maxlength="6"
              >
                <template #prefix>
                  <el-icon><Key /></el-icon>
                </template>
              </el-input>
              <el-button 
                type="primary" 
                class="get-code-button"
                :disabled="isGettingCode || countdown > 0 || !isValidPhone"
                @click="getVerificationCode"
              >
                {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
              </el-button>
            </div>
          </el-form-item>
          <el-button 
            type="primary" 
            @click="verifyPhone" 
            class="submit-button"
            :loading="isVerifying"
          >
            下一步
          </el-button>
        </el-form>
      </div>

      <!-- 步骤2：设置绑定 -->
      <div v-if="currentStep === 1" class="step-content">
        <div class="step-title">设置绑定</div>
        <div class="bind-info">
          <p class="phone-display">将为账号绑定手机号：{{ maskPhoneNumber(form.phoneNumber) }}</p>
          <div class="notice-list">
            <div class="notice-item">
              <el-icon><InfoFilled /></el-icon>
              <span>绑定后可用手机号登录</span>
            </div>
            <div class="notice-item">
              <el-icon><InfoFilled /></el-icon>
              <span>可通过手机号找回密码</span>
            </div>
            <div class="notice-item">
              <el-icon><InfoFilled /></el-icon>
              <span>接收账号安全和订单通知</span>
            </div>
          </div>
        </div>
        <el-button 
          type="primary" 
          @click="confirmBind" 
          class="submit-button"
          :loading="isBinding"
        >
          确认绑定
        </el-button>
        <el-button 
          text
          @click="currentStep = 0" 
          class="back-button"
        >
          返回修改
        </el-button>
      </div>

      <!-- 步骤3：绑定成功 -->
      <div v-if="currentStep === 2" class="step-content success-content">
        <el-icon class="success-icon" :size="64"><CircleCheck /></el-icon>
        <h2>手机号绑定成功</h2>
        <p>您已成功绑定手机号 {{ maskPhoneNumber(form.phoneNumber) }}</p>
        <el-button 
          type="primary" 
          @click="goToProfile" 
          class="submit-button"
        >
          完成
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Phone, Key, InfoFilled, CircleCheck } from '@element-plus/icons-vue';
import BackHeader from '@/views/student/components/BackHeader.vue';

export default {
  name: 'BindPhone',
  components: {
    BackHeader,
    Phone,
    Key,
    InfoFilled,
    CircleCheck
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const verifyFormRef = ref(null);
    const currentStep = ref(0);
    const isVerifying = ref(false);
    const isBinding = ref(false);
    const isGettingCode = ref(false);
    const countdown = ref(0);
    let countdownTimer = null;

    const form = ref({
      phoneNumber: '',
      verificationCode: ''
    });

    // 验证手机号格式
    const isValidPhone = computed(() => {
      return /^1[3-9]\d{9}$/.test(form.value.phoneNumber);
    });

    const verifyRules = {
      phoneNumber: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
      ],
      verificationCode: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { len: 6, message: '验证码长度应为6位', trigger: 'blur' },
        { pattern: /^\d{6}$/, message: '验证码应为6位数字', trigger: 'blur' }
      ]
    };

    // 手机号加密显示
    const maskPhoneNumber = (phone) => {
      return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    };

    const startCountdown = () => {
      countdown.value = 60;
      countdownTimer = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--;
        } else {
          clearInterval(countdownTimer);
        }
      }, 1000);
    };

    const getVerificationCode = async () => {
      if (!isValidPhone.value) {
        ElMessage.warning('请输入正确的手机号');
        return;
      }

      try {
        isGettingCode.value = true;
        // 检查手机号是否已被绑定
        await new Promise(resolve => setTimeout(resolve, 500));
        // 模拟发送验证码
        await new Promise(resolve => setTimeout(resolve, 1000));
        ElMessage.success('验证码已发送到您的手机');
        startCountdown();
      } catch (error) {
        ElMessage.error('获取验证码失败，请重试');
      } finally {
        isGettingCode.value = false;
      }
    };

    const verifyPhone = async () => {
      if (!verifyFormRef.value) return;
      
      try {
        await verifyFormRef.value.validate();
        isVerifying.value = true;
        
        // 模拟验证过程
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 验证成功，进入下一步
        currentStep.value = 1;
      } catch (error) {
        ElMessage.error('请检查输入是否正确');
      } finally {
        isVerifying.value = false;
      }
    };

    const confirmBind = async () => {
      try {
        isBinding.value = true;
        // 模拟绑定过程
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 更新用户信息
        await store.dispatch('user/updateUserInfo', {
          ...store.state.user.userInfo,
          phone: form.value.phoneNumber
        });
        
        // 绑定成功，进入完成步骤
        currentStep.value = 2;
      } catch (error) {
        ElMessage.error('绑定失败，请重试');
      } finally {
        isBinding.value = false;
      }
    };

    const goToProfile = () => {
      router.push('/student/profile');
    };

    return {
      currentStep,
      form,
      verifyFormRef,
      verifyRules,
      isVerifying,
      isBinding,
      isGettingCode,
      countdown,
      isValidPhone,
      maskPhoneNumber,
      getVerificationCode,
      verifyPhone,
      confirmBind,
      goToProfile
    };
  }
};
</script>

<style scoped>
.bind-phone-container {
  background-color: #ffffff;
  min-height: 100vh;
}

.bind-steps {
  padding: 24px;
  max-width: 90%;
  margin: auto;
}

.step-content {
  margin-top: 40px;
}

.step-title {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 24px;
  text-align: center;
}

.form-container {
  max-width: 400px;
  margin: 0 auto;
}

.verification-code-container {
  display: flex;
  gap: 12px;
}

.get-code-button {
  width: 120px;
  white-space: nowrap;
}

.submit-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(135deg, #409eff, #007aff);
  border: none;
  border-radius: 8px;
  margin-top: 32px;
  transition: all 0.3s ease;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.submit-button:active {
  transform: translateY(0);
}

.back-button {
  width: 100%;
  margin-top: 16px;
  margin-left: 0px;
}

.bind-info {
  max-width: 400px;
  margin: 32px auto;
  text-align: center;
}

.phone-display {
  font-size: 18px;
  color: #303133;
  margin-bottom: 24px;
}

.notice-list {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.notice-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
  margin-bottom: 12px;
}

.notice-item:last-child {
  margin-bottom: 0;
}

.notice-item .el-icon {
  color: #409eff;
}

.success-content {
  text-align: center;
  padding: 40px 0;
}

.success-icon {
  color: #67c23a;
  margin-bottom: 16px;
}

.success-content h2 {
  font-size: 24px;
  color: #303133;
  margin: 16px 0;
}

.success-content p {
  color: #606266;
  margin-bottom: 32px;
}

:deep(.el-input-group__prepend) {
  padding: 0 12px;
}

:deep(.el-steps) {
  margin-bottom: 40px;
}

@media (max-width: 600px) {
  .bind-steps {
    padding: 16px;
  }

  .verification-code-container {
    gap: 8px;
  }

  .get-code-button {
    width: 100px;
    font-size: 12px;
    padding: 0 8px;
  }

  .submit-button {
    height: 48px;
    font-size: 16px;
  }

  .phone-display {
    font-size: 16px;
  }
}
</style> 