<template>
  <div class="change-password-container">
    <back-header title="修改密码" />
    
    <!-- 未绑定手机号时显示提示 -->
    <div v-if="!hasBindPhone" class="bind-phone-tip">
      <el-empty
        description="您还未绑定手机号"
        :image-size="120"
      >
        <template #description>
          <p>您需要先绑定手机号才能使用验证码修改密码</p>
        </template>
        <el-button type="primary" @click="goToBindPhone">去绑定手机号</el-button>
      </el-empty>
    </div>

    <!-- 已绑定手机号时显示修改密码表单 -->
    <div v-if="hasBindPhone" class="password-change-steps">
      <!-- 步骤指示器 -->
      <el-steps :active="currentStep" finish-status="success" align-center>
        <el-step title="身份验证" />
        <el-step title="设置新密码" />
        <el-step title="完成修改" />
      </el-steps>

      <!-- 步骤1：身份验证 -->
      <div v-if="currentStep === 0" class="step-content">
        <div class="step-title">身份验证</div>
        <div class="verification-info">
          <p>为了保障您的账号安全，请先进行身份验证</p>
          <div class="phone-info">
            <el-icon><Phone /></el-icon>
            <span>已绑定手机号：{{ maskPhoneNumber(form.phone) }}</span>
          </div>
        </div>
        <el-form :model="form" ref="verifyFormRef" :rules="verifyRules" class="form-container">
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
                :disabled="isGettingCode || countdown > 0"
                @click="getVerificationCode"
              >
                {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
              </el-button>
            </div>
          </el-form-item>
          <el-button 
            type="primary" 
            @click="verifyIdentity" 
            class="submit-button"
            :loading="isVerifying"
          >
            下一步
          </el-button>
        </el-form>
      </div>

      <!-- 步骤2：设置新密码 -->
      <div v-if="currentStep === 1" class="step-content">
        <div class="step-title">设置新密码</div>
        <el-form :model="form" ref="passwordFormRef" :rules="passwordRules" class="form-container">
          <el-form-item prop="newPassword">
            <el-input 
              type="password" 
              v-model="form.newPassword" 
              placeholder="请输入新密码"
              show-password
              @input="checkPasswordStrength"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
            <div class="password-requirements" v-if="form.newPassword">
              <div class="password-strength-section">
                <div class="section-header">
                  <span class="section-title">密码强度</span>
                  <span class="strength-text" :class="getStrengthClass(passwordStrength)">
                    {{ getStrengthText(passwordStrength) }}
                  </span>
                </div>
                <div class="strength-bars">
                  <div 
                    v-for="n in 3" 
                    :key="n" 
                    class="strength-bar"
                    :class="[
                      { active: passwordStrength >= n },
                      getStrengthClass(passwordStrength)
                    ]"
                  ></div>
                </div>
              </div>
              <div class="password-rules-section">
                <div class="section-header">
                  <span class="section-title">密码需要满足</span>
                </div>
                <div class="rules-grid">
                  <div class="rule-item" :class="{ 'rule-met': hasLength }">
                    <el-icon><component :is="hasLength ? 'CircleCheck' : 'CircleClose'" /></el-icon>
                    <span>长度至少8位</span>
                  </div>
                  <div class="rule-item" :class="{ 'rule-met': hasUpperCase }">
                    <el-icon><component :is="hasUpperCase ? 'CircleCheck' : 'CircleClose'" /></el-icon>
                    <span>包含大写字母</span>
                  </div>
                  <div class="rule-item" :class="{ 'rule-met': hasLowerCase }">
                    <el-icon><component :is="hasLowerCase ? 'CircleCheck' : 'CircleClose'" /></el-icon>
                    <span>包含小写字母</span>
                  </div>
                  <div class="rule-item" :class="{ 'rule-met': hasNumber }">
                    <el-icon><component :is="hasNumber ? 'CircleCheck' : 'CircleClose'" /></el-icon>
                    <span>包含数字</span>
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input 
              type="password" 
              v-model="form.confirmPassword" 
              placeholder="请确认新密码"
              show-password
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-button 
            type="primary" 
            @click="confirmNewPassword" 
            class="submit-button"
            :loading="isSubmitting"
          >
            确认修改
          </el-button>
          <el-button 
            text
            @click="currentStep = 0" 
            class="back-button"
          >
            返回修改
          </el-button>
        </el-form>
      </div>

      <!-- 步骤3：修改成功 -->
      <div v-if="currentStep === 2" class="step-content success-content">
        <el-icon class="success-icon" :size="64"><CircleCheck /></el-icon>
        <h2>密码修改成功</h2>
        <p>您的密码已经修改成功，请使用新密码重新登录</p>
        <div class="countdown-tip">
          <span>{{ logoutCountdown }}秒后自动退出登录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Phone, Key, Lock, CircleCheck, CircleClose } from '@element-plus/icons-vue';
import BackHeader from '@/views/student/components/BackHeader.vue';

export default {
  name: 'ChangePassword',
  components: {
    BackHeader,
    Phone,
    Key,
    Lock,
    CircleCheck,
    CircleClose
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const verifyFormRef = ref(null);
    const passwordFormRef = ref(null);
    const currentStep = ref(0);
    const isVerifying = ref(false);
    const isSubmitting = ref(false);
    const isGettingCode = ref(false);
    const countdown = ref(0);
    const logoutCountdown = ref(5);
    const hasBindPhone = ref(false);
    let countdownTimer = null;
    let logoutTimer = null;

    const form = ref({
      phone: '',
      verificationCode: '',
      newPassword: '',
      confirmPassword: ''
    });

    // 检查手机号绑定状态
    const checkPhoneBinding = () => {
      const userInfo = store.state.user?.userInfo || {};
      const phoneNumber = userInfo.phone;
      
      if (phoneNumber) {
        hasBindPhone.value = true;
        form.value.phone = phoneNumber;
      } else {
        hasBindPhone.value = false;
      }
    };

    // 手机号加密显示
    const maskPhoneNumber = (phone) => {
      return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    };

    // 密码强度检查
    const passwordStrength = ref(0);
    const hasLength = computed(() => form.value.newPassword.length >= 8);
    const hasUpperCase = computed(() => /[A-Z]/.test(form.value.newPassword));
    const hasLowerCase = computed(() => /[a-z]/.test(form.value.newPassword));
    const hasNumber = computed(() => /\d/.test(form.value.newPassword));

    const checkPasswordStrength = () => {
      let strength = 0;
      if (!form.value.newPassword) {
        passwordStrength.value = 0;
        return;
      }

      if (hasLength.value) strength++;
      if (hasUpperCase.value && hasLowerCase.value) strength++;
      if (hasNumber.value) strength++;

      passwordStrength.value = strength;
    };

    const getStrengthClass = (strength) => {
      const classes = ['weak', 'medium', 'strong'];
      return classes[strength - 1] || '';
    };

    const getStrengthText = (strength) => {
      const texts = ['弱', '中', '强'];
      return texts[strength - 1] || '';
    };

    // 验证规则
    const verifyRules = {
      verificationCode: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { len: 6, message: '验证码长度应为6位', trigger: 'blur' },
        { pattern: /^\d{6}$/, message: '验证码应为6位数字', trigger: 'blur' }
      ]
    };

    const passwordRules = {
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 8, message: '密码长度不能小于8位', trigger: 'blur' },
        { 
          validator: (rule, value, callback) => {
            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value)) {
              callback(new Error('密码必须包含大小写字母和数字'));
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }
      ],
      confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value !== form.value.newPassword) {
              callback(new Error('两次输入的密码不一致'));
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }
      ]
    };

    // 获取验证码
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
      try {
        isGettingCode.value = true;
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

    // 验证身份
    const verifyIdentity = async () => {
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

    // 确认新密码
    const confirmNewPassword = async () => {
      if (!passwordFormRef.value) return;
      
      try {
        await passwordFormRef.value.validate();
        isSubmitting.value = true;
        
        // 模拟修改密码
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 修改成功，进入完成步骤
        currentStep.value = 2;
        startLogoutCountdown();
      } catch (error) {
        ElMessage.error('请检查输入是否正确');
      } finally {
        isSubmitting.value = false;
      }
    };

    // 自动登出倒计时
    const startLogoutCountdown = () => {
      logoutTimer = setInterval(() => {
        if (logoutCountdown.value > 0) {
          logoutCountdown.value--;
        } else {
          clearInterval(logoutTimer);
          // 清除登录信息并跳转
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
        }
      }, 1000);
    };

    // 跳转到绑定手机号页面
    const goToBindPhone = () => {
      router.push('/student/bind-phone');
    };

    onMounted(() => {
      checkPhoneBinding();
    });

    onUnmounted(() => {
      if (countdownTimer) clearInterval(countdownTimer);
      if (logoutTimer) clearInterval(logoutTimer);
    });

    return {
      currentStep,
      form,
      verifyFormRef,
      passwordFormRef,
      verifyRules,
      passwordRules,
      isVerifying,
      isSubmitting,
      isGettingCode,
      countdown,
      logoutCountdown,
      hasBindPhone,
      passwordStrength,
      hasLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      maskPhoneNumber,
      checkPasswordStrength,
      getStrengthClass,
      getStrengthText,
      getVerificationCode,
      verifyIdentity,
      confirmNewPassword,
      goToBindPhone
    };
  }
};
</script>

<style scoped>
.change-password-container {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 32px;
}

.bind-phone-tip {
  padding: 48px 24px;
  text-align: center;
  background: #fff;
  margin: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.bind-phone-tip :deep(.el-empty__description p) {
  color: #606266;
  margin: 12px 0;
  font-size: 15px;
  line-height: 1.6;
}

.bind-phone-tip :deep(.el-button) {
  margin-top: 24px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.bind-phone-tip :deep(.el-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.password-change-steps {
  padding: 24px 16px;
  max-width: 480px;
  margin: auto;
}

:deep(.el-steps) {
  padding: 8px 24px 32px;
}

:deep(.el-step__title) {
  font-size: 15px;
  color: #909399;
}

:deep(.el-step__title.is-process) {
  color: #409eff;
  font-weight: 500;
}

:deep(.el-step__title.is-success) {
  color: #67c23a;
}

.step-content {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.step-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 28px;
  text-align: center;
}

.verification-info {
  text-align: center;
  margin-bottom: 32px;
}

.verification-info p {
  color: #606266;
  margin-bottom: 16px;
  font-size: 15px;
  line-height: 1.6;
}

.phone-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #303133;
  font-size: 16px;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  margin-top: 16px;
}

.form-container {
  max-width: 420px;
  margin: 0 auto;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  padding: 0 16px;
  height: 44px;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #409eff inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2) !important;
}

.verification-code-container {
  display: flex;
  gap: 12px;
}

.get-code-button {
  min-width: 120px;
  height: 44px;
  font-size: 14px;
  border-radius: 8px;
  padding: 0 16px;
  transition: all 0.3s ease;
}

.get-code-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.password-requirements {
  margin-top: 16px;
  margin-left: -4px;
  margin-right: -4px;
  background: #f8f9fa;
  border-radius: 0;
  overflow: hidden;
  border: 1px solid #ebeef5;
  border-left: none;
  border-right: none;
}

.password-strength-section {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
}

.password-rules-section {
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.strength-bars {
  display: flex;
  gap: 6px;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background-color: #ebeef5;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.strength-bar.active.weak {
  background-color: #f56c6c;
  box-shadow: 0 0 4px rgba(245, 108, 108, 0.4);
}

.strength-bar.active.medium {
  background-color: #e6a23c;
  box-shadow: 0 0 4px rgba(230, 162, 60, 0.4);
}

.strength-bar.active.strong {
  background-color: #67c23a;
  box-shadow: 0 0 4px rgba(103, 194, 58, 0.4);
}

.strength-text {
  font-size: 13px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
}

.strength-text.weak {
  color: #fff;
  background-color: #f56c6c;
}

.strength-text.medium {
  color: #fff;
  background-color: #e6a23c;
}

.strength-text.strong {
  color: #fff;
  background-color: #67c23a;
}

.rules-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.rule-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 6px;
  background: #fff;
  transition: all 0.3s ease;
}

.rule-item .el-icon {
  font-size: 16px;
  color: #dcdfe6;
  transition: all 0.3s ease;
}

.rule-item span {
  font-size: 13px;
  color: #909399;
  transition: all 0.3s ease;
}

.rule-item.rule-met {
  background: rgba(103, 194, 58, 0.1);
}

.rule-item.rule-met .el-icon {
  color: #67c23a;
}

.rule-item.rule-met span {
  color: #67c23a;
}

.submit-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  background: linear-gradient(135deg, #409eff, #007aff);
  border: none;
  margin-top: -10px;
  transition: all 0.3s ease;
}

.submit-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.3);
}

.submit-button:not(:disabled):active {
  transform: translateY(0);
}

.back-button {
  width: 100%;
  margin-top: -5px;
  margin-left: 0px;
  font-size: 15px;
  color: #606266;
}

.success-content {
  text-align: center;
  padding: 48px 24px;
}

.success-icon {
  color: #67c23a;
  margin-bottom: 24px;
  animation: scaleIn 0.5s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.success-content h2 {
  font-size: 24px;
  color: #303133;
  margin: 0 0 16px;
  font-weight: 600;
}

.success-content p {
  color: #606266;
  margin-bottom: 24px;
  font-size: 15px;
  line-height: 1.6;
}

.countdown-tip {
  color: #909399;
  font-size: 14px;
  padding: 12px 24px;
  background: #f8f9fa;
  border-radius: 20px;
  display: inline-block;
}

@media (max-width: 480px) {
  .password-change-steps {
    padding: 16px 12px;
  }

  :deep(.el-steps) {
    padding: 4px 12px 24px;
  }

  .step-content {
    padding: 20px 16px;
  }

  .step-title {
    font-size: 18px;
    margin-bottom: 24px;
  }

  .verification-code-container {
    gap: 8px;
  }

  .get-code-button {
    min-width: 108px;
    font-size: 13px;
  }

  .phone-info {
    font-size: 14px;
    padding: 10px;
  }

  .password-requirements {
    margin-right: -12px;
  }

  .password-strength-section,
  .password-rules-section {
    padding: 16px;
  }

  .rules-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .rule-item {
    padding: 8px 10px;
  }

  .submit-button {
    height: 40px;
    font-size: 15px;
  }

  .success-content {
    padding: 32px 16px;
  }

  .success-content h2 {
    font-size: 20px;
  }
}

/* 表单项内容样式 */
:deep(.el-form-item__content) {
  align-items: center;
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  font-size: var(--font-size);
  line-height: 20px;
  min-width: 0;
  position: relative;
}

/* 确保密码要求区域正确显示 */
:deep(.el-form-item__content .password-requirements) {
  width: 100%;
  margin-top: 16px;
  margin-right: -24px;
  background: #f8f9fa;
  border-radius: 0;
  overflow: hidden;
  border: 1px solid #ebeef5;
  border-left: none;
  border-right: none;
}
</style> 