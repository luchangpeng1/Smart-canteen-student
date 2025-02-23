<template>
  <div class="dish-list-container">
    <div class="dish-list">
      <!-- 添加悬浮购物车按钮 -->
      <div class="floating-cart-button" @click="goToCart">
        <el-badge :value="totalCount" :max="99" class="cart-badge">
          <el-button type="primary" circle class="cart-button">
            <el-icon><ShoppingCart /></el-icon>
          </el-button>
        </el-badge>
      </div>

      <!-- 添加地图显示/隐藏按钮 -->
      <div class="map-toggle">
        <el-button 
          type="primary" 
          plain
          size="small"
          @click="toggleMap"
          class="toggle-button">
          <el-icon><Location /></el-icon>
          {{ isMapVisible ? '收起地图' : '显示地图' }}
        </el-button>
      </div>
      
      <!-- 修改3D地图组件，添加v-show控制显示/隐藏 -->
      <CampusMap3D 
        v-show="isMapVisible"
        :canteens="mapCanteens"
        @select-canteen="handleMapCanteenSelect"
        class="map-section"
        />
      
      <!-- 添加客流量监控组件 -->
      <CanteenTrafficMonitor />

      <!-- 原有的顶部餐厅导航 -->
      <div class="canteen-nav">
        <el-tabs v-model="activeCanteen" type="card" @tab-click="handleCanteenChange" class="scrollable-tabs">
          <el-tab-pane 
            v-for="canteen in canteens" 
            :key="canteen.id" 
            :label="canteen.name" 
            :name="canteen.name">
            <!-- 餐厅信息卡片 -->
            <el-card class="canteen-info">
              <div class="canteen-header">
                <div class="canteen-basic">
                  <h3>{{ canteen.name }}</h3>
                  <div class="status-tags">
                    <el-tag 
                      :type="isCanteenOpen(canteen) ? 'success' : 'info'"
                      size="small">
                      {{ isCanteenOpen(canteen) ? '营业中' : '已打烊' }}
                    </el-tag>
                    <el-tag 
                      :type="getCrowdLevelType(canteen.name)"
                      size="small"
                      effect="dark">
                      {{ getCrowdLevelText(canteen.name) }}
                    </el-tag>
                  </div>
                </div>
              </div>
              <div class="canteen-details">
                <p><el-icon><Timer /></el-icon> 营业时间：10:30-13:30, 16:30-19:00</p>
                <p><el-icon><Position /></el-icon> 位置：{{ canteen.location }}</p>
              </div>
            </el-card>

            <!-- 添加餐厅级别的搜索过滤控制栏 -->
            <el-card class="filter-card">
              <div class="filter-controls">
                <!-- 搜索框和按钮的容器 -->
                <div class="search-container">
                  <el-input
                    v-model="searchQuery"
                    placeholder="搜索菜品"
                    class="search-input"
                    clearable
                    @keyup.enter="handleSearch">
                    <template #prefix>
                      <el-icon><Search /></el-icon>
                    </template>
                    <template #append>
                      <el-button 
                        type="primary" 
                        @click="handleSearch">
                        <el-icon><Search /></el-icon>
                        搜索
                      </el-button>
                    </template>
                  </el-input>
                </div>

                <!-- 口味和价格筛选放在同一行 -->
                <div class="filter-group">
                  <el-select
                    v-model="selectedTaste"
                    placeholder="选择口味"
                    clearable
                    class="filter-item"
                    @change="handleFilter">
                    <el-option
                      label="全部口味"
                      value="">
                    </el-option>
                    <el-option
                      v-for="taste in tasteOptions"
                      :key="taste.value"
                      :label="taste.label"
                      :value="taste.value"
                    />
                  </el-select>

                  <el-select
                    v-model="sortOption"
                    placeholder="排序方式"
                    class="filter-item"
                    @change="handleSort">
                    <el-option 
                      label="全部"
                      value="">
                    </el-option>
                    <el-option label="默认排序" value="default" />
                    <el-option label="价格从低到高" value="price-asc" />
                    <el-option label="价格从高到低" value="price-desc" />
                    <el-option label="销量从高到低" value="sales-desc" />
                    <el-option label="销量从低到高" value="sales-asc" />
                  </el-select>
                </div>

             
              </div>
            </el-card>

            <!-- 窗口分类展示 -->
            <div class="window-navigation">
              <!-- 添加购物车抽屉 -->
              <el-drawer
                v-model="cartDrawerVisible"
                title="购物车"
                direction="rtl"
                size="380px"
                :show-close="true"
                class="cart-drawer">
                <template #header>
                  <div class="cart-drawer-header">
                    <h3>购物车</h3>
                    <el-button 
                      type="danger" 
                      plain 
                      size="small" 
                      @click="clearCart" 
                      v-if="cartItems.length > 0">
                      清空购物车
                    </el-button>
                  </div>
                </template>
                
                <div class="cart-drawer-content">
                  <template v-if="hasCartItems">
                    <!-- 按窗口分组显示购物车商品 -->
                    <div v-for="(items, windowId) in groupedCartItems" 
                         :key="windowId" 
                         class="cart-window-group">
                      <div class="cart-window-header">
                        <el-tag size="small">{{ getWindowName(windowId) }}</el-tag>
                        <el-button 
                          type="danger" 
                          plain 
                          size="small" 
                          @click="clearWindowCart(windowId)">
                          清空
                        </el-button>
                      </div>
                      
                      <div class="cart-items-list">
                        <div v-for="item in items" 
                             :key="item.id" 
                             class="cart-item">
                          <el-image 
                            :src="item.image_url" 
                            class="cart-item-image"
                            fit="cover">
                            <template #error>
                              <div class="image-placeholder">
                                <el-icon><Picture /></el-icon>
                              </div>
                            </template>
                          </el-image>
                          
                          <div class="cart-item-info">
                            <div class="cart-item-name">{{ item.name }}</div>
                            <div class="cart-item-price">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
                          </div>
                          
                          <div class="cart-item-actions">
                            <el-input-number 
                              v-model="item.quantity" 
                              :min="0" 
                              :max="item.stock"
                              size="small"
                              @change="handleQuantityChange(item, windowId)"
                              controls-position="right">
                            </el-input-number>
                          </div>
                        </div>
                        <!-- 每个窗口的小计和结按钮 -->
                        <div class="window-cart-footer">
                          <div class="window-total-info">
                            <span class="total-label">小计:</span>
                            <span class="total-price">¥{{ getWindowTotal(items).toFixed(2) }}</span>
                          </div>
                          <el-button 
                            type="primary" 
                            size="small"
                            @click="goToCheckout(windowId)">
                            结算 ({{ getWindowCount(items) }}件)
                          </el-button>
                        </div>
                      </div>
                    </div>
                  </template>
                  
                  <div v-else class="empty-cart">
                    <el-empty description="购物车是空的">
                      <template #image>
                        <el-icon :size="60" class="empty-cart-icon"><ShoppingCart /></el-icon>
                      </template>
                    </el-empty>
                  </div>
                </div>
              </el-drawer>

              <!-- 楼层导航 -->
              <div class="nav-section floor-nav">
                <div class="nav-list">
                  <div
                    v-for="floor in canteen.floors"
                    :key="floor"
                    class="nav-item"
                    :class="{ active: selectedFloor === floor }"
                    @click="toggleFloor(floor)">
                    {{ floor }}层
                  </div>
                </div>
              </div>

              <!-- 全部菜品展示区域 -->
              <div v-if="!selectedFloor" class="all-dishes-container">
                <div class="dishes-grid">
                  <div v-for="dish in finalFilteredAllDishes" 
                       :key="dish.id" 
                       class="dish-card"
                       @click="goToDishDetail(dish.id)">
                    <!-- 使用现有的菜品卡片样式 -->
                    <div class="dish-card-content">
                      <el-image :src="dish.image_url" class="dish-image" fit="cover">
                        <template #error>
                          <div class="image-placeholder">
                            <el-icon><Picture /></el-icon>
                          </div>
                        </template>
                      </el-image>
                      
                      <div class="dish-info">
                        <div class="dish-header">
                          <div class="dish-title">
                            <h4 class="dish-name">{{ dish.name }}</h4>
                            <div class="dish-window-info">
                              <el-tag size="small" effect="plain" type="info">
                                {{ dish.windowName }} · {{ getFloorByWindowId(dish.windowId) }}层
                              </el-tag>
                            </div>
                          </div>
                          <el-tag 
                            size="small" 
                            :type="getCategoryType(dish.category)">
                            {{ dish.category }}
                          </el-tag>
                        </div>
                        
                        <p class="dish-description">{{ dish.description }}</p>
                        
                        <div class="dish-tags">
                          <el-tag size="small" effect="plain" :type="getTasteTagType(dish.taste)">
                            {{ getTasteLabel(dish.taste) }}
                          </el-tag>
                          <el-tag size="small" effect="plain" :type="dish.stock > 0 ? 'success' : 'danger'">
                            {{ dish.stock > 0 ? `库存: ${dish.stock}` : '已售罄' }}
                          </el-tag>
                          <el-tag size="small" effect="plain" type="warning">
                            周销量: {{ dish.weekSales }}
                          </el-tag>
                        </div>

                        <div class="dish-footer">
                          <div class="price-info">
                            <span class="price-symbol">¥</span>
                            <span class="price-value">{{ dish.price.toFixed(2) }}</span>
                          </div>
                          <el-button 
                            type="primary" 
                            size="small" 
                            class="add-button"
                            :disabled="dish.stock === 0"
                            @click.stop="addToCart(dish)">
                            <el-icon><Plus /></el-icon>
                          </el-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 原有的按楼层展示窗口和菜品的部 -->
              <div v-else class="meituan-layout">
                <!-- 左侧窗口列表 -->
                <div class="window-list">
                  <div
                    v-for="window in getFloorWindows(activeCanteen, selectedFloor)"
                    :key="window.id"
                    class="window-item"
                    :class="{ active: selectedWindow?.id === window.id }"
                    @click="selectWindow(window)"
                  >
                    <div class="window-image">
                      <el-image
                        :src="window.image_url || ''"
                        fit="cover"
                      >
                        <template #error>
                          <div class="window-image-placeholder">
                            <el-icon><Picture /></el-icon>
                          </div>
                        </template>
                      </el-image>
                    </div>
                    <div class="window-info">
                      <div class="window-name">{{ window.name }}</div>
                      <div class="window-status" :class="{ closed: !isWindowOpen(window) }">
                        <el-icon v-if="isWindowOpen(window)"><CircleCheck /></el-icon>
                        <el-icon v-else><CircleClose /></el-icon>
                        <span>{{ isWindowOpen(window) ? '营业中' : '已打烊' }}</span>
                      </div>
                      <div class="window-hours">
                        <el-icon><Timer /></el-icon>
                        <span>{{ window.operatingHours }}</span>
                      </div>
                      <div class="window-description" v-if="window.description">
                        {{ window.description }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 右侧内容区域 -->
                <div class="dishes-container">
                  <!-- 菜品列表 -->
                  <div class="dishes-list">
                    <template v-if="selectedWindow">
                      <div v-if="isWindowOpen(selectedWindow)">
                        <!-- 添加窗口信息卡片 -->
                        <el-card class="window-info-card">
                          <div class="window-header">
                            <h3>{{ selectedWindow.name }}</h3>
                            <div class="window-tags">
                              <el-tag size="small" type="success">营业中</el-tag>
                              <el-tag size="small" type="info">{{ selectedWindow.operatingHours }}</el-tag>
                            </div>
                          </div>
                        </el-card>

                        <!-- 优化搜索过滤栏 -->
                        <div class="window-filter-controls">
                          <el-input
                            v-model="windowSearchQuery"
                            placeholder="搜索当前窗口菜品"
                            class="filter-item"
                            clearable
                            @input="handleWindowSearch">
                            <template #prefix>
                              <el-icon><Search /></el-icon>
                            </template>
                          </el-input>
                          
                          <!-- 添加口味筛选 -->
                          <el-select
                            v-model="selectedTaste"
                            placeholder="选择口味"
                            clearable
                            class="filter-item"
                            @change="handleFilter">
                            <el-option
                              v-for="taste in tasteOptions"
                              :key="taste.value"
                              :label="taste.label"
                              :value="taste.value"
                            />
                          </el-select>
                          
                          <!-- 排序选项 -->
                          <el-select
                            v-model="sortOption"
                            placeholder="排序方式"
                            class="filter-item"
                            @change="handleSort">
                            <el-option 
                              label="全部"
                              value="">
                            </el-option>
                            <el-option label="默认排序" value="default" />
                            <el-option label="价格从低到高" value="price-asc" />
                            <el-option label="价格从高到低" value="price-desc" />
                            <el-option label="销量从高到低" value="sales-desc" />
                            <el-option label="销量从低到高" value="sales-asc" />
                          </el-select>
                        </div>

                        <!-- 添加分类标签导航 -->
                        <div class="category-nav">
                          <el-tag
                            v-for="category in dishCategories"
                            :key="category"
                            :type="selectedCategory === category ? 'primary' : 'info'"
                            effect="plain"
                            class="category-tag"
                            @click="selectCategory(category)">
                            {{ category }}
                          </el-tag>
                        </div>

                        <!-- 优化菜品卡片布局 -->
                        <div class="dishes-grid">
                          <div v-for="dish in finalFilteredDishes" 
                               :key="dish.id" 
                               class="dish-card"
                               @click="goToDishDetail(dish.id)">
                            <div class="dish-card-content">
                              <el-image :src="dish.image_url" class="dish-image" fit="cover">
                                <template #error>
                                  <div class="image-placeholder">
                                    <el-icon><Picture /></el-icon>
                                  </div>
                                </template>
                              </el-image>
                              
                              <div class="dish-info">
                                <div class="dish-header">
                                  <div class="dish-title">
                                    <h4 class="dish-name">{{ dish.name }}</h4>
                                    <div class="dish-window-info">
                                      <el-tag size="small" effect="plain" type="info">
                                        {{ dish.windowName }} · {{ getFloorByWindowId(dish.windowId) }}层
                                      </el-tag>
                                    </div>
                                  </div>
                                  <el-tag 
                                    size="small" 
                                    :type="getCategoryType(dish.category) || 'info'">
                                    {{ dish.category }}
                                  </el-tag>
                                </div>
                                
                                <p class="dish-description">{{ dish.description }}</p>
                                
                                <div class="dish-tags">
                                  <el-tag size="small" effect="plain" :type="getTasteTagType(dish.taste)">
                                    {{ getTasteLabel(dish.taste) }}
                                  </el-tag>
                                  <el-tag size="small" effect="plain" :type="dish.stock > 0 ? 'success' : 'danger'">
                                    {{ dish.stock > 0 ? `库存: ${dish.stock}` : '已售罄' }}
                                  </el-tag>
                                  <el-tag size="small" effect="plain" type="warning">
                                    周销量: {{ dish.weekSales }}
                                  </el-tag>
                                </div>

                                <div class="dish-footer">
                                  <div class="price-info">
                                    <span class="price-symbol">¥</span>
                                    <span class="price-value">{{ dish.price.toFixed(2) }}</span>
                                  </div>
                                  <el-button 
                                    type="primary" 
                                    size="small" 
                                    class="add-button"
                                    :disabled="dish.stock === 0"
                                    @click.stop="addToCart(dish)">
                                    <el-icon><Plus /></el-icon>
                                  </el-button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-else class="window-closed">
                        <el-empty
                          description="该窗口暂无菜品"
                          :image-size="200">
                          <template #description>
                            <div class="empty-state-content">
                              <h3 class="empty-title">{{ selectedWindow.name }}</h3>
                              <p class="empty-status">{{ isWindowOpen(selectedWindow) ? '营业中' : '已打烊' }}</p>
                              <p class="empty-hours">营业时间：{{ selectedWindow.operatingHours }}</p>
                              <p class="empty-hint">建议您选择其他窗口</p>
                            </div>
                          </template>
                          <el-button type="primary" @click="selectedWindow = null">返回选择</el-button>
                        </el-empty>
                      </div>
                    </template>
                    <div v-else class="no-window-selected">
                      <el-empty
                        description="请选择窗口"
                        :image-size="200">
                        <template #description>
                          <div class="empty-state-content">
                            <p class="empty-hint">从左侧选您感兴趣的窗口</p>
                            <p class="empty-sub-hint">当前层共有 {{ displayWindows.length }} 个窗口可选</p>
                          </div>
                        </template>
                      </el-empty>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 结算确认对话框 -->
      <el-dialog
        v-model="checkoutDialogVisible"
        title="确认订单"
        width="400px">
        <div class="checkout-content">
          <div class="checkout-items">
            <div v-for="item in cartItems" 
                 :key="item.id" 
                 class="checkout-item">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-quantity">x{{ item.quantity }}</span>
              <span class="item-price">¥{{ item.price * item.quantity }}</span>
            </div>
          </div>
          
          <el-divider></el-divider>
          
          <div class="checkout-form">
            <el-form :model="checkoutForm" :rules="checkoutRules" ref="checkoutFormRef">
              <el-form-item label="就餐时间" prop="diningTime">
                <el-time-select
                  v-model="checkoutForm.diningTime"
                  :picker-options="{
                    start: '10:30',
                    step: '00:15',
                    end: '20:00'
                  }"
                  placeholder="选就餐时间">
                </el-time-select>
              </el-form-item>
              
              <el-form-item label="就餐方式" prop="diningType">
                <el-radio-group v-model="checkoutForm.diningType">
                  <el-radio label="dine_in">堂食</el-radio>
                  <el-radio label="take_out">打包</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="备注" prop="remark">
                <el-input
                  v-model="checkoutForm.remark"
                  type="textarea"
                  placeholder="请输入备注信息">
                </el-input>
              </el-form-item>
            </el-form>
          </div>
          
          <div class="checkout-total">
            <span>合计:</span>
            <span class="total-price">¥{{ totalPrice }}</span>
          </div>
        </div>
        
        <template #footer>
          <el-button @click="checkoutDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitOrder">提交订单</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted, onUnmounted, inject, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Location, 
  Timer, 
  Position, 
  Picture,
  Search,
  Plus,
  ShoppingCart,
  CircleCheck,
  CircleClose
} from '@element-plus/icons-vue'
import CampusMap3D from './components/CampusMap3D.vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
import CanteenTrafficMonitor from './components/CanteenTrafficMonitor.vue'

export default {
  name: 'DishList',
  components: {
    Location,
    Timer,
    Position,
    Picture,
    Search,
    Plus,
    ShoppingCart,
    CircleCheck,
    CircleClose,
    CampusMap3D,
    CanteenTrafficMonitor
  },
  setup() {
    const router = useRouter()
    const activeCanteen = ref('中央食堂')
    const selectedFloor = ref(null)
    const selectedWindow = ref(null)
    const searchQuery = ref('')
    const windowSearchQuery = ref('')
    const selectedTaste = ref('')
    const sortOption = ref('')
    const dishes = ref([])

    // 注入函数
    const isCanteenOpen = inject('isCanteenOpen')
    const getFloorWindows = inject('getFloorWindows')
    const isWindowOpen = inject('isWindowOpen')
    const getCrowdLevelType = inject('getCrowdLevelType')
    const getCrowdLevelText = inject('getCrowdLevelText')
    const getWindowDishCount = inject('getWindowDishCount')

    // 创建包装函数以确保正确的上文
    const windowStatus = (window) => isWindowOpen(window)
    const canteenStatus = (canteen) => isCanteenOpen(canteen)
    const crowdLevel = (canteen) => getCrowdLevelType(canteen)
    const crowdText = (canteen) => getCrowdLevelText(canteen)
    const dishCount = (windowId) => getWindowDishCount(windowId)
    const windows = (canteenName, floor) => getFloorWindows(canteenName, floor)

    // 使用之前定义的测试数据
    const canteens = [
      { id: 1, name: '中央食堂', floors: 3, location: '校园中心区' },
      { id: 2, name: '沁园餐厅', floors: 2, location: '学生宿舍区' },
      { id: 3, name: '馨园餐厅', floors: 1, location: '教学区' },
      { id: 4, name: '仲园餐厅', floors: 2, location: '图书馆附近' },
      { id: 5, name: '雅园餐厅', floors: 1, location: '体馆附近' },
      { id: 6, name: 'F服务点', floors: 1, location: 'F区教学楼' },
      { id: 7, name: 'A区服务点', floors: 1, location: 'A区教学楼' }
    ]

    // 修改测试数据 - 窗口列表
    const testWindows = {
      '中央食堂': {
        1: [
          { 
            id: 1, 
            name: '川湘', 
            operatingHours: '10:30-13:30, 16:30-19:00', 
            status: 'open',
            image_url: 'https://example.com/window1.jpg',
            description: '正宗川湘菜系，提供各类特色炒菜、川味小炒'
          },
          { 
            id: 2, 
            name: '粤式炖汤', 
            operatingHours: '10:30-13:30', 
            status: 'closed',
            image_url: 'https://example.com/window2.jpg',
            description: '每日新鲜炖汤，滋补养生'
          },
          { 
            id: 3, 
            name: '新疆风味', 
            operatingHours: '10:30-19:00', 
            status: 'open',
            image_url: 'https://example.com/window3.jpg',
            description: '地道新疆美食，大盘鸡、手抓饭'
          },
          { 
            id: 4, 
            name: '面食档口', 
            operatingHours: '10:30-19:00', 
            status: 'open',
            image_url: 'https://example.com/window4.jpg',
            description: '各式面食，现煮现卖'
          },
          { 
            id: 5, 
            name: '米饭窗口', 
            operatingHours: '10:30-13:30, 16:30-19:00', 
            status: 'open',
            image_url: 'https://example.com/window5.jpg',
            description: '提供各类盖浇饭、套餐'
          }
        ],
        2: [
          { 
            id: 6, 
            name: '特色小炒', 
            operatingHours: '10:30-19:00', 
            status: 'open',
            image_url: 'https://example.com/window6.jpg',
            description: '现炒菜品，可自选搭配'
          },
          { 
            id: 7, 
            name: '清真窗口', 
            operatingHours: '10:30-19:00', 
            status: 'open',
            image_url: 'https://example.com/window7.jpg',
            description: '提供清真认证的美食'
          },
          { 
            id: 8, 
            name: '东北菜', 
            operatingHours: '10:30-19:00', 
            status: 'open',
            image_url: 'https://example.com/window8.jpg',
            description: '东北特色菜品，份量惠'
          },
          { 
            id: 9, 
            name: '快餐套餐', 
            operatingHours: '10:30-19:00', 
            status: 'open',
            image_url: 'https://example.com/window9.jpg',
            description: '经济实惠的快餐套餐'
          }
        ],
        3: [
          { 
            id: 10, 
            name: '火锅窗口', 
            operatingHours: '10:30-19:00', 
            status: 'open',
            image_url: 'https://example.com/window10.jpg',
            description: '自选火锅，多种口味'
          },
          { 
            id: 11, 
            name: '饮品店', 
            operatingHours: '08:30-20:00', 
            status: 'open',
            image_url: 'https://example.com/window11.jpg',
            description: '奶茶、果汁、咖啡'
          },
          { 
            id: 12, 
            name: '水果店', 
            operatingHours: '08:30-20:00', 
            status: 'open',
            image_url: 'https://example.com/window12.jpg',
            description: '新鲜水果，每日配送'
          }
        ]
      },
      '沁园餐厅': {
        1: [
          { 
            id: 13, 
            name: '自选快餐', 
            operatingHours: '10:30-19:00', 
            status: 'open',
            image_url: 'https://example.com/window13.jpg',
            description: '自选菜品，搭配更自由'
          },
          { 
            id: 14, 
            name: '面食档口', 
            operatingHours: '10:30-19:00', 
            status: 'open',
            image_url: 'https://example.com/window14.jpg',
            description: '各式面食，现做现卖'
          },
          { 
            id: 15, 
            name: '饮品店', 
            operatingHours: '08:30-20:00', 
            status: 'open',
            image_url: 'https://example.com/window15.jpg',
            description: '饮品甜点，解暑解馋'
          }
        ],
        2: [
          { 
            id: 16, 
            name: '特色炒菜', 
            operatingHours: '10:30-19:00', 
            status: 'open',
            image_url: 'https://example.com/window16.jpg',
            description: '各式炒菜，可自选搭配'
          },
          { 
            id: 17, 
            name: '盖浇饭', 
            operatingHours: '10:30-19:00', 
            status: 'open',
            image_url: 'https://example.com/window17.jpg',
            description: '多种盖浇饭，经济实惠'
          }
        ]
      }
    }

    // 修改测试数据 - 菜品列表
    const windowDishMap = {
      1: [ // 川湘菜窗口
        {
          id: 1,
          name: '麻婆豆腐',
          price: 12,
          description: '使用四川特制豆瓣酱，口感麻辣鲜香',
          category: '川菜',
          taste: 'spicy',
          image_url: 'https://example.com/mapo-tofu.jpg',
          stock: 20,
          weekSales: 156  // 添加周销量数据
        },
        {
          id: 2,
          name: '水煮肉片',
          price: 22,
          description: '新鲜猪肉，麻辣鲜香',
          category: '川菜',
          taste: 'spicy',
          image_url: 'https://example.com/shuizhu.jpg',
          stock: 15,
          weekSales: 90
        },
        {
          id: 3,
          name: '回锅肉',
          price: 18,
          description: '传统式回锅肉',
          category: '川菜',
          taste: 'savory',
          image_url: 'https://example.com/huiguo.jpg',
          stock: 25,
          weekSales: 80
        }
      ],
      2: [ // 粤式炖汤窗口
        {
          id: 4,
          name: '莲藕排骨汤',
          price: 16,
          description: '清甜可口，营养丰富',
          category: '粤菜',
          taste: 'light',
          image_url: 'https://example.com/soup.jpg',
          stock: 10,
          weekSales: 70
        },
        {
          id: 5,
          name: '海鲜汤',
          price: 20,
          description: '新鲜海鲜熬制',
          category: '粤菜',
          taste: 'light',
          image_url: 'https://example.com/seafood-soup.jpg',
          stock: 8,
          weekSales: 60
        }
      ],
      4: [ // 面食档口
        {
          id: 6,
          name: '番茄牛肉面',
          price: 15,
          description: '手工面条，配以新鲜番茄和优质牛肉',
          category: '面食',
          taste: 'savory',
          image_url: 'https://example.com/beef-noodles.jpg',
          stock: 30,
          weekSales: 50
        },
        {
          id: 7,
          name: '担担面',
          price: 12,
          description: '正宗川式面，香辣可口',
          category: '面食',
          taste: 'spicy',
          image_url: 'https://example.com/dandanmian.jpg',
          stock: 25,
          weekSales: 40
        },
        {
          id: 8,
          name: '阳春面',
          price: 8,
          description: '简单美味',
          category: '面食',
          taste: 'light',
          image_url: 'https://example.com/yangchun.jpg',
          stock: 40,
          weekSales: 30
        }
      ],
      6: [ // 特色小炒
        {
          id: 9,
          name: '宫保鸡丁',
          price: 16,
          description: '经典川菜',
          category: '川',
          taste: 'spicy',
          image_url: 'https://example.com/gongbao.jpg',
          stock: 20,
          weekSales: 20
        },
        {
          id: 10,
          name: '糖醋里脊',
          price: 18,
          description: '酸甜可口',
          category: '本帮菜',
          taste: 'sweet',
          image_url: 'https://example.com/tangcu.jpg',
          stock: 15,
          weekSales: 15
        }
      ],
      11: [ // 饮品店
        {
          id: 11,
          name: '珍珠奶茶',
          price: 8,
          description: '香浓奶茶',
          category: '饮品',
          taste: 'sweet',
          image_url: 'https://example.com/milk-tea.jpg',
          stock: 50,
          weekSales: 50
        },
        {
          id: 12,
          name: '柠檬水',
          price: 6,
          description: '清爽解暑',
          category: '饮品',
          taste: 'sweet',
          image_url: 'https://example.com/lemon.jpg',
          stock: 40,
          weekSales: 40
        }
      ]
    }

    // 测试数据 - 菜品分类
    const categories = ['川菜', '本帮', '粤菜', '面食', '素菜', '饮品']

    // 添加菜品分类样式映射函数
    const getCategoryType = (category) => {
      const typeMap = {
        '川菜': 'danger',    // 红色
        '本帮菜': 'warning', // 黄色
        '粤菜': 'success',   // 绿色
        '面食': 'primary',   // 蓝色
        '素菜': 'info',      // 灰色
        '饮品': 'info'      // 默认使用 info 类型
      }
      return typeMap[category] || 'info' // 如果没有匹配的类型，返回 info
    }

    // 修改餐厅切换处理函数
    const handleCanteenChange = (tab) => {
      activeCanteen.value = tab.props.name
      selectedFloor.value = null // 清空已选楼层
      selectedWindow.value = null // 清空已选窗口
      currentPage.value = 1 // 重置页码
    }

    // 添加地图相关的数据
    const mapCanteens = ref([
      {
        id: 1,
        name: '中央食堂',
        position: { x: -20, z: -20 },
        location: '校园中心区'
      },
      {
        id: 2,
        name: '沁园餐厅',
        position: { x: 20, z: 20 },
        location: '学生宿舍区'
      },
      {
        id: 3,
        name: '馨园餐厅',
        position: { x: 0, z: -30 },
        location: '央食堂附'
      },
      {
        id: 4,
        name: '仲园餐厅',
        position: { x: -30, z: 0 },
        location: 'D区附近'
      },
      {
        id: 5,
        name: '雅园餐厅',
        position: { x: 30, z: -20 },
        location: '信科附近'
      },
      {
        id: 6,
        name: 'F区服务点',
        position: { x: 10, z: -10 },
        location: 'F区宿舍'
      },
      {
        id: 7,
        name: 'A区服务点',
        position: { x: -10, z: 10 },
        location: 'A区宿舍'
      }
    ])

    // 处理地食堂选择
    const handleMapCanteenSelect = (canteen) => {
      activeCanteen.value = canteen.name
      // 触发 tab 切换
      const tab = {
        props: {
          name: canteen.name
        }
      }
      handleCanteenChange(tab)
    }

    // 添加窗口选择函数
    const selectWindow = async (window) => {
      selectedWindow.value = window
      // 加载该窗口的菜品列表
      if (window) {
        await loadWindowDishes(window.id)
      } else {
        dishes.value = []
      }
    }

    // 改加载窗口菜品的函数
    const loadWindowDishes = async (windowId) => {
      try {
        // 使用测试数据
        dishes.value = windowDishMap[windowId] || []
        
        if (dishes.value.length === 0) {
          ElMessage.info('该窗口暂无菜品信息')
        }
        return dishes.value
      } catch (error) {
        console.error('加载菜品列表失败:', error)
        ElMessage.error('加载菜品列表失败')
        dishes.value = []
        return []
      }
    }

    // 添加示菜品详情的函数
    const showDishDetail = (dish) => {
      router.push(`/student/dishes/${dish.id}`)
    }

    // 添加下单函数
    const orderDish = (dish) => {
      router.push(`/student/dishes/${dish.id}`)
    }

    // 定义口味选项
    const tasteOptions = [
      { label: '麻辣', value: 'spicy' },
      { label: '清淡', value: 'light' },
      { label: '酸甜', value: 'sweet' },
      { label: '咸鲜', value: 'savory' }
    ]

    // 修改搜索处理函数
    const handleSearch = () => {
      if (!searchQuery.value.trim()) {
        ElMessage.warning('请输入搜索关键词')
        return
      }
      
      // 执行搜索逻辑
      // 搜索逻辑已通过计算属性自动处理
      ElMessage.success(`正在搜索: ${searchQuery.value}`)
    }

    // 处理窗口级搜索
    const handleWindowSearch = () => {
      // 窗口级别搜索逻辑会通过计算属性自动处理
    }

    // 处理排序
    const handleSort = () => {
      if (!sortOption.value || sortOption.value === 'default') {
        // 如果选择"全部"或"默排序"，恢复随机顺序
        allDishes.value = [...allDishes.value].sort(() => Math.random() - 0.5)
      }
    }

    // 处理口味过滤
    const handleFilter = () => {
      // 过滤逻辑会通过计算属性自动处理
    }

    // 重置所有筛选件
    const resetFilters = () => {
      searchQuery.value = ''
      windowSearchQuery.value = ''
      selectedTaste.value = ''
      sortOption.value = ''
      selectedCategory.value = ''
    }

    // 修改菜品过滤的计算属性
    const finalFilteredDishes = computed(() => {
      let result = dishes.value

      // 应用搜索过滤
      if (windowSearchQuery.value) {
        const query = windowSearchQuery.value.toLowerCase()
        result = result.filter(dish => 
          dish.name.toLowerCase().includes(query) ||
          dish.description.toLowerCase().includes(query)
        )
      }

      // 应用口味过滤
      if (selectedTaste.value) {
        result = result.filter(dish => dish.taste === selectedTaste.value)
      }

      // 应用分类过滤
      if (selectedCategory.value) {
        result = result.filter(dish => dish.category === selectedCategory.value)
      }

      // 应用排序
      if (sortOption.value) {
        result = [...result].sort((a, b) => {
          switch (sortOption.value) {
            case 'price-asc':
              return a.price - b.price
            case 'price-desc':
              return b.price - a.price
            case 'sales':
              return (b.sales || 0) - (a.sales || 0)
            default:
              return 0
          }
        })
      }

      return result
    })

    // 添加分页相关的响应式数据
    const currentPage = ref(1)
    const pageSize = ref(8) // 每页显示8个窗口

    // 计算总窗口数和总页数
    const totalWindows = computed(() => {
      const windows = getFloorWindows(activeCanteen.value, selectedFloor.value) || []
      return windows.length
    })

    const totalPages = computed(() => {
      return Math.ceil(totalWindows.value / pageSize.value)
    })

    // 计算当前页显示的窗口
    const displayWindows = computed(() => {
      const windows = getFloorWindows(activeCanteen.value, selectedFloor.value) || []
      const start = (currentPage.value - 1) * pageSize.value
      return windows.slice(start, start + pageSize.value)
    })

    // 处理页码改变
    const handlePageChange = (page) => {
      currentPage.value = page
    }

    // 新增楼层切换函数
    const toggleFloor = (floor) => {
      // 如果点击的是当前选中的楼层，则取选择，显示全部菜品
      if (selectedFloor.value === floor) {
        selectedFloor.value = null
        selectedWindow.value = null
      } else {
        // 否则选择新的楼层
        selectedFloor.value = floor
        selectedWindow.value = null
      }
      currentPage.value = 1 // 重置页码
    }

    // 在 setup 中添加保存状态的方法
    const saveCurrentState = () => {
      const dishList = document.querySelector('.dishes-list')
      const state = {
        activeCanteen: activeCanteen.value,
        selectedFloor: selectedFloor.value,
        selectedWindow: selectedWindow.value ? {
          id: selectedWindow.value.id,
          name: selectedWindow.value.name,
          operatingHours: selectedWindow.value.operatingHours,
          status: selectedWindow.value.status
        } : null,
        searchQuery: searchQuery.value,
        windowSearchQuery: windowSearchQuery.value,
        selectedTaste: selectedTaste.value,
        scrollPosition: dishList?.scrollTop || 0,
        scrollHeight: dishList?.scrollHeight || 0,
        scrollWidth: dishList?.scrollWidth || 0,
        clientHeight: dishList?.clientHeight || 0
      }
      localStorage.setItem('dishListState', JSON.stringify(state))
    }

    // 修改 goToDishDetail 方法
    const goToDishDetail = (dishId) => {
      saveCurrentState() // 保存当前状态
      router.push(`/student/dishes/${dishId}`)
    }

    // 在 setup 中添新的方法
    const getTasteLabel = (taste) => {
      const tasteMap = {
        'spicy': '麻辣',
        'light': '清淡',
        'sweet': '甜味',
        'savory': '咸鲜'
      }
      return tasteMap[taste] || taste
    }

    const getTasteTagType = (taste) => {
      const typeMap = {
        'spicy': 'danger',
        'light': 'info',
        'sweet': 'warning',
        'savory': 'success'
      }
      return typeMap[taste] || ''
    }

    // 在 setup 中添加购物车相关的响应数据和方法
    const cartData = ref({}) // 使用对象存储每个窗口的购物车数据
    const cartDrawerVisible = ref(false)
    const checkoutDialogVisible = ref(false)
    const checkoutFormRef = ref(null)

    const checkoutForm = reactive({
      diningTime: '',
      diningType: 'dine_in',
      remark: ''
    })

    const checkoutRules = {
      diningTime: [
        { required: true, message: '请选择就餐时间', trigger: 'change' }
      ],
      diningType: [
        { required: true, message: '请选择就餐方式', trigger: 'change' }
      ]
    }

    // 修改计算属性,只显示当前窗口的购物车数据
    const cartItems = computed(() => {
      // 如果在特定窗口视图，显示该窗口的购物车；否则显示所有窗口的购物车
      const windowId = selectedWindow.value?.id
      if (windowId) {
        return cartData.value[windowId] || []
      }
      // 在全部菜品视图时，返回所有窗口的购物车商品
      return Object.values(cartData.value).flat()
    })

    // 修改总价计算
    const totalPrice = computed(() => {
      return cartItems.value.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    })

    // 修改总数量计算
    const totalCount = computed(() => {
      return cartItems.value.reduce((total, item) => {
        return total + item.quantity
      }, 0)
    })

    // 修改添加到购物车的方法
    const addToCart = async (dish) => {
      try {
        event.stopPropagation()
        
        // 获取窗口ID，优先使用选中窗口的ID，如果是全部菜品视图则使用菜品自带的windowId
        const windowId = selectedWindow.value?.id || dish.windowId
        
        // 如果该窗口还没有购物车数据,初始化一个空数组
        if (!cartData.value[windowId]) {
          cartData.value[windowId] = []
        }
        
        const windowCart = cartData.value[windowId]
        const existingItem = windowCart.find(item => item.id === dish.id)
        
        if (existingItem) {
          existingItem.quantity++
        } else {
          windowCart.push({
            ...dish,
            windowId,
            quantity: 1
          })
        }
        
        // 保存到本地存储
        localStorage.setItem('cartData', JSON.stringify(cartData.value))
        
        ElMessage.success('已加到购物车')
      } catch (error) {
        console.error('添加购物车失败:', error)
        ElMessage.error('添加购物车失败')
      }
    }

    // 修改处理数量变化的方法
    const handleQuantityChange = (item, windowId) => {
      if (item.quantity === 0) {
        // 过滤掉数量为0的商品
        cartData.value[windowId] = cartData.value[windowId].filter(i => i.id !== item.id);
        // 如果该窗口没有商品了，直接删除该窗口的购物车数据
        if (cartData.value[windowId].length === 0) {
          delete cartData.value[windowId];
        }
      }
    }

    // 显示购物车详情
    const showCartDetail = () => {
      cartDrawerVisible.value = true
    }

    // 去结算
    const goToCheckout = (windowId) => {
      cartDrawerVisible.value = false
      checkoutDialogVisible.value = true
      currentWindowId.value = windowId
    }

    // 修改提交订单的方法
    const submitOrder = async () => {
      if (!checkoutFormRef.value) return
      
      try {
        await checkoutFormRef.value.validate()
        
        const windowId = selectedWindow.value?.id
        if (!windowId || !cartData.value[windowId]) {
          throw new Error('购物车数据无效')
        }
        
        // 构建订单数据
        const orderData = {
          windowId,
          items: cartData.value[windowId],
          ...checkoutForm
        }
        
        // await request.post('/student/orders', orderData)
        
        ElMessage.success('下单成功')
        checkoutDialogVisible.value = false
        // 清空当前窗口的购物车
        cartData.value[windowId] = []
        
        router.push('/student/orders')
      } catch (error) {
        console.error('下单失败:', error)
        ElMessage.error('下单失败')
      }
    }

    // 修改购物车样式
    const cartStyle = computed(() => {
      return {
        position: 'fixed',
        left: '135px',
        right: '50px',
        bottom: '60px',
        background: '#fff',
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
        zIndex: 1000
      }
    })

    // 修改购物车数据结构，添加窗口ID
    const currentWindowId = ref(null)

    // 修改 restoreState 方法
    const restoreState = async () => {
      const stateStr = localStorage.getItem('dishListState')
      const isReturning = localStorage.getItem('isReturningFromDetail')
      
      if (stateStr && isReturning === 'true') {
        try {
          const state = JSON.parse(stateStr)
          
          // 先恢复餐厅选择
          activeCanteen.value = state.activeCanteen
          await nextTick()
          
          // 恢复楼层选
          if (state.selectedFloor) {
            selectedFloor.value = state.selectedFloor
            await nextTick()
            
            // 恢复窗口选
            if (state.selectedWindow) {
              const windowList = getFloorWindows(state.activeCanteen, state.selectedFloor)
              const window = windowList.find(w => w.id === state.selectedWindow.id)
              if (window) {
                // 先加载菜品，设置滚动位置
                await selectWindow(window)
                await nextTick()
                
                // 确保菜品列表已完全渲染
                await new Promise(resolve => setTimeout(resolve, 200))
                
                const dishList = document.querySelector('.dishes-list')
                if (dishList) {
                  // 检查滚动位置是否有效
                  const maxScroll = dishList.scrollHeight - dishList.clientHeight
                  const targetScroll = Math.min(state.scrollPosition, maxScroll)
                  dishList.scrollTop = targetScroll
                }
              }
            }
          }
          
          // 最后恢复过滤和搜索条件
          searchQuery.value = state.searchQuery
          windowSearchQuery.value = state.windowSearchQuery
          selectedTaste.value = state.selectedTaste
          sortOption.value = state.priceSort
          
          // 清除状态
          localStorage.removeItem('isReturningFromDetail')
          localStorage.removeItem('dishListState')
        } catch (error) {
          console.error('恢复状态失败:', error)
        }
      }
    }

    // 修改组件挂载时的行为
    onMounted(async () => {
      if (localStorage.getItem('isReturningFromDetail') === 'true') {
        await nextTick()
        await restoreState()
      }
    })

    // 添防抖函数
    const debounce = (fn, delay) => {
      let timer = null
      return function (...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => fn.apply(this, args), delay)
      }
    }
    
    

    // 使用防抖处理保存状态
    const debouncedSaveState = debounce(saveCurrentState, 300)

    // 在滚动时保存状态
    onMounted(() => {
      const dishList = document.querySelector('.dishes-list')
      if (dishList) {
        dishList.addEventListener('scroll', debouncedSaveState)
      }
      
      return () => {
        if (dishList) {
          dishList.removeEventListener('scroll', debouncedSaveState)
        }
      }
    })

    // 在 setup 中添加新的响应式数据
    const selectedCategory = ref('')
    const dishCategories = computed(() => {
      const categories = new Set(dishes.value.map(dish => dish.category))
      return ['全部', ...Array.from(categories)]
    })

    // 添加分类选择方法
    const selectCategory = (category) => {
      selectedCategory.value = category === '全部' ? '' : category
    }

    // 修改清空购物车方法
    const clearCart = () => {
      // 重置购物车数据为新的空对象
      cartData.value = {}
      // 关闭购物车抽屉
      cartDrawerVisible.value = false
      // 提示用户
      ElMessage.success('购物车已清空')
    }

    // 修改获取所有菜品的计算属性
    const allDishes = computed(() => {
      const currentCanteen = activeCanteen.value;
      const canteenWindows = testWindows[currentCanteen] || {};
      let allCanteenDishes = [];

      // 遍历所有楼层和窗口
      Object.values(canteenWindows).forEach(floor => {
        floor.forEach(window => {
          const windowDishes = windowDishMap[window.id] || [];
          // 为每个菜品添加窗口信息
          const dishesWithWindow = windowDishes.map(dish => ({
            ...dish,
            windowName: window.name,
            windowId: window.id,
            windowStatus: window.status
          }));
          allCanteenDishes = [...allCanteenDishes, ...dishesWithWindow];
        });
      });

      // 用 Fisher-Yates 洗牌算法随机打乱菜品顺序
      for (let i = allCanteenDishes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allCanteenDishes[i], allCanteenDishes[j]] = [allCanteenDishes[j], allCanteenDishes[i]];
      }

      return allCanteenDishes;
    });

    // 修改过滤逻辑以适应所有菜品
    const finalFilteredAllDishes = computed(() => {
      let result = allDishes.value;

      // 应用搜索过滤
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(dish => 
          dish.name.toLowerCase().includes(query) ||
          dish.description.toLowerCase().includes(query)
        );
      }

      // 应用口味过滤
      if (selectedTaste.value) {
        result = result.filter(dish => dish.taste === selectedTaste.value);
      }

      // 应用分类过滤
      if (selectedCategory.value) {
        result = result.filter(dish => dish.category === selectedCategory.value);
      }

      // 应用排序
      if (sortOption.value) {
        result = [...result].sort((a, b) => {
          switch (sortOption.value) {
            case 'price-asc':
              return a.price - b.price;
            case 'price-desc':
              return b.price - a.price;
            case 'sales-desc':
              return b.weekSales - a.weekSales;
            case 'sales-asc':
              return a.weekSales - b.weekSales;
            default:
              return 0;
          }
        });
      }

      return result;
    });

    // 添加根据窗口ID获取楼层的方法
    const getFloorByWindowId = (windowId) => {
      const currentCanteen = activeCanteen.value;
      const canteenWindows = testWindows[currentCanteen] || {};
      
      for (const [floor, windows] of Object.entries(canteenWindows)) {
        if (windows.some(window => window.id === windowId)) {
          return floor;
        }
      }
      return '';
    };

    // 添加一个新的计算属性来检查购物车是否有商品
    const hasCartItems = computed(() => {
      return cartData.value && Object.values(cartData.value).some(items => items.length > 0)
    })

    // 添加新的计算属性和方法
    const groupedCartItems = computed(() => {
      return cartData.value || {};
    });

    const getWindowName = (windowId) => {
      const currentCanteen = activeCanteen.value;
      const canteenWindows = testWindows[currentCanteen] || {};
      for (const floor of Object.values(canteenWindows)) {
        const window = floor.find(w => w.id === Number(windowId));
        if (window) return window.name;
      }
      return '未知窗口';
    };

    const getWindowTotal = (items) => {
      return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getWindowCount = (items) => {
      return items.reduce((total, item) => total + item.quantity, 0);
    };

    const clearWindowCart = (windowId) => {
      // 直接删除该窗口的购物车数据，而不是设置为空数组
      delete cartData.value[windowId];
      if (Object.values(cartData.value).every(items => items.length === 0)) {
        cartDrawerVisible.value = false;
      }
      ElMessage.success('已清空该窗口购物车');
    };

    // 在 setup 中添加跳转方法
    const goToCart = () => {
      router.push('/student/cart')
    }

    // 添加地图显示状态的响应式变量
    const isMapVisible = ref(true)

    // 添加切换地图显示/隐藏方法
    const toggleMap = () => {
      isMapVisible.value = !isMapVisible.value
    }

    return {
      router,
      activeCanteen,
      selectedWindow,
      searchQuery,
      windowSearchQuery,
      selectedTaste,
      tasteOptions,
      canteens,
      isCanteenOpen: canteenStatus,
      getFloorWindows: windows,
      isWindowOpen: windowStatus,
      getCrowdLevelType: crowdLevel,
      getCrowdLevelText: crowdText,
      getWindowDishCount: dishCount,
      handleCanteenChange,
      mapCanteens,
      handleMapCanteenSelect,
      selectWindow,
      showDishDetail,
      orderDish,
      dishes,
      finalFilteredDishes,
      categories,
      getCategoryType,
      selectedFloor,
      toggleFloor,
      currentPage,
      totalPages,
      displayWindows,
      handlePageChange,
      handleSearch,
      handleWindowSearch,
      handleSort,
      handleFilter,
      resetFilters,
      goToDishDetail,
      getTasteLabel,
      getTasteTagType,
      addToCart,
      cartItems,
      cartDrawerVisible,
      checkoutDialogVisible,
      checkoutForm,
      checkoutFormRef,
      checkoutRules,
      totalPrice,
      totalCount,
      showCartDetail,
      handleQuantityChange,
      goToCheckout,
      submitOrder,
      cartStyle,
      currentWindowId,
      sortOption,
      selectedCategory,
      dishCategories,
      selectCategory,
      clearCart,
      finalFilteredAllDishes,
      getFloorByWindowId,
      hasCartItems,
      groupedCartItems,
      getWindowName,
      getWindowTotal,
      getWindowCount,
      clearWindowCart,
      goToCart,
      isMapVisible,
      toggleMap
    }
  }
}
</script>

<style scoped>
.dish-list-container {
  padding: 0; /* 移除最外层容器的内边距 */
}

.dish-list {
  padding: 0; /* 移除最外层容器的内边距 */
}

.canteen-nav {
  margin-bottom: 10px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  position: relative;
}

/* 隐藏滚动条但保持功能 */
.canteen-nav::-webkit-scrollbar {
  display: none;
}

.canteen-nav {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 自定义tabs样式 */
.scrollable-tabs {
  white-space: nowrap;
  width: 100%;
}

.scrollable-tabs :deep(.el-tabs__header) {
  margin: 0;
  overflow-x: auto;
  overflow-y: hidden;
}

.scrollable-tabs :deep(.el-tabs__nav-wrap) {
  padding-bottom: 0;
  overflow: visible;
}

.scrollable-tabs :deep(.el-tabs__nav-scroll) {
  overflow: visible;
  white-space: nowrap;
  width: 100%;
}

.scrollable-tabs :deep(.el-tabs__nav) {
  display: inline-flex;
  gap: 8px;
  padding: 0 12px;
  width: auto;
  min-width: 100%;
}

.scrollable-tabs :deep(.el-tabs__item) {
  flex-shrink: 0;
  padding: 0 20px;
  height: 36px;
  line-height: 36px;
  border-radius: 18px;
  background: #f5f7fa;
  border: none;
  transition: all 0.3s;
  font-size: 14px;
  min-width: max-content;
}

.scrollable-tabs :deep(.el-tabs__item.is-active) {
  background: #409eff;
  color: #fff;
}

.scrollable-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .scrollable-tabs :deep(.el-tabs__nav) {
    padding: 0 8px;
    gap: 6px;
  }

  .scrollable-tabs :deep(.el-tabs__item) {
    padding: 0 16px;
    height: 32px;
    line-height: 32px;
    font-size: 13px;
  }
}

.canteen-info {
  margin-bottom: 6px; /* 从10px减小到6px */
  border-radius: 6px; /* 从8px减小到6px */
}

.canteen-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.canteen-basic h3 {
  margin: 0 0 10px;
}

.status-tags {
  display: flex;
  gap: 10px;
}

.canteen-details {
  margin-top: 15px;
  color: #666;
}

.canteen-details p {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 5px 0;
}

.window-navigation {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.nav-section {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 0 20px;
  background: linear-gradient(to right, #f8f9fa, #ffffff);
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  margin: 16px 0;
}

.nav-list {
  display: flex;
  gap: 12px;
  padding: 0;
  margin: 0;
  list-style: none;
  width: 100%;
  justify-content: center;
}

.nav-item {
  flex: 1;
  max-width: 120px;
  padding: 12px 24px;
  background: #ffffff;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.1), rgba(64, 158, 255, 0));
  opacity: 0;
  transition: opacity 0.3s;
}

.nav-item:hover {
  transform: translateY(-2px);
  border-color: #409eff;
  color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.nav-item:hover::before {
  opacity: 1;
}

.nav-item.active {
  background: #409eff;
  color: #ffffff;
  border-color: #409eff;
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.3);
}

.nav-item.active::before {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
  opacity: 1;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .nav-section {
    padding: 8px;
    margin: 12px 0;
  }

  .nav-list {
    gap: 8px;
  }

  .nav-item {
    padding: 10px 16px;
    font-size: 14px;
    max-width: 100px;
  }
}

/* 小屏幕适配 */
@media screen and (max-width: 393px) {
  .nav-section {
    padding: 6px;
    margin: 8px 0;
  }

  .nav-list {
    gap: 6px;
  }

  .nav-item {
    padding: 8px 12px;
    font-size: 13px;
    max-width: 80px;
  }
}

.filter-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.search-input {
  width: 200px;
}

.dishes-content {
  display: flex;
}

.dishes-list {
  flex: 1;
  padding: 20px;
  min-height: 500px;
  background: #fff;
}

.dishes-list.full-width {
  width: 100%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .top-nav {
    flex-direction: column;
  }

  .filter-actions {
    flex-direction: column;
    width: 100%;
  }

  .filter-actions .el-input,
  .filter-actions .el-select {
    width: 100%;
  }

  .nav-items {
    flex-direction: column;
    width: 100%;
  }

  .nav-item {
    width: 100%;
    text-align: center;
  }

  .nav-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-list {
    width: 100%;
  }

  .nav-item {
    width: 100%;
    justify-content: center;
  }
}

/* 添加地图相关样式 */
.map-section {
  width: 100%;
  height: 300px;
  margin-bottom: 10px; /* 从20px减小到10px */
  border-radius: 6px; /* 从8px减小到6px */
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.map-section canvas {
  width: 100% !important;
  height: 100% !important;
}

.dishes-content {
  display: flex;
}

.category-nav {
  width: 200px;
  margin-right: 20px;
}

.category-item {
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-item:hover {
  background: #f5f7fa;
}

.category-item.active {
  background: #409EFF;
  color: #fff;
}

.dishes-list {
  flex: 1;
}

.dish-item {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 15px;
  display: flex;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #ebeef5;
}

.dish-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.dish-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.dish-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dish-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dish-name {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.dish-description {
  font-size: 12px;
  -webkit-line-clamp: 1; /* 只显示一行 */
  line-clamp: 1;         /* 添加标准属性 */
  margin-bottom: 4px;
}

.dish-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.dish-tags :deep(.el-tag) {
  margin-bottom: 4px;
}

.dish-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-info {
  display: flex;
  align-items: baseline;
}

.price-symbol {
  font-size: 12px;
  color: #f56c6c;
  margin-right: 2px;
}

.price-value {
  font-size: 20px;
  font-weight: 500;
  color: #f56c6c;
  margin-left: 2px;
}

.add-button {
  padding: 8px;
}

/* 响应调整 */
@media (max-width: 768px) {
  .dishes-grid {
    grid-template-columns: 1fr;
  }
  
  .dish-card {
    margin-bottom: 12px;
  }
  
  .window-filter-controls {
    flex-direction: column;
  }
  
  .filter-item {
    width: 100%;
    margin-bottom: 8px;
  }
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 24px;
}

.filter-card {
  margin-bottom: 6px; /* 从10px减小到6px */
  border-radius: 6px;
}

.filter-controls {
  display: flex;
  gap: 8px; /* 从15px减小到8px */
  flex-wrap: wrap;
  padding: 0 10px; /* 从20px减小到10px */
}

.filter-item {
  min-width: 200px;
}

.window-filter-controls {
  margin-bottom: 15px;
  padding: 10px;
  background: #fff;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
  }

  .filter-item {
    width: 100%;
  }
}

.window-closed,
.no-window-selected {
  text-align: center;
  padding: 60px 20px;
  background: #fff;
  border-radius: 8px;
  margin: 20px 0;
  width: 100%;
}

.empty-state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 20px 0;
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 15px;
}

.empty-title {
  font-size: 18px;
  color: #303133;
  margin: 0;
}

.empty-status {
  font-size: 14px;
  color: var(--el-color-info);
  margin: 4px 0;
}

.empty-hours {
  font-size: 13px;
  color: #606266;
}

.empty-hint {
  font-size: 14px;
  color: #909399;
  margin: 8px 0;
}

.empty-sub-hint {
  font-size: 13px;
  color: #c0c4cc;
}

/* 添加过渡动画 */
.el-empty {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.el-empty :deep(.el-empty__image) {
  width: 100%;
  max-width: 500px;
  height: auto;
  margin-bottom: 20px;
}

.el-empty :deep(.el-empty__description) {
  width: 100%;
  padding: 0 20px;
}

.empty-state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 20px 0;
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 15px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .el-empty :deep(.el-empty__image) {
    max-width: 200px;
  }
  
  .empty-state-content {
    max-width: 100%;
    padding: 0 10px;
  }
  
  .el-empty :deep(.el-empty__description) {
    font-size: 14px;
  }
  
  .empty-title {
    font-size: 18px;
  }
  
  .empty-status {
    font-size: 14px;
  }
}

/* 屏幕适配 */
@media (max-width: 480px) {
  .el-empty :deep(.el-empty__image) {
    max-width: 150px;
  }
  
  .empty-state-content {
    padding: 0 5px;
  }
  
  .el-empty :deep(.el-empty__description) {
    font-size: 13px;
  }
}

.canteen-floors {
  margin-top: 15px;
}

.floor-item {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.floor-item:active {
  background: #f5f5f5;
}

.floor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.floor-name {
  font-size: 16px;
  font-weight: 500;
}

.window-count {
  color: #909399;
  font-size: 13px;
}

.window-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.window-tag {
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #606266;
}

/* 添加美团格双列布局样式 */
.meituan-layout {
  display: flex;
  margin-top: 20px;
  background: #f5f5f5;
  border-radius: 0; /* 移除圆角 */
  overflow: hidden;
  height: calc(100vh - 140px); /* 从180px减小到140px */
  width: 100%;
}

.window-list {
  width: 110px;
  background: #fff;
  overflow-y: auto;
  border-right: 1px solid #eee;
  flex-shrink: 0;
  padding: 4px;
}

.window-item {
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 4px;
  border: 1px solid transparent;
}

.window-item:hover {
  background: #f5f7fa;
}

.window-item.active {
  background: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary-light-5);
}

/* 添加窗口图片样式 */
.window-image {
  width: 94px;
  height: 64px;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f7fa;
  margin-bottom: 4px;
}

.window-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 窗口信息容器 */
.window-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.window-name {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
  margin: 0;
  line-height: 1.3;
}

/* 营业状态样式 */
.window-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 2px;
  background: #f0f9eb;
  color: #67c23a;
  width: fit-content;
}

.window-status.closed {
  background: #f4f4f5;
  color: #909399;
}

.window-status .el-icon {
  font-size: 12px;
}

/* 营业时间样式 */
.window-hours {
  font-size: 11px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 4px;
}

.window-hours .el-icon {
  font-size: 12px;
}

/* 窗口描述样式 */
.window-description {
  font-size: 11px;
  color: #666;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
   line-clamp: 2;
  overflow: hidden;
  margin-top: 2px;
}

/* VIVO X80等移动端适配 */
@media screen and (max-width: 393px) {
  .window-list {
    width: 100px;
    padding: 3px;
  }
  
  .window-item {
    padding: 6px;
  }
  
  .window-image {
    width: 86px;
    height: 58px;
  }
  
  .window-name {
    font-size: 12px;
  }
  
  .window-status {
    font-size: 10px;
    padding: 1px 4px;
  }
  
  .window-hours,
  .window-description {
    font-size: 10px;
  }
}

/* 添加图片加载占位效果 */
.window-image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f5f7fa 25%, #e4e7ed 50%, #f5f7fa 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  display: flex;
  align-items: center;
  justify-content: center;
}

.window-image-placeholder .el-icon {
  font-size: 20px;
  color: #909399;
}

/* 调整窗口列表滚动条样式 */
.window-list::-webkit-scrollbar {
  width: 4px;
}

.window-list::-webkit-scrollbar-thumb {
  background: #e4e7ed;
  border-radius: 2px;
}

.window-list::-webkit-scrollbar-track {
  background: transparent;
}

/* 添加窗口切换动画 */
.window-item {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dishes-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 0 60px 0; /* 从120px减小到60px */
  height: 100%;
}

.dish-item {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 12px;
  display: flex;
}

.dish-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  margin-right: 12px;
}

.dish-info {
  flex: 1;
  position: relative;
}

.dish-name {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 8px;
}

.dish-price {
  color: #f56c6c;
  font-size: 16px;
  font-weight: 500;
}

.add-button {
  position: absolute;
  right: 0;
  bottom: 0;
}

.window-closed,
.no-window-selected {
  text-align: center;
  padding: 40px 0;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 12px;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-controls {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-item {
  min-width: 200px;
}

.window-filter-controls {
  margin-bottom: 15px;
  padding: 10px;
  background: #fff;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
  }

  .filter-item {
    width: 100%;
  }
}

/* 修改购物相关样式 */
.cart-wrapper {
  position: fixed;
  left: 135px;
  right: 50px;
  bottom: 60px;
  background: #fff;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

/* 修改菜品列表容器样式 */
.dishes-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  padding-bottom: 140px;
  height: 100%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .cart-wrapper {
    left: 90px; /* 调整为窗口列表宽度 + 间距 */
  }
  
  .dishes-list {
    padding-bottom: 120px;
  }
}

/* 添加购物车内容样式 */
.cart-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-info {
  flex: 1;
}

.window-name {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
}

.cart-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cart-total {
  color: #f56c6c;
  font-size: 16px;
  font-weight: 500;
}

.cart-count {
  color: #909399;
  font-size: 13px;
}

.empty-hint {
  color: #909399;
  font-size: 14px;
}

.window-info-card {
  margin-bottom: 8px; /* 从16px减小到8px */
  border-radius: 6px;
}

.window-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.window-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.window-tags {
  display: flex;
  gap: 8px;
}

.category-nav {
  margin: 6px 0; /* 从16px减小到6px */
  gap: 4px; /* 从8px减小到4px */
  display: flex;
  flex-wrap: wrap;
}

.category-tag {
  cursor: pointer;
  user-select: none;
}

.category-tag:hover {
  opacity: 0.8;
}

.dishes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px; /* 从8px减小到4px */
  padding: 2px; /* 从4px减小到2px */
  width: 100%;
  margin: 0;
}

.dish-card {
  margin: 0;
  border-radius: 6px;
  border: none; /* 移除边框 */
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* 添加轻微阴影 */
}

.dish-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dish-card-content {
  padding: 4px; /* 从8px减小到4px */
}

.dish-image {
  width: 100%;
  height: 180px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  color: #909399;
  font-size: 24px;
}

.dish-info {
  padding: 0 2px; /* 从4px减小到2px */
}

.dish-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.dish-name {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.dish-description {
  font-size: 12px;
  -webkit-line-clamp: 1; /* 只显示一行 */
  line-clamp: 1;         /* 添加标准属性 */
  margin-bottom: 4px;
}

.dish-tags {
  margin: 2px 0; /* 从4px减小到2px */
  gap: 2px; /* 从4px减小到2px */
  display: flex;
  flex-wrap: wrap;
}

.dish-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px; /* 从8px减小到4px */
}

.price-info {
  display: flex;
  align-items: baseline;
}

.price-symbol {
  font-size: 12px;
  color: #f56c6c;
}

.price-value {
  font-size: 20px;
  font-weight: 500;
  color: #f56c6c;
  margin-left: 2px;
}

.add-button {
  padding: 8px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .dishes-grid {
    grid-template-columns: 1fr;
  }
  
  .dish-card {
    margin-bottom: 12px;
  }
  
  .window-filter-controls {
    flex-direction: column;
  }
  
  .filter-item {
    width: 100%;
    margin-bottom: 8px;
  }
}

/* 优化筛选控件样式 */
.window-filter-controls {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-item {
  min-width: 180px;
  flex: 1;
}

@media (max-width: 768px) {
  .window-filter-controls {
    flex-direction: column;
    gap: 10px;
  }
  
  .filter-item {
    width: 100%;
  }
}

/* 修改右侧内容区域样式 */
.dishes-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  width: calc(100% - 85px);
}

/* 响应式调整 */
@media (max-width: 1400px) {
  .dishes-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
}

@media (max-width: 1200px) {
  .dishes-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .dishes-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
  
  .dishes-container {
    width: calc(100% - 70px);
  }
}

@media (max-width: 480px) {
  .dishes-grid {
    grid-template-columns: 1fr;
  }
}

/* 添加悬浮购物车按钮样式 */
.floating-cart-button {
  position: fixed;
  right: 16px;
  bottom: 80px;
  z-index: 1002; /* 确保在地图切换按钮之上 */
  cursor: pointer;
}

.cart-button {
  width: 48px;
  height: 48px;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cart-badge :deep(.el-badge__content) {
  background-color: #f56c6c;
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  z-index: 1;
}

/* 购物车抽屉样式 */
.cart-drawer :deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
}

.cart-drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.cart-drawer-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.cart-drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cart-window-info {
  padding: 12px 20px;
  border-bottom: 1px solid #ebeef5;
}

.cart-items-container {
  flex: 1;
  overflow-y: auto;
  padding: 12px 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f2f2f2;
}

.cart-item-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  margin-right: 12px;
}

.cart-item-info {
  flex: 1;
  margin-right: 12px;
}

.cart-item-name {
  font-size: 14px;
  color: #303133;
  margin-bottom: 4px;
}

.cart-item-price {
  font-size: 15px;
  color: #f56c6c;
  font-weight: 500;
}

.cart-footer {
  padding: 16px 20px;
  border-top: 1px solid #ebeef5;
  background: #fff;
}

.cart-total-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.total-label {
  font-size: 14px;
  color: #606266;
}

.total-price {
  font-size: 20px;
  color: #f56c6c;
  font-weight: 500;
}

.checkout-button {
  width: 100%;
}

.empty-cart {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.empty-cart-icon {
  color: #909399;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .floating-cart-button {
    right: 12px;
    bottom: 70px;
  }

  .cart-button {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .cart-badge :deep(.el-badge__content) {
    font-size: 12px;
    padding: 0 4px;
    height: 16px;
    line-height: 16px;
  }
}

/* 修改楼层导航样式 */
.floor-nav {
  width: 100%;
  margin-bottom: 10px; /* 从20px减小到10px */
  display: flex;
  justify-content: flex-start;
  padding: 0 10px; /* 从20px减小到10px */
}

.floor-nav .nav-list {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: calc(100% - 40px);  /* 减去左右padding */
  gap: 6px; /* 从10px减小到6px */
}

.floor-nav .nav-item {
  flex: 1;
  text-align: center;
  justify-content: center;
  padding: 12px 0;
  min-width: 0;
  font-size: 15px;
  border: none;
  transition: all 0.3s ease;
  margin: 0;
  position: relative;
  background: #f0f7ff;  /* 更改默认背景色为淡蓝色 */
  border-radius: 4px;
  color: #409EFF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.floor-nav .nav-item:hover {
  background: #e6f1fc;
  color: #409EFF;
  opacity: 0.8;
  cursor: pointer;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.floor-nav .nav-item.active {
  background: linear-gradient(135deg, #409EFF, #3a8ee6);
  color: #fff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .floor-nav {
    padding: 0 6px;
  }
  
  .floor-nav .nav-list {
    gap: 3px;
    width: calc(100% - 20px);
  }

  .floor-nav .nav-item {
    font-size: 14px;
    padding: 10px 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
}

  /* 添加过渡效果 */
  .floor-nav .nav-item {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* 确保与重置按钮度对齐 */
  .filter-controls {
    display: flex;
    gap: 8px; /* 从15px减小到8px */
    flex-wrap: wrap;
    padding: 0 10px; /* 从20px减小到10px */
  }

  @media (max-width: 768px) {
    .filter-controls {
      padding: 0 6px;
    }
  }

  /* 添加全部菜品展示的样式 */
  .all-dishes-container {
    padding: 4px; /* 减小边距 */
    background: transparent; /* 移除背景色 */
  }

  .dishes-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);  /* 两列布局 */
    gap: 20px;
    padding: 16px 0;
  }

  /* 响应式调整 */
  @media (max-width: 768px) {
    .dishes-grid {
      grid-template-columns: 1fr;  /* 移动端单列布局 */
    }
  }

  /* 添加新的样式 */
  .dish-title {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .dish-window-info {
    font-size: 12px;
    color: #909399;
  }

  .dish-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  /* 调整标签样式 */
  .dish-window-info :deep(.el-tag) {
    font-size: 12px;
    height: 20px;
    line-height: 18px;
    padding: 0 6px;
  }

  /* 响应式调整 */
  @media (max-width: 768px) {
    .dish-title {
      gap: 2px;
    }
    
    .dish-window-info {
      font-size: 11px;
    }
  }

  /* 添加一个提示样式 */
  .floor-nav .nav-item.active:hover {
    opacity: 0.8;
    cursor: pointer;
  }

  /* 修改提示文字的样式 */
  .floor-nav .nav-item.active::after {
    content: '点击返回全部';
    position: absolute;
    bottom: -24px;  /* 调整位置，避免遮挡 */
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    color: #909399;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;  /* 防止提示文字影响鼠标事件 */
    z-index: 1;  /* 确保提示文字显示在上 */
    background: rgba(255, 255, 255, 0.9);  /* 添加半透明背景 */
    padding: 4px 8px;  /* 添加内边距 */
    border-radius: 4px;  /* 圆角 */
  }

  .floor-nav .nav-item.active:hover::after {
    opacity: 1;
  }

  /* 添加容器样式以防止提示文字溢出 */
  .nav-section.floor-nav {
    position: relative;
    padding-bottom: 24px;  /* 为提示文字预留空间 */
  }

  /* 添加新的样式 */
  .cart-window-group {
    border-bottom: 1px solid #ebeef5;
    padding: 8px 0; /* 从16px减小到8px */
  }

  .cart-window-group:last-child {
    border-bottom: none;
  }

  .cart-window-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px; /* 从20px减小到10px */
    margin-bottom: 6px; /* 从12px减小到6px */
  }

  .cart-items-list {
    padding: 0 10px; /* 从20px减小到10px */
  }

  .window-cart-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 6px; /* 从12px减小到6px */
    padding-top: 6px; /* 从12px减小到6px */
    border-top: 1px dashed #ebeef5;
  }

  .window-total-info {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  /* 修改dishes-grid的样式 */
  .dishes-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 固定双列布局 */
    gap: 8px; /* 减小卡片间距 */
    padding: 8px;
    width: 100%;
  }

  /* 修改dish-card的样式使其更紧凑 */
  .dish-card {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s;
    cursor: pointer;
    border: 1px solid #ebeef5;
    width: 100%; /* 确保卡片填充列宽 */
  }

  /* 调整图片尺寸 */
  .dish-image {
    width: 100%;
    height: 120px; /* 减小图片高度 */
    border-radius: 4px;
    margin-bottom: 8px;
  }

  /* 调整卡内容间距 */
  .dish-card-content {
    padding: 8px;
  }

  /* 调整菜品信息样式 */
  .dish-info {
    padding: 0 4px;
  }

  /* 调整菜品名称大小 */
  .dish-name {
    font-size: 14px;
    margin-bottom: 4px;
    /* 添加文字溢出省略 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* 调整描述文字大小和行数 */
  .dish-description {
    font-size: 12px;
    -webkit-line-clamp: 1; /* 只显示一行 */
    line-clamp: 1;         /* 添加标准属性 */
    margin-bottom: 4px;
  }

  /* 调整标签样式 */
  .dish-tags {
    margin: 4px 0;
    gap: 4px;
  }

  .dish-tags :deep(.el-tag) {
    font-size: 10px;
    padding: 0 4px;
    height: 18px;
    line-height: 16px;
  }

  /* 调整价格和按钮样式 */
  .dish-footer {
    margin-top: 8px;
  }

  .price-value {
    font-size: 16px;
  }

  .add-button {
    padding: 4px;
    min-height: 24px;
    height: 24px;
    width: 24px;
  }

  /* 调整窗口信息标签 */
  .dish-window-info :deep(.el-tag) {
    font-size: 10px;
    height: 18px;
    line-height: 16px;
    padding: 0 4px;
  }

  /* 适配VIVO X80的媒体查询 */
  @media screen and (max-width: 393px) {
    .dishes-grid {
      gap: 2px; /* 进一步减小间距 */
      padding: 1px;
    }
    
    .filter-controls {
      padding: 0 6px;
      gap: 4px;
    }
    
    .filter-group {
      gap: 2px;
    }
    
    .dish-card-content {
      padding: 3px;
    }
    
    /* 减小卡片阴影和圆角 */
    .dish-card {
      border-radius: 4px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    
    /* 调整窗口和餐厅卡片的边距 */
    .window-info-card,
    .canteen-info,
    .filter-card {
      margin-bottom: 4px;
      border-radius: 4px;
    }
    
    /* 减小楼层导航的间距 */
    .floor-nav {
      margin-bottom: 6px;
      padding: 0 6px;
    }
    
    .floor-nav .nav-list {
      gap: 3px;
    }
  }

  /* 优化滚动体验 */
  .dishes-list {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    padding-bottom: 120px; /* 为底部购物车按钮留出空间 */
  }

  /* 调整购物车按钮位置 */
  .floating-cart-button {
    right: 16px;
    bottom: 80px;
  }

  .cart-button {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  /* 修改dishes-grid的样式，减小整体边距 */
  .dishes-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    padding: 4px; /* 减整体padding */
      width: 100%;
    margin: 0; /* 确保没有额外边距 */
  }

  /* 修改dishes-container的样式，减小内边距 */
  .dishes-container {
    padding: 0 6px; /* 减小左右内边距 */
  }

  /* 修改all-dishes-container的样式 */
  .all-dishes-container {
    padding: 8px 6px; /* 减小边距 */
    background: #fff;
    border-radius: 8px;
  }

  /* 调整卡片样式 */
  .dish-card {
    margin: 0; /* 移除卡片边距 */
    border-radius: 6px; /* 稍微减小圆角 */
  }

  /* 调整筛选区域样式，使其更紧凑 */
  .window-filter-controls {
    margin: 8px 6px; /* 减小边距 */
    gap: 8px;
  }

  /* 调整分类导航样式 */
  .category-nav {
    margin: 8px 6px; /* 减小边距 */
    gap: 6px;
  }

  /* VIVO X80适配 */
  @media screen and (max-width: 393px) {
    .dishes-grid {
      padding: 2px; /* 进一步减小边距 */
      gap: 6px;
    }
    
    .dishes-container {
      padding: 0 4px; /* 减小容器边距 */
    }
    
    .all-dishes-container {
      padding: 6px 4px;
    }
    
    .window-filter-controls,
    .category-nav {
      margin: 6px 4px;
    }
    
    /* 调整卡片内容边距 */
    .dish-card-content {
      padding: 6px;
    }
    
    /* 调整图片下方内容区域边距 */
    .dish-info {
      padding: 0 2px;
    }
  }

  /* 确保内容区域填充满屏幕宽度 */
  .meituan-layout {
    margin: 0;
    width: 100%;
  }

  /* 调整列表容器样式 */
  .dishes-list {
    padding: 0 0 60px 0; /* 从120px减小到60px */
  }

  /* 修改filter-controls的样式 */
  .filter-controls {
    display: flex;
    gap: 8px; /* 从15px减小到8px */
    flex-wrap: wrap;
    padding: 0 10px; /* 从20px减小到10px */
  }

  /* 添加新的样式类用于口味和价格筛选的容器 */
  .filter-group {
    display: flex;
    gap: 4px; /* 从8px减小到4px */
    flex: 1;
  }

  /* 修改filter-item的样式 */
  .filter-item {
    min-width: 160px; /* 减小最小宽度 */
  }

  /* 搜索框单独占一行 */
  .search-filter {
    width: 100%;
  }

  /* 响应式调整 - 移动端样式 */
  @media screen and (max-width: 393px) {
    .filter-controls {
      padding: 0 8px;
      gap: 8px;
    }

    .filter-group {
      flex-direction: row; /* 保持水平排列 */
      gap: 8px;
      width: 100%;
    }

    /* 让筛选框在动端各占50%宽度 */
    .filter-group .filter-item {
      flex: 1; /* 均分空间 */
      min-width: 0; /* 移除最小宽度限制 */
      width: calc(50% - 4px); /* 考虑间距的50%宽度 */
    }

    /* 调整下拉框的样式使其更紧凑 */
    .filter-group :deep(.el-select) {
      width: 100%;
    }

    .filter-group :deep(.el-input__wrapper) {
      padding: 0 8px;
    }

    .filter-group :deep(.el-input__inner) {
      font-size: 13px;
      height: 32px;
    }

    /* 调整重置按钮样式 */
    .filter-controls .el-button {
      width: 100%;
      margin-top: 8px;
      height: 32px;
    }
  }

  /* 其他移动端尺寸的适配 */
  @media screen and (min-width: 394px) and (max-width: 768px) {
    .filter-controls {
      padding: 0 10px;
      gap: 10px;
    }

    .filter-group {
      flex-direction: row;
      gap: 10px;
      width: 100%;
    }

    .filter-group .filter-item {
      flex: 1;
      min-width: 0;
    }
  }

  /* 添加搜索框包装器样式 */
  .search-wrapper {
    width: 100%;
    display: flex;
    gap: 8px;
    align-items: center; /* 确保垂直居中对齐 */
    height: 40px; /* 统一容器高度 */
  }

  /* 搜索框样式 - 占80%宽度 */
  .search-filter {
    flex: 0.8;
    min-width: 0;
  }

  /* 修改搜索框内部样式 */
  .search-filter :deep(.el-input__wrapper) {
    height: 40px; /* 与容器高度保持一致 */
    line-height: 40px;
    padding: 1px 11px; /* 统一内边距 */
    border-radius: 4px;
    box-shadow: 0 0 0 1px #dcdfe6 inset; /* 统一边框样式 */
  }

  /* 搜索按钮样式 - 占20%宽度 */
  .search-button {
    flex: 0.2;
    height: 40px; /* 与搜索框保持相同高度 */
    padding: 0 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 14px;
    border-radius: 4px;
    margin: 0;
    min-width: 0;
    white-space: nowrap;
    background-color: #409EFF; /* 使用Element Plus的主题蓝色 */
    border: none;
  }

  /* 搜索按钮图标样式 */
  .search-button .el-icon {
    font-size: 16px;
    margin-right: 2px;
  }

  /* VIVO X80等移动端适配 */
  @media screen and (max-width: 393px) {
    .search-wrapper {
      height: 36px; /* 移动端稍微降低高度 */
    }
    
    .search-filter :deep(.el-input__wrapper) {
      height: 36px;
      line-height: 36px;
    }
    
    .search-button {
      height: 36px;
      padding: 0 12px;
    }
    
    .search-button span {
      display: none;
    }
    
    .search-button .el-icon {
      margin: 0;
      font-size: 14px;
    }
  }

  /* 筛选组样式 */
  .filter-group {
    display: flex;
    gap: 8px;
    width: 100%;
  }

  /* VIVO X80等移动端适配 */
  @media screen and (max-width: 393px) {
    /* 调整筛选卡片整体样式 */
    .filter-card {
      margin: 4px 0;  /* 移除左右边距 */
    }

    .filter-card :deep(.el-card__body) {
      padding: 4px;  /* 统一最小内边距 */
    }

    /* 调整筛选控件容器 */
    .filter-controls {
      padding: 0;  /* 移除内边距 */
      gap: 4px;
      width: 100%;
    }

    /* 搜索区域调整 */
    .search-wrapper {
      gap: 4px;
      padding: 0;
      width: 100%;
    }

    /* 筛选组调整 */
    .filter-group {
      gap: 4px;
      padding: 0;
      width: 100%;
      margin: 0;
    }

    /* 调整筛选框样式 */
    .filter-group .filter-item {
      width: calc(50% - 2px) !important;  /* 强制宽度 */
      min-width: 0 !important;  /* 移除最小宽度限制 */
      max-width: calc(50% - 2px) !important;  /* 限制最大宽度 */
    }

    /* 统一下拉框样式 */
    .filter-group :deep(.el-select) {
      width: 100%;
    }

    .filter-group :deep(.el-input__wrapper) {
      height: 32px;
      padding: 0 24px 0 8px;  /* 调整内边距，为下拉图标留出空间 */
    }

    /* 调整下拉框内部样式 */
    .filter-group :deep(.el-input__inner) {
      font-size: 12px;
      padding: 0;
    }

    /* 调整下拉图标位置和大小 */
    .filter-group :deep(.el-select .el-input__suffix) {
      right: 4px;
    }

    .filter-group :deep(.el-select .el-input__suffix-inner) {
      font-size: 12px;
    }

    /* 调整选项文字大小和显示 */
    .filter-group :deep(.el-select-dropdown__item) {
      font-size: 12px;
      padding: 0 8px;
    }

    /* 文字溢出处理 */
    .filter-group :deep(.el-select .el-input__inner) {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* 重置按钮 */
    .filter-controls .el-button {
      margin: 4px 0 0;
      width: 100%;
      height: 32px;
      font-size: 12px;
    }

    /* 搜索按钮 */
    .search-button {
      padding: 0 8px;
      min-width: 48px;
    }

    /* 搜索框 */
    .search-filter :deep(.el-input__wrapper) {
      padding: 0 8px;
    }
  }

  /* 添加地图切换按钮样式 */
  .map-toggle {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1001;
  }

  .toggle-button {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  /* 修改地图组件样式，添加过渡效果 */
  .map-section {
    transition: all 0.3s ease;
    height: 300px;
    margin-bottom: 10px; /* 从20px减小到10px */
    border-radius: 6px; /* 从8px减小到6px */
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    position: relative;
  }

  /* VIVO X80等移动端适配 */
  @media screen and (max-width: 393px) {
    .map-toggle {
      top: 4px;
      right: 4px;
    }

    .toggle-button {
      padding: 4px 8px;
      font-size: 12px;
    }

    .toggle-button .el-icon {
      font-size: 14px;
    }

    .map-section {
      height: 200px;
      margin-bottom: 6px; /* 从10px减小到6px */
    }
  }

  /* 修改空状态容器的样式 */
  .no-window-selected {
    height: calc(100vh - 140px); /* 从180px减小到140px */
    text-align: center;
    padding: 0;
    background: #fff;
    border-radius: 8px;
    margin: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* 修改el-empty组件的样式 */
  .no-window-selected :deep(.el-empty) {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;
  }

  /* 调整空状态内容的布局 */
  .empty-state-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 0 15px;
  }

  /* VIVO X80等移动端适配 */
  @media screen and (max-width: 393px) {
    .no-window-selected {
      height: calc(100vh - 120px); /* 从160px减小到120px */
    }
    
    .dishes-list {
      padding: 0 0 50px 0; /* 从60px减小到50px */
    }
    
    .dishes-container {
      padding: 0 4px 4px 4px; /* 从6px减小到4px */
    }
    
    .empty-state-content {
      padding: 0 10px;
    }
    
    .empty-hint {
      font-size: 14px;
    }
    
    .empty-sub-hint {
    font-size: 12px;
    }
  }

  /* 修改列表容器的底部padding */
  .dishes-list {
    padding: 0 0 60px 0; /* 从120px减小到60px */
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }

  /* 修改meituan-layout的样式确保内容区域正确填充 */
  .meituan-layout {
    margin: 0;
    width: 100%;
    height: calc(100vh - 140px); /* 从180px减小到140px */
    overflow: hidden;
  }

  /* 修改dishes-container的样式 */
  .dishes-container {
    padding: 0 6px 6px 6px; /* 从10px减小到6px */
    height: 100%;
    overflow: hidden;
  }

  /* 修改下拉框的最大高度 */
  .filter-group :deep(.el-select-dropdown__wrap) {
    max-height: 160px !important; /* 减小最大高度 */
  }

  :deep(.el-select-dropdown) {
    margin-top: 4px !important;
    max-height: 200px !important; /* 设置整个下拉菜单的最大高度 */
  }

  /* 优化下拉选项的样式 */
  :deep(.el-select-dropdown__item) {
    height: 32px; /* 减小选项高度 */
    line-height: 32px;
    padding: 0 8px;
  }

  /* 移动端适配 */
  @media screen and (max-width: 393px) {
    :deep(.el-select-dropdown__wrap) {
      max-height: 120px !important; /* 移动端更小的高度 */
    }
    
    :deep(.el-select-dropdown) {
      margin-top: 2px !important;
      max-height: 160px !important;
    }
    
    :deep(.el-select-dropdown__item) {
      height: 28px;
      line-height: 28px;
      font-size: 12px;
    }
  }

  /* 修改dishes-grid的样式 */
  .dishes-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 6px; /* 减小卡片间距 */
    padding: 4px;
    width: 100%;
  }

  /* 优化菜品卡片样式 */
  .dish-card {
    background: #fff;
    border-radius: 6px;
    overflow: hidden;
    transition: all 0.3s;
    cursor: pointer;
    border: 1px solid #ebeef5;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .dish-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* 调整片样式 */
  .dish-image {
    width: 100%;
    height: 140px; /* 调整图片高度 */
    object-fit: cover;
    border-radius: 4px 4px 0 0;
    margin-bottom: 0;
  }

  /* 优化卡片内容区域 */
  .dish-card-content {
    padding: 8px;
  }

  .dish-info {
    padding: 0;
  }

  /* 优化菜品名称样式 */
  .dish-name {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 4px;
    line-height: 1.3;
    /* 超出两行显示省略号 */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
  }

  /* 优化描述文字样式 */
  .dish-description {
    font-size: 12px;
    color: #666;
    margin: 4px 0;
    line-height: 1.4;
    /* 超出一行显示省略号 */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    overflow: hidden;
  }

  /* 优化标签样式 */
  .dish-tags {
    margin: 6px 0;
    gap: 4px;
    flex-wrap: wrap;
  }

  .dish-tags :deep(.el-tag) {
    font-size: 10px;
    padding: 0 4px;
    height: 18px;
    line-height: 16px;
    border-radius: 2px;
  }

  /* 优化价格和按钮区域 */
  .dish-footer {
    margin-top: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .price-info {
    display: flex;
    align-items: baseline;
  }

  .price-symbol {
    font-size: 12px;
    color: #f56c6c;
  }

  .price-value {
    font-size: 18px;
    font-weight: 500;
    color: #f56c6c;
    margin-left: 2px;
  }

  .add-button {
    padding: 4px;
    height: 28px;
    width: 28px;
    border-radius: 4px;
  }

  .add-button :deep(.el-icon) {
    font-size: 16px;
  }

  /* 优化窗口信息标签 */
  .dish-window-info {
    margin-top: 2px;
  }

  .dish-window-info :deep(.el-tag) {
    font-size: 10px;
    height: 18px;
    line-height: 16px;
    padding: 0 4px;
    background: #f5f7fa;
    border: none;
    color: #909399;
  }

  /* VIVO X80等移动端适配 */
  @media screen and (max-width: 393px) {
    .dishes-grid {
      gap: 4px;
      padding: 2px;
    }
    
    .dish-card {
      border-radius: 4px;
    }
    
    .dish-image {
      height: 120px;
    }
    
    .dish-card-content {
      padding: 6px;
    }
    
    .dish-name {
      font-size: 14px;
    }
    
    .dish-description {
      font-size: 11px;
      margin: 2px 0;
    }
    
    .dish-tags {
      margin: 4px 0;
      gap: 2px;
    }
    
    .price-value {
      font-size: 16px;
    }
    
    .add-button {
      height: 24px;
      width: 24px;
    }
    
    .add-button :deep(.el-icon) {
      font-size: 14px;
    }
  }

  /* 添加加载动画 */
  .dish-card {
    animation: fadeIn 0.3s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* 优化滚动体验 */
  .dishes-list {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    padding-bottom: 80px;
  }

  /* 添加加载占位图样式 */
  .image-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #f5f7fa 25%, #e4e7ed 50%, #f5f7fa 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #909399;
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  /* 筛选卡片样式 */
  .filter-card {
    margin: 4px 0;
    border-radius: 6px;
  }

  .filter-card :deep(.el-card__body) {
    padding: 8px;
    display: flex;
    justify-content: center; /* 让内容居中 */
  }

  /* 筛选控件容器 */
  .filter-controls {
    display: flex;
    gap: 4px;
    flex-direction: column;
    width: 95%; /* 设置宽度为95% */
    margin: 0 auto; /* 自动边距实现水平居中 */
  }

  /* 搜索容器和其他子元素也需要调整为100%宽度 */
  .search-container,
  .search-input,
  .filter-group {
    width: 100%;
  }

  /* 移动端适配 */
  @media screen and (max-width: 393px) {
    .filter-card :deep(.el-card__body) {
      padding: 6px;
    }
    
    .filter-controls {
      width: 95%; /* 保持移动端也是95%宽度 */
    }
  }

  /* 搜索区域样式 */
  .search-wrapper {
    display: flex;
    gap: 4px;
    width: 100%;
  }

  /* 搜索框样式 */
  .search-filter {
    flex: 1;
  }

  .search-filter :deep(.el-input__wrapper) {
    height: 32px;
    border-radius: 4px;
  }

  /* 搜索按钮样式 */
  .search-button {
    height: 32px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 13px;
    border-radius: 4px;
    margin: 0;
    min-width: 56px;
  }

  /* 筛选组样式 */
  .filter-group {
    display: flex;
    gap: 4px;
    width: 100%;
  }

  /* 筛选项样式 */
  .filter-group .filter-item {
    flex: 1;
    min-width: 0 !important;
    max-width: calc(50% - 2px);
  }

  /* 统一下拉框样式 */
  .filter-group :deep(.el-select) {
    width: 100%;
  }

  .filter-group :deep(.el-input__wrapper) {
    height: 32px;
    padding: 0 24px 0 8px;  /* 调整内边距,为下拉图标留出空间 */
  }

  /* 调整下拉框内部样式 */
  .filter-group :deep(.el-input__inner) {
    font-size: 12px;
    padding: 0;
  }

  /* 调整下拉图标位置和大小 */
  .filter-group :deep(.el-select .el-input__suffix) {
    right: 4px;
  }

  .filter-group :deep(.el-select .el-input__suffix-inner) {
    font-size: 12px;
  }

  /* 调整选项文字大小和显示 */
  .filter-group :deep(.el-select-dropdown__item) {
    font-size: 12px;
    padding: 0 8px;
    height: 32px;
    line-height: 32px;
  }

  /* 限制下拉菜单高度 */
  .filter-group :deep(.el-select-dropdown__wrap) {
    max-height: 160px !important;
  }

  :deep(.el-select-dropdown) {
    margin-top: 4px !important;
    max-height: 200px !important;
  }

  /* 重置按钮样式 */
  .filter-controls .el-button {
    margin: 0; /* 移除上边距 */
    width: 100%;
    height: 34px; /* 修改为34px */
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    padding: 0;
  }

  /* VIVO X80等移动端适配 */
  @media screen and (max-width: 393px) {
    .filter-controls .el-button {
      height: 34px; /* 保持一致的高度 */
      font-size: 12px;
    }
  }

  /* 修改搜索区域样式 */
  .search-wrapper {
    display: flex;
    gap: 4px;
    width: 100%;
  }

  /* 搜索框样式 - 占80%宽度 */
  .search-filter {
    flex: 0.8; /* 修改为固定比例0.8 */
    min-width: 0; /* 确保可以缩小 */
  }

  .search-filter :deep(.el-input__wrapper) {
    height: 32px;
    border-radius: 4px;
  }

  /* 搜索按钮样式 - 占20%宽度 */
  .search-button {
    flex: 0.2; /* 修改为固定比例0.2 */
    height: 32px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 13px;
    border-radius: 4px;
    margin: 0;
    min-width: 0; /* 移除最小宽度限制 */
    white-space: nowrap; /* 防止文字换行 */
  }

  /* VIVO X80等移动端适配 */
  @media screen and (max-width: 393px) {
    .search-wrapper {
      gap: 4px;
    }
    
    .search-button {
      padding: 0 4px; /* 减小内边距 */
      font-size: 12px; /* 减小字体 */
    }
    
    /* 在移动端隐藏搜索按钮文字,只显示图标 */
    .search-button span {
      display: none;
    }
    
    .search-button .el-icon {
      margin: 0;
    }
  }

  /* 搜索容器样式 */
  .search-container {
    width: 100%;
  }

  /* 搜索输入框样式 */
  .search-input {
    width: 100%;
  }

  /* 统一输入框和按钮高度 */
  .search-input :deep(.el-input__wrapper) {
    height: 34px;
    line-height: 34px;
  }

  /* 搜索按钮样式 */
  .search-input :deep(.el-input-group__append) {
    padding: 0;
    background-color: var(--el-button-bg-color);
    border-color: var(--el-button-border-color);
  }

  .search-input :deep(.el-input-group__append .el-button) {
    height: 34px;
    border: none;
    margin: 0;
    padding: 8px 15px;
    border-radius: 0 4px 4px 0;
  }

  .search-input :deep(.el-input-group__append .el-button:hover) {
    background-color: var(--el-button-hover-bg-color);
    border-color: var(--el-button-hover-border-color);
  }

  /* 移动端适配 */
  @media screen and (max-width: 393px) {
    .search-input :deep(.el-input-group__append .el-button) {
      padding: 8px 12px;
    }
    
    .search-input :deep(.el-input-group__append .el-button span) {
      display: none;
    }
    
    .search-input :deep(.el-input-group__append .el-button .el-icon) {
      margin: 0;
    }
  }

  /* 搜索区域样式优化 */
  .filter-card {
    border: none;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    margin-bottom: 16px;
    background: #fff;
  }

  .filter-card :deep(.el-card__body) {
    padding: 16px;
  }

  .filter-controls {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .search-container {
    flex: 1;
    min-width: 280px;
  }

  .search-input {
    width: 100%;
  }

  .search-input :deep(.el-input__wrapper) {
    border-radius: 8px 0 0 8px;
    box-shadow: 0 0 0 1px #e4e7ed;
    padding-left: 16px;
  }

  .search-input :deep(.el-input__inner) {
    height: 40px;
    font-size: 14px;
  }

  .search-input :deep(.el-input-group__append) {
    border-radius: 0 8px 8px 0;
    padding: 0;
    overflow: hidden;
  }

  .search-input :deep(.el-input-group__append .el-button) {
    margin: 0;
    border: none;
    padding: 12px 20px;
    height: 40px;
    font-size: 14px;
    border-radius: 0;
  }

  .search-input :deep(.el-input__prefix) {
    color: #909399;
  }

  .filter-group {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .filter-item {
    min-width: 120px;
  }

  .filter-item:deep(.el-select__wrapper) {
    border-radius: 8px;
    box-shadow: 0 0 0 1px #e4e7ed;
  }

  .filter-item:deep(.el-select__input) {
    font-size: 14px;
  }

  /* 重置按钮样式 */
  .filter-item.el-button {
    border-radius: 8px;
    height: 40px;
    padding: 0 20px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s;
  }

  .filter-item.el-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.35);
  }

  /* 移动端适配 */
  @media screen and (max-width: 768px) {
    .filter-card :deep(.el-card__body) {
      padding: 12px;
    }

    .filter-controls {
      gap: 8px;
    }

    .search-container {
      min-width: 100%;
    }

    .filter-group {
      width: 100%;
      justify-content: space-between;
    }

    .filter-item {
      flex: 1;
      min-width: calc(50% - 4px);
    }

    .filter-item.el-button {
      width: 100%;
    }

    .search-input :deep(.el-input__inner),
    .search-input :deep(.el-input-group__append .el-button) {
      height: 36px;
    }
  }

   /* 楼层导航样式优化 */
   .floor-nav {
      background: linear-gradient(to right, #f8f9fa, #ffffff);
      border: none;
      border-radius: 16px;
      padding: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      margin: 16px 0;
    }

    .floor-nav .nav-list {
      display: flex;
      gap: 12px;
      padding: 0;
      margin: 0;
      list-style: none;
    }

    .floor-nav .nav-item {
      flex: 1;
      padding: 12px 24px;
      background: #ffffff;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 500;
      color: #606266;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid #e4e7ed;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 80px;
      position: relative;
      overflow: hidden;
    }

    .floor-nav .nav-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(64, 158, 255, 0.1), rgba(64, 158, 255, 0));
      opacity: 0;
      transition: opacity 0.3s;
    }

    .floor-nav .nav-item:hover {
      transform: translateY(-2px);
      border-color: #409eff;
      color: #409eff;
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
    }

    .floor-nav .nav-item:hover::before {
      opacity: 1;
    }

    .floor-nav .nav-item.active {
      background: #409eff;
      color: #ffffff;
      border-color: #409eff;
      box-shadow: 0 4px 16px rgba(64, 158, 255, 0.3);
    }

    .floor-nav .nav-item.active::before {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
      opacity: 1;
    }

    /* 移动端适配 */
    @media screen and (max-width: 768px) {
      .floor-nav {
        padding: 8px;
        border-radius: 12px;
        margin: 12px 0;
      }

      .floor-nav .nav-list {
        gap: 8px;
      }

      .floor-nav .nav-item {
        padding: 10px 16px;
        font-size: 14px;
        min-width: 60px;
        border-radius: 10px;
      }
    }

    /* 小屏幕适配 */
    @media screen and (max-width: 393px) {
      .floor-nav {
        padding: 6px;
        margin: 8px 0;
      }

      .floor-nav .nav-list {
        gap: 6px;
      }

      .floor-nav .nav-item {
        padding: 8px 12px;
        font-size: 13px;
        min-width: 50px;
      }
    }

</style> 