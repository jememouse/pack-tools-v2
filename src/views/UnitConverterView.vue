<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { Copy, RotateCcw, Info, Ruler, Scale, Thermometer, Calculator, History, Bookmark } from 'lucide-vue-next';
import LikeButton from '../components/LikeButton.vue';
import { initializeDefaultLikes } from '../services/likeService.js';

const activeTab = ref('length');
const showKnowledge = ref(false);
const showPresets = ref(false);
const copyStatus = ref('');
const history = ref([]);
const favorites = ref([]);

// 定义更完整的单位数据
const length = reactive({ mm: '', cm: '', m: '', inch: '', ft: '', mil: '', pt: '' });
const weight = reactive({ mg: '', g: '', kg: '', lb: '', oz: '', ton: '' });
const pressure = reactive({ pa: '', kpa: '', mpa: '', psi: '', bar: '', mmhg: '', atm: '' });
const grammage = reactive({ gsm: '', lbream500: '', lbream1000: '', ozyd2: '' });
const thickness = reactive({ um: '', mil: '', pt: '', mm: '', inch: '' });
const temperature = reactive({ celsius: '', fahrenheit: '', kelvin: '' });
const area = reactive({ mm2: '', cm2: '', m2: '', inch2: '', ft2: '', yd2: '' });

// 更精确的转换系数和单位信息
const unitCategories = {
  length: {
    name: '长度',
    icon: 'Ruler',
    data: length,
    units: {
      mm: { name: '毫米', symbol: 'mm', factor: 1, description: '最小单位，精密测量' },
      cm: { name: '厘米', symbol: 'cm', factor: 10, description: '常用单位，日常测量' },
      m: { name: '米', symbol: 'm', factor: 1000, description: '国际标准单位' },
      inch: { name: '英寸', symbol: 'in', factor: 25.4, description: '英制单位，1英寸=25.4毫米' },
      ft: { name: '英尺', symbol: 'ft', factor: 304.8, description: '1英尺=12英寸' },
      mil: { name: '密尔', symbol: 'mil', factor: 0.0254, description: '1密尔=0.001英寸=0.0254毫米' },
      pt: { name: '磅特', symbol: 'pt', factor: 0.352778, description: '1磅特=1/72英寸' },
    }
  },
  weight: {
    name: '重量',
    icon: 'Scale',
    data: weight,
    units: {
      mg: { name: '毫克', symbol: 'mg', factor: 1, description: '微量单位，精密测量' },
      g: { name: '克', symbol: 'g', factor: 1000, description: '常用重量单位' },
      kg: { name: '千克', symbol: 'kg', factor: 1000000, description: '国际标准重量单位' },
      lb: { name: '磅', symbol: 'lb', factor: 453592, description: '英制重量单位，1磅=453.592克' },
      oz: { name: '盎司', symbol: 'oz', factor: 28349.5, description: '1盎司=1/16磅' },
      ton: { name: '公吨', symbol: 't', factor: 1000000000, description: '1公吨=1000千克' },
    }
  },
  pressure: {
    name: '压力',
    icon: 'Calculator',
    data: pressure,
    units: {
      pa: { name: '帕斯卡', symbol: 'Pa', factor: 1, description: '国际标准压力单位' },
      kpa: { name: '千帕', symbol: 'kPa', factor: 1000, description: '1千帕=1000帕斯卡' },
      mpa: { name: '兆帕', symbol: 'MPa', factor: 1000000, description: '1兆帕=1000000帕斯卡' },
      psi: { name: 'PSI', symbol: 'psi', factor: 6894.757, description: '磅/平方英寸，英制压力单位' },
      bar: { name: '巴', symbol: 'bar', factor: 100000, description: '1巴=100000帕斯卡' },
      mmhg: { name: '水银柱', symbol: 'mmHg', factor: 133.322, description: '水银柱毫米，传统压力单位' },
      atm: { name: '标准大气压', symbol: 'atm', factor: 101325, description: '标准大气压' },
    }
  },
  grammage: {
    name: '克重',
    icon: 'Scale',
    data: grammage,
    units: {
      gsm: { name: '克/平米', symbol: 'g/m²', factor: 1, description: '纸张克重标准单位' },
      lbream500: { name: '磅/500令', symbol: 'lb/ream', factor: 1.48, description: '500张令的重量(磅)' },
      lbream1000: { name: '磅/1000令', symbol: 'lb/1000', factor: 2.96, description: '1000张令的重量(磅)' },
      ozyd2: { name: '盎司/平方码', symbol: 'oz/yd²', factor: 33.906, description: '盎司每平方码' },
    }
  },
  thickness: {
    name: '厚度',
    icon: 'Ruler',
    data: thickness,
    units: {
      um: { name: '微米', symbol: 'μm', factor: 1, description: '微米，精密厚度测量' },
      mil: { name: '密尔', symbol: 'mil', factor: 25.4, description: '1密尔=0.001英寸=25.4微米' },
      pt: { name: '点', symbol: 'pt', factor: 352.778, description: '印刷行业厚度单位' },
      mm: { name: '毫米', symbol: 'mm', factor: 1000, description: '公制厚度单位' },
      inch: { name: '英寸', symbol: 'in', factor: 25400, description: '英制厚度单位' },
    }
  },
  temperature: {
    name: '温度',
    icon: 'Thermometer',
    data: temperature,
    isSpecial: true,
    units: {
      celsius: { name: '摄氏度', symbol: '°C', description: '摄氏温度，国际通用' },
      fahrenheit: { name: '华氏度', symbol: '°F', description: '华氏温度，美制单位' },
      kelvin: { name: '开尔文', symbol: 'K', description: '绝对温度，科学单位' },
    }
  },
  area: {
    name: '面积',
    icon: 'Calculator',
    data: area,
    units: {
      mm2: { name: '平方毫米', symbol: 'mm²', factor: 1, description: '最小面积单位' },
      cm2: { name: '平方厘米', symbol: 'cm²', factor: 100, description: '常用面积单位' },
      m2: { name: '平方米', symbol: 'm²', factor: 1000000, description: '国际标准面积单位' },
      inch2: { name: '平方英寸', symbol: 'in²', factor: 645.16, description: '英制面积单位' },
      ft2: { name: '平方英尺', symbol: 'ft²', factor: 92903.04, description: '1平方英尺=144平方英寸' },
      yd2: { name: '平方码', symbol: 'yd²', factor: 836127.36, description: '1平方码=9平方英尺' },
    }
  }
};

// 常用数值预设
const commonPresets = {
  length: [
    { name: 'A4纸宽', value: 210, unit: 'mm' },
    { name: 'A4纸长', value: 297, unit: 'mm' },
    { name: '名片宽', value: 90, unit: 'mm' },
    { name: '名片长', value: 54, unit: 'mm' },
    { name: '标准信封', value: 220, unit: 'mm' },
  ],
  thickness: [
    { name: '普通纸张', value: 0.1, unit: 'mm' },
    { name: '卡纸', value: 0.3, unit: 'mm' },
    { name: '瓦楞纸', value: 5, unit: 'mm' },
    { name: '塑料袋', value: 50, unit: 'um' },
  ],
  grammage: [
    { name: '普通复印纸', value: 80, unit: 'gsm' },
    { name: '铜版纸', value: 250, unit: 'gsm' },
    { name: '卡纸', value: 400, unit: 'gsm' },
    { name: '纸板', value: 800, unit: 'gsm' },
  ],
};

// 当前活跃的单位类型
const currentCategory = computed(() => unitCategories[activeTab.value]);

// 转换函数
function convert(unitType, changedUnit) {
  const category = unitCategories[unitType];
  const data = category.data;
  const inputValue = parseFloat(data[changedUnit]);
  
  if (isNaN(inputValue) || inputValue === '') {
    Object.keys(data).forEach(key => {
      if (key !== changedUnit) data[key] = '';
    });
    return;
  }
  
  // 温度特殊处理
  if (unitType === 'temperature') {
    convertTemperature(changedUnit, inputValue);
    return;
  }
  
  // 普通单位转换
  const units = category.units;
  const baseValue = inputValue * units[changedUnit].factor;
  
  for (const unit in data) {
    if (unit !== changedUnit) {
      const convertedValue = baseValue / units[unit].factor;
      data[unit] = formatNumber(convertedValue);
    }
  }
  
  // 添加到历史记录
  addToHistory(unitType, changedUnit, inputValue, data[changedUnit]);
}

// 温度转换
function convertTemperature(fromUnit, value) {
  const data = temperature;
  let celsius;
  
  // 先转换为摄氏度
  switch (fromUnit) {
    case 'celsius':
      celsius = value;
      break;
    case 'fahrenheit':
      celsius = (value - 32) * 5 / 9;
      break;
    case 'kelvin':
      celsius = value - 273.15;
      break;
  }
  
  // 然后转换为其他单位
  if (fromUnit !== 'celsius') data.celsius = formatNumber(celsius);
  if (fromUnit !== 'fahrenheit') data.fahrenheit = formatNumber(celsius * 9 / 5 + 32);
  if (fromUnit !== 'kelvin') data.kelvin = formatNumber(celsius + 273.15);
}

// 数值格式化
function formatNumber(num) {
  if (Math.abs(num) >= 1000) {
    return num.toFixed(2);
  } else if (Math.abs(num) >= 1) {
    return num.toFixed(4);
  } else {
    return num.toFixed(6);
  }
}

// 添加历史记录
function addToHistory(type, unit, value, formatted) {
  const record = {
    type,
    unit,
    value,
    formatted,
    timestamp: new Date().toLocaleTimeString()
  };
  history.value.unshift(record);
  if (history.value.length > 10) {
    history.value.pop();
  }
}

// 重置函数
function reset(unitType) {
  const data = unitCategories[unitType].data;
  Object.keys(data).forEach(key => data[key] = '');
}

// 使用预设值
function usePreset(preset) {
  const data = unitCategories[activeTab.value].data;
  data[preset.unit] = preset.value;
  convert(activeTab.value, preset.unit);
  showPresets.value = false;
}

// 复制功能
async function copyValue(value, unit) {
  const unitInfo = currentCategory.value.units[unit];
  const text = `${value} ${unitInfo.symbol}`;
  
  try {
    await navigator.clipboard.writeText(text);
    copyStatus.value = '复制成功!';
    setTimeout(() => copyStatus.value = '', 2000);
  } catch (err) {
    copyStatus.value = '复制失败';
    setTimeout(() => copyStatus.value = '', 2000);
  }
}

// 添加到收藏
function addToFavorites(unitType, unit, value) {
  const favorite = {
    type: unitType,
    unit,
    value,
    name: `${value} ${unitCategories[unitType].units[unit].symbol}`,
    timestamp: new Date().toISOString()
  };
  favorites.value.unshift(favorite);
  if (favorites.value.length > 20) {
    favorites.value.pop();
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
            包装行业单位换算器
            <button 
              @click="showKnowledge = !showKnowledge"
              class="text-gray-400 hover:text-fuchsia-400 transition-colors"
              title="了解单位换算知识"
            >
              <Info class="w-6 h-6" />
            </button>
          </h1>
          <p class="mt-2 text-gray-300">支持长度、重量、压力、克重、厚度、温度、面积等包装行业常用单位的实时换算。</p>
        </div>
        <div class="flex items-center gap-4">
          <!-- 点赞组件 -->
          <LikeButton 
            item-id="unit-converter"
            :initial-count="95"
            @like-changed="handleLikeChanged"
          />
        </div>
      </div>
    </div>

    <!-- 知识卡片 -->
    <div v-if="showKnowledge" class="mb-6 rounded-xl border border-blue-400/20 bg-blue-500/10 p-4 backdrop-blur-lg">
      <h3 class="text-lg font-semibold text-blue-400 mb-2">单位换算小贴士</h3>
      <div class="text-gray-300 text-sm leading-relaxed space-y-2">
        <p>• <strong>长度：</strong>毫米(mm)是最小单位，1英寸=25.4毫米，1密尔=0.001英寸</p>
        <p>• <strong>厚度：</strong>微米(μm)用于精密测量，1密尔=25.4微米，印刷常用点(pt)</p>
        <p>• <strong>克重：</strong>g/m²是纸张标准单位，磅/令是传统美制单位</p>
        <p>• <strong>压力：</strong>帕斯卡(Pa)是国际标准，PSI是英制单位，1PSI≈6895Pa</p>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <!-- 左侧：类型选择和预设 -->
      <div class="xl:col-span-1">
        <div class="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg">
          <!-- 单位类型选择 -->
          <h3 class="text-lg font-semibold text-white mb-4">单位类型</h3>
          <div class="space-y-2 mb-6">
            <button 
              v-for="(category, key) in unitCategories" 
              :key="key"
              @click="activeTab = key"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                activeTab === key 
                  ? 'bg-fuchsia-600 text-white' 
                  : 'text-gray-300 hover:bg-white/10'
              ]"
            >
              <component :is="category.icon" class="w-4 h-4" />
              {{ category.name }}
            </button>
          </div>

          <!-- 常用预设 -->
          <div v-if="commonPresets[activeTab]">
            <button @click="showPresets = !showPresets" class="text-sm text-fuchsia-400 hover:text-fuchsia-300 mb-2">
              常用数值 {{ showPresets ? '▲' : '▼' }}
            </button>
            <div v-if="showPresets" class="space-y-1">
              <button
                v-for="preset in commonPresets[activeTab]"
                :key="preset.name"
                @click="usePreset(preset)"
                class="w-full text-left px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-white/10 rounded"
              >
                {{ preset.name }}: {{ preset.value }} {{ currentCategory.units[preset.unit].symbol }}
              </button>
            </div>
          </div>
        </div>

        <!-- 历史记录 -->
        <div v-if="history.length > 0" class="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg">
          <h3 class="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <History class="w-4 h-4" />
            转换历史
          </h3>
          <div class="space-y-2 max-h-40 overflow-y-auto">
            <div v-for="record in history.slice(0, 5)" :key="record.timestamp" class="text-xs text-gray-400">
              <div class="flex justify-between">
                <span>{{ record.value }} {{ unitCategories[record.type].units[record.unit].symbol }}</span>
                <span>{{ record.timestamp }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：转换器主区域 -->
      <div class="xl:col-span-3">
        <div class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-white flex items-center gap-2">
              <component :is="currentCategory.icon" class="w-5 h-5" />
              {{ currentCategory.name }}转换
            </h2>
            <div class="flex gap-2">
              <button 
                @click="reset(activeTab)" 
                class="flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20 transition-colors"
              >
                <RotateCcw class="w-4 h-4" />
                重置
              </button>
            </div>
          </div>

          <!-- 单位输入区域 -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="(value, unit) in currentCategory.data" 
              :key="unit" 
              class="relative group"
            >
              <div class="flex items-center justify-between mb-2">
                <label :for="unit" class="text-sm font-medium text-gray-300">
                  {{ currentCategory.units[unit].name }}
                  <span class="text-fuchsia-400 ml-1">({{ currentCategory.units[unit].symbol }})</span>
                </label>
                <div class="flex gap-1">
                  <button 
                    v-if="value && value !== ''"
                    @click="copyValue(value, unit)"
                    class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-fuchsia-400 transition-all"
                    :title="copyStatus || '复制'"
                  >
                    <Copy class="w-3 h-3" />
                  </button>
                  <button 
                    v-if="value && value !== ''"
                    @click="addToFavorites(activeTab, unit, value)"
                    class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-yellow-400 transition-all"
                    title="添加到收藏"
                  >
                    <Bookmark class="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              <input 
                :id="unit"
                type="number"
                step="any"
                v-model="currentCategory.data[unit]"
                @input="convert(activeTab, unit)"
                :placeholder="`输入${currentCategory.units[unit].name}`"
                class="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400 transition-colors"
              />
              
              <p class="text-xs text-gray-500 mt-1 min-h-[1rem]">
                {{ currentCategory.units[unit].description }}
              </p>
            </div>
          </div>

          <!-- 转换说明 -->
          <div class="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
            <h4 class="text-sm font-semibold text-white mb-2">使用说明</h4>
            <div class="text-xs text-gray-400 leading-relaxed">
              <p>• 在任意输入框中输入数值，其他单位会自动实时转换</p>
              <p>• 点击复制按钮可复制带单位的完整数值</p>
              <p>• 使用常用预设可快速输入标准数值</p>
              <p>• 转换历史会自动保存最近的操作记录</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
