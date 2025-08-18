<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- 侧边栏 -->
    <div class="w-64 bg-white shadow-sm border-r border-gray-200 flex-shrink-0">
      <div class="p-6">
        <div class="flex items-center mb-8">
          <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 class="text-xl font-bold text-gray-900">帮助中心</h1>
        </div>
        
        <nav class="space-y-2">
          <a 
            v-for="item in filteredMenuItems" 
            :key="item.id"
            @click="activeSection = item.id"
            :class="[
              'flex items-center px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors',
              activeSection === item.id 
                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIconPath(item.icon)"></path>
            </svg>
            <span v-html="highlightText(item.title, searchQuery)"></span>
          </a>
        </nav>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="flex-1 p-8">
      <!-- 搜索框 -->
      <div class="max-w-4xl mx-auto mb-8">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input 
            type="text" 
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="搜索帮助内容..."
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
        </div>
      </div>
      
      <!-- 内容区域 -->
      <div class="max-w-4xl mx-auto">
        <!-- 搜索无结果提示 -->
        <div v-if="searchQuery.trim() && !hasSearchResults" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div class="text-center py-12">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">未找到相关内容</h3>
            <p class="text-gray-500">尝试使用其他关键词搜索，或浏览左侧菜单查看所有帮助内容。</p>
            <button 
              @click="searchQuery = ''"
              class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              清除搜索
            </button>
          </div>
        </div>
        <!-- 快速开始 -->
        <div v-if="activeSection === 'quick-start'" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div class="flex items-center mb-6">
            <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900">快速开始</h2>
          </div>
          
          <p class="text-gray-600 mb-8">欢迎使用语音情感分析系统！本指南将帮助您快速上手，开始您的第一次情感分析。</p>
          
          <div class="space-y-8">
            <div class="flex items-start">
              <div class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-4">1</div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">注册账号</h3>
                <p class="text-gray-600">访问登录页面，点击"注册"选项卡，填写您的基本信息完成注册。</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-4">2</div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">登录系统</h3>
                <p class="text-gray-600">使用您注册的用户名和密码登录系统，进入主页面。</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-4">3</div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">录制或上传音频</h3>
                <p class="text-gray-600">在主页面，您可以选择实时录制语音或上传已有的音频文件。</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-4">4</div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">查看分析结果</h3>
                <p class="text-gray-600">系统将自动分析您的语音情感，并显示详细的分析结果和置信度。</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold mr-4">5</div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">管理历史记录</h3>
                <p class="text-gray-600">在历史记录页面查看所有分析记录，支持筛选和导出功能。</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 使用指南 -->
        <div v-if="activeSection === 'user-guide'" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div class="flex items-center mb-6">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900">使用指南</h2>
          </div>
          
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">音频录制</h3>
              <ul class="space-y-2 text-gray-600">
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  确保您的设备麦克风工作正常
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  在安静的环境中进行录制以获得最佳效果
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  建议录制时长在10-60秒之间
                </li>
              </ul>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">文件上传</h3>
              <ul class="space-y-2 text-gray-600">
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  支持的格式：MP3、WAV、M4A、FLAC
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  文件大小限制：最大50MB
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  推荐采样率：16kHz或更高
                </li>
              </ul>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">结果解读</h3>
              <ul class="space-y-2 text-gray-600">
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  置信度越高，分析结果越可靠
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  情感分布图显示各种情感的概率
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  可以下载详细的分析报告
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- 常见问题 -->
        <div v-if="activeSection === 'faq'" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div class="flex items-center mb-6">
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900">常见问题</h2>
          </div>
          
          <div class="space-y-6">
            <div v-for="faq in filteredFaqs" :key="faq.id" class="border-b border-gray-200 pb-6 last:border-b-0">
              <button 
                @click="toggleFaq(faq.id)"
                class="w-full text-left flex items-center justify-between py-2 focus:outline-none"
              >
                <h3 class="text-lg font-medium text-gray-900" v-html="highlightText(faq.question, searchQuery)"></h3>
                <svg 
                  :class="['w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ml-2', expandedFaq === faq.id ? 'rotate-180' : '']"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div v-if="expandedFaq === faq.id" class="mt-3 text-gray-600" v-html="highlightText(faq.answer, searchQuery)">
              </div>
            </div>
          </div>
        </div>
        
        <!-- 功能介绍 -->
        <div v-if="activeSection === 'features'" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div class="flex items-center mb-6">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900">功能介绍</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-6 border border-gray-200 rounded-lg">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">实时语音录制</h3>
              <p class="text-gray-600">支持实时录制语音，自动检测语音活动，提供高质量的音频采集。</p>
            </div>
            
            <div class="p-6 border border-gray-200 rounded-lg">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">情感分析</h3>
              <p class="text-gray-600">使用先进的AI算法分析语音中的情感特征，识别多种情感状态。</p>
            </div>
            
            <div class="p-6 border border-gray-200 rounded-lg">
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">详细报告</h3>
              <p class="text-gray-600">生成详细的分析报告，包含情感分布、置信度和可视化图表。</p>
            </div>
            
            <div class="p-6 border border-gray-200 rounded-lg">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">历史记录</h3>
              <p class="text-gray-600">保存所有分析记录，支持搜索、筛选和批量管理功能。</p>
            </div>
          </div>
        </div>
        
        <!-- 故障排除 -->
        <div v-if="activeSection === 'troubleshooting'" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div class="flex items-center mb-6">
            <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900">故障排除</h2>
          </div>
          
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">麦克风问题</h3>
              <ul class="space-y-2 text-gray-600">
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  检查浏览器是否允许麦克风访问权限
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  确认麦克风设备连接正常
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  尝试刷新页面重新获取权限
                </li>
              </ul>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">上传失败</h3>
              <ul class="space-y-2 text-gray-600">
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  检查文件格式是否支持
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  确认文件大小不超过限制
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  检查网络连接是否稳定
                </li>
              </ul>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">分析结果异常</h3>
              <ul class="space-y-2 text-gray-600">
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  确保音频质量清晰，无明显噪音
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  检查语音内容是否包含明显情感表达
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  尝试使用不同的音频文件进行测试
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- 联系我们 -->
        <div v-if="activeSection === 'contact'" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div class="flex items-center mb-6">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900">联系我们</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">技术支持</h3>
              <div class="space-y-3">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span class="text-gray-600">support@emotion-ai.com</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span class="text-gray-600">400-123-4567</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="text-gray-600">工作日 9:00-18:00</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">商务合作</h3>
              <div class="space-y-3">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span class="text-gray-600">business@emotion-ai.com</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span class="text-gray-600">北京市朝阳区科技园区</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-8 p-6 bg-blue-50 rounded-lg">
            <h4 class="text-lg font-semibold text-blue-900 mb-2">在线客服</h4>
            <p class="text-blue-700 mb-4">如果您有任何问题，可以通过在线客服获得即时帮助。</p>
            <button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              开始对话
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 当前激活的部分
const activeSection = ref('quick-start')

// 搜索查询
const searchQuery = ref('')

// 计算属性：过滤后的菜单项
const filteredMenuItems = computed(() => {
  if (!searchQuery.value.trim()) {
    return menuItems.value
  }
  const query = searchQuery.value.toLowerCase()
  return menuItems.value.filter(item => 
    item.title.toLowerCase().includes(query)
  )
})

// 计算属性：过滤后的FAQ
const filteredFaqs = computed(() => {
  if (!searchQuery.value.trim()) {
    return faqs.value
  }
  const query = searchQuery.value.toLowerCase()
  return faqs.value.filter(faq => 
    faq.question.toLowerCase().includes(query) || 
    faq.answer.toLowerCase().includes(query)
  )
})

// 计算属性：检查当前部分是否有搜索结果
const hasSearchResults = computed(() => {
  if (!searchQuery.value.trim()) return true
  
  if (activeSection.value === 'faq') {
    return filteredFaqs.value.length > 0
  }
  
  return filteredMenuItems.value.some(item => item.id === activeSection.value)
})

// 搜索时自动切换到有结果的部分
const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  
  // 如果当前部分没有搜索结果，切换到第一个有结果的部分
  if (!hasSearchResults.value && filteredMenuItems.value.length > 0) {
    activeSection.value = filteredMenuItems.value[0].id
  }
  
  // 如果搜索FAQ有结果，切换到FAQ部分
  if (filteredFaqs.value.length > 0 && !filteredMenuItems.value.some(item => item.id === activeSection.value)) {
    activeSection.value = 'faq'
  }
}

// 高亮搜索关键词
const highlightText = (text: string, query: string) => {
  if (!query.trim()) return text
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>')
}

// 展开的FAQ
const expandedFaq = ref<number | null>(null)

// 菜单项
const menuItems = ref([
  {
    id: 'quick-start',
    title: '快速开始',
    icon: 'RocketIcon'
  },
  {
    id: 'user-guide',
    title: '使用指南',
    icon: 'BookIcon'
  },
  {
    id: 'faq',
    title: '常见问题',
    icon: 'QuestionIcon'
  },
  {
    id: 'features',
    title: '功能介绍',
    icon: 'StarIcon'
  },
  {
    id: 'troubleshooting',
    title: '故障排除',
    icon: 'ToolIcon'
  },
  {
    id: 'contact',
    title: '联系我们',
    icon: 'PhoneIcon'
  }
])

// FAQ数据
const faqs = ref([
  {
    id: 1,
    question: '系统支持哪些音频格式？',
    answer: '系统支持MP3、WAV、M4A、FLAC等常见音频格式，推荐使用WAV格式以获得最佳分析效果。'
  },
  {
    id: 2,
    question: '分析一个音频文件需要多长时间？',
    answer: '通常情况下，分析时间取决于音频文件的长度，一般在10-30秒内完成。较长的音频文件可能需要更多时间。'
  },
  {
    id: 3,
    question: '如何提高分析结果的准确性？',
    answer: '为了获得更准确的结果，建议使用清晰的录音，避免背景噪音，确保语音内容包含明显的情感表达。'
  },
  {
    id: 4,
    question: '可以分析多长的音频文件？',
    answer: '系统支持最长5分钟的音频文件。对于较长的音频，建议分段上传以获得更精确的分析结果。'
  },
  {
    id: 5,
    question: '分析结果可以导出吗？',
    answer: '是的，您可以将分析结果导出为PDF报告或CSV数据文件，方便后续分析和存档。'
  },
  {
    id: 6,
    question: '系统是否支持实时分析？',
    answer: '目前系统支持实时录音和分析，您可以直接通过麦克风录制语音并获得即时的情感分析结果。'
  }
])

// 获取图标SVG路径
const getIconPath = (iconType: string) => {
  const iconPaths: Record<string, string> = {
    RocketIcon: 'M13 10V3L4 14h7v7l9-11h-7z',
    BookIcon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    QuestionIcon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    StarIcon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    ToolIcon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
    PhoneIcon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
  }
  return iconPaths[iconType] || ''
}

// 切换FAQ展开状态
const toggleFaq = (id: number) => {
  expandedFaq.value = expandedFaq.value === id ? null : id
}
</script>

<style scoped lang="scss">
// 自定义样式可以在这里添加
</style>
