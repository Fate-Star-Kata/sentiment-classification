<template>
  <div class="pb-20">
    <div class="max-w-6xl mx-auto my-8 mb-16 px-16 py-8 bg-white rounded-xl shadow-lg">
    <!-- 页面标题 -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-semibold text-gray-800 mb-2">情感分析结果</h1>
      <p class="text-sm text-gray-500">分析完成时间：{{ analysisTime }}</p>
    </div>

    <!-- 主要结果展示 -->
    <Motion
      :initial="{ opacity: 0, y: 30, scale: 0.9 }"
      :animate="{ opacity: 1, y: 0, scale: 1 }"
      :transition="{ duration: 0.6, delay: 0.2, ease: 'easeOut' }"
    >
      <div class="text-center mb-8 p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white">
        <div>
          <div class="text-6xl mb-3 block">😊</div>
          <div class="text-2xl font-semibold mb-2 block">快乐</div>
          <div class="text-lg opacity-90">置信度: {{ primaryEmotion.confidence }}%</div>
        </div>
      </div>
    </Motion>

    <!-- 详细情感分布 -->
    <Motion
      :initial="{ opacity: 0, y: 30, scale: 0.9 }"
      :animate="{ opacity: 1, y: 0, scale: 1 }"
      :transition="{ duration: 0.6, delay: 0.4, ease: 'easeOut' }"
    >
      <div class="mb-8">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">情感分布</h3>
        <div>
          <div 
            v-for="emotion in emotions" 
            :key="emotion.name"
            class="flex items-center py-3 border-b border-gray-100"
            :class="{ 'bg-blue-50 px-4 rounded-lg border-b-0 mb-2': emotion.isPrimary }"
          >
            <span class="text-xl mr-3 w-6">{{ emotion.icon }}</span>
            <span class="flex-1 font-medium text-gray-700">{{ emotion.name }}</span>
            <span class="font-semibold text-gray-800 mr-4 min-w-[50px] text-right">{{ emotion.percentage }}%</span>
            <div class="w-25 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-[1200ms] ease-out animate-[progressGrow_1.2s_ease-out_1s]" 
                :style="{ 
                  width: emotion.percentage + '%',
                  '--target-width': emotion.percentage + '%'
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Motion>

    <!-- 音频信息 -->
    <Motion
      :initial="{ opacity: 0, y: 30, scale: 0.9 }"
      :animate="{ opacity: 1, y: 0, scale: 1 }"
      :transition="{ duration: 0.6, delay: 0.6, ease: 'easeOut' }"
    >
      <div class="mb-8">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">音频信息</h3>
        <div class="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4">
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-lg font-semibold text-gray-800 mb-1">{{ audioInfo.duration }}</div>
            <div class="text-xs text-gray-500 uppercase tracking-wider">音频时长</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-lg font-semibold text-gray-800 mb-1">{{ audioInfo.sampleRate }}</div>
            <div class="text-xs text-gray-500 uppercase tracking-wider">采样率</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-lg font-semibold text-gray-800 mb-1">{{ audioInfo.bitDepth }}</div>
            <div class="text-xs text-gray-500 uppercase tracking-wider">位深度</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-lg font-semibold text-gray-800 mb-1">{{ audioInfo.fileSize }}</div>
            <div class="text-xs text-gray-500 uppercase tracking-wider">文件大小</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-lg font-semibold text-gray-800 mb-1">{{ audioInfo.analysisTime }}</div>
            <div class="text-xs text-gray-500 uppercase tracking-wider">分析耗时</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-lg font-semibold text-gray-800 mb-1">{{ audioInfo.language }}</div>
            <div class="text-xs text-gray-500 uppercase tracking-wider">识别语言</div>
          </div>
        </div>
      </div>
    </Motion>

    <!-- 功能按钮 -->
    <Motion
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5, delay: 0.8, ease: 'easeOut' }"
    >
      <div class="flex gap-3 justify-center flex-wrap">
        <el-button type="primary" @click="reAnalyze" class="min-w-[100px]">重新分析</el-button>
        <el-button type="success" @click="saveResult" class="min-w-[100px]">保存结果</el-button>
        <el-button type="info" @click="shareResult" class="min-w-[100px]">分享结果</el-button>
        <el-button @click="viewHistory" class="min-w-[100px]">查看历史</el-button>
      </div>
    </Motion>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { Motion } from 'motion-v'

const router = useRouter()

// 分析时间
const analysisTime = ref('2025/8/18 14:54:13')

// 主要情感结果
const primaryEmotion = reactive({
  name: '快乐',
  icon: '😊',
  confidence: 85.6
})

// 情感分布数据
const emotions = ref([
  { name: '快乐', icon: '😊', percentage: 85.6, isPrimary: true },
  { name: '中性', icon: '😐', percentage: 8.2, isPrimary: false },
  { name: '悲伤', icon: '😢', percentage: 3.1, isPrimary: false },
  { name: '愤怒', icon: '😠', percentage: 2.0, isPrimary: false },
  { name: '恐惧', icon: '😨', percentage: 1.1, isPrimary: false }
])

// 音频信息
const audioInfo = reactive({
  duration: '15.3s',
  sampleRate: '44.1kHz',
  bitDepth: '16bit',
  fileSize: '2.1MB',
  analysisTime: '1.2s',
  language: '中文'
})

// 功能按钮事件处理
const reAnalyze = () => {
  ElMessage.info('重新分析功能开发中...')
  router.push('/')
}

const saveResult = () => {
  ElMessage.success('结果已保存')
}

const shareResult = () => {
  ElMessage.info('分享功能开发中...')
}

const viewHistory = () => {
  ElMessage.info('查看历史功能开发中...')
  router.push('/history')
}
</script>

<style scoped lang="scss">
@keyframes progressGrow {
  from {
    width: 0%;
  }
  to {
    width: var(--target-width);
  }
}

@media (max-width: 768px) {
  .max-w-6xl {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .grid-cols-\[repeat\(auto-fit\,minmax\(120px\,1fr\)\)\] {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .flex.gap-3.justify-center.flex-wrap {
    flex-direction: column;
  }
  
  .flex.gap-3.justify-center.flex-wrap .el-button {
    width: 100%;
  }
}
</style>
