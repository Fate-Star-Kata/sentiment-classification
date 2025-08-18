<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Motion } from 'motion-v'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Refresh,

  Delete,
  Filter,
  Calendar,
  User,
  VideoPlay
} from '@element-plus/icons-vue'
import { getAnalysisHistoryAPI, deleteAnalysisAPI, type AnalysisRecord } from '@/api/admin/history'

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

const tableVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: 0.2 }
}

// 响应式数据
const loading = ref(false)
const tableData = ref<AnalysisRecord[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)

// 搜索和筛选
const searchForm = reactive({
  userId: '',
  emotion: '',
  startDate: '',
  endDate: ''
})

// 情感类型选项
const emotionOptions = [
  { label: '全部', value: '' },
  { label: '快乐', value: 'happy' },
  { label: '悲伤', value: 'sad' },
  { label: '愤怒', value: 'angry' },
  { label: '平静', value: 'neutral' },
  { label: '恐惧', value: 'fear' },
  { label: '惊讶', value: 'surprise' }
]



// 多选
const multipleSelection = ref<AnalysisRecord[]>([])

// 获取分析历史数据
async function fetchHistoryData() {
  try {
    loading.value = true
    const params = {
      page: currentPage.value,
      page_size: pageSize.value,
      user_id: searchForm.userId || undefined,
      emotion: searchForm.emotion || undefined,
      start_date: searchForm.startDate || undefined,
      end_date: searchForm.endDate || undefined
    }

    const res = await getAnalysisHistoryAPI(params)
    if (res && res.code === 200) {
      tableData.value = res.data.analyses ?? []
      // 使用API返回的分页信息
      total.value = res.data.pagination?.total_count ?? 0
    } else {
      ElMessage.error(res?.msg || '获取分析历史失败')
    }
  } catch (error) {
    console.error('获取分析历史失败:', error)
    ElMessage.error('获取分析历史失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// 搜索
function handleSearch() {
  currentPage.value = 1
  fetchHistoryData()
}

// 重置搜索
function handleReset() {
  Object.keys(searchForm).forEach(key => {
    searchForm[key as keyof typeof searchForm] = ''
  })
  currentPage.value = 1
  fetchHistoryData()
}

// 刷新数据
function handleRefresh() {
  fetchHistoryData()
}

// 分页变化
function handlePageChange(page: number) {
  currentPage.value = page
  fetchHistoryData()
}

function handleSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
  fetchHistoryData()
}

// 多选变化
function handleSelectionChange(selection: AnalysisRecord[]) {
  multipleSelection.value = selection
}



// 删除单个记录
async function handleDelete(row: AnalysisRecord) {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${row.user_name}" 的这条分析记录吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteAnalysisAPI(row.id)
    ElMessage.success('删除成功')
    fetchHistoryData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请重试')
    }
  }
}

// 批量删除
async function handleBatchDelete() {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning('请选择要删除的记录')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${multipleSelection.value.length} 条分析记录吗？`,
      '批量删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const ids = multipleSelection.value.map(item => item.id)
    await Promise.all(ids.map(id => deleteAnalysisAPI(id)))
    ElMessage.success('批量删除成功')
    fetchHistoryData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败，请重试')
    }
  }
}

// 格式化情感类型
function formatEmotion(emotion: string) {
  const emotionMap: Record<string, string> = {
    happy: '快乐',
    sad: '悲伤',
    angry: '愤怒',
    neutral: '平静',
    fear: '恐惧',
    surprise: '惊讶'
  }
  return emotionMap[emotion] || emotion
}

// 格式化状态
function formatStatus(status: string) {
  const statusMap: Record<string, string> = {
    success: '成功',
    failed: '失败',
    processing: '处理中'
  }
  return statusMap[status] || status
}

// 获取状态标签类型
function getStatusType(status: string): 'success' | 'info' | 'warning' | 'danger' {
  const typeMap: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
    success: 'success',
    failed: 'danger',
    processing: 'warning'
  }
  return typeMap[status] || 'info'
}

// 获取情感标签类型
function getEmotionType(emotion: string): 'success' | 'info' | 'warning' | 'danger' | 'primary' {
  const typeMap: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'primary'> = {
    happy: 'success',
    sad: 'info',
    angry: 'danger',
    neutral: 'info',
    fear: 'warning',
    surprise: 'primary',
    快乐: 'success',
    悲伤: 'info',
    愤怒: 'danger',
    中性: 'info',
    恐惧: 'warning',
    惊讶: 'primary'
  }
  return typeMap[emotion] || 'info'
}

onMounted(() => {
  fetchHistoryData()
})
</script>

<template>
  <div class="analysis-history">
    <!-- 页面标题 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover as any"
      :transition="cardVariants.transition as any">
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <span class="text-lg font-medium">分析历史管理</span>
              <p class="text-sm text-gray-500 mt-1">管理所有用户的音乐情感分析记录</p>
            </div>
            <div class="flex gap-2">
              <el-button type="primary" size="small" @click="handleRefresh" :loading="loading">
                <el-icon>
                  <Refresh />
                </el-icon>
                刷新
              </el-button>

            </div>
          </div>
        </template>

        <!-- 搜索筛选区域 -->
        <div class="search-section mb-4">
          <el-form :model="searchForm" inline class="search-form">
            <el-form-item label="用户ID">
              <el-input v-model="searchForm.userId" placeholder="用户ID" clearable style="width: 120px"
                @keyup.enter="handleSearch" />
            </el-form-item>

            <el-form-item label="情感类型">
              <el-select v-model="searchForm.emotion" placeholder="选择情感" clearable style="width: 120px">
                <el-option v-for="option in emotionOptions" :key="option.value" :label="option.label"
                  :value="option.value" />
              </el-select>
            </el-form-item>



            <el-form-item label="时间范围">
              <el-date-picker v-model="searchForm.startDate" type="date" placeholder="开始日期" style="width: 140px"
                format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
            </el-form-item>

            <el-form-item label="至">
              <el-date-picker v-model="searchForm.endDate" type="date" placeholder="结束日期" style="width: 140px"
                format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSearch">
                <el-icon>
                  <Search />
                </el-icon>
                搜索
              </el-button>
              <el-button @click="handleReset">
                <el-icon>
                  <Refresh />
                </el-icon>
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 批量操作 -->
        <div class="batch-actions mb-4" v-if="multipleSelection.length > 0">
          <el-alert :title="`已选择 ${multipleSelection.length} 条记录`" type="info" show-icon :closable="false">
            <template #default>
              <div class="flex items-center gap-2">
                <span>已选择 {{ multipleSelection.length }} 条记录</span>
                <el-button type="danger" size="small" @click="handleBatchDelete">
                  <el-icon>
                    <Delete />
                  </el-icon>
                  批量删除
                </el-button>
              </div>
            </template>
          </el-alert>
        </div>
      </el-card>
    </Motion>

    <!-- 数据表格 -->
    <Motion :initial="tableVariants.initial" :animate="tableVariants.animate"
      :transition="tableVariants.transition as any">
      <el-card>
        <el-table :data="tableData" v-loading="loading" @selection-change="handleSelectionChange" stripe
          style="width: 100%">
          <el-table-column type="selection" width="55" />

          <el-table-column prop="id" label="ID" width="80" />

          <el-table-column prop="user_name" label="用户" width="120">
            <template #default="{ row }">
              <div class="flex items-center gap-2">
                <el-avatar :size="24">
                  {{ row.user_name?.charAt(0) }}
                </el-avatar>
                <span>{{ row.user_name }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="audio_file_detail.original_name" label="文件名" min-width="200">
            <template #default="{ row }">
              <div class="flex items-center gap-2">
                <el-icon class="text-blue-500">
                  <VideoPlay />
                </el-icon>
                <span class="truncate">{{ row.audio_file_detail.original_name }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="emotion_analysis_detail.primary_emotion" label="检测情感" width="100">
            <template #default="{ row }">
              <el-tag :type="getEmotionType(row.emotion_analysis_detail.primary_emotion)" size="small">
                {{ row.emotion_analysis_detail.primary_emotion_display ||
                  formatEmotion(row.emotion_analysis_detail.primary_emotion) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="emotion_analysis_detail.confidence_percentage" label="置信度" width="100">
            <template #default="{ row }">
              <div class="flex items-center gap-1">
                <el-progress :percentage="Math.round(row.emotion_analysis_detail.confidence_percentage || 0)"
                  :stroke-width="6" :show-text="false" style="width: 50px" />
                <span class="text-sm">{{ Math.round(row.emotion_analysis_detail.confidence_percentage || 0) }}%</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="audio_file_detail.duration" label="时长" width="80">
            <template #default="{ row }">
              {{ row.audio_file_detail.duration_formatted || (Math.round(row.audio_file_detail.duration || 0) + 's')
              }}
            </template>
          </el-table-column>

          <el-table-column prop="audio_file_detail.status" label="状态" width="80">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.audio_file_detail.status)" size="small">
                {{ row.audio_file_detail.status_display || formatStatus(row.audio_file_detail.status) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="created_time" label="分析时间" width="160">
            <template #default="{ row }">
              <div class="flex items-center gap-1">
                <el-icon class="text-gray-400">
                  <Calendar />
                </el-icon>
                <span class="text-sm">{{ row.created_time }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="80" fixed="right">
            <template #default="{ row }">
              <div class="flex gap-1">
                <el-button type="danger" size="small" @click="handleDelete(row)">
                  <el-icon>
                    <Delete />
                  </el-icon>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrapper mt-4 flex justify-center">
          <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
            :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
            @current-change="handlePageChange" />
        </div>
      </el-card>
    </Motion>
  </div>
</template>

<style scoped>
.analysis-history {
  width: 100%;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.search-form .el-form-item {
  margin-bottom: 16px;
}

.batch-actions {
  margin-bottom: 16px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 表格样式增强 */
.el-table {
  border-radius: 8px;
  overflow: hidden;
}

.el-table .el-table__header {
  background-color: #f8f9fa;
}

.el-table .el-table__row:hover {
  background-color: #f5f7fa;
}

/* 卡片样式 */
.el-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.el-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-form {
    flex-direction: column;
  }

  .search-form .el-form-item {
    width: 100%;
  }
}

/* 截断文本 */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>