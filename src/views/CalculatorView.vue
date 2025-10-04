<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 页面头部 -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center text-gray-600 hover:text-gray-900">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              返回首页
            </router-link>
          </div>
          <div class="text-center">
            <h1 class="text-xl font-bold text-gray-900">多功能包装计算器</h1>
            <p class="text-sm text-gray-500">集成常规、科学、包装、设计专业计算</p>
          </div>
          <div class="flex items-center">
            <!-- 点赞组件 -->
            <LikeButton 
              item-id="calculator"
              :initial-count="15"
              @like-changed="handleLikeChanged"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 功能介绍 -->
      <div class="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-8">
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl mb-2">🔢</div>
            <h3 class="font-semibold text-gray-800">基础计算</h3>
            <p class="text-sm text-gray-600">四则运算、清除、删除等基本功能</p>
          </div>
          <div class="text-center">
            <div class="text-2xl mb-2">🔬</div>
            <h3 class="font-semibold text-gray-800">科学计算</h3>
            <p class="text-sm text-gray-600">三角函数、对数、幂运算、数学常数</p>
          </div>
          <div class="text-center">
            <div class="text-2xl mb-2">📦</div>
            <h3 class="font-semibold text-gray-800">包装专业</h3>
            <p class="text-sm text-gray-600">材料用量、成本计算、拼版效率</p>
          </div>
          <div class="text-center">
            <div class="text-2xl mb-2">🎨</div>
            <h3 class="font-semibold text-gray-800">设计工具</h3>
            <p class="text-sm text-gray-600">黄金比例、DPI转换、色彩计算</p>
          </div>
        </div>
      </div>

      <!-- 计算器组件 -->
      <PackagingCalculator />

      <!-- 使用说明 -->
      <div class="mt-8 grid md:grid-cols-2 gap-8">
        <!-- 基础使用说明 -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            使用说明
          </h3>
          <div class="space-y-4 text-sm text-gray-600">
            <div>
              <h4 class="font-medium text-gray-800 mb-1">模式切换</h4>
              <p>点击顶部按钮在基础、科学、包装、设计四种模式间切换</p>
            </div>
            <div>
              <h4 class="font-medium text-gray-800 mb-1">基础计算</h4>
              <p>支持加减乘除运算，AC清空所有，CE清空当前输入，⌫删除最后一位</p>
            </div>
            <div>
              <h4 class="font-medium text-gray-800 mb-1">科学模式</h4>
              <p>三角函数计算使用弧度制，支持对数、开方、幂运算等</p>
            </div>
            <div>
              <h4 class="font-medium text-gray-800 mb-1">历史记录</h4>
              <p>右侧显示最近10条计算记录，点击可重新使用结果</p>
            </div>
          </div>
        </div>

        <!-- 专业功能说明 -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            专业功能
          </h3>
          <div class="space-y-4 text-sm text-gray-600">
            <div>
              <h4 class="font-medium text-gray-800 mb-1">包装计算</h4>
              <ul class="space-y-1 ml-4">
                <li>• 材料用量：根据尺寸、数量、损耗率计算总用量</li>
                <li>• 成本计算：材料单价与用量的成本核算</li>
                <li>• 拼版效率：自动计算最优排版方案</li>
              </ul>
            </div>
            <div>
              <h4 class="font-medium text-gray-800 mb-1">设计计算</h4>
              <ul class="space-y-1 ml-4">
                <li>• 黄金比例：输入一边长度，计算黄金比例尺寸</li>
                <li>• DPI转换：毫米尺寸转换为不同分辨率像素值</li>
                <li>• 色彩转换：HEX颜色转RGB/HSL，计算亮度</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- 快捷提示 -->
      <div class="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-yellow-700">
              <strong>提示：</strong>
              包装和设计专业计算功能需要在对应模式下的右侧面板中进行操作。科学计算中的三角函数使用弧度制，如需角度请先转换。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import PackagingCalculator from '../components/PackagingCalculator.vue'
import LikeButton from '../components/LikeButton.vue'
import { initializeDefaultLikes } from '../services/likeService.js'

const likeMessage = ref('')

onMounted(() => {
  document.title = '多功能包装计算器 - 包装工具网'
  initializeDefaultLikes()
})

// 处理点赞变化
const handleLikeChanged = (data) => {
  console.log('点赞变化:', data)
  if (data.liked) {
    likeMessage.value = '感谢您的支持！💖'
    setTimeout(() => likeMessage.value = '', 2000)
  }
}
</script>