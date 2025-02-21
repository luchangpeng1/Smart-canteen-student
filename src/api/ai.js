import request from '@/utils/request'

/**
 * 发送消息到 AI 助手
 * @param {Array} messages - 消息历史记录
 * @returns {Promise} - API 响应
 */
export function sendChatMessage(messages) {
  return request({
    url: '/api/ai/chat',
    method: 'post',
    data: {
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    }
  })
}