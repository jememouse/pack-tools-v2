<script setup>
import { reactive, ref, computed } from 'vue';
import { Copy, RotateCcw, Info, Package, Calculator } from 'lucide-vue-next';

const dimensions = reactive({
  length: '',
  width: '',
  height: '',
  actualWeight: '',
});

const showKnowledge = ref(false);
const showPresets = ref(false);
const copyStatus = ref('');
const selectedUnit = ref('cm'); // cm, mm, inch
const selectedWeightUnit = ref('kg'); // kg, g, lb

// 更完整的快递公司数据
const courierOptions = ref([
  { 
    name: '顺丰速运 (SF Express)', 
    divisor: 6000, 
    domestic: true, 
    international: true,
    description: '国内外通用，6000 除数'
  },
  { 
    name: '圆通速递 (YTO)', 
    divisor: 6000, 
    domestic: true, 
    international: false,
    description: '国内快递，6000 除数'
  },
  { 
    name: '申通快递 (STO)', 
    divisor: 6000, 
    domestic: true, 
    international: false,
    description: '国内快递，6000 除数'
  },
  { 
    name: '韵达速递 (YD)', 
    divisor: 6000, 
    domestic: true, 
    international: false,
    description: '国内快递，6000 除数'
  },
  { 
    name: '中通快递 (ZTO)', 
    divisor: 6000, 
    domestic: true, 
    international: false,
    description: '国内快递，6000 除数'
  },
  { 
    name: 'DHL Express', 
    divisor: 5000, 
    domestic: false, 
    international: true,
    description: '国际快递，5000 除数'
  },
  { 
    name: 'FedEx', 
    divisor: 5000, 
    domestic: false, 
    international: true,
    description: '国际快递，5000 除数'
  },
  { 
    name: 'UPS', 
    divisor: 5000, 
    domestic: false, 
    international: true,
    description: '国际快递，5000 除数'
  },
  { 
    name: 'TNT', 
    divisor: 5000, 
    domestic: false, 
    international: true,
    description: '国际快递，5000 除数'
  },
  { 
    name: 'EMS 中国邮政', 
    divisor: 8000, 
    domestic: true, 
    international: true,
    description: '国内外通用，8000 除数'
  },
  { 
    name: '其他 (自定义)', 
    divisor: 5000, 
    domestic: true, 
    international: true,
    description: '自定义除数'
  },
]);

const selectedCourier = ref(courierOptions.value[0]);
const customDivisor = ref('');

// 常见包裹预设尺寸 (cm)
const packagePresets = [
  { name: '小信封', length: 23, width: 16, height: 1, weight: 0.05 },
  { name: '大信封', length: 32, width: 22, height: 2, weight: 0.1 },
  { name: '小包装盒', length: 20, width: 15, height: 10, weight: 0.5 },
  { name: '中包装盒', length: 30, width: 20, height: 15, weight: 1.0 },
  { name: '大包装盒', length: 40, width: 30, height: 20, weight: 2.0 },
  { name: '特大包装盒', length: 50, width: 40, height: 30, weight: 3.0 },
  { name: 'A4文件袋', length: 32, width: 24, height: 3, weight: 0.2 },
  { name: '手机盒', length: 17, width: 9, height: 3, weight: 0.3 },
  { name: '鞋盒', length: 33, width: 22, height: 12, weight: 1.2 },
  { name: '衣服包装袋', length: 35, width: 25, height: 5, weight: 0.8 },
];

// 单位转换函数
const convertToStandardUnit = (value, unit) => {
  if (!value || isNaN(value)) return 0;
  const num = parseFloat(value);
  switch (unit) {
    case 'mm': return num / 10;
    case 'inch': return num * 2.54;
    case 'cm':
    default: return num;
  }
};

const convertWeightToKg = (value, unit) => {
  if (!value || isNaN(value)) return 0;
  const num = parseFloat(value);
  switch (unit) {
    case 'g': return num / 1000;
    case 'lb': return num * 0.453592;
    case 'kg':
    default: return num;
  }
};

// 计算体积重
const volumeWeight = computed(() => {
  const length = convertToStandardUnit(dimensions.length, selectedUnit.value);
  const width = convertToStandardUnit(dimensions.width, selectedUnit.value);
  const height = convertToStandardUnit(dimensions.height, selectedUnit.value);
  
  const divisor = selectedCourier.value.name === '其他 (自定义)' && customDivisor.value
    ? parseFloat(customDivisor.value)
    : selectedCourier.value.divisor;

  if (!length || !width || !height || !divisor || isNaN(divisor) || divisor === 0) {
    return 0;
  }
  return (length * width * height) / divisor;
});

// 计算实际重量（转换为kg）
const actualWeightKg = computed(() => {
  return convertWeightToKg(dimensions.actualWeight, selectedWeightUnit.value);
});

// 计算计费重量
const chargeableWeight = computed(() => {
  const actual = actualWeightKg.value;
  const volume = volumeWeight.value;

  if (!actual && !volume) return 0;
  if (!actual) return volume;
  if (!volume) return actual;

  return Math.max(actual, volume);
});

// 计算体积（立方厘米）
const volume = computed(() => {
  const length = convertToStandardUnit(dimensions.length, selectedUnit.value);
  const width = convertToStandardUnit(dimensions.width, selectedUnit.value);
  const height = convertToStandardUnit(dimensions.height, selectedUnit.value);
  
  return length * width * height;
});

// 输入验证
const isValidInput = computed(() => {
  const length = parseFloat(dimensions.length);
  const width = parseFloat(dimensions.width);
  const height = parseFloat(dimensions.height);
  
  return length > 0 && width > 0 && height > 0;
});

// 包装建议
const packagingSuggestions = computed(() => {
  if (!isValidInput.value) return [];
  
  const suggestions = [];
  const actual = actualWeightKg.value;
  const volume = volumeWeight.value;
  
  if (volume > actual && actual > 0) {
    const ratio = (volume / actual).toFixed(1);
    suggestions.push(`体积重是实际重量的 ${ratio} 倍，属于轻泡货物`);
    suggestions.push('建议：压缩包装，减少包装体积以降低运费');
  } else if (actual > volume && volume > 0) {
    suggestions.push('实际重量大于体积重，属于重货');
    suggestions.push('建议：按实际重量计费，包装可以适当宽松');
  }
  
  // 尺寸建议
  const length = convertToStandardUnit(dimensions.length, selectedUnit.value);
  const width = convertToStandardUnit(dimensions.width, selectedUnit.value);
  const height = convertToStandardUnit(dimensions.height, selectedUnit.value);
  const maxDimension = Math.max(length, width, height);
  
  if (maxDimension > 100) {
    suggestions.push('包裹最大尺寸超过100cm，可能产生超长费用');
  }
  if (length + width + height > 150) {
    suggestions.push('三边尺寸总和超过150cm，可能产生额外费用');
  }
  
  return suggestions;
});

// 成本估算（基于常见快递价格）
const estimatedCost = computed(() => {
  if (!chargeableWeight.value) return null;
  
  const weight = chargeableWeight.value;
  let baseCost = 0;
  let additionalCost = 0;
  
  if (selectedCourier.value.domestic) {
    // 国内快递估价
    baseCost = 8; // 首重价格
    additionalCost = Math.max(0, Math.ceil(weight) - 1) * 3; // 续重价格
  } else {
    // 国际快递估价
    baseCost = 100; // 首重价格
    additionalCost = Math.max(0, Math.ceil(weight) - 1) * 50; // 续重价格
  }
  
  return {
    total: baseCost + additionalCost,
    breakdown: {
      base: baseCost,
      additional: additionalCost,
      weight: Math.ceil(weight)
    }
  };
});

function resetCalculator() {
  dimensions.length = '';
  dimensions.width = '';
  dimensions.height = '';
  dimensions.actualWeight = '';
  selectedCourier.value = courierOptions.value[0];
  customDivisor.value = '';
}

function usePreset(preset) {
  dimensions.length = preset.length;
  dimensions.width = preset.width;
  dimensions.height = preset.height;
  dimensions.actualWeight = preset.weight;
  showPresets.value = false;
}

async function copyResult() {
  if (!chargeableWeight.value) return;

  const text = `体积重计算结果：
包裹尺寸：${dimensions.length} × ${dimensions.width} × ${dimensions.height} ${selectedUnit.value}
实际重量：${dimensions.actualWeight} ${selectedWeightUnit.value} (${actualWeightKg.value.toFixed(2)} kg)
体积重：${volumeWeight.value.toFixed(2)} kg
计费重量：${chargeableWeight.value.toFixed(2)} kg
快递公司：${selectedCourier.value.name}
${estimatedCost.value ? `预估费用：${estimatedCost.value.total} 元` : ''}`;

  try {
    await navigator.clipboard.writeText(text);
    copyStatus.value = '复制成功!';
    setTimeout(() => copyStatus.value = '', 2000);
  } catch (err) {
    copyStatus.value = '复制失败';
    setTimeout(() => copyStatus.value = '', 2000);
  }
}
</script>

<template>
  <div class="text-white">
    <!-- 标题区域 -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-white flex items-center gap-3">
            物流抛重/体积重计算器
            <button 
              @click="showKnowledge = !showKnowledge"
              class="text-gray-400 hover:text-fuchsia-400 transition-colors"
              title="了解体积重规则"
            >
              <Info class="w-6 h-6" />
            </button>
          </h1>
          <p class="mt-2 text-gray-300">输入长度、宽度、高度和实际重量，自动计算体积重并给出计费重量。</p>
        </div>
      </div>
    </div>

    <!-- 知识卡片 -->
    <div v-if="showKnowledge" class="mb-6 rounded-xl border border-blue-400/20 bg-blue-500/10 p-4 backdrop-blur-lg">
      <h3 class="text-lg font-semibold text-blue-400 mb-2">体积重是什么？</h3>
      <p class="text-gray-300 text-sm leading-relaxed">
        体积重用于衡量“体积大但很轻”的包裹的计费重量，计算公式通常为：长 × 宽 × 高 ÷ 除数。
        国内快递常用除数 6000，国际快递常用除数 5000，不同公司可能不同，具体以承运商规则为准。
      </p>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- 输入区域 -->
      <div class="xl:col-span-1">
        <div class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
          <h2 class="text-xl font-semibold text-white mb-4">输入包裹信息</h2>

          <!-- 单位选择 -->
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label class="block text-xs text-gray-400 mb-1">长度单位</label>
              <select v-model="selectedUnit" class="w-full rounded-md border border-white/10 bg-white/5 p-2 text-white text-sm">
                <option value="cm">厘米 (cm)</option>
                <option value="mm">毫米 (mm)</option>
                <option value="inch">英寸 (inch)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-gray-400 mb-1">重量单位</label>
              <select v-model="selectedWeightUnit" class="w-full rounded-md border border-white/10 bg-white/5 p-2 text-white text-sm">
                <option value="kg">千克 (kg)</option>
                <option value="g">克 (g)</option>
                <option value="lb">磅 (lb)</option>
              </select>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label for="length" class="block text-sm text-gray-400 mb-1">长度</label>
              <input id="length" type="number" v-model="dimensions.length" :placeholder="`长度 (${selectedUnit})`" class="w-full rounded-md border border-white/10 bg-white/5 p-2 text-white placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400" />
            </div>
            <div>
              <label for="width" class="block text-sm text-gray-400 mb-1">宽度</label>
              <input id="width" type="number" v-model="dimensions.width" :placeholder="`宽度 (${selectedUnit})`" class="w-full rounded-md border border-white/10 bg-white/5 p-2 text-white placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400" />
            </div>
            <div>
              <label for="height" class="block text-sm text-gray-400 mb-1">高度</label>
              <input id="height" type="number" v-model="dimensions.height" :placeholder="`高度 (${selectedUnit})`" class="w-full rounded-md border border-white/10 bg-white/5 p-2 text-white placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400" />
            </div>
            <div>
              <label for="actualWeight" class="block text-sm text-gray-400 mb-1">实际重量</label>
              <input id="actualWeight" type="number" v-model="dimensions.actualWeight" :placeholder="`实际重量 (${selectedWeightUnit})`" class="w-full rounded-md border border-white/10 bg-white/5 p-2 text-white placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400" />
            </div>
            
            <!-- 快递选择 -->
            <div>
              <label for="courier" class="block text-sm text-gray-400 mb-1">承运商</label>
              <select id="courier" v-model="selectedCourier" class="w-full rounded-md border border-white/10 bg-white/5 p-2 text-white focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400">
                <option v-for="courier in courierOptions" :key="courier.name" :value="courier">{{ courier.name }} (除数: {{ courier.divisor }})</option>
              </select>
              <p class="text-xs text-gray-400 mt-1">{{ selectedCourier.description }}</p>
            </div>

            <div v-if="selectedCourier.name === '其他 (自定义)'">
              <label for="customDivisor" class="block text-sm text-gray-400 mb-1">自定义除数</label>
              <input id="customDivisor" type="number" v-model="customDivisor" class="w-full rounded-md border border-white/10 bg-white/5 p-2 text-white placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400" />
            </div>

            <!-- 预设尺寸 -->
            <div>
              <button @click="showPresets = !showPresets" class="text-xs text-fuchsia-400 hover:text-fuchsia-300">常见尺寸预设</button>
              <div v-if="showPresets" class="mt-2 grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                <button v-for="p in packagePresets" :key="p.name" @click="usePreset(p)" class="text-xs px-2 py-1 rounded border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors">
                  {{ p.name }}
                </button>
              </div>
            </div>
          </div>

          <div class="flex gap-2 mt-4">
            <button 
              @click="resetCalculator" 
              class="flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors"
            >
              <RotateCcw class="w-4 h-4" />
              重置
            </button>
          </div>
        </div>
      </div>

      <!-- 结果区域 -->
      <div class="xl:col-span-2">
        <div class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg h-full">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-white">计算结果</h2>
            <button 
              v-if="chargeableWeight > 0"
              @click="copyResult"
              class="flex items-center gap-2 rounded-md bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-700 transition-colors"
            >
              <Copy class="w-4 h-4" />
              {{ copyStatus || '复制结果' }}
            </button>
          </div>

          <div v-if="!isValidInput" class="text-center py-12">
            <div class="text-gray-400 text-lg mb-2">请输入有效的尺寸与重量</div>
            <p class="text-gray-500 text-sm">选择承运商后，我们会自动计算体积重与计费重量</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 左侧：数值结果 -->
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-400">体积</p>
                <p class="text-2xl font-bold text-white">{{ (volume || 0).toFixed(0) }} cm³</p>
              </div>
              <div>
                <p class="text-sm text-gray-400">体积重 (kg)</p>
                <p class="text-3xl font-bold text-fuchsia-400">{{ (volumeWeight || 0).toFixed(2) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-400">实际重量 (kg)</p>
                <p class="text-2xl font-bold text-white">{{ (actualWeightKg || 0).toFixed(2) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-400">计费重量 (kg)</p>
                <p class="text-4xl font-bold text-green-400">{{ (chargeableWeight || 0).toFixed(2) }}</p>
              </div>

              <div v-if="estimatedCost" class="rounded-lg border border-white/10 bg-white/5 p-4">
                <div class="text-sm text-gray-400 mb-2">预估费用 (仅供参考)</div>
                <div class="text-2xl font-bold text-emerald-400">¥ {{ estimatedCost.total.toFixed(2) }}</div>
                <div class="text-xs text-gray-400 mt-1">首重 ¥{{ estimatedCost.breakdown.base }} + 续重 ¥{{ estimatedCost.breakdown.additional }} (按 {{ estimatedCost.breakdown.weight }} kg 计)</div>
              </div>

              <div v-if="packagingSuggestions.length" class="rounded-lg border border-white/10 bg-white/5 p-4">
                <div class="text-sm font-semibold text-white mb-2">包装建议</div>
                <ul class="list-disc pl-5 text-xs text-gray-300 space-y-1">
                  <li v-for="s in packagingSuggestions" :key="s">{{ s }}</li>
                </ul>
              </div>
            </div>

            <!-- 右侧：可视化示意 -->
            <div>
              <h3 class="text-sm font-semibold text-white mb-3">尺寸示意</h3>
              <div class="bg-white/5 rounded-lg p-4 flex items-center justify-center" style="min-height: 220px;">
                <div class="relative bg-white/10 border border-white/20 rounded" 
                     :style="{
                       width: Math.min(220, 2 + (convertToStandardUnit(dimensions.length, selectedUnit) * 2)) + 'px',
                       height: Math.min(160, 2 + (convertToStandardUnit(dimensions.height, selectedUnit) * 2)) + 'px'
                     }">
                  <div class="absolute inset-1 bg-fuchsia-400/30 border border-fuchsia-400/50 rounded-sm"></div>
                  <div class="absolute -top-6 left-0 text-xs text-gray-400">{{ dimensions.length || 0 }} {{ selectedUnit }}</div>
                  <div class="absolute -left-12 top-0 text-xs text-gray-400 transform -rotate-90 origin-left">{{ dimensions.height || 0 }} {{ selectedUnit }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
