<template>
  <div class="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
      <div class="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-600 rounded mr-3"></div>
      包装专用计算器
    </h2>

    <!-- 计算器模式切换 -->
    <div class="mb-6">
      <div class="bg-gray-50 rounded-lg p-1 inline-flex">
        <button
          v-for="mode in calculatorModes"
          :key="mode.id"
          @click="activeMode = mode.id"
          :class="[
            'px-4 py-2 rounded-md font-medium transition-all duration-200 text-sm',
            activeMode === mode.id
              ? 'bg-white text-blue-600 shadow-md'
              : 'text-gray-600 hover:text-gray-800'
          ]"
        >
          <span class="mr-2">{{ mode.icon }}</span>
          {{ mode.name }}
        </button>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- 左侧：计算器显示区 -->
      <div class="lg:col-span-2">
        <div class="bg-gray-900 rounded-lg p-6 mb-6">
          <!-- 显示屏 -->
          <div class="bg-black rounded-lg p-4 mb-4">
            <div class="text-right">
              <div class="text-gray-400 text-sm min-h-[20px]">
                {{ history }}
              </div>
              <div class="text-white text-3xl font-mono min-h-[48px] flex items-center justify-end">
                {{ display || '0' }}
              </div>
            </div>
          </div>

          <!-- 按键区域 -->
          <div v-if="activeMode === 'basic'" class="grid grid-cols-4 gap-2">
            <!-- 基础计算器按键 -->
            <button @click="clearAll" class="calc-btn bg-red-500 hover:bg-red-600 text-white col-span-1">AC</button>
            <button @click="clearEntry" class="calc-btn bg-orange-500 hover:bg-orange-600 text-white">CE</button>
            <button @click="deleteLast" class="calc-btn bg-orange-500 hover:bg-orange-600 text-white">⌫</button>
            <button @click="inputOperator('/')" class="calc-btn bg-blue-500 hover:bg-blue-600 text-white">÷</button>
            
            <button @click="inputNumber('7')" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white">7</button>
            <button @click="inputNumber('8')" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white">8</button>
            <button @click="inputNumber('9')" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white">9</button>
            <button @click="inputOperator('*')" class="calc-btn bg-blue-500 hover:bg-blue-600 text-white">×</button>
            
            <button @click="inputNumber('4')" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white">4</button>
            <button @click="inputNumber('5')" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white">5</button>
            <button @click="inputNumber('6')" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white">6</button>
            <button @click="inputOperator('-')" class="calc-btn bg-blue-500 hover:bg-blue-600 text-white">-</button>
            
            <button @click="inputNumber('1')" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white">1</button>
            <button @click="inputNumber('2')" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white">2</button>
            <button @click="inputNumber('3')" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white">3</button>
            <button @click="inputOperator('+')" class="calc-btn bg-blue-500 hover:bg-blue-600 text-white row-span-2">+</button>
            
            <button @click="inputNumber('0')" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white col-span-2">0</button>
            <button @click="inputNumber('.')" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white">.</button>
            
            <button @click="calculate" class="calc-btn bg-green-500 hover:bg-green-600 text-white col-span-4">=</button>
          </div>

          <div v-else-if="activeMode === 'scientific'" class="grid grid-cols-6 gap-1 text-xs">
            <!-- 科学计算器按键 -->
            <!-- 第一行 -->
            <button @click="clearAll" class="calc-btn bg-red-500 hover:bg-red-600 text-white col-span-2">AC</button>
            <button @click="deleteLast" class="calc-btn bg-orange-500 hover:bg-orange-600 text-white">⌫</button>
            <button @click="inputFunction('(')" class="calc-btn bg-gray-600 hover:bg-gray-500 text-white">(</button>
            <button @click="inputFunction(')')" class="calc-btn bg-gray-600 hover:bg-gray-500 text-white">)</button>
            <button @click="inputOperator('/')" class="calc-btn bg-blue-500 hover:bg-blue-600 text-white">÷</button>
            
            <!-- 第二行 -->
            <button @click="inputFunction('sin(')" class="calc-btn bg-purple-500 hover:bg-purple-600 text-white">sin</button>
            <button @click="inputFunction('cos(')" class="calc-btn bg-purple-500 hover:bg-purple-600 text-white">cos</button>
            <button @click="inputFunction('tan(')" class="calc-btn bg-purple-500 hover:bg-purple-600 text-white">tan</button>
            <button @click="inputNumber('7')" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white">7</button>
            <button @click="inputNumber('8')" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white">8</button>
            <button @click="inputNumber('9')" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white">9</button>
            
            <!-- 第三行 -->
            <button @click="inputFunction('log(')" class="calc-btn bg-purple-500 hover:bg-purple-600 text-white">log</button>
            <button @click="inputFunction('ln(')" class="calc-btn bg-purple-500 hover:bg-purple-600 text-white">ln</button>
            <button @click="inputFunction('sqrt(')" class="calc-btn bg-purple-500 hover:bg-purple-600 text-white">√</button>
            <button @click="inputNumber('4')" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white">4</button>
            <button @click="inputNumber('5')" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white">5</button>
            <button @click="inputNumber('6')" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white">6</button>
            
            <!-- 第四行 -->
            <button @click="inputFunction('pow(')" class="calc-btn bg-purple-500 hover:bg-purple-600 text-white">x^y</button>
            <button @click="inputConstant('PI')" class="calc-btn bg-purple-500 hover:bg-purple-600 text-white">π</button>
            <button @click="inputConstant('E')" class="calc-btn bg-purple-500 hover:bg-purple-600 text-white">e</button>
            <button @click="inputNumber('1')" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white">1</button>
            <button @click="inputNumber('2')" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white">2</button>
            <button @click="inputNumber('3')" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white">3</button>
            
            <!-- 第五行 -->
            <button @click="inputOperator('*')" class="calc-btn bg-blue-500 hover:bg-blue-600 text-white">×</button>
            <button @click="inputOperator('-')" class="calc-btn bg-blue-500 hover:bg-blue-600 text-white">-</button>
            <button @click="inputOperator('+')" class="calc-btn bg-blue-500 hover:bg-blue-600 text-white">+</button>
            <button @click="inputNumber('0')" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white col-span-2">0</button>
            <button @click="inputNumber('.')" class="calc-btn bg-gray-700 hover:bg-gray-600 text-white">.</button>
            
            <!-- 第六行 -->
            <button @click="calculate" class="calc-btn bg-green-500 hover:bg-green-600 text-white col-span-6">=</button>
          </div>
        </div>
      </div>

      <!-- 右侧：专业计算功能 -->
      <div class="space-y-6">
        <!-- 包装行业计算 -->
        <div v-if="activeMode === 'packaging'" class="bg-gray-50 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">包装专业计算</h3>
          
          <!-- 材料用量计算 -->
          <div class="mb-6">
            <h4 class="font-medium text-gray-700 mb-3">材料用量计算</h4>
            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-xs text-gray-600 mb-1">长度(mm)</label>
                  <input v-model.number="materialCalc.length" type="number" class="w-full p-2 text-sm border rounded" placeholder="长度">
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">宽度(mm)</label>
                  <input v-model.number="materialCalc.width" type="number" class="w-full p-2 text-sm border rounded" placeholder="宽度">
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-xs text-gray-600 mb-1">数量</label>
                  <input v-model.number="materialCalc.quantity" type="number" class="w-full p-2 text-sm border rounded" placeholder="数量">
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">损耗率(%)</label>
                  <input v-model.number="materialCalc.waste" type="number" class="w-full p-2 text-sm border rounded" placeholder="损耗率">
                </div>
              </div>
              <button @click="calculateMaterialUsage" class="w-full bg-blue-500 text-white py-2 rounded text-sm hover:bg-blue-600">
                计算用量
              </button>
              <div v-if="materialResult.area" class="bg-white p-3 rounded border text-sm">
                <div>单个面积: {{ materialResult.area.toFixed(2) }} cm²</div>
                <div>总面积: {{ materialResult.totalArea.toFixed(2) }} cm²</div>
                <div>含损耗: {{ materialResult.totalWithWaste.toFixed(2) }} cm²</div>
              </div>
            </div>
          </div>

          <!-- 成本计算 -->
          <div class="mb-6">
            <h4 class="font-medium text-gray-700 mb-3">成本计算</h4>
            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-xs text-gray-600 mb-1">材料单价(元/m²)</label>
                  <input v-model.number="costCalc.unitPrice" type="number" class="w-full p-2 text-sm border rounded" placeholder="单价">
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">用量(cm²)</label>
                  <input v-model.number="costCalc.usage" type="number" class="w-full p-2 text-sm border rounded" placeholder="用量">
                </div>
              </div>
              <button @click="calculateCost" class="w-full bg-green-500 text-white py-2 rounded text-sm hover:bg-green-600">
                计算成本
              </button>
              <div v-if="costResult.materialCost" class="bg-white p-3 rounded border text-sm">
                <div>材料成本: {{ costResult.materialCost.toFixed(4) }} 元</div>
                <div>每千个成本: {{ costResult.costPer1000.toFixed(2) }} 元</div>
              </div>
            </div>
          </div>

          <!-- 拼版效率计算 -->
          <div>
            <h4 class="font-medium text-gray-700 mb-3">拼版效率</h4>
            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-xs text-gray-600 mb-1">成品长(mm)</label>
                  <input v-model.number="impositionCalc.productWidth" type="number" class="w-full p-2 text-sm border rounded">
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">成品宽(mm)</label>
                  <input v-model.number="impositionCalc.productHeight" type="number" class="w-full p-2 text-sm border rounded">
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-xs text-gray-600 mb-1">纸张长(mm)</label>
                  <input v-model.number="impositionCalc.sheetWidth" type="number" class="w-full p-2 text-sm border rounded">
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">纸张宽(mm)</label>
                  <input v-model.number="impositionCalc.sheetHeight" type="number" class="w-full p-2 text-sm border rounded">
                </div>
              </div>
              <button @click="calculateImposition" class="w-full bg-purple-500 text-white py-2 rounded text-sm hover:bg-purple-600">
                计算拼版
              </button>
              <div v-if="impositionResult.maxCount" class="bg-white p-3 rounded border text-sm">
                <div>最大拼版数: {{ impositionResult.maxCount }}</div>
                <div>材料利用率: {{ impositionResult.efficiency.toFixed(1) }}%</div>
                <div>排列方式: {{ impositionResult.arrangement }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 设计行业计算 -->
        <div v-if="activeMode === 'design'" class="bg-gray-50 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">设计专业计算</h3>
          
          <!-- 黄金比例计算 -->
          <div class="mb-6">
            <h4 class="font-medium text-gray-700 mb-3">黄金比例计算</h4>
            <div class="space-y-3">
              <div>
                <label class="block text-xs text-gray-600 mb-1">已知边长</label>
                <input v-model.number="designCalc.goldenInput" type="number" class="w-full p-2 text-sm border rounded" placeholder="输入一边长度">
              </div>
              <button @click="calculateGoldenRatio" class="w-full bg-yellow-500 text-white py-2 rounded text-sm hover:bg-yellow-600">
                计算黄金比例
              </button>
              <div v-if="designResult.goldenRatio" class="bg-white p-3 rounded border text-sm">
                <div>黄金比例: {{ designResult.goldenRatio.toFixed(3) }}</div>
                <div>对应长边: {{ designResult.goldenLong.toFixed(2) }}</div>
                <div>对应短边: {{ designResult.goldenShort.toFixed(2) }}</div>
              </div>
            </div>
          </div>

          <!-- DPI转换计算 -->
          <div class="mb-6">
            <h4 class="font-medium text-gray-700 mb-3">DPI/像素转换</h4>
            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-xs text-gray-600 mb-1">宽度(mm)</label>
                  <input v-model.number="designCalc.widthMM" type="number" class="w-full p-2 text-sm border rounded">
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">高度(mm)</label>
                  <input v-model.number="designCalc.heightMM" type="number" class="w-full p-2 text-sm border rounded">
                </div>
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1">DPI</label>
                <select v-model.number="designCalc.dpi" class="w-full p-2 text-sm border rounded">
                  <option value="72">72 DPI (屏幕)</option>
                  <option value="150">150 DPI (低质量打印)</option>
                  <option value="300">300 DPI (高质量打印)</option>
                  <option value="600">600 DPI (专业印刷)</option>
                </select>
              </div>
              <button @click="calculateDPI" class="w-full bg-indigo-500 text-white py-2 rounded text-sm hover:bg-indigo-600">
                计算像素尺寸
              </button>
              <div v-if="designResult.pixelWidth" class="bg-white p-3 rounded border text-sm">
                <div>像素宽度: {{ designResult.pixelWidth }} px</div>
                <div>像素高度: {{ designResult.pixelHeight }} px</div>
                <div>文件大小估算: {{ designResult.fileSize }} MB</div>
              </div>
            </div>
          </div>

          <!-- 色彩值转换 -->
          <div>
            <h4 class="font-medium text-gray-700 mb-3">色彩值计算</h4>
            <div class="space-y-3">
              <div>
                <label class="block text-xs text-gray-600 mb-1">HEX颜色</label>
                <input v-model="designCalc.hexColor" type="text" class="w-full p-2 text-sm border rounded" placeholder="#FF6B6B">
              </div>
              <button @click="calculateColor" class="w-full bg-pink-500 text-white py-2 rounded text-sm hover:bg-pink-600">
                转换色彩值
              </button>
              <div v-if="designResult.rgbValues" class="bg-white p-3 rounded border text-sm">
                <div class="w-full h-8 rounded mb-2" :style="{ backgroundColor: designCalc.hexColor }"></div>
                <div>RGB: {{ designResult.rgbValues }}</div>
                <div>HSL: {{ designResult.hslValues }}</div>
                <div>亮度: {{ designResult.brightness }}%</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 历史记录 -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">计算历史</h3>
          <div class="space-y-2 max-h-40 overflow-y-auto">
            <div v-if="calculationHistory.length === 0" class="text-gray-500 text-sm">
              暂无计算记录
            </div>
            <div
              v-for="(item, index) in calculationHistory.slice(-10)"
              :key="index"
              class="bg-white p-2 rounded text-sm border cursor-pointer hover:bg-gray-50"
              @click="loadFromHistory(item)"
            >
              <div class="font-mono">{{ item.expression }} = {{ item.result }}</div>
              <div class="text-xs text-gray-500">{{ item.timestamp }}</div>
            </div>
          </div>
          <button v-if="calculationHistory.length > 0" @click="clearHistory" class="mt-2 w-full bg-gray-500 text-white py-1 rounded text-xs hover:bg-gray-600">
            清空历史
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// 计算器模式
const calculatorModes = [
  { id: 'basic', name: '基础', icon: '🔢' },
  { id: 'scientific', name: '科学', icon: '🔬' },
  { id: 'packaging', name: '包装', icon: '📦' },
  { id: 'design', name: '设计', icon: '🎨' }
]

const activeMode = ref('basic')
const display = ref('')
const history = ref('')
const previousValue = ref(0)
const currentOperator = ref('')
const waitingForNewValue = ref(false)
const calculationHistory = ref([])

// 包装计算相关数据
const materialCalc = reactive({
  length: 0,
  width: 0,
  quantity: 1,
  waste: 5
})

const materialResult = reactive({
  area: 0,
  totalArea: 0,
  totalWithWaste: 0
})

const costCalc = reactive({
  unitPrice: 0,
  usage: 0
})

const costResult = reactive({
  materialCost: 0,
  costPer1000: 0
})

const impositionCalc = reactive({
  productWidth: 0,
  productHeight: 0,
  sheetWidth: 0,
  sheetHeight: 0
})

const impositionResult = reactive({
  maxCount: 0,
  efficiency: 0,
  arrangement: ''
})

// 设计计算相关数据
const designCalc = reactive({
  goldenInput: 0,
  widthMM: 0,
  heightMM: 0,
  dpi: 300,
  hexColor: '#FF6B6B'
})

const designResult = reactive({
  goldenRatio: 0,
  goldenLong: 0,
  goldenShort: 0,
  pixelWidth: 0,
  pixelHeight: 0,
  fileSize: '',
  rgbValues: '',
  hslValues: '',
  brightness: 0
})

// 基础计算器函数
const inputNumber = (num) => {
  if (waitingForNewValue.value) {
    display.value = num
    waitingForNewValue.value = false
  } else {
    display.value = display.value === '0' ? num : display.value + num
  }
}

const inputOperator = (operator) => {
  if (currentOperator.value && !waitingForNewValue.value) {
    calculate()
  }
  
  previousValue.value = parseFloat(display.value)
  currentOperator.value = operator
  waitingForNewValue.value = true
  
  history.value = `${display.value} ${operator}`
}

const inputFunction = (func) => {
  display.value += func
}

const inputConstant = (constant) => {
  const constants = {
    PI: Math.PI.toString(),
    E: Math.E.toString()
  }
  
  if (waitingForNewValue.value) {
    display.value = constants[constant]
    waitingForNewValue.value = false
  } else {
    display.value += constants[constant]
  }
}

const calculate = () => {
  try {
    let result
    const current = parseFloat(display.value)
    
    if (currentOperator.value) {
      switch (currentOperator.value) {
        case '+':
          result = previousValue.value + current
          break
        case '-':
          result = previousValue.value - current
          break
        case '*':
          result = previousValue.value * current
          break
        case '/':
          if (current === 0) {
            throw new Error('除零错误')
          }
          result = previousValue.value / current
          break
        default:
          return
      }
    } else {
      // 科学计算
      const expression = display.value
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/pow\(/g, 'Math.pow(')
        .replace(/PI/g, Math.PI)
        .replace(/E/g, Math.E)
      
      result = eval(expression)
    }
    
    // 保存历史记录
    const historyItem = {
      expression: currentOperator.value 
        ? `${previousValue.value} ${currentOperator.value} ${current}`
        : display.value,
      result: result.toString(),
      timestamp: new Date().toLocaleTimeString()
    }
    calculationHistory.value.push(historyItem)
    
    display.value = result.toString()
    history.value = ''
    currentOperator.value = ''
    waitingForNewValue.value = true
    
  } catch (error) {
    display.value = '错误'
    history.value = ''
    currentOperator.value = ''
    waitingForNewValue.value = true
  }
}

const clearAll = () => {
  display.value = '0'
  history.value = ''
  previousValue.value = 0
  currentOperator.value = ''
  waitingForNewValue.value = false
}

const clearEntry = () => {
  display.value = '0'
}

const deleteLast = () => {
  if (display.value.length > 1) {
    display.value = display.value.slice(0, -1)
  } else {
    display.value = '0'
  }
}

const loadFromHistory = (item) => {
  display.value = item.result
  waitingForNewValue.value = true
}

const clearHistory = () => {
  calculationHistory.value = []
}

// 包装行业专用计算函数
const calculateMaterialUsage = () => {
  const area = (materialCalc.length * materialCalc.width) / 100 // 转换为cm²
  const totalArea = area * materialCalc.quantity
  const totalWithWaste = totalArea * (1 + materialCalc.waste / 100)
  
  Object.assign(materialResult, {
    area,
    totalArea,
    totalWithWaste
  })
}

const calculateCost = () => {
  const materialCost = (costCalc.usage / 10000) * costCalc.unitPrice // cm²转m²
  const costPer1000 = materialCost * 1000
  
  Object.assign(costResult, {
    materialCost,
    costPer1000
  })
}

const calculateImposition = () => {
  const horizontal = Math.floor(impositionCalc.sheetWidth / impositionCalc.productWidth) *
                   Math.floor(impositionCalc.sheetHeight / impositionCalc.productHeight)
  
  const vertical = Math.floor(impositionCalc.sheetWidth / impositionCalc.productHeight) *
                  Math.floor(impositionCalc.sheetHeight / impositionCalc.productWidth)
  
  const maxCount = Math.max(horizontal, vertical)
  const efficiency = (maxCount * impositionCalc.productWidth * impositionCalc.productHeight) / 
                    (impositionCalc.sheetWidth * impositionCalc.sheetHeight) * 100
  
  const arrangement = horizontal >= vertical 
    ? `${Math.floor(impositionCalc.sheetWidth / impositionCalc.productWidth)} × ${Math.floor(impositionCalc.sheetHeight / impositionCalc.productHeight)}`
    : `${Math.floor(impositionCalc.sheetWidth / impositionCalc.productHeight)} × ${Math.floor(impositionCalc.sheetHeight / impositionCalc.productWidth)} (旋转)`
  
  Object.assign(impositionResult, {
    maxCount,
    efficiency,
    arrangement
  })
}

// 设计行业专用计算函数
const calculateGoldenRatio = () => {
  const goldenRatio = 1.618
  const input = designCalc.goldenInput
  
  Object.assign(designResult, {
    goldenRatio,
    goldenLong: input * goldenRatio,
    goldenShort: input / goldenRatio
  })
}

const calculateDPI = () => {
  const pixelWidth = Math.round((designCalc.widthMM / 25.4) * designCalc.dpi)
  const pixelHeight = Math.round((designCalc.heightMM / 25.4) * designCalc.dpi)
  const fileSize = ((pixelWidth * pixelHeight * 24) / 8 / 1024 / 1024).toFixed(2)
  
  Object.assign(designResult, {
    pixelWidth,
    pixelHeight,
    fileSize
  })
}

const calculateColor = () => {
  const hex = designCalc.hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // RGB to HSL
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
  
  const brightness = Math.round((r * 299 + g * 587 + b * 114) / 1000 / 255 * 100)
  
  Object.assign(designResult, {
    rgbValues: `rgb(${r}, ${g}, ${b})`,
    hslValues: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
    brightness
  })
}
</script>

<style scoped>
.calc-btn {
  @apply h-12 rounded-lg font-medium text-lg transition-all duration-150 active:scale-95;
}

.calc-btn:active {
  transform: scale(0.95);
}

/* 响应式调整 */
@media (max-width: 640px) {
  .calc-btn {
    @apply h-10 text-base;
  }
}
</style>