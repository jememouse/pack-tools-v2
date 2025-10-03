<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">
          包装设计色彩工具集
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          专业的包装设计色彩解决方案，从配色到渐变，一站式满足您的设计需求
        </p>
      </div>

      <!-- 工具选择标签页 -->
      <div class="mb-8">
        <div class="bg-white rounded-lg shadow-sm p-1 inline-flex">
          <button
            v-for="tool in colorTools"
            :key="tool.id"
            @click="activeTool = tool.id"
            :class="[
              'px-6 py-3 rounded-md font-medium transition-all duration-200',
              activeTool === tool.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            ]"
          >
            <span class="mr-2">{{ tool.icon }}</span>
            {{ tool.name }}
          </button>
        </div>
      </div>

      <!-- 工具内容区域 -->
      <div class="space-y-8">
        <!-- 色彩智能推荐工具 -->
        <div v-if="activeTool === 'recommendation'">
          <ColorRecommendationTool />
        </div>

        <!-- 增强版色彩转换器 -->
        <div v-if="activeTool === 'converter'">
          <EnhancedColorConverter />
        </div>

        <!-- 快速配色工具 -->
        <div v-if="activeTool === 'palette'" class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <div class="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-600 rounded mr-3"></div>
            快速配色工具
          </h2>
          
          <div class="grid md:grid-cols-2 gap-8">
            <!-- 左侧：颜色输入 -->
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">选择基础色彩</label>
                <input
                  v-model="quickColor"
                  type="color"
                  class="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
                  @input="generateQuickPalette"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">配色类型</label>
                <select
                  v-model="paletteType"
                  @change="generateQuickPalette"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="complementary">互补色</option>
                  <option value="analogous">类似色</option>
                  <option value="triadic">三分色</option>
                  <option value="monochromatic">单色系</option>
                </select>
              </div>
            </div>

            <!-- 右侧：配色结果 -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800">生成的配色方案</h3>
              <div class="grid grid-cols-5 gap-3">
                <div
                  v-for="(color, index) in quickPalette"
                  :key="index"
                  class="aspect-square rounded-lg border-2 border-gray-200 cursor-pointer relative group"
                  :style="{ backgroundColor: color }"
                  @click="copyToClipboard(color)"
                >
                  <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {{ color }}
                    </span>
                  </div>
                </div>
              </div>
              <p class="text-sm text-gray-600">点击色块可复制颜色代码</p>
            </div>
          </div>
        </div>

        <!-- 包装材质色彩预览 -->
        <div v-if="activeTool === 'material'" class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <div class="w-6 h-6 bg-gradient-to-r from-yellow-500 to-red-600 rounded mr-3"></div>
            包装材质色彩预览
          </h2>
          
          <div class="space-y-6">
            <!-- 颜色选择 -->
            <div class="flex items-center space-x-4">
              <label class="block text-sm font-medium text-gray-700">选择颜色:</label>
              <input
                v-model="materialColor"
                type="color"
                class="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                @input="updateMaterialPreviews"
              />
              <span class="text-sm text-gray-600">{{ materialColor }}</span>
            </div>

            <!-- 材质预览 -->
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                v-for="material in materialPreviews"
                :key="material.type"
                class="text-center"
              >
                <h3 class="font-medium text-gray-800 mb-3">{{ material.name }}</h3>
                <div
                  class="w-full h-32 rounded-lg border border-gray-200 mb-3"
                  :style="material.style"
                ></div>
                <p class="text-xs text-gray-600">{{ material.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 使用说明 -->
      <div class="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
          🎯 如何使用这些工具？
        </h2>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="text-3xl mb-3">🎨</div>
            <h3 class="font-semibold text-gray-800 mb-2">智能推荐</h3>
            <p class="text-sm text-gray-600">输入基础色彩，获得专业的配色方案和渐变建议，适合各种包装场景</p>
          </div>
          
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="text-3xl mb-3">🔄</div>
            <h3 class="font-semibold text-gray-800 mb-2">格式转换</h3>
            <p class="text-sm text-gray-600">HEX、RGB、CMYK之间无缝转换，支持材质适配和印刷优化</p>
          </div>
          
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="text-3xl mb-3">⚡</div>
            <h3 class="font-semibold text-gray-800 mb-2">快速配色</h3>
            <p class="text-sm text-gray-600">一键生成配色方案，支持多种色彩理论，满足不同设计需求</p>
          </div>
          
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="text-3xl mb-3">📦</div>
            <h3 class="font-semibold text-gray-800 mb-2">材质预览</h3>
            <p class="text-sm text-gray-600">模拟不同包装材质的色彩效果，帮助您做出最佳的材质选择</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import ColorRecommendationTool from '../components/ColorRecommendationTool.vue'
import EnhancedColorConverter from '../components/EnhancedColorConverter.vue'

// 响应式数据
const activeTool = ref('recommendation')
const quickColor = ref('#FF6B6B')
const paletteType = ref('complementary')
const quickPalette = ref([])
const materialColor = ref('#FF6B6B')

const colorTools = [
  { id: 'recommendation', name: '智能推荐', icon: '🎨' },
  { id: 'converter', name: '格式转换', icon: '🔄' },
  { id: 'palette', name: '快速配色', icon: '⚡' },
  { id: 'material', name: '材质预览', icon: '📦' }
]

const materialPreviews = reactive([
  {
    type: 'glossy',
    name: '光面材质',
    style: {},
    description: '高光泽，色彩鲜艳，适合吸引眼球的产品'
  },
  {
    type: 'matte',
    name: '哑面材质', 
    style: {},
    description: '无光泽，色彩柔和，适合高端产品'
  },
  {
    type: 'metallic',
    name: '金属材质',
    style: {},
    description: '金属光泽，色彩深沉，适合奢华产品'
  },
  {
    type: 'transparent',
    name: '透明材质',
    style: {},
    description: '半透明效果，色彩清淡，适合化妆品'
  }
])

// 工具函数
const hexToHsl = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { h: 0, s: 0, l: 0 }

  let r = parseInt(result[1], 16) / 255
  let g = parseInt(result[2], 16) / 255
  let b = parseInt(result[3], 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

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

// 生成快速配色方案
const generateQuickPalette = () => {
  const { h, s, l } = hexToHsl(quickColor.value)
  const palette = [quickColor.value]

  switch (paletteType.value) {
    case 'complementary':
      palette.push(
        hslToHex((h + 180) % 360, s, l),
        hslToHex(h, Math.max(20, s - 30), Math.min(90, l + 20)),
        hslToHex((h + 180) % 360, Math.max(20, s - 30), Math.min(90, l + 20)),
        hslToHex(h, Math.max(10, s - 50), 90)
      )
      break
    
    case 'analogous':
      palette.push(
        hslToHex((h + 30) % 360, s, l),
        hslToHex((h - 30 + 360) % 360, s, l),
        hslToHex((h + 60) % 360, Math.max(20, s - 20), l),
        hslToHex((h - 60 + 360) % 360, Math.max(20, s - 20), l)
      )
      break
    
    case 'triadic':
      palette.push(
        hslToHex((h + 120) % 360, s, l),
        hslToHex((h + 240) % 360, s, l),
        hslToHex(h, Math.max(30, s - 40), Math.min(85, l + 15)),
        hslToHex((h + 120) % 360, Math.max(30, s - 40), Math.min(85, l + 15))
      )
      break
    
    case 'monochromatic':
      palette.push(
        hslToHex(h, s, Math.max(20, l - 30)),
        hslToHex(h, s, Math.max(10, l - 15)),
        hslToHex(h, Math.max(20, s - 20), Math.min(85, l + 15)),
        hslToHex(h, Math.max(10, s - 40), Math.min(95, l + 30))
      )
      break
  }

  quickPalette.value = palette
}

// 更新材质预览
const updateMaterialPreviews = () => {
  const { h, s, l } = hexToHsl(materialColor.value)
  
  // 光面材质 - 添加高光效果
  materialPreviews[0].style = {
    background: `linear-gradient(135deg, ${hslToHex(h, Math.min(100, s + 20), Math.min(95, l + 25))} 0%, ${materialColor.value} 45%, ${hslToHex(h, s, Math.max(20, l - 15))} 100%)`,
    border: '1px solid rgba(255,255,255,0.3)'
  }
  
  // 哑面材质 - 柔和效果
  materialPreviews[1].style = {
    backgroundColor: hslToHex(h, Math.max(20, s - 30), Math.min(80, l + 5)),
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
  }
  
  // 金属材质 - 金属光泽
  materialPreviews[2].style = {
    background: `linear-gradient(45deg, ${materialColor.value} 0%, ${hslToHex(h + 30, Math.min(100, s + 20), Math.max(20, l - 20))} 30%, #D4AF37 50%, ${materialColor.value} 70%, ${hslToHex(h, Math.max(30, s - 10), Math.max(20, l - 10))} 100%)`,
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
  }
  
  // 透明材质 - 透明效果
  materialPreviews[3].style = {
    backgroundColor: hslToHex(h, Math.max(40, s - 20), Math.min(85, l + 15)),
    opacity: '0.7',
    backdropFilter: 'blur(2px)',
    border: '1px solid rgba(255,255,255,0.2)'
  }
}

// 复制到剪贴板
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    console.log(`已复制: ${text}`)
    // 这里可以添加成功提示
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 组件挂载时初始化
onMounted(() => {
  generateQuickPalette()
  updateMaterialPreviews()
})
</script>

<style scoped>
/* 自定义样式 */
.container {
  max-width: 1200px;
}

/* 材质效果动画 */
.material-preview {
  transition: all 0.3s ease;
}

.material-preview:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}
</style>