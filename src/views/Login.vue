<template>
  <div class="login-container">
    <div class="particles"></div>
    
    <div class="top-logo">
      <img src="@/assets/images/image.png" alt="桂林电子科技大学" class="school-logo">
    </div>

    <div class="login-box">
      <div class="login-header">
        <h2>GUET智慧食堂</h2>
        <p class="subtitle">桂林电子科技大学</p>
      </div>

      <el-tabs v-model="activeTab" class="login-tabs">
        <el-tab-pane label="学号密码登录" name="account">
          <el-form 
            ref="accountFormRef"
            :model="accountForm"
            :rules="accountRules"
            class="login-form">
            <el-form-item prop="studentId">
              <el-input
                v-model="accountForm.studentId"
                placeholder="请输入学号">
                <template #prefix>
                  <div class="input-icon-wrapper">
                    <el-icon><Cpu /></el-icon>
                  </div>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="accountForm.password"
                type="password"
                placeholder="请输入密码"
                show-password>
                <template #prefix>
                  <div class="input-icon-wrapper">
                    <el-icon><Lock /></el-icon>
                  </div>
                </template>
              </el-input>
            </el-form-item>
            <div class="test-account-tip">
              测试账号：2200580121 密码：123456
            </div>
            <el-form-item>
              <el-button 
                type="primary" 
                class="login-button"
                :loading="loading"
                @click="handleAccountLogin">
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="手机号登录" name="phone">
          <el-form
            ref="phoneFormRef"
            :model="phoneForm"
            :rules="phoneRules"
            class="login-form">
            <el-form-item prop="phone">
              <el-input
                v-model="phoneForm.phone"
                placeholder="请输入手机号">
                <template #prefix>
                  <div class="input-icon-wrapper">
                    <el-icon><Iphone /></el-icon>
                  </div>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <div class="code-input">
                <el-input
                  v-model="phoneForm.code"
                  placeholder="请输入验证码">
                  <template #prefix>
                    <div class="input-icon-wrapper">
                      <el-icon><Message /></el-icon>
                    </div>
                  </template>
                </el-input>
                <el-button 
                  type="primary" 
                  :disabled="!!timer"
                  @click="sendCode"
                  class="verify-button">
                  {{ codeText }}
                </el-button>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button 
                type="primary" 
                class="login-button"
                :loading="loading"
                @click="handlePhoneLogin">
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="微信扫码" name="wechat">
          <div class="qr-container">
            <div class="qr-wrapper">
              <img :src="qrCode" alt="微信扫码登录" class="qr-code">
              <div class="qr-overlay" v-if="!qrCode">
                <el-icon><Loading /></el-icon>
                <span>正在加载二维码...</span>
              </div>
            </div>
            <p class="qr-tip">请使用微信扫码登录</p>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div class="login-footer" v-if="!isRegisterMode">
        <el-button 
          link 
          type="primary" 
          @click="isRegisterMode = true" 
          class="register-link">
          还没有账号？立即注册
        </el-button>
      </div>
      
      <div class="login-footer" v-else>
        <el-button 
          link 
          type="primary" 
          @click="isRegisterMode = false" 
          class="register-link">
          已有账号？立即登录
        </el-button>
      </div>

      <!-- 注册表单 -->
      <transition name="fade" mode="out-in">
        <div v-if="isRegisterMode" class="register-form-container">
          <div class="register-header">
            <h3>注册账号</h3>
          </div>
          <el-form
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            class="login-form">
            <el-form-item prop="phone">
              <el-input 
                v-model="registerForm.phone" 
                placeholder="请输入手机号">
                <template #prefix>
                  <div class="input-icon-wrapper">
                    <el-icon><Iphone /></el-icon>
                  </div>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <div class="code-input">
                <el-input 
                  v-model="registerForm.code" 
                  placeholder="请输入验证码">
                  <template #prefix>
                    <div class="input-icon-wrapper">
                      <el-icon><Message /></el-icon>
                    </div>
                  </template>
                </el-input>
                <el-button 
                  type="primary" 
                  :disabled="!!registerTimer"
                  @click="sendRegisterCode"
                  class="verify-button">
                  {{ registerCodeText }}
                </el-button>
              </div>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="请设置密码"
                show-password>
                <template #prefix>
                  <div class="input-icon-wrapper">
                    <el-icon><Lock /></el-icon>
                  </div>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword">
              <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="请确认密码"
                show-password>
                <template #prefix>
                  <div class="input-icon-wrapper">
                    <el-icon><Lock /></el-icon>
                  </div>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button 
                type="primary" 
                class="login-button"
                :loading="registering"
                @click="handleRegister">
                注册
              </el-button>
            </el-form-item>
          </el-form>
          <div class="login-footer">
            <el-button 
              link 
              type="primary" 
              @click="isRegisterMode = false" 
              class="register-link">
              已有账号？立即登录
            </el-button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Lock, Iphone, Message, Cpu, Loading, ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 表单数据
const activeTab = ref('account')
const loading = ref(false)
const timer = ref(null)
const registerTimer = ref(null)
const codeText = ref('获取验证码')
const registerCodeText = ref('获取验证码')
const qrCode = ref('')
const isRegisterMode = ref(false)
const registering = ref(false)

// 表单ref
const accountFormRef = ref(null)
const phoneFormRef = ref(null)
const registerFormRef = ref(null)

// 表单数据
const accountForm = ref({
  studentId: '',
  password: ''
})

const phoneForm = ref({
  phone: '',
  code: ''
})

const registerForm = ref({
  phone: '',
  code: '',
  password: '',
  confirmPassword: ''
})

// 验证规则
const accountRules = {
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { pattern: /^\d{10}$/, message: '请输入正确的学号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
}

const phoneRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '请输入6位验证码', trigger: 'blur' }
  ]
}

const registerRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '请输入6位验证码', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 处理学号密码登录
const handleAccountLogin = async () => {
  if (!accountFormRef.value) return
  await accountFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 测试账号验证
        if (accountForm.value.studentId === '2200580121' && accountForm.value.password === '123456') {
          // 保存登录状态
          const userInfo = {
            studentId: accountForm.value.studentId,
            verifiedInfo: {
              role: 'student'
            }
          }
          localStorage.setItem('token', 'test-token')
          localStorage.setItem('user', JSON.stringify(userInfo))
          
          ElMessage.success('登录成功')
          
          // 验证重定向地址
          const redirect = route.query.redirect
          if (redirect && redirect.startsWith('/student/')) {
            router.push(redirect)
          } else {
            router.push('/student/home')
          }
          return
        }
        
        // TODO: 调用登录API
        await new Promise(resolve => setTimeout(resolve, 1000))
        ElMessage.error('账号或密码错误')
      } catch (error) {
        ElMessage.error('登录失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 处理手机号登录
const handlePhoneLogin = async () => {
  if (!phoneFormRef.value) return
  await phoneFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // TODO: 调用登录API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 保存登录状态
        const userInfo = {
          phone: phoneForm.value.phone,
          verifiedInfo: {
            role: 'student'
          }
        }
        localStorage.setItem('token', 'test-token')
        localStorage.setItem('user', JSON.stringify(userInfo))
        
        ElMessage.success('登录成功')
        
        // 验证重定向地址
        const redirect = route.query.redirect
        if (redirect && redirect.startsWith('/student/')) {
          router.push(redirect)
        } else {
          router.push('/student/home')
        }
      } catch (error) {
        ElMessage.error('登录失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 发送验证码
const sendCode = async () => {
  if (!phoneForm.value.phone) {
    ElMessage.warning('请先输入手机号')
    return
  }
  // TODO: 调用发送验证码API
  let count = 60
  codeText.value = `${count}s后重新获取`
  timer.value = setInterval(() => {
    count--
    codeText.value = `${count}s后重新获取`
    if (count === 0) {
      clearInterval(timer.value)
      timer.value = null
      codeText.value = '获取验证码'
    }
  }, 1000)
}

// 发送注册验证码
const sendRegisterCode = async () => {
  if (!registerForm.value.phone) {
    ElMessage.warning('请先输入手机号')
    return
  }
  // TODO: 调用发送验证码API
  let count = 60
  registerCodeText.value = `${count}s后重新获取`
  registerTimer.value = setInterval(() => {
    count--
    registerCodeText.value = `${count}s后重新获取`
    if (count === 0) {
      clearInterval(registerTimer.value)
      registerTimer.value = null
      registerCodeText.value = '获取验证码'
    }
  }, 1000)
}

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      registering.value = true
      try {
        // TODO: 调用注册API
        await new Promise(resolve => setTimeout(resolve, 1000))
        ElMessage.success('注册成功')
        isRegisterMode.value = false
        // 重置表单
        registerForm.value = {
          phone: '',
          code: '',
          password: '',
          confirmPassword: ''
        }
      } catch (error) {
        ElMessage.error('注册失败')
      } finally {
        registering.value = false
      }
    }
  })
}

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
  if (registerTimer.value) {
    clearInterval(registerTimer.value)
  }
})

const createParticle = () => {
  const particle = document.createElement('div')
  particle.className = 'particle'
  
  // Random starting position
  const startX = Math.random() * window.innerWidth
  const startY = Math.random() * window.innerHeight
  
  // Random ending position
  const endX = (Math.random() - 0.5) * 200
  const endY = (Math.random() - 0.5) * 200
  
  particle.style.setProperty('--end-x', `${endX}px`)
  particle.style.setProperty('--end-y', `${endY}px`)
  particle.style.left = `${startX}px`
  particle.style.top = `${startY}px`
  
  // Random animation duration
  const duration = 3000 + Math.random() * 4000
  particle.style.animation = `particle ${duration}ms linear forwards`
  
  return particle
}

const initParticles = () => {
  const container = document.querySelector('.particles')
  if (!container) return
  
  const addParticle = () => {
    const particle = createParticle()
    container.appendChild(particle)
    
    // Remove particle after animation
    particle.addEventListener('animationend', () => {
      particle.remove()
    })
  }
  
  // Add initial particles
  for (let i = 0; i < 50; i++) {
    addParticle()
  }
  
  // Continuously add new particles
  setInterval(addParticle, 200)
}

onMounted(() => {
  initParticles()
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 数字肌理背景 */
.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('@/assets/images/campus-outline.svg') center/cover no-repeat;
  opacity: 0.08;
  mix-blend-mode: overlay;
  animation: backgroundFlow 20s linear infinite;
}

/* 微质感磨砂玻璃层 */
.login-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(0.8px);
  background: radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%);
  pointer-events: none;
}

@keyframes backgroundFlow {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 100%;
  }
}

.top-logo {
  width: 100%;
  text-align: center;
  margin-bottom: 30px;
  padding-top: 20px;
  position: relative;
  z-index: 1;
}

.school-logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
  animation: logoEntrance 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

@keyframes logoEntrance {
  0% {
    opacity: 0;
    transform: translateY(-40px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.login-box {
  width: 380px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(30,60,114,0.12);
  backdrop-filter: blur(12px);
  position: relative;
  z-index: 1;
  animation: boxEntrance 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.3s backwards;
}

@keyframes boxEntrance {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
}

.login-header h2 {
  background: linear-gradient(135deg, #1E88E5, #1565C0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 24px;
  margin-bottom: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.subtitle {
  margin: 8px 0 0;
  font-size: 14px;
  color: #546E7A;
  position: relative;
  font-weight: 500;
}

.subtitle::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, #1E3C72, #2A5298);
  border-radius: 1px;
}

/* 登录表单样式 */
.login-form {
  margin-top: 24px;
}

:deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(30,60,114,0.1);
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  border-color: rgba(30,60,114,0.2);
  box-shadow: 0 0 0 1px rgba(30,60,114,0.1);
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #1E3C72;
  box-shadow: 0 0 0 1px rgba(30,60,114,0.2);
}

/* 标签页样式优化 */
:deep(.el-tabs__nav-wrap) {
  padding: 0;
  margin-bottom: 20px;
}

:deep(.el-tabs__nav) {
  width: 100%;
  display: flex;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  padding: 4px;
}

:deep(.el-tabs__item) {
  flex: 1;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  height: 36px;
  line-height: 36px;
  padding: 0 16px !important;
  color: #606266;
}

:deep(.el-tabs__item.is-active) {
  color: #1E88E5;
  font-weight: 500;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(30,60,114,0.1);
}

:deep(.el-tabs__active-bar) {
  display: none;
}

.login-button {
  width: 100%;
  height: 40px;
  background: linear-gradient(135deg, #1E3C72, #2A5298);
  border: none;
  font-weight: 500;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30,60,114,0.2);
}

.login-button:active {
  transform: translateY(0);
}

.code-input {
  display: flex;
  gap: 12px;
}

.code-input .el-input {
  flex: 1;
}

.code-input :deep(.el-button) {
  background: linear-gradient(135deg, #1E3C72, #2A5298);
  border: none;
  color: white;
  transition: all 0.3s ease;
}

.code-input :deep(.el-button:hover) {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .login-container {
    background: linear-gradient(135deg, #1A237E 0%, #0D47A1 100%);
  }
  
  .login-box {
    background: rgba(26, 32, 44, 0.95);
  }
  
  :deep(.el-input__wrapper) {
    background: rgba(26, 32, 44, 0.8);
    border-color: rgba(255,255,255,0.1);
  }
  
  :deep(.el-tabs__nav) {
    background: rgba(26, 32, 44, 0.6);
  }
  
  :deep(.el-tabs__item.is-active) {
    background: #2A5298;
    color: white;
  }
  
  .subtitle {
    color: rgba(255,255,255,0.7);
  }
}

/* 移动端适配优化 */
@media screen and (max-width: 480px) {
  .school-logo {
    width: 100px;
    height: 100px;
  }

  .login-box {
    width: 95%;
    max-width: 380px;
    padding: 20px;
  }
  
  .qr-wrapper {
    width: 160px;
    height: 160px;
  }

  :deep(.el-tabs__item) {
    padding: 0 8px !important;
    font-size: 13px;
  }
  
  .login-header h2 {
    font-size: 22px;
  }
  
  .subtitle {
    font-size: 13px;
  }
}

/* 添加粒子动画效果 */
@keyframes particle {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(var(--end-x), var(--end-y));
  }
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  pointer-events: none;
}

.input-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}

:deep(.el-input__prefix) {
  margin-right: 8px;
}

:deep(.el-input:focus-within .input-icon-wrapper) {
  transform: scale(1.1);
}

.verify-button {
  position: relative;
  overflow: hidden;
}

.verify-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transform: translateX(-100%);
}

.verify-button:not(:disabled):hover::before {
  transform: translateX(100%);
  transition: transform 0.6s ease;
}

.register-link {
  position: relative;
  overflow: hidden;
  font-size: 14px;
  color: var(--el-color-primary);
}

.register-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 1px;
  background: currentColor;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.register-link:hover::after {
  width: 100%;
}

.qr-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 16px;
  padding: 12px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
}

.qr-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.9);
  gap: 8px;
}

.qr-overlay .el-icon {
  font-size: 24px;
  color: var(--el-color-primary);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.qr-code {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.qr-tip {
  margin: 0;
  color: #909399;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.qr-tip::before,
.qr-tip::after {
  content: '';
  width: 16px;
  height: 1px;
  background: currentColor;
  opacity: 0.3;
}

.register-form-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 16px;
  z-index: 10;
}

.register-form-container .login-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.register-form-container .login-footer {
  margin-top: auto;
  padding-top: 16px;
}

.login-footer {
  text-align: center;
  margin-top: 16px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .register-form-container {
    background: rgba(26, 32, 44, 0.95);
  }
}

.register-header {
  text-align: center;
  margin-bottom: 24px;
}

.register-header h3 {
  font-size: 20px;
  color: #1E3C72;
  margin: 0;
  font-weight: 600;
  background: linear-gradient(135deg, #1E88E5, #1565C0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .register-header h3 {
    background: linear-gradient(135deg, #90CAF9, #42A5F5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.test-account-tip {
  text-align: center;
  color: #909399;
  font-size: 12px;
  margin-bottom: 16px;
  padding: 8px;
  background: rgba(144, 147, 153, 0.1);
  border-radius: 4px;
  user-select: all;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .test-account-tip {
    background: rgba(144, 147, 153, 0.05);
  }
}
</style>
