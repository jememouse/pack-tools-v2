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
    path: '/tools/project-timeline-estimator',
  },
  {
    name: '包装专用二维码生成器',
    description: '快速生成用于包装印刷的高分辨率二维码。',
    icon: QrCode,
    category: '内容与营销',
    path: '/tools/qr-code-generator',
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
    description: '为什么屏幕上的颜色印刷后会变暗？理解两种色彩模式的本质差异。',
    emoji: '🎨',
    content: {
      intro: '在包装设计中，最常遇到的问题就是“为什么我在电脑上看到的颜色，印出来不一样？”这背后的原因，就是RGB和CMYK这两种完全不同的色彩模式。',
      keyPoints: [
        { title: 'RGB - 光的世界', text: 'Red、Green、Blue三种光混合，越混合越亮（加色模式）。用于屏幕显示，色域更广，颜色更鲜艳。' },
        { title: 'CMYK - 墨的世界', text: 'Cyan、Magenta、Yellow、blacK四种油墨叠加，越混合越暗（减色模式）。用于印刷，色域较窄。' },
        { title: '为什么会变色？', text: 'RGB的部分颜色超出CMYK能表达的范围，转换时会被“压缩”到最接近的可印刷颜色，特别是鲜艳的蓝、橙、荧光色最容易失真。' }
      ],
      tips: [
        '从设计之初就使用CMYK模式创建文件',
        '定期切换到CMYK预览模式查看效果',
        '与印刷厂确认专色（Pantone）的CMYK近似值',
        '控制总墨量在280-300%以内'
      ]
    }
  },
  {
    module: '设计与印前规范',
    title: '什么是印刷色差(ΔE)?',
    description: '从抽象的数字到直观的视觉感受，读懂ΔE值的真实含义。',
    emoji: '👁️',
    content: {
      intro: 'ΔE（Delta E）是衡量两个颜色之间差异的数值，包装行业必须掌握的专业指标。数值越小，颜色越接近。',
      keyPoints: [
        { title: 'ΔE < 1', text: '几乎看不出差异，专业设计师才能察觉。高端包装和品牌形象物料的标准。' },
        { title: 'ΔE = 1-3', text: '普通人仔细对比能察觉差异。一般商业印刷的可接受范围，大多数客户能接受。' },
        { title: 'ΔE = 3-6', text: '明显色差，一眼就能看出区别。需要重印或客户确认才能交付。' },
        { title: 'ΔE > 6', text: '严重色差，完全不可接受。属于印刷质量事故，必须重印。' }
      ],
      tips: [
        '首次合作的印刷厂要求打样并测量ΔE值',
        '品牌色和主视觉的ΔE要求控制在2以内',
        '不同批次的产品保持ΔE < 3可避免色差投诉',
        '使用专业色差仪（如爱色丽）而非肉眼判断'
      ]
    }
  },
  {
    module: '设计与印前规范',
    title: '理解出血(Bleed)',
    description: '一个3mm的小细节，决定了你的设计是否专业。',
    emoji: '📏',
    content: {
      intro: '出血是印刷品裁切时的“安全区域”，如果不设置出血，裁切后边缘会露出白边，严重影响美观。这是新手最容易忽略的细节。',
      keyPoints: [
        { title: '什么是出血？', text: '设计稿超出成品尺寸的部分，用于抵消裁切误差。标准出血值为3mm，特殊工艺可能需要5mm。' },
        { title: '为什么需要出血？', text: '裁切机器有±1-2mm的误差，如果设计刚好卡在成品线，裁切后可能露出白边。出血确保裁切到哪里都有完整的画面。' },
        { title: '如何设置？', text: '成品尺寸90×54mm的名片，设计稿应为96×60mm（四边各加3mm）。重要文字和Logo要距离裁切线至少3mm。' }
      ],
      tips: [
        '底色和底图务必延伸到出血线',
        '重要内容保持在安全线（裁切线内3mm）内',
        '导出PDF时选择“包含出血”选项',
        '黑色边框容易显示裁切不齐，尽量避免使用'
      ]
    }
  },
  {
    module: '材料与技术基础',
    title: '克重(gsm)与厚度(pt/mm)',
    description: '纸张的两个关键参数，影响手感、成本和印刷效果。',
    emoji: '📄',
    content: {
      intro: '克重是单位面积的重量（g/m²），厚度是纸张的实际厚度（mm或pt）。两者相关但不等同，同样克重的纸，不同材质厚度可能不同。',
      keyPoints: [
        { title: '常见克重对照', text: '80gsm普通复印纸（薄）｜250gsm铜版纸（常规名片）｜350gsm白卡（高档包装）｜600gsm+灰板（精装书封面）。' },
        { title: '克重与手感', text: '克重越高，纸张越厚实、挺度越好、成本越高。但过高克重可能导致折页开裂，需要考虑实际用途。' },
        { title: '厚度估算', text: '估算公式：厚度(mm) ≈ 克重(gsm) ÷ 密度。白卡纸密度约800，250gsm白卡≈0.31mm。实际请以材质与压制工艺为准。' }
      ],
      tips: [
        '名片标准250-300gsm，太薄显廉价',
        '手提袋用300-350gsm白卡+覆膜增强强度',
        '彩盒外包装推荐350-400gsm灰底白板纸',
        '向印刷厂索要纸样，实际触摸比数据更直观'
      ]
    }
  },
  {
    module: '材料与技术基础',
    title: '核心包装材料简介',
    description: '白卡、牛皮、瓦楞……选对材料等于成功了一半。',
    emoji: '📦',
    content: {
      intro: '包装材料的选择直接影响产品档次、成本和环保性。了解每种材料的特性，才能做出最优选择。',
      keyPoints: [
        { title: '白卡纸 - 高档首选', text: '洁白挺括，印刷效果好，适合化妆品、电子产品等高端包装。成本较高，质感最好。' },
        { title: '牛皮纸 - 环保担当', text: '天然棕色，韧性强，展现原生态和环保理念。适合手工食品、文创产品。' },
        { title: '瓦楞纸板 - 物流保护', text: 'E楞（薄，1-2mm）用于精品盒；B楞（3mm）常规快递箱；A/C楞（4-5mm）用于大件或重物运输。' },
        { title: 'PET/BOPP - 透明柔性', text: 'PET可印刷贴标，BOPP用于覆膜提升光泽度和防水性。食品、日用品常用。' }
      ],
      tips: [
        '高端产品选白卡+烫金/UV提升质感',
        '环保概念产品优先牛皮纸+水性印刷',
        '易碎品必须用瓦楞+缓冲材料',
        '材料成本常占包装总成本的40-60%'
      ]
    }
  },
  {
    module: '行业标准与规范速查',
    title: 'FSC 森林认证标志',
    description: '包装上这个小绿标，代表的是企业的环保责任。',
    emoji: '🌳',
    content: {
      intro: 'FSC（森林管理委员会）认证是全球权威的森林可持续认证，贴上FSC标志的包装，表明原材料来自负责任管理的森林。',
      keyPoints: [
        { title: 'FSC 100%', text: '产品100%来自FSC认证森林。标准最严格，常用于高端品牌和出口产品。' },
        { title: 'FSC Mix', text: '混合认证材料，至少70%来自FSC认证森林，其余为可控来源。市场上最常见，性价比高。' },
        { title: 'FSC Recycled', text: '100%使用回收材料。适合强调循环经济的品牌，但纸张质感略逊于原生纸。' }
      ],
      tips: [
        '出口欧美市场的产品强烈建议使用FSC认证纸张',
        'FSC认证会增加5-15%的材料成本，但显著提升品牌形象',
        '印刷FSC标志前必须申请许可证号（License Code）',
        '完整标识格式示例：FSC® C123456（含编号）'
      ]
    }
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
