import { ElMessage } from 'element-plus'
import { errorHandler } from '@/utils/errorHandler'

const state = {
  userInfo: {
    name: '张三',
    studentId: '2021001001',
    avatar: '',
    balance: 99.50,
    points: 100,
    favorites: 12,
    feedbacks: 0,
    pointsHistory: [],
    phone: '13800138000',
    email: 'zhangsan@example.com'
  }
}

const getters = {
  userInfo: state => state.userInfo,
  userBalance: state => state.userInfo.balance
}

const mutations = {
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
  },
  UPDATE_USER_INFO(state, payload) {
    state.userInfo = {
      ...state.userInfo,
      ...payload
    }
  },
  UPDATE_BALANCE(state, balance) {
    state.userInfo.balance = balance
  },
  UPDATE_POINTS(state, points) {
    state.userInfo.points = points
  },
  ADD_POINTS_HISTORY(state, record) {
    state.userInfo.pointsHistory.unshift(record)
  },
  UPDATE_FEEDBACKS_COUNT(state, count) {
    state.userInfo.feedbacks = count
  }
}

const actions = {
  // 更新用户信息
  async updateUserInfo({ commit }, payload) {
    try {
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      commit('UPDATE_USER_INFO', payload)
      return payload
    } catch (error) {
      errorHandler.handle(error)
      throw error
    }
  },

  // 获取用户信息
  async fetchUserInfo({ commit }) {
    try {
      // 模拟从本地存储获取
      const savedInfo = localStorage.getItem('userInfo')
      const userInfo = savedInfo ? JSON.parse(savedInfo) : state.userInfo
      commit('SET_USER_INFO', userInfo)
      return userInfo
    } catch (error) {
      errorHandler.handle(error)
      throw error
    }
  },

  // 更新余额
  async updateBalance({ commit, state }, amount) {
    try {
      const newBalance = state.userInfo.balance + amount
      commit('UPDATE_BALANCE', newBalance)
      return newBalance
    } catch (error) {
      errorHandler.handle(error)
      throw error
    }
  },

  // 积分兑换
  async exchangePoints({ commit, state }, { itemId, points }) {
    try {
      if (state.userInfo.points < points) {
        throw new Error('积分不足')
      }
      
      const newPoints = state.userInfo.points - points
      commit('UPDATE_POINTS', newPoints)
      
      commit('ADD_POINTS_HISTORY', {
        id: Date.now(),
        type: 'exchange',
        points: -points,
        description: '积分兑换',
        createTime: new Date().toISOString()
      })
      
      return true
    } catch (error) {
      errorHandler.handle(error)
      throw error
    }
  },

  // 获取积分历史
  async getPointsHistory({ state }) {
    try {
      // 返回模拟数据
      return state.userInfo.pointsHistory || [
        {
          id: 1,
          type: 'earn',
          points: 2,
          description: '完成订单',
          createTime: '2024-03-20T10:00:00Z'
        },
        {
          id: 2,
          type: 'earn',
          points: 3,
          description: '评价订单',
          createTime: '2024-03-19T15:30:00Z'
        }
      ]
    } catch (error) {
      errorHandler.handle(error)
      throw error
    }
  },

  // 更新反馈数量
  updateFeedbacksCount({ commit }, count) {
    commit('UPDATE_FEEDBACKS_COUNT', count)
  },

  // 退出登录
  async logout({ commit }) {
    try {
      localStorage.removeItem('userInfo')
      localStorage.removeItem('token')
      
      commit('SET_USER_INFO', {
        name: '',
        studentId: '',
        avatar: '',
        balance: 0,
        points: 0,
        favorites: 0,
        feedbacks: 0,
        pointsHistory: [],
        phone: '',
        email: ''
      })
      
      return true
    } catch (error) {
      errorHandler.handle(error)
      throw error
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
} 