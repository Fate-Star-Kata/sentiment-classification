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
              <p class="text-sm text-gray-500">平均准确率</p>
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
        
        <div class="flex justify-end mt-4">
          <button 
            @click="applyFilters"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            应用筛选
          </button>
        </div>
      </div>

      <!-- 历史记录列表 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">语音分析记录</h3>
        </div>
        
        <div class="divide-y divide-gray-200">
          <div 
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
                      {{ record.createdAt }}
                    </span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2m-1 4H8m8 0v8m-8-8v8"></path>
                      </svg>
                      {{ record.duration }}
                    </span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {{ record.fileSize }}
                    </span>
                  </div>
                  
                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <span class="flex items-center">
                      <span class="w-2 h-2 rounded-full mr-2" :class="getEmotionDotClass(record.emotion)"></span>
                      主要情感: {{ getEmotionName(record.emotion) }}
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
                    {{ getEmotionName(record.emotion) }}
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
import { ref, computed, onMounted } from 'vue'

// 统计数据
const stats = ref({
  totalAnalysis: 127,
  monthlyAnalysis: 45,
  totalDuration: '8.5h',
  avgAccuracy: 92
})

// 筛选条件
const filters = ref({
  startDate: '2025-07-17',
  endDate: '2025-08-18',
  emotionType: '',
  confidence: ''
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const totalRecords = ref(127)

// 历史记录数据
const records = ref([
  {
    id: 127,
    emotion: 'happy',
    confidence: 85.6,
    createdAt: '2024-01-15 14:25',
    duration: '15.3秒',
    fileSize: '2.1MB',
    language: '良好'
  },
  {
    id: 126,
    emotion: 'neutral',
    confidence: 72.3,
    createdAt: '2024-01-15 11:42',
    duration: '8.7秒',
    fileSize: '1.3MB',
    language: '一般'
  },
  {
    id: 125,
    emotion: 'sad',
    confidence: 91.2,
    createdAt: '2024-01-14 16:18',
    duration: '22.1秒',
    fileSize: '3.2MB',
    language: '优秀'
  },
  {
    id: 124,
    emotion: 'angry',
    confidence: 78.9,
    createdAt: '2024-01-14 09:33',
    duration: '12.5秒',
    fileSize: '1.8MB',
    language: '良好'
  },
  {
    id: 123,
    emotion: 'happy',
    confidence: 88.4,
    createdAt: '2024-01-13 15:22',
    duration: '18.7秒',
    fileSize: '2.7MB',
    language: '优秀'
  }
])

// 计算属性
const filteredRecords = computed(() => {
  return records.value
})

const totalPages = computed(() => {
  return Math.ceil(totalRecords.value / pageSize.value)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// 方法
const getEmotionIcon = (emotion: string) => {
  const icons = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    neutral: '😐',
    fear: '😨'
  }
  return icons[emotion as keyof typeof icons] || '😐'
}

const getEmotionName = (emotion: string) => {
  const names = {
    happy: '快乐',
    sad: '悲伤',
    angry: '愤怒',
    neutral: '中性',
    fear: '恐惧'
  }
  return names[emotion as keyof typeof names] || '未知'
}

const getEmotionBgClass = (emotion: string) => {
  const classes = {
    happy: 'bg-yellow-100',
    sad: 'bg-blue-100',
    angry: 'bg-red-100',
    neutral: 'bg-gray-100',
    fear: 'bg-purple-100'
  }
  return classes[emotion as keyof typeof classes] || 'bg-gray-100'
}

const getEmotionTextClass = (emotion: string) => {
  const classes = {
    happy: 'text-yellow-600',
    sad: 'text-blue-600',
    angry: 'text-red-600',
    neutral: 'text-gray-600',
    fear: 'text-purple-600'
  }
  return classes[emotion as keyof typeof classes] || 'text-gray-600'
}

const getEmotionDotClass = (emotion: string) => {
  const classes = {
    happy: 'bg-yellow-500',
    sad: 'bg-blue-500',
    angry: 'bg-red-500',
    neutral: 'bg-gray-500',
    fear: 'bg-purple-500'
  }
  return classes[emotion as keyof typeof classes] || 'bg-gray-500'
}

const getEmotionProgressClass = (emotion: string) => {
  const classes = {
    happy: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
    sad: 'bg-gradient-to-r from-blue-400 to-blue-600',
    angry: 'bg-gradient-to-r from-red-400 to-red-600',
    neutral: 'bg-gradient-to-r from-gray-400 to-gray-600',
    fear: 'bg-gradient-to-r from-purple-400 to-purple-600'
  }
  return classes[emotion as keyof typeof classes] || 'bg-gradient-to-r from-gray-400 to-gray-600'
}

const applyFilters = () => {
  // 应用筛选逻辑
  console.log('应用筛选条件:', filters.value)
}

const viewDetails = (id: number) => {
  // 查看详情逻辑
  console.log('查看详情:', id)
}

const downloadReport = (id: number) => {
  // 下载报告逻辑
  console.log('下载报告:', id)
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
}

onMounted(() => {
  // 初始化数据
})
</script>

<style scoped lang="scss">
// 自定义样式可以在这里添加
</style>
