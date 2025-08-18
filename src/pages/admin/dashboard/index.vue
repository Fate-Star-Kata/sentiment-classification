<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Motion } from 'motion-v'
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'
import {
  User,
  VideoPlay,
  Connection,
  Refresh,
  Setting,
  TrendCharts
} from '@element-plus/icons-vue'

const router = useRouter()

// 动画配置
const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  whileHover: {
    scale: 1.02,
    y: -5,
    transition: { duration: 0.2, ease: ['easeOut'] }
  },
  transition: { duration: 0.4, ease: ['easeOut'] }
}

const statsCardVariants = {
  initial: { opacity: 0, y: 40, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  whileHover: {
    scale: 1.05,
    y: -8,
    transition: { duration: 0.3, ease: ['easeOut'] }
  },
  transition: { duration: 0.5, ease: ['easeOut'] }
}

const iconVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  whileHover: {
    scale: 1.2,
    rotate: 10,
    transition: { duration: 0.2, ease: ['easeOut'] }
  },
  transition: { duration: 0.6, delay: 0.3, ease: ['easeOut'] }
}

// 响应式数据
const loading = ref(false)
const emotionChartRef = ref<HTMLDivElement>()
const trendChartRef = ref<HTMLDivElement>()

// 统计数据
const stats = reactive({
  totalUsers: 1234,
  todayAnalysis: 567,
  totalMusic: 8901,
  activeModels: 3,
  avgAccuracy: 94.2,
  todayUsers: 234
})

// 快捷操作
const quickActions = [
  {
    title: '用户管理',
    description: '管理系统用户和权限',
    icon: 'User',
    color: 'blue',
    path: '/admin/userManage',
    bgClass: 'bg-blue-50 hover:bg-blue-100',
    iconClass: 'text-blue-500',
    titleClass: 'text-blue-900',
    descClass: 'text-blue-600'
  },
  {
    title: '音乐管理',
    description: '上传和管理音乐文件',
    icon: 'Headphone',
    color: 'green',
    path: '/admin/music',
    bgClass: 'bg-green-50 hover:bg-green-100',
    iconClass: 'text-green-500',
    titleClass: 'text-green-900',
    descClass: 'text-green-600'
  },
  {
    title: '情感模型',
    description: '管理AI模型和训练',
    icon: 'Connection',
    color: 'purple',
    path: '/admin/model',
    bgClass: 'bg-purple-50 hover:bg-purple-100',
    iconClass: 'text-purple-500',
    titleClass: 'text-purple-900',
    descClass: 'text-purple-600'
  },
  {
    title: '数据分析',
    description: '查看分析报告和统计',
    icon: 'TrendCharts',
    color: 'orange',
    path: '/admin/analytics',
    bgClass: 'bg-orange-50 hover:bg-orange-100',
    iconClass: 'text-orange-500',
    titleClass: 'text-orange-900',
    descClass: 'text-orange-600'
  },
  {
    title: '系统设置',
    description: '配置系统参数',
    icon: 'Setting',
    color: 'gray',
    path: '/admin/settings',
    bgClass: 'bg-gray-50 hover:bg-gray-100',
    iconClass: 'text-gray-500',
    titleClass: 'text-gray-900',
    descClass: 'text-gray-600'
  }
]

// 跳转到指定页面
function navigateTo(path: string) {
  router.push(path)
}

// 刷新数据
function refreshData() {
  loading.value = true

  setTimeout(() => {
    // 模拟数据更新
    stats.todayAnalysis = Math.floor(Math.random() * 1000) + 400
    stats.todayUsers = Math.floor(Math.random() * 300) + 150
    loading.value = false
  }, 1000)
}

// 初始化情感分布图表
function initEmotionChart() {
  if (!emotionChartRef.value) return

  const chart = echarts.init(emotionChartRef.value)
  const option = {
    title: {
      text: '今日情感分析分布',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [
      {
        name: '情感分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '60%'],
        data: [
          { value: 156, name: '快乐', itemStyle: { color: '#67C23A' } },
          { value: 123, name: '悲伤', itemStyle: { color: '#409EFF' } },
          { value: 89, name: '平静', itemStyle: { color: '#909399' } },
          { value: 67, name: '愤怒', itemStyle: { color: '#F56C6C' } },
          { value: 45, name: '惊讶', itemStyle: { color: '#E6A23C' } },
          { value: 87, name: '其他', itemStyle: { color: '#9C27B0' } }
        ]
      }
    ]
  }
  chart.setOption(option)
}

// 初始化趋势图表
function initTrendChart() {
  if (!trendChartRef.value) return

  const chart = echarts.init(trendChartRef.value)
  const option = {
    title: {
      text: '近7天分析趋势',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value',
      name: '分析次数'
    },
    series: [
      {
        name: '分析次数',
        type: 'line',
        smooth: true,
        data: [320, 432, 301, 534, 590, 530, 620],
        itemStyle: {
          color: '#409EFF'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
              { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
            ]
          }
        }
      }
    ]
  }
  chart.setOption(option)
}

onMounted(() => {
  setTimeout(() => {
    initEmotionChart()
    initTrendChart()
  }, 100)
})
</script>

<template>
  <div class="dashboard">
    <!-- 音乐情感分析系统仪表板 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.3 } as any">
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <span class="text-lg font-medium">音乐情感分析系统</span>
              <p class="text-sm text-gray-500 mt-1">实时监控系统运行状态和分析数据</p>
            </div>
            <Motion :initial="{ scale: 0.8, opacity: 0 }" :animate="{ scale: 1, opacity: 1 }"
              :whileHover="{ scale: 1.05 }" :transition="{ duration: 0.3, delay: 0.5 }">
              <el-button type="primary" size="small" @click="refreshData" :loading="loading">
                <el-icon>
                  <Refresh />
                </el-icon>
                刷新数据
              </el-button>
            </Motion>
          </div>
        </template>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.4 } as any"
            class="bg-blue-50 p-6 rounded-lg cursor-pointer" @click="navigateTo('/admin/userManage')">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-600 text-sm font-medium">总用户数</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.6 }">
                  <p class="text-2xl font-bold text-blue-900">{{ stats.totalUsers.toLocaleString() }}</p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.5 } as any" class="text-blue-500">
                <el-icon size="32">
                  <User />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.5 } as any"
            class="bg-green-50 p-6 rounded-lg cursor-pointer" @click="navigateTo('/admin/analytics')">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-600 text-sm font-medium">今日分析</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.7 }">
                  <p class="text-2xl font-bold text-green-900">{{ stats.todayAnalysis.toLocaleString() }}</p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.6 } as any" class="text-green-500">
                <el-icon size="32">
                  <Headphone />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.6 } as any"
            class="bg-yellow-50 p-6 rounded-lg cursor-pointer" @click="navigateTo('/admin/music')">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-yellow-600 text-sm font-medium">音乐库</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.8 }">
                  <p class="text-2xl font-bold text-yellow-900">{{ stats.totalMusic.toLocaleString() }}</p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.7 } as any" class="text-yellow-500">
                <el-icon size="32">
                  <VideoPlay />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.7 } as any"
            class="bg-purple-50 p-6 rounded-lg cursor-pointer" @click="navigateTo('/admin/model')">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-600 text-sm font-medium">AI模型</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.9 }">
                  <p class="text-2xl font-bold text-purple-900">{{ stats.activeModels }}</p>
                </Motion>
                <p class="text-xs text-purple-500 mt-1">准确率 {{ stats.avgAccuracy }}%</p>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.8 } as any" class="text-purple-500">
                <el-icon size="32">
                  <Connection />
                </el-icon>
              </Motion>
            </div>
          </Motion>

        </div>
      </el-card>
    </Motion>

    <!-- 快捷操作区域 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.8 } as any">
      <el-card class="mb-6">
        <template #header>
          <span class="text-lg font-medium">快捷操作</span>
        </template>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div v-for="(action, index) in quickActions" :key="action.title"
            class="p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md" :class="action.bgClass"
            @click="navigateTo(action.path)">
            <div class="flex flex-col items-center text-center">
              <el-icon size="24" :class="action.iconClass" class="mb-2">
                <component :is="action.icon" />
              </el-icon>
              <h3 class="text-sm font-medium mb-1" :class="action.titleClass">{{ action.title }}</h3>
              <p class="text-xs" :class="action.descClass">{{ action.description }}</p>
            </div>
          </div>
        </div>
      </el-card>
    </Motion>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 情感分布图 -->
      <Motion :initial="cardVariants.initial" :animate="cardVariants.animate"
        :whileHover="cardVariants.whileHover as any" :transition="{ ...cardVariants.transition, delay: 0.9 } as any">
        <el-card>
          <template #header>
            <span class="text-lg font-medium">情感分布</span>
          </template>
          <div ref="emotionChartRef" class="h-64"></div>
        </el-card>
      </Motion>

      <!-- 分析趋势图 -->
      <Motion :initial="cardVariants.initial" :animate="cardVariants.animate"
        :whileHover="cardVariants.whileHover as any" :transition="{ ...cardVariants.transition, delay: 1.0 } as any">
        <el-card>
          <template #header>
            <span class="text-lg font-medium">分析趋势</span>
          </template>
          <div ref="trendChartRef" class="h-64"></div>
        </el-card>
      </Motion>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  width: 100%;
}

/* 统计卡片增强样式 */
.cursor-pointer {
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.cursor-pointer:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* 响应式动画优化 */
@media (prefers-reduced-motion: reduce) {
  .cursor-pointer {
    transition: none;
  }
}

/* 增强卡片视觉效果 */
.el-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.el-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}
</style>