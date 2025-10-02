<script setup>
import { ref, computed } from 'vue';
import { 
  Search, Download, Copy, Heart, Grid, List, Filter, 
  Info, Star, Bookmark, Eye, Package, Recycle, Shield,
  Leaf, Award, Zap, AlertTriangle, CheckCircle, XCircle
} from 'lucide-vue-next';

const searchQuery = ref('');
const selectedCategory = ref('all');
const viewMode = ref('grid'); // grid | list
const showKnowledge = ref(false);
const copyStatus = ref('');
const favorites = ref([]);

// 包装行业常用图标数据库
const iconCategories = [
  { id: 'all', name: '全部图标', count: 0 },
  { id: 'recycle', name: '回收循环', count: 12 },
  { id: 'eco', name: '环保生态', count: 8 },
  { id: 'certification', name: '认证标志', count: 15 },
  { id: 'safety', name: '安全警示', count: 10 },
  { id: 'handling', name: '操作指引', count: 14 },
  { id: 'material', name: '材料标识', count: 9 },
  { id: 'quality', name: '质量等级', count: 6 },
];

// 图标数据库 - 使用SVG路径
const iconsDatabase = [
  // 回收循环类
  {
    id: 'recycle-1',
    name: '通用回收标志',
    category: 'recycle',
    keywords: ['回收', '循环', '环保', '绿色'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M7 12l3 3 3-3"/>
      <path d="M13 18H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h6l2 2h6a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2z"/>
    </svg>`,
    description: '国际通用回收标志，表示该材料可回收利用'
  },
  {
    id: 'recycle-arrows',
    name: '循环箭头',
    category: 'recycle',
    keywords: ['循环', '箭头', '回收', '再利用'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.25 0 4.31.83 5.88 2.2"/>
      <path d="m17 8 4-4-4-4"/>
    </svg>`,
    description: '表示材料可循环使用的箭头标志'
  },
  {
    id: 'plastic-1',
    name: '塑料回收码-1',
    category: 'recycle',
    keywords: ['塑料', 'PET', 'PETE', '1号'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z"/>
      <text x="12" y="14" text-anchor="middle" fill="white" font-size="8" font-weight="bold">1</text>
    </svg>`,
    description: 'PET/PETE塑料回收标识，常用于饮料瓶'
  },
  {
    id: 'plastic-2',
    name: '塑料回收码-2',
    category: 'recycle',
    keywords: ['塑料', 'HDPE', '2号'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z"/>
      <text x="12" y="14" text-anchor="middle" fill="white" font-size="8" font-weight="bold">2</text>
    </svg>`,
    description: 'HDPE塑料回收标识，常用于洗发水瓶、牛奶瓶'
  },
  {
    id: 'plastic-3',
    name: '塑料回收码-3',
    category: 'recycle',
    keywords: ['塑料', 'PVC', '3号'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z"/>
      <text x="12" y="14" text-anchor="middle" fill="white" font-size="8" font-weight="bold">3</text>
    </svg>`,
    description: 'PVC塑料回收标识，常用于包装材料'
  },
  {
    id: 'plastic-4',
    name: '塑料回收码-4',
    category: 'recycle',
    keywords: ['塑料', 'LDPE', '4号'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z"/>
      <text x="12" y="14" text-anchor="middle" fill="white" font-size="8" font-weight="bold">4</text>
    </svg>`,
    description: 'LDPE塑料回收标识，常用于塑料袋、保鲜膜'
  },
  {
    id: 'plastic-5',
    name: '塑料回收码-5',
    category: 'recycle',
    keywords: ['塑料', 'PP', '5号'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z"/>
      <text x="12" y="14" text-anchor="middle" fill="white" font-size="8" font-weight="bold">5</text>
    </svg>`,
    description: 'PP塑料回收标识，常用于酸奶盒、微波餐盒'
  },
  {
    id: 'plastic-6',
    name: '塑料回收码-6',
    category: 'recycle',
    keywords: ['塑料', 'PS', '6号'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z"/>
      <text x="12" y="14" text-anchor="middle" fill="white" font-size="8" font-weight="bold">6</text>
    </svg>`,
    description: 'PS塑料回收标识，常用于泡沫餐盒、一次性杯子'
  },
  {
    id: 'plastic-7',
    name: '塑料回收码-7',
    category: 'recycle',
    keywords: ['塑料', '其他', '7号'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z"/>
      <text x="12" y="14" text-anchor="middle" fill="white" font-size="8" font-weight="bold">7</text>
    </svg>`,
    description: '其他类塑料回收标识，包括PC、PA等'
  },

  // 环保生态类
  {
    id: 'green-leaf',
    name: '绿叶环保',
    category: 'eco',
    keywords: ['环保', '绿色', '叶子', '生态'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.24 12.24c0-5.5-4.5-10-10-10s-10 4.5-10 10c0 2.5.92 4.79 2.44 6.55L12 22l9.56-3.21c1.52-1.76 2.44-4.05 2.44-6.55z"/>
      <path d="M12 7v10"/>
      <path d="m8 10 4 4 4-4"/>
    </svg>`,
    description: '表示产品符合环保标准，对环境友好'
  },
  {
    id: 'biodegradable',
    name: '可生物降解',
    category: 'eco',
    keywords: ['生物降解', '可降解', '环保'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2a3 3 0 0 0-3 3c0 1.5 2 5.5 3 7 1-1.5 3-5.5 3-7a3 3 0 0 0-3-3z"/>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
    </svg>`,
    description: '表示材料可在自然环境中分解'
  },
  {
    id: 'earth-friendly',
    name: '地球友好',
    category: 'eco',
    keywords: ['地球', '友好', '环保', '保护'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
      <line x1="9" y1="9" x2="9.01" y2="9"/>
      <line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>`,
    description: '表示产品对地球环境友好'
  },
  {
    id: 'renewable',
    name: '可再生资源',
    category: 'eco',
    keywords: ['可再生', '资源', '可持续'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
      <path d="M12 7v5l4 2"/>
    </svg>`,
    description: '表示使用可再生资源制造'
  },

  // 认证标志类
  {
    id: 'fsc-certified',
    name: 'FSC认证',
    category: 'certification',
    keywords: ['FSC', '森林', '认证', '可持续'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2L3.09 8.26l1.27 11.64L12 22l7.64-2.1L21.91 8.26z"/>
      <path d="M12 8v8"/>
      <path d="m8 12 4-4 4 4"/>
      <text x="12" y="16" text-anchor="middle" font-size="6">FSC</text>
    </svg>`,
    description: 'FSC森林管理委员会认证标志'
  },
  {
    id: 'ce-marking',
    name: 'CE标志',
    category: 'certification',
    keywords: ['CE', '欧盟', '合规', '认证'],
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="8" width="6" height="8" rx="1"/>
      <rect x="14" y="8" width="6" height="8" rx="1"/>
      <text x="7" y="13" text-anchor="middle" fill="white" font-size="4" font-weight="bold">C</text>
      <text x="17" y="13" text-anchor="middle" fill="white" font-size="4" font-weight="bold">E</text>
    </svg>`,
    description: '欧盟CE标志，表示产品符合欧盟法规'
  },
  {
    id: 'iso-certified',
    name: 'ISO认证',
    category: 'certification',
    keywords: ['ISO', '质量', '管理', '认证'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
      <text x="12" y="18" text-anchor="middle" font-size="4">ISO</text>
    </svg>`,
    description: 'ISO国际标准化组织认证'
  },
  {
    id: 'organic-certified',
    name: '有机认证',
    category: 'certification',
    keywords: ['有机', '天然', '无农药', '认证'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2a3 3 0 0 0-3 3c0 1.5 2 5.5 3 7 1-1.5 3-5.5 3-7a3 3 0 0 0-3-3z"/>
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 12h8"/>
      <path d="M12 8v8"/>
    </svg>`,
    description: '有机产品认证标志'
  },

  // 安全警示类
  {
    id: 'fragile',
    name: '易碎品',
    category: 'safety',
    keywords: ['易碎', '小心', '玻璃', '脆弱'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 9v3.75"/>
      <path d="M9 12h6"/>
      <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.25 0 4.31.83 5.88 2.2"/>
      <circle cx="12" cy="17" r="1"/>
    </svg>`,
    description: '易碎品警示标志，提醒小心搬运'
  },
  {
    id: 'this-way-up',
    name: '此面向上',
    category: 'safety',
    keywords: ['向上', '方向', '摆放', '正确'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M7 14l5-5 5 5"/>
      <path d="M12 19V9"/>
      <rect x="3" y="3" width="18" height="18" rx="2"/>
    </svg>`,
    description: '指示包装正确的摆放方向'
  },
  {
    id: 'keep-dry',
    name: '保持干燥',
    category: 'safety',
    keywords: ['干燥', '防潮', '防水'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/>
      <line x1="8" y1="19" x2="8" y2="21"/>
      <line x1="16" y1="19" x2="16" y2="21"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <path d="M12 2L8 6h8z"/>
    </svg>`,
    description: '保持干燥标志，防止受潮'
  },
  {
    id: 'temperature-sensitive',
    name: '温度敏感',
    category: 'safety',
    keywords: ['温度', '敏感', '保温', '储存'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 1 1 4 0z"/>
      <circle cx="12" cy="17" r="1"/>
      <path d="M12 4h2"/>
      <path d="M12 7h2"/>
      <path d="M12 10h2"/>
    </svg>`,
    description: '温度敏感产品，需注意储存温度'
  },

  // 操作指引类
  {
    id: 'handle-with-care',
    name: '小心轻放',
    category: 'handling',
    keywords: ['小心', '轻放', '谨慎', '搬运'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </svg>`,
    description: '提醒搬运时需要小心轻放'
  },
  {
    id: 'do-not-stack',
    name: '禁止堆叠',
    category: 'handling',
    keywords: ['禁止', '堆叠', '不要', '叠放'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="8" width="18" height="4"/>
      <rect x="6" y="12" width="12" height="4"/>
      <rect x="9" y="16" width="6" height="4"/>
      <line x1="4" y1="4" x2="20" y2="20"/>
      <circle cx="12" cy="12" r="10"/>
    </svg>`,
    description: '禁止在此包装上堆叠其他物品'
  },
  {
    id: 'two-person-lift',
    name: '两人搬运',
    category: 'handling',
    keywords: ['两人', '搬运', '重物', '协作'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="7" cy="5" r="2"/>
      <circle cx="17" cy="5" r="2"/>
      <path d="M7 7v6"/>
      <path d="M17 7v6"/>
      <path d="M4 13l6-2"/>
      <path d="M20 13l-6-2"/>
      <path d="M7 13h10"/>
      <rect x="9" y="15" width="6" height="2"/>
    </svg>`,
    description: '重物需要两人协作搬运'
  },
  {
    id: 'use-clamps',
    name: '使用夹具',
    category: 'handling',
    keywords: ['夹具', '工具', '搬运', '设备'],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="8" y="4" width="8" height="16" rx="1"/>
      <path d="M6 8v8"/>
      <path d="M18 8v8"/>
      <path d="M4 8h2"/>
      <path d="M4 16h2"/>
      <path d="M18 8h2"/>
      <path d="M18 16h2"/>
    </svg>`,
    description: '搬运时需要使用专用夹具'
  }
];

// 更新分类计数
iconCategories.forEach(category => {
  if (category.id === 'all') {
    category.count = iconsDatabase.length;
  } else {
    category.count = iconsDatabase.filter(icon => icon.category === category.id).length;
  }
});

// 过滤图标
const filteredIcons = computed(() => {
  let filtered = iconsDatabase;
  
  // 按分类过滤
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(icon => icon.category === selectedCategory.value);
  }
  
  // 按搜索词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(icon => 
      icon.name.toLowerCase().includes(query) ||
      icon.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
      icon.description.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

// 复制SVG代码
const copySVG = async (icon) => {
  try {
    await navigator.clipboard.writeText(icon.svg);
    copyStatus.value = `已复制 ${icon.name} 的SVG代码`;
    setTimeout(() => copyStatus.value = '', 3000);
  } catch (err) {
    copyStatus.value = '复制失败';
    setTimeout(() => copyStatus.value = '', 3000);
  }
};

// 下载PNG
const downloadPNG = (icon) => {
  // 创建SVG元素
  const svgElement = new DOMParser().parseFromString(icon.svg, 'image/svg+xml').documentElement;
  svgElement.setAttribute('width', '256');
  svgElement.setAttribute('height', '256');
  
  // 创建canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 256;
  
  // 将SVG转换为图片
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const img = new Image();
  
  img.onload = () => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    
    // 下载
    const link = document.createElement('a');
    link.download = `${icon.id}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };
  
  img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
};

// 切换收藏
const toggleFavorite = (iconId) => {
  const index = favorites.value.indexOf(iconId);
  if (index > -1) {
    favorites.value.splice(index, 1);
  } else {
    favorites.value.push(iconId);
  }
};

// 批量操作
const selectedIcons = ref([]);
const selectAll = () => {
  selectedIcons.value = filteredIcons.value.map(icon => icon.id);
};
const clearSelection = () => {
  selectedIcons.value = [];
};

// 批量下载
const batchDownload = async () => {
  if (selectedIcons.value.length === 0) return;
  
  const selectedIconsData = iconsDatabase.filter(icon => 
    selectedIcons.value.includes(icon.id)
  );
  
  // 创建ZIP文件的模拟（实际项目中可使用JSZip库）
  for (const icon of selectedIconsData) {
    await new Promise(resolve => setTimeout(resolve, 100)); // 防止浏览器阻塞
    downloadPNG(icon);
  }
  
  copyStatus.value = `开始下载 ${selectedIcons.value.length} 个图标`;
  setTimeout(() => copyStatus.value = '', 3000);
};
</script>

<template>
  <div class="text-white">
    <!-- 标题区域 -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-white flex items-center gap-3">
            包装常用图标库
            <button 
              @click="showKnowledge = !showKnowledge"
              class="text-gray-400 hover:text-fuchsia-400 transition-colors"
              title="了解图标使用知识"
            >
              <Info class="w-6 h-6" />
            </button>
          </h1>
          <p class="mt-2 text-gray-300">收录环保、回收、认证等包装行业标准矢量图标，支持SVG复制和PNG下载。</p>
        </div>
        
        <div class="flex items-center gap-3">
          <span v-if="copyStatus" class="text-sm text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
            {{ copyStatus }}
          </span>
          <div class="flex bg-white/10 rounded-lg p-1">
            <button 
              @click="viewMode = 'grid'"
              :class="['p-2 rounded transition-colors', viewMode === 'grid' ? 'bg-fuchsia-600 text-white' : 'text-gray-400 hover:text-white']"
            >
              <Grid class="w-4 h-4" />
            </button>
            <button 
              @click="viewMode = 'list'"
              :class="['p-2 rounded transition-colors', viewMode === 'list' ? 'bg-fuchsia-600 text-white' : 'text-gray-400 hover:text-white']"
            >
              <List class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 知识卡片 -->
    <div v-if="showKnowledge" class="mb-6 rounded-xl border border-blue-400/20 bg-blue-500/10 p-4 backdrop-blur-lg">
      <h3 class="text-lg font-semibold text-blue-400 mb-2">图标使用指南</h3>
      <div class="text-gray-300 text-sm leading-relaxed space-y-2">
        <p>• <strong>版权说明</strong>：所有图标均为行业标准图标，可免费用于商业用途</p>
        <p>• <strong>格式选择</strong>：SVG格式适合网页和印刷，PNG格式适合演示和预览</p>
        <p>• <strong>尺寸建议</strong>：建议在包装上使用时最小尺寸不低于1cm×1cm</p>
        <p>• <strong>颜色使用</strong>：建议使用黑色或深色，确保在各种背景上清晰可见</p>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <!-- 左侧：搜索和分类 -->
      <div class="xl:col-span-1">
        <div class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
          <!-- 搜索 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-white mb-2">搜索图标</label>
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="输入图标名称或关键词..."
                class="w-full pl-10 pr-4 py-2 rounded-md border border-white/10 bg-white/5 text-white placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400"
              />
            </div>
          </div>

          <!-- 分类筛选 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-white mb-3">图标分类</label>
            <div class="space-y-1">
              <button
                v-for="category in iconCategories"
                :key="category.id"
                @click="selectedCategory = category.id"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors',
                  selectedCategory === category.id 
                    ? 'bg-fuchsia-600 text-white' 
                    : 'text-gray-300 hover:bg-white/10'
                ]"
              >
                <span class="text-sm">{{ category.name }}</span>
                <span class="text-xs bg-white/20 px-2 py-1 rounded-full">{{ category.count }}</span>
              </button>
            </div>
          </div>

          <!-- 批量操作 -->
          <div v-if="viewMode === 'grid'" class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-white">批量操作</span>
              <span v-if="selectedIcons.length > 0" class="text-xs text-gray-400">
                已选择 {{ selectedIcons.length }} 个
              </span>
            </div>
            
            <div class="flex gap-2">
              <button 
                @click="selectAll"
                class="flex-1 px-3 py-2 text-xs bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
              >
                全选
              </button>
              <button 
                @click="clearSelection"
                class="flex-1 px-3 py-2 text-xs bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
              >
                清除
              </button>
            </div>
            
            <button 
              @click="batchDownload"
              :disabled="selectedIcons.length === 0"
              class="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs bg-fuchsia-600 text-white rounded hover:bg-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download class="w-3 h-3" />
              批量下载PNG
            </button>
          </div>

          <!-- 收藏夹 -->
          <div v-if="favorites.length > 0" class="mt-6">
            <div class="flex items-center gap-2 mb-3">
              <Heart class="w-4 h-4 text-red-400" />
              <span class="text-sm font-medium text-white">我的收藏</span>
              <span class="text-xs text-gray-400">({{ favorites.length }})</span>
            </div>
            
            <button
              @click="selectedCategory = 'all'; searchQuery = ''"
              class="text-xs text-fuchsia-400 hover:text-fuchsia-300"
            >
              查看所有收藏
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧：图标展示 -->
      <div class="xl:col-span-3">
        <div class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
          <!-- 结果统计 -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-xl font-semibold text-white">
                {{ selectedCategory === 'all' ? '全部图标' : iconCategories.find(c => c.id === selectedCategory)?.name }}
              </h2>
              <p class="text-sm text-gray-400 mt-1">
                共找到 {{ filteredIcons.length }} 个图标
                <span v-if="searchQuery">，搜索："{{ searchQuery }}"</span>
              </p>
            </div>
          </div>

          <!-- 无结果提示 -->
          <div v-if="filteredIcons.length === 0" class="text-center py-12">
            <Package class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-white mb-2">未找到相关图标</h3>
            <p class="text-gray-400 text-sm">尝试使用其他关键词或选择不同的分类</p>
            <button 
              @click="searchQuery = ''; selectedCategory = 'all'"
              class="mt-4 px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition-colors"
            >
              查看全部图标
            </button>
          </div>

          <!-- 网格视图 -->
          <div v-else-if="viewMode === 'grid'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div
              v-for="icon in filteredIcons"
              :key="icon.id"
              class="group relative bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-white/20"
            >
              <!-- 选择框 -->
              <div class="absolute top-2 left-2">
                <input 
                  type="checkbox" 
                  :value="icon.id"
                  v-model="selectedIcons"
                  class="w-4 h-4 text-fuchsia-600 bg-white/20 border-white/30 rounded focus:ring-fuchsia-500 focus:ring-2"
                />
              </div>

              <!-- 收藏按钮 -->
              <button 
                @click="toggleFavorite(icon.id)"
                class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Heart 
                  :class="[
                    'w-4 h-4 transition-colors',
                    favorites.includes(icon.id) 
                      ? 'text-red-400 fill-red-400' 
                      : 'text-gray-400 hover:text-red-400'
                  ]" 
                />
              </button>

              <!-- 图标预览 -->
              <div class="flex items-center justify-center h-16 mb-3">
                <div 
                  class="w-12 h-12 text-gray-700"
                  v-html="icon.svg"
                ></div>
              </div>

              <!-- 图标信息 -->
              <div class="text-center">
                <h3 class="text-sm font-medium text-white mb-1">{{ icon.name }}</h3>
                <p class="text-xs text-gray-400 mb-3 line-clamp-2">{{ icon.description }}</p>

                <!-- 操作按钮 -->
                <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    @click="copySVG(icon)"
                    class="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    title="复制SVG代码"
                  >
                    <Copy class="w-3 h-3" />
                    SVG
                  </button>
                  <button 
                    @click="downloadPNG(icon)"
                    class="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    title="下载PNG图片"
                  >
                    <Download class="w-3 h-3" />
                    PNG
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 列表视图 -->
          <div v-else class="space-y-3">
            <div
              v-for="icon in filteredIcons"
              :key="icon.id"
              class="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-transparent hover:border-white/20"
            >
              <!-- 图标预览 -->
              <div class="flex-shrink-0">
                <div 
                  class="w-10 h-10 text-gray-700"
                  v-html="icon.svg"
                ></div>
              </div>

              <!-- 图标信息 -->
              <div class="flex-1">
                <h3 class="text-sm font-medium text-white">{{ icon.name }}</h3>
                <p class="text-xs text-gray-400 mt-1">{{ icon.description }}</p>
                <div class="flex flex-wrap gap-1 mt-2">
                  <span
                    v-for="keyword in icon.keywords.slice(0, 4)"
                    :key="keyword"
                    class="px-2 py-1 text-xs bg-white/10 text-gray-300 rounded"
                  >
                    {{ keyword }}
                  </span>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex-shrink-0 flex items-center gap-2">
                <button 
                  @click="toggleFavorite(icon.id)"
                  :title="favorites.includes(icon.id) ? '取消收藏' : '添加收藏'"
                >
                  <Heart 
                    :class="[
                      'w-4 h-4 transition-colors',
                      favorites.includes(icon.id) 
                        ? 'text-red-400 fill-red-400' 
                        : 'text-gray-400 hover:text-red-400'
                    ]" 
                  />
                </button>
                <button 
                  @click="copySVG(icon)"
                  class="flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  <Copy class="w-3 h-3" />
                  复制SVG
                </button>
                <button 
                  @click="downloadPNG(icon)"
                  class="flex items-center gap-1 px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  <Download class="w-3 h-3" />
                  下载PNG
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>