<template>
  <div class="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
      <div class="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded mr-3"></div>
      色彩智能推荐工具
    </h2>

    <!-- 输入区域 -->
    <div class="bg-gray-50 rounded-lg p-6 mb-8">
      <h3 class="text-lg font-semibold mb-4">输入基础色彩</h3>
      <div class="grid md:grid-cols-3 gap-6">
        <!-- 颜色输入 -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">HEX颜色</label>
            <div class="flex items-center space-x-3">
              <input
                v-model="inputColor"
                @input="updateColor"
                type="text"
                placeholder="#FF6B6B"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div
                class="w-12 h-10 rounded-md border-2 border-gray-300 cursor-pointer"
                :style="{ backgroundColor: inputColor }"
                @click="openColorPicker"
              ></div>
            </div>
          </div>
          
          <!-- 隐藏的颜色选择器 -->
          <input
            ref="colorPicker"
            v-model="inputColor"
            @input="updateColor"
            type="color"
            class="sr-only"
          />
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">应用场景</label>
            <select
              v-model="selectedCategory"
              @change="generateRecommendations"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="food">食品包装</option>
              <option value="cosmetic">化妆品</option>
              <option value="electronics">电子产品</option>
              <option value="luxury">奢侈品</option>
              <option value="healthcare">医药健康</option>
              <option value="children">儿童产品</option>
            </select>
          </div>
        </div>

        <!-- 色彩预览 -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">当前色彩</label>
            <div
              class="w-full h-24 rounded-lg border-2 border-gray-200"
              :style="{ backgroundColor: inputColor }"
            ></div>
          </div>
          <div class="text-sm text-gray-600 space-y-1">
            <p><strong>HEX:</strong> {{ inputColor }}</p>
            <p><strong>RGB:</strong> {{ rgbString }}</p>
            <p><strong>HSL:</strong> {{ hslString }}</p>
          </div>
        </div>

        <!-- 快速操作 -->
        <div class="space-y-4">
          <button
            @click="generateRecommendations"
            :disabled="isGenerating"
            class="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all font-medium"
          >
            {{ isGenerating ? '生成中...' : '🎨 生成推荐' }}
          </button>
          
          <button
            @click="randomColor"
            class="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            🎲 随机色彩
          </button>
          
          <button
            @click="clearAll"
            class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            🗑️ 清空
          </button>
        </div>
      </div>
    </div>

    <!-- 推荐结果 -->
    <div v-if="recommendations.palettes.length > 0" class="space-y-8">
      <!-- 配色方案 -->
      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-800">🎨 智能配色方案</h3>
          <div class="text-sm text-gray-500">
            基于 {{ getCategoryName(selectedCategory) }} 行业特点
          </div>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(palette, index) in recommendations.palettes"
            :key="index"
            class="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-gray-800">{{ palette.name }}</h4>
              <button
                @click="copyPalette(palette)"
                class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
              >
                复制
              </button>
            </div>
            
            <!-- 色彩条 -->
            <div class="flex rounded-lg overflow-hidden mb-3 h-16">
              <div
                v-for="(color, colorIndex) in palette.colors"
                :key="colorIndex"
                class="flex-1 cursor-pointer relative group"
                :style="{ backgroundColor: color }"
                @click="selectColor(color)"
              >
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span class="bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                    {{ color }}
                  </span>
                </div>
              </div>
            </div>
            
            <p class="text-xs text-gray-600">{{ palette.description }}</p>
          </div>
        </div>
      </div>

      <!-- 渐变组合 -->
      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-6">🌈 渐变组合推荐</h3>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div
            v-for="(gradient, index) in recommendations.gradients"
            :key="index"
            class="bg-gray-50 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-gray-800">{{ gradient.name }}</h4>
              <button
                @click="copyGradientCSS(gradient)"
                class="text-xs bg-green-100 text-green-600 px-2 py-1 rounded hover:bg-green-200 transition-colors"
              >
                复制CSS
              </button>
            </div>
            
            <!-- 渐变预览 -->
            <div
              class="w-full h-20 rounded-lg mb-3"
              :style="{ background: gradient.css }"
            ></div>
            
            <div class="space-y-2 text-xs text-gray-600">
              <p><strong>方向:</strong> {{ gradient.direction }}</p>
              <p><strong>应用:</strong> {{ gradient.usage }}</p>
              <div class="bg-gray-100 p-2 rounded text-xs font-mono">
                {{ gradient.css }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 包装应用建议 -->
      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-6">📦 包装应用建议</h3>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="(suggestion, index) in recommendations.packagingSuggestions"
            :key="index"
            class="bg-gray-50 rounded-lg p-4 text-center"
          >
            <div class="text-2xl mb-2">{{ suggestion.icon }}</div>
            <h4 class="font-medium text-gray-800 mb-2">{{ suggestion.title }}</h4>
            <p class="text-xs text-gray-600">{{ suggestion.description }}</p>
          </div>
        </div>
      </div>

      <!-- 色彩心理学分析 -->
      <div class="bg-blue-50 rounded-lg p-6">
        <h3 class="text-xl font-semibold text-blue-800 mb-4">🧠 色彩心理学分析</h3>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-medium text-blue-800 mb-3">情感联想</h4>
            <div class="space-y-2">
              <div
                v-for="emotion in recommendations.psychology.emotions"
                :key="emotion"
                class="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-2 mb-2"
              >
                {{ emotion }}
              </div>
            </div>
          </div>
          <div>
            <h4 class="font-medium text-blue-800 mb-3">品牌定位建议</h4>
            <p class="text-sm text-blue-700">{{ recommendations.psychology.brandAdvice }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用提示 -->
    <div class="mt-8 bg-yellow-50 rounded-lg p-4">
      <div class="flex items-start">
        <div class="flex-shrink-0 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
          <span class="text-white text-sm">💡</span>
        </div>
        <div class="text-sm text-yellow-800">
          <h4 class="font-medium mb-2">使用小贴士:</h4>
          <ul class="space-y-1 list-disc list-inside">
            <li>选择与产品特性匹配的应用场景获得更精准的推荐</li>
            <li>点击配色方案中的任意颜色可快速切换为新的基础色</li>
            <li>渐变CSS代码可直接用于网页和包装设计软件</li>
            <li>建议在实际应用前进行样品测试，确保印刷效果</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// 响应式数据
const inputColor = ref('#FF6B6B')
const selectedCategory = ref('food')
const isGenerating = ref(false)
const colorPicker = ref(null)

const recommendations = reactive({
  palettes: [],
  gradients: [],
  packagingSuggestions: [],
  psychology: {
    emotions: [],
    brandAdvice: ''
  }
})

// 计算属性
const rgbColor = computed(() => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(inputColor.value)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 107, b: 107 }
})

const rgbString = computed(() => 
  `rgb(${rgbColor.value.r}, ${rgbColor.value.g}, ${rgbColor.value.b})`
)

const hslColor = computed(() => {
  const { r, g, b } = rgbColor.value
  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255
  
  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break
      case gNorm: h = (bNorm - rNorm) / d + 2; break
      case bNorm: h = (rNorm - gNorm) / d + 4; break
    }
    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
})

const hslString = computed(() => 
  `hsl(${hslColor.value.h}, ${hslColor.value.s}%, ${hslColor.value.l}%)`
)

// 方法
const updateColor = () => {
  if (recommendations.palettes.length > 0) {
    generateRecommendations()
  }
}

const openColorPicker = () => {
  colorPicker.value?.click()
}

const randomColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ]
  inputColor.value = colors[Math.floor(Math.random() * colors.length)]
  updateColor()
}

const clearAll = () => {
  recommendations.palettes = []
  recommendations.gradients = []
  recommendations.packagingSuggestions = []
  recommendations.psychology = { emotions: [], brandAdvice: '' }
}

const selectColor = (color) => {
  inputColor.value = color
  updateColor()
}

const getCategoryName = (category) => {
  const names = {
    food: '食品包装',
    cosmetic: '化妆品',
    electronics: '电子产品', 
    luxury: '奢侈品',
    healthcare: '医药健康',
    children: '儿童产品'
  }
  return names[category] || '通用'
}

const generateRecommendations = async () => {
  isGenerating.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1500)) // 模拟API调用
    
    const { h, s, l } = hslColor.value
    
    // 生成配色方案
    recommendations.palettes = generateColorPalettes(h, s, l)
    
    // 生成渐变组合
    recommendations.gradients = generateGradients(inputColor.value, h, s, l)
    
    // 生成包装应用建议
    recommendations.packagingSuggestions = generatePackagingSuggestions(selectedCategory.value)
    
    // 生成心理学分析
    recommendations.psychology = generatePsychologyAnalysis(h, s, l, selectedCategory.value)
    
  } catch (error) {
    console.error('生成推荐失败:', error)
  } finally {
    isGenerating.value = false
  }
}

const generateColorPalettes = (h, s, l) => {
  return [
    {
      name: '互补色方案',
      colors: [
        inputColor.value,
        hslToHex((h + 180) % 360, s, l),
        hslToHex(h, Math.max(20, s - 30), Math.min(90, l + 20)),
        hslToHex((h + 180) % 360, Math.max(20, s - 30), Math.min(90, l + 20)),
        hslToHex(h, Math.max(10, s - 50), 90)
      ],
      description: '经典对比色搭配，视觉冲击力强，适合需要突出产品的场景'
    },
    {
      name: '类似色方案',
      colors: [
        inputColor.value,
        hslToHex((h + 30) % 360, s, l),
        hslToHex((h - 30 + 360) % 360, s, l),
        hslToHex((h + 60) % 360, Math.max(20, s - 20), l),
        hslToHex((h - 60 + 360) % 360, Math.max(20, s - 20), l)
      ],
      description: '和谐统一的色彩组合，给人舒适温和的感觉，适合品牌调性温和的产品'
    },
    {
      name: '三分色方案',
      colors: [
        inputColor.value,
        hslToHex((h + 120) % 360, s, l),
        hslToHex((h + 240) % 360, s, l),
        hslToHex(h, Math.max(30, s - 40), Math.min(85, l + 15)),
        hslToHex((h + 120) % 360, Math.max(30, s - 40), Math.min(85, l + 15))
      ],
      description: '充满活力的三色搭配，平衡且富有变化，适合年轻时尚的产品定位'
    },
    {
      name: '分补色方案',
      colors: [
        inputColor.value,
        hslToHex((h + 150) % 360, s, l),
        hslToHex((h + 210) % 360, s, l),
        hslToHex(h, Math.min(100, s + 20), Math.max(20, l - 20)),
        hslToHex((h + 180) % 360, Math.max(20, s - 30), Math.min(90, l + 30))
      ],
      description: '既有对比又保持和谐，比互补色更柔和，适合高端产品包装'
    },
    {
      name: '单色渐变方案',
      colors: [
        hslToHex(h, s, Math.max(20, l - 30)),
        hslToHex(h, s, Math.max(10, l - 15)),
        inputColor.value,
        hslToHex(h, Math.max(20, s - 20), Math.min(85, l + 15)),
        hslToHex(h, Math.max(10, s - 40), Math.min(95, l + 30))
      ],
      description: '同一色相的深浅变化，简洁优雅，适合极简风格和专业品牌'
    }
  ]
}

const generateGradients = (baseColor, h, s, l) => {
  return [
    {
      name: '温暖渐变',
      css: `linear-gradient(45deg, ${baseColor}, ${hslToHex((h + 30) % 360, Math.min(100, s + 20), Math.min(80, l + 10))})`,
      direction: '45°斜角',
      usage: '适合温馨、活力的产品包装，如食品、儿童用品'
    },
    {
      name: '冷静渐变',
      css: `linear-gradient(135deg, ${baseColor}, ${hslToHex((h + 180) % 360, s, Math.max(30, l - 20))})`,
      direction: '135°斜角',
      usage: '适合专业、可靠的产品形象，如电子产品、医疗用品'
    },
    {
      name: '径向渐变',
      css: `radial-gradient(circle, ${baseColor}, ${hslToHex(h, Math.max(20, s - 30), Math.max(20, l - 30))})`,
      direction: '径向扩散',
      usage: '适合圆形包装或需要聚焦效果的设计'
    },
    {
      name: '三色渐变',
      css: `linear-gradient(90deg, ${hslToHex((h - 30 + 360) % 360, s, l)}, ${baseColor}, ${hslToHex((h + 30) % 360, s, l)})`,
      direction: '水平渐变',
      usage: '丰富的色彩层次，适合时尚、创意产品包装'
    },
    {
      name: '夕阳渐变',
      css: `linear-gradient(180deg, ${baseColor}, ${hslToHex((h + 60) % 360, Math.min(100, s + 30), Math.max(40, l - 10))}, ${hslToHex((h + 30) % 360, Math.min(100, s + 20), Math.max(20, l - 20))})`,
      direction: '垂直渐变',
      usage: '温暖浪漫的氛围，适合化妆品、香氛类产品'
    },
    {
      name: '科技渐变',
      css: `linear-gradient(45deg, ${baseColor}, ${hslToHex((h + 240) % 360, Math.max(50, s), Math.min(70, l + 5))})`,
      direction: '45°科技感',
      usage: '现代科技感，适合电子产品、数码配件包装'
    }
  ]
}

const generatePackagingSuggestions = (category) => {
  const suggestions = {
    food: [
      { icon: '🍎', title: '主色应用', description: '用于品牌LOGO和主要产品信息' },
      { icon: '📦', title: '辅助色搭配', description: '用于营养成分和产品特点标识' },
      { icon: '🌿', title: '环保元素', description: '绿色系辅助色突出天然健康' },
      { icon: '⚡', title: '活力点缀', description: '明亮色彩吸引消费者注意力' }
    ],
    cosmetic: [
      { icon: '💄', title: '奢华质感', description: '深色背景搭配金属色点缀' },
      { icon: '✨', title: '渐变效果', description: '柔和渐变营造高端美感' },
      { icon: '🌸', title: '女性化色调', description: '粉色系增加亲和力' },
      { icon: '💎', title: '精致细节', description: '珠光色彩提升产品档次' }
    ],
    electronics: [
      { icon: '⚡', title: '科技蓝', description: '蓝色系传达专业可靠感' },
      { icon: '🔋', title: '简约设计', description: '黑白灰主色调体现现代感' },
      { icon: '💡', title: '功能色彩', description: '用色彩区分不同功能特性' },
      { icon: '🎯', title: '重点突出', description: '鲜明色彩标识重要信息' }
    ],
    luxury: [
      { icon: '👑', title: '奢华金', description: '金色元素提升尊贵感' },
      { icon: '🖤', title: '经典黑', description: '黑色背景营造神秘高端' },
      { icon: '💎', title: '质感材质', description: '配合特殊工艺增强视觉效果' },
      { icon: '🎭', title: '艺术感', description: '独特配色体现品牌个性' }
    ],
    healthcare: [
      { icon: '🏥', title: '医疗白', description: '白色传达纯净专业形象' },
      { icon: '💚', title: '健康绿', description: '绿色象征健康和生命力' },
      { icon: '🛡️', title: '信任蓝', description: '蓝色建立信任和安全感' },
      { icon: '📋', title: '清晰标识', description: '高对比度确保信息清晰' }
    ],
    children: [
      { icon: '🌈', title: '彩虹色彩', description: '丰富色彩激发想象力' },
      { icon: '🎈', title: '活泼明亮', description: '鲜艳色彩吸引儿童注意' },
      { icon: '🧸', title: '温暖色调', description: '温暖色彩给予安全感' },
      { icon: '⭐', title: '趣味元素', description: '有趣的色彩组合增加亲和力' }
    ]
  }
  
  return suggestions[category] || suggestions.food
}

const generatePsychologyAnalysis = (h, s, l, category) => {
  let emotions = []
  let brandAdvice = ''
  
  // 基于色相分析情感
  if (h >= 0 && h < 30) {
    emotions = ['热情', '活力', '温暖', '刺激食欲']
    brandAdvice = '红色系给人强烈的视觉冲击，适合需要快速吸引注意力的产品，但要注意不要过于刺眼。'
  } else if (h >= 30 && h < 60) {
    emotions = ['快乐', '阳光', '创意', '活泼']
    brandAdvice = '橙黄色系充满活力和创意，特别适合年轻消费群体和创新产品。'
  } else if (h >= 60 && h < 120) {
    emotions = ['自然', '健康', '成长', '和谐']
    brandAdvice = '绿色系象征自然和健康，非常适合有机食品、环保产品和医疗保健类产品。'
  } else if (h >= 120 && h < 240) {
    emotions = ['冷静', '专业', '信任', '科技']
    brandAdvice = '蓝色系传达专业和可信赖的形象，是科技、金融、医疗等行业的首选。'
  } else if (h >= 240 && h < 300) {
    emotions = ['神秘', '高贵', '创意', '奢华']
    brandAdvice = '紫色系具有独特的神秘感和高贵气质，适合高端品牌和创意产品。'
  } else {
    emotions = ['浪漫', '温柔', '女性化', '甜美']
    brandAdvice = '粉红色系温柔浪漫，特别适合女性消费群体和美妆、母婴类产品。'
  }
  
  // 基于饱和度和亮度调整
  if (s < 30) {
    emotions.push('优雅', '内敛')
  } else if (s > 70) {
    emotions.push('鲜明', '张扬')
  }
  
  if (l < 30) {
    emotions.push('神秘', '稳重')
  } else if (l > 70) {
    emotions.push('轻松', '纯净')
  }
  
  return { emotions, brandAdvice }
}

const copyPalette = async (palette) => {
  const text = palette.colors.join(', ')
  try {
    await navigator.clipboard.writeText(text)
    console.log('配色方案已复制:', text)
    // 这里可以添加成功提示
  } catch (err) {
    console.error('复制失败:', err)
  }
}

const copyGradientCSS = async (gradient) => {
  try {
    await navigator.clipboard.writeText(gradient.css)
    console.log('渐变CSS已复制:', gradient.css)
    // 这里可以添加成功提示
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// HSL转HEX工具函数
const hslToHex = (h, s, l) => {
  h /= 360
  s /= 100
  l /= 100
  
  const a = s * Math.min(l, 1 - l)
  const f = n => {
    const k = (n + h * 12) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase()
}

// 组件挂载时自动生成推荐
onMounted(() => {
  generateRecommendations()
})
</script>

<style scoped>
/* 可以添加自定义动画和样式 */
.gradient-preview {
  background-size: 200% 200%;
  animation: gradient-shift 4s ease infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>