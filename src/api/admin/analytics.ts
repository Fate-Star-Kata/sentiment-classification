import http from '@/http'

// 分析记录接口类型
export interface AnalysisRecord {
  id: number
  user_name: string
  audio_file_detail: {
    id: number
    original_name: string
    duration_formatted: string
    status_display: string
  }
  emotion_analysis_detail: {
    primary_emotion_display: string
    confidence_percentage: number
  }
  is_favorite: boolean
  notes: string
}

// 分析记录列表响应
export interface AnalysisRecordsResponse {
  code: number
  msg: string
  data: {
    analyses: AnalysisRecord[]
    pagination: {
      total_count: number
    }
  }
}

// 分析记录查询参数
export interface AnalysisRecordsParams {
  page?: number
  page_size?: number
  keyword?: string
  emotion?: string
  start_date?: string
  end_date?: string
  status?: string
}

// 分析统计数据
export interface AnalyticsStats {
  total_users: number
  total_analyses: number
  today_analyses: number
  avg_accuracy: number
  emotion_distribution: {
    [key: string]: number
  }
  trend_data: {
    dates: string[]
    analysis_counts: number[]
    accuracy_rates: number[]
  }
  device_distribution: {
    name: string
    value: number
  }[]
}

// 获取分析记录列表
export function getAnalysisRecordsAPI(params?: AnalysisRecordsParams) {
  return http.get<AnalysisRecordsResponse>('/api/speech/admin/analyses/', { params })
}

// 获取分析统计数据
export function getAnalyticsStatsAPI() {
  return http.get<AnalyticsStats>('/api/speech/admin/analytics/stats/')
}

// 导出分析数据
export function exportAnalyticsDataAPI(params?: AnalysisRecordsParams) {
  return http.get('/api/speech/admin/analytics/export/', {
    params,
    responseType: 'blob'
  })
}