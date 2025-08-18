import type { ApiResponse } from '@/types/components/admin'
import serviceAxios from '@/http'

// 情感分布项接口
export interface EmotionDistributionItem {
  primary_emotion: string
  count: number
}

// 最近活动项接口
export interface RecentActivity {
  id: number
  user: string
  emotion: string
  audio_file: string
  created_at: string
}

// 用户统计数据接口
export interface UserStats {
  total_users: number
  active_users: number
}

// 音频统计数据接口
export interface AudioStats {
  total_files: number
}

// 分析统计数据接口
export interface AnalysisStats {
  analyses_today: number
  analyses_week: number
}

// 管理员仪表板数据类型
export interface DashboardStats {
  user_stats: UserStats
  audio_stats: AudioStats
  analysis_stats: AnalysisStats
  emotion_distribution: EmotionDistributionItem[]
  recent_activities: RecentActivity[]
}

export interface DashboardResponse extends ApiResponse {
  data: DashboardStats
}

// 获取管理员仪表板数据
export function getDashboardStatsAPI(): Promise<DashboardResponse> {
  return serviceAxios({
    url: '/api/speech/admin/dashboard/',
    method: 'get'
  })
}

// 获取系统统计数据
export function getSystemStatsAPI(): Promise<ApiResponse> {
  return serviceAxios({
    url: '/speech/admin/stats/',
    method: 'get'
  })
}

// 获取实时数据
export function getRealTimeDataAPI(): Promise<ApiResponse> {
  return serviceAxios({
    url: '/speech/admin/realtime/',
    method: 'get'
  })
}