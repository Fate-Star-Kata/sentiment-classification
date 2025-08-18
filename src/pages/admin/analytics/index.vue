<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { Refresh, User, DataAnalysis, Calendar, TrendCharts } from '@element-plus/icons-vue'
import { getAnalysisRecordsAPI, getAnalyticsStatsAPI, type AnalysisRecord } from '@/api/admin/analytics'
import { ElMessage } from 'element-plus'

// 响应式数据
const loading = ref(false)
const totalUsers = ref(0)
const totalAnalysis = ref(0)
const todayAnalysis = ref(0)
const avgAccuracy = ref(0)
const analysisRecords = ref<AnalysisRecord[]>([])
const totalRecords = ref(0)

// 图表实例
const emotionChartRef = ref<HTMLDivElement>()
const trendChartRef = ref<HTMLDivElement>()
const accuracyChartRef = ref<HTMLDivElement>()
const deviceChartRef = ref<HTMLDivElement>()

// 图表数据
const emotionData = ref([])
const trendData = ref({
  dates: [],
  analysis: [],
  accuracy: []
})
const deviceData = ref([])

// 获取分析记录数据
async function fetchAnalysisRecords() {
  try {
    loading.value = true
    const response = await getAnalysisRecordsAPI({ page: 1, page_size: 100 })
    
    if (response.code === 200) {
      analysisRecords.value = response.data.analyses
      totalRecords.value = response.data.pagination.total_count
      
      // 处理情感分布数据
      processEmotionData()
      
      // 更新统计数据
      totalAnalysis.value = totalRecords.value
      
      // 重新初始化图表
      setTimeout(() => {
        initEmotionChart()
        initTrendChart()
        initAccuracyChart()
        initDeviceChart()
      }, 100)
    } else {
      ElMessage.error(response.msg || '获取数据失败')
    }
  } catch (error) {
    console.error('获取分析记录失败:', error)
    ElMessage.error('获取数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 处理情感分布数据
function processEmotionData() {
  const emotionCount: { [key: string]: number } = {}
  
  analysisRecords.value.forEach(record => {
    const emotion = record.emotion_analysis_detail.primary_emotion_display
    emotionCount[emotion] = (emotionCount[emotion] || 0) + 1
  })
  
  const colors = {
    '快乐': '#67C23A',
    '悲伤': '#409EFF', 
    '愤怒': '#F56C6C',
    '中性': '#E6A23C',
    '恐惧': '#909399',
    '惊讶': '#9C27B0',
    '厌恶': '#FF6B6B'
  }
  
  emotionData.value = Object.entries(emotionCount).map(([name, value]) => ({
    name,
    value,
    itemStyle: { color: colors[name] || '#909399' }
  }))
}

// 初始化情感分布图表
function initEmotionChart() {
  if (!emotionChartRef.value || !emotionData.value.length) return
  
  const chart = echarts.init(emotionChartRef.value)
  const option = {
    title: {
      text: '情感分布',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [
      {
        name: '情感类型',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '60%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}: {c}'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true
        },
        data: emotionData.value
      }
    ]
  }
  chart.setOption(option)
}

// 处理趋势数据
function processTrendData() {
  // 生成最近7天的数据
  const dates = []
  const analysisCount = []
  const accuracyRates = []
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }))
    
    // 统计当天的分析数量
    const dayRecords = analysisRecords.value.filter(record => {
      // 这里应该根据实际的创建时间字段进行过滤
      // 由于API返回的数据结构中没有创建时间，这里使用模拟数据
      return true
    })
    
    analysisCount.push(Math.floor(Math.random() * 50) + 10)
    accuracyRates.push(Math.floor(Math.random() * 10) + 90)
  }
  
  trendData.value = {
    dates,
    analysis: analysisCount,
    accuracy: accuracyRates
  }
}

// 初始化趋势图表
function initTrendChart() {
  if (!trendChartRef.value) return
  
  // 处理趋势数据
  processTrendData()
  
  const chart = echarts.init(trendChartRef.value)
  const option = {
    title: {
      text: '分析趋势',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['分析次数', '准确率']
    },
    xAxis: {
      type: 'category',
      data: trendData.value.dates
    },
    yAxis: [
      {
        type: 'value',
        name: '分析次数',
        position: 'left'
      },
      {
        type: 'value',
        name: '准确率(%)',
        position: 'right',
        min: 85,
        max: 100
      }
    ],
    series: [
      {
        name: '分析次数',
        type: 'bar',
        data: trendData.value.analysis,
        itemStyle: {
          color: '#409EFF'
        }
      },
      {
        name: '准确率',
        type: 'line',
        yAxisIndex: 1,
        data: trendData.value.accuracy,
        itemStyle: {
          color: '#67C23A'
        },
        lineStyle: {
          width: 3
        }
      }
    ]
  }
  chart.setOption(option)
}

// 计算平均准确率
function calculateAvgAccuracy() {
  if (analysisRecords.value.length === 0) {
    avgAccuracy.value = 0
    return
  }
  
  const totalConfidence = analysisRecords.value.reduce((sum, record) => {
    return sum + record.emotion_analysis_detail.confidence_percentage
  }, 0)
  
  avgAccuracy.value = Math.round(totalConfidence / analysisRecords.value.length)
}

// 初始化准确率图表
function initAccuracyChart() {
  if (!accuracyChartRef.value) return
  
  // 计算平均准确率
  calculateAvgAccuracy()
  
  const chart = echarts.init(accuracyChartRef.value)
  const option = {
    title: {
      text: '模型准确率',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    series: [
      {
        type: 'gauge',
        center: ['50%', '60%'],
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        splitNumber: 10,
        itemStyle: {
          color: '#67C23A'
        },
        progress: {
          show: true,
          width: 30
        },
        pointer: {
          show: false
        },
        axisLine: {
          lineStyle: {
            width: 30
          }
        },
        axisTick: {
          distance: -45,
          splitNumber: 5,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        splitLine: {
          distance: -52,
          length: 14,
          lineStyle: {
            width: 3,
            color: '#999'
          }
        },
        axisLabel: {
          distance: -20,
          color: '#999',
          fontSize: 20
        },
        anchor: {
          show: false
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: true,
          width: '60%',
          lineHeight: 40,
          borderRadius: 8,
          offsetCenter: [0, '-15%'],
          fontSize: 60,
          fontWeight: 'bolder',
          formatter: '{value}%',
          color: 'inherit'
        },
        data: [
          {
            value: avgAccuracy.value
          }
        ]
      }
    ]
  }
  chart.setOption(option)
}

// 处理设备分布数据
function processDeviceData() {
  // 由于API返回的数据中没有设备信息，这里使用模拟数据
  // 实际项目中应该根据用户代理或其他方式统计设备类型
  deviceData.value = [
    { name: 'PC端', value: 60, itemStyle: { color: '#409EFF' } },
    { name: '移动端', value: 35, itemStyle: { color: '#67C23A' } },
    { name: '平板端', value: 5, itemStyle: { color: '#E6A23C' } }
  ]
}

// 初始化设备分布图表
function initDeviceChart() {
  if (!deviceChartRef.value) return
  
  // 处理设备分布数据
  processDeviceData()
  
  const chart = echarts.init(deviceChartRef.value)
  const option = {
    title: {
      text: '设备分布',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}%'
    },
    series: [
      {
        name: '设备类型',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '60%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}: {c}%'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true
        },
        data: deviceData.value
      }
    ]
  }
  chart.setOption(option)
}

// 刷新数据
function refreshData() {
  fetchAnalysisRecords()
}

onMounted(() => {
  // 获取数据并初始化图表
  fetchAnalysisRecords()
})
</script>

<template>
  <div class="analytics-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">数据分析</h2>
      <p class="page-description">音乐情感分析系统的数据统计和分析报告</p>
      <div class="actions">
        <el-button type="primary" @click="refreshData" :loading="loading">
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon users">
          <el-icon><User /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalUsers.toLocaleString() }}</div>
          <div class="stat-label">总用户数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon analysis">
          <el-icon><DataAnalysis /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalAnalysis.toLocaleString() }}</div>
          <div class="stat-label">总分析次数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon today">
          <el-icon><Calendar /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ todayAnalysis }}</div>
          <div class="stat-label">今日分析</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon accuracy">
          <el-icon><TrendCharts /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ avgAccuracy }}%</div>
          <div class="stat-label">平均准确率</div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-grid">
      <!-- 情感分布图 -->
      <div class="chart-card">
        <div ref="emotionChartRef" class="chart-container"></div>
      </div>
      
      <!-- 趋势图 -->
      <div class="chart-card">
        <div ref="trendChartRef" class="chart-container"></div>
      </div>
      
      <!-- 准确率仪表盘 -->
      <div class="chart-card">
        <div ref="accuracyChartRef" class="chart-container"></div>
      </div>
      
      <!-- 设备分布图 -->
      <div class="chart-card">
        <div ref="deviceChartRef" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.analytics-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.page-description {
  color: #6b7280;
  margin: 0;
}

.actions {
  display: flex;
  gap: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-icon.users {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.analysis {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.today {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.accuracy {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chart-container {
  width: 100%;
  height: 350px;
}
</style>