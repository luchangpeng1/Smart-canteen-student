<template>
  <div class="preferences">
    <back-header title="偏好设置" />
    <el-card>
      <template #header>
        <div class="card-header">
          <span>偏好设置</span>
        </div>
      </template>
      
      <el-form :model="preferences" label-width="120px">
        <h4>就餐偏好</h4>
        <el-form-item label="默认就餐方式">
          <el-radio-group v-model="preferences.defaultMealType">
            <el-radio :value="'dine_in'">堂食</el-radio>
            <el-radio :value="'take_out'">打包</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="口味偏好">
          <el-select v-model="preferences.taste" multiple placeholder="选择口味偏好">
            <el-option label="清淡" value="light" />
            <el-option label="偏咸" value="salty" />
            <el-option label="偏辣" value="spicy" />
            <el-option label="偏甜" value="sweet" />
          </el-select>
        </el-form-item>
        
        <el-divider />
        
        <h4>显示设置</h4>
        <el-form-item label="默认排序">
          <el-select v-model="preferences.defaultSort">
            <el-option label="销量优先" value="sales" />
            <el-option label="价格从低到高" value="price_asc" />
            <el-option label="价格从高到低" value="price_desc" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="每页显示数量">
          <el-select v-model="preferences.pageSize">
            <el-option label="10条" value="10" />
            <el-option label="20条" value="20" />
            <el-option label="30条" value="30" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="savePreferences" :loading="saving">
            保存设置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import BackHeader from '../components/BackHeader.vue'

export default {
  name: 'Preferences',
  components: { BackHeader },
  setup() {
    const preferences = reactive({
      defaultMealType: 'dine_in',
      taste: [],
      defaultSort: 'sales',
      pageSize: '20'
    })
    
    const saving = ref(false)
    
    const savePreferences = async () => {
      saving.value = true
      try {
        // 这里应该调用API保存偏好设置
        await new Promise(resolve => setTimeout(resolve, 1000))
        ElMessage.success('设置已保存')
      } catch (error) {
        ElMessage.error('保存失败')
      } finally {
        saving.value = false
      }
    }
    
    return {
      preferences,
      saving,
      savePreferences
    }
  }
}
</script>

<style scoped>
.preferences {
  padding: 4px;
}

h4 {
  margin: 0 0 12px;
  color: #606266;
}

.el-divider {
  margin: 12px 0;
}

:deep(.el-card) {
  border-radius: 4px;
  margin-bottom: 4px;
}
</style> 