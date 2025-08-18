// 语音情感分析 - 用户端 API 类型定义

// 情感类型
export type EmotionType = 'happy' | 'sad' | 'angry' | 'neutral'

// 音频文件信息
export interface AudioFileInfo {
  id: number
  original_filename: string
  file_format: string
  file_size: string
  duration: string
  created_at?: string
}

// 情感分数
export interface EmotionScores {
  happy: number
  sad: number
  angry: number
  neutral: number
}

// 情感分析结果
export interface EmotionAnalysisResult {
  dominant_emotion: EmotionType
  confidence_score: number
  emotion_scores: EmotionScores
  processing_time?: number
}

// 分析记录条目
export interface AnalysisItem {
  id: number
  audio_file: AudioFileInfo
  emotion_analysis: EmotionAnalysisResult
  created_at: string
}

// 仪表板-统计
export interface DashboardStatistics {
  total_analyses: number
  recent_analyses: number
}

// 仪表板-情感分布
export interface DashboardEmotionDistribution {
  emotion: string
  count: number
}

// 仪表板-最近记录
export interface DashboardRecentRecord {
  id: number
  filename: string
  emotion: string
  confidence: number
  created_at: Date
}

// 仪表板响应（按后端实际返回结构）
export interface ClientDashboardResponse {
  code: number
  msg: string
  data: {
    statistics: DashboardStatistics
    emotion_distribution: DashboardEmotionDistribution[]
    recent_records: DashboardRecentRecord[]
  }
}

// 上传音频并分析 - 响应
export interface ClientUploadResponse {
  code: number
  message: string
  data: {
    analysis_id: number
    audio_file: AudioFileInfo
    emotion_analysis: Required<EmotionAnalysisResult>
  }
}

// 历史记录 - 请求参数
export interface ClientHistoryRequest {
  page?: number
  page_size?: number
  emotion?: EmotionType
  start_date?: string // YYYY-MM-DD
  end_date?: string   // YYYY-MM-DD
}

// 历史记录条目
export interface History {
  id: number
  audio_file_name: string
  primary_emotion: string
  primary_emotion_display: string
  confidence_score: number
  created_time: Date
  is_favorite: boolean
  notes: string
}

// 分页信息
export interface Pagination {
  current_page: number
  total_pages: number
  total_count: number
  page_size: number
}

// 历史记录响应（按后端实际返回结构）
export interface ClientHistoryResponse {
  code: number
  msg: string
  data: {
    histories: History[]
    pagination: Pagination
  }
}

// 分析详情-音频文件详细
export interface AudioFileDetail {
  id: number
  user: number
  user_name: string
  original_name: string
  file_path: string
  file_size: number
  file_size_mb: number
  duration: number
  duration_formatted: string
  format: string
  sample_rate: number
  status: string
  status_display: string
  upload_time: Date
  updated_time: Date
  description: string
}

// 分析详情-情感分数（完整）
export interface DetailEmotionScores {
  happy: number
  sad: number
  angry: number
  fear: number
  surprise: number
  disgust: number
  neutral: number
}

// 分析详情-情感分析详细
export interface EmotionAnalysisDetail {
  id: number
  audio_file: number
  audio_file_name: string
  primary_emotion: string
  primary_emotion_display: string
  confidence_score: number
  confidence_percentage: number
  happy_score: number
  sad_score: number
  angry_score: number
  fear_score: number
  surprise_score: number
  disgust_score: number
  neutral_score: number
  emotion_scores: DetailEmotionScores
  analysis_time: Date
  model_version: string
  processing_time: number
}

// 分析详情-数据结构
export interface ClientAnalysisDetailData {
  id: number
  user: number
  user_name: string
  audio_file: number
  audio_file_detail: AudioFileDetail
  emotion_analysis: number
  emotion_analysis_detail: EmotionAnalysisDetail
  created_time: Date
  is_favorite: boolean
  notes: string
}

// 分析详情响应（按后端实际返回结构）
export interface ClientAnalysisDetailResponse {
  code: number
  msg: string
  data: ClientAnalysisDetailData
}

// 个人资料
export interface ClientProfileData {
  user: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
  }
  phone: string
  avatar: string
  bio: string
  created_at: string
}

// 获取/更新个人资料 - 响应
export interface ClientProfileResponse {
  code: number
  message: string
  data: ClientProfileData
}

// 更新个人资料 - 请求体
export interface ClientProfileUpdateRequest {
  phone?: string
  bio?: string
}