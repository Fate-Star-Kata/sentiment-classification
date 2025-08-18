import serviceAxios from '@/http'
import type {
  ClientDashboardResponse,
  ClientUploadResponse,
  ClientHistoryRequest,
  ClientHistoryResponse,
  ClientAnalysisDetailResponse,
  ClientProfileResponse,
  ClientProfileUpdateRequest,
} from '@/types/apis/client_T'

// 获取用户仪表板数据
export function getClientDashboard(): Promise<ClientDashboardResponse> {
  return serviceAxios({
    url: '/api/speech/client/dashboard/',
    method: 'get',
  })
}

// 上传音频并进行情感分析
export function uploadClientAudio(file: File): Promise<ClientUploadResponse> {
  const formData = new FormData()
  formData.append('audio_file', file)
  return serviceAxios({
    url: '/api/speech/client/upload/',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 获取情感分析历史
export function getClientHistory(params: ClientHistoryRequest = {}): Promise<ClientHistoryResponse> {
  return serviceAxios({
    url: '/api/speech/client/history/',
    method: 'get',
    params,
  })
}

// 获取分析详情
export function getClientAnalysisDetail(analysis_id: number | string): Promise<ClientAnalysisDetailResponse> {
  return serviceAxios({
    url: `/api/speech/client/analysis/${analysis_id}/`,
    method: 'get',
  })
}

// 获取用户个人资料
export function getClientProfile(): Promise<ClientProfileResponse> {
  return serviceAxios({
    url: '/api/speech/client/profile/',
    method: 'get',
  })
}

// 更新用户个人资料
export function updateClientProfile(data: ClientProfileUpdateRequest): Promise<ClientProfileResponse> {
  return serviceAxios({
    url: '/api/speech/client/profile/',
    method: 'put',
    data,
  })
}
