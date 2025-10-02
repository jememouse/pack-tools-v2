<script setup>
import { ref } from 'vue';
import {
  Search,
  Ruler,
  Scale,
  Palette,
  LayoutGrid,
  ImageIcon,
  QrCode,
  Calculator,
  FileCheck,
  Calendar,
  BrainCircuit,
  Book,
  Box,
  Layers,
  Thermometer
} from 'lucide-vue-next';
import ToolCard from '../components/ToolCard.vue';
import KnowledgeCard from '../components/KnowledgeCard.vue';

const tools = ref([
  {
    name: '包装行业单位换算器',
    description: '解决长度、重量、压力、克重等单位间反复查询换算的烦恼。',
    icon: Ruler,
    category: '通用基础',
    path: '/tools/unit-converter',
  },
  {
    name: '物流抛重/体积重计算器',
    description: '快速计算快递包裹的计费重量，避免运费误判。',
    icon: Calculator,
    category: '通用基础',
    path: '/tools/volume-weight-calculator',
  },
  {
    name: '简易拼版计算器',
    description: '快速估算一张大纸上最多能拼多少成品，为成本核算和纸张采购提供关键依据。',
    icon: LayoutGrid,
    category: '设计与印前',
    path: '/tools/simple-layout-calculator',
  },
  {
    name: '色彩模式转换器',
    description: '在RGB/HEX/CMYK模式间实时换算，无需打开大型软件。',
    icon: Palette,
    category: '设计与印前',
    path: '/tools/color-mode-converter',
  },
  {
    name: '颜色差异(ΔE)解释器',
    description: '将抽象的ΔE数值，翻译成直观的视觉感受和行业标准。',
    icon: BrainCircuit,
    category: '设计与印前',
    path: '/tools/color-difference',
  },
  {
    name: '包装常用图标库',
    description: '一键复制/下载环保、回收、认证等行业标准矢量图标。',
    icon: ImageIcon,
    category: '设计与印前',
    path: '/tools/packaging-icons',
  },
  {
    name: '快速贴图模拟器(Lite)',
    description: '快速将Logo或主视觉图“贴”到包装样板图上，生成效果图。',
    icon: Layers,
    category: '设计与印前',
  },
  {
    name: '印刷出血计算器',
    description: '帮助新手快速计算含出血的设计稿尺寸，避免文件错误。',
    icon: Box,
    category: '设计与印前',
  },
  {
    name: '纸张克重与厚度换算器',
    description: '快速估算特定克重纸张的大致厚度，辅助设计和选材。',
    icon: Thermometer,
    category: '技术查询',
    path: '/tools/paper-weight-thickness-converter',
  },
  {
    name: '包装材料数据库(Mini)',
    description: '快速查询最核心包装材料的特性、用途和成本级别。',
    icon: Book,
    category: '技术查询',
    path: '/tools/packaging-material-database',
  },
  {
    name: '印前文件自查清单',
    description: '规范交付流程，避免因文件不规范导致印刷错误或返工。',
    icon: FileCheck,
    category: '项目与协作',
    path: '/tools/prepress-checklist',
  },
  {
    name: '简易项目工期估算器',
    description: '快速估算项目总耗时，为客户提供合理的交付预期。',
    icon: Calendar,
    category: '项目与协作',
  },
  {
    name: '包装专用二维码生成器',
    description: '快速生成用于包装印刷的高分辨率二维码。',
    icon: QrCode,
    category: '内容与营销',
  },
  {
    name: '包装营销词生成器',
    description: '当包装文案卡壳时，提供行业热门关键词激发灵感。',
    icon: Scale,
    category: '内容与营销',
  },
]);

const categories = ['通用基础', '设计与印前', '技术查询', '项目与协作', '内容与营销'];

const knowledgeBase = ref([
  {
    module: '设计与印前规范',
    title: '色彩模式: RGB vs CMYK',
    description: '对比两种色彩模式的原理和应用场景，解释为何印刷必须用CMYK。',
  },
  {
    module: '设计与印前规范',
    title: '什么是印刷色差(ΔE)?',
    description: '解释ΔE的定义，并图文并茂地展示不同ΔE数值的视觉差异。',
  },
  {
    module: '设计与印前规范',
    title: '理解出血(Bleed)',
    description: '用示意图清晰地展示什么是出血、为何需要设置出血以及标准值。',
  },
  {
    module: '材料与技术基础',
    title: '克重(gsm)与厚度(pt/mm)',
    description: '图解解释克重和厚度的概念，提供常见纸张对应关系表。',
  },
  {
    module: '材料与技术基础',
    title: '核心包装材料简介',
    description: '介绍白卡纸、牛皮纸、BE楞、PET、BOPP的核心特性、用途。',
  },
  {
    module: '行业标准与规范速查',
    title: 'FSC 森林认证标志',
    description: '解释FSC标志的含义以及三种标签（100%, Mix, Recycled）的区别。',
  },
]);

const slugify = (text) => {
  return text.toString().toLowerCase().replace(/\s+/g, '-');
};
</script>

<template>
  <div>
    <div class="text-center mb-16">
      <h1 class="text-4xl md:text-5xl font-bold text-white">专为包装人打造的在线效率工具集</h1>
      <p class="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">免费、免注册，即开即用。我们致力于提供一系列“小而美且专”的即用型微工具和知识内容。</p>
      <div class="mt-8 max-w-xl mx-auto">
        <div class="relative">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input type="text" placeholder="搜索工具或知识，如‘拼版计算’..." class="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-base text-white placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50" />
        </div>
      </div>
    </div>

    <div v-for="category in categories" :key="category" :id="slugify(category)" class="mb-12 scroll-mt-24">
      <h2 class="text-2xl font-semibold text-white mb-6">{{ category }}</h2>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <ToolCard v-for="tool in tools.filter(t => t.category === category)" :key="tool.name" :tool="tool" />
      </div>
    </div>

    <div id="knowledge-base" class="mb-12 scroll-mt-24">
      <h2 class="text-2xl font-semibold text-white mb-6">精选知识</h2>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <KnowledgeCard v-for="card in knowledgeBase" :key="card.title" :card="card" />
      </div>
    </div>
  </div>
</template>
