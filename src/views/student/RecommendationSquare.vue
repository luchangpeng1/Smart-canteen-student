<template>
  <div class="recommendation-square">
    <!-- 发布按钮 -->
    <div class="post-action">
      <el-button type="primary" @click="showPostDialog">
        <el-icon><Edit /></el-icon>
        发布推荐/避雷
      </el-button>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-select v-model="filterType" placeholder="帖子类型" class="filter-item">
        <el-option label="全部" value="" />
        <el-option label="推荐" value="recommend" />
        <el-option label="避雷" value="warning" />
      </el-select>
      
      <el-select v-model="filterCanteen" placeholder="选择餐厅" class="filter-item">
        <el-option label="全部餐厅" value="" />
        <el-option
          v-for="canteen in canteens"
          :key="canteen.id"
          :label="canteen.name"
          :value="canteen.name"
        />
      </el-select>

      <el-select v-model="sortBy" placeholder="排序方式" class="filter-item">
        <el-option label="最新发布" value="latest" />
        <el-option label="最多点赞" value="mostLiked" />
        <el-option label="最多评论" value="mostComments" />
      </el-select>
    </div>

    <!-- 帖子列表 -->
    <div class="posts-list">
      <el-card v-for="post in filteredPosts" :key="post.id" class="post-card">
        <!-- 帖子头部 -->
        <div class="post-header">
          <div class="user-info">
            <el-avatar :size="40" :src="post.user.avatar">
              {{ post.user.name.charAt(0) }}
            </el-avatar>
            <div class="user-detail">
              <span class="username">{{ post.user.name }}</span>
              <span class="post-time">{{ post.createTime }}</span>
            </div>
          </div>
          <el-tag :type="post.type === 'recommend' ? 'success' : 'danger'">
            {{ post.type === 'recommend' ? '推荐' : '避雷' }}
          </el-tag>
        </div>

        <!-- 帖子内容 -->
        <div class="post-content">
          <h3 class="post-title">{{ post.title }}</h3>
          <div class="location-info">
            <el-tag size="small">{{ post.canteen }}</el-tag>
            <el-tag size="small" type="info">{{ post.window }}</el-tag>
            <el-tag size="small" type="warning">{{ post.dish }}</el-tag>
          </div>
          <p class="post-text">{{ post.content }}</p>
          <div v-if="post.images.length" class="post-images">
            <el-image 
              v-for="(img, index) in post.images"
              :key="index"
              :src="img"
              :preview-src-list="post.images"
              class="post-image"
            />
          </div>
        </div>

        <!-- 帖子操作 -->
        <div class="post-actions">
          <div class="action-item" @click="toggleLike(post)">
            <el-icon :class="{ active: post.isLiked }">
              <CaretTop />
            </el-icon>
            <span>{{ post.likes }}赞</span>
          </div>
          <div class="action-item" @click="showComments(post)">
            <el-icon><ChatDotRound /></el-icon>
            <span>{{ post.comments.length }}评论</span>
          </div>
          <div class="action-item">
            <el-icon><Share /></el-icon>
            <span>分享</span>
          </div>
        </div>

        <!-- 评论区 -->
        <div v-if="post.showComments" class="comments-section">
          <el-divider>评论区</el-divider>
          <div class="comments-list">
            <div v-for="comment in post.comments" :key="comment.id" class="comment-item">
              <el-avatar :size="32" :src="comment.user.avatar">
                {{ comment.user.name.charAt(0) }}
              </el-avatar>
              <div class="comment-content">
                <div class="comment-user">{{ comment.user.name }}</div>
                <div class="comment-text">{{ comment.content }}</div>
                <div class="comment-time">{{ comment.time }}</div>
              </div>
            </div>
          </div>
          <!-- 评论输入框 -->
          <div class="comment-input">
            <el-input
              v-model="commentText"
              placeholder="写下你的评论..."
              :rows="2"
              type="textarea"
            />
            <el-button type="primary" @click="submitComment(post)">发表评论</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 发布对话框 -->
    <el-dialog
      title="发布推荐/避雷"
      v-model="postDialogVisible"
      width="90%"
      :close-on-click-modal="false"
      class="post-dialog">
      <el-form 
        :model="postForm" 
        :rules="postRules"
        ref="postFormRef"
        label-width="80px"
        @submit.prevent>
        <!-- 类型选择改为更直观的样式 -->
        <el-form-item label="类型" prop="type">
          <div class="post-type-selector">
            <div
              class="type-item"
              :class="{ active: postForm.type === 'recommend' }"
              @click="postForm.type = 'recommend'"
            >
              <el-icon><CircleCheckFilled /></el-icon>
              <span>推荐好物</span>
              <small>分享美食发现</small>
            </div>
            <div
              class="type-item"
              :class="{ active: postForm.type === 'warning' }"
              @click="postForm.type = 'warning'"
            >
              <el-icon><WarningFilled /></el-icon>
              <span>避雷提醒</span>
              <small>帮助他人避坑</small>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="标题" prop="title">
          <el-input 
            v-model="postForm.title" 
            placeholder="一句话描述你的体验（最多30字）"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="餐厅" prop="canteen">
          <el-select 
            v-model="postForm.canteen" 
            placeholder="选择餐厅"
            filterable
            @change="handleCanteenChange">
            <el-option
              v-for="canteen in canteens"
              :key="canteen.id"
              :label="canteen.name"
              :value="canteen.name"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="窗口" prop="window">
          <el-select 
            v-model="postForm.window" 
            placeholder="选择窗口"
            filterable
            :disabled="!postForm.canteen">
            <el-option
              v-for="window in filteredWindows"
              :key="window.id"
              :label="window.name"
              :value="window.name"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="菜品" prop="dish">
          <el-input 
            v-model="postForm.dish" 
            placeholder="输入菜品名称"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="价格">
          <el-input-number 
            v-model="postForm.price" 
            :min="0"
            :precision="2"
            :step="0.5"
          />
        </el-form-item>

        <el-form-item label="评分">
          <el-rate
            v-model="postForm.rating"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
          />
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-input
            v-model="postForm.content"
            type="textarea"
            :rows="4"
            placeholder="详细描述你的体验..."
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="图片">
          <el-upload
            v-model:file-list="postForm.images"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="handleImageChange"
            :on-remove="handleImageRemove"
            :before-upload="beforeImageUpload"
            multiple>
            <template #default>
              <el-icon><Plus /></el-icon>
              <div class="upload-text">点击上传<br/>（最多4张）</div>
            </template>
            <template #file="{ file }">
              <img :src="file.url" class="upload-image" />
            </template>
          </el-upload>
        </el-form-item>

        <!-- 添加预览部分 -->
        <el-form-item label="预览">
          <div class="post-preview">
            <el-card>
              <div class="preview-header">预览效果</div>
              <div class="preview-content">
                <h3>{{ postForm.title || '标题待输入...' }}</h3>
                <div class="preview-tags">
                  <el-tag size="small">{{ postForm.canteen || '餐厅' }}</el-tag>
                  <el-tag size="small" type="info">{{ postForm.window || '窗口' }}</el-tag>
                  <el-tag size="small" type="warning">{{ postForm.dish || '菜品' }}</el-tag>
                </div>
                <p class="preview-text">{{ postForm.content || '内容待输入...' }}</p>
              </div>
            </el-card>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelPost">取消</el-button>
          <el-button type="primary" @click="submitPost" :loading="posting">
            发布
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, CaretTop, ChatDotRound, Share, Plus, CircleCheckFilled, WarningFilled } from '@element-plus/icons-vue'
import BackHeader from '@/components/BackHeader.vue'
import { useRouter } from 'vue-router'

const RecommendationSquare = {
  name: 'RecommendationSquare',
  components: {
    Edit,
    CaretTop,
    ChatDotRound,
    Share,
    Plus,
    CircleCheckFilled,
    WarningFilled,
    BackHeader
  },
  setup() {
    const router = useRouter()
    // 基础状态
    const posts = ref([])
    const postDialogVisible = ref(false)
    const posting = ref(false)
    const commentText = ref('')
    const filterType = ref('')
    const filterCanteen = ref('')
    const sortBy = ref('latest')
    const showViewer = ref(false)
    const currentImageIndex = ref(0)
    const postFormRef = ref(null)

    // 发布表单
    const postForm = ref({
      type: 'recommend',
      title: '',
      canteen: '',
      window: '',
      dish: '',
      content: '',
      images: [],
      price: 0,
      rating: 0
    })

    // 表单验证规则
    const postRules = {
      type: [{ required: true, message: '请选择发布类型', trigger: 'change' }],
      title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
      canteen: [{ required: true, message: '请选择餐厅', trigger: 'change' }],
      window: [{ required: true, message: '请选择窗口', trigger: 'change' }],
      dish: [{ required: true, message: '请输入菜品名称', trigger: 'blur' }],
      content: [{ required: true, message: '请输入内容描述', trigger: 'blur' }]
    }

    // 模拟数据
    const mockPosts = [
      {
        id: 1,
        user: {
          name: '张三',
          avatar: ''
        },
        type: 'recommend',
        title: '中央食堂的红烧肉太好吃了！',
        canteen: '中央食堂',
        window: '特色炒菜',
        dish: '红烧肉',
        content: '今天中午去吃了红烧肉，肥而不腻，特别推荐！',
        images: [],
        createTime: '2024-03-20 12:30',
        likes: 15,
        isLiked: false,
        showComments: false,
        comments: [
          {
            id: 1,
            user: { name: '李四', avatar: '' },
            content: '同意，我也觉得很好吃',
            time: '2024-03-20 12:35'
          }
        ]
      }
    ]

    // 餐厅数据
    const canteens = ref([
      { 
        id: 1, 
        name: '中央食堂',
        windows: [
          { id: 1, name: '特色炒菜' },
          { id: 2, name: '面食档口' }
        ]
      },
      { 
        id: 2, 
        name: '沁园餐厅',
        windows: [
          { id: 3, name: '盖浇饭窗口' },
          { id: 4, name: '小炒窗口' }
        ]
      }
    ])

    // 计算属性
    const filteredWindows = computed(() => {
      if (!postForm.value.canteen) return []
      const selectedCanteen = canteens.value.find(c => c.name === postForm.value.canteen)
      return selectedCanteen ? selectedCanteen.windows : []
    })

    const filteredPosts = computed(() => {
      let result = [...posts.value]
      
      if (filterType.value) {
        result = result.filter(post => post.type === filterType.value)
      }
      
      if (filterCanteen.value) {
        result = result.filter(post => post.canteen === filterCanteen.value)
      }
      
      switch (sortBy.value) {
        case 'mostLiked':
          result.sort((a, b) => b.likes - a.likes)
          break
        case 'mostComments':
          result.sort((a, b) => b.comments.length - a.comments.length)
          break
        default:
          result.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
      }
      
      return result
    })

    // 显示发布对话框
    const showPostDialog = () => {
      postDialogVisible.value = true
    }

    // 处理图片上传
    const handleImageChange = (file) => {
      postForm.value.images.push(file)
    }

    // 提交帖子
    const submitPost = async () => {
      posting.value = true
      try {
        // 这里应该调用API发布帖子
        await new Promise(resolve => setTimeout(resolve, 1000))
        ElMessage.success('发布成功')
        postDialogVisible.value = false
        // 重置表单
        postForm.value = {
          type: 'recommend',
          title: '',
          canteen: '',
          window: '',
          dish: '',
          content: '',
          images: [],
          price: 0,
          rating: 0
        }
      } catch (error) {
        ElMessage.error('发布失败')
      } finally {
        posting.value = false
      }
    }

    // 点赞
    const toggleLike = (post) => {
      post.isLiked = !post.isLiked
      post.likes += post.isLiked ? 1 : -1
    }

    // 显示评论
    const showComments = (post) => {
      router.push(`/student/post/${post.id}`)
    }

    // 提交评论
    const submitComment = async (post) => {
      if (!commentText.value.trim()) {
        ElMessage.warning('请输入评论内容')
        return
      }

      try {
        // 这里应该调用API提交评论
        const newComment = {
          id: Date.now(),
          user: { name: '当前用户', avatar: '' },
          content: commentText.value,
          time: new Date().toLocaleString()
        }
        post.comments.push(newComment)
        commentText.value = ''
        ElMessage.success('评论成功')
      } catch (error) {
        ElMessage.error('评论失败')
      }
    }

    // 添加图片预览方法
    const previewImage = (index, images) => {
      currentImageIndex.value = index
      showViewer.value = true
    }

    // 添加图片网格布局类名计算方法
    const getImageGridClass = (count) => {
      if (count === 1) return 'single-image'
      if (count === 2) return 'two-images'
      if (count === 3) return 'three-images'
      return 'four-images'
    }

    // 处理餐厅选择变化
    const handleCanteenChange = (value) => {
      postForm.value.window = '' // 清空窗口选择
    }

    // 图片上传前验证
    const beforeImageUpload = (file) => {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        ElMessage.error('只能上传 JPG 或 PNG 格式的图片!')
        return false
      }
      if (!isLt2M) {
        ElMessage.error('图片大小不能超过 2MB!')
        return false
      }
      
      if (postForm.value.images.length >= 4) {
        ElMessage.warning('最多只能上传4张图片')
        return false
      }
      return true
    }

    // 处理图片移除
    const handleImageRemove = (file) => {
      const index = postForm.value.images.indexOf(file)
      if (index !== -1) {
        postForm.value.images.splice(index, 1)
      }
    }

    // 取消发布
    const cancelPost = () => {
      ElMessageBox.confirm('确定要取消发布吗？已输入的内容将会丢失', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '继续编辑',
        type: 'warning'
      }).then(() => {
        postDialogVisible.value = false
        resetForm()
      }).catch(() => {})
    }

    // 重置表单
    const resetForm = () => {
      if (postFormRef.value) {
        postFormRef.value.resetFields()
      }
      postForm.value = {
        type: 'recommend',
        title: '',
        canteen: '',
        window: '',
        dish: '',
        content: '',
        images: [],
        price: 0,
        rating: 0
      }
    }

    onMounted(() => {
      // 初始化帖子数据
      posts.value = mockPosts
    })

    return {
      posts,
      postDialogVisible,
      posting,
      postForm,
      commentText,
      canteens,
      filteredWindows,
      filterType,
      filterCanteen,
      sortBy,
      showPostDialog,
      handleImageChange,
      submitPost,
      toggleLike,
      showComments,
      submitComment,
      previewImage,
      getImageGridClass,
      filteredPosts,
      handleCanteenChange,
      beforeImageUpload,
      handleImageRemove,
      cancelPost,
      resetForm,
      postFormRef,
      postRules
    }
  }
}

export default RecommendationSquare 
</script>

<style scoped>
.recommendation-square {
  padding: 16px;
  background: #f5f7fa;
  min-height: 100vh;
}

.post-action {
  margin-bottom: 20px;
  padding: 0 4px;
}

.post-action .el-button {
  width: 100%;
  height: 44px;
  border-radius: 22px;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
  border: none;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
  transition: all 0.3s ease;
}

.post-action .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.3);
}

.filter-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding: 12px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.filter-item {
  min-width: 120px;
  flex: 1;
}

.post-card {
  margin-bottom: 16px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  border: none;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.post-header {
  margin-bottom: 16px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f2f5;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.username {
  font-weight: 600;
  font-size: 15px;
  color: #2c3e50;
}

.post-time {
  font-size: 13px;
  color: #909399;
}

.post-content {
  padding: 0 16px 16px;
}

.post-title {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.4;
}

.location-info {
  margin-bottom: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.location-info .el-tag {
  padding: 6px 12px;
  border-radius: 12px;
  font-weight: 500;
}

.post-text {
  margin: 0 0 16px;
  line-height: 1.8;
  color: #4a5568;
  font-size: 15px;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
  margin: 0 -16px;
  padding: 0 16px 16px;
}

.post-image {
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.post-image:hover {
  transform: scale(1.02);
}

.post-actions {
  padding: 12px 16px;
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #f0f2f5;
  background: #fafafa;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  color: #606266;
  font-size: 14px;
  transition: all 0.3s ease;
}

.action-item:hover {
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.action-item .active {
  color: var(--el-color-primary);
}

.comments-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px 16px;
  margin: 16px;
}

.comment-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.comment-content {
  flex: 1;
}

.comment-user {
  font-weight: 600;
  margin-bottom: 6px;
  color: #2c3e50;
}

.comment-text {
  line-height: 1.6;
  color: #4a5568;
}

.comment-time {
  font-size: 12px;
  color: #909399;
  margin-top: 6px;
}

.comment-input {
  margin-top: 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.comment-input .el-input {
  flex: 1;
}

.comment-input .el-button {
  border-radius: 8px;
  padding: 12px 24px;
}

/* 发布对话框样式优化 */
.post-dialog :deep(.el-dialog) {
  border-radius: 20px;
  overflow: hidden;
}

.post-type-selector {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
}

.type-item {
  flex: 1;
  padding: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  background: white;
}

.type-item.active {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.type-item .el-icon {
  font-size: 32px;
  margin-bottom: 12px;
  color: #4a5568;
}

.type-item.active .el-icon {
  color: var(--el-color-primary);
}

.type-item span {
  display: block;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #2c3e50;
}

.type-item small {
  display: block;
  font-size: 13px;
  color: #64748b;
}

.post-preview {
  background: #f8fafc;
  border-radius: 16px;
  padding: 20px;
  margin-top: 24px;
}

.preview-header {
  font-size: 15px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 16px;
  text-align: center;
}

.preview-content {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.preview-tags {
  margin: 12px 0;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.preview-text {
  color: #4a5568;
  line-height: 1.8;
}

/* 移动端适配 */
@media screen and (max-width: 393px) {
  .recommendation-square {
    padding: 12px 8px;
  }

  .post-action .el-button {
    height: 40px;
    font-size: 15px;
  }

  .filter-bar {
    padding: 8px;
    gap: 8px;
  }

  .filter-item {
    min-width: 100px;
  }

  .post-card {
    margin-bottom: 12px;
    border-radius: 12px;
  }

  .post-header {
    padding: 12px;
  }

  .username {
    font-size: 14px;
  }

  .post-time {
    font-size: 12px;
  }

  .post-title {
    font-size: 16px;
  }

  .post-text {
    font-size: 14px;
    line-height: 1.6;
  }

  .location-info .el-tag {
    padding: 4px 8px;
    font-size: 12px;
  }

  .post-images {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 6px;
  }

  .action-item {
    padding: 6px 12px;
    font-size: 13px;
  }

  .comments-section {
    padding: 16px 12px;
    margin: 12px;
  }

  .comment-item {
    padding: 10px;
    gap: 8px;
  }

  .type-item {
    padding: 16px;
  }

  .type-item .el-icon {
    font-size: 28px;
  }

  .type-item span {
    font-size: 15px;
  }

  .type-item small {
    font-size: 12px;
  }
}
</style> 