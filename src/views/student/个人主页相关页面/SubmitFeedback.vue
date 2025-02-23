<template>
  <transition name="fade">
    <div>
      <back-header title="提交建议" />
      <div class="submit-feedback-container">
        <el-form :model="feedback" ref="feedbackForm" :rules="rules" class="feedback-form" :disabled="isSubmitting">
          <el-form-item label="建议类型" prop="type">
            <el-select v-model="feedback.type" placeholder="请选择建议类型" :disabled="isSubmitting">
              <el-option label="菜品建议" value="dish" />
              <el-option label="服务建议" value="service" />
              <el-option label="环境建议" value="environment" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>
          <el-form-item label="建议内容" prop="content">
            <el-input 
              type="textarea" 
              v-model="feedback.content" 
              placeholder="请输入您的建议" 
              :autosize="{ minRows: 2, maxRows: 4 }"
              maxlength="500"
              show-word-limit
              :disabled="isSubmitting"
            />
          </el-form-item>
          <el-form-item label="上传图片">
            <el-upload
              class="feedback-upload"
              action="#"
              :auto-upload="false"
              :on-change="handleImageChange"
              :on-remove="handleImageRemove"
              :before-upload="beforeUpload"
              :file-list="feedback.images"
              :limit="3"
              :on-exceed="handleExceed"
              list-type="picture-card"
              accept=".jpg,.jpeg,.png"
              :disabled="isSubmitting"
            >
              <el-icon><Plus /></el-icon>
              <template #tip>
                <div class="el-upload__tip">
                  支持 JPG/PNG 格式，单张图片不超过 2MB，最多上传 3 张
                </div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button 
              type="primary" 
              @click="submitFeedback" 
              class="submit-button" 
              :loading="isSubmitting"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? '提交中...' : '提交建议' }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </transition>
</template>

<script>
import BackHeader from '@/views/student/components/BackHeader.vue';
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

export default {
  name: 'SubmitFeedback',
  components: { 
    BackHeader,
    Plus 
  },
  setup() {
    const feedbackForm = ref(null);
    const isSubmitting = ref(false);
    const feedback = ref({
      type: '',
      content: '',
      images: []
    });

    const rules = {
      type: [{ required: true, message: '请选择建议类型', trigger: 'change' }],
      content: [
        { required: true, message: '请填写建议内容', trigger: 'blur' },
        { min: 10, max: 500, message: '建议内容长度应在 10 到 500 个字符之间', trigger: 'blur' }
      ]
    };

    // 处理图片上传前的验证
    const beforeUpload = (file) => {
      const isImage = /^image\/(jpeg|png|jpg)$/.test(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        ElMessage.error('只能上传 JPG/PNG 格式的图片！');
        return false;
      }
      if (!isLt2M) {
        ElMessage.error('图片大小不能超过 2MB！');
        return false;
      }
      return true;
    };

    // 处理超出上传数量限制
    const handleExceed = () => {
      ElMessage.warning('最多只能上传 3 张图片');
    };

    // 处理图片改变
    const handleImageChange = (file, fileList) => {
      if (beforeUpload(file.raw)) {
        // 创建本地预览URL
        const url = URL.createObjectURL(file.raw);
        feedback.value.images = fileList.map(item => ({
          ...item,
          url: item === file ? url : item.url
        }));
      }
    };

    // 处理图片移除
    const handleImageRemove = (file) => {
      if (file.url && file.url.startsWith('blob:')) {
        URL.revokeObjectURL(file.url);
      }
      const index = feedback.value.images.indexOf(file);
      if (index !== -1) {
        feedback.value.images.splice(index, 1);
      }
    };

    const submitFeedback = async () => {
      if (!feedbackForm.value) return;
      
      try {
        await feedbackForm.value.validate();
        isSubmitting.value = true;
        
        // Simulate an API request
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        ElMessage.success('建议提交成功！');
        // 清理预览URL
        feedback.value.images.forEach(file => {
          if (file.url && file.url.startsWith('blob:')) {
            URL.revokeObjectURL(file.url);
          }
        });
        
        // 添加确认对话框
        ElMessageBox.confirm(
          '您确定要清空表单吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          // 清空表单
          feedback.value = { type: '', content: '', images: [] };
          feedbackForm.value.resetFields();
        }).catch(() => {
          // 用户取消操作
        });
      } catch (error) {
        ElMessage.error('请检查表单是否填写正确');
      } finally {
        isSubmitting.value = false;
      }
    };

    return { 
      feedbackForm,
      feedback,
      isSubmitting,
      rules,
      submitFeedback,
      handleImageChange,
      handleImageRemove,
      beforeUpload,
      handleExceed
    };
  }
}
</script>

<style scoped>
.submit-feedback-container {
  padding: 24px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  max-width: 800px;
  margin: 16px auto;
  transition: all 0.3s ease;
}

.feedback-form {
  margin-bottom: 20px;
}

/* 表单项样式 */
:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
  padding-bottom: 8px;
}

/* Select 下拉框样式 */
:deep(.el-select) {
  width: 100%;
}

:deep(.el-select .el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  transition: all 0.3s ease;
}

:deep(.el-select .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #409eff inset;
}

/* Textarea 输入框样式 */
:deep(.el-textarea__inner) {
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 14px;
  line-height: 1.6;
  min-height: 120px !important;
}

:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

/* 上传组件样式 */
.feedback-upload :deep(.el-upload--picture-card) {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  border: 2px dashed #dcdfe6;
  transition: all 0.3s ease;
}

.feedback-upload :deep(.el-upload--picture-card:hover) {
  border-color: #409eff;
  transform: translateY(-2px);
}

.feedback-upload :deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.feedback-upload :deep(.el-upload-list--picture-card .el-upload-list__item:hover) {
  transform: translateY(-2px);
}

/* 提交按钮样式 */
.submit-button {
  width: 100%;
  margin-top: 32px;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  background: linear-gradient(135deg, #409eff, #007aff);
  border: none;
  transition: all 0.3s ease;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.submit-button:active {
  transform: translateY(0);
}

.el-upload__tip {
  font-size: 13px;
  color: #909399;
  margin-top: 8px;
  line-height: 1.4;
}

/* 淡入动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media screen and (max-width: 480px) {
  .submit-feedback-container {
    padding: 16px;
    margin: 12px;
    border-radius: 12px;
  }
  
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }
  
  .feedback-upload :deep(.el-upload--picture-card) {
    width: 100px;
    height: 100px;
    border-radius: 8px;
  }
  
  .feedback-upload :deep(.el-upload-list--picture-card .el-upload-list__item) {
    width: 100px;
    height: 100px;
    border-radius: 8px;
  }
  
  .submit-button {
    height: 40px;
    margin-top: 24px;
  }
  
  :deep(.el-textarea__inner) {
    min-height: 100px !important;
  }
}
</style> 