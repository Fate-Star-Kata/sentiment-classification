<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">分析历史</h1>
        <p class="text-gray-600">查看您的音乐情感分析历史记录</p>
      </div>

      <!-- 统计概览 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div>
              <p class="text-3xl font-bold text-blue-600">{{ stats.totalAnalysis }}</p>
              <p class="text-sm text-gray-500">总分析次数</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <p class="text-3xl font-bold text-green-600">{{ stats.monthlyAnalysis }}</p>
              <p class="text-sm text-gray-500">本月分析</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p class="text-3xl font-bold text-purple-600">{{ stats.totalDuration }}</p>
              <p class="text-sm text-gray-500">总时长</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p class="text-3xl font-bold text-orange-600">{{ stats.avgAccuracy }}%</p>
              <p class="text-sm text-gray-500">平均准确率（本页）</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 筛选条件 -->
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
        <div class="flex items-center mb-4">
          <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path>
          </svg>
          <h3 class="text-lg font-semibold text-gray-900">筛选条件</h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">开始日期</label>
            <input 
              type="date" 
              v-model="filters.startDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">结束日期</label>
            <input 
              type="date" 
              v-model="filters.endDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">情感类型</label>
            <select 
              v-model="filters.emotionType"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">全部情感</option>
              <option value="happy">快乐</option>
              <option value="sad">悲伤</option>
              <option value="angry">愤怒</option>
              <option value="neutral">中性</option>
              <option value="fear">恐惧</option>
              <option value="surprise">惊讶</option>
              <option value="disgust">厌恶</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">置信度</label>
            <select 
              v-model="filters.confidence"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">全部</option>
              <option value="high">高 (>80%)</option>
              <option value="medium">中 (60-80%)</option>
              <option value="low">低 (<60%)</option>
            </select>
          </div>
        </div>
        
        <div class="flex justify-end mt-4 space-x-3">
          <button 
            @click="resetFilters"
            class="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            重置
          </button>
          <button 
            @click="applyFilters"
            :disabled="loading"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              筛选中...
            </span>
            <span v-else>应用筛选</span>
          </button>
        </div>
      </div>

      <!-- 历史记录列表 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">语音分析记录</h3>
        </div>
        
        <div class="divide-y divide-gray-200">
          <!-- 加载状态 -->
          <div v-if="loading" class="p-6 text-center">
            <div class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-gray-600">加载中...</span>
            </div>
          </div>
          
          <!-- 空状态 -->
          <div v-else-if="filteredRecords.length === 0" class="p-12 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">暂无分析记录</h3>
            <p class="mt-1 text-sm text-gray-500">没有找到符合筛选条件的分析记录</p>
            <div class="mt-6">
              <button 
                @click="resetFilters"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                重置筛选条件
              </button>
            </div>
          </div>
          
          <!-- 记录列表 -->
          <div 
            v-else
            v-for="record in filteredRecords" 
            :key="record.id"
            class="p-6 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <!-- 情感图标 -->
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                       :class="getEmotionBgClass(record.emotion)">
                    {{ getEmotionIcon(record.emotion) }}
                  </div>
                </div>
                
                <!-- 分析信息 -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2 mb-1">
                    <h4 class="text-lg font-medium text-gray-900">语音分析 #{{ record.id }}</h4>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {{ formatDate(record.createdAt) }}
                    </span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2m-1 4H8m8 0v8m-8-8v8"></path>
                      </svg>
                      {{ record.fileName }}
                    </span>
                    <span v-if="record.isFavorite" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                      ★ 已收藏
                    </span>
                  </div>
                  
                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <span class="flex items-center">
                      <span class="w-2 h-2 rounded-full mr-2" :class="getEmotionDotClass(record.emotion)"></span>
                      主要情感: {{ record.emotionDisplay }}
                    </span>
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      置信度: {{ record.confidence }}%
                    </span>
                  </div>
                  
                  <!-- 进度条 -->
                  <div class="mt-3">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        class="h-2 rounded-full transition-all duration-300"
                        :class="getEmotionProgressClass(record.emotion)"
                        :style="{ width: record.confidence + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 操作按钮 -->
              <div class="flex items-center space-x-2">
                <div class="text-right mr-4">
                  <div class="text-lg font-semibold" :class="getEmotionTextClass(record.emotion)">
                    {{ record.emotionDisplay }}
                  </div>
                  <div class="text-sm font-medium" :class="getEmotionTextClass(record.emotion)">
                    {{ record.confidence }}%
                  </div>
                </div>
                
                <button 
                  @click="viewDetails(record.id)"
                  class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  查看详情
                </button>
                <button 
                  @click="downloadReport(record.id)"
                  class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  下载报告
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分页 -->
        <div class="px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-500">
              显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalRecords) }} 条，共 {{ totalRecords }} 条记录
            </div>
            <div class="flex items-center space-x-2">
              <button 
                @click="previousPage"
                :disabled="currentPage === 1"
                class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                « 上一页
              </button>
              
              <button 
                v-for="page in visiblePages" 
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-1 text-sm border rounded-md',
                  page === currentPage 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'border-gray-300 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              
              <button 
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页 »
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getClientHistory } from '@/api/user/client'
import type { ClientHistoryRequest, ClientHistoryResponse, History } from '@/types/apis/client_T'

// 统计数据
const stats = ref({
  totalAnalysis: 0,
  monthlyAnalysis: 0,
  totalDuration: '-', // 后端历史记录未提供时长字段，保留占位
  avgAccuracy: 0,
})

// 筛选条件
const filters = ref({
  startDate: '',
  endDate: '',
  emotionType: '',
  confidence: '',
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const totalRecords = ref(0)
const totalPages = ref(1)

// 历史记录数据（UI 映射）
interface UIRecord {
  id: number
  emotion: string
  emotionDisplay: string
  confidence: number // 0-100 百分比
  createdAt: Date
  fileName: string
  isFavorite: boolean
}

const records = ref<UIRecord[]>([])

const router = useRouter()

// 计算属性
const filteredRecords = computed(() => {
  let filtered = records.value
  
  // 置信度本地筛选（仅对当前页生效）
  if (filters.value.confidence) {
    const [min, max] =
      filters.value.confidence === 'high'
        ? [80, 100]
        : filters.value.confidence === 'medium'
        ? [60, 80]
        : [0, 60]
    filtered = filtered.filter((r) => r.confidence >= min && (filters.value.confidence === 'high' ? r.confidence <= max : r.confidence < max))
  }
  
  return filtered
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

// 工具方法
const formatDate = (d: Date | string) => {
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleString('zh-CN', { hour12: false })
}

const getEmotionIcon = (emotion: string) => {
  const icons: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    neutral: '😐',
    fear: '😨',
    surprise: '😲',
    disgust: '🤢',
  }
  return icons[emotion] || '😐'
}

const getEmotionBgClass = (emotion: string) => {
  const classes: Record<string, string> = {
    happy: 'bg-yellow-100',
    sad: 'bg-blue-100',
    angry: 'bg-red-100',
    neutral: 'bg-gray-100',
    fear: 'bg-purple-100',
    surprise: 'bg-pink-100',
    disgust: 'bg-green-100',
  }
  return classes[emotion] || 'bg-gray-100'
}

const getEmotionTextClass = (emotion: string) => {
  const classes: Record<string, string> = {
    happy: 'text-yellow-600',
    sad: 'text-blue-600',
    angry: 'text-red-600',
    neutral: 'text-gray-600',
    fear: 'text-purple-600',
    surprise: 'text-pink-600',
    disgust: 'text-green-600',
  }
  return classes[emotion] || 'text-gray-600'
}

const getEmotionDotClass = (emotion: string) => {
  const classes: Record<string, string> = {
    happy: 'bg-yellow-500',
    sad: 'bg-blue-500',
    angry: 'bg-red-500',
    neutral: 'bg-gray-500',
    fear: 'bg-purple-500',
    surprise: 'bg-pink-500',
    disgust: 'bg-green-500',
  }
  return classes[emotion] || 'bg-gray-500'
}

const getEmotionProgressClass = (emotion: string) => {
  const classes: Record<string, string> = {
    happy: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
    sad: 'bg-gradient-to-r from-blue-400 to-blue-600',
    angry: 'bg-gradient-to-r from-red-400 to-red-600',
    neutral: 'bg-gradient-to-r from-gray-400 to-gray-600',
    fear: 'bg-gradient-to-r from-purple-400 to-purple-600',
    surprise: 'bg-gradient-to-r from-pink-400 to-pink-600',
    disgust: 'bg-gradient-to-r from-green-400 to-green-600',
  }
  return classes[emotion] || 'bg-gradient-to-r from-gray-400 to-gray-600'
}

// 数据加载
const loading = ref(false)

const toPercent = (v: number) => (v <= 1 ? Math.round(v * 10000) / 100 : Math.round(v * 100) / 100)

const loadHistories = async () => {
  loading.value = true
  try {
    const params: ClientHistoryRequest = {
      page: currentPage.value,
      page_size: pageSize.value,
      start_date: filters.value.startDate || undefined,
      end_date: filters.value.endDate || undefined,
      // emotionType 可能包含 fear/surprise/disgust，后端若支持将自动识别
      emotion: (filters.value.emotionType || undefined) as any,
    }
    const res: ClientHistoryResponse = await getClientHistory(params)
    if (res.code !== 200) throw new Error(res.msg)

    const { histories, pagination } = res.data

    // 填充分页
    totalRecords.value = pagination.total_count
    totalPages.value = pagination.total_pages
    pageSize.value = pagination.page_size

    // UI 映射
    records.value = histories.map((h: History): UIRecord => ({
      id: h.id,
      emotion: h.primary_emotion,
      emotionDisplay: h.primary_emotion_display,
      confidence: toPercent(h.confidence_score),
      createdAt: new Date(h.created_time),
      fileName: h.audio_file_name,
      isFavorite: h.is_favorite,
    }))

    // 统计 - 总数
    stats.value.totalAnalysis = pagination.total_count

    // 统计 - 平均准确率（本页）
    const avg = records.value.reduce((acc, r) => acc + (r.confidence || 0), 0) / (records.value.length || 1)
    stats.value.avgAccuracy = Math.round(avg * 100) / 100

    // 统计 - 本月分析总数（单独请求，仅取分页计数）
    await loadMonthlyCount()
  } catch (error: any) {
    console.error(error)
    ElMessage.error(error?.message || '获取历史记录失败')
  } finally {
    loading.value = false
  }
}

const loadMonthlyCount = async () => {
  try {
    const now = new Date()
    const first = new Date(now.getFullYear(), now.getMonth(), 1)
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const fmt = (d: Date) => d.toISOString().slice(0, 10)

    const res = await getClientHistory({
      page: 1,
      page_size: 1, // 最小化数据量，只取分页计数
      start_date: fmt(first),
      end_date: fmt(last),
    } as ClientHistoryRequest)

    if (res.code === 200) {
      stats.value.monthlyAnalysis = res.data.pagination.total_count
    }
  } catch (e) {
    // 忽略月统计错误
  }
}

// 交互
const applyFilters = () => {
  currentPage.value = 1
  loadHistories()
}

const resetFilters = () => {
  filters.value = {
    startDate: '',
    endDate: '',
    emotionType: '',
    confidence: '',
  }
  currentPage.value = 1
  loadHistories()
}

const viewDetails = (id: number) => {
  router.push({ path: '/emotion_result', query: { id: String(id) } })
}

const downloadReport = (id: number) => {
  ElMessage.info(`报告导出开发中（ID: ${id}）`)
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadHistories()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadHistories()
  }
}

const goToPage = (page: number) => {
  if (page !== currentPage.value) {
    currentPage.value = page
    loadHistories()
  }
}

onMounted(() => {
  loadHistories()
})

watch(pageSize, () => {
  // 如果有下拉改变每页大小，可触发重载
  currentPage.value = 1
  loadHistories()
})
</script>

<style scoped lang="scss">
// 自定义样式可以在这里添加
</style>
