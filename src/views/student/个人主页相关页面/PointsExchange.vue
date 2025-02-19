<template>
  <div class="points-exchange">
    <back-header title="积分兑换" />
    
    <div class="points-info">
      <div class="current-points">
        <span>当前积分</span>
        <strong>{{ currentPoints }}</strong>
      </div>
      <el-button type="primary" link @click="goToRules">
        积分规则
        <el-icon><ArrowRight /></el-icon>
      </el-button>
    </div>
    
    <el-tabs v-model="activeTab">
      <el-tab-pane label="优惠券" name="coupons">
        <div class="exchange-list">
          <el-card 
            v-for="item in coupons" 
            :key="item.id"
            class="exchange-item"
          >
            <div class="exchange-content">
              <el-image 
                :src="item.image" 
                class="exchange-image"
                fit="cover"
              />
              <div class="exchange-info">
                <h3>{{ item.name }}</h3>
                <p>{{ item.description }}</p>
                <div class="exchange-points">
                  所需积分：<span class="points">{{ item.points }}</span>
                </div>
              </div>
            </div>
            <div class="exchange-action">
              <el-button 
                type="primary" 
                :disabled="currentPoints < item.points"
                @click="handleExchange(item)"
              >
                立即兑换
              </el-button>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="礼品" name="gifts">
        <div class="exchange-list">
          <el-card 
            v-for="item in gifts" 
            :key="item.id"
            class="exchange-item"
          >
            <div class="exchange-content">
              <el-image 
                :src="item.image" 
                class="exchange-image"
                fit="cover"
              />
              <div class="exchange-info">
                <h3>{{ item.name }}</h3>
                <p>{{ item.description }}</p>
                <div class="exchange-points">
                  所需积分：<span class="points">{{ item.points }}</span>
                </div>
              </div>
            </div>
            <div class="exchange-action">
              <el-button 
                type="primary" 
                :disabled="currentPoints < item.points"
                @click="handleExchange(item)"
              >
                立即兑换
              </el-button>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'
import BackHeader from '../components/BackHeader.vue'

export default {
  name: 'PointsExchange',
  components: { 
    BackHeader,
    ArrowRight
  },
  
  setup() {
    const router = useRouter()
    const currentPoints = ref(280)  // 当前积分
    const activeTab = ref('coupons')
    
    const coupons = ref([
      {
        id: 1,
        name: '5元优惠券',
        description: '满30元可用',
        points: 100,
        image: 'path/to/coupon-image-1.jpg'
      },
      {
        id: 2,
        name: '10元优惠券',
        description: '满50元可用',
        points: 180,
        image: 'path/to/coupon-image-2.jpg'
      },
      {
        id: 3,
        name: '15元优惠券',
        description: '满80元可用',
        points: 250,
        image: 'path/to/coupon-image-3.jpg'
      }
    ])
    
    const gifts = ref([
      {
        id: 101,
        name: '保温杯',
        description: '304不锈钢，500ml',
        points: 500,
        image: 'path/to/gift-image-1.jpg'
      },
      {
        id: 102,
        name: '食堂储值卡',
        description: '面值50元',
        points: 450,
        image: 'path/to/gift-image-2.jpg'
      },
      {
        id: 103,
        name: '帆布包',
        description: '环保材质，容量大',
        points: 300,
        image: 'path/to/gift-image-3.jpg'
      }
    ])
    
    const handleExchange = (item) => {
      if (currentPoints.value < item.points) {
        ElMessage.warning('积分不足')
        return
      }
      
      ElMessage.success('兑换成功')
      currentPoints.value -= item.points
    }
    
    const goToRules = () => {
      router.push('/student/points-rules')
    }
    
    return {
      currentPoints,
      activeTab,
      coupons,
      gifts,
      handleExchange,
      goToRules
    }
  }
}
</script>

<style scoped>
.points-exchange {
  padding: 12px;
}

.points-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.current-points {
  display: flex;
  flex-direction: column;
}

.current-points span {
  font-size: 14px;
  color: #909399;
}

.current-points strong {
  font-size: 24px;
  color: var(--el-color-primary);
  margin-top: 4px;
}

.exchange-list {
  display: grid;
  gap: 12px;
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
  border-radius: 4px;
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

.points {
  color: var(--el-color-primary);
  font-weight: 500;
}

.exchange-action {
  display: flex;
  justify-content: flex-end;
}

:deep(.el-tabs__nav) {
  width: 100%;
  display: flex;
}

:deep(.el-tabs__item) {
  flex: 1;
  text-align: center;
}

:deep(.el-card) {
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.el-card:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style> 