<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 响应式数据
const loading = ref(false)
const activeTab = ref('system')

// 系统设置
const systemSettings = reactive({
  siteName: '音乐情感分析系统',
  siteDescription: '基于AI的音乐情感识别与分析平台',
  allowRegistration: true,
  requireEmailVerification: true,
  maxUploadSize: 50, // MB
  supportedFormats: ['mp3', 'wav', 'flac', 'm4a'],
  analysisTimeout: 30, // 秒
  maxDailyAnalysis: 100,
  enableCache: true,
  cacheExpiration: 24 // 小时
})

// 模型设置
const modelSettings = reactive({
  primaryModel: 'emotion-v2.1',
  backupModel: 'emotion-v1.8',
  confidenceThreshold: 0.75,
  enableEnsemble: true,
  modelUpdateInterval: 7, // 天
  autoRetrain: false,
  trainingDataSize: 10000,
  validationSplit: 0.2
})

// 安全设置
const securitySettings = reactive({
  enableTwoFactor: false,
  sessionTimeout: 120, // 分钟
  maxLoginAttempts: 5,
  lockoutDuration: 30, // 分钟
  enableIpWhitelist: false,
  ipWhitelist: '',
  enableAuditLog: true,
  logRetentionDays: 90
})

// 通知设置
const notificationSettings = reactive({
  enableEmailNotifications: true,
  enableSmsNotifications: false,
  adminEmail: 'admin@example.com',
  errorNotifications: true,
  performanceAlerts: true,
  userActivityAlerts: false,
  systemMaintenanceNotice: true
})

// 性能设置
const performanceSettings = reactive({
  maxConcurrentAnalysis: 10,
  enableLoadBalancing: false,
  cpuThreshold: 80, // %
  memoryThreshold: 85, // %
  diskThreshold: 90, // %
  enableAutoScaling: false,
  minInstances: 1,
  maxInstances: 5
})

// 可用模型列表
const availableModels = [
  { value: 'emotion-v2.1', label: '情感分析模型 v2.1 (推荐)' },
  { value: 'emotion-v1.8', label: '情感分析模型 v1.8' },
  { value: 'emotion-v1.5', label: '情感分析模型 v1.5' }
]

// 支持的音频格式
const audioFormats = [
  { value: 'mp3', label: 'MP3' },
  { value: 'wav', label: 'WAV' },
  { value: 'flac', label: 'FLAC' },
  { value: 'm4a', label: 'M4A' },
  { value: 'aac', label: 'AAC' },
  { value: 'ogg', label: 'OGG' }
]

// 保存设置
function saveSettings(type: string) {
  loading.value = true

  // 模拟API调用
  setTimeout(() => {
    loading.value = false
    ElMessage.success(`${getSettingsTypeName(type)}保存成功`)
  }, 1000)
}

// 重置设置
function resetSettings(type: string) {
  ElMessageBox.confirm(
    `确定要重置${getSettingsTypeName(type)}吗？此操作不可撤销。`,
    '确认重置',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 重置对应的设置
    switch (type) {
      case 'system':
        Object.assign(systemSettings, {
          siteName: '音乐情感分析系统',
          siteDescription: '基于AI的音乐情感识别与分析平台',
          allowRegistration: true,
          requireEmailVerification: true,
          maxUploadSize: 50,
          supportedFormats: ['mp3', 'wav', 'flac', 'm4a'],
          analysisTimeout: 30,
          maxDailyAnalysis: 100,
          enableCache: true,
          cacheExpiration: 24
        })
        break
      case 'model':
        Object.assign(modelSettings, {
          primaryModel: 'emotion-v2.1',
          backupModel: 'emotion-v1.8',
          confidenceThreshold: 0.75,
          enableEnsemble: true,
          modelUpdateInterval: 7,
          autoRetrain: false,
          trainingDataSize: 10000,
          validationSplit: 0.2
        })
        break
      case 'security':
        Object.assign(securitySettings, {
          enableTwoFactor: false,
          sessionTimeout: 120,
          maxLoginAttempts: 5,
          lockoutDuration: 30,
          enableIpWhitelist: false,
          ipWhitelist: '',
          enableAuditLog: true,
          logRetentionDays: 90
        })
        break
      case 'notification':
        Object.assign(notificationSettings, {
          enableEmailNotifications: true,
          enableSmsNotifications: false,
          adminEmail: 'admin@example.com',
          errorNotifications: true,
          performanceAlerts: true,
          userActivityAlerts: false,
          systemMaintenanceNotice: true
        })
        break
      case 'performance':
        Object.assign(performanceSettings, {
          maxConcurrentAnalysis: 10,
          enableLoadBalancing: false,
          cpuThreshold: 80,
          memoryThreshold: 85,
          diskThreshold: 90,
          enableAutoScaling: false,
          minInstances: 1,
          maxInstances: 5
        })
        break
    }
    ElMessage.success(`${getSettingsTypeName(type)}重置成功`)
  })
}

// 获取设置类型名称
function getSettingsTypeName(type: string): string {
  const names: Record<string, string> = {
    system: '系统设置',
    model: '模型设置',
    security: '安全设置',
    notification: '通知设置',
    performance: '性能设置'
  }
  return names[type] || '设置'
}

// 测试连接
function testConnection() {
  loading.value = true

  setTimeout(() => {
    loading.value = false
    ElMessage.success('连接测试成功')
  }, 2000)
}

// 清理缓存
function clearCache() {
  ElMessageBox.confirm(
    '确定要清理所有缓存吗？这可能会影响系统性能。',
    '确认清理',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    loading.value = true

    setTimeout(() => {
      loading.value = false
      ElMessage.success('缓存清理成功')
    }, 1500)
  })
}
</script>

<template>
  <div class="settings-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">系统设置</h2>
      <p class="page-description">配置音乐情感分析系统的各项参数和功能</p>
    </div>

    <!-- 设置选项卡 -->
    <el-tabs v-model="activeTab" class="settings-tabs">
      <!-- 系统设置 -->
      <el-tab-pane label="系统设置" name="system">
        <div class="settings-section">
          <div class="section-header">
            <h3>基本信息</h3>
            <p>配置系统的基本信息和功能参数</p>
          </div>

          <el-form :model="systemSettings" label-width="140px" class="settings-form">
            <el-form-item label="站点名称">
              <el-input v-model="systemSettings.siteName" placeholder="请输入站点名称" />
            </el-form-item>

            <el-form-item label="站点描述">
              <el-input v-model="systemSettings.siteDescription" type="textarea" :rows="3" placeholder="请输入站点描述" />
            </el-form-item>

            <el-form-item label="允许注册">
              <el-switch v-model="systemSettings.allowRegistration" />
            </el-form-item>

            <el-form-item label="邮箱验证">
              <el-switch v-model="systemSettings.requireEmailVerification" />
            </el-form-item>

            <el-form-item label="最大上传大小">
              <el-input-number v-model="systemSettings.maxUploadSize" :min="1" :max="500" controls-position="right" />
              <span class="unit">MB</span>
            </el-form-item>

            <el-form-item label="支持格式">
              <el-select v-model="systemSettings.supportedFormats" multiple placeholder="选择支持的音频格式" style="width: 100%">
                <el-option v-for="format in audioFormats" :key="format.value" :label="format.label"
                  :value="format.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="分析超时">
              <el-input-number v-model="systemSettings.analysisTimeout" :min="10" :max="300"
                controls-position="right" />
              <span class="unit">秒</span>
            </el-form-item>

            <el-form-item label="每日分析限制">
              <el-input-number v-model="systemSettings.maxDailyAnalysis" :min="1" :max="1000"
                controls-position="right" />
            </el-form-item>

            <el-form-item label="启用缓存">
              <el-switch v-model="systemSettings.enableCache" />
            </el-form-item>

            <el-form-item label="缓存过期时间" v-if="systemSettings.enableCache">
              <el-input-number v-model="systemSettings.cacheExpiration" :min="1" :max="168" controls-position="right" />
              <span class="unit">小时</span>
            </el-form-item>
          </el-form>

          <div class="section-actions">
            <el-button type="primary" @click="saveSettings('system')" :loading="loading">
              保存设置
            </el-button>
            <el-button @click="resetSettings('system')">
              重置设置
            </el-button>
            <el-button @click="clearCache" :loading="loading">
              清理缓存
            </el-button>
          </div>
        </div>
      </el-tab-pane>

      <!-- 模型设置 -->
      <el-tab-pane label="模型设置" name="model">
        <div class="settings-section">
          <div class="section-header">
            <h3>AI模型配置</h3>
            <p>配置情感分析模型的参数和行为</p>
          </div>

          <el-form :model="modelSettings" label-width="140px" class="settings-form">
            <el-form-item label="主要模型">
              <el-select v-model="modelSettings.primaryModel" style="width: 100%">
                <el-option v-for="model in availableModels" :key="model.value" :label="model.label"
                  :value="model.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="备用模型">
              <el-select v-model="modelSettings.backupModel" style="width: 100%">
                <el-option v-for="model in availableModels" :key="model.value" :label="model.label"
                  :value="model.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="置信度阈值">
              <el-slider v-model="modelSettings.confidenceThreshold" :min="0.1" :max="1" :step="0.05" show-input
                :format-tooltip="(val: number) => `${(val * 100).toFixed(0)}%`" />
            </el-form-item>

            <el-form-item label="启用集成学习">
              <el-switch v-model="modelSettings.enableEnsemble" />
            </el-form-item>

            <el-form-item label="模型更新间隔">
              <el-input-number v-model="modelSettings.modelUpdateInterval" :min="1" :max="30"
                controls-position="right" />
              <span class="unit">天</span>
            </el-form-item>

            <el-form-item label="自动重训练">
              <el-switch v-model="modelSettings.autoRetrain" />
            </el-form-item>

            <el-form-item label="训练数据大小" v-if="modelSettings.autoRetrain">
              <el-input-number v-model="modelSettings.trainingDataSize" :min="1000" :max="100000" :step="1000"
                controls-position="right" />
            </el-form-item>

            <el-form-item label="验证集比例" v-if="modelSettings.autoRetrain">
              <el-slider v-model="modelSettings.validationSplit" :min="0.1" :max="0.5" :step="0.05" show-input
                :format-tooltip="(val: number) => `${(val * 100).toFixed(0)}%`" />
            </el-form-item>
          </el-form>

          <div class="section-actions">
            <el-button type="primary" @click="saveSettings('model')" :loading="loading">
              保存设置
            </el-button>
            <el-button @click="resetSettings('model')">
              重置设置
            </el-button>
            <el-button @click="testConnection" :loading="loading">
              测试模型连接
            </el-button>
          </div>
        </div>
      </el-tab-pane>

      <!-- 安全设置 -->
      <el-tab-pane label="安全设置" name="security">
        <div class="settings-section">
          <div class="section-header">
            <h3>安全配置</h3>
            <p>配置系统的安全策略和访问控制</p>
          </div>

          <el-form :model="securitySettings" label-width="140px" class="settings-form">
            <el-form-item label="双因子认证">
              <el-switch v-model="securitySettings.enableTwoFactor" />
            </el-form-item>

            <el-form-item label="会话超时">
              <el-input-number v-model="securitySettings.sessionTimeout" :min="5" :max="480"
                controls-position="right" />
              <span class="unit">分钟</span>
            </el-form-item>

            <el-form-item label="最大登录尝试">
              <el-input-number v-model="securitySettings.maxLoginAttempts" :min="3" :max="10"
                controls-position="right" />
            </el-form-item>

            <el-form-item label="锁定时长">
              <el-input-number v-model="securitySettings.lockoutDuration" :min="5" :max="120"
                controls-position="right" />
              <span class="unit">分钟</span>
            </el-form-item>

            <el-form-item label="IP白名单">
              <el-switch v-model="securitySettings.enableIpWhitelist" />
            </el-form-item>

            <el-form-item label="白名单IP" v-if="securitySettings.enableIpWhitelist">
              <el-input v-model="securitySettings.ipWhitelist" type="textarea" :rows="3"
                placeholder="每行一个IP地址或IP段，例如：192.168.1.1 或 192.168.1.0/24" />
            </el-form-item>

            <el-form-item label="审计日志">
              <el-switch v-model="securitySettings.enableAuditLog" />
            </el-form-item>

            <el-form-item label="日志保留天数" v-if="securitySettings.enableAuditLog">
              <el-input-number v-model="securitySettings.logRetentionDays" :min="7" :max="365"
                controls-position="right" />
              <span class="unit">天</span>
            </el-form-item>
          </el-form>

          <div class="section-actions">
            <el-button type="primary" @click="saveSettings('security')" :loading="loading">
              保存设置
            </el-button>
            <el-button @click="resetSettings('security')">
              重置设置
            </el-button>
          </div>
        </div>
      </el-tab-pane>

      <!-- 通知设置 -->
      <el-tab-pane label="通知设置" name="notification">
        <div class="settings-section">
          <div class="section-header">
            <h3>通知配置</h3>
            <p>配置系统通知和告警设置</p>
          </div>

          <el-form :model="notificationSettings" label-width="140px" class="settings-form">
            <el-form-item label="邮件通知">
              <el-switch v-model="notificationSettings.enableEmailNotifications" />
            </el-form-item>

            <el-form-item label="短信通知">
              <el-switch v-model="notificationSettings.enableSmsNotifications" />
            </el-form-item>

            <el-form-item label="管理员邮箱">
              <el-input v-model="notificationSettings.adminEmail" placeholder="请输入管理员邮箱地址" />
            </el-form-item>

            <el-form-item label="错误通知">
              <el-switch v-model="notificationSettings.errorNotifications" />
            </el-form-item>

            <el-form-item label="性能告警">
              <el-switch v-model="notificationSettings.performanceAlerts" />
            </el-form-item>

            <el-form-item label="用户活动告警">
              <el-switch v-model="notificationSettings.userActivityAlerts" />
            </el-form-item>

            <el-form-item label="维护通知">
              <el-switch v-model="notificationSettings.systemMaintenanceNotice" />
            </el-form-item>
          </el-form>

          <div class="section-actions">
            <el-button type="primary" @click="saveSettings('notification')" :loading="loading">
              保存设置
            </el-button>
            <el-button @click="resetSettings('notification')">
              重置设置
            </el-button>
          </div>
        </div>
      </el-tab-pane>

      <!-- 性能设置 -->
      <el-tab-pane label="性能设置" name="performance">
        <div class="settings-section">
          <div class="section-header">
            <h3>性能配置</h3>
            <p>配置系统性能和资源管理参数</p>
          </div>

          <el-form :model="performanceSettings" label-width="140px" class="settings-form">
            <el-form-item label="最大并发分析">
              <el-input-number v-model="performanceSettings.maxConcurrentAnalysis" :min="1" :max="50"
                controls-position="right" />
            </el-form-item>

            <el-form-item label="负载均衡">
              <el-switch v-model="performanceSettings.enableLoadBalancing" />
            </el-form-item>

            <el-form-item label="CPU阈值">
              <el-slider v-model="performanceSettings.cpuThreshold" :min="50" :max="95" show-input
                :format-tooltip="(val: number) => `${val}%`" />
            </el-form-item>

            <el-form-item label="内存阈值">
              <el-slider v-model="performanceSettings.memoryThreshold" :min="50" :max="95" show-input
                :format-tooltip="(val: number) => `${val}%`" />
            </el-form-item>

            <el-form-item label="磁盘阈值">
              <el-slider v-model="performanceSettings.diskThreshold" :min="70" :max="95" show-input
                :format-tooltip="(val: number) => `${val}%`" />
            </el-form-item>

            <el-form-item label="自动扩缩容">
              <el-switch v-model="performanceSettings.enableAutoScaling" />
            </el-form-item>

            <el-form-item label="最小实例数" v-if="performanceSettings.enableAutoScaling">
              <el-input-number v-model="performanceSettings.minInstances" :min="1" :max="10"
                controls-position="right" />
            </el-form-item>

            <el-form-item label="最大实例数" v-if="performanceSettings.enableAutoScaling">
              <el-input-number v-model="performanceSettings.maxInstances" :min="1" :max="20"
                controls-position="right" />
            </el-form-item>
          </el-form>

          <div class="section-actions">
            <el-button type="primary" @click="saveSettings('performance')" :loading="loading">
              保存设置
            </el-button>
            <el-button @click="resetSettings('performance')">
              重置设置
            </el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.settings-page {
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

.settings-tabs {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.settings-section {
  padding: 24px;
}

.section-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.section-header p {
  color: #6b7280;
  margin: 0;
  font-size: 14px;
}

.settings-form {
  max-width: 600px;
}

.unit {
  margin-left: 8px;
  color: #6b7280;
  font-size: 14px;
}

.section-actions {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 12px;
}

:deep(.el-tabs__header) {
  margin: 0;
  background: #f9fafb;
  padding: 0 24px;
}

:deep(.el-tabs__nav-wrap::after) {
  display: none;
}

:deep(.el-tabs__item) {
  padding: 0 20px;
  height: 48px;
  line-height: 48px;
  font-weight: 500;
}

:deep(.el-tabs__item.is-active) {
  color: #409eff;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #374151;
}

:deep(.el-input-number) {
  width: 150px;
}

:deep(.el-slider) {
  margin-right: 20px;
}
</style>