<script setup>
import { reactive, ref, computed } from 'vue';
import { Copy, RotateCcw, Info, Palette, Eye, RefreshCw, History, BookOpen } from 'lucide-vue-next';

const showKnowledge = ref(false);
const showPresets = ref(false);
const showStandards = ref(false);
const copyStatus = ref('');
const history = ref([]);

// 定义两个颜色对象
const color1 = reactive({
  hex: '#FF5733',
  rgb: { r: 255, g: 87, b: 51 },
  lab: { l: 64.31, a: 52.91, b: 51.18 }
});

const color2 = reactive({
  hex: '#33FF57',
  rgb: { r: 51, g: 255, b: 87 },
  lab: { l: 82.65, a: -63.45, b: 61.23 }
});

// Delta E 计算方法
const deltaEMethod = ref('cie76');

// 预设颜色对
const colorPresets = [
  {
    name: '几乎无差异',
    color1: '#FF5733',
    color2: '#FF5834',
    description: 'ΔE < 1，人眼几乎无法察觉'
  },
  {
    name: '轻微差异',
    color1: '#FF5733',
    color2: '#F55A40',
    description: 'ΔE 1-2，训练有素的眼睛可能察觉'
  },
  {
    name: '明显差异',
    color1: '#FF5733',
    color2: '#E85D4D',
    description: 'ΔE 2-10，普通人可以察觉'
  },
  {
    name: '显著差异',
    color1: '#FF5733',
    color2: '#CC6666',
    description: 'ΔE 11-49，明显不同'
  },
  {
    name: '极大差异',
    color1: '#FF5733',
    color2: '#33FF57',
    description: 'ΔE > 50，完全不同的颜色'
  }
];

// 行业标准容差
const toleranceStandards = [
  { name: '高级印刷', range: '< 1.0', description: '顶级印刷品质，几乎完美匹配' },
  { name: '商业印刷', range: '1.0 - 2.0', description: '商业可接受的印刷质量' },
  { name: '一般印刷', range: '2.0 - 4.0', description: '一般商业印刷可接受范围' },
  { name: '包装印刷', range: '3.0 - 6.0', description: '包装行业常见容差范围' },
  { name: '纺织染色', range: '2.0 - 5.0', description: '纺织品染色工业标准' },
  { name: '涂料工业', range: '1.5 - 3.0', description: '涂料配色行业标准' },
];

// 颜色转换函数
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const rgbToXyz = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) * 100;
  const y = (r * 0.2126 + g * 0.7152 + b * 0.0722) * 100;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) * 100;
  return { x, y, z };
};

const xyzToLab = (x, y, z) => {
  x /= 95.047; y /= 100.000; z /= 108.883;
  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
  
  return {
    l: (116 * y) - 16,
    a: 500 * (x - y),
    b: 200 * (y - z)
  };
};

const rgbToLab = (r, g, b) => {
  const xyz = rgbToXyz(r, g, b);
  return xyzToLab(xyz.x, xyz.y, xyz.z);
};

// Delta E 计算函数
const calculateDeltaE76 = (lab1, lab2) => {
  const deltaL = lab1.l - lab2.l;
  const deltaA = lab1.a - lab2.a;
  const deltaB = lab1.b - lab2.b;
  return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
};

const calculateDeltaE94 = (lab1, lab2) => {
  const deltaL = lab1.l - lab2.l;
  const deltaA = lab1.a - lab2.a;
  const deltaB = lab1.b - lab2.b;
  
  const c1 = Math.sqrt(lab1.a * lab1.a + lab1.b * lab1.b);
  const c2 = Math.sqrt(lab2.a * lab2.a + lab2.b * lab2.b);
  const deltaC = c1 - c2;
  const deltaH = Math.sqrt(deltaA * deltaA + deltaB * deltaB - deltaC * deltaC);
  
  const sl = 1;
  const sc = 1 + 0.045 * c1;
  const sh = 1 + 0.015 * c1;
  
  return Math.sqrt(
    Math.pow(deltaL / sl, 2) +
    Math.pow(deltaC / sc, 2) +
    Math.pow(deltaH / sh, 2)
  );
};

const calculateDeltaE2000 = (lab1, lab2) => {
  const avgL = (lab1.l + lab2.l) / 2;
  const c1 = Math.sqrt(lab1.a * lab1.a + lab1.b * lab1.b);
  const c2 = Math.sqrt(lab2.a * lab2.a + lab2.b * lab2.b);
  const avgC = (c1 + c2) / 2;
  
  const g = 0.5 * (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7))));
  const a1p = lab1.a * (1 + g);
  const a2p = lab2.a * (1 + g);
  
  const c1p = Math.sqrt(a1p * a1p + lab1.b * lab1.b);
  const c2p = Math.sqrt(a2p * a2p + lab2.b * lab2.b);
  const avgCp = (c1p + c2p) / 2;
  
  const h1p = Math.atan2(lab1.b, a1p) * 180 / Math.PI;
  const h2p = Math.atan2(lab2.b, a2p) * 180 / Math.PI;
  
  let deltaHp;
  if (Math.abs(h1p - h2p) <= 180) {
    deltaHp = h2p - h1p;
  } else if (h2p - h1p > 180) {
    deltaHp = h2p - h1p - 360;
  } else {
    deltaHp = h2p - h1p + 360;
  }
  
  const deltaLp = lab2.l - lab1.l;
  const deltaCp = c2p - c1p;
  const deltaHpPrime = 2 * Math.sqrt(c1p * c2p) * Math.sin(deltaHp * Math.PI / 360);
  
  const avgHp = Math.abs(h1p - h2p) <= 180 ? (h1p + h2p) / 2 : 
               h1p + h2p < 360 ? (h1p + h2p + 360) / 2 : (h1p + h2p - 360) / 2;
  
  const T = 1 - 0.17 * Math.cos((avgHp - 30) * Math.PI / 180) +
           0.24 * Math.cos(2 * avgHp * Math.PI / 180) +
           0.32 * Math.cos((3 * avgHp + 6) * Math.PI / 180) -
           0.20 * Math.cos((4 * avgHp - 63) * Math.PI / 180);
  
  const deltaTheta = 30 * Math.exp(-Math.pow((avgHp - 275) / 25, 2));
  const rc = 2 * Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + Math.pow(25, 7)));
  const sl = 1 + 0.015 * Math.pow(avgL - 50, 2) / Math.sqrt(20 + Math.pow(avgL - 50, 2));
  const sc = 1 + 0.045 * avgCp;
  const sh = 1 + 0.015 * avgCp * T;
  const rt = -Math.sin(2 * deltaTheta * Math.PI / 180) * rc;
  
  return Math.sqrt(
    Math.pow(deltaLp / sl, 2) +
    Math.pow(deltaCp / sc, 2) +
    Math.pow(deltaHpPrime / sh, 2) +
    rt * (deltaCp / sc) * (deltaHpPrime / sh)
  );
};

// 计算当前Delta E值
const deltaEValue = computed(() => {
  switch (deltaEMethod.value) {
    case 'cie94':
      return calculateDeltaE94(color1.lab, color2.lab);
    case 'cie2000':
      return calculateDeltaE2000(color1.lab, color2.lab);
    default:
      return calculateDeltaE76(color1.lab, color2.lab);
  }
});

// 获取差异等级描述
const getDifferenceDescription = (deltaE) => {
  if (deltaE < 1.0) {
    return { 
      level: '几乎无差异', 
      description: '人眼几乎无法察觉的微小差异，专业级别匹配', 
      color: 'text-green-400',
      quality: '优秀'
    };
  } else if (deltaE < 2.0) {
    return { 
      level: '轻微差异', 
      description: '只有经过训练的专业人员才能察觉，商业级别匹配', 
      color: 'text-blue-400',
      quality: '良好'
    };
  } else if (deltaE < 4.0) {
    return { 
      level: '可察觉差异', 
      description: '普通人可以察觉到差异，但仍在可接受范围内', 
      color: 'text-yellow-400',
      quality: '一般'
    };
  } else if (deltaE < 10.0) {
    return { 
      level: '明显差异', 
      description: '差异很明显，需要进行颜色校正', 
      color: 'text-orange-400',
      quality: '较差'
    };
  } else {
    return { 
      level: '显著差异', 
      description: '颜色差异极大，完全不匹配', 
      color: 'text-red-400',
      quality: '不可接受'
    };
  }
};

const differenceInfo = computed(() => getDifferenceDescription(deltaEValue.value));

// 更新颜色
const updateColor = (colorObj, newHex) => {
  const newRgb = hexToRgb(newHex);
  if (newRgb) {
    colorObj.hex = newHex;
    Object.assign(colorObj.rgb, newRgb);
    Object.assign(colorObj.lab, rgbToLab(newRgb.r, newRgb.g, newRgb.b));
  }
};

// 使用预设颜色对
const usePreset = (preset) => {
  updateColor(color1, preset.color1);
  updateColor(color2, preset.color2);
  showPresets.value = false;
  
  // 添加到历史记录
  addToHistory();
};

// 交换颜色
const swapColors = () => {
  const tempColor = {
    hex: color1.hex,
    rgb: { ...color1.rgb },
    lab: { ...color1.lab }
  };
  
  updateColor(color1, color2.hex);
  updateColor(color2, tempColor.hex);
};

// 随机生成颜色
const generateRandomColors = () => {
  const randomHex1 = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
  const randomHex2 = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
  updateColor(color1, randomHex1);
  updateColor(color2, randomHex2);
  addToHistory();
};

// 添加历史记录
const addToHistory = () => {
  const record = {
    color1: color1.hex,
    color2: color2.hex,
    deltaE: deltaEValue.value.toFixed(2),
    method: deltaEMethod.value,
    timestamp: new Date().toLocaleTimeString()
  };
  
  history.value.unshift(record);
  if (history.value.length > 10) {
    history.value.pop();
  }
};

// 复制结果
const copyResult = async () => {
  const text = `颜色差异分析结果：
颜色1: ${color1.hex}
颜色2: ${color2.hex}
ΔE值: ${deltaEValue.value.toFixed(3)} (${deltaEMethod.value.toUpperCase()})
差异等级: ${differenceInfo.value.level}
质量评价: ${differenceInfo.value.quality}`;

  try {
    await navigator.clipboard.writeText(text);
    copyStatus.value = '复制成功!';
    setTimeout(() => copyStatus.value = '', 2000);
  } catch (err) {
    copyStatus.value = '复制失败';
    setTimeout(() => copyStatus.value = '', 2000);
  }
};

// 重置
const reset = () => {
  updateColor(color1, '#FF5733');
  updateColor(color2, '#33FF57');
  deltaEMethod.value = 'cie76';
};

// 初始化
updateColor(color1, color1.hex);
updateColor(color2, color2.hex);
</script>

<template>
  <div class="text-white">
    <!-- 标题区域 -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-white flex items-center gap-3">
            颜色差异(ΔE)解释器
            <button 
              @click="showKnowledge = !showKnowledge"
              class="text-gray-400 hover:text-fuchsia-400 transition-colors"
              title="了解ΔE知识"
            >
              <Info class="w-6 h-6" />
            </button>
          </h1>
          <p class="mt-2 text-gray-300">通过ΔE值量化颜色差异，支持CIE76、CIE94、CIE2000多种计算标准。</p>
        </div>
      </div>
    </div>

    <!-- 知识卡片 -->
    <div v-if="showKnowledge" class="mb-6 rounded-xl border border-blue-400/20 bg-blue-500/10 p-4 backdrop-blur-lg">
      <h3 class="text-lg font-semibold text-blue-400 mb-2">什么是ΔE？</h3>
      <div class="text-gray-300 text-sm leading-relaxed space-y-2">
        <p>• <strong>ΔE (Delta E)</strong>：表示两种颜色在视觉感知上的差异程度，数值越小差异越小</p>
        <p>• <strong>CIE76</strong>：最早的ΔE标准，计算简单但与人眼感知差异较大</p>
        <p>• <strong>CIE94</strong>：改进版本，更符合人眼对颜色差异的感知</p>
        <p>• <strong>CIE2000</strong>：最新标准，最接近人眼的实际感知，计算最复杂</p>
        <p>• <strong>应用场景</strong>：印刷、纺织、涂料、显示器等需要精确颜色匹配的行业</p>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <!-- 左侧：控制面板 -->
      <div class="xl:col-span-1">
        <div class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
          <h2 class="text-xl font-semibold text-white mb-4">控制面板</h2>
          
          <!-- 计算方法选择 -->
          <div class="mb-6">
            <label class="block text-sm text-gray-400 mb-2">ΔE 计算方法</label>
            <select v-model="deltaEMethod" class="w-full rounded-md border border-white/10 bg-white/5 p-2 text-white">
              <option value="cie76">CIE 1976 (ΔE*ab)</option>
              <option value="cie94">CIE 1994 (ΔE*94)</option>
              <option value="cie2000">CIE 2000 (ΔE*00)</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">
              {{ deltaEMethod === 'cie76' ? '最简单，适合基础应用' : 
                 deltaEMethod === 'cie94' ? '改进版本，商业常用' : 
                 '最新标准，最准确' }}
            </p>
          </div>

          <!-- 快速操作 -->
          <div class="space-y-3 mb-6">
            <button 
              @click="swapColors"
              class="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              <RefreshCw class="w-4 h-4" />
              交换颜色
            </button>
            
            <button 
              @click="generateRandomColors"
              class="w-full flex items-center justify-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
            >
              <Palette class="w-4 h-4" />
              随机生成
            </button>
            
            <button 
              @click="reset"
              class="w-full flex items-center justify-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors"
            >
              <RotateCcw class="w-4 h-4" />
              重置
            </button>
          </div>

          <!-- 预设颜色对 -->
          <div>
            <button @click="showPresets = !showPresets" class="text-sm text-fuchsia-400 hover:text-fuchsia-300 mb-3">
              示例颜色对 {{ showPresets ? '▲' : '▼' }}
            </button>
            <div v-if="showPresets" class="space-y-2">
              <button
                v-for="preset in colorPresets"
                :key="preset.name"
                @click="usePreset(preset)"
                class="w-full text-left p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div class="flex items-center gap-3 mb-1">
                  <div class="flex gap-1">
                    <div class="w-4 h-4 rounded" :style="{ backgroundColor: preset.color1 }"></div>
                    <div class="w-4 h-4 rounded" :style="{ backgroundColor: preset.color2 }"></div>
                  </div>
                  <span class="text-sm font-medium text-white">{{ preset.name }}</span>
                </div>
                <p class="text-xs text-gray-400">{{ preset.description }}</p>
              </button>
            </div>
          </div>

          <!-- 行业标准 -->
          <div class="mt-6">
            <button @click="showStandards = !showStandards" class="text-sm text-yellow-400 hover:text-yellow-300 mb-3">
              行业容差标准 {{ showStandards ? '▲' : '▼' }}
            </button>
            <div v-if="showStandards" class="space-y-2">
              <div
                v-for="standard in toleranceStandards"
                :key="standard.name"
                class="p-2 rounded border border-white/10 bg-white/5"
              >
                <div class="flex justify-between items-center mb-1">
                  <span class="text-xs font-medium text-white">{{ standard.name }}</span>
                  <span class="text-xs text-gray-400">ΔE {{ standard.range }}</span>
                </div>
                <p class="text-xs text-gray-500">{{ standard.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 历史记录 -->
        <div v-if="history.length > 0" class="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg">
          <h3 class="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <History class="w-4 h-4" />
            对比历史
          </h3>
          <div class="space-y-2 max-h-40 overflow-y-auto">
            <div v-for="record in history.slice(0, 5)" :key="record.timestamp" class="text-xs">
              <div class="flex items-center justify-between mb-1">
                <div class="flex gap-1">
                  <div class="w-3 h-3 rounded" :style="{ backgroundColor: record.color1 }"></div>
                  <div class="w-3 h-3 rounded" :style="{ backgroundColor: record.color2 }"></div>
                </div>
                <span class="text-gray-400">ΔE {{ record.deltaE }}</span>
              </div>
              <div class="flex justify-between text-gray-500">
                <span>{{ record.method.toUpperCase() }}</span>
                <span>{{ record.timestamp }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：主要内容区域 -->
      <div class="xl:col-span-3">
        <div class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
          <!-- 颜色对比区域 -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-white">颜色对比</h2>
              <button 
                @click="copyResult"
                class="flex items-center gap-2 rounded-md bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-700 transition-colors"
              >
                <Copy class="w-4 h-4" />
                {{ copyStatus || '复制结果' }}
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <!-- 颜色1 -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">颜色 1</label>
                <div class="space-y-3">
                  <div 
                    class="w-full h-32 rounded-lg border border-white/20 cursor-pointer transition-transform hover:scale-[1.02]" 
                    :style="{ backgroundColor: color1.hex }"
                    @click="$refs.color1Picker.click()"
                  >
                  </div>
                  <input 
                    ref="color1Picker"
                    type="color" 
                    :value="color1.hex"
                    @input="updateColor(color1, $event.target.value)"
                    class="sr-only"
                  />
                  <input 
                    type="text" 
                    :value="color1.hex"
                    @input="updateColor(color1, $event.target.value)"
                    class="w-full rounded-md border border-white/10 bg-white/5 p-2 text-white placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400"
                  />
                  <div class="text-xs text-gray-400">
                    <p>RGB: {{ color1.rgb.r }}, {{ color1.rgb.g }}, {{ color1.rgb.b }}</p>
                    <p>Lab: {{ color1.lab.l.toFixed(1) }}, {{ color1.lab.a.toFixed(1) }}, {{ color1.lab.b.toFixed(1) }}</p>
                  </div>
                </div>
              </div>

              <!-- 颜色2 -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">颜色 2</label>
                <div class="space-y-3">
                  <div 
                    class="w-full h-32 rounded-lg border border-white/20 cursor-pointer transition-transform hover:scale-[1.02]" 
                    :style="{ backgroundColor: color2.hex }"
                    @click="$refs.color2Picker.click()"
                  >
                  </div>
                  <input 
                    ref="color2Picker"
                    type="color" 
                    :value="color2.hex"
                    @input="updateColor(color2, $event.target.value)"
                    class="sr-only"
                  />
                  <input 
                    type="text" 
                    :value="color2.hex"
                    @input="updateColor(color2, $event.target.value)"
                    class="w-full rounded-md border border-white/10 bg-white/5 p-2 text-white placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400"
                  />
                  <div class="text-xs text-gray-400">
                    <p>RGB: {{ color2.rgb.r }}, {{ color2.rgb.g }}, {{ color2.rgb.b }}</p>
                    <p>Lab: {{ color2.lab.l.toFixed(1) }}, {{ color2.lab.a.toFixed(1) }}, {{ color2.lab.b.toFixed(1) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ΔE 结果展示 -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 数值结果 -->
            <div class="rounded-lg border border-white/10 bg-white/5 p-6">
              <h3 class="text-lg font-semibold text-white mb-4">ΔE 分析结果</h3>
              <div class="text-center mb-4">
                <div class="text-5xl font-bold text-fuchsia-400 mb-2">
                  {{ deltaEValue.toFixed(3) }}
                </div>
                <div class="text-sm text-gray-400">{{ deltaEMethod.toUpperCase() }} 值</div>
              </div>
              
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-gray-400">差异等级：</span>
                  <span :class="differenceInfo.color" class="font-semibold">{{ differenceInfo.level }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-400">质量评价：</span>
                  <span :class="differenceInfo.color" class="font-semibold">{{ differenceInfo.quality }}</span>
                </div>
                <div class="pt-2 border-t border-white/10">
                  <p class="text-sm text-gray-300">{{ differenceInfo.description }}</p>
                </div>
              </div>
            </div>

            <!-- 可视化对比 -->
            <div class="rounded-lg border border-white/10 bg-white/5 p-6">
              <h3 class="text-lg font-semibold text-white mb-4">视觉对比</h3>
              
              <!-- 并排对比 -->
              <div class="grid grid-cols-2 gap-2 mb-4">
                <div 
                  class="h-20 rounded border border-white/20 flex items-center justify-center"
                  :style="{ backgroundColor: color1.hex }"
                >
                  <span class="text-white text-shadow text-xs font-medium">颜色 1</span>
                </div>
                <div 
                  class="h-20 rounded border border-white/20 flex items-center justify-center"
                  :style="{ backgroundColor: color2.hex }"
                >
                  <span class="text-white text-shadow text-xs font-medium">颜色 2</span>
                </div>
              </div>

              <!-- 渐变过渡 -->
              <div class="h-12 rounded border border-white/20 mb-4" 
                   :style="{ background: `linear-gradient(90deg, ${color1.hex} 0%, ${color2.hex} 100%)` }">
              </div>

              <!-- ΔE 刻度尺 -->
              <div class="relative">
                <div class="text-xs text-gray-400 mb-1">ΔE 刻度参考</div>
                <div class="relative h-6 bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500 rounded">
                  <div class="absolute top-0 bottom-0 w-1 bg-white rounded" 
                       :style="{ left: Math.min(95, deltaEValue.value * 2) + '%' }">
                  </div>
                </div>
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>优秀</span>
                  <span>良好</span>
                  <span>一般</span>
                  <span>较差</span>
                  <span>50+</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 详细信息 -->
          <div class="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
            <h4 class="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <BookOpen class="w-4 h-4" />
              技术详情
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-400">
              <div>
                <p class="font-medium text-white mb-1">Lab色彩空间差异</p>
                <p>ΔL*: {{ (color2.lab.l - color1.lab.l).toFixed(2) }}</p>
                <p>Δa*: {{ (color2.lab.a - color1.lab.a).toFixed(2) }}</p>
                <p>Δb*: {{ (color2.lab.b - color1.lab.b).toFixed(2) }}</p>
              </div>
              <div>
                <p class="font-medium text-white mb-1">计算方法说明</p>
                <p>{{ deltaEMethod === 'cie76' ? '欧几里得距离公式' : 
                     deltaEMethod === 'cie94' ? '加权欧几里得距离' : 
                     '复合权重函数计算' }}</p>
              </div>
              <div>
                <p class="font-medium text-white mb-1">应用建议</p>
                <p>{{ deltaEValue.value < 2 ? '可用于高端印刷' : 
                     deltaEValue.value < 4 ? '适用于商业印刷' : 
                     deltaEValue.value < 10 ? '需要色彩校正' : '需要重新配色' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-shadow {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}
</style>