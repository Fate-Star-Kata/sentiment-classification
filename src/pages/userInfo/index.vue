<template>
  <div class="min-h-screen bg-white p-8 flex items-center justify-center relative overflow-hidden">
    <div class="w-full max-w-4xl mx-auto relative z-10">
      <!-- Tab 导航 -->
      <div class="flex gap-1 mb-8 bg-white/95 backdrop-blur-[20px] p-1.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] border border-white/20 animate-[slideInDown_0.6s_ease-out]">
        <button v-for="tab in tabList" :key="tab.key" 
          :class="[
            'flex-1 px-7 py-3.5 border-none rounded-xl bg-transparent text-slate-500 font-semibold text-[15px] cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] relative overflow-hidden not-italic',
            {
              'bg-blue-600 hover:text-white shadow-[0_4px_12px_rgba(37,99,235,0.3),0_2px_6px_rgba(37,99,235,0.2)] hover:bg-blue-700 hover:shadow-[0_6px_16px_rgba(37,99,235,0.4),0_3px_8px_rgba(37,99,235,0.3)]': activeTab === tab.key,
              'hover:bg-gradient-to-br hover:from-indigo-500/8 hover:to-purple-500/8 hover:text-indigo-600 hover:shadow-[0_4px_16px_rgba(99,102,241,0.2)] active:scale-[0.98]': activeTab !== tab.key
            }
          ]"
          @click="activeTab = tab.key">
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab 内容 -->
      <div class="min-h-[500px] bg-white/95 backdrop-blur-[20px] rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.15),0_8px_24px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] border border-white/20 overflow-hidden animate-[slideInUp_0.8s_ease-out_0.2s_both] relative">
        <AccountOverview v-show="activeTab === 'overview'" :active-tab="activeTab" @update:active-tab="activeTab = $event" />
        <BaseInfo v-show="activeTab === 'baseInfo'" />
        <ChangePassword v-show="activeTab === 'changePassword'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import AccountOverview from 'components/pages/userInfo/AccountOverview.vue'
import BaseInfo from 'components/pages/userInfo/BaseInfo.vue'
import ChangePassword from 'components/pages/userInfo/ChangePassword.vue'

// 定义页面元数据
defineOptions({
  name: 'UserInfo'
})

// 响应式数据
const activeTab = ref<string>('overview')

watch(activeTab, (val) => {
  console.log(val);

})

// Tab 列表配置
const tabList = reactive([
  {
    key: 'overview',
    label: '账户概览'
  },
  {
    key: 'baseInfo',
    label: '基本信息'
  },
  {
    key: 'changePassword',
    label: '修改密码'
  }
])
</script>

<style scoped>
@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
