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
      <div>
        <h3 class="text-base font-semibold text-gray-700 mb-4 m-0">最常检测的情感</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="bg-amber-50/60 border border-amber-500/30 rounded-md p-3 flex items-center gap-2.5 transition-all duration-200 hover:bg-amber-50/80 hover:border-amber-500/50" v-for="emotion in emotionStats" :key="emotion.type">
            <div class="text-2xl">{{ emotion.icon }}</div>
            <div>
              <div class="text-sm font-semibold text-amber-800 mb-0.5">{{ emotion.type }}</div>
              <div class="text-xs text-amber-700">({{ emotion.percentage }}%)</div>
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
import type { UserDetailInfo } from '@/types/factory'

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
  totalAnalysis: 127,
  monthlyAnalysis: 45,
  totalDuration: '8.5h',
  accuracy: 92
})

// 情感统计数据
const emotionStats = reactive([
  {
    type: '快乐',
    icon: '😊',
    percentage: 42
  },
  {
    type: '中性',
    icon: '😐',
    percentage: 28
  },
  {
    type: '悲伤',
    icon: '😢',
    percentage: 18
  },
  {
    type: '愤怒',
    icon: '😠',
    percentage: 12
  }
])

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

// 组件挂载时获取用户信息
onMounted(() => {
  fetchUserInfo()
})
</script>
