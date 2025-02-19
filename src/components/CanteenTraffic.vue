<template>
  <div class="canteen-traffic">
    <el-card class="traffic-card">
      <template #header>
        <div class="card-header">
          <span>餐厅实时客流量</span>
          <el-tag>{{ formatTime }}</el-tag>
        </div>
      </template>
      
      <div class="traffic-list">
        <el-row :gutter="10">
          <el-col 
            v-for="item in trafficData" 
            :key="item.id" 
            :span="12"
            class="traffic-item">
            <el-card 
              :body-style="{ padding: '10px' }"
              :class="['status-card', getCrowdLevel(item).class]">
              <h4>{{ item.canteenName }}</h4>
              <div class="status">
                <el-progress
                  :percentage="Math.round(item.currentCount / item.capacity * 100)"
                  :status="getCrowdLevel(item).status"
                />
                <span class="count">{{ item.currentCount }}/{{ item.capacity }}</span>
              </div>
              <div class="level-tag">
                <el-tag :type="getCrowdLevel(item).type" size="small">
                  {{ getCrowdLevel(item).label }}
                </el-tag>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import http from '@/utils/request'
import { formatDate } from '@/utils/date'

const trafficData = ref([])
const lastUpdateTime = ref(new Date())

// 格式化时间显示
const formatTime = computed(() => {
  return formatDate(lastUpdateTime.value)
})

// 获取拥挤程度
const getCrowdLevel = (item) => {
  const ratio = item.currentCount / item.capacity
  if (ratio < 0.5) {
    return {
      type: 'success',
      label: '空闲',
      status: 'success',
      class: 'status-free'
    }
  } else if (ratio < 0.8) {
    return {
      type: 'warning',
      label: '较忙',
      status: 'warning',
      class: 'status-busy'
    }
  } else {
    return {
      type: 'danger',
      label: '拥挤',
      status: 'exception',
      class: 'status-crowded'
    }
  }
}

// 获取客流量数据
const fetchTrafficData = async () => {
  try {
    // 实际项目中应该调用后端 API
    // const response = await http.get('/api/traffic/current')
    // trafficData.value = response.data
    
    // 模拟数据
    trafficData.value = [
      {
        id: 1,
        canteenName: '第一食堂',
        currentCount: Math.floor(Math.random() * 300),
        capacity: 300
      },
      {
        id: 2,
        canteenName: '第二食堂',
        currentCount: Math.floor(Math.random() * 400),
        capacity: 400
      }
    ]
    
    lastUpdateTime.value = new Date()
  } catch (error) {
    console.error('获取客流量数据失败:', error)
  }
}

// 自动刷新定时器
let refreshTimer = null

onMounted(() => {
  fetchTrafficData()
  // 每5分钟自动刷新一次
  refreshTimer = setInterval(fetchTrafficData, 5 * 60 * 1000)
})

onUnmounted(() => {
  clearInterval(refreshTimer)
})
</script>

<style scoped>
.canteen-traffic {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.traffic-list {
  margin-top: 10px;
}

.traffic-item {
  margin-bottom: 10px;
}

.status-card {
  transition: all 0.3s ease;
}

.status-card:hover {
  transform: translateY(-2px);
}

.status-card h4 {
  margin: 0 0 10px 0;
}

.status {
  margin: 10px 0;
}

.count {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.level-tag {
  text-align: right;
}

/* 状态卡片样式 */
.status-free {
  border-left: 4px solid var(--el-color-success);
}

.status-busy {
  border-left: 4px solid var(--el-color-warning);
}

.status-crowded {
  border-left: 4px solid var(--el-color-danger);
}
</style>