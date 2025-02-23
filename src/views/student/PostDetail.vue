<template>
  <div class="post-detail" v-if="post">
    <!-- 返回按钮 -->
    <div class="nav-header">
      <el-button link @click="$router.back()">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
    </div>

    <!-- 帖子内容 -->
    <div class="post-content">
      <el-card class="post-card">
        <template v-if="post.user">
          <div class="post-header">
            <div class="user-info">
              <el-avatar :size="40" :src="post.user.avatar || ''">
                {{ post.user.name?.[0] || '?' }}
              </el-avatar>
              <div class="user-detail">
                <span class="username">{{ post.user.name || '匿名用户' }}</span>
                <span class="post-time">{{ post.createTime || '' }}</span>
              </div>
            </div>
            <el-tag :type="post.type === 'recommend' ? 'success' : 'danger'">
              {{ post.type === 'recommend' ? '推荐' : '避雷' }}
            </el-tag>
          </div>

          <div class="post-main">
            <h2 class="post-title">{{ post.title || '' }}</h2>
            <div class="location-info">
              <el-tag size="small">{{ post.canteen || '' }}</el-tag>
              <el-tag size="small" type="info">{{ post.window || '' }}</el-tag>
              <el-tag size="small" type="warning">{{ post.dish || '' }}</el-tag>
            </div>
            <p class="post-text">{{ post.content || '' }}</p>
            <div v-if="post.images && post.images.length > 0" class="post-images">
              <el-image 
                v-for="(img, index) in post.images"
                :key="index"
                :src="img"
                :preview-src-list="post.images"
                class="post-image"
              />
            </div>
          </div>

          <div class="post-actions">
            <div class="action-item" @click="toggleLike">
              <el-icon :class="{ active: post.isLiked }"><CaretTop /></el-icon>
              <span>{{ post.likes || 0 }}赞</span>
            </div>
            <div class="action-item">
              <el-icon><ChatDotRound /></el-icon>
              <span>{{ (post.comments && post.comments.length) || 0 }}评论</span>
            </div>
            <div class="action-item">
              <el-icon><Share /></el-icon>
              <span>分享</span>
            </div>
          </div>
        </template>
      </el-card>
    </div>

    <!-- 评论区 -->
    <div class="comments-section">
      <div class="comments-header">
        <h3>全部评论 {{ (post.comments && post.comments.length) || 0 }}</h3>
      </div>
      
      <div class="comment-list">
        <template v-if="post.comments && post.comments.length > 0">
          <div v-for="comment in post.comments" :key="comment.id" class="comment-item">
            <el-avatar :size="36" :src="comment.user?.avatar || ''">
              {{ comment.user?.name?.[0] || '?' }}
            </el-avatar>
            <div class="comment-content">
              <div class="comment-user">{{ comment.user?.name || '匿名用户' }}</div>
              <div class="comment-text">{{ comment.content || '' }}</div>
              <div class="comment-footer">
                <span class="comment-time">{{ comment.time || '' }}</span>
                <div class="comment-actions">
                  <span class="action" @click="likeComment(comment)">
                    <el-icon :class="{ active: comment.isLiked }"><CaretTop /></el-icon>
                    {{ comment.likes || 0 }}
                  </span>
                  <span class="action" @click="replyComment(comment)">回复</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div v-else class="no-comments">
          暂无评论，快来抢沙发吧！
        </div>
      </div>

      <!-- 评论输入框 -->
      <div class="comment-input">
        <el-input
          v-model="commentText"
          placeholder="写下你的评论..."
          :rows="3"
          type="textarea"
          maxlength="200"
          show-word-limit
        />
        <el-button type="primary" @click="submitComment" :loading="submitting">
          发表评论
        </el-button>
      </div>
    </div>
  </div>
  <div v-else class="loading-state">
    <el-empty description="加载中..." />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, CaretTop, ChatDotRound, Share } from '@element-plus/icons-vue'

export default {
  name: 'PostDetail',
  components: {
    ArrowLeft,
    CaretTop,
    ChatDotRound,
    Share
  },
  setup() {
    const route = useRoute()
    const post = ref({})
    const commentText = ref('')
    const submitting = ref(false)

    // 获取帖子详情
    const fetchPostDetail = async () => {
      // 这里应该调用API获取帖子详情
      // 临时使用模拟数据
      post.value = {
        id: route.params.id,
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
        comments: [
          {
            id: 1,
            user: { name: '李四', avatar: '' },
            content: '同意，我也觉得很好吃',
            time: '2024-03-20 12:35',
            likes: 2,
            isLiked: false
          }
        ]
      }
    }

    // 点赞帖子
    const toggleLike = () => {
      post.value.isLiked = !post.value.isLiked
      post.value.likes += post.value.isLiked ? 1 : -1
    }

    // 点赞评论
    const likeComment = (comment) => {
      comment.isLiked = !comment.isLiked
      comment.likes += comment.isLiked ? 1 : -1
    }

    // 回复评论
    const replyComment = (comment) => {
      commentText.value = `回复 @${comment.user?.name}：`
    }

    // 提交评论
    const submitComment = async () => {
      if (!commentText.value.trim()) {
        ElMessage.warning('请输入评论内容')
        return
      }

      submitting.value = true
      try {
        // 这里应该调用API提交评论
        const newComment = {
          id: Date.now(),
          user: { name: '当前用户', avatar: '' },
          content: commentText.value,
          time: new Date().toLocaleString(),
          likes: 0,
          isLiked: false
        }
        post.value.comments.unshift(newComment)
        commentText.value = ''
        ElMessage.success('评论成功')
      } catch (error) {
        ElMessage.error('评论失败')
      } finally {
        submitting.value = false
      }
    }

    onMounted(() => {
      fetchPostDetail()
    })

    return {
      post,
      commentText,
      submitting,
      toggleLike,
      likeComment,
      replyComment,
      submitComment
    }
  }
}
</script>

<style scoped>
.post-detail {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 60px;
}

.nav-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
  padding: 12px 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.post-content {
  padding: 16px;
}

.post-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: none;
}

.post-header {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f2f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.post-main {
  padding: 0 0 16px;
}

.post-title {
  margin: 0 0 16px;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.4;
}

.location-info {
  margin-bottom: 16px;
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
  font-size: 16px;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.post-image {
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.post-actions {
  padding: 16px;
  display: flex;
  justify-content: space-around;
  background: #fafafa;
  border-top: 1px solid #f0f2f5;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
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
  padding: 16px;
  background: white;
  margin-top: 12px;
}

.comments-header {
  margin-bottom: 20px;
  padding: 0 4px;
}

.comments-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.comment-list {
  padding: 0 4px;
}

.comment-item {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f2f5;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-content {
  flex: 1;
}

.comment-user {
  font-weight: 600;
  margin-bottom: 8px;
  color: #2c3e50;
}

.comment-text {
  line-height: 1.6;
  color: #4a5568;
  font-size: 15px;
  margin-bottom: 8px;
}

.comment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-time {
  font-size: 13px;
  color: #909399;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

.comment-actions .action {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #909399;
  cursor: pointer;
  transition: color 0.3s ease;
}

.comment-actions .action:hover {
  color: var(--el-color-primary);
}

.comment-actions .active {
  color: var(--el-color-primary);
}

.comment-input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: white;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-input .el-button {
  width: 100%;
  height: 40px;
  border-radius: 20px;
}

/* 移动端适配 */
@media screen and (max-width: 393px) {
  .post-detail {
    padding-bottom: 120px;
  }

  .nav-header {
    padding: 8px 12px;
  }

  .post-content {
    padding: 12px;
  }

  .post-title {
    font-size: 18px;
  }

  .post-text {
    font-size: 15px;
  }

  .post-images {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 8px;
  }

  .action-item {
    padding: 6px 16px;
    font-size: 13px;
  }

  .comments-section {
    padding: 12px;
  }

  .comment-item {
    margin-bottom: 16px;
    padding-bottom: 16px;
  }

  .comment-text {
    font-size: 14px;
  }

  .comment-input {
    padding: 8px 12px;
  }
}

.loading-state {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
}

.no-comments {
  text-align: center;
  padding: 32px 16px;
  color: #909399;
  font-size: 14px;
}
</style> 