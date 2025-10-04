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
            <h1 class="text-xl font-bold text-gray-900">商品与包装生命周期关联</h1>
            <p class="text-sm text-gray-500">理解商品生命周期各阶段的包装策略</p>
          </div>
          <div class="flex items-center">
            <!-- 点赞组件 -->
            <LikeButton 
              item-id="knowledge-product-packaging-lifecycle"
              :initial-count="22"
              @like-changed="handleLikeChanged"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 概述卡片 -->
      <div class="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-8">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800">📈 商品生命周期与包装策略</h2>
        </div>
        <p class="text-gray-700 leading-relaxed">
          商品生命周期是指商品从引入市场到最终退出市场的整个过程，通常分为四个主要阶段：引入期、成长期、成熟期和衰退期。
          每个阶段的市场特征、消费者行为和竞争环境都不同，因此需要相应调整包装策略来支持商品的市场表现。
        </p>
      </div>

      <!-- 生命周期阶段详解 -->
      <div class="grid lg:grid-cols-1 gap-8 mb-12">
        <!-- 生命周期图表 -->
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h3 class="text-xl font-bold text-gray-800 mb-6 text-center">商品生命周期曲线与包装策略</h3>
          
          <!-- 交互式生命周期图表 -->
          <div class="relative">
            <!-- 生命周期曲线背景 -->
            <div class="h-64 bg-gray-50 rounded-lg mb-8 relative overflow-hidden">
              <svg class="w-full h-full" viewBox="0 0 800 250">
                <!-- 背景网格 -->
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" stroke-width="1"/>
                  </pattern>
                </defs>
                <rect width="800" height="250" fill="url(#grid)" />
                
                <!-- 坐标轴 -->
                <line x1="50" y1="200" x2="750" y2="200" stroke="#374151" stroke-width="2"/>
                <line x1="50" y1="200" x2="50" y2="20" stroke="#374151" stroke-width="2"/>
                
                <!-- 坐标轴标签 -->
                <text x="400" y="235" text-anchor="middle" class="text-sm fill-gray-600">时间</text>
                <text x="20" y="110" text-anchor="middle" class="text-sm fill-gray-600" transform="rotate(-90 20 110)">销售额</text>
                
                <!-- 生命周期曲线 -->
                <path d="M 50 190 Q 150 180 200 150 Q 300 80 450 70 Q 550 65 600 80 Q 680 100 750 160" 
                      fill="none" stroke="url(#lifecycle-gradient)" stroke-width="4"/>
                
                <!-- 渐变定义 -->
                <defs>
                  <linearGradient id="lifecycle-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#ef4444;stop-opacity:1" />
                    <stop offset="25%" style="stop-color:#f97316;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#22c55e;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" />
                  </linearGradient>
                </defs>
                
                <!-- 阶段分隔线 -->
                <line x1="200" y1="20" x2="200" y2="200" stroke="#d1d5db" stroke-width="1" stroke-dasharray="5,5"/>
                <line x1="450" y1="20" x2="450" y2="200" stroke="#d1d5db" stroke-width="1" stroke-dasharray="5,5"/>
                <line x1="600" y1="20" x2="600" y2="200" stroke="#d1d5db" stroke-width="1" stroke-dasharray="5,5"/>
                
                <!-- 阶段标签 -->
                <text x="125" y="15" text-anchor="middle" class="text-sm font-semibold fill-red-600">引入期</text>
                <text x="325" y="15" text-anchor="middle" class="text-sm font-semibold fill-orange-600">成长期</text>
                <text x="525" y="15" text-anchor="middle" class="text-sm font-semibold fill-green-600">成熟期</text>
                <text x="675" y="15" text-anchor="middle" class="text-sm font-semibold fill-indigo-600">衰退期</text>
                
                <!-- 互动点 -->
                <circle cx="125" cy="170" r="6" fill="#ef4444" class="cursor-pointer hover:r-8 transition-all" @click="activeStage = 'introduction'"/>
                <circle cx="325" cy="100" r="6" fill="#f97316" class="cursor-pointer hover:r-8 transition-all" @click="activeStage = 'growth'"/>
                <circle cx="525" cy="70" r="6" fill="#22c55e" class="cursor-pointer hover:r-8 transition-all" @click="activeStage = 'maturity'"/>
                <circle cx="675" cy="130" r="6" fill="#6366f1" class="cursor-pointer hover:r-8 transition-all" @click="activeStage = 'decline'"/>
              </svg>
            </div>

            <!-- 阶段选择按钮 -->
            <div class="flex flex-wrap justify-center gap-4 mb-8">
              <button
                v-for="(stage, key) in lifecycleStages"
                :key="key"
                @click="activeStage = key"
                :class="[
                  'px-6 py-3 rounded-lg font-medium transition-all duration-200',
                  activeStage === key
                    ? stage.activeClass
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ stage.icon }} {{ stage.name }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 当前选中阶段的详细信息 -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div class="flex items-center mb-6">
          <div :class="[
            'w-12 h-12 rounded-full flex items-center justify-center mr-4 text-xl',
            lifecycleStages[activeStage].bgClass
          ]">
            {{ lifecycleStages[activeStage].icon }}
          </div>
          <div>
            <h3 class="text-2xl font-bold" :class="lifecycleStages[activeStage].textClass">
              {{ lifecycleStages[activeStage].name }}阶段
            </h3>
            <p class="text-gray-600">{{ lifecycleStages[activeStage].period }}</p>
          </div>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- 市场特征 -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-gray-800 flex items-center">
              <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              市场特征
            </h4>
            <ul class="space-y-2">
              <li v-for="feature in lifecycleStages[activeStage].marketFeatures" :key="feature" class="flex items-start">
                <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span class="text-gray-700 text-sm">{{ feature }}</span>
              </li>
            </ul>
          </div>

          <!-- 包装策略 -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-gray-800 flex items-center">
              <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
              包装策略
            </h4>
            <ul class="space-y-2">
              <li v-for="strategy in lifecycleStages[activeStage].packagingStrategies" :key="strategy" class="flex items-start">
                <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span class="text-gray-700 text-sm">{{ strategy }}</span>
              </li>
            </ul>
          </div>

          <!-- 关键考虑因素 -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-gray-800 flex items-center">
              <svg class="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              关键考虑
            </h4>
            <ul class="space-y-2">
              <li v-for="consideration in lifecycleStages[activeStage].keyConsiderations" :key="consideration" class="flex items-start">
                <span class="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span class="text-gray-700 text-sm">{{ consideration }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 实际案例 -->
        <div class="mt-8 p-6 bg-gray-50 rounded-lg">
          <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            实际案例：{{ lifecycleStages[activeStage].example.title }}
          </h4>
          <p class="text-gray-700 text-sm leading-relaxed">{{ lifecycleStages[activeStage].example.description }}</p>
        </div>
      </div>

      <!-- 包装生命周期管理最佳实践 -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <svg class="w-6 h-6 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          🎯 包装生命周期管理最佳实践
        </h3>
        
        <div class="grid md:grid-cols-2 gap-8">
          <div class="space-y-6">
            <div class="border-l-4 border-blue-500 pl-4">
              <h4 class="font-semibold text-gray-800 mb-2">📊 数据驱动决策</h4>
              <p class="text-gray-700 text-sm">
                通过市场研究、销售数据和消费者反馈，准确判断商品所处的生命周期阶段，并据此调整包装策略。
              </p>
            </div>
            
            <div class="border-l-4 border-green-500 pl-4">
              <h4 class="font-semibold text-gray-800 mb-2">🔄 灵活的包装系统</h4>
              <p class="text-gray-700 text-sm">
                建立模块化的包装设计系统，能够快速适应不同生命周期阶段的需求变化，降低重新设计成本。
              </p>
            </div>
            
            <div class="border-l-4 border-orange-500 pl-4">
              <h4 class="font-semibold text-gray-800 mb-2">💰 成本效益优化</h4>
              <p class="text-gray-700 text-sm">
                在不同阶段平衡包装投入与预期回报，确保包装策略与商品盈利能力相匹配。
              </p>
            </div>
          </div>
          
          <div class="space-y-6">
            <div class="border-l-4 border-purple-500 pl-4">
              <h4 class="font-semibold text-gray-800 mb-2">🌱 可持续发展考量</h4>
              <p class="text-gray-700 text-sm">
                在整个商品生命周期中融入环保理念，选择可回收、可降解的包装材料，承担企业社会责任。
              </p>
            </div>
            
            <div class="border-l-4 border-red-500 pl-4">
              <h4 class="font-semibold text-gray-800 mb-2">🎨 品牌一致性维护</h4>
              <p class="text-gray-700 text-sm">
                无论处于哪个生命周期阶段，都要保持品牌视觉识别的一致性，强化消费者对品牌的认知。
              </p>
            </div>
            
            <div class="border-l-4 border-teal-500 pl-4">
              <h4 class="font-semibold text-gray-800 mb-2">📈 前瞻性规划</h4>
              <p class="text-gray-700 text-sm">
                提前预测商品生命周期的转换节点，准备相应的包装策略，避免被动应对市场变化。
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 相关资源链接 -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h3 class="text-xl font-bold text-gray-800 mb-6">🔗 相关知识与工具</h3>
        <div class="grid md:grid-cols-3 gap-6">
          <router-link
            to="/knowledge/materials-overview"
            class="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-200"
          >
            <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
              <span class="text-white text-sm">📦</span>
            </div>
            <div>
              <h4 class="font-medium text-gray-900">包装材料选择</h4>
              <p class="text-xs text-gray-600">了解不同材料特性</p>
            </div>
          </router-link>

          <router-link
            to="/tools/color-recommendation"
            class="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-all duration-200"
          >
            <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4">
              <span class="text-white text-sm">🎨</span>
            </div>
            <div>
              <h4 class="font-medium text-gray-900">色彩心理分析</h4>
              <p class="text-xs text-gray-600">不同阶段的色彩策略</p>
            </div>
          </router-link>

          <router-link
            to="/knowledge/fsc"
            class="flex items-center p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-all duration-200"
          >
            <div class="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center mr-4">
              <span class="text-white text-sm">🌳</span>
            </div>
            <div>
              <h4 class="font-medium text-gray-900">可持续包装</h4>
              <p class="text-xs text-gray-600">环保认证与标准</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 点赞反馈消息 -->
    <div v-if="likeMessage" class="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
      {{ likeMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import LikeButton from '../../components/LikeButton.vue'
import { initializeDefaultLikes } from '../../services/likeService.js'

const activeStage = ref('introduction')
const likeMessage = ref('')

// 生命周期阶段数据
const lifecycleStages = reactive({
  introduction: {
    name: '引入期',
    icon: '🚀',
    period: '商品刚进入市场的初期阶段',
    activeClass: 'bg-red-500 text-white',
    bgClass: 'bg-red-500 text-white',
    textClass: 'text-red-600',
    marketFeatures: [
      '市场认知度低，消费者对产品陌生',
      '销售量较小，增长缓慢',
      '营销投入大，利润微薄甚至亏损',
      '竞争者少，市场空白较大',
      '产品功能需要教育市场'
    ],
    packagingStrategies: [
      '突出产品功能和使用方法说明',
      '采用醒目的设计吸引注意力',
      '强调品牌识别元素的建立',
      '包装信息要详细且易懂',
      '选择高端材质提升产品感知价值'
    ],
    keyConsiderations: [
      '包装成本控制与品质平衡',
      '法规合规性确保',
      '包装的教育功能最大化',
      '建立品牌差异化识别',
      '考虑小批量生产的经济性'
    ],
    example: {
      title: 'iPhone 初代(2007年)',
      description: 'iPhone 刚推出时，包装采用简洁的黑色设计，突出产品的革命性特征。包装正面大面积展示产品图片，背面详细说明触摸屏操作和核心功能，帮助消费者理解这款全新类别的产品。包装材质选用高品质纸板，传达高端定位。'
    }
  },
  growth: {
    name: '成长期',
    icon: '📈',
    period: '市场接受度提升，销量快速增长',
    activeClass: 'bg-orange-500 text-white',
    bgClass: 'bg-orange-500 text-white',
    textClass: 'text-orange-600',
    marketFeatures: [
      '市场认知度快速提升',
      '销售量急剧增长',
      '开始产生稳定利润',
      '竞争者开始进入市场',
      '产品功能逐渐被市场接受'
    ],
    packagingStrategies: [
      '强化品牌识别和记忆点',
      '优化包装结构降低成本',
      '增加产品系列化包装设计',
      '考虑大规模生产的包装效率',
      '建立统一的品牌包装体系'
    ],
    keyConsiderations: [
      '包装标准化以支持量产',
      '供应链优化和成本控制',
      '包装的货架表现力提升',
      '考虑不同销售渠道需求',
      '建立包装质量管控体系'
    ],
    example: {
      title: '特斯拉 Model S(2012-2015)',
      description: '在成长期，特斯拉优化了包装运输系统，建立了标准化的交付流程。车辆保护包装更加经济实用，同时保持了品牌的科技感。包装材料选择更加环保，体现了特斯拉的可持续理念，同时降低了单车包装成本。'
    }
  },
  maturity: {
    name: '成熟期',
    icon: '🏆',
    period: '市场饱和，竞争激烈，销量稳定',
    activeClass: 'bg-green-500 text-white',
    bgClass: 'bg-green-500 text-white',
    textClass: 'text-green-600',
    marketFeatures: [
      '市场饱和度较高',
      '销售量达到峰值后趋于平稳',
      '利润率稳定但开始下降',
      '竞争激烈，产品差异化困难',
      '消费者对产品非常熟悉'
    ],
    packagingStrategies: [
      '包装成为差异化竞争的关键',
      '推出限量版或特殊包装版本',
      '优化包装成本控制利润',
      '包装设计定期刷新保持新鲜感',
      '考虑包装的附加值功能'
    ],
    keyConsiderations: [
      '成本控制是首要考虑',
      '包装创新维持竞争优势',
      '可持续性包装提升形象',
      '包装自动化程度要求高',
      '多元化包装满足细分市场'
    ],
    example: {
      title: '可口可乐(成熟期产品)',
      description: '可口可乐在成熟期不断推出创新包装：个性化标签、节日限定包装、环保材质瓶子等。通过包装创新保持品牌活力，同时大规模标准化生产控制成本。包装设计兼顾全球一致性和本地化需求。'
    }
  },
  decline: {
    name: '衰退期',
    icon: '📉',
    period: '销量持续下降，市场逐渐萎缩',
    activeClass: 'bg-indigo-500 text-white',
    bgClass: 'bg-indigo-500 text-white',
    textClass: 'text-indigo-600',
    marketFeatures: [
      '销售量持续下滑',
      '利润空间进一步压缩',
      '竞争者开始退出市场',
      '技术或需求被替代',
      '库存积压风险增加'
    ],
    packagingStrategies: [
      '最大程度降低包装成本',
      '简化包装设计和结构',
      '考虑包装的清仓促销功能',
      '逐步减少包装投入',
      '准备包装的退市处理'
    ],
    keyConsiderations: [
      '极致的成本控制',
      '包装库存最小化',
      '环保处理方案规划',
      '法律责任和合规性维护',
      '品牌形象保护底线'
    ],
    example: {
      title: '传统胶片相机',
      description: '数码相机普及后，传统胶片相机进入衰退期。厂商大幅简化包装设计，使用更经济的材料，取消复杂的说明书，包装主要满足基本保护功能。部分品牌推出"复古情怀"包装，针对收藏爱好者市场。'
    }
  }
})

onMounted(() => {
  initializeDefaultLikes()
  document.title = '商品与包装生命周期关联 - 包装工具网'
})

// 处理点赞变化
const handleLikeChanged = (data) => {
  console.log('点赞变化:', data)
  if (data.liked) {
    likeMessage.value = '感谢您的支持！💼'
    setTimeout(() => likeMessage.value = '', 2000)
  }
}
</script>

<style scoped>
.transition-all {
  transition: all 0.3s ease;
}

/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* SVG 交互效果 */
svg circle {
  transition: r 0.2s ease;
}

svg circle:hover {
  cursor: pointer;
}
</style>