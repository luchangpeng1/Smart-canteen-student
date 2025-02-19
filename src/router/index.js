import { createRouter, createWebHistory } from 'vue-router'
import FloorDetail from '@/views/student/FloorDetail.vue'
import { isMobile } from '@/utils/device'

const routes = [
  {
    path: '/',
    redirect: '/login',
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false, title: '登录' }
  },
  {
    path: '/student',
    component: () => import('../views/student/Layout.vue'),
    meta: { requiresAuth: true, role: 'student', title: '学生端' },
    children: [
      {
        path: '',
        redirect: 'home'
      },
      {
        path: 'home',
        name: 'StudentHome',
        component: () => import('../views/student/DishList.vue'),
        meta: { title: '首页', keepAlive: true }
      },
      {
        path: 'orders',
        name: 'StudentOrders',
        component: () => import('../views/student/OrderList.vue'),
        meta: { title: '订单列表', keepAlive: true }
      },
      {
        path: 'profile',
        name: 'StudentProfile',
        component: () => import('../views/student/UserProfile.vue'),
        meta: { title: '个人中心' }
      },
      {
        path: 'transactions',
        name: 'StudentTransactions',
        component: () => import('../views/student/个人主页相关页面/TransactionList.vue')
      },
      {
        path: 'favorites',
        name: 'StudentFavorites',
        component: () => import('../views/student/个人主页相关页面/FavoriteList.vue')
      },
      {
        path: 'reviews',
        name: 'StudentReviews',
        component: () => import('../views/student/个人主页相关页面/ReviewList.vue')
      },
      {
        path: 'notification-settings',
        name: 'StudentNotificationSettings',
        component: () => import('../views/student/个人主页相关页面/NotificationSettings.vue')
      },
      {
        path: 'preferences',
        name: 'StudentPreferences',
        component: () => import('../views/student/个人主页相关页面/Preferences.vue')
      },
      {
        path: 'feedback-list',
        name: 'StudentFeedbacks',
        component: () => import('../views/student/个人主页相关页面/FeedbackList.vue')
      },
      {
        path: 'wallet',
        name: 'StudentWallet',
        component: () => import('../views/student/个人主页相关页面/WalletPage.vue')
      },
      {
        path: 'recommendations',
        name: 'RecommendationSquare',
        component: () => import('@/views/student/RecommendationSquare.vue')
      },
      {
        path: '/student/canteen/:canteen/floor/:floor',
        name: 'FloorDetail',
        component: FloorDetail
      },
      {
        path: 'dishes/:id',
        name: 'DishDetail',
        component: () => import('../views/student/DishDetail.vue')
      },
      {
        path: 'order-history',
        name: 'OrderHistory',
        component: () => import('../views/student/OrderHistory.vue')
      },
      {
        path: 'orders/:id',
        name: 'OrderDetail',
        component: () => import('../views/student/OrderDetail.vue')
      },
      {
        path: 'cart',
        name: 'StudentCart',
        component: () => import('../views/student/CartPage.vue')
      },
      {
        path: 'points-history',
        name: 'PointsHistory',
        component: () => import('../views/student/个人主页相关页面/PointsHistory.vue'),
        meta: {
          title: '积分记录',
          requiresAuth: true
        }
      },
      {
        path: 'points-rules',
        component: () => import('../views/student/个人主页相关页面/PointsRules.vue')
      },
      {
        path: 'points-exchange',
        component: () => import('../views/student/个人主页相关页面/PointsExchange.vue')
      },
      {
        path: '/student/current-orders/:id',
        name: 'CurrentOrderDetail',
        component: () => import('@/views/student/CurrentOrderDetail.vue'),
        meta: {
          title: '订单详情',
          requiresAuth: true,
          role: 'student'
        }
      }
    ]
  },
 
]

const router = createRouter({
  history: createWebHistory('/Smart-canteen-student/'),
  routes
})

router.beforeEach((to, from, next) => {
  // 获取登录状态
  const token = localStorage.getItem('token')
  const userInfo = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  const userRole = userInfo?.verifiedInfo?.role

  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - GUET智慧食堂`
  }

  // 处理根路径
  if (to.path === '/') {
    next('/login')
    return
  }

  // 如果访问需要登录的页面但没有登录，重定向到登录页
  if (to.meta.requiresAuth && (!token || !userInfo)) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // 如果已登录且访问登录页，重定向到对应的首页
  if (to.path === '/login' && token && userInfo) {
    if (userRole === 'student') {
      next('/student/home')
    } else {
      // 处理无效角色
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      next('/login')
    }
    return
  }

  // 检查角色权限
  if (to.meta.role && to.meta.role !== userRole) {
    next('/login')
    return
  }

  // 正常放行
  next()
})

// 路由错误处理
router.onError((error) => {
  console.error('路由错误:', error)
  // 可以在这里添加错误处理逻辑，比如显示错误提示或重定向到错误页面
})

export default router 