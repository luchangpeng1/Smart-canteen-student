<template>
  <div class="ai-chat-container">
    <div class="chat-header">
      <el-button type="default" @click="toggleSidebar">
        历史对话
      </el-button>
      <el-button type="default" @click="startNewConversation">
        新对话
      </el-button>
    </div>
    <div class="chat-intro">
      <h2>嗨！我是你的AI助手</h2>
      <p>我可以帮你搜索、答疑、写作，请把你的任务交给我吧~</p>
    </div>
    <div class="chat-input">
      <el-input
        v-model="userInput"
        type="textarea"
        :rows="3"
        :maxlength="2000"
        show-word-limit
        resize="none"
        placeholder="请输入你的问题..."
        @keyup.enter.exact.prevent="handleSend"
        @keyup.ctrl.enter.prevent="insertNewLine"
      />
      <div class="input-actions">
        <el-button type="default" @click="toggleFileUpload">
          <el-icon><Plus /></el-icon>
        </el-button>
        <el-button type="primary" @click="handleSend">发送</el-button>
      </div>
      <el-message v-if="errorMessage" type="error">{{ errorMessage }}</el-message>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick, onBeforeUnmount, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete, DocumentCopy, Microphone, Timer, ArrowRight, Plus } from '@element-plus/icons-vue'
import MarkdownIt from 'markdown-it'
import { sendChatMessage } from '@/api/ai'

export default {
  name: 'AIChat',
  components: {
    Delete,
    DocumentCopy,
    Microphone,
    Timer,
    ArrowRight,
    Plus,
    ElMessage
  },
  setup() {
    const md = new MarkdownIt({
      html: true,
      breaks: true,
      linkify: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(str, { language: lang }).value
          } catch (__) {}
        }
        return ''
      }
    })
    const messages = ref([
      {
        role: 'assistant',
        content: '你好！我是你的AI助手，有什么我可以帮你的吗？'
      }
    ])
    const userInput = ref('')
    const isLoading = ref(false)
    const messageContainer = ref(null)
    const showVoiceDialog = ref(false)
    const isRecording = ref(false)
    const isMobile = ref(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    const recognition = ref(null)
    const isListening = ref(false)
    const tempVoiceText = ref('')
    const currentChatTitle = ref('新对话')
    const sidebarVisible = ref(false)
    const showHistoryDialog = ref(false)
    const chatHistory = ref([]);
    const errorMessage = ref('')

    const suggestionTips = [
      '推荐今天吃什么？',
      '食堂有什么特色菜？',
      '帮我分析营养搭配',
      '如何合理安排三餐？'
    ]

    const toggleHistoryDialog = () => {
      showHistoryDialog.value = !showHistoryDialog.value
    }

    onMounted(() => {
      scrollToBottom()
      loadStoredHistory()
    })

    const loadStoredHistory = () => {
      try {
        const stored = localStorage.getItem('aiChatHistory')
        if (stored) {
          chatHistory.value = JSON.parse(stored)
        }
      } catch (error) {
        console.error('Failed to load chat history:', error)
      }
    }

    const toggleSidebar = () => {
      sidebarVisible.value = !sidebarVisible.value
    }

    const scrollToBottom = async () => {
      await nextTick()
      if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight
      }
    }

    const formatMessage = (content) => {
      return md.render(content)
    }

    const handleSend = async () => {
      if (!userInput.value.trim()) {
        ElMessage.warning('请输入内容')
        return
      }

      const userMessage = userInput.value.trim()
      messages.value.push({
        role: 'user',
        content: userMessage
      })

      userInput.value = ''
      isLoading.value = true
      scrollToBottom()

      try {
        const response = await sendChatMessage(messages.value)
        if (response.data && response.data.message) {
          messages.value.push({
            role: 'assistant',
            content: response.data.message
          })
        } else {
          throw new Error('Invalid API response: ' + JSON.stringify(response.data));
        }
      } catch (error) {
        ElMessage.error('抱歉，请求失败，请稍后重试: ' + error.message);
        console.error('Chat API Error:', error);
        errorMessage.value = '抱歉，请求失败，请稍后重试: ' + error.message;
      } finally {
        isLoading.value = false
        scrollToBottom()
      }
    }

    const clearHistory = () => {
      messages.value = [messages.value[0]]
      currentChatTitle.value = '新对话'
      ElMessage.success('对话历史已清空')
    }

    const copyMessage = (content) => {
      navigator.clipboard.writeText(content).then(() => {
        ElMessage.success('已复制到剪贴板')
      }).catch(() => {
        ElMessage.error('复制失败，请手动复制')
      })
    }

    const speakMessage = (content) => {
      const utterance = new SpeechSynthesisUtterance(content)
      utterance.lang = 'zh-CN'
      speechSynthesis.speak(utterance)
    }

    const insertNewLine = () => {
      userInput.value += '\n'
    }

    const toggleVoiceInput = () => {
      showVoiceDialog.value = true
    }

    const startRecording = () => {
      if (!recognition.value) {
        initSpeechRecognition()
      }

      if (recognition.value) {
        try {
          recognition.value.start()
          isRecording.value = true
        } catch (error) {
          console.error('启动语音识别失败:', error)
          ElMessage.error('启动语音识别失败，请重试')
        }
      }
    }

    const stopRecording = () => {
      if (recognition.value && isListening.value) {
        recognition.value.stop()
      }
    }

    const usesuggestion = (tip) => {
      userInput.value = tip
      handleSend()
    }

    const handleInputFocus = () => {
      if (isMobile.value) {
        setTimeout(scrollToBottom, 300)
      }
    }

    const handleInputBlur = () => {
      // 处理输入框失去焦点的情况
    }

    const initSpeechRecognition = () => {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) {
          throw new Error('浏览器不支持语音识别')
        }

        recognition.value = new SpeechRecognition()
        recognition.value.continuous = true
        recognition.value.interimResults = true
        recognition.value.lang = 'zh-CN'

        recognition.value.onstart = () => {
          isListening.value = true
          tempVoiceText.value = ''
        }

        recognition.value.onresult = (event) => {
          let interimTranscript = ''
          let finalTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          tempVoiceText.value = finalTranscript || interimTranscript
        }

        recognition.value.onerror = (event) => {
          console.error('语音识别错误:', event.error);
          isListening.value = false;
          isRecording.value = false;
          if (event.error === 'not-allowed') {
            ElMessage.error('请允许使用麦克风');
          } else {
            ElMessage.error('语音识别出错，请重试: ' + event.error);
          }
        }

        recognition.value.onend = () => {
          isListening.value = false
          if (tempVoiceText.value && isRecording.value) {
            userInput.value = tempVoiceText.value
            handleSend()
          }
          isRecording.value = false
          showVoiceDialog.value = false
        }
      } catch (error) {
        console.error('初始化语音识别失败:', error)
        ElMessage.error('您的浏览器不支持语音识别')
      }
    }

    const formatTime = (timestamp) => {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date

      if (diff < 24 * 60 * 60 * 1000) {
        return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
      if (diff < 7 * 24 * 60 * 60 * 1000) {
        const days = ['日', '一', '二', '三', '四', '五', '六']
        return `周${days[date.getDay()]} ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
      }
      return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    }

    const generateChatTitle = (messages) => {
      const firstUserMessage = messages.find(m => m.role === 'user')
      if (!firstUserMessage) return '新对话'

      const content = firstUserMessage.content
      if (content.length <= 15) return content

      const questionMarkIndex = content.indexOf('？')
      if (questionMarkIndex > 0 && questionMarkIndex <= 20) {
        return content.substring(0, questionMarkIndex + 1)
      }

      const punctuationIndex = content.search(/[，。,.]/)
      if (punctuationIndex > 0 && punctuationIndex <= 20) {
        return content.substring(0, punctuationIndex + 1)
      }

      return content.substring(0, 15) + '...'
    }

    const saveCurrentChat = () => {
      if (messages.value.length <= 1) return
      const currentChat = {
        messages: [...messages.value],
        timestamp: Date.now(),
        title: generateChatTitle(messages.value)
      }

      chatHistory.value.unshift(currentChat)
      if (chatHistory.value.length > MAX_HISTORY) {
        chatHistory.value = chatHistory.value.slice(0, MAX_HISTORY)
      }

      try {
        localStorage.setItem('aiChatHistory', JSON.stringify(chatHistory.value))
      } catch (error) {
        console.error('Failed to save chat history:', error)
      }
    }

    watch(messages, () => {
      if (messages.value.length > 1) {
        saveCurrentChat()
      }
    }, { deep: true })

    const startNewConversation = () => {
      messages.value = [
        {
          role: 'assistant',
          content: '你好！我是你的AI助手，有什么我可以帮你的吗？'
        }
      ];
      currentChatTitle.value = '新对话';
      ElMessage.success('新对话已开始');
    };

    const toggleFileUpload = () => {
      // 这里可以添加文件上传的逻辑
      ElMessage.info('文件上传功能尚未实现');
    };

    return {
      messages,
      userInput,
      isLoading,
      messageContainer,
      showVoiceDialog,
      isRecording,
      isMobile,
      suggestionTips,
      handleSend,
      formatMessage,
      clearHistory,
      copyMessage,
      speakMessage,
      insertNewLine,
      toggleVoiceInput,
      toggleHistoryDialog,
      startRecording,
      stopRecording,
      usesuggestion,
      handleInputFocus,
      handleInputBlur,
      currentChatTitle,
      sidebarVisible,
      toggleSidebar,
      formatTime,
      startNewConversation,
      chatHistory,
      errorMessage,
      toggleFileUpload
    }
  }
}
</script>

<style scoped>
.ai-chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  padding: 20px;
  background-color: #f9f9f9;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.chat-header el-button {
  border-radius: 50px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  background-color: #4caf50;
  color: white;
  transition: background-color 0.3s, transform 0.3s;
}

.chat-header el-button:hover {
  background-color: #45a049;
  transform: scale(1.05);
}

.chat-intro {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;
}

.chat-intro h2 {
  font-size: 30px;
  color: #333;
  line-height: 1.5;
}

.chat-intro p {
  font-size: 20px;
  color: #666;
  line-height: 1.8;
}

.chat-input {
  display: flex;
  flex-direction: column;
}

.chat-input el-input {
  border-radius: 25px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.input-actions el-button {
  border-radius: 50px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  background-color: #4caf50;
  color: white;
}

.input-actions el-button:hover {
  background-color: #45a049;
  transform: scale(1.05);
}
</style>