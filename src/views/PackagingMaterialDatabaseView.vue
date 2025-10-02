<script setup>
import { ref, computed } from 'vue';
import { Search, Filter, Info, Book, Package, Layers, Leaf, DollarSign, Zap, Shield, Thermometer, Droplets, Star, Eye, Copy, ExternalLink } from 'lucide-vue-next';

const searchQuery = ref('');
const selectedCategory = ref('all');
const selectedCostLevel = ref('all');
const selectedApplication = ref('all');
const showKnowledge = ref(false);
const copyStatus = ref('');

// 包装材料数据库
const materials = ref([
  // 纸质材料
  {
    id: 'whiteboard',
    name: '白卡纸',
    englishName: 'White Board',
    category: 'paper',
    subCategory: '纸板',
    costLevel: 'medium',
    density: '250-400gsm',
    thickness: '0.3-0.5mm',
    characteristics: ['表面光滑', '印刷适性好', '挺度高', '易折叠'],
    applications: ['化妆品包装', '药品包装', '食品包装盒', '礼品盒'],
    advantages: ['印刷效果佳', '加工性能好', '环保可回收', '成本适中'],
    disadvantages: ['防水性一般', '承重有限'],
    sustainability: 'high',
    printability: 'excellent',
    durability: 'medium',
    moistureResistance: 'low',
    temperature: '-10°C ~ 60°C',
    suppliers: ['UPM', 'International Paper', 'Stora Enso'],
    applications_detail: {
      cosmetics: '高端化妆品外包装盒',
      pharma: '药品说明书、包装盒',
      food: '巧克力盒、糖果盒',
      gift: '礼品包装盒、购物袋'
    }
  },
  {
    id: 'kraft_paper',
    name: '牛皮纸',
    englishName: 'Kraft Paper',
    category: 'paper',
    subCategory: '纸张',
    costLevel: 'low',
    density: '80-250gsm',
    thickness: '0.1-0.3mm',
    characteristics: ['韧性强', '撕裂强度高', '天然色泽', '环保'],
    applications: ['快递包装', '食品袋', '购物袋', '工业包装'],
    advantages: ['成本低廉', '环保可降解', '强度高', '印刷成本低'],
    disadvantages: ['颜色单一', '防水性差', '外观档次一般'],
    sustainability: 'excellent',
    printability: 'good',
    durability: 'high',
    moistureResistance: 'low',
    temperature: '-20°C ~ 80°C',
    suppliers: ['九龙纸业', 'International Paper', '玖龙纸业'],
    applications_detail: {
      shipping: '快递袋、包装纸',
      food: '面包袋、咖啡袋',
      retail: '环保购物袋',
      industrial: '工业零件包装'
    }
  },
  {
    id: 'corrugated',
    name: '瓦楞纸板',
    englishName: 'Corrugated Board',
    category: 'paper',
    subCategory: '瓦楞纸板',
    costLevel: 'low',
    density: '120-180g/m²',
    thickness: '1.5-7.0mm',
    characteristics: ['轻质高强', '缓冲保护好', '成型容易', '环保可回收', '成本低廉'],
    applications: ['运输纸箱', '电商包装', '展示用品', '缓冲垫片'],
    advantages: ['优异的缓冲性能', '轻量化设计', '成本极低', '100%可回收', '易于印刷和加工'],
    disadvantages: ['防水性差', '湿强度低', '外观档次一般', '不适合长期储存'],
    sustainability: 'excellent',
    printability: 'good',
    durability: 'medium',
    moistureResistance: 'very_low',
    temperature: '-10°C ~ 50°C',
    suppliers: ['合兴包装', '裕同科技', '奥瑞金', '山鹰纸业'],
    applications_detail: {
      shipping: '快递纸箱、物流包装箱',
      ecommerce: '电商包装盒、内包装',
      display: '临时展示架、POP展具',
      protection: '产品缓冲垫、间隔材料'
    },
    // 瓦楞纸专有属性
    corrugatedTypes: [
      {
        type: 'A楞',
        englishType: 'A-Flute',
        thickness: '4.5-5.0mm',
        pitchCount: '108-125个/米',
        characteristics: ['最高缓冲性能', '抗戳穿能力强', '适合易碎品'],
        applications: ['易碎品包装', '高档包装盒', '精密仪器包装'],
        edgeCrushStrength: '≥4.0 kN/m',
        burstStrength: '≥300 kPa'
      },
      {
        type: 'B楞',
        englishType: 'B-Flute',
        thickness: '2.5-3.0mm',
        pitchCount: '154-185个/米',
        characteristics: ['印刷适性好', '表面平整', '抗压强度高'],
        applications: ['彩盒包装', '书本包装', '小商品包装'],
        edgeCrushStrength: '≥5.5 kN/m',
        burstStrength: '≥400 kPa'
      },
      {
        type: 'C楞',
        englishType: 'C-Flute',
        thickness: '3.5-4.0mm',
        pitchCount: '128-151个/米',
        characteristics: ['综合性能好', '性价比高', '应用最广'],
        applications: ['普通纸箱', '快递包装', '食品包装'],
        edgeCrushStrength: '≥4.5 kN/m',
        burstStrength: '≥350 kPa'
      },
      {
        type: 'E楞',
        englishType: 'E-Flute',
        thickness: '1.1-1.8mm',
        pitchCount: '295-318个/米',
        characteristics: ['超薄设计', '印刷精美', '表面光滑'],
        applications: ['精品包装', '彩色印刷盒', '礼品包装'],
        edgeCrushStrength: '≥2.5 kN/m',
        burstStrength: '≥200 kPa'
      },
      {
        type: 'F楞',
        englishType: 'F-Flute',
        thickness: '0.6-0.9mm',
        pitchCount: '420-470个/米',
        characteristics: ['超薄微楞', '高精度印刷', '可替代折叠盒'],
        applications: ['高端彩盒', '化妆品包装', '小食品包装'],
        edgeCrushStrength: '≥1.8 kN/m',
        burstStrength: '≥150 kPa'
      }
    ],
    technicalSpecs: {
      gradeStandards: ['GB/T 6543-2008', 'FEFCO标准', 'TAPPI标准'],
      testMethods: {
        edgeCrush: 'GB/T 6546-2019',
        burstStrength: 'GB/T 1539-2019',
        punctureStrength: 'GB/T 2679.7-2015',
        compressionStrength: 'GB/T 4857.4-2008'
      },
      qualityGrades: {
        A: '优等品 - 高强度应用',
        B: '一等品 - 标准应用',
        C: '合格品 - 一般应用'
      }
    }
  },

  // 塑料材料
  {
    id: 'pet',
    name: 'PET塑料',
    englishName: 'Polyethylene Terephthalate',
    category: 'plastic',
    subCategory: '聚酯',
    costLevel: 'medium',
    density: '1.38g/cm³',
    thickness: '0.012-0.5mm',
    characteristics: ['透明度高', '耐化学腐蚀', '强度高', '阻隔性好'],
    applications: ['饮料瓶', '食品容器', '化妆品瓶', '药品包装'],
    advantages: ['透明美观', '耐高温', '阻隔性好', '可回收'],
    disadvantages: ['成本较高', '加工温度高'],
    sustainability: 'medium',
    printability: 'good',
    durability: 'high',
    moistureResistance: 'high',
    temperature: '-40°C ~ 70°C',
    suppliers: ['中石化', '恒力石化', '逸盛石化'],
    applications_detail: {
      beverage: '碳酸饮料瓶、矿泉水瓶',
      food: '果汁瓶、调料瓶',
      cosmetics: '洗发水瓶、护肤品瓶',
      pharma: '药品包装瓶'
    }
  },
  {
    id: 'bopp',
    name: 'BOPP薄膜',
    englishName: 'Biaxially Oriented Polypropylene',
    category: 'plastic',
    subCategory: '薄膜',
    costLevel: 'medium',
    density: '0.91g/cm³',
    thickness: '0.015-0.050mm',
    characteristics: ['高透明', '耐撕裂', '热封性好', '印刷适性佳'],
    applications: ['食品包装', '胶带基材', '标签', '香烟包装'],
    advantages: ['透明度优异', '印刷效果好', '成本适中', '加工性能好'],
    disadvantages: ['耐温范围有限', '阻氧性一般'],
    sustainability: 'low',
    printability: 'excellent',
    durability: 'medium',
    moistureResistance: 'high',
    temperature: '-20°C ~ 120°C',
    suppliers: ['金发科技', '中石化', '齐鲁石化'],
    applications_detail: {
      food: '零食包装袋、糖果包装',
      tape: '透明胶带基材',
      label: '不干胶标签',
      tobacco: '香烟包装薄膜'
    }
  },
  {
    id: 'pe',
    name: 'PE塑料',
    englishName: 'Polyethylene',
    category: 'plastic',
    subCategory: '聚烯烃',
    costLevel: 'low',
    density: '0.91-0.96g/cm³',
    thickness: '0.02-2.0mm',
    characteristics: ['柔韧性好', '耐低温', '化学稳定性好', '成本低'],
    applications: ['塑料袋', '保鲜膜', '垃圾袋', '农膜'],
    advantages: ['成本最低', '柔韧性佳', '耐低温', '无毒'],
    disadvantages: ['耐温性差', '阻隔性一般', '印刷困难'],
    sustainability: 'low',
    printability: 'poor',
    durability: 'medium',
    moistureResistance: 'high',
    temperature: '-60°C ~ 80°C',
    suppliers: ['中石化', '中石油', '万华化学'],
    applications_detail: {
      bags: '购物袋、垃圾袋',
      wrap: '保鲜膜、包装膜',
      agriculture: '农用薄膜',
      industrial: '工业包装袋'
    }
  },

  // 复合材料
  {
    id: 'aluminum_foil',
    name: '铝箔复合材料',
    englishName: 'Aluminum Foil Composite',
    category: 'composite',
    subCategory: '金属复合',
    costLevel: 'high',
    density: '复合结构',
    thickness: '0.02-0.2mm',
    characteristics: ['阻隔性极佳', '耐高温', '美观度高', '保香性好'],
    applications: ['咖啡包装', '药品包装', '化妆品软管', '食品袋'],
    advantages: ['阻隔性最佳', '保质期长', '外观高档', '耐高温'],
    disadvantages: ['成本高', '不透明', '回收困难'],
    sustainability: 'low',
    printability: 'excellent',
    durability: 'high',
    moistureResistance: 'excellent',
    temperature: '-40°C ~ 150°C',
    suppliers: ['奥瑞金', '中粮包装', '紫江企业'],
    applications_detail: {
      coffee: '咖啡豆包装袋',
      pharma: '药品铝塑包装',
      cosmetics: '软管包装',
      food: '方便面调料包'
    }
  },
  {
    id: 'paper_plastic',
    name: '纸塑复合',
    englishName: 'Paper-Plastic Composite',
    category: 'composite',
    subCategory: '纸塑复合',
    costLevel: 'medium',
    density: '复合结构',
    thickness: '0.1-0.8mm',
    characteristics: ['防水防油', '可热封', '印刷效果好', '环保性中等'],
    applications: ['牛奶盒', '果汁包装', '外卖餐盒', '冷冻食品包装'],
    advantages: ['防水性好', '印刷美观', '成型性好', '成本适中'],
    disadvantages: ['回收困难', '分离处理复杂'],
    sustainability: 'medium',
    printability: 'excellent',
    durability: 'high',
    moistureResistance: 'high',
    temperature: '-20°C ~ 100°C',
    suppliers: ['利乐包装', '康美包', '纷美包装'],
    applications_detail: {
      dairy: '牛奶盒、酸奶杯',
      juice: '果汁包装盒',
      takeaway: '外卖打包盒',
      frozen: '冷冻食品包装'
    }
  },

  // 生物基材料
  {
    id: 'pla',
    name: 'PLA生物塑料',
    englishName: 'Polylactic Acid',
    category: 'biodegradable',
    subCategory: '生物基塑料',
    costLevel: 'high',
    density: '1.24g/cm³',
    thickness: '0.02-3.0mm',
    characteristics: ['可完全降解', '来源可再生', '透明性好', '加工性能佳'],
    applications: ['一次性餐具', '3D打印', '生物医用', '环保包装'],
    advantages: ['100%生物降解', '来源可再生', '无毒安全', '外观良好'],
    disadvantages: ['成本高', '耐温性差', '强度有限'],
    sustainability: 'excellent',
    printability: 'good',
    durability: 'low',
    moistureResistance: 'medium',
    temperature: '0°C ~ 60°C',
    suppliers: ['海正生材', '丰原生化', 'NatureWorks'],
    applications_detail: {
      tableware: '一次性杯具、餐具',
      printing: '3D打印耗材',
      medical: '生物医用材料',
      packaging: '环保包装袋'
    }
  }
]);

// 分类选项
const categories = [
  { value: 'all', label: '全部材料' },
  { value: 'paper', label: '纸质材料' },
  { value: 'plastic', label: '塑料材料' },
  { value: 'composite', label: '复合材料' },
  { value: 'biodegradable', label: '生物降解材料' }
];

const costLevels = [
  { value: 'all', label: '全部成本' },
  { value: 'low', label: '低成本' },
  { value: 'medium', label: '中等成本' },
  { value: 'high', label: '高成本' }
];

const applications = [
  { value: 'all', label: '全部应用' },
  { value: 'food', label: '食品包装' },
  { value: 'cosmetics', label: '化妆品包装' },
  { value: 'pharma', label: '医药包装' },
  { value: 'shipping', label: '物流包装' },
  { value: 'retail', label: '零售包装' }
];

// 筛选后的材料列表
const filteredMaterials = computed(() => {
  return materials.value.filter(material => {
    const matchesSearch = searchQuery.value === '' || 
      material.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      material.englishName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      material.characteristics.some(char => char.includes(searchQuery.value)) ||
      material.applications.some(app => app.includes(searchQuery.value));
    
    const matchesCategory = selectedCategory.value === 'all' || material.category === selectedCategory.value;
    const matchesCost = selectedCostLevel.value === 'all' || material.costLevel === selectedCostLevel.value;
    
    const matchesApplication = selectedApplication.value === 'all' || 
      material.applications.some(app => app.includes(getApplicationKeyword(selectedApplication.value)));
    
    return matchesSearch && matchesCategory && matchesCost && matchesApplication;
  });
});

// 获取应用关键词
function getApplicationKeyword(appValue) {
  const keywords = {
    food: '食品',
    cosmetics: '化妆品',
    pharma: '药品',
    shipping: '快递',
    retail: '购物'
  };
  return keywords[appValue] || '';
}

// 重置筛选条件
function resetFilters() {
  searchQuery.value = '';
  selectedCategory.value = 'all';
  selectedCostLevel.value = 'all';
  selectedApplication.value = 'all';
}

// 获取成本级别显示
function getCostLevelDisplay(level) {
  const levels = {
    low: { text: '低成本', color: 'text-green-400', bg: 'bg-green-500/10' },
    medium: { text: '中等成本', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    high: { text: '高成本', color: 'text-red-400', bg: 'bg-red-500/10' }
  };
  return levels[level] || levels.medium;
}

// 获取可持续性显示
function getSustainabilityDisplay(level) {
  const levels = {
    excellent: { text: '优秀', color: 'text-green-400', icon: '🌿' },
    high: { text: '良好', color: 'text-lime-400', icon: '🌱' },
    medium: { text: '一般', color: 'text-yellow-400', icon: '⚠️' },
    low: { text: '较差', color: 'text-orange-400', icon: '⚡' },
    very_low: { text: '很差', color: 'text-red-400', icon: '⛔' }
  };
  return levels[level] || levels.medium;
}

// 获取性能评级显示
function getPerformanceDisplay(level) {
  const levels = {
    excellent: { text: '优秀', stars: 5 },
    good: { text: '良好', stars: 4 },
    fair: { text: '一般', stars: 3 },
    poor: { text: '较差', stars: 2 },
    very_low: { text: '很差', stars: 1 }
  };
  return levels[level] || levels.fair;
}

// 获取测试方法中文名称
function getTestMethodName(key) {
  const methodNames = {
    edgeCrush: '边压强度',
    burstStrength: '破裂强度',
    punctureStrength: '戳穿强度',
    compressionStrength: '抗压强度'
  };
  return methodNames[key] || key;
}

// 复制材料信息
async function copyMaterialInfo(material) {
  let info = `${material.name} (${material.englishName})
类别：${material.subCategory}
特性：${material.characteristics.join(', ')}
应用：${material.applications.join(', ')}
成本级别：${getCostLevelDisplay(material.costLevel).text}`;
  
  // 如果是瓦楞纸，添加楞型信息
  if (material.corrugatedTypes) {
    info += `\n\n瓦楞类型：`;
    material.corrugatedTypes.forEach(type => {
      info += `\n- ${type.type} (${type.thickness}): ${type.characteristics.join(', ')}`;
    });
  }

  try {
    await navigator.clipboard.writeText(info);
    copyStatus.value = '材料信息已复制!';
    setTimeout(() => copyStatus.value = '', 3000);
  } catch (err) {
    copyStatus.value = '复制失败';
    setTimeout(() => copyStatus.value = '', 3000);
  }
}

// 材料知识库
const knowledgeItems = [
  {
    title: '如何选择合适的包装材料',
    content: '考虑产品特性、成本预算、环保要求、运输条件等因素',
    icon: '📦'
  },
  {
    title: '瓦楞纸楞型选择指南',
    content: 'A楞适合易碎品（缓冲性最好）；B楞适合彩盒（印刷效果好）；C楞性价比最高（普通纸箱）；E楞超薄精美（高端包装）',
    icon: '📏'
  },
  {
    title: '瓦楞纸板强度指标解读',
    content: '边压强度决定竖放承重能力；破裂强度反映材料韧性；戳穿强度表示抗冲击性能；抗压强度影响叠放高度',
    icon: '🔍'
  },
  {
    title: '包装材料的阻隔性能',
    content: '氧气阻隔、水蒸气阻隔、光阻隔等对产品保质期的影响',
    icon: '🛡️'
  },
  {
    title: '可持续包装趋势',
    content: '生物降解材料、减量化包装、循环利用等绿色包装发展方向',
    icon: '🌱'
  },
  {
    title: '瓦楞纸箱设计要点',
    content: '根据产品重量选择纸质；按照尺寸优化结构；考虑运输环境影响；合理设计摔边和手握孔',
    icon: '📝'
  }
];
</script>

<template>
  <div class="text-white">
    <!-- 标题区域 -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-white flex items-center gap-3">
            包装材料数据库 (Mini)
            <button 
              @click="showKnowledge = !showKnowledge"
              class="text-gray-400 hover:text-fuchsia-400 transition-colors"
              title="了解材料选择知识"
            >
              <Info class="w-6 h-6" />
            </button>
          </h1>
          <p class="mt-2 text-gray-300">
            快速查询核心包装材料的特性、用途和成本级别，为包装设计和材料选择提供参考。
          </p>
          <div class="mt-2 text-sm text-gray-400">
            共收录 {{ materials.length }} 种常用包装材料，筛选后显示 {{ filteredMaterials.length }} 种
          </div>
        </div>
      </div>
    </div>

    <!-- 知识卡片 -->
    <div v-if="showKnowledge" class="mb-6 rounded-xl border border-blue-400/20 bg-blue-500/10 p-6 backdrop-blur-lg">
      <h3 class="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
        <Book class="w-5 h-5" />
        包装材料知识库
      </h3>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="item in knowledgeItems" :key="item.title" class="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-blue-400/30 transition-colors">
          <div class="flex items-start gap-3 mb-2">
            <span class="text-2xl">{{ item.icon }}</span>
            <h4 class="font-semibold text-white text-sm leading-tight">{{ item.title }}</h4>
          </div>
          <p class="text-gray-300 text-xs leading-relaxed pl-11">{{ item.content }}</p>
        </div>
      </div>
      
      <!-- 瓦楞纸特别说明 -->
      <div class="mt-6 p-4 rounded-lg bg-purple-500/10 border border-purple-400/20">
        <h4 class="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
          <Layers class="w-4 h-4" />
          瓦楞纸快速参考
        </h4>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div class="text-center p-2 bg-white/5 rounded border border-white/10">
            <div class="font-semibold text-purple-300">A楞</div>
            <div class="text-gray-400 mt-1">4.5-5.0mm</div>
            <div class="text-gray-300 mt-1">最高缓冲</div>
          </div>
          <div class="text-center p-2 bg-white/5 rounded border border-white/10">
            <div class="font-semibold text-blue-300">B楞</div>
            <div class="text-gray-400 mt-1">2.5-3.0mm</div>
            <div class="text-gray-300 mt-1">印刷适性好</div>
          </div>
          <div class="text-center p-2 bg-white/5 rounded border border-white/10">
            <div class="font-semibold text-green-300">C楞</div>
            <div class="text-gray-400 mt-1">3.5-4.0mm</div>
            <div class="text-gray-300 mt-1">性价比高</div>
          </div>
          <div class="text-center p-2 bg-white/5 rounded border border-white/10">
            <div class="font-semibold text-yellow-300">E楞</div>
            <div class="text-gray-400 mt-1">1.1-1.8mm</div>
            <div class="text-gray-300 mt-1">超薄精美</div>
          </div>
          <div class="text-center p-2 bg-white/5 rounded border border-white/10">
            <div class="font-semibold text-orange-300">F楞</div>
            <div class="text-gray-400 mt-1">0.6-0.9mm</div>
            <div class="text-gray-300 mt-1">超薄微楞</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <!-- 左侧：筛选面板 -->
      <div class="xl:col-span-1">
        <div class="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg sticky top-6">
          <!-- 搜索 -->
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-2">
              <Search class="w-4 h-4 text-gray-400" />
              <label class="text-sm font-medium text-white">搜索材料</label>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="输入材料名称或特性..."
              class="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400 transition-colors"
            />
          </div>

          <!-- 分类筛选 -->
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-2">
              <Filter class="w-4 h-4 text-gray-400" />
              <label class="text-sm font-medium text-white">材料分类</label>
            </div>
            <select
              v-model="selectedCategory"
              class="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400"
            >
              <option v-for="category in categories" :key="category.value" :value="category.value" class="bg-gray-800">
                {{ category.label }}
              </option>
            </select>
          </div>

          <!-- 成本筛选 -->
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-2">
              <DollarSign class="w-4 h-4 text-gray-400" />
              <label class="text-sm font-medium text-white">成本级别</label>
            </div>
            <select
              v-model="selectedCostLevel"
              class="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400"
            >
              <option v-for="level in costLevels" :key="level.value" :value="level.value" class="bg-gray-800">
                {{ level.label }}
              </option>
            </select>
          </div>

          <!-- 应用筛选 -->
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-2">
              <Package class="w-4 h-4 text-gray-400" />
              <label class="text-sm font-medium text-white">应用领域</label>
            </div>
            <select
              v-model="selectedApplication"
              class="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400"
            >
              <option v-for="app in applications" :key="app.value" :value="app.value" class="bg-gray-800">
                {{ app.label }}
              </option>
            </select>
          </div>

          <!-- 重置按钮 -->
          <button
            @click="resetFilters"
            class="w-full rounded-md bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors"
          >
            重置筛选条件
          </button>
        </div>
      </div>

      <!-- 右侧：材料列表 -->
      <div class="xl:col-span-3">
        <div v-if="filteredMaterials.length === 0" class="text-center py-12">
          <Package class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-300 mb-2">未找到匹配的材料</h3>
          <p class="text-gray-400 mb-4">试试调整搜索条件或重置筛选器</p>
          <button 
            @click="resetFilters"
            class="text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
          >
            重置筛选条件
          </button>
        </div>

        <div v-else class="grid gap-6">
          <div 
            v-for="material in filteredMaterials" 
            :key="material.id"
            class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg hover:border-white/20 transition-all"
          >
            <!-- 材料基本信息 -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-xl font-semibold text-white">{{ material.name }}</h3>
                  <span class="text-sm text-gray-400">{{ material.englishName }}</span>
                </div>
                <div class="flex items-center gap-4 text-sm text-gray-300">
                  <span class="px-2 py-1 rounded bg-white/10">{{ material.subCategory }}</span>
                  <span :class="['px-2 py-1 rounded', getCostLevelDisplay(material.costLevel).bg, getCostLevelDisplay(material.costLevel).color]">
                    {{ getCostLevelDisplay(material.costLevel).text }}
                  </span>
                </div>
              </div>
              <div class="flex gap-2">
                <button 
                  @click="copyMaterialInfo(material)"
                  class="text-gray-400 hover:text-fuchsia-400 transition-colors"
                  :title="copyStatus || '复制材料信息'"
                >
                  <Copy class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- 技术规格 -->
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div class="bg-white/5 rounded-lg p-3">
                <div class="text-xs text-gray-400 mb-1">密度/厚度</div>
                <div class="text-sm font-medium text-white">{{ material.density }}</div>
                <div class="text-xs text-gray-300">{{ material.thickness }}</div>
              </div>
              <div class="bg-white/5 rounded-lg p-3">
                <div class="text-xs text-gray-400 mb-1">使用温度</div>
                <div class="text-sm font-medium text-white flex items-center gap-1">
                  <Thermometer class="w-3 h-3" />
                  {{ material.temperature }}
                </div>
              </div>
              <div class="bg-white/5 rounded-lg p-3">
                <div class="text-xs text-gray-400 mb-1">可持续性</div>
                <div :class="['text-sm font-medium', getSustainabilityDisplay(material.sustainability).color]">
                  {{ getSustainabilityDisplay(material.sustainability).icon }} {{ getSustainabilityDisplay(material.sustainability).text }}
                </div>
              </div>
            </div>

            <!-- 性能评级 -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div class="text-center">
                <div class="text-xs text-gray-400 mb-1">印刷适性</div>
                <div class="flex justify-center gap-0.5 mb-1">
                  <Star 
                    v-for="i in 5" 
                    :key="i" 
                    :class="['w-3 h-3', i <= getPerformanceDisplay(material.printability).stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600']"
                  />
                </div>
                <div class="text-xs text-gray-300">{{ getPerformanceDisplay(material.printability).text }}</div>
              </div>
              <div class="text-center">
                <div class="text-xs text-gray-400 mb-1">耐用性</div>
                <div class="flex justify-center gap-0.5 mb-1">
                  <Star 
                    v-for="i in 5" 
                    :key="i" 
                    :class="['w-3 h-3', i <= getPerformanceDisplay(material.durability).stars ? 'text-blue-400 fill-blue-400' : 'text-gray-600']"
                  />
                </div>
                <div class="text-xs text-gray-300">{{ getPerformanceDisplay(material.durability).text }}</div>
              </div>
              <div class="text-center">
                <div class="text-xs text-gray-400 mb-1">防潮性</div>
                <div class="flex justify-center gap-0.5 mb-1">
                  <Droplets 
                    v-for="i in 5" 
                    :key="i" 
                    :class="['w-3 h-3', i <= getPerformanceDisplay(material.moistureResistance).stars ? 'text-cyan-400 fill-cyan-400' : 'text-gray-600']"
                  />
                </div>
                <div class="text-xs text-gray-300">{{ getPerformanceDisplay(material.moistureResistance).text }}</div>
              </div>
              <div class="text-center">
                <div class="text-xs text-gray-400 mb-1">环保性</div>
                <div class="flex justify-center gap-0.5 mb-1">
                  <Leaf 
                    v-for="i in 5" 
                    :key="i" 
                    :class="['w-3 h-3', i <= getPerformanceDisplay(material.sustainability).stars ? 'text-green-400 fill-green-400' : 'text-gray-600']"
                  />
                </div>
                <div class="text-xs text-gray-300">{{ getSustainabilityDisplay(material.sustainability).text }}</div>
              </div>
            </div>

            <!-- 材料特性 -->
            <div class="mb-4">
              <h4 class="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <Zap class="w-4 h-4 text-yellow-400" />
                主要特性
              </h4>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="char in material.characteristics" 
                  :key="char"
                  class="px-2 py-1 text-xs bg-blue-500/10 text-blue-300 rounded border border-blue-400/20"
                >
                  {{ char }}
                </span>
              </div>
            </div>

            <!-- 应用领域 -->
            <div class="mb-4">
              <h4 class="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <Package class="w-4 h-4 text-green-400" />
                应用领域
              </h4>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="app in material.applications" 
                  :key="app"
                  class="px-2 py-1 text-xs bg-green-500/10 text-green-300 rounded border border-green-400/20"
                >
                  {{ app }}
                </span>
              </div>
            </div>

            <!-- 优缺点对比 -->
            <div class="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 class="text-sm font-semibold text-green-400 mb-2">✅ 优点</h4>
                <ul class="space-y-1">
                  <li v-for="advantage in material.advantages" :key="advantage" class="text-sm text-gray-300 flex items-start gap-2">
                    <span class="text-green-400 mt-0.5">•</span>
                    {{ advantage }}
                  </li>
                </ul>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-orange-400 mb-2">⚠️ 缺点</h4>
                <ul class="space-y-1">
                  <li v-for="disadvantage in material.disadvantages" :key="disadvantage" class="text-sm text-gray-300 flex items-start gap-2">
                    <span class="text-orange-400 mt-0.5">•</span>
                    {{ disadvantage }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- 瓦楞纸特有信息 -->
            <div v-if="material.corrugatedTypes" class="mb-6">
              <h4 class="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Layers class="w-4 h-4 text-purple-400" />
                瓦楞类型详情
              </h4>
              <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div 
                  v-for="corrugatedType in material.corrugatedTypes" 
                  :key="corrugatedType.type"
                  class="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple-400/30 transition-colors"
                >
                  <div class="flex items-center justify-between mb-2">
                    <h5 class="font-semibold text-purple-400">{{ corrugatedType.type }}</h5>
                    <span class="text-xs text-gray-400">{{ corrugatedType.englishType }}</span>
                  </div>
                  
                  <div class="space-y-2 text-xs">
                    <div class="flex justify-between">
                      <span class="text-gray-400">厚度:</span>
                      <span class="text-white">{{ corrugatedType.thickness }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-400">楞数:</span>
                      <span class="text-white">{{ corrugatedType.pitchCount }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-400">边压强度:</span>
                      <span class="text-green-400">{{ corrugatedType.edgeCrushStrength }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-400">破裂强度:</span>
                      <span class="text-blue-400">{{ corrugatedType.burstStrength }}</span>
                    </div>
                  </div>
                  
                  <div class="mt-3">
                    <div class="text-xs text-gray-400 mb-1">特点:</div>
                    <div class="flex flex-wrap gap-1">
                      <span 
                        v-for="char in corrugatedType.characteristics" 
                        :key="char"
                        class="px-1.5 py-0.5 text-xs bg-purple-500/10 text-purple-300 rounded"
                      >
                        {{ char }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="mt-3">
                    <div class="text-xs text-gray-400 mb-1">应用:</div>
                    <div class="flex flex-wrap gap-1">
                      <span 
                        v-for="app in corrugatedType.applications" 
                        :key="app"
                        class="px-1.5 py-0.5 text-xs bg-orange-500/10 text-orange-300 rounded"
                      >
                        {{ app }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 技术标准与测试方法 -->
            <div v-if="material.technicalSpecs" class="mb-6">
              <h4 class="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Shield class="w-4 h-4 text-cyan-400" />
                技术标准与测试
              </h4>
              <div class="grid md:grid-cols-3 gap-4">
                <div class="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div class="text-xs text-gray-400 mb-2">行业标准</div>
                  <div class="space-y-1">
                    <div v-for="standard in material.technicalSpecs.gradeStandards" :key="standard" 
                         class="text-xs text-cyan-300">
                      {{ standard }}
                    </div>
                  </div>
                </div>
                
                <div class="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div class="text-xs text-gray-400 mb-2">测试方法</div>
                  <div class="space-y-1">
                    <div v-for="(method, key) in material.technicalSpecs.testMethods" :key="key" 
                         class="text-xs text-gray-300 flex justify-between">
                      <span class="text-gray-400">{{ getTestMethodName(key) }}:</span>
                      <span>{{ method }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div class="text-xs text-gray-400 mb-2">质量等级</div>
                  <div class="space-y-1">
                    <div v-for="(desc, grade) in material.technicalSpecs.qualityGrades" :key="grade" 
                         class="text-xs text-gray-300">
                      <span class="text-yellow-400 font-semibold">{{ grade }}级:</span>
                      <span class="ml-1">{{ desc }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 主要供应商 -->
            <div>
              <h4 class="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <ExternalLink class="w-4 h-4 text-gray-400" />
                主要供应商
              </h4>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="supplier in material.suppliers" 
                  :key="supplier"
                  class="px-2 py-1 text-xs bg-white/5 text-gray-300 rounded border border-white/10"
                >
                  {{ supplier }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 复制状态提示 -->
    <div v-if="copyStatus" class="fixed bottom-6 right-6 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg transition-opacity">
      {{ copyStatus }}
    </div>
  </div>
</template>