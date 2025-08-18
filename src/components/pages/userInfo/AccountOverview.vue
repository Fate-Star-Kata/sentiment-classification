<template>
  <div class="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 h-full">
    <!-- 用户信息卡片 -->
    <div class="bg-white/70 rounded-lg p-5 border border-gray-200/30 h-fit backdrop-blur-[10px]">
      <div class="flex justify-center mb-5">
        <div class="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-[32px] text-white">
          <i class="not-italic">👤</i>
        </div>
      </div>
      <div class="text-center mb-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-1">{{ userInfo.username || '张三' }}</h3>
        <p class="text-gray-500 text-sm m-0">普通用户</p>
      </div>
      <div class="space-y-1">
        <div class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-500/5 hover:text-blue-500 group" @click="switchTab('baseInfo')">
          <i class="text-base w-5 not-italic group-hover:text-blue-500">👤</i>
          <span class="text-sm text-gray-700 font-medium group-hover:text-blue-500">个人信息</span>
        </div>
        <div class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-500/5 hover:text-blue-500 group" @click="switchTab('changePassword')">
          <i class="text-base w-5 not-italic group-hover:text-blue-500">🔒</i>
          <span class="text-sm text-gray-700 font-medium group-hover:text-blue-500">安全设置</span>
        </div>
        <div class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-500/5 hover:text-blue-500 group">
          <i class="text-base w-5 not-italic group-hover:text-blue-500">💾</i>
          <span class="text-sm text-gray-700 font-medium group-hover:text-blue-500">数据偏好</span>
        </div>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="bg-white/70 rounded-lg p-5 border border-gray-200/30 backdrop-blur-[10px]">
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-800 m-0">📊 账户概览</h2>
      </div>
      
      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-slate-50/80 border border-slate-200/50 rounded-md p-4 text-center transition-all duration-200 hover:bg-slate-50/90 hover:border-blue-500/30">
          <div class="text-[28px] font-bold text-blue-800 mb-1">{{ stats.totalAnalysis }}</div>
          <div class="text-sm text-slate-600 font-medium">总分析次数</div>
        </div>
        <div class="bg-slate-50/80 border border-slate-200/50 rounded-md p-4 text-center transition-all duration-200 hover:bg-slate-50/90 hover:border-blue-500/30">
          <div class="text-[28px] font-bold text-blue-800 mb-1">{{ stats.monthlyAnalysis }}</div>
          <div class="text-sm text-slate-600 font-medium">本月分析</div>
        </div>
        <div class="bg-slate-50/80 border border-slate-200/50 rounded-md p-4 text-center transition-all duration-200 hover:bg-slate-50/90 hover:border-blue-500/30">
          <div class="text-[28px] font-bold text-blue-800 mb-1">{{ stats.totalDuration }}</div>
          <div class="text-sm text-slate-600 font-medium">总分析时长</div>
        </div>
        <div class="bg-slate-50/80 border border-slate-200/50 rounded-md p-4 text-center transition-all duration-200 hover:bg-slate-50/90 hover:border-blue-500/30">
          <div class="text-[28px] font-bold text-blue-800 mb-1">{{ stats.accuracy }}%</div>
          <div class="text-sm text-slate-600 font-medium">平均准确率</div>
        </div>
      </div>

      <!-- 情感分析统计 -->
      <div class="mb-8">
        <h3 class="text-base font-semibold text-gray-700 mb-4 m-0">情感分布统计</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="bg-amber-50/60 border border-amber-500/30 rounded-md p-3 flex items-center gap-2.5 transition-all duration-200 hover:bg-amber-50/80 hover:border-amber-500/50" v-for="emotion in emotionStats" :key="emotion.type">
            <div class="text-2xl">{{ emotion.icon }}</div>
            <div>
              <div class="text-sm font-semibold text-amber-800 mb-0.5">{{ emotion.type }}</div>
              <div class="text-xs text-amber-700">{{ emotion.count }}次 ({{ emotion.percentage }}%)</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近分析记录 -->
      <div v-if="recentRecords.length > 0">
        <h3 class="text-base font-semibold text-gray-700 mb-4 m-0">最近分析记录</h3>
        <div class="max-h-[240px] overflow-y-auto space-y-3 pr-2">
          <div class="bg-slate-50/60 border border-slate-200/50 rounded-md p-4 flex items-center justify-between transition-all duration-200 hover:bg-slate-50/80 hover:border-blue-500/30" v-for="record in recentRecords" :key="record.id">
            <div class="flex items-center gap-3">
              <div class="text-2xl">{{ getEmotionIcon(record.emotion) }}</div>
              <div>
                <div class="text-sm font-semibold text-gray-800 mb-1">{{ record.filename }}</div>
                <div class="text-xs text-gray-600">{{ formatDate(record.created_at) }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium text-gray-700">{{ record.emotion }}</div>
              <div class="text-xs text-gray-500">置信度: {{ Math.round(record.confidence * 100) }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getUserDetailInfo } from '@/api/user/userinfo'
import { getClientDashboard } from '@/api/user/client'
import type { UserDetailInfo } from '@/types/factory'
import type { ClientDashboardResponse } from '@/types/apis/client_T'

// 定义组件名称
defineOptions({
  name: 'AccountOverview'
})

// Props
interface Props {
  activeTab?: string
}

const props = withDefaults(defineProps<Props>(), {
  activeTab: 'overview'
})

// Emits
const emit = defineEmits<{
  'update:activeTab': [value: string]
}>()

// 切换tab的方法
const switchTab = (tabKey: string) => {
  emit('update:activeTab', tabKey)
}

// 响应式数据
const userInfo = ref<UserDetailInfo>({
  id: 0,
  username: '',
  email: ''
})

// 统计数据
const stats = reactive({
  totalAnalysis: 0,
  monthlyAnalysis: 0,
  totalDuration: '0h',
  accuracy: 0
})

// 情感统计数据
const emotionStats = ref<Array<{
  type: string
  icon: string
  count: number
  percentage: number
}>>([])

// 最近分析记录
const recentRecords = ref<Array<{
  id: number
  filename: string
  emotion: string
  confidence: number
  created_at: Date
}>>([])

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const response = await getUserDetailInfo()
    if (response.code === 200 && response.data) {
      userInfo.value = response.data
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 情感图标映射
const emotionIconMap: Record<string, string> = {
  'happy': '😊',
  'sad': '😢',
  'angry': '😠',
  'neutral': '😐',
  'fear': '😨',
  'surprise': '😲',
  'disgust': '🤢'
}

// 获取情感图标
const getEmotionIcon = (emotion: string): string => {
  return emotionIconMap[emotion.toLowerCase()] || '😐'
}

// 格式化日期
const formatDate = (date: Date): string => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取仪表板数据
const fetchDashboardData = async () => {
  try {
    const response = await getClientDashboard()
    console.log("获取用户统计",response)
    if (response.code === 200 && response.data) {
      const { statistics, emotion_distribution, recent_records } = response.data
      
      // 更新统计数据
      stats.totalAnalysis = statistics.total_analyses
      stats.monthlyAnalysis = statistics.recent_analyses
      
      // 计算平均置信度作为准确率
      if (recent_records && recent_records.length > 0) {
        const avgConfidence = recent_records.reduce((sum, record) => sum + record.confidence, 0) / recent_records.length
        stats.accuracy = Math.round(avgConfidence * 100)
      } else {
        stats.accuracy = 0
      }
      
      // 计算情感分布百分比
      const totalCount = emotion_distribution.reduce((sum, item) => sum + item.count, 0)
      emotionStats.value = emotion_distribution.map(item => ({
        type: item.emotion,
        icon: getEmotionIcon(item.emotion),
        count: item.count,
        percentage: totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0
      }))
      
      // 更新最近记录，限制为最多3条
      recentRecords.value = recent_records.slice(0, 3)
    }
  } catch (error) {
    console.error('获取仪表板数据失败:', error)
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchUserInfo()
  fetchDashboardData()
})
</script>
