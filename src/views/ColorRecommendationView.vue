<template>
  <div class="min-h-screen">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <div class="flex items-center justify-center mb-4">
          <h1 class="text-4xl font-bold text-white">
            🎨 色彩智能推荐工具
          </h1>
          <div class="ml-6">
            <!-- 点赞组件 -->
            <LikeButton 
              item-id="color-recommendation"
              :initial-count="38"
              @like-changed="handleLikeChanged"
            />
          </div>
        </div>
        <p class="text-lg text-gray-300 max-w-3xl mx-auto">
          专为包装设计师打造的智能配色系统。输入一个基础色彩，即可获得专业的配色方案、渐变组合和包装应用建议。
        </p>
        <!-- 点赞反馈消息 -->
        <div v-if="likeMessage" class="mt-4 text-pink-300 font-medium">
          {{ likeMessage }}
        </div>
      </div>

      <!-- 核心工具组件 -->
      <ColorRecommendationTool />
      
      <!-- 工具特色介绍 -->
      <div class="mt-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-8 backdrop-blur-lg border border-white/10">
        <h2 class="text-2xl font-bold text-white mb-8 text-center">
          ✨ 为什么选择我们的色彩智能推荐？
        </h2>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white/10 rounded-lg p-6 shadow-sm backdrop-blur-lg border border-white/10 text-center">
            <div class="text-4xl mb-4">🎯</div>
            <h3 class="font-semibold text-white mb-3">包装行业专业</h3>
            <p class="text-sm text-gray-300">
              专门针对包装设计优化，考虑材质、印刷和货架陈列等实际应用场景
            </p>
          </div>
          
          <div class="bg-white/10 rounded-lg p-6 shadow-sm backdrop-blur-lg border border-white/10 text-center">
            <div class="text-4xl mb-4">🌈</div>
            <h3 class="font-semibold text-white mb-3">智能配色算法</h3>
            <p class="text-sm text-gray-300">
              基于色彩理论和心理学，生成互补色、类似色、三分色等多种和谐配色方案
            </p>
          </div>
          
          <div class="bg-white/10 rounded-lg p-6 shadow-sm backdrop-blur-lg border border-white/10 text-center">
            <div class="text-4xl mb-4">🎨</div>
            <h3 class="font-semibold text-white mb-3">渐变组合生成</h3>
            <p class="text-sm text-gray-300">
              一键生成温暖、冷静、径向等多种渐变效果，CSS代码可直接复制使用
            </p>
          </div>
          
          <div class="bg-white/10 rounded-lg p-6 shadow-sm backdrop-blur-lg border border-white/10 text-center">
            <div class="text-4xl mb-4">🧠</div>
            <h3 class="font-semibold text-white mb-3">色彩心理分析</h3>
            <p class="text-sm text-gray-300">
              提供色彩的情感联想和品牌定位建议，帮助您做出更明智的设计决策
            </p>
          </div>
        </div>
      </div>

      <!-- 应用场景说明 -->
      <div class="mt-12 grid md:grid-cols-2 gap-8">
        <div class="bg-white/5 rounded-lg p-6 backdrop-blur-lg border border-white/10">
          <h3 class="text-xl font-semibold text-white mb-4 flex items-center">
            <span class="mr-3">📦</span>
            适用场景
          </h3>
          <ul class="space-y-3 text-gray-300 text-sm">
            <li class="flex items-start">
              <span class="text-green-400 mr-2">•</span>
              食品包装设计 - 刺激食欲的温暖色调
            </li>
            <li class="flex items-start">
              <span class="text-green-400 mr-2">•</span>
              化妆品包装 - 高贵优雅的珠光质感
            </li>
            <li class="flex items-start">
              <span class="text-green-400 mr-2">•</span>
              电子产品包装 - 专业可靠的科技色彩
            </li>
            <li class="flex items-start">
              <span class="text-green-400 mr-2">•</span>
              奢侈品包装 - 神秘高端的深色调
            </li>
            <li class="flex items-start">
              <span class="text-green-400 mr-2">•</span>
              医药健康产品 - 纯净安全的蓝绿色系
            </li>
            <li class="flex items-start">
              <span class="text-green-400 mr-2">•</span>
              儿童产品包装 - 活泼明亮的彩虹色彩
            </li>
          </ul>
        </div>

        <div class="bg-white/5 rounded-lg p-6 backdrop-blur-lg border border-white/10">
          <h3 class="text-xl font-semibold text-white mb-4 flex items-center">
            <span class="mr-3">💡</span>
            使用技巧
          </h3>
          <ul class="space-y-3 text-gray-300 text-sm">
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">1.</span>
              选择符合产品特性的应用场景，获得更精准的推荐
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">2.</span>
              点击配色方案中的颜色可快速切换为新的基础色
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">3.</span>
              渐变CSS代码可直接用于网页和包装设计软件
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">4.</span>
              参考色彩心理学分析，确保颜色传达正确的品牌信息
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">5.</span>
              在实际应用前建议制作样品测试印刷效果
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-2">6.</span>
              考虑包装材质对色彩的影响（光面/哑面/金属等）
            </li>
          </ul>
        </div>
      </div>

      <!-- 相关工具推荐 -->
      <div class="mt-12 bg-white/5 rounded-lg p-6 backdrop-blur-lg border border-white/10">
        <h3 class="text-xl font-semibold text-white mb-6 text-center">
          🔗 相关推荐工具
        </h3>
        <div class="grid md:grid-cols-3 gap-4">
          <router-link
            to="/tools/color-mode-converter"
            class="flex items-center p-4 bg-white/10 rounded-lg hover:bg-white/15 transition-all duration-200 border border-white/10"
          >
            <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
              <span class="text-white text-sm">🎨</span>
            </div>
            <div>
              <h4 class="font-medium text-white">色彩模式转换器</h4>
              <p class="text-xs text-gray-400">HEX/RGB/CMYK格式转换</p>
            </div>
          </router-link>

          <router-link
            to="/tools/color-difference"
            class="flex items-center p-4 bg-white/10 rounded-lg hover:bg-white/15 transition-all duration-200 border border-white/10"
          >
            <div class="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-4">
              <span class="text-white text-sm">👁️</span>
            </div>
            <div>
              <h4 class="font-medium text-white">颜色差异解释器</h4>
              <p class="text-xs text-gray-400">ΔE值可视化分析</p>
            </div>
          </router-link>

          <router-link
            to="/tools/packaging-icons"
            class="flex items-center p-4 bg-white/10 rounded-lg hover:bg-white/15 transition-all duration-200 border border-white/10"
          >
            <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mr-4">
              <span class="text-white text-sm">🏷️</span>
            </div>
            <div>
              <h4 class="font-medium text-white">包装图标库</h4>
              <p class="text-xs text-gray-400">环保认证标准图标</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ColorRecommendationTool from '../components/ColorRecommendationTool.vue'
import LikeButton from '../components/LikeButton.vue'
import { initializeDefaultLikes } from '../services/likeService.js'

const likeMessage = ref('')

onMounted(() => {
  initializeDefaultLikes()
})

// 处理点赞变化
const handleLikeChanged = (data) => {
  console.log('点赞变化:', data)
  if (data.liked) {
    likeMessage.value = '感谢您的支持！🌈'
    setTimeout(() => likeMessage.value = '', 2000)
  }
}
</script>

<style scoped>
.container {
  max-width: 1400px;
}

/* 添加一些自定义动画效果 */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(139, 92, 246, 0.2);
  }
}

.bg-gradient-to-r.from-blue-500\/10.to-purple-500\/10 {
  animation: pulse-glow 4s ease-in-out infinite;
}
</style>