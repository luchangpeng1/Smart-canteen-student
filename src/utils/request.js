import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '../router'
import Result from '@/utils/result'
import { useUserStore } from '@/stores/user'

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 使用环境变量中配置的后端地址
  timeout: 15000, // 请求超时时间
  withCredentials: false, // 改为 false，除非后端特别配置了允许携带凭证
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    // 添加跨域请求头
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization'
  }
})

// 是否正在刷新token
let isRefreshing = false
// 重试队列
let requests = []

// 请求拦截器
service.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }

    // 处理请求数据
    if (config.method === 'post' || config.method === 'put') {
      // 移除空值参数
      const data = { ...config.data }
      Object.keys(data).forEach(key => {
        if (data[key] === null || data[key] === undefined || data[key] === '') {
          delete data[key]
        }
      })
      config.data = data
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    if (res.code === Result.CODE.SUCCESS) {
      return res
    }
    
    // 处理特定错误
    switch(res.code) {
      case Result.CODE.TOKEN_EXPIRED:
      case Result.CODE.TOKEN_INVALID:
        router.push('/login')
        break
        
      case Result.CODE.ADMIN_LOGIN_AUTH:
      case Result.CODE.APP_LOGIN_AUTH:
        router.push('/login')
        break
        
      default:
        ElMessage.error(res.message || '操作失败')
    }
    
    return Promise.reject(res)
  },
  error => {
    console.error('请求错误详情:', error.response?.data)
    console.error('完整错误信息:', error)
    
    if (error.response) {
      const errorData = error.response.data
      switch (error.response.status) {
        case 400:
          ElMessage.error('请求参数错误: ' + (errorData.message || errorData.error || ''))
          break
        case 500:
          ElMessage.error('服务器错误: ' + (errorData.message || errorData.error || '内部错误'))
          console.error('详细错误:', errorData)
          break
        default:
          ElMessage.error(errorData.message || errorData.error || '请求失败')
      }
    } else if (error.request) {
      ElMessage.error('网络连接失败，请检查网络设置')
    } else {
      ElMessage.error('请求配置错误')
    }
    return Promise.reject(error)
  }
)

// 处理未授权情况
const handleUnauthorized = async (failedRequest) => {
  if (isRefreshing) {
    // 将请求加入重试队列
    return new Promise(resolve => {
      requests.push(() => {
        resolve(service(failedRequest))
      })
    })
  }

  isRefreshing = true

  try {
    // 尝试刷新 token
    const response = await service.post('/auth/refresh-token', {
      refreshToken: localStorage.getItem('refreshToken')
    })
    
    if (response.code === 200) {
      // 更新 token
      const { token, refreshToken: newRefreshToken } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', newRefreshToken)

      // 重试队列中的请求
      requests.forEach(callback => callback())
      requests = []

      // 重试失败的请求
      return service(failedRequest)
    } else {
      // token 刷新失败，需要重新登录
      handleLogout()
    }
  } catch (error) {
    handleLogout()
  } finally {
    isRefreshing = false
  }
}

// 处理登出
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  
  ElMessageBox.confirm(
    '登录已过期，请重新登录',
    '提示',
    {
      confirmButtonText: '重新登录',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)
  })
}

// 请求方法封装
const http = {
  get(url, params, config = {}) {
    return service.get(url, { params, ...config })
  },

  post(url, data, config = {}) {
    return service.post(url, data, config)
  },

  put(url, data, config = {}) {
    return service.put(url, data, config)
  },

  delete(url, params, config = {}) {
    return service.delete(url, { params, ...config })
  },

  // 上传文件
  upload(url, file, onUploadProgress) {
    const formData = new FormData()
    formData.append('file', file)

    return service.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    })
  },

  // 下载文件
  download(url, params, fileName) {
    return service.get(url, {
      params,
      responseType: 'blob'
    }).then(response => {
      const blob = new Blob([response.data])
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileName || getFileNameFromResponse(response)
      link.click()
      window.URL.revokeObjectURL(link.href)
    })
  }
}

// 从响应头获取文件名
const getFileNameFromResponse = (response) => {
  const contentDisposition = response.headers['content-disposition']
  if (contentDisposition) {
    const matches = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
    if (matches && matches[1]) {
      return decodeURIComponent(matches[1].replace(/['"]/g, ''))
    }
  }
  return 'download'
}

export default http 