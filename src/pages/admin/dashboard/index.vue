<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Motion } from 'motion-v'
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  User,
  VideoPlay,
  Connection,
  Refresh,
  Setting,
  TrendCharts
} from '@element-plus/icons-vue'
import { getDashboardStatsAPI, type DashboardStats, type RecentActivity } from '@/api/admin/dashboard'

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

// 情感分布类型
interface EmotionDistribution {
  happy: number
  sad: number
  angry: number
  neutral: number
  fear: number
  surprise: number
  disgust: number
}

// 统计数据类型
interface StatsData {
  totalUsers: number
  todayAnalysis: number
  totalMusic: number
  activeModels: number
  avgAccuracy: number
  todayUsers: number
  storageUsed: string
  thisMonthAnalyses: number
  emotionDistribution: EmotionDistribution
  recentActivities: RecentActivity[]
}

// 统计数据
const stats = reactive<StatsData>({
  totalUsers: 0,
  todayAnalysis: 0,
  totalMusic: 0,
  activeModels: 3,
  avgAccuracy: 94.2,
  todayUsers: 0,
  storageUsed: '0 GB',
  thisMonthAnalyses: 0,
  emotionDistribution: {
    happy: 0,
    sad: 0,
    angry: 0,
    neutral: 0,
    fear: 0,
    surprise: 0,
    disgust: 0
  },
  recentActivities: []
})

// 快捷操作类型
interface QuickAction {
  title: string
  description: string
  icon: string
  color: string
  path: string
  bgClass: string
  iconClass: string
  titleClass: string
  descClass: string
}

// 快捷操作
const quickActions: QuickAction[] = [
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
    icon: 'Headset',
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

// 获取仪表板数据
async function fetchDashboardData() {
  try {
    loading.value = true
    const response = await getDashboardStatsAPI()

    if (response.data) {
      const data = response.data

      // 用户统计数据
      stats.totalUsers = data.user_stats?.total_users || 0
      stats.todayUsers = data.user_stats?.active_users || 0

      // 音频文件统计
      stats.totalMusic = data.audio_stats?.total_files || 0

      // 分析统计数据
      stats.todayAnalysis = data.analysis_stats?.analyses_today || 0
      stats.thisMonthAnalyses = data.analysis_stats?.analyses_week || 0

      // 情感分布数据转换
      if (data.emotion_distribution && Array.isArray(data.emotion_distribution)) {
        const emotionMap: Record<string, number> = {}
        data.emotion_distribution.forEach((item) => {
          emotionMap[item.primary_emotion] = item.count
        })

        stats.emotionDistribution = {
          happy: emotionMap.happy || 0,
          sad: emotionMap.sad || 0,
          angry: emotionMap.angry || 0,
          neutral: emotionMap.neutral || 0,
          fear: emotionMap.fear || 0,
          surprise: emotionMap.surprise || 0,
          disgust: emotionMap.disgust || 0
        }
      }

      // 最近活动数据
      stats.recentActivities = data.recent_activities || []

      // 更新图表数据
      updateCharts()
    }
  } catch (error) {
    console.error('获取仪表板数据失败:', error)
    ElMessage.error('获取仪表板数据失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// 刷新数据
function refreshData() {
  fetchDashboardData()
}

// 初始化情感分布图表
function initEmotionChart() {
  if (!emotionChartRef.value) return

  const chart = echarts.init(emotionChartRef.value)
  updateEmotionChart(chart)
}

// 更新情感分布图表
function updateEmotionChart(chart?: any) {
  if (!chart && !emotionChartRef.value) return

  const chartInstance = chart || (emotionChartRef.value ? echarts.getInstanceByDom(emotionChartRef.value) : null)
  if (!chartInstance) return

  const option = {
    title: {
      text: '情感分析分布',
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
          { value: stats.emotionDistribution.happy, name: '快乐', itemStyle: { color: '#67C23A' } },
          { value: stats.emotionDistribution.sad, name: '悲伤', itemStyle: { color: '#409EFF' } },
          { value: stats.emotionDistribution.neutral, name: '平静', itemStyle: { color: '#909399' } },
          { value: stats.emotionDistribution.angry, name: '愤怒', itemStyle: { color: '#F56C6C' } },
          { value: stats.emotionDistribution.fear, name: '恐惧', itemStyle: { color: '#E6A23C' } },
          { value: stats.emotionDistribution.surprise, name: '惊讶', itemStyle: { color: '#F78989' } },
          { value: stats.emotionDistribution.disgust, name: '厌恶', itemStyle: { color: '#B88230' } }
        ]
      }
    ]
  }
  chartInstance.setOption(option)
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

// 更新所有图表
function updateCharts() {
  setTimeout(() => {
    updateEmotionChart()
    updateTrendChart()
  }, 100)
}

// 更新趋势图表
function updateTrendChart(chart?: any) {
  if (!chart && !trendChartRef.value) return

  const chartInstance = chart || (trendChartRef.value ? echarts.getInstanceByDom(trendChartRef.value) : null)
  if (!chartInstance) return

  // 这里可以根据实际数据更新趋势图
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
        data: [320, 432, 301, 534, 590, 530, stats.todayAnalysis],
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
  chartInstance.setOption(option)
}

// 获取情感标签
function getEmotionLabel(emotion: string): string {
  const emotionLabels: Record<string, string> = {
    'happy': '快乐',
    'sad': '悲伤',
    'angry': '愤怒',
    'neutral': '平静',
    'fear': '恐惧',
    'surprise': '惊讶',
    'disgust': '厌恶'
  }
  return emotionLabels[emotion] || emotion
}

// 获取情感样式类
function getEmotionClass(emotion: string): string {
  const emotionClasses: Record<string, string> = {
    'happy': 'bg-green-100 text-green-800',
    'sad': 'bg-blue-100 text-blue-800',
    'angry': 'bg-red-100 text-red-800',
    'neutral': 'bg-gray-100 text-gray-800',
    'fear': 'bg-yellow-100 text-yellow-800',
    'surprise': 'bg-purple-100 text-purple-800',
    'disgust': 'bg-orange-100 text-orange-800'
  }
  return emotionClasses[emotion] || 'bg-gray-100 text-gray-800'
}

// 格式化时间
function formatTime(timeStr: string): string {
  try {
    const date = new Date(timeStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`

    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return timeStr
  }
}

onMounted(() => {
  setTimeout(() => {
    initEmotionChart()
    initTrendChart()
    fetchDashboardData()
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
                  <VideoPlay />
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

    <!-- 图表和活动区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

      <!-- 最近活动 -->
      <Motion :initial="cardVariants.initial" :animate="cardVariants.animate"
        :whileHover="cardVariants.whileHover as any" :transition="{ ...cardVariants.transition, delay: 1.1 } as any">
        <el-card>
          <template #header>
            <span class="text-lg font-medium">最近活动</span>
          </template>
          <div class="h-64 overflow-y-auto">
            <div v-if="stats.recentActivities.length === 0"
              class="flex items-center justify-center h-full text-gray-500">
              暂无活动记录
            </div>
            <div v-else class="space-y-3">
              <div v-for="activity in stats.recentActivities.slice(0, 8)" :key="activity.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-gray-900">{{ activity.user }}</span>
                    <span class="px-2 py-1 text-xs rounded-full" :class="getEmotionClass(activity.emotion)">{{
                      getEmotionLabel(activity.emotion) }}</span>
                  </div>
                  <p class="text-xs text-gray-600 mt-1 truncate">{{ activity.audio_file }}</p>
                  <p class="text-xs text-gray-400">{{ formatTime(activity.created_at) }}</p>
                </div>
              </div>
            </div>
          </div>
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