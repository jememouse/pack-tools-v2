<script setup>
import { reactive, ref, computed, nextTick, onMounted } from 'vue';
import { Copy, RotateCcw, Info } from 'lucide-vue-next';
import LikeButton from '../components/LikeButton.vue';
import { initializeDefaultLikes } from '../services/likeService.js';

const product = reactive({
  width: '',
  height: '',
});

const sheet = reactive({
  width: '',
  height: '',
});

const showKnowledge = ref(false);
const showPresets = ref(false);
const copyStatus = ref('');

// 常用纸张规格 (单位: mm)
const paperPresets = [
  { name: 'A4', width: 210, height: 297 },
  { name: 'A3', width: 297, height: 420 },
  { name: 'A2', width: 420, height: 594 },
  { name: 'A1', width: 594, height: 841 },
  { name: 'A0', width: 841, height: 1189 },
  { name: '16K', width: 195, height: 270 },
  { name: '8K', width: 270, height: 390 },
  { name: '4K', width: 390, height: 540 },
  { name: '对开', width: 540, height: 780 },
  { name: '全开', width: 780, height: 1080 },
  { name: '大度16K', width: 210, height: 285 },
  { name: '大度8K', width: 285, height: 420 },
  { name: '正度16K', width: 185, height: 260 },
  { name: '正度8K', width: 260, height: 370 },
];

// 计算拼版结果
const calculateLayout = (pWidth, pHeight, sWidth, sHeight) => {
  if (!pWidth || !pHeight || !sWidth || !sHeight || pWidth <= 0 || pHeight <= 0 || sWidth <= 0 || sHeight <= 0) {
    return {
      normal: { rows: 0, cols: 0, total: 0 },
      rotated: { rows: 0, cols: 0, total: 0 },
      best: { rows: 0, cols: 0, total: 0, orientation: 'normal' }
    };
  }

  // 成品正常摆放
  const normalRows = Math.floor(sHeight / pHeight);
  const normalCols = Math.floor(sWidth / pWidth);
  const normalTotal = normalRows * normalCols;

  // 成品旋转90度摆放
  const rotatedRows = Math.floor(sHeight / pWidth);
  const rotatedCols = Math.floor(sWidth / pHeight);
  const rotatedTotal = rotatedRows * rotatedCols;

  // 确定最佳摆放方式
  const best = normalTotal >= rotatedTotal
    ? { rows: normalRows, cols: normalCols, total: normalTotal, orientation: 'normal' }
    : { rows: rotatedRows, cols: rotatedCols, total: rotatedTotal, orientation: 'rotated' };

  return {
    normal: { rows: normalRows, cols: normalCols, total: normalTotal },
    rotated: { rows: rotatedRows, cols: rotatedCols, total: rotatedTotal },
    best
  };
};

// 计算结果
const layoutResult = computed(() => {
  const pWidth = parseFloat(product.width);
  const pHeight = parseFloat(product.height);
  const sWidth = parseFloat(sheet.width);
  const sHeight = parseFloat(sheet.height);

  return calculateLayout(pWidth, pHeight, sWidth, sHeight);
});

// 计算纸张利用率
const utilization = computed(() => {
  const result = layoutResult.value;
  const pWidth = parseFloat(product.width);
  const pHeight = parseFloat(product.height);
  const sWidth = parseFloat(sheet.width);
  const sHeight = parseFloat(sheet.height);

  if (!result.best.total || !pWidth || !pHeight || !sWidth || !sHeight) {
    return 0;
  }

  const productArea = result.best.orientation === 'normal' 
    ? pWidth * pHeight
    : pHeight * pWidth;
  
  const usedArea = result.best.total * productArea;
  const totalArea = sWidth * sHeight;
  
  return Math.round((usedArea / totalArea) * 100);
});

// 输入验证
const isValidInput = computed(() => {
  const pWidth = parseFloat(product.width);
  const pHeight = parseFloat(product.height);
  const sWidth = parseFloat(sheet.width);
  const sHeight = parseFloat(sheet.height);

  return pWidth > 0 && pHeight > 0 && sWidth > 0 && sHeight > 0;
});

// 警告信息
const warnings = computed(() => {
  const warnings = [];
  const pWidth = parseFloat(product.width);
  const pHeight = parseFloat(product.height);
  const sWidth = parseFloat(sheet.width);
  const sHeight = parseFloat(sheet.height);

  if (isValidInput.value) {
    if (pWidth > sWidth || pHeight > sHeight) {
      warnings.push('成品尺寸超出大张纸尺寸');
    }
    if (utilization.value < 50) {
      warnings.push('纸张利用率较低，建议优化尺寸');
    }
  }

  return warnings;
});

function resetCalculator() {
  product.width = '';
  product.height = '';
  sheet.width = '';
  sheet.height = '';
}

function usePreset(preset) {
  sheet.width = preset.width;
  sheet.height = preset.height;
  showPresets.value = false;
}

async function copyResult() {
  const result = layoutResult.value;
  if (!result.best.total) return;

  const text = `拼版计算结果：
成品尺寸：${product.width} × ${product.height} mm
大张纸尺寸：${sheet.width} × ${sheet.height} mm
最佳摆放：${result.best.orientation === 'normal' ? '正常摆放' : '旋转90度'}
可拼数量：${result.best.total} 个 (${result.best.cols} × ${result.best.rows})
纸张利用率：${utilization.value}%`;

  try {
    await navigator.clipboard.writeText(text);
    copyStatus.value = '复制成功!';
    setTimeout(() => copyStatus.value = '', 2000);
  } catch (err) {
    copyStatus.value = '复制失败';
    setTimeout(() => copyStatus.value = '', 2000);
  }
}

// 初始化和点赞相关函数
onMounted(() => {
  initializeDefaultLikes();
});

// 处理点赞变化
const handleLikeChanged = (data) => {
  console.log('点赞变化:', data);
  if (data.liked) {
    copyStatus.value = '感谢您的支持！💖';
    setTimeout(() => copyStatus.value = '', 2000);
  }
};
</script>

<template>
  <div class="text-white">
    <!-- 标题区域 -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-white flex items-center gap-3">
            简易拼版计算器
            <button 
              @click="showKnowledge = !showKnowledge"
              class="text-gray-400 hover:text-fuchsia-400 transition-colors"
              title="了解拼版知识"
            >
              <Info class="w-6 h-6" />
            </button>
          </h1>
          <p class="mt-2 text-gray-300">快速估算一张大纸上最多能拼多少成品，为成本核算和纸张采购提供关键依据。</p>
        </div>
        <div class="flex items-center gap-4">
          <!-- 点赞组件 -->
          <LikeButton 
            item-id="simple-layout-calculator"
            :initial-count="76"
            @like-changed="handleLikeChanged"
          />
        </div>
      </div>
    </div>

    <!-- 知识卡片 -->
    <div v-if="showKnowledge" class="mb-6 rounded-xl border border-blue-400/20 bg-blue-500/10 p-4 backdrop-blur-lg">
      <h3 class="text-lg font-semibold text-blue-400 mb-2">什么是拼版？</h3>
      <p class="text-gray-300 text-sm leading-relaxed">
        拼版是指在一张大纸上安排多个相同成品的排版过程。通过合理的拼版可以最大化纸张利用率，降低印刷成本。
        成品可以正常摆放或旋转90度摆放，本工具会自动计算两种方式并推荐最佳方案。
      </p>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- 输入区域 -->
      <div class="xl:col-span-1">
        <div class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
          <h2 class="text-xl font-semibold text-white mb-4">输入尺寸信息</h2>
          
          <!-- 成品尺寸 -->
          <div class="mb-4">
            <label class="block text-sm text-gray-400 mb-2">成品尺寸 (含出血) - mm</label>
            <div class="grid grid-cols-2 gap-3">
              <input 
                type="number" 
                v-model="product.width" 
                placeholder="宽度" 
                class="w-full rounded-md border border-white/10 bg-white/5 p-2 text-white placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400" 
              />
              <input 
                type="number" 
                v-model="product.height" 
                placeholder="高度" 
                class="w-full rounded-md border border-white/10 bg-white/5 p-2 text-white placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400" 
              />
            </div>
          </div>

          <!-- 大张纸尺寸 -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm text-gray-400">大张纸尺寸 - mm</label>
              <button 
                @click="showPresets = !showPresets"
                class="text-xs text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
              >
                常用规格
              </button>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <input 
                type="number" 
                v-model="sheet.width" 
                placeholder="宽度" 
                class="w-full rounded-md border border-white/10 bg-white/5 p-2 text-white placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400" 
              />
              <input 
                type="number" 
                v-model="sheet.height" 
                placeholder="高度" 
                class="w-full rounded-md border border-white/10 bg-white/5 p-2 text-white placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400" 
              />
            </div>
          </div>

          <!-- 纸张规格预设 -->
          <div v-if="showPresets" class="mb-4 p-3 rounded-lg border border-white/10 bg-white/5">
            <p class="text-xs text-gray-400 mb-2">选择常用纸张规格：</p>
            <div class="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
              <button
                v-for="preset in paperPresets"
                :key="preset.name"
                @click="usePreset(preset)"
                class="text-xs px-2 py-1 rounded border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors"
              >
                {{ preset.name }}
              </button>
            </div>
          </div>

          <!-- 警告信息 -->
          <div v-if="warnings.length > 0" class="mb-4">
            <div v-for="warning in warnings" :key="warning" class="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded px-2 py-1 mb-1">
              ⚠️ {{ warning }}
            </div>
          </div>

          <div class="flex gap-2">
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
              v-if="isValidInput && layoutResult.best.total > 0"
              @click="copyResult"
              class="flex items-center gap-2 rounded-md bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-700 transition-colors"
            >
              <Copy class="w-4 h-4" />
              {{ copyStatus || '复制结果' }}
            </button>
          </div>
          
          <div v-if="!isValidInput" class="text-center py-12">
            <div class="text-gray-400 text-lg mb-2">请输入有效的尺寸信息</div>
            <p class="text-gray-500 text-sm">输入成品尺寸和大张纸尺寸后查看拼版结果</p>
          </div>
          
          <div v-else-if="layoutResult.best.total === 0" class="text-center py-12">
            <div class="text-red-400 text-lg mb-2">无法拼版</div>
            <p class="text-gray-400 text-sm">成品尺寸超过大张纸尺寸，请检查输入数据</p>
          </div>
          
          <div v-else class="space-y-6">
            <!-- 最佳结果展示 -->
            <div class="text-center">
              <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-500/20 border border-fuchsia-400/30">
                <span class="text-sm text-fuchsia-300">最佳拼版方案</span>
              </div>
              <div class="mt-4">
                <div class="text-5xl font-bold text-fuchsia-400 mb-2">{{ layoutResult.best.total }}</div>
                <div class="text-gray-300">
                  {{ layoutResult.best.cols }} × {{ layoutResult.best.rows }} 
                  ({{ layoutResult.best.orientation === 'normal' ? '正常摆放' : '旋转90°' }})
                </div>
              </div>
            </div>

            <!-- 详细对比 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- 正常摆放 -->
              <div class="rounded-lg border border-white/10 bg-white/5 p-4">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-semibold text-white">正常摆放</h3>
                  <span v-if="layoutResult.best.orientation === 'normal'" class="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                    推荐
                  </span>
                </div>
                <div class="text-2xl font-bold text-white mb-1">{{ layoutResult.normal.total }}</div>
                <div class="text-sm text-gray-400">{{ layoutResult.normal.cols }} × {{ layoutResult.normal.rows }}</div>
              </div>

              <!-- 旋转摆放 -->
              <div class="rounded-lg border border-white/10 bg-white/5 p-4">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-semibold text-white">旋转90°</h3>
                  <span v-if="layoutResult.best.orientation === 'rotated'" class="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                    推荐
                  </span>
                </div>
                <div class="text-2xl font-bold text-white mb-1">{{ layoutResult.rotated.total }}</div>
                <div class="text-sm text-gray-400">{{ layoutResult.rotated.cols }} × {{ layoutResult.rotated.rows }}</div>
              </div>
            </div>

            <!-- 利用率和统计 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="text-center">
                <div class="text-lg font-bold text-green-400">{{ utilization }}%</div>
                <div class="text-xs text-gray-400">纸张利用率</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-blue-400">{{ Math.round((parseFloat(sheet.width) || 0) * (parseFloat(sheet.height) || 0) / 100) / 10 || 0 }} cm²</div>
                <div class="text-xs text-gray-400">大张纸面积</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-purple-400">
                  {{ Math.round(((parseFloat(product.width) || 0) * (parseFloat(product.height) || 0) * layoutResult.best.total) / 100) / 10 || 0 }} cm²
                </div>
                <div class="text-xs text-gray-400">有效使用面积</div>
              </div>
            </div>

            <!-- 可视化拼版示意图 -->
            <div class="mt-6">
              <h3 class="text-sm font-semibold text-white mb-3">拼版示意图</h3>
              <div class="bg-white/5 rounded-lg p-4 flex items-center justify-center" style="min-height: 200px;">
                <div class="relative bg-white/10 border border-white/20 rounded" 
                     :style="{
                       width: Math.min(300, 300 * (parseFloat(sheet.width) || 1) / Math.max(parseFloat(sheet.width) || 1, parseFloat(sheet.height) || 1)) + 'px',
                       height: Math.min(200, 200 * (parseFloat(sheet.height) || 1) / Math.max(parseFloat(sheet.width) || 1, parseFloat(sheet.height) || 1)) + 'px'
                     }">
                  <div class="absolute inset-1 grid gap-0.5" 
                       :style="{
                         gridTemplateColumns: `repeat(${layoutResult.best.cols}, 1fr)`,
                         gridTemplateRows: `repeat(${layoutResult.best.rows}, 1fr)`
                       }">
                    <div v-for="i in layoutResult.best.total" 
                         :key="i" 
                         class="bg-fuchsia-400/30 border border-fuchsia-400/50 rounded-sm">
                    </div>
                  </div>
                  <div class="absolute -top-6 left-0 text-xs text-gray-400">{{ sheet.width }}mm</div>
                  <div class="absolute -left-12 top-0 text-xs text-gray-400 transform -rotate-90 origin-left">{{ sheet.height }}mm</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
