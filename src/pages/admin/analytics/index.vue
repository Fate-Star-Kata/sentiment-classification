<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

// 响应式数据
const loading = ref(false)
const totalUsers = ref(1248)
const totalAnalysis = ref(5632)
const todayAnalysis = ref(89)
const avgAccuracy = ref(92.5)

// 图表实例
const emotionChartRef = ref<HTMLDivElement>()
const trendChartRef = ref<HTMLDivElement>()
const accuracyChartRef = ref<HTMLDivElement>()
const deviceChartRef = ref<HTMLDivElement>()

// 模拟数据
const emotionData = [
  { name: '快乐', value: 35, color: '#67C23A' },
  { name: '悲伤', value: 25, color: '#409EFF' },
  { name: '愤怒', value: 15, color: '#F56C6C' },
  { name: '恐惧', value: 10, color: '#E6A23C' },
  { name: '惊讶', value: 10, color: '#909399' },
  { name: '厌恶', value: 5, color: '#9C27B0' }
]

const trendData = {
  dates: ['01-15', '01-16', '01-17', '01-18', '01-19', '01-20', '01-21'],
  analysis: [45, 52, 48, 61, 55, 67, 89],
  accuracy: [91.2, 92.1, 90.8, 93.2, 91.9, 92.8, 94.1]
}

const deviceData = [
  { name: 'PC端', value: 60 },
  { name: '移动端', value: 35 },
  { name: '平板', value: 5 }
]

// 初始化情感分布图表
function initEmotionChart() {
  if (!emotionChartRef.value) return
  
  const chart = echarts.init(emotionChartRef.value)
  const option = {
    title: {
      text: '情感分布统计',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: emotionData.map(item => item.name)
    },
    series: [
      {
        name: '情感分析',
        type: 'pie',
        radius: '50%',
        center: ['50%', '60%'],
        data: emotionData.map(item => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: item.color
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
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
      data: trendData.dates
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
        data: trendData.analysis,
        itemStyle: {
          color: '#409EFF'
        }
      },
      {
        name: '准确率',
        type: 'line',
        yAxisIndex: 1,
        data: trendData.accuracy,
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

// 初始化准确率图表
function initAccuracyChart() {
  if (!accuracyChartRef.value) return
  
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

// 初始化设备分布图表
function initDeviceChart() {
  if (!deviceChartRef.value) return
  
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
      trigger: 'item'
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
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: deviceData
      }
    ]
  }
  chart.setOption(option)
}

// 刷新数据
function refreshData() {
  loading.value = true
  
  // 模拟API调用
  setTimeout(() => {
    // 更新统计数据
    totalUsers.value = Math.floor(Math.random() * 2000) + 1000
    totalAnalysis.value = Math.floor(Math.random() * 8000) + 4000
    todayAnalysis.value = Math.floor(Math.random() * 150) + 50
    avgAccuracy.value = Math.floor(Math.random() * 10) + 90
    
    loading.value = false
    
    // 重新初始化图表
    setTimeout(() => {
      initEmotionChart()
      initTrendChart()
      initAccuracyChart()
      initDeviceChart()
    }, 100)
  }, 1000)
}

onMounted(() => {
  // 初始化所有图表
  setTimeout(() => {
    initEmotionChart()
    initTrendChart()
    initAccuracyChart()
    initDeviceChart()
  }, 100)
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