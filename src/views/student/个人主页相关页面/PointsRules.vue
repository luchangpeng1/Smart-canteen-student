<template>
  <div class="points-rules">
    <back-header title="积分规则" />
    
    <el-card class="rules-card">
      <template #header>
        <div class="card-header">
          <span>如何获得积分</span>
        </div>
      </template>
      
      <div class="rules-content">
        <el-timeline>
          <el-timeline-item
            v-for="(rule, index) in earningRules"
            :key="index"
            :type="rule.type"
          >
            <h4>{{ rule.title }}</h4>
            <p class="rule-description">{{ rule.description }}</p>
            <div class="points-value">+{{ rule.points }} 积分</div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
    
    <el-card class="rules-card">
      <template #header>
        <div class="card-header">
          <span>积分使用说明</span>
        </div>
      </template>
      
      <div class="rules-content">
        <el-collapse>
          <el-collapse-item
            v-for="(item, index) in usageRules"
            :key="index"
            :title="item.title"
          >
            <div class="usage-content">{{ item.content }}</div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref } from 'vue'
import BackHeader from '../components/BackHeader.vue'

export default {
  name: 'PointsRules',
  components: { BackHeader },
  
  setup() {
    const earningRules = ref([
      {
        title: '完成订单',
        description: '成功完成一笔订单可获得订单金额1%的积分',
        points: '1-100',
        type: 'primary'
      },
      {
        title: '评价订单',
        description: '对已完成的订单进行评价',
        points: '5',
        type: 'success'
      },
      {
        title: '首次使用',
        description: '首次使用智慧食堂系统',
        points: '20',
        type: 'warning'
      },
      {
        title: '分享菜品',
        description: '分享菜品到推荐广场',
        points: '3',
        type: 'info'
      },
      {
        title: '连续使用',
        description: '连续7天使用智慧食堂',
        points: '30',
        type: 'success'
      }
    ])
    
    const usageRules = ref([
      {
        title: '积分有效期',
        content: '积分有效期为一年，请在有效期内使用。过期积分将自动清零。'
      },
      {
        title: '积分兑换',
        content: '积分可用于兑换优惠券、礼品等奖励，具体兑换规则请查看积分兑换页面。'
      },
      {
        title: '积分查询',
        content: '可在"我的-积分历史"中查看积分明细，包括获取和使用记录。'
      },
      {
        title: '特殊说明',
        content: '积分不可转让，不可提现，仅限本人使用。'
      }
    ])
    
    return {
      earningRules,
      usageRules
    }
  }
}
</script>

<style scoped>
.points-rules {
  padding: 12px;
}

.rules-card {
  margin-bottom: 16px;
}

.rules-content {
  padding: 8px 0;
}

.rule-description {
  color: #606266;
  margin: 8px 0;
  font-size: 14px;
}

.points-value {
  color: var(--el-color-primary);
  font-weight: 500;
  font-size: 14px;
}

.usage-content {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
  padding: 8px 0;
}

:deep(.el-timeline-item__node) {
  background-color: var(--el-color-primary);
}

:deep(.el-timeline-item__content) {
  padding-bottom: 20px;
}

:deep(.el-card) {
  border-radius: 8px;
}
</style> 