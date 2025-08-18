<template>
  <div class="min-h-screen  from-blue-50 to-purple-50">

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- 英雄区域 -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          欢迎使用音乐情感分析系统
        </h1>
        <p class="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          通过先进的AI技术，准确识别您音乐中的情感状态
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            @click="scrollToRecording"
            class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            开始分析
          </button>
          <button class="bg-white hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium border border-gray-300 transition-colors">
            了解更多
          </button>
        </div>
      </div>

      <!-- 功能特性 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">智能识别</h3>
          <p class="text-gray-600">基于深度学习算法，精准识别音乐中的情感特征和情绪变化</p>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">详细分析</h3>
          <p class="text-gray-600">提供多维度情感分析报告，包含情感强度和时间分布</p>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">快速处理</h3>
          <p class="text-gray-600">高效的处理速度，支持多种音频格式，快速获得分析结果</p>
        </div>
      </div>

      <!-- 录音区域 -->
      <div ref="recordingSection" class="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
        <h3 class="text-2xl font-semibold text-gray-900 mb-6 text-center">实时录音进行情感分析</h3>
        <div class="text-center">
          <!-- 麦克风权限状态 -->
          <div v-if="!microphonePermission" class="mb-6">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
              </svg>
            </div>
            <p class="text-gray-600 mb-4">需要麦克风权限才能进行录音</p>
            <button 
              @click="requestMicrophonePermission"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              请求麦克风权限
            </button>
          </div>

          <!-- 麦克风选择和录音控制 -->
          <div v-else class="space-y-6">
            <!-- 麦克风选择 -->
            <div class="flex flex-col items-center space-y-4">
              <label class="text-sm font-medium text-gray-700">选择麦克风设备</label>
              <select 
                v-model="selectedMicrophone"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="" disabled>请选择麦克风</option>
                <option 
                  v-for="device in microphoneDevices" 
                  :key="device.deviceId" 
                  :value="device.deviceId"
                >
                  {{ device.label || `麦克风 ${device.deviceId.slice(0, 8)}` }}
                </option>
              </select>
            </div>

            <!-- 录音控制 -->
            <div class="flex flex-col items-center space-y-4">
              <div class="w-20 h-20 rounded-full flex items-center justify-center transition-colors" :class="{
                'bg-red-100': !isRecording,
                'bg-red-500 animate-pulse': isRecording
              }">
                <svg class="w-10 h-10" :class="{
                  'text-red-600': !isRecording,
                  'text-white': isRecording
                }" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"></path>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"></path>
                </svg>
              </div>
              
              <div class="flex space-x-4">
                <button 
                  v-if="!isRecording"
                  @click="startRecording"
                  :disabled="!selectedMicrophone"
                  class="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  开始录音
                </button>
                <button 
                  v-else
                  @click="stopRecording"
                  class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  停止录音
                </button>
              </div>
              
              <div v-if="isRecording" class="text-sm text-gray-600">
                录音时长: {{ recordingDuration }}s
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 上传区域 -->
      <div class="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
        <h3 class="text-2xl font-semibold text-gray-900 mb-6 text-center">上传音频文件进行情感分析</h3>
        <div class="h-64">
          <ReceiveFiles
            :allowSuffix="['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg']"
            :maxSize="50 * 1024 * 1024"
            customTitle="点击或拖拽音频文件到此处"
            customDesc="支持 MP3、WAV、FLAC、AAC、M4A、OGG 格式，文件大小不超过 50MB"
            @file-selected="handleFileSelected"
          />
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="bg-gray-50 border-t border-gray-200 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-gray-600">
          <p>&copy; 2024 音乐情感分析系统. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ReceiveFiles from '@/components/common/FileUpload/ReceiveFiles.vue'
import { ElMessage } from 'element-plus'

// 录音相关状态
const microphonePermission = ref(false)
const microphoneDevices = ref<MediaDeviceInfo[]>([])
const selectedMicrophone = ref('')
const isRecording = ref(false)
const recordingDuration = ref(0)
const mediaRecorder = ref<MediaRecorder | null>(null)
const recordingTimer = ref<number | null>(null)
const recordingSection = ref<HTMLElement | null>(null)

// 滚动到录音区域
function scrollToRecording() {
  if (recordingSection.value) {
    recordingSection.value.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// 请求麦克风权限
async function requestMicrophonePermission() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    microphonePermission.value = true
    // 停止临时流
    stream.getTracks().forEach(track => track.stop())
    // 获取麦克风设备列表
    await getMicrophoneDevices()
    ElMessage.success('麦克风权限获取成功')
  } catch (error) {
    console.error('麦克风权限获取失败:', error)
    ElMessage.error('麦克风权限获取失败，请检查浏览器设置')
  }
}

// 获取麦克风设备列表
async function getMicrophoneDevices() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    microphoneDevices.value = devices.filter(device => device.kind === 'audioinput')
    // 自动选择第一个设备
    if (microphoneDevices.value.length > 0 && !selectedMicrophone.value) {
      selectedMicrophone.value = microphoneDevices.value[0].deviceId
    }
  } catch (error) {
    console.error('获取麦克风设备失败:', error)
    ElMessage.error('获取麦克风设备失败')
  }
}

// 开始录音
async function startRecording() {
  if (!selectedMicrophone.value) {
    ElMessage.warning('请先选择麦克风设备')
    return
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: selectedMicrophone.value
      }
    })

    mediaRecorder.value = new MediaRecorder(stream)
    const chunks: Blob[] = []

    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data)
      }
    }

    mediaRecorder.value.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/wav' })
      const file = new File([blob], `recording_${Date.now()}.wav`, { type: 'audio/wav' })
      handleRecordingComplete(file)
      // 停止所有音频轨道
      stream.getTracks().forEach(track => track.stop())
    }

    mediaRecorder.value.start()
    isRecording.value = true
    recordingDuration.value = 0
    
    // 开始计时
    recordingTimer.value = window.setInterval(() => {
      recordingDuration.value++
    }, 1000)

    ElMessage.success('开始录音')
  } catch (error) {
    console.error('录音开始失败:', error)
    ElMessage.error('录音开始失败')
  }
}

// 停止录音
function stopRecording() {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop()
    isRecording.value = false
    
    if (recordingTimer.value) {
      clearInterval(recordingTimer.value)
      recordingTimer.value = null
    }
    
    ElMessage.success('录音已停止')
  }
}

// 处理录音完成
function handleRecordingComplete(file: File) {
  console.log('录音完成:', file)
  ElMessage.success(`录音完成: ${file.name}`)
  // 这里可以添加录音文件的处理逻辑，比如上传到服务器进行分析
}

// 处理文件选择
function handleFileSelected(file: File) {
  console.log('选择的文件:', file)
  ElMessage.success(`已选择文件: ${file.name}`)
  // 这里可以添加文件上传和分析的逻辑
}

// 检查初始权限状态
onMounted(async () => {
  try {
    const permissions = await navigator.permissions.query({ name: 'microphone' as PermissionName })
    if (permissions.state === 'granted') {
      microphonePermission.value = true
      await getMicrophoneDevices()
    }
  } catch (error) {
    console.log('无法检查麦克风权限状态')
  }
})

// 清理定时器
onUnmounted(() => {
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value)
  }
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop()
  }
})
</script>

<style scoped>
/* 自定义样式 */
.bg-gradient-to-br {
  background: linear-gradient(to bottom right, #eff6ff, #faf5ff);
}
</style>
