<script setup>
import { reactive, ref, computed } from 'vue';
import { Copy, RotateCcw, Info, Scale, Ruler, Bookmark, Calculator } from 'lucide-vue-next';

const showKnowledge = ref(false);
const copyStatus = ref('');
const selectedPaperType = ref('coated');

// 纸张数据模型
const paperData = reactive({
  grammage: '', // 克重 (g/m²)
  thickness_mm: '', // 厚度 (mm)
  thickness_um: '', // 厚度 (μm)  
  thickness_pt: '', // 厚度 (pt)
});

// 不同纸张类型的密度系数 (g/cm³)
const paperTypes = {
  newsprint: { 
    name: '新闻纸', 
    density: 0.45, 
    description: '轻薄，多孔，密度较低',
    examples: '报纸、快印纸'
  },
  office: { 
    name: '普通办公纸', 
    density: 0.7, 
    description: '标准复印纸密度',
    examples: 'A4复印纸、打印纸'
  },
  coated: { 
    name: '铜版纸', 
    density: 0.9, 
    description: '表面光滑，密度较高',
    examples: '杂志内页、宣传册'
  },
  art: { 
    name: '艺术纸', 
    density: 0.8, 
    description: '特殊纹理，中等密度',
    examples: '高端画册、邀请函'
  },
  cardboard: { 
    name: '卡纸/纸板', 
    density: 0.85, 
    description: '较厚较硬，密度中等偏高',
    examples: '名片、包装盒'
  },
  kraft: { 
    name: '牛皮纸', 
    density: 0.75, 
    description: '纤维粗糙，韧性强',
    examples: '信封、包装纸'
  },
  corrugated: { 
    name: '瓦楞纸', 
    density: 0.4, 
    description: '中空结构，密度很低',
    examples: '纸箱、包装材料'
  }
};

// 常用克重预设
const commonGrammage = [
  { name: '薄复印纸', value: 70, type: 'office' },
  { name: '标准复印纸', value: 80, type: 'office' },
  { name: '高级复印纸', value: 100, type: 'office' },
  { name: '轻涂纸', value: 115, type: 'coated' },
  { name: '铜版纸', value: 157, type: 'coated' },
  { name: '厚铜版纸', value: 250, type: 'coated' },
  { name: '轻卡纸', value: 300, type: 'cardboard' },
  { name: '标准卡纸', value: 400, type: 'cardboard' },
  { name: '重卡纸', value: 600, type: 'cardboard' }
];

// 当前纸张类型信息
const currentPaperType = computed(() => paperTypes[selectedPaperType.value]);

// 克重转厚度
function convertFromGrammage(grammage) {
  if (!grammage || isNaN(grammage)) {
    paperData.thickness_mm = '';
    paperData.thickness_um = '';
    paperData.thickness_pt = '';
    return;
  }
  
  const density = currentPaperType.value.density; // g/cm³
  const thickness_mm = grammage / (density * 1000); // mm
  
  paperData.thickness_mm = formatNumber(thickness_mm);
  paperData.thickness_um = formatNumber(thickness_mm * 1000);
  paperData.thickness_pt = formatNumber(thickness_mm * 2834.65); // 1mm = 2834.65pt
}

// 厚度转克重 (从毫米)
function convertFromThickness(thickness_mm) {
  if (!thickness_mm || isNaN(thickness_mm)) {
    paperData.grammage = '';
    return;
  }
  
  const density = currentPaperType.value.density; // g/cm³
  const grammage = thickness_mm * density * 1000; // g/m²
  
  paperData.grammage = formatNumber(grammage);
}

// 主转换函数
function convert(changedField) {
  const value = parseFloat(paperData[changedField]);
  
  if (isNaN(value) || value <= 0) {
    // 清空其他字段
    Object.keys(paperData).forEach(key => {
      if (key !== changedField) paperData[key] = '';
    });
    return;
  }
  
  switch (changedField) {
    case 'grammage':
      convertFromGrammage(value);
      break;
    case 'thickness_mm':
      // 同步其他厚度单位
      paperData.thickness_um = formatNumber(value * 1000);
      paperData.thickness_pt = formatNumber(value * 2834.65);
      convertFromThickness(value);
      break;
    case 'thickness_um':
      const mm_from_um = value / 1000;
      paperData.thickness_mm = formatNumber(mm_from_um);
      paperData.thickness_pt = formatNumber(mm_from_um * 2834.65);
      convertFromThickness(mm_from_um);
      break;
    case 'thickness_pt':
      const mm_from_pt = value / 2834.65;
      paperData.thickness_mm = formatNumber(mm_from_pt);
      paperData.thickness_um = formatNumber(mm_from_pt * 1000);
      convertFromThickness(mm_from_pt);
      break;
  }
}

// 数值格式化
function formatNumber(num) {
  if (num >= 1000) return num.toFixed(2);
  if (num >= 100) return num.toFixed(3);
  if (num >= 1) return num.toFixed(4);
  return num.toFixed(6);
}

// 使用预设
function usePreset(preset) {
  selectedPaperType.value = preset.type;
  paperData.grammage = preset.value;
  convert('grammage');
}

// 重置所有数据
function reset() {
  Object.keys(paperData).forEach(key => paperData[key] = '');
}

// 复制功能
async function copyValue(value, unit) {
  const text = `${value} ${unit}`;
  try {
    await navigator.clipboard.writeText(text);
    copyStatus.value = '复制成功!';
    setTimeout(() => copyStatus.value = '', 2000);
  } catch (err) {
    copyStatus.value = '复制失败';
    setTimeout(() => copyStatus.value = '', 2000);
  }
}

// 纸张类型改变时重新计算
function onPaperTypeChange() {
  if (paperData.grammage) {
    convert('grammage');
  } else if (paperData.thickness_mm) {
    convert('thickness_mm');
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
            纸张克重与厚度换算器
            <button 
              @click="showKnowledge = !showKnowledge"
              class="text-gray-400 hover:text-fuchsia-400 transition-colors"
              title="了解克重与厚度关系"
            >
              <Info class="w-6 h-6" />
            </button>
          </h1>
          <p class="mt-2 text-gray-300">
            基于不同纸张类型的密度特性，实现克重(g/m²)与厚度(mm/μm/pt)的精确换算。
          </p>
        </div>
      </div>
    </div>

    <!-- 知识卡片 -->
    <div v-if="showKnowledge" class="mb-6 rounded-xl border border-blue-400/20 bg-blue-500/10 p-6 backdrop-blur-lg">
      <h3 class="text-lg font-semibold text-blue-400 mb-4">纸张克重与厚度关系知识</h3>
      <div class="grid md:grid-cols-2 gap-6 text-gray-300 text-sm leading-relaxed">
        <div>
          <h4 class="font-semibold text-white mb-2">基础概念</h4>
          <div class="space-y-2">
            <p>• <strong>克重(GSM):</strong> 每平方米纸张的重量，单位g/m²</p>
            <p>• <strong>厚度:</strong> 纸张的物理厚度，常用mm、μm、pt表示</p>
            <p>• <strong>密度:</strong> 纸张的密实程度，影响克重与厚度的关系</p>
            <p>• <strong>换算公式:</strong> 厚度(mm) = 克重(g/m²) ÷ (密度(g/cm³) × 1000)</p>
          </div>
        </div>
        <div>
          <h4 class="font-semibold text-white mb-2">纸张类型密度参考</h4>
          <div class="space-y-1">
            <p>• <strong>新闻纸:</strong> 0.45 g/cm³ (多孔轻薄)</p>
            <p>• <strong>办公纸:</strong> 0.7 g/cm³ (标准密度)</p>
            <p>• <strong>铜版纸:</strong> 0.9 g/cm³ (表面致密)</p>
            <p>• <strong>卡纸:</strong> 0.85 g/cm³ (厚实坚挺)</p>
            <p>• <strong>瓦楞纸:</strong> 0.4 g/cm³ (中空结构)</p>
          </div>
        </div>
      </div>
      <div class="mt-4 p-3 bg-yellow-500/10 border border-yellow-400/20 rounded-lg">
        <p class="text-yellow-200 text-sm">
          <strong>注意:</strong> 实际厚度会因制造工艺、压光处理等因素有所偏差，此工具提供的是理论估算值，实际应用中建议以实测为准。
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <!-- 左侧：纸张类型选择和预设 -->
      <div class="xl:col-span-1">
        <div class="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg">
          <!-- 纸张类型选择 -->
          <h3 class="text-lg font-semibold text-white mb-4">纸张类型</h3>
          <div class="space-y-2 mb-6">
            <div 
              v-for="(type, key) in paperTypes" 
              :key="key"
              class="relative"
            >
              <button 
                @click="selectedPaperType = key; onPaperTypeChange();"
                :class="[
                  'w-full text-left p-3 rounded-lg border transition-colors',
                  selectedPaperType === key 
                    ? 'bg-fuchsia-600 border-fuchsia-500 text-white' 
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                ]"
              >
                <div class="font-medium">{{ type.name }}</div>
                <div class="text-xs opacity-80 mt-1">密度: {{ type.density }} g/cm³</div>
                <div class="text-xs opacity-70 mt-1">{{ type.examples }}</div>
              </button>
            </div>
          </div>

          <!-- 常用预设 -->
          <div>
            <h4 class="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Bookmark class="w-4 h-4" />
              常用规格
            </h4>
            <div class="space-y-1">
              <button
                v-for="preset in commonGrammage"
                :key="preset.name"
                @click="usePreset(preset)"
                class="w-full text-left px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
              >
                <div class="flex justify-between">
                  <span>{{ preset.name }}</span>
                  <span>{{ preset.value }}g/m²</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：换算器主区域 -->
      <div class="xl:col-span-3">
        <div class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-white flex items-center gap-2">
              <Calculator class="w-5 h-5" />
              {{ currentPaperType.name }} 换算
            </h2>
            <div class="flex gap-2">
              <button 
                @click="reset" 
                class="flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20 transition-colors"
              >
                <RotateCcw class="w-4 h-4" />
                重置
              </button>
            </div>
          </div>

          <!-- 当前纸张类型信息 -->
          <div class="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
            <div class="flex items-center gap-2 mb-2">
              <Scale class="w-4 h-4 text-fuchsia-400" />
              <span class="font-medium text-white">{{ currentPaperType.name }}</span>
            </div>
            <p class="text-sm text-gray-300">{{ currentPaperType.description }}</p>
            <p class="text-xs text-gray-400 mt-1">
              密度: {{ currentPaperType.density }} g/cm³ • 适用于: {{ currentPaperType.examples }}
            </p>
          </div>

          <!-- 换算输入区域 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 克重输入 -->
            <div class="space-y-4">
              <div class="text-center p-4 rounded-lg bg-gradient-to-r from-fuchsia-500/10 to-pink-500/10 border border-fuchsia-400/20">
                <Scale class="w-8 h-8 text-fuchsia-400 mx-auto mb-2" />
                <h3 class="text-lg font-semibold text-white">克重 (GSM)</h3>
              </div>
              
              <div class="relative group">
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm font-medium text-gray-300">
                    克重 <span class="text-fuchsia-400">(g/m²)</span>
                  </label>
                  <button 
                    v-if="paperData.grammage"
                    @click="copyValue(paperData.grammage, 'g/m²')"
                    class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-fuchsia-400 transition-all"
                    :title="copyStatus || '复制'"
                  >
                    <Copy class="w-4 h-4" />
                  </button>
                </div>
                <input 
                  type="number"
                  step="any"
                  v-model="paperData.grammage"
                  @input="convert('grammage')"
                  placeholder="输入纸张克重"
                  class="w-full rounded-md border border-white/10 bg-white/5 p-4 text-white text-lg placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400 transition-colors"
                />
                <p class="text-xs text-gray-500 mt-2">每平方米纸张的重量</p>
              </div>
            </div>

            <!-- 厚度输入 -->
            <div class="space-y-4">
              <div class="text-center p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/20">
                <Ruler class="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h3 class="text-lg font-semibold text-white">厚度</h3>
              </div>

              <!-- 毫米 -->
              <div class="relative group">
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm font-medium text-gray-300">
                    厚度 <span class="text-blue-400">(mm)</span>
                  </label>
                  <button 
                    v-if="paperData.thickness_mm"
                    @click="copyValue(paperData.thickness_mm, 'mm')"
                    class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-400 transition-all"
                  >
                    <Copy class="w-4 h-4" />
                  </button>
                </div>
                <input 
                  type="number"
                  step="any"
                  v-model="paperData.thickness_mm"
                  @input="convert('thickness_mm')"
                  placeholder="输入厚度(毫米)"
                  class="w-full rounded-md border border-white/10 bg-white/5 p-4 text-white text-lg placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors"
                />
              </div>

              <!-- 微米 -->
              <div class="relative group">
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm font-medium text-gray-300">
                    厚度 <span class="text-blue-400">(μm)</span>
                  </label>
                  <button 
                    v-if="paperData.thickness_um"
                    @click="copyValue(paperData.thickness_um, 'μm')"
                    class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-400 transition-all"
                  >
                    <Copy class="w-4 h-4" />
                  </button>
                </div>
                <input 
                  type="number"
                  step="any"
                  v-model="paperData.thickness_um"
                  @input="convert('thickness_um')"
                  placeholder="输入厚度(微米)"
                  class="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors"
                />
              </div>

              <!-- 点 -->
              <div class="relative group">
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm font-medium text-gray-300">
                    厚度 <span class="text-blue-400">(pt)</span>
                  </label>
                  <button 
                    v-if="paperData.thickness_pt"
                    @click="copyValue(paperData.thickness_pt, 'pt')"
                    class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-400 transition-all"
                  >
                    <Copy class="w-4 h-4" />
                  </button>
                </div>
                <input 
                  type="number"
                  step="any"
                  v-model="paperData.thickness_pt"
                  @input="convert('thickness_pt')"
                  placeholder="输入厚度(点)"
                  class="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors"
                />
                <p class="text-xs text-gray-500 mt-1">印刷行业常用厚度单位</p>
              </div>
            </div>
          </div>

          <!-- 使用说明 -->
          <div class="mt-8 p-4 rounded-lg bg-white/5 border border-white/10">
            <h4 class="text-sm font-semibold text-white mb-3">使用说明</h4>
            <div class="text-xs text-gray-400 leading-relaxed space-y-2">
              <p>• <strong>选择纸张类型:</strong> 不同纸张类型有不同密度，影响换算结果的准确性</p>
              <p>• <strong>双向换算:</strong> 输入克重可得厚度，输入厚度可得克重</p>
              <p>• <strong>多单位支持:</strong> 支持mm、μm、pt三种厚度单位的同时显示</p>
              <p>• <strong>快速预设:</strong> 点击左侧常用规格可快速填入标准数值</p>
              <p>• <strong>精度说明:</strong> 计算结果为理论值，实际可能因工艺等因素有偏差</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>