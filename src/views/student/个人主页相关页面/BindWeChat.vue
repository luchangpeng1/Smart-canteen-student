<template>
  <div class="bind-wechat-container">
    <back-header title="绑定微信" />
    <div class="qr-container">
      <div class="qr-wrapper" :class="{ expired: isQrExpired }">
        <div v-if="!isQrExpired" class="qr-code">
          <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="微信二维码" />
          <div v-else class="loading-qr">
            <el-icon class="loading-icon" :size="32"><Loading /></el-icon>
            <span>正在生成二维码...</span>
          </div>
        </div>
        <div v-else class="expired-overlay">
          <p>二维码已过期</p>
          <el-button type="primary" @click="refreshQrCode">刷新二维码</el-button>
        </div>
      </div>
      <div class="bind-status" v-if="bindStatus">
        <el-icon :class="bindStatus.icon"><component :is="bindStatus.icon" /></el-icon>
        <span>{{ bindStatus.text }}</span>
      </div>
      <div class="instruction">
        <h3>绑定步骤</h3>
        <ol>
          <li>打开微信扫一扫</li>
          <li>扫描上方二维码</li>
          <li>在微信中确认绑定</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Loading, CircleCheck, Warning } from '@element-plus/icons-vue';
import BackHeader from '@/views/student/components/BackHeader.vue';

export default {
  name: 'BindWeChat',
  components: {
    BackHeader,
    Loading,
    CircleCheck,
    Warning
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const qrCodeUrl = ref('');
    const isQrExpired = ref(false);
    const bindStatus = ref(null);
    let checkStatusTimer = null;
    let expirationTimer = null;

    // 生成二维码
    const generateQrCode = async () => {
      try {
        // 这里应该调用后端API获取真实的二维码
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        qrCodeUrl.value = 'https://example.com/qr-code';
        
        // 设置二维码过期时间（5分钟）
        startExpirationTimer();
        // 开始轮询绑定状态
        startStatusCheck();
      } catch (error) {
        ElMessage.error('生成二维码失败，请刷新重试');
      }
    };

    // 刷新二维码
    const refreshQrCode = async () => {
      qrCodeUrl.value = '';
      isQrExpired.value = false;
      bindStatus.value = null;
      await generateQrCode();
    };

    // 开始检查绑定状态
    const startStatusCheck = () => {
      checkStatusTimer = setInterval(async () => {
        try {
          // 这里应该调用后端API检查绑定状态
          // 模拟不同状态
          const status = Math.floor(Math.random() * 3);
          switch (status) {
            case 0: // 等待扫码
              bindStatus.value = {
                icon: 'Loading',
                text: '等待扫码'
              };
              break;
            case 1: // 已扫码，等待确认
              bindStatus.value = {
                icon: 'Warning',
                text: '已扫码，请在微信中确认'
              };
              break;
            case 2: // 绑定成功
              bindStatus.value = {
                icon: 'CircleCheck',
                text: '绑定成功'
              };
              clearInterval(checkStatusTimer);
              // 更新用户信息
              await store.dispatch('user/updateUserInfo', {
                ...store.state.user.userInfo,
                hasBindWechat: true
              });
              ElMessage.success('微信绑定成功');
              setTimeout(() => {
                router.push('/student/profile');
              }, 1500);
              break;
          }
        } catch (error) {
          console.error('检查绑定状态失败:', error);
        }
      }, 2000);
    };

    // 设置二维码过期计时器
    const startExpirationTimer = () => {
      clearTimeout(expirationTimer);
      expirationTimer = setTimeout(() => {
        isQrExpired.value = true;
        clearInterval(checkStatusTimer);
      }, 5 * 60 * 1000); // 5分钟后过期
    };

    onMounted(() => {
      generateQrCode();
    });

    onUnmounted(() => {
      clearInterval(checkStatusTimer);
      clearTimeout(expirationTimer);
    });

    return {
      qrCodeUrl,
      isQrExpired,
      bindStatus,
      refreshQrCode
    };
  }
};
</script>

<style scoped>
.bind-wechat-container {
  background-color: #ffffff;
  min-height: 100vh;
}

.qr-container {
  padding: 24px;
  max-width: 90%;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.qr-wrapper {
  width: 280px;
  height: 280px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.qr-code {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-code img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.loading-qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #909399;
}

.loading-icon {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.expired-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.expired-overlay p {
  color: #f56c6c;
  font-size: 16px;
  margin: 0;
}

.bind-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #606266;
}

.bind-status .el-icon {
  font-size: 20px;
}

.bind-status .CircleCheck {
  color: #67c23a;
}

.bind-status .Warning {
  color: #e6a23c;
}

.instruction {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  width: 100%;
  max-width: 320px;
}

.instruction h3 {
  margin: 0 0 16px;
  color: #303133;
  font-size: 16px;
}

.instruction ol {
  margin: 0;
  padding-left: 24px;
  text-align: left;
}

.instruction li {
  color: #606266;
  line-height: 1.8;
  margin-bottom: 8px;
}

.instruction li:last-child {
  margin-bottom: 0;
}

@media (max-width: 600px) {
  .qr-container {
    padding: 16px;
  }

  .qr-wrapper {
    width: 240px;
    height: 240px;
  }

  .instruction {
    padding: 16px;
  }
}
</style> 