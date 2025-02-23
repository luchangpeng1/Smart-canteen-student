<template>
  <transition name="fade">
    <div>
      <back-header title="关于我们" />
      <div class="about-us-container">
        <div class="logo-section">
          <h1>关于我们</h1>
          <p class="subtitle">桂林电子科技大学智慧食堂</p>
        </div>
        
        <div class="content-section">
          <h2>系统简介</h2>
          <p>欢迎使用桂林电子科技大学智慧食堂点餐系统！作为校园数字化建设的重要组成部分，我们致力于为全校师生提供更加便捷、高效的就餐体验。</p>
          
          <h2>我们的特色</h2>
          <ul class="feature-list">
            <li>
              <strong>便捷点餐：</strong>支持多个校区食堂在线点餐，轻松解决就餐需求
            </li>
            <li>
              <strong>智能推荐：</strong>基于您的就餐习惯，为您推荐可能喜欢的美食
            </li>
            <li>
              <strong>营养均衡：</strong>提供营养成分展示，助力健康饮食
            </li>
            <li>
              <strong>实时查询：</strong>随时查看食堂实时就餐人数，合理安排就餐时间
            </li>
          </ul>

          <h2>联系我们</h2>
          <p>如果您在使用过程中遇到任何问题或有建议，欢迎通过以下方式联系我们：</p>
          <ul class="contact-list">
            <li>服务时间：周一至周日 6:30-22:30</li>
            <li>意见反馈：可在"反馈与建议"中提交</li>
            <li>技术支持：校园网络信息中心</li>
          </ul>

          <div class="version-info">
            <p>当前版本：V1.0.0</p>
            <p>最后更新：2024年3月</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import BackHeader from '@/views/student/components/BackHeader.vue';

export default {
  name: 'AboutUs',
  components: { BackHeader }
}
</script>

<style scoped>
.about-us-container {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.logo-section {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  font-size: 24px;
  margin-bottom: 8px;
  color: #333;
  transition: color 0.3s;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.content-section {
  padding: 0 10px;
}

h2 {
  font-size: 18px;
  color: #333;
  margin: 24px 0 12px;
  padding-left: 10px;
  border-left: 4px solid #007aff;
  transition: border-color 0.3s;
}

h2:hover {
  border-color: #0056b3;
}

p {
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 16px;
  color: #555;
}

.feature-list, .contact-list {
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
}

.feature-list li, .contact-list li {
  padding: 8px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  transition: background-color 0.3s;
}

.feature-list li:hover, .contact-list li:hover {
  background-color: #f0f0f0;
}

.feature-list li strong {
  color: #007aff;
  margin-right: 5px;
}

.version-info {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  text-align: center;
}

.version-info p {
  font-size: 13px;
  color: #999;
  margin: 5px 0;
}

@media (max-width: 600px) {
  .about-us-container {
    padding: 15px;
  }
  
  h1 {
    font-size: 20px;
  }
  
  h2 {
    font-size: 16px;
  }
  
  p, .feature-list li, .contact-list li {
    font-size: 14px;
  }
  
  .version-info p {
    font-size: 12px;
  }
}
</style> 