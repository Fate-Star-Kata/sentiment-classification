<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Delete, Refresh, ArrowDown, Search, Upload, Plus, UploadFilled } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile } from 'element-plus'

// 音乐文件接口
interface MusicFile {
  id: number
  title: string
  artist: string
  album: string
  genre: string
  duration: number
  fileSize: number
  format: string
  uploadTime: string
  status: 'active' | 'processing' | 'error'
  analysisCount: number
  avgEmotion: string
  filePath: string
}

// 响应式数据
const loading = ref(false)
const dialogVisible = ref(false)
const uploadDialogVisible = ref(false)
const editMode = ref(false)
const currentMusic = ref<MusicFile | null>(null)

// 搜索和分页
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 筛选条件
const filterGenre = ref('')
const filterStatus = ref('')
const filterFormat = ref('')

// 音乐列表
const musicList = ref<MusicFile[]>([])

// 上传文件列表
const uploadFileList = ref<UploadUserFile[]>([])

// 表单数据
const musicForm = reactive({
  title: '',
  artist: '',
  album: '',
  genre: '',
  description: ''
})

// 表单验证规则
const formRules = {
  title: [{ required: true, message: '请输入音乐标题', trigger: 'blur' }],
  artist: [{ required: true, message: '请输入艺术家', trigger: 'blur' }]
}

// 音乐类型选项
const genreOptions = [
  '流行', '摇滚', '古典', '爵士', '电子', '民谣',
  '说唱', '乡村', '蓝调', '雷鬼', '金属', '朋克'
]

// 状态选项
const statusOptions = [
  { label: '正常', value: 'active' },
  { label: '处理中', value: 'processing' },
  { label: '错误', value: 'error' }
]

// 格式选项
const formatOptions = ['mp3', 'wav', 'flac', 'm4a', 'aac']

// 模拟数据
const mockMusicData: MusicFile[] = [
  {
    id: 1,
    title: '夜曲',
    artist: '周杰伦',
    album: '七里香',
    genre: '流行',
    duration: 233,
    fileSize: 8.5,
    format: 'mp3',
    uploadTime: '2024-01-15 10:30:00',
    status: 'active',
    analysisCount: 156,
    avgEmotion: '浪漫',
    filePath: '/music/nocturne.mp3'
  },
  {
    id: 2,
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    genre: '摇滚',
    duration: 355,
    fileSize: 12.8,
    format: 'flac',
    uploadTime: '2024-01-14 15:20:00',
    status: 'active',
    analysisCount: 89,
    avgEmotion: '激昂',
    filePath: '/music/bohemian_rhapsody.flac'
  },
  {
    id: 3,
    title: 'Canon in D',
    artist: 'Pachelbel',
    album: 'Classical Masterpieces',
    genre: '古典',
    duration: 280,
    fileSize: 15.2,
    format: 'wav',
    uploadTime: '2024-01-13 09:45:00',
    status: 'processing',
    analysisCount: 45,
    avgEmotion: '宁静',
    filePath: '/music/canon_in_d.wav'
  },
  {
    id: 4,
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    genre: '流行',
    duration: 233,
    fileSize: 7.9,
    format: 'mp3',
    uploadTime: '2024-01-12 14:15:00',
    status: 'active',
    analysisCount: 203,
    avgEmotion: '快乐',
    filePath: '/music/shape_of_you.mp3'
  },
  {
    id: 5,
    title: 'Hotel California',
    artist: 'Eagles',
    album: 'Hotel California',
    genre: '摇滚',
    duration: 391,
    fileSize: 14.1,
    format: 'm4a',
    uploadTime: '2024-01-11 16:30:00',
    status: 'error',
    analysisCount: 12,
    avgEmotion: '神秘',
    filePath: '/music/hotel_california.m4a'
  }
]

// 计算属性
const filteredMusicList = computed(() => {
  let filtered = musicList.value

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(music =>
      music.title.toLowerCase().includes(query) ||
      music.artist.toLowerCase().includes(query) ||
      music.album.toLowerCase().includes(query)
    )
  }

  // 类型过滤
  if (filterGenre.value) {
    filtered = filtered.filter(music => music.genre === filterGenre.value)
  }

  // 状态过滤
  if (filterStatus.value) {
    filtered = filtered.filter(music => music.status === filterStatus.value)
  }

  // 格式过滤
  if (filterFormat.value) {
    filtered = filtered.filter(music => music.format === filterFormat.value)
  }

  return filtered
})

const paginatedMusicList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredMusicList.value.slice(start, end)
})

// 格式化时长
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 格式化文件大小
function formatFileSize(sizeMB: number): string {
  if (sizeMB < 1) {
    return `${(sizeMB * 1024).toFixed(0)} KB`
  }
  return `${sizeMB.toFixed(1)} MB`
}

// 获取状态标签类型
function getStatusType(status: string): string {
  const types: Record<string, string> = {
    active: 'success',
    processing: 'warning',
    error: 'danger'
  }
  return types[status] || 'info'
}

// 获取状态文本
function getStatusText(status: string): string {
  const texts: Record<string, string> = {
    active: '正常',
    processing: '处理中',
    error: '错误'
  }
  return texts[status] || status
}

// 搜索音乐
function searchMusic() {
  currentPage.value = 1
  total.value = filteredMusicList.value.length
}

// 重置搜索
function resetSearch() {
  searchQuery.value = ''
  filterGenre.value = ''
  filterStatus.value = ''
  filterFormat.value = ''
  currentPage.value = 1
  total.value = musicList.value.length
}

// 添加音乐
function addMusic() {
  editMode.value = false
  currentMusic.value = null
  Object.assign(musicForm, {
    title: '',
    artist: '',
    album: '',
    genre: '',
    description: ''
  })
  dialogVisible.value = true
}

// 编辑音乐
function editMusic(music: MusicFile) {
  editMode.value = true
  currentMusic.value = music
  Object.assign(musicForm, {
    title: music.title,
    artist: music.artist,
    album: music.album,
    genre: music.genre,
    description: ''
  })
  dialogVisible.value = true
}

// 删除音乐
function deleteMusic(music: MusicFile) {
  ElMessageBox.confirm(
    `确定要删除音乐「${music.title}」吗？此操作不可撤销。`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = musicList.value.findIndex(item => item.id === music.id)
    if (index > -1) {
      musicList.value.splice(index, 1)
      total.value = musicList.value.length
      ElMessage.success('删除成功')
    }
  })
}

// 批量删除
function batchDelete() {
  // 这里应该实现批量删除逻辑
  ElMessage.info('批量删除功能开发中')
}

// 重新分析
function reanalyze(music: MusicFile) {
  ElMessageBox.confirm(
    `确定要重新分析音乐「${music.title}」吗？`,
    '确认重新分析',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    music.status = 'processing'
    ElMessage.success('已提交重新分析请求')

    // 模拟分析过程
    setTimeout(() => {
      music.status = 'active'
      music.analysisCount += 1
      ElMessage.success('分析完成')
    }, 3000)
  })
}

// 保存音乐信息
function saveMusic() {
  loading.value = true

  // 模拟API调用
  setTimeout(() => {
    if (editMode.value && currentMusic.value) {
      // 更新现有音乐
      Object.assign(currentMusic.value, {
        title: musicForm.title,
        artist: musicForm.artist,
        album: musicForm.album,
        genre: musicForm.genre
      })
      ElMessage.success('音乐信息更新成功')
    } else {
      // 添加新音乐
      const newMusic: MusicFile = {
        id: Date.now(),
        title: musicForm.title,
        artist: musicForm.artist,
        album: musicForm.album,
        genre: musicForm.genre,
        duration: 0,
        fileSize: 0,
        format: 'mp3',
        uploadTime: new Date().toLocaleString(),
        status: 'processing',
        analysisCount: 0,
        avgEmotion: '未知',
        filePath: ''
      }
      musicList.value.unshift(newMusic)
      total.value = musicList.value.length
      ElMessage.success('音乐添加成功')
    }

    loading.value = false
    dialogVisible.value = false
  }, 1000)
}

// 上传文件
function showUploadDialog() {
  uploadFileList.value = []
  uploadDialogVisible.value = true
}

// 文件上传前检查
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isAudio = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/mp4', 'audio/aac'].includes(file.type)
  const isLt50M = file.size / 1024 / 1024 < 50

  if (!isAudio) {
    ElMessage.error('只能上传音频文件！')
    return false
  }
  if (!isLt50M) {
    ElMessage.error('文件大小不能超过 50MB！')
    return false
  }
  return true
}

// 文件上传成功
const handleUploadSuccess = (response: any, file: any) => {
  ElMessage.success(`${file.name} 上传成功`)
}

// 文件上传失败
const handleUploadError = (error: any, file: any) => {
  ElMessage.error(`${file.name} 上传失败`)
}

// 确认上传
function confirmUpload() {
  if (uploadFileList.value.length === 0) {
    ElMessage.warning('请选择要上传的文件')
    return
  }

  loading.value = true

  // 模拟上传过程
  setTimeout(() => {
    uploadFileList.value.forEach(file => {
      const newMusic: MusicFile = {
        id: Date.now() + Math.random(),
        title: file.name?.replace(/\.[^/.]+$/, '') || '未知标题',
        artist: '未知艺术家',
        album: '未知专辑',
        genre: '未分类',
        duration: 0,
        fileSize: (file.size || 0) / 1024 / 1024,
        format: file.name?.split('.').pop() || 'mp3',
        uploadTime: new Date().toLocaleString(),
        status: 'processing',
        analysisCount: 0,
        avgEmotion: '分析中',
        filePath: `/music/${file.name}`
      }
      musicList.value.unshift(newMusic)
    })

    total.value = musicList.value.length
    loading.value = false
    uploadDialogVisible.value = false
    ElMessage.success(`成功上传 ${uploadFileList.value.length} 个文件`)
  }, 2000)
}

// 页面变化
function handlePageChange(page: number) {
  currentPage.value = page
}

// 页面大小变化
function handleSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
}

// 初始化数据
function initData() {
  loading.value = true

  // 模拟API调用
  setTimeout(() => {
    musicList.value = [...mockMusicData]
    total.value = musicList.value.length
    loading.value = false
  }, 500)
}

onMounted(() => {
  initData()
})
</script>

<template>
  <div class="music-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">音乐管理</h2>
      <p class="page-description">管理音乐文件库，查看分析统计和元数据</p>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="search-section">
        <el-input v-model="searchQuery" placeholder="搜索音乐标题、艺术家或专辑" style="width: 300px" clearable
          @keyup.enter="searchMusic">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>

        <el-select v-model="filterGenre" placeholder="类型" clearable style="width: 120px">
          <el-option v-for="genre in genreOptions" :key="genre" :label="genre" :value="genre" />
        </el-select>

        <el-select v-model="filterStatus" placeholder="状态" clearable style="width: 120px">
          <el-option v-for="status in statusOptions" :key="status.value" :label="status.label" :value="status.value" />
        </el-select>

        <el-select v-model="filterFormat" placeholder="格式" clearable style="width: 120px">
          <el-option v-for="format in formatOptions" :key="format" :label="format.toUpperCase()" :value="format" />
        </el-select>

        <el-button type="primary" @click="searchMusic">
          <el-icon>
            <Search />
          </el-icon>
          搜索
        </el-button>

        <el-button @click="resetSearch">
          <el-icon>
            <Refresh />
          </el-icon>
          重置
        </el-button>
      </div>

      <div class="action-section">
        <el-button type="primary" @click="showUploadDialog">
          <el-icon>
            <Upload />
          </el-icon>
          上传音乐
        </el-button>

        <el-button @click="addMusic">
          <el-icon>
            <Plus />
          </el-icon>
          添加音乐
        </el-button>

        <el-button type="danger" @click="batchDelete">
          <el-icon>
            <Delete />
          </el-icon>
          批量删除
        </el-button>
      </div>
    </div>

    <!-- 音乐列表 -->
    <div class="table-container">
      <el-table :data="paginatedMusicList" v-loading="loading" stripe style="width: 100%" @selection-change="() => { }">
        <el-table-column type="selection" width="55" />

        <el-table-column prop="id" label="ID" width="80" />

        <el-table-column prop="title" label="标题" min-width="150">
          <template #default="{ row }">
            <div class="music-info">
              <div class="title">{{ row.title }}</div>
              <div class="artist">{{ row.artist }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="album" label="专辑" width="150" show-overflow-tooltip />

        <el-table-column prop="genre" label="类型" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ row.genre }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="duration" label="时长" width="80">
          <template #default="{ row }">
            {{ formatDuration(row.duration) }}
          </template>
        </el-table-column>

        <el-table-column prop="fileSize" label="大小" width="100">
          <template #default="{ row }">
            {{ formatFileSize(row.fileSize) }}
          </template>
        </el-table-column>

        <el-table-column prop="format" label="格式" width="80">
          <template #default="{ row }">
            <el-tag type="info" size="small">{{ row.format.toUpperCase() }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="analysisCount" label="分析次数" width="100" />

        <el-table-column prop="avgEmotion" label="主要情感" width="100">
          <template #default="{ row }">
            <el-tag type="success" size="small">{{ row.avgEmotion }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="uploadTime" label="上传时间" width="160" />

        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button type="primary" size="small" @click="editMusic(row)">
                <el-icon>
                  <Edit />
                </el-icon>
                编辑
              </el-button>
              <el-dropdown trigger="click">
                <el-button size="small">
                  更多
                  <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="reanalyze(row)">
                      <el-icon>
                        <Refresh />
                      </el-icon>
                      重新分析
                    </el-dropdown-item>
                    <el-dropdown-item @click="deleteMusic(row)" divided>
                      <el-icon>
                        <Delete />
                      </el-icon>
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
        :total="filteredMusicList.length" layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange" @current-change="handlePageChange" />
    </div>

    <!-- 添加/编辑音乐对话框 -->
    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑音乐' : '添加音乐'" width="600px" :close-on-click-modal="false">
      <el-form :model="musicForm" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="音乐标题" prop="title">
          <el-input v-model="musicForm.title" placeholder="请输入音乐标题" />
        </el-form-item>

        <el-form-item label="艺术家" prop="artist">
          <el-input v-model="musicForm.artist" placeholder="请输入艺术家" />
        </el-form-item>

        <el-form-item label="专辑">
          <el-input v-model="musicForm.album" placeholder="请输入专辑名称" />
        </el-form-item>

        <el-form-item label="音乐类型">
          <el-select v-model="musicForm.genre" placeholder="选择音乐类型" style="width: 100%">
            <el-option v-for="genre in genreOptions" :key="genre" :label="genre" :value="genre" />
          </el-select>
        </el-form-item>

        <el-form-item label="描述">
          <el-input v-model="musicForm.description" type="textarea" :rows="3" placeholder="请输入音乐描述（可选）" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveMusic" :loading="loading">
            {{ editMode ? '更新' : '添加' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 上传音乐对话框 -->
    <el-dialog v-model="uploadDialogVisible" title="上传音乐文件" width="600px" :close-on-click-modal="false">
      <div class="upload-section">
        <el-upload v-model:file-list="uploadFileList" class="upload-demo" drag multiple :before-upload="beforeUpload"
          :on-success="handleUploadSuccess" :on-error="handleUploadError" :auto-upload="false"
          accept=".mp3,.wav,.flac,.m4a,.aac">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将音乐文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              支持 mp3/wav/flac/m4a/aac 格式，单个文件不超过 50MB
            </div>
          </template>
        </el-upload>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmUpload" :loading="loading">
            确认上传
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.music-page {
  padding: 20px;
}

.page-header {
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

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-section {
  display: flex;
  gap: 12px;
  align-items: center;
}

.action-section {
  display: flex;
  gap: 12px;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.music-info .title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.music-info .artist {
  font-size: 12px;
  color: #6b7280;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.upload-section {
  margin: 20px 0;
}

.dialog-footer {
  text-align: right;
}

:deep(.el-upload-dragger) {
  width: 100%;
}

:deep(.el-table th) {
  background-color: #f8fafc;
  color: #374151;
  font-weight: 600;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: #f9fafb;
}

.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-buttons .el-button {
  margin: 0;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>