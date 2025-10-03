<template>
  <div class="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
      <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded mr-3"></div>
      智能配色与色彩转换器
    </h2>
    
    <div class="grid md:grid-cols-2 gap-8">
      <!-- 左侧：色彩输入与转换 -->
      <div class="space-y-6">
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-4">色彩输入</h3>
          
          <!-- HEX输入 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">HEX</label>
            <div class="flex items-center space-x-2">
              <input
                v-model="hexColor"
                @input="convertFromHex"
                type="text"
                placeholder="#FF6B6B"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                @click="copyColor('hex')"
                class="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                复制
              </button>
            </div>
          </div>
          
          <!-- RGB输入 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">RGB</label>
            <div class="grid grid-cols-3 gap-2 mb-2">
              <input
                v-model.number="rgbColor.r"
                @input="convertFromRgb"
                type="number"
                min="0"
                max="255"
                placeholder="R"
                class="px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <input
                v-model.number="rgbColor.g"
                @input="convertFromRgb"
                type="number"
                min="0"
                max="255"
                placeholder="G"
                class="px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <input
                v-model.number="rgbColor.b"
                @input="convertFromRgb"
                type="number"
                min="0"
                max="255"
                placeholder="B"
                class="px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="text-sm text-gray-600">
              {{ `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})` }}
              <button
                @click="copyColor('rgb')"
                class="ml-2 text-blue-500 hover:text-blue-700"
              >
                复制
              </button>
            </div>
          </div>
          
          <!-- CMYK输入 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">CMYK</label>
            <div class="grid grid-cols-4 gap-2 mb-2">
              <input
                v-model.number="cmykColor.c"
                @input="convertFromCmyk"
                type="number"
                min="0"
                max="100"
                placeholder="C"
                class="px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <input
                v-model.number="cmykColor.m"
                @input="convertFromCmyk"
                type="number"
                min="0"
                max="100"
                placeholder="M"
                class="px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <input
                v-model.number="cmykColor.y"
                @input="convertFromCmyk"
                type="number"
                min="0"
                max="100"
                placeholder="Y"
                class="px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <input
                v-model.number="cmykColor.k"
                @input="convertFromCmyk"
                type="number"
                min="0"
                max="100"
                placeholder="K"
                class="px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="text-sm text-gray-600">
              {{ `cmyk(${cmykColor.c}%, ${cmykColor.m}%, ${cmykColor.y}%, ${cmykColor.k}%)` }}
              <button
                @click="copyColor('cmyk')"
                class="ml-2 text-blue-500 hover:text-blue-700"
              >
                复制
              </button>
            </div>
          </div>
        </div>
        
        <!-- 色彩预览 -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-4">色彩预览</h3>
          <div
            class="w-full h-24 rounded-lg border-2 border-gray-200"
            :style="{ backgroundColor: hexColor }"
          ></div>
          <div class="mt-2 text-sm text-gray-600 text-center">
            当前颜色: {{ hexColor }}
          </div>
        </div>
      </div>
      
      <!-- 右侧：智能配色建议 -->
      <div class="space-y-6">
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">智能配色建议</h3>
            <button
              @click="generatePalette"
              :disabled="isGenerating"
              class="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all"
            >
              {{ isGenerating ? '生成中...' : '生成配色' }}
            </button>
          </div>
          
          <!-- 配色方案 -->
          <div v-if="colorPalette.length > 0" class="space-y-4">
            <div class="grid grid-cols-5 gap-2">
              <div
                v-for="(color, index) in colorPalette"
                :key="index"
                class="aspect-square rounded-lg border-2 border-gray-200 cursor-pointer relative group"
                :style="{ backgroundColor: color }"
                @click="selectColor(color)"
              >
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    选择
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 配色说明 -->
            <div class="text-sm text-gray-600 bg-white p-3 rounded border">
              <h4 class="font-medium mb-2">包装设计应用建议:</h4>
              <ul class="space-y-1 text-xs">
                <li>• <strong>主色:</strong> 用于品牌标识和主要视觉元素</li>
                <li>• <strong>辅助色:</strong> 用于装饰边框和次要信息</li>
                <li>• <strong>强调色:</strong> 用于重要信息和行动按钮</li>
                <li>• <strong>中性色:</strong> 用于背景和文字</li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- 包装材质建议 -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-4">材质兼容性</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-white rounded border">
              <div>
                <div class="font-medium">光面材质</div>
                <div class="text-sm text-gray-600">适合鲜艳色彩，提升视觉冲击力</div>
              </div>
              <div class="text-green-500 font-bold">推荐</div>
            </div>
            <div class="flex items-center justify-between p-3 bg-white rounded border">
              <div>
                <div class="font-medium">哑面材质</div>
                <div class="text-sm text-gray-600">适合柔和色调，营造高端质感</div>
              </div>
              <div class="text-blue-500 font-bold">适合</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 使用提示 -->
    <div class="mt-8 bg-blue-50 rounded-lg p-4">
      <div class="flex items-start">
        <div class="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3">
          <span class="text-white text-sm">?</span>
        </div>
        <div class="text-sm text-blue-800">
          <h4 class="font-medium mb-2">包装设计色彩提示:</h4>
          <p>• RGB适用于屏幕显示和数字稿件</p>
          <p>• CMYK适用于胶印和数码印刷</p>
          <p>• 建议印刷前制作色彩样品确认最终效果</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// 响应式数据
const hexColor = ref('#FF6B6B')
const rgbColor = reactive({ r: 255, g: 107, b: 107 })
const cmykColor = reactive({ c: 0, m: 58, y: 58, k: 0 })
const colorPalette = ref([])
const isGenerating = ref(false)

// 颜色转换函数
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

const rgbToCmyk = (r, g, b) => {
  const rPercent = r / 255
  const gPercent = g / 255
  const bPercent = b / 255
  
  const k = 1 - Math.max(rPercent, Math.max(gPercent, bPercent))
  const c = k === 1 ? 0 : (1 - rPercent - k) / (1 - k)
  const m = k === 1 ? 0 : (1 - gPercent - k) / (1 - k)
  const y = k === 1 ? 0 : (1 - bPercent - k) / (1 - k)
  
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  }
}

const cmykToRgb = (c, m, y, k) => {
  const cPercent = c / 100
  const mPercent = m / 100
  const yPercent = y / 100
  const kPercent = k / 100
  
  const r = Math.round(255 * (1 - cPercent) * (1 - kPercent))
  const g = Math.round(255 * (1 - mPercent) * (1 - kPercent))
  const b = Math.round(255 * (1 - yPercent) * (1 - kPercent))
  
  return { r, g, b }
}

// 转换函数
const convertFromHex = () => {
  const rgb = hexToRgb(hexColor.value)
  if (rgb) {
    Object.assign(rgbColor, rgb)
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b)
    Object.assign(cmykColor, cmyk)
  }
}

const convertFromRgb = () => {
  hexColor.value = rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b)
  const cmyk = rgbToCmyk(rgbColor.r, rgbColor.g, rgbColor.b)
  Object.assign(cmykColor, cmyk)
}

const convertFromCmyk = () => {
  const rgb = cmykToRgb(cmykColor.c, cmykColor.m, cmykColor.y, cmykColor.k)
  Object.assign(rgbColor, rgb)
  hexColor.value = rgbToHex(rgb.r, rgb.g, rgb.b)
}

// 生成配色方案
const generatePalette = async () => {
  isGenerating.value = true
  
  try {
    // 模拟API调用（实际应用中替换为真实的Coolors API）
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 基于当前颜色生成和谐配色
    const baseHue = rgbToHsl(rgbColor.r, rgbColor.g, rgbColor.b).h
    const palette = []
    
    // 生成5种配色
    for (let i = 0; i < 5; i++) {
      const hue = (baseHue + i * 72) % 360  // 五等分色相环
      const saturation = 60 + Math.random() * 30  // 随机饱和度
      const lightness = 40 + Math.random() * 40   // 随机明度
      
      const rgb = hslToRgb(hue, saturation, lightness)
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
      palette.push(hex)
    }
    
    colorPalette.value = palette
  } catch (error) {
    console.error('生成配色失败:', error)
  } finally {
    isGenerating.value = false
  }
}

// HSL转换函数
const rgbToHsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
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

const hslToRgb = (h, s, l) => {
  h /= 360; s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = n => {
    const k = (n + h * 12) % 12
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
  }
  
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255)
  }
}

// 复制颜色值
const copyColor = async (format) => {
  let text = ''
  switch (format) {
    case 'hex':
      text = hexColor.value
      break
    case 'rgb':
      text = `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`
      break
    case 'cmyk':
      text = `cmyk(${cmykColor.c}%, ${cmykColor.m}%, ${cmykColor.y}%, ${cmykColor.k}%)`
      break
  }
  
  try {
    await navigator.clipboard.writeText(text)
    // 这里可以添加复制成功的提示
    console.log(`已复制: ${text}`)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 选择配色
const selectColor = (color) => {
  hexColor.value = color
  convertFromHex()
}

// 组件挂载时初始化
onMounted(() => {
  convertFromHex()
})
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>