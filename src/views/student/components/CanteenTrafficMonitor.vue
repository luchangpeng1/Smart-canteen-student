<template>
  <div class="traffic-monitor">
    <div class="monitor-header">
      <h4>实时客流</h4>
      <el-tag size="small" type="info">
        {{ currentTime }}
        <el-icon class="refresh-icon" @click="refreshData"><Refresh /></el-icon>
      </el-tag>
    </div>

    <div class="traffic-cards">
      <div v-for="item in trafficData" 
           :key="item.id" 
           class="traffic-card"
           @click="showDetail(item)">
        <div class="card-header">
          <span class="canteen-name">{{ item.name }}</span>
          <el-tag :type="getTrafficLevel(item.crowdLevel).type" size="small">
            {{ getTrafficLevel(item.crowdLevel).text }}
          </el-tag>
        </div>
        
        <div class="traffic-info">
          <div class="info-item">
            <el-icon><User /></el-icon>
            <span>当前人数: {{ item.currentCount }}人</span>
          </div>
          <div class="info-item">
            <el-icon><Timer /></el-icon>
            <span>平均等待: {{ item.avgWaitTime }}分钟</span>
          </div>
        </div>

        <div class="traffic-chart">
          <div class="progress-bar">
            <div class="progress" 
                 :style="{ width: `${(item.currentCount / item.capacity) * 100}%`,
                          backgroundColor: getTrafficLevel(item.crowdLevel).color }">
            </div>
          </div>
          <span class="capacity-text">容量: {{ item.currentCount }}/{{ item.capacity }}</span>
        </div>
      </div>
    </div>

    <!-- 详细信息弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="selectedCanteen?.name + ' - 实时状况'"
      width="90%">
      <div class="detail-content" v-if="selectedCanteen">
        <div class="floor-list">
          <div v-for="floor in selectedCanteen.floors" 
               :key="floor.id" 
               class="floor-item">
            <h5>{{ floor.name }}</h5>
            <div class="window-list">
              <div v-for="window in floor.windows" 
                   :key="window.id" 
                   class="window-item">
                <span class="window-name">{{ window.name }}</span>
                <div class="window-status">
                  <el-tag :type="getTrafficLevel(window.crowdLevel).type" size="small">
                    {{ getTrafficLevel(window.crowdLevel).text }}
                  </el-tag>
                  <span class="wait-time">等待{{ window.waitTime }}分钟</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { User, Timer, Refresh } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

export default {
  name: 'CanteenTrafficMonitor',
  components: { User, Timer, Refresh },
  
  setup() {
    const trafficData = ref([])
    const currentTime = ref('')
    const dialogVisible = ref(false)
    const selectedCanteen = ref(null)
    let timer = null

    const getTrafficLevel = (level) => {
      const levels = {
        low: { type: 'success', text: '空闲', color: '#67C23A' },
        medium: { type: 'warning', text: '较忙', color: '#E6A23C' },
        high: { type: 'danger', text: '拥挤', color: '#F56C6C' }
      }
      return levels[level] || levels.low
    }

    const updateTime = () => {
      currentTime.value = dayjs().format('HH:mm:ss')
    }

    const refreshData = async () => {
      // 模拟数据，实际应该从API获取
      trafficData.value = [
        {
          id: 1,
          name: '中央食堂',
          crowdLevel: 'medium',
          currentCount: 320,
          capacity: 500,
          avgWaitTime: 8,
          floors: [
            {
              id: 1,
              name: '一楼',
              windows: [
                { id: 1, name: '特色炒菜', crowdLevel: 'high', waitTime: 10 },
                { id: 2, name: '面食档口', crowdLevel: 'low', waitTime: 3 },
              ]
            },
            {
              id: 2,
              name: '二楼',
              windows: [
                { id: 3, name: '自选档口', crowdLevel: 'medium', waitTime: 5 },
                { id: 4, name: '盖浇饭', crowdLevel: 'low', waitTime: 2 },
              ]
            }
          ]
        },
        // 其他餐厅数据...
      ]
    }

    const showDetail = (canteen) => {
      selectedCanteen.value = canteen
      dialogVisible.value = true
    }

    onMounted(() => {
      refreshData()
      updateTime()
      timer = setInterval(() => {
        updateTime()
        refreshData()
      }, 30000) // 每30秒更新一次
    })

    onUnmounted(() => {
      if (timer) clearInterval(timer)
    })

    return {
      trafficData,
      currentTime,
      dialogVisible,
      selectedCanteen,
      getTrafficLevel,
      refreshData,
      showDetail
    }
  }
}
</script>

<style scoped>
.traffic-monitor {
  margin: 12px 0;
  padding: 0 12px;
}

.monitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.monitor-header h4 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.refresh-icon {
  margin-left: 4px;
  cursor: pointer;
  transition: transform 0.3s;
}

.refresh-icon:hover {
  transform: rotate(180deg);
}

.traffic-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.traffic-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s;
}

.traffic-card:hover {
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.canteen-name {
  font-size: 16px;
  font-weight: 500;
}

.traffic-info {
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  color: #606266;
  font-size: 14px;
}

.traffic-chart {
  margin-top: 8px;
}

.progress-bar {
  height: 6px;
  background: #f0f2f5;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress {
  height: 100%;
  transition: width 0.3s ease;
}

.capacity-text {
  font-size: 12px;
  color: #909399;
}

.floor-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.floor-item h5 {
  margin: 0 0 8px;
  color: #303133;
}

.window-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.window-item {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
}

.window-name {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.window-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wait-time {
  font-size: 13px;
  color: #606266;
}

@media screen and (max-width: 768px) {
  .traffic-cards {
    grid-template-columns: 1fr;
  }
  
  .window-list {
    grid-template-columns: 1fr;
  }
}
</style> 