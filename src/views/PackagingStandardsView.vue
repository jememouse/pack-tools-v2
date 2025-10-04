<script setup>
import { ref, computed } from 'vue';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Globe, 
  MapPin, 
  Leaf, 
  Truck, 
  Utensils, 
  FileText, 
  Box,
  ExternalLink,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Palette
} from 'lucide-vue-next';

// 搜索和过滤状态
const searchQuery = ref('');
const selectedCategory = ref('全部');
const expandedSections = ref(new Set(['国际标准'])); // 默认展开国际标准

// 标准分类
const categories = [
  '全部',
  '国际标准', 
  '中国国家标准', 
  '欧盟标准', 
  '美国标准', 
  '日本工业标准',
  '包装材料标准',
  '包装设计标准',
  '包装色彩标准',
  '环保与可持续性标准',
  '运输包装标准',
  '食品包装标准'
];

// 标准数据结构
const packagingStandards = ref([
  {
    category: '国际标准',
    icon: Globe,
    color: 'blue',
    description: 'ISO、ASTM等国际标准化组织制定的标准',
    standards: [
      {
        id: 'iso-11607',
        title: 'ISO 11607 系列 - 医疗器械包装',
        standardNumber: 'ISO 11607-1:2019 / ISO 11607-2:2019',
        description: '医疗器械的终端灭菌包装要求，包括材料、无菌屏障系统和包装系统的要求与验证。',
        application: '医疗器械包装',
        keyPoints: ['无菌屏障系统要求', '包装材料选择', '验证方法', '储存条件'],
        importance: '确保医疗器械在灭菌过程和储存期间的无菌性'
      },
      {
        id: 'iso-3394',
        title: 'ISO 3394:2012 - 货运集装箱模数尺寸',
        standardNumber: 'ISO 3394:2012',
        description: '规定了货运集装箱的标准尺寸，确保全球范围内集装箱的标准化和互换性。',
        application: '国际贸易、物流运输',
        keyPoints: ['标准尺寸规格', '模数化设计', '国际互换性', '装载优化'],
        importance: '实现全球物流标准化，提高运输效率'
      },
      {
        id: 'iso-780',
        title: 'ISO 780:2015 - 包装标志图形符号',
        standardNumber: 'ISO 780:2015',
        description: '规定了包装上使用的图形符号，包括易碎、向上、防湿、堆码限制等标识。',
        application: '包装标识、国际贸易',
        keyPoints: ['图形符号标准', '操作指示', '警告标识', '国际通用'],
        importance: '统一国际包装标识，提高物流效率和货物安全'
      },
      {
        id: 'astm-d4169',
        title: 'ASTM D4169-16 - 运输包装试验标准',
        standardNumber: 'ASTM D4169-16',
        description: '运输包装的性能试验程序，包括跌落、振动、压缩、环境条件等测试。',
        application: '运输包装测试',
        keyPoints: ['试验序列设计', '环境模拟', '性能评估', '分级系统'],
        importance: '评估包装在实际运输环境中的保护能力'
      },
      {
        id: 'astm-f1886',
        title: 'ASTM F1886-16 - 密封包装泄漏检测标准',
        standardNumber: 'ASTM F1886-16',
        description: '柔性包装泄漏检测方法，确保包装的密封性和产品安全。',
        application: '食品、药品等密封包装',
        keyPoints: ['泄漏检测方法', '密封性评估', '质量控制', '安全保障'],
        importance: '确保包装的密封性和产品安全'
      }
    ]
  },
  {
    category: '中国国家标准',
    icon: MapPin,
    color: 'red',
    description: 'GB、GB/T等中国国家标准',
    standards: [
      {
        id: 'gb-4857',
        title: 'GB/T 4857 系列 - 包装运输包装件基本试验',
        standardNumber: 'GB/T 4857.1~4857.23',
        description: '中国包装试验的基础标准系列，规定了包装性能测试的基本方法。',
        application: '包装性能测试',
        keyPoints: ['试验方法标准化', '温湿度调节', '跌落试验', '压缩试验', '振动试验'],
        importance: '中国包装行业测试的基础标准'
      },
      {
        id: 'gb-6543',
        title: 'GB/T 6543-2008 - 瓦楞纸箱',
        standardNumber: 'GB/T 6543-2008',
        description: '瓦楞纸箱的技术要求、试验方法、检验规则，包括边压强度、耐破强度等指标。',
        application: '瓦楞纸箱制造',
        keyPoints: ['技术要求', '强度指标', '试验方法', '检验规则'],
        importance: '确保瓦楞纸箱质量，保障运输安全'
      },
      {
        id: 'gb-9685',
        title: 'GB 9685-2016 - 食品接触材料及制品用添加剂使用标准',
        standardNumber: 'GB 9685-2016',
        description: '食品包装材料中允许使用的添加剂清单，包括迁移限量要求。',
        application: '食品包装材料',
        keyPoints: ['添加剂正面清单', '迁移限量', '安全评估', '质量控制'],
        importance: '确保食品包装材料的安全性'
      },
      {
        id: 'gb-4806',
        title: 'GB 4806 系列 - 食品接触材料',
        standardNumber: 'GB 4806.1~4806.11',
        description: '中国食品包装材料安全标准体系，涵盖通用要求和各类材料的具体要求。',
        application: '食品接触材料',
        keyPoints: ['通用安全要求', '材料特定要求', '迁移试验', '标识要求'],
        importance: '建立完整的食品包装安全标准体系'
      }
    ]
  },
  {
    category: '欧盟标准',
    icon: Globe,
    color: 'blue',
    description: 'EN等欧洲标准化委员会标准',
    standards: [
      {
        id: 'en-13432',
        title: 'EN 13432:2000 - 包装材料可堆肥性要求',
        standardNumber: 'EN 13432:2000',
        description: '可堆肥包装材料的定义、要求和测试方法，包括生物降解性和生态毒性评估。',
        application: '可堆肥包装材料',
        keyPoints: ['生物降解性', '生态毒性', '重金属含量', '堆肥条件'],
        importance: '欧盟可持续包装的重要标准，与循环经济政策密切相关'
      },
      {
        id: 'en-868',
        title: 'EN 868 系列 - 医疗器械灭菌包装材料',
        standardNumber: 'EN 868-1 至 EN 868-10',
        description: '欧洲医疗包装的权威标准，涵盖各种包装材料的要求和试验方法。',
        application: '医疗器械包装',
        keyPoints: ['通用要求', '材料特定要求', '试验方法', '质量控制'],
        importance: '欧洲医疗包装的权威标准'
      },
      {
        id: 'en-15343',
        title: 'EN 15343:2007 - 塑料包装回收性评估',
        standardNumber: 'EN 15343:2007',
        description: '塑料包装可回收性的评估方法，支持包装废物管理和循环经济。',
        application: '塑料包装回收',
        keyPoints: ['回收性评估', '材料兼容性', '环保设计', '废物管理'],
        importance: '支持包装废物管理和循环经济'
      }
    ]
  },
  {
    category: '美国标准',
    icon: MapPin,
    color: 'blue',
    description: 'ISTA、CFR等美国标准',
    standards: [
      {
        id: 'ista-1',
        title: 'ISTA 1A/1B/1C - 非仿真完整性试验程序',
        standardNumber: 'ISTA 1A, 1B, 1C',
        description: '轻型包装（≤68kg）的基本保护性能测试，包括跌落、堆码、振动试验。',
        application: '轻型包装测试',
        keyPoints: ['非仿真试验', '基本性能评估', '标准化流程', '快速评估'],
        importance: '评估包装基本的保护性能'
      },
      {
        id: 'ista-3',
        title: 'ISTA 3A/3B/3E - 通用仿真试验程序',
        standardNumber: 'ISTA 3A, 3B, 3E',
        description: '完全仿真实际运输环境的最严格包装测试标准。',
        application: '全仿真包装测试',
        keyPoints: ['完全仿真', '运输环境模拟', '严格测试', '真实评估'],
        importance: '最严格的包装测试标准'
      },
      {
        id: 'cfr-178',
        title: '49 CFR Part 178 - 危险品包装规范',
        standardNumber: '49 CFR Part 178',
        description: '危险品运输包装的技术要求，按危险等级分类管理。',
        application: '危险品运输包装',
        keyPoints: ['危险品分类', '包装要求', '安全标准', '运输规范'],
        importance: '确保危险品运输安全的强制性标准'
      }
    ]
  },
  {
    category: '包装材料标准',
    icon: Box,
    color: 'green',
    description: '纸质、塑料、金属等包装材料标准',
    standards: [
      {
        id: 'iso-527',
        title: 'ISO 527 系列 - 塑料拉伸性能测定',
        standardNumber: 'ISO 527-1~527-5',
        description: '塑料包装材料机械性能测试，包括拉伸强度、断裂伸长率等指标。',
        application: '塑料包装薄膜、容器',
        keyPoints: ['拉伸强度', '断裂伸长率', '弹性模量', '测试方法'],
        importance: '评估塑料包装材料的机械性能'
      },
      {
        id: 'gb-13023',
        title: 'GB/T 13023-2008 - 瓦楞芯纸',
        standardNumber: 'GB/T 13023-2008',
        description: '瓦楞芯纸的技术要求和试验方法，包括环压强度、平压强度等指标。',
        application: '瓦楞纸箱生产',
        keyPoints: ['环压强度', '横向环压强度', '平压强度', '质量要求'],
        importance: '瓦楞纸箱质量的重要基础材料标准'
      }
    ]
  },
  {
    category: '包装色彩标准',
    icon: Palette,
    color: 'purple',
    description: '色彩管理、印刷标准、色彩测量与控制规范',
    standards: [
      {
        id: 'iso-12647-2',
        title: 'ISO 12647-2:2013 - 胶印色彩控制',
        standardNumber: 'ISO 12647-2:2013',
        description: '胶印过程中的色彩控制标准，规定了四色胶印的印刷条件、色彩特性和质量控制要求。',
        application: '胶印包装印刷',
        keyPoints: ['印刷条件标准化', 'Lab色彩空间', '色密度控制', '网点增大补偿', 'G7校准方法'],
        importance: '确保胶印包装产品色彩一致性和质量稳定性的国际标准'
      },
      {
        id: 'iso-12647-6',
        title: 'ISO 12647-6:2012 - 柔印色彩控制',
        standardNumber: 'ISO 12647-6:2012',
        description: '柔版印刷色彩控制标准，适用于包装印刷中的柔印工艺，规定了印刷条件和色彩参数。',
        application: '柔印包装印刷',
        keyPoints: ['柔印工艺特点', '承印材料适应性', '油墨转移控制', '印版质量要求', '色彩稳定性'],
        importance: '柔印包装行业色彩标准化的重要依据'
      },
      {
        id: 'iso-13655',
        title: 'ISO 13655:2017 - 印刷技术色彩测量',
        standardNumber: 'ISO 13655:2017',
        description: '印刷品色彩测量的标准方法，规定了测量条件、仪器要求和数据处理方法。',
        application: '色彩品质检测',
        keyPoints: ['测量几何条件', '标准光源', '白点校准', '测量精度', '数据处理标准'],
        importance: '确保色彩测量结果准确性和可比性的基础标准'
      },
      {
        id: 'iso-3664',
        title: 'ISO 3664:2009 - 图像技术观察条件',
        standardNumber: 'ISO 3664:2009',
        description: '图像和印刷品观察的标准照明条件，确保色彩评价的一致性和准确性。',
        application: '色彩评价环境',
        keyPoints: ['标准光源D50/D65', '照度要求2000lux', '色温稳定性', '显色指数Ra>90', '环境光控制'],
        importance: '建立标准化色彩评价环境的关键标准'
      },
      {
        id: 'gb-t-17934',
        title: 'GB/T 17934.1-2003 - 印刷技术网点增大测量',
        standardNumber: 'GB/T 17934.1-2003',
        description: '中国印刷行业网点增大测量标准，规定了网点增大的定义、测量方法和控制范围。',
        application: '印刷质量控制',
        keyPoints: ['网点增大定义', 'Murray-Davies公式', '测量方法标准', '控制范围', '补偿曲线'],
        importance: '中国印刷行业网点质量控制的基础标准'
      },
      {
        id: 'fogra-pso',
        title: 'FOGRA PSO - 印刷标准化',
        standardNumber: 'FOGRA PSO',
        description: 'FOGRA印刷标准化认证体系，基于ISO 12647系列标准，提供完整的印刷过程控制方案。',
        application: '印刷过程标准化',
        keyPoints: ['过程控制', '质量认证', '标准化实施', '数据管理', '持续改进'],
        importance: '欧洲印刷行业广泛采用的标准化认证体系'
      },
      {
        id: 'pantone-matching-system',
        title: 'Pantone配色系统 - 专色标准',
        standardNumber: 'PMS',
        description: '全球通用的专色标准体系，提供标准化的色彩参考和配方，广泛应用于包装印刷。',
        application: '专色印刷',
        keyPoints: ['标准色卡', '色彩配方', 'Lab数值', '油墨调配', '国际通用性'],
        importance: '全球包装印刷专色应用的事实标准'
      },
      {
        id: 'cie-lab',
        title: 'CIE L*a*b* 色彩空间标准',
        standardNumber: 'CIE 015:2018',
        description: 'CIE Lab色彩空间的定义和应用标准，为色彩测量和管理提供科学基础。',
        application: '色彩测量与管理',
        keyPoints: ['设备无关色彩空间', '色差计算△E', '视觉均匀性', '色域映射', '色彩管理工作流'],
        importance: '现代色彩管理系统的理论基础和技术标准'
      },
      {
        id: 'iso-12640',
        title: 'ISO 12640 系列 - 印前数据交换',
        standardNumber: 'ISO 12640-1~5',
        description: '印前制作和数据交换的色彩标准，规定了图像文件的色彩特征描述方法。',
        application: '印前色彩管理',
        keyPoints: ['色彩特征描述', 'ICC色彩管理', '图像交换格式', '工作流程', '质量控制'],
        importance: '确保印前到印刷全流程色彩一致性的重要标准'
      },
      {
        id: 'gb-t-7705',
        title: 'GB/T 7705-2008 - 印刷品颜色表示方法',
        standardNumber: 'GB/T 7705-2008',
        description: '中国印刷品颜色表示和测量的国家标准，规定了颜色参数和测量条件。',
        application: '印刷品色彩规范',
        keyPoints: ['色彩表示方法', '测量条件', 'Lab色空间应用', '色差评价', '质量分级'],
        importance: '中国印刷行业色彩标准化的基础规范'
      },
      {
        id: 'gracol-g7',
        title: 'GRACoL G7 - 灰平衡校准',
        standardNumber: 'GRACoL G7',
        description: '基于灰平衡的印刷校准方法，通过中性灰控制实现不同印刷条件下的视觉匹配。',
        application: '印刷校准',
        keyPoints: ['灰平衡控制', '视觉匹配', 'NPDC曲线', '多条件适应', '快速校准'],
        importance: '北美印刷行业广泛采用的校准标准，提高不同设备间色彩一致性'
      },
      {
        id: 'iso-15076',
        title: 'ISO 15076 系列 - 图像技术色彩管理',
        standardNumber: 'ISO 15076-1',
        description: '图像技术中的色彩管理架构标准，定义了色彩管理系统的基本概念和实施方法。',
        application: '色彩管理系统',
        keyPoints: ['色彩管理架构', 'ICC配置文件', '设备校准', '色彩转换', '质量保证'],
        importance: '建立完整色彩管理工作流程的指导标准'
      }
    ]
  },
  {
    category: '环保与可持续性标准',
    icon: Leaf,
    color: 'green',
    description: '生物降解、回收利用等环保标准',
    standards: [
      {
        id: 'astm-d6400',
        title: 'ASTM D6400-21 - 堆肥环境中塑料材料标准规范',
        standardNumber: 'ASTM D6400-21',
        description: '商业堆肥设施条件下塑料材料的生物降解和生态毒性评估。',
        application: '可降解塑料包装',
        keyPoints: ['生物降解率', '生态毒性', '化学成分', '堆肥条件'],
        importance: '美国可降解包装材料的重要标准'
      },
      {
        id: 'gb-16716',
        title: 'GB/T 16716.1-2018 - 包装与包装废物环境基本要求',
        standardNumber: 'GB/T 16716.1-2018',
        description: '中国绿色包装的基础标准，要求减量化、可重复使用、可回收、可降解。',
        application: '绿色包装设计',
        keyPoints: ['减量化', '可重复使用', '可回收性', '可降解性', '生命周期评估'],
        importance: '中国绿色包装的基础标准'
      }
    ]
  },
  {
    category: '运输包装标准',
    icon: Truck,
    color: 'orange',
    description: '运输包装试验和危险品包装标准',
    standards: [
      {
        id: 'ista-6',
        title: 'ISTA 6 系列 - 电商包装测试程序',
        standardNumber: 'ISTA 6-Amazon, ISTA 6-FedEx',
        description: '针对电商物流特点设计的专用包装测试标准。',
        application: '电商包装',
        keyPoints: ['电商物流特点', '专用测试程序', '实际环境仿真', '平台要求'],
        importance: '针对电商物流特点设计的专用标准'
      },
      {
        id: 'un-orange-book',
        title: 'UN危险货物运输建议书',
        standardNumber: 'UN Orange Book',
        description: '全球危险品运输包装的基础法规，包装群组分级和标识要求。',
        application: '危险品运输',
        keyPoints: ['危险品分类', '包装群组', 'UN编码', '危险标签'],
        importance: '全球危险品运输包装的基础法规'
      }
    ]
  },
  {
    category: '食品包装标准',
    icon: Utensils,
    color: 'purple',
    description: '食品安全和功能性包装标准',
    standards: [
      {
        id: 'iso-15105',
        title: 'ISO 15105 系列 - 塑料薄膜气体透过性测定',
        standardNumber: 'ISO 15105-1, ISO 15105-2',
        description: '塑料薄膜阻隔性能测试，用于食品保鲜包装设计。',
        application: '食品保鲜包装',
        keyPoints: ['气体透过性', '阻隔性能', '保鲜效果', '测试方法'],
        importance: '评估包装材料阻隔性能的重要标准'
      },
      {
        id: 'astm-f1249',
        title: 'ASTM F1249-20 - 塑料薄膜水蒸气透过率测定',
        standardNumber: 'ASTM F1249-20',
        description: '包装材料阻湿性能的关键测试标准，确保产品防潮效果。',
        application: '防潮包装',
        keyPoints: ['水蒸气透过率', '阻湿性能', '防潮效果', '测试精度'],
        importance: '包装材料阻湿性能的关键测试标准'
      }
    ]
  }
]);

// 计算过滤后的标准
const filteredStandards = computed(() => {
  let filtered = packagingStandards.value;
  
  if (selectedCategory.value !== '全部') {
    filtered = filtered.filter(section => section.category === selectedCategory.value);
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.map(section => ({
      ...section,
      standards: section.standards.filter(standard => 
        standard.title.toLowerCase().includes(query) ||
        standard.description.toLowerCase().includes(query) ||
        standard.standardNumber.toLowerCase().includes(query) ||
        standard.application.toLowerCase().includes(query) ||
        standard.keyPoints.some(point => point.toLowerCase().includes(query))
      )
    })).filter(section => section.standards.length > 0);
  }
  
  return filtered;
});

// 获取颜色类
const getColorClass = (color) => {
  const colorMap = {
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    red: 'text-red-400 bg-red-400/10 border-red-400/20',
    green: 'text-green-400 bg-green-400/10 border-green-400/20',
    orange: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20'
  };
  return colorMap[color] || colorMap.blue;
};

// 切换展开状态
const toggleSection = (category) => {
  if (expandedSections.value.has(category)) {
    expandedSections.value.delete(category);
  } else {
    expandedSections.value.add(category);
  }
};

// 统计信息
const totalStandards = computed(() => 
  packagingStandards.value.reduce((sum, section) => sum + section.standards.length, 0)
);

const totalCategories = computed(() => packagingStandards.value.length);
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <!-- 页面头部 -->
    <div class="text-center mb-12">
      <div class="flex items-center justify-center gap-3 mb-4">
        <BookOpen class="h-8 w-8 text-fuchsia-400" />
        <h1 class="text-4xl md:text-5xl font-bold text-white">包装加工行业标准知识库</h1>
      </div>
      <p class="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
        涵盖国际标准(ISO/ASTM)、中国国标(GB/T)、欧美日标准的完整体系，
        包含材料、设计、色彩管理、环保、运输、食品包装等各领域标准。助您快速查找和理解相关标准要求。
      </p>
      
      <!-- 统计信息 -->
      <div class="flex justify-center gap-8 mb-8">
        <div class="text-center">
          <div class="text-2xl font-bold text-fuchsia-400">{{ totalStandards }}</div>
          <div class="text-sm text-gray-400">标准数量</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-fuchsia-400">{{ totalCategories }}</div>
          <div class="text-sm text-gray-400">标准分类</div>
        </div>
      </div>
    </div>

    <!-- 搜索和过滤 -->
    <div class="mb-8 space-y-4">
      <!-- 搜索框 -->
      <div class="relative max-w-2xl mx-auto">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="搜索标准名称、编号或关键词..." 
          class="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50"
        />
      </div>

      <!-- 分类过滤 -->
      <div class="flex flex-wrap justify-center gap-2">
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-all',
            selectedCategory === category
              ? 'bg-fuchsia-400 text-white'
              : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
          ]"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- 标准内容 -->
    <div class="space-y-8">
      <div 
        v-for="section in filteredStandards" 
        :key="section.category" 
        class="rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg overflow-hidden"
      >
        <!-- 分类头部 -->
        <div 
          class="flex items-center justify-between p-6 cursor-pointer hover:bg-white/5 transition-colors"
          @click="toggleSection(section.category)"
        >
          <div class="flex items-center gap-4">
            <div :class="['flex h-12 w-12 items-center justify-center rounded-lg border', getColorClass(section.color)]">
              <component :is="section.icon" class="h-6 w-6" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-white">{{ section.category }}</h2>
              <p class="text-sm text-gray-400">{{ section.description }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ section.standards.length }} 个标准</p>
            </div>
          </div>
          <component 
            :is="expandedSections.has(section.category) ? ChevronDown : ChevronRight" 
            class="h-5 w-5 text-gray-400"
          />
        </div>

        <!-- 标准列表 -->
        <div 
          v-if="expandedSections.has(section.category)"
          class="border-t border-white/10"
        >
          <div 
            v-for="standard in section.standards" 
            :key="standard.id"
            class="border-b border-white/5 last:border-0 p-6 hover:bg-white/5 transition-colors"
          >
            <div class="flex items-start gap-4">
              <div class="flex-1">
                <!-- 标准标题和编号 -->
                <div class="mb-3">
                  <h3 class="text-lg font-semibold text-white mb-1">{{ standard.title }}</h3>
                  <div class="flex items-center gap-2 text-sm">
                    <span class="px-2 py-1 bg-fuchsia-400/10 text-fuchsia-400 rounded">
                      {{ standard.standardNumber }}
                    </span>
                    <span class="px-2 py-1 bg-white/10 text-gray-300 rounded">
                      {{ standard.application }}
                    </span>
                  </div>
                </div>

                <!-- 标准描述 -->
                <p class="text-gray-300 mb-4">{{ standard.description }}</p>

                <!-- 关键要点 -->
                <div class="mb-4">
                  <h4 class="text-sm font-medium text-white mb-2">关键要点：</h4>
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="point in standard.keyPoints" 
                      :key="point"
                      class="px-2 py-1 text-xs bg-white/10 text-gray-300 rounded"
                    >
                      {{ point }}
                    </span>
                  </div>
                </div>

                <!-- 重要性说明 -->
                <div class="p-3 bg-blue-400/10 border border-blue-400/20 rounded-lg">
                  <p class="text-sm text-blue-300">
                    <strong>重要性：</strong>{{ standard.importance }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用指南 -->
    <div class="mt-12 p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg">
      <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <FileText class="h-5 w-5" />
        如何使用本知识库
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
        <div>
          <h3 class="font-medium text-white mb-2">🔍 快速查找</h3>
          <p>使用搜索框输入标准编号、关键词或应用场景，快速定位相关标准。</p>
        </div>
        <div>
          <h3 class="font-medium text-white mb-2">📂 分类浏览</h3>
          <p>按标准类别浏览，了解不同领域的标准体系和要求。</p>
        </div>
        <div>
          <h3 class="font-medium text-white mb-2">⚡ 重点理解</h3>
          <p>关注每个标准的关键要点和重要性说明，把握标准核心内容。</p>
        </div>
        <div>
          <h3 class="font-medium text-white mb-2">🎯 实际应用</h3>
          <p>结合应用场景选择合适的标准，确保符合相关法规要求。</p>
        </div>
      </div>
    </div>

    <!-- 免责声明 -->
    <div class="mt-8 p-4 rounded-lg border border-yellow-400/20 bg-yellow-400/10">
      <p class="text-sm text-yellow-300">
        <strong>免责声明：</strong>
        本知识库仅供参考，具体标准要求请以官方最新版本为准。在实际应用中，建议咨询相关专业机构或获取标准官方文档。
      </p>
    </div>
  </div>
</template>