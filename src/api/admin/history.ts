import http from '@/http'

// 情感分数接口
export interface EmotionScores {
  happy: number
  sad: number
  angry: number
  fear: number
  surprise: number
  disgust: number
  neutral: number
}

// 音频文件详情接口
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
  sample_rate?: number
  status: string
  status_display: string
  upload_time: string
  updated_time: string
  description?: string
}

// 情感分析详情接口
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
  emotion_scores: EmotionScores
  analysis_time: string
  model_version: string
  processing_time: number
}

// 分析记录接口类型
export interface AnalysisRecord {
  id: number
  user: number
  user_name: string
  audio_file: number
  audio_file_detail: AudioFileDetail
  emotion_analysis: number
  emotion_analysis_detail: EmotionAnalysisDetail
  created_time: string
  is_favorite: boolean
  notes?: string
}

// 分页信息接口
export interface Pagination {
  current_page: number
  total_pages: number
  total_count: number
  page_size: number
}

// API响应数据接口
export interface AnalysisHistoryData {
  analyses: AnalysisRecord[]
  pagination: Pagination
}

// 分析历史列表响应
export interface AnalysisHistoryResponse {
  code: number
  msg: string
  data: AnalysisHistoryData
}

// 分析历史查询参数
export interface AnalysisHistoryParams {
  page?: number
  page_size?: number
  keyword?: string
  user_id?: string
  username?: string
  emotion?: string
  start_date?: string
  end_date?: string
  status?: string
}

// 获取分析历史列表
export function getAnalysisHistoryAPI(params?: AnalysisHistoryParams): Promise<AnalysisHistoryResponse> {
  return http.get<AnalysisHistoryResponse>('/api/speech/admin/analyses/', { params })
}

// 获取分析记录详情
export function getAnalysisDetailAPI(id: number): Promise<AnalysisRecord> {
  return http.get<AnalysisRecord>(`/api/speech/admin/analyses/${id}`)
}

// 删除分析记录
export function deleteAnalysisAPI(id: number): Promise<any> {
  return http.delete(`/api/speech/admin/analyses/${id}`)
}

// 批量删除分析记录
export function batchDeleteAnalysisAPI(ids: number[]) {
  return http.post('/api/admin/analysis/batch-delete', { ids })
}

// 导出分析历史
export function exportAnalysisHistoryAPI(params?: AnalysisHistoryParams) {
  return http.get('/api/speech/admin/analysis/export', {
    params,
    responseType: 'blob'
  })
}

// 获取分析统计信息
export function getAnalysisStatsAPI() {
  return http.get('/admin/analysis/stats')
}

// 重新分析
export function reAnalyzeAPI(id: number) {
  return http.post(`/admin/analysis/${id}/reanalyze`)
}