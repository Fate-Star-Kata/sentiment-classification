<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-5xl mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">分析结果详情</h1>
        <p class="text-gray-600">查看本次语音情感分析的详细信息</p>
      </div>

      <div v-if="loading" class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        加载中...
      </div>

      <div v-else-if="error" class="bg-red-50 p-6 rounded-lg border border-red-200 text-red-700">
        {{ error }}
      </div>

      <div v-else-if="detail" class="space-y-6">
        <!-- 音频文件信息 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">音频文件信息</h2>
            <span class="text-sm text-gray-500">创建时间：{{ formatDate(detail.audio_file_detail.upload_time) }}</span>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-sm text-gray-500 mb-2">文件名</div>
                <div class="text-base text-gray-900 font-medium break-all">{{ detail.audio_file_detail.original_name }}</div>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-sm text-gray-500 mb-2">文件大小</div>
                <div class="text-base text-gray-900 font-medium">{{ (detail.audio_file_detail.file_size_mb ?? 0).toFixed(2) }} MB</div>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-sm text-gray-500 mb-2">音频时长</div>
                <div class="text-base text-gray-900 font-medium">{{ detail.audio_file_detail.duration_formatted }}</div>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-sm text-gray-500 mb-2">采样率</div>
                <div class="text-base text-gray-900 font-medium">48 kHz</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 情感分析结果 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">情感分析结果</h2>
            <div class="text-sm text-gray-500">主要情感：
              <span :class="getEmotionTextClass(detail.emotion_analysis_detail.primary_emotion)" class="font-semibold">
                {{ detail.emotion_analysis_detail.primary_emotion_display }}
              </span>
              <span class="ml-2">置信度：{{ toPercent(detail.emotion_analysis_detail.confidence_percentage) }}%</span>
            </div>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div class="text-sm text-gray-500 mb-2">情感分布</div>
                <div class="space-y-3">
                  <div v-for="(item, idx) in emotionDistribution" :key="idx" class="">
                    <div class="flex items-center justify-between text-sm">
                      <span class="flex items-center">
                        <span class="w-2 h-2 rounded-full mr-2" :class="getEmotionDotClass(item.emotion)"></span>
                        {{ item.emotion_display }}
                      </span>
                      <span class="text-gray-500">{{ toPercent(item.percentage) }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div class="h-2 rounded-full" :class="getEmotionProgressClass(item.emotion)" :style="{ width: toPercent(item.percentage) + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500 mb-2">补充说明</div>
                <ul class="list-disc pl-5 text-gray-700 leading-7">
                  <li>模型版本：{{ detail.emotion_analysis_detail.model_version || 'N/A' }}</li>
                  <li>处理时长：{{ detail.emotion_analysis_detail.processing_time ?? 'N/A' }} ms</li>
                  <li>分析时间：{{ formatDate(detail.emotion_analysis_detail.analysis_time) }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-500">
            分析完成时间：{{ formatDate(detail.emotion_analysis_detail.analysis_time) }}
          </div>
          <div class="flex space-x-3">
            <button @click="goToRecognition" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
              开始新的识别
            </button>
            <button @click="goBack" class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium">
              返回历史列表
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getClientAnalysisDetail } from '@/api/user/client'
import type { ClientAnalysisDetailResponse, ClientAnalysisDetailData } from '@/types/apis/client_T'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const detail = ref<ClientAnalysisDetailData | null>(null)

const toPercent = (v: number) => (v <= 1 ? Math.round(v * 10000) / 100 : Math.round(v * 100) / 100)
const formatDate = (d: Date | string) => {
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleString('zh-CN', { hour12: false })
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

const emotionDistribution = computed(() => {
  if (!detail.value) return []
  const scores = detail.value.emotion_analysis_detail.emotion_scores
  const nameMap: Record<string, string> = {
    happy: '快乐',
    sad: '悲伤',
    angry: '愤怒',
    neutral: '中性',
    fear: '恐惧',
    surprise: '惊讶',
    disgust: '厌恶',
  }
  return Object.entries(scores).map(([emotion, percentage]) => ({
    emotion,
    emotion_display: nameMap[emotion] || emotion,
    percentage: Number(percentage as number),
  }))
})

const loadDetail = async () => {
  const id = Number(route.query.id || 0)
  if (!id) {
    error.value = '缺少参数 id'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const res: ClientAnalysisDetailResponse = await getClientAnalysisDetail(id)
    if (res.code !== 200) throw new Error(res.msg)
    detail.value = res.data
  } catch (err: any) {
    console.error(err)
    error.value = err?.message || '获取详情失败'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push({ path: '/history' })
}

const goToRecognition = () => {
  router.push({ path: '/' })
}

onMounted(loadDetail)
watch(() => route.query.id, loadDetail)
</script>

<style scoped>
</style>
