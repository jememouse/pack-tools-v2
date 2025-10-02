<script setup>
import { ref, computed, watch } from 'vue';
import { CheckSquare, Square, Info, FileCheck, Download, Share2, RotateCcw, AlertTriangle, CheckCircle, XCircle, Clock, Printer, Image, Palette, FileText, Settings, Users, Archive } from 'lucide-vue-next';

const showKnowledge = ref(false);
const selectedTemplate = ref('packaging');
const projectName = ref('');
const checklistItems = ref([]);
const completedCount = computed(() => checklistItems.value.filter(item => item.checked).length);
const progressPercentage = computed(() => 
  checklistItems.value.length > 0 ? Math.round((completedCount.value / checklistItems.value.length) * 100) : 0
);

// 清单模板
const templates = {
  packaging: {
    name: '包装印刷清单',
    description: '适用于包装盒、标签、软包装等印刷项目',
    icon: 'FileCheck',
    categories: [
      {
        name: '文件基础检查',
        icon: 'FileText',
        color: 'blue',
        items: [
          {
            id: 'file_format',
            title: '文件格式正确',
            description: '确保文件为可印刷格式（AI/PDF/EPS/TIFF等）',
            details: '避免使用Word、PPT等办公软件格式，推荐使用PDF/X-1a标准',
            priority: 'high',
            category: 'file'
          },
          {
            id: 'file_naming',
            title: '文件命名规范',
            description: '文件名清晰标识项目、版本、日期等信息',
            details: '如：品牌名_产品名_包装盒_V1.0_20241002.pdf',
            priority: 'medium',
            category: 'file'
          },
          {
            id: 'file_backup',
            title: '原始文件备份',
            description: '保留可编辑的原始设计文件（AI/PSD等）',
            details: '用于后续修改和版本迭代，建议同时提交',
            priority: 'medium',
            category: 'file'
          }
        ]
      },
      {
        name: '尺寸与版面',
        icon: 'Settings',
        color: 'green',
        items: [
          {
            id: 'size_correct',
            title: '成品尺寸准确',
            description: '确认最终成品尺寸符合要求',
            details: '检查长宽高尺寸，确保与需求一致',
            priority: 'high',
            category: 'size'
          },
          {
            id: 'bleed_setup',
            title: '出血设置正确',
            description: '设置3-5mm出血边距',
            details: '四边均需出血，避免切边时露白',
            priority: 'high',
            category: 'size'
          },
          {
            id: 'trim_marks',
            title: '裁切线标记',
            description: '添加裁切线、折痕线等工艺标记',
            details: '使用专色或单独图层标记，便于后工艺处理',
            priority: 'high',
            category: 'size'
          },
          {
            id: 'safe_area',
            title: '安全区域检查',
            description: '重要内容避开3mm裁切安全区',
            details: '文字、Logo等关键元素需留足安全距离',
            priority: 'medium',
            category: 'size'
          }
        ]
      },
      {
        name: '色彩与印刷',
        icon: 'Palette',
        color: 'purple',
        items: [
          {
            id: 'color_mode',
            title: '颜色模式CMYK',
            description: '所有色彩元素转换为CMYK模式',
            details: 'RGB色彩在印刷中会产生色差，必须转换',
            priority: 'high',
            category: 'color'
          },
          {
            id: 'spot_colors',
            title: '专色设置正确',
            description: '专色通道设置准确，避免套印错误',
            details: '检查Pantone色号、金银色、UV上光等特殊工艺',
            priority: 'high',
            category: 'color'
          },
          {
            id: 'black_rich',
            title: '四色黑设置',
            description: '大面积黑色使用四色黑（C30M20Y20K100）',
            details: '避免单纯K100，提升黑色饱和度和印刷稳定性',
            priority: 'medium',
            category: 'color'
          },
          {
            id: 'overprint',
            title: '叠印设置检查',
            description: '检查文字和图形的叠印设置',
            details: '黑色文字通常设置叠印，避免套印不准',
            priority: 'medium',
            category: 'color'
          }
        ]
      },
      {
        name: '图像与字体',
        icon: 'Image',
        color: 'orange',
        items: [
          {
            id: 'image_resolution',
            title: '图像分辨率足够',
            description: '图像分辨率不低于300DPI',
            details: '确保印刷输出清晰，避免马赛克效果',
            priority: 'high',
            category: 'image'
          },
          {
            id: 'font_outline',
            title: '字体转曲线/嵌入',
            description: '所有字体转为曲线或嵌入字体文件',
            details: '避免因缺少字体导致文字变形或丢失',
            priority: 'high',
            category: 'image'
          },
          {
            id: 'image_link',
            title: '图像链接完整',
            description: '检查所有链接图像文件完整',
            details: '避免图像丢失或显示为低分辨率预览',
            priority: 'medium',
            category: 'image'
          },
          {
            id: 'transparent',
            title: '透明效果检查',
            description: '透明度、混合模式等特效是否正常',
            details: '复杂透明效果可能在RIP时产生意外结果',
            priority: 'medium',
            category: 'image'
          }
        ]
      },
      {
        name: '工艺与材料',
        icon: 'Printer',
        color: 'cyan',
        items: [
          {
            id: 'material_spec',
            title: '材料规格确认',
            description: '确认纸张克重、材质等符合设计要求',
            details: '检查材料是否支持设计中的印刷工艺',
            priority: 'high',
            category: 'material'
          },
          {
            id: 'process_mark',
            title: '后道工艺标记',
            description: '标记压痕、模切、烫金等工艺位置',
            details: '使用专色或独立图层标记，避免工艺冲突',
            priority: 'high',
            category: 'material'
          },
          {
            id: 'fold_structure',
            title: '折叠结构检查',
            description: '确认折叠结构和方向正确',
            details: '检查折痕位置、方向，确保成型效果',
            priority: 'medium',
            category: 'material'
          },
          {
            id: 'coating_area',
            title: '表面处理区域',
            description: '确认上光、覆膜等表面处理区域',
            details: '检查是否影响后续加工工艺',
            priority: 'medium',
            category: 'material'
          }
        ]
      },
      {
        name: '交付与协作',
        icon: 'Users',
        color: 'pink',
        items: [
          {
            id: 'client_approval',
            title: '客户最终确认',
            description: '获得客户对设计稿的最终书面确认',
            details: '保存确认邮件或签字样稿，避免后续纠纷',
            priority: 'high',
            category: 'delivery'
          },
          {
            id: 'print_proof',
            title: '打样确认',
            description: '如需要，提供数码打样或实物打样',
            details: '重要项目建议先打样确认效果',
            priority: 'medium',
            category: 'delivery'
          },
          {
            id: 'delivery_format',
            title: '交付格式规范',
            description: '按印刷厂要求提供正确格式文件',
            details: '确认PDF版本、ICC配置文件等技术要求',
            priority: 'medium',
            category: 'delivery'
          },
          {
            id: 'archive_backup',
            title: '项目文件归档',
            description: '完整保存项目相关文件和沟通记录',
            details: '便于后续修改和问题追溯',
            priority: 'low',
            category: 'delivery'
          }
        ]
      }
    ]
  },
  digital: {
    name: '数码印刷清单',
    description: '适用于小批量数码印刷项目',
    icon: 'Printer',
    categories: [
      {
        name: '文件准备',
        icon: 'FileText',
        color: 'blue',
        items: [
          {
            id: 'pdf_standard',
            title: 'PDF标准格式',
            description: '使用PDF/X-4或PDF 1.4格式',
            details: '确保数码印刷设备兼容性',
            priority: 'high',
            category: 'file'
          },
          {
            id: 'color_profile',
            title: '色彩配置文件',
            description: '嵌入或指定正确的ICC配置文件',
            details: '确保色彩管理一致性',
            priority: 'high',
            category: 'color'
          }
        ]
      }
    ]
  },
  label: {
    name: '标签印刷清单',
    description: '适用于不干胶标签、吊牌等项目',
    icon: 'Archive',
    categories: [
      {
        name: '标签规格',
        icon: 'Settings',
        color: 'green',
        items: [
          {
            id: 'label_size',
            title: '标签尺寸精确',
            description: '确认单个标签和排版尺寸',
            details: '考虑模切精度，预留适当公差',
            priority: 'high',
            category: 'size'
          },
          {
            id: 'die_cut_line',
            title: '模切线设置',
            description: '设置准确的模切刀线',
            details: '使用专色标记，线宽0.25pt',
            priority: 'high',
            category: 'size'
          }
        ]
      }
    ]
  }
};

// 初始化清单
function initializeChecklist() {
  const template = templates[selectedTemplate.value];
  checklistItems.value = [];
  
  template.categories.forEach(category => {
    category.items.forEach(item => {
      checklistItems.value.push({
        ...item,
        checked: false,
        categoryName: category.name,
        categoryIcon: category.icon,
        categoryColor: category.color
      });
    });
  });
}

// 监听模板变化
watch(selectedTemplate, () => {
  initializeChecklist();
}, { immediate: true });

// 切换检查项状态
function toggleItem(itemId) {
  const item = checklistItems.value.find(item => item.id === itemId);
  if (item) {
    item.checked = !item.checked;
  }
}

// 重置清单
function resetChecklist() {
  checklistItems.value.forEach(item => {
    item.checked = false;
  });
}

// 获取优先级显示
function getPriorityDisplay(priority) {
  const priorities = {
    high: { text: '高', color: 'text-red-400', bg: 'bg-red-500/10' },
    medium: { text: '中', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    low: { text: '低', color: 'text-green-400', bg: 'bg-green-500/10' }
  };
  return priorities[priority] || priorities.medium;
}

// 按分类分组
const groupedItems = computed(() => {
  const groups = {};
  checklistItems.value.forEach(item => {
    if (!groups[item.categoryName]) {
      groups[item.categoryName] = {
        name: item.categoryName,
        icon: item.categoryIcon,
        color: item.categoryColor,
        items: []
      };
    }
    groups[item.categoryName].items.push(item);
  });
  return groups;
});

// 分类完成统计
const categoryProgress = computed(() => {
  const progress = {};
  Object.keys(groupedItems.value).forEach(categoryName => {
    const items = groupedItems.value[categoryName].items;
    const completed = items.filter(item => item.checked).length;
    progress[categoryName] = {
      completed,
      total: items.length,
      percentage: items.length > 0 ? Math.round((completed / items.length) * 100) : 0
    };
  });
  return progress;
});

// 导出清单
function exportChecklist() {
  const template = templates[selectedTemplate.value];
  const timestamp = new Date().toLocaleString('zh-CN');
  
  let content = `印前文件自查清单\n`;
  content += `模板：${template.name}\n`;
  content += `项目名称：${projectName.value || '未命名项目'}\n`;
  content += `检查时间：${timestamp}\n`;
  content += `完成进度：${completedCount.value}/${checklistItems.value.length} (${progressPercentage.value}%)\n\n`;

  Object.keys(groupedItems.value).forEach(categoryName => {
    const group = groupedItems.value[categoryName];
    content += `【${categoryName}】\n`;
    
    group.items.forEach(item => {
      const status = item.checked ? '✅' : '❌';
      const priority = getPriorityDisplay(item.priority).text;
      content += `${status} [${priority}] ${item.title}\n`;
      content += `    ${item.description}\n`;
      if (item.details) {
        content += `    详细说明：${item.details}\n`;
      }
      content += '\n';
    });
    content += '\n';
  });

  // 创建下载
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `印前检查清单_${projectName.value || '项目'}_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 分享清单
async function shareChecklist() {
  const url = window.location.href;
  const text = `印前文件自查清单 - ${templates[selectedTemplate.value].name}`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: text,
        url: url
      });
    } catch (err) {
      copyToClipboard(url);
    }
  } else {
    copyToClipboard(url);
  }
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    // 可以添加提示
  } catch (err) {
    // 降级方案
    console.log('复制失败');
  }
}

// 印前知识库
const knowledgeItems = [
  {
    title: '什么是出血？',
    content: '出血是指设计稿边缘超出成品尺寸的部分，通常为3-5mm，用于抵消印刷和裁切过程中的误差，确保成品边缘不会出现白边。'
  },
  {
    title: 'CMYK与专色的区别',
    content: 'CMYK是四色印刷，通过青、洋红、黄、黑四种颜色叠印产生各种颜色。专色是预先调配的特定颜色，色彩更准确但成本更高。'
  },
  {
    title: '为什么要转曲线？',
    content: '转曲线是将文字转换为图形路径，避免因印刷环境缺少相应字体而导致文字显示错误或替换为其他字体。'
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
            印前文件自查清单
            <button 
              @click="showKnowledge = !showKnowledge"
              class="text-gray-400 hover:text-fuchsia-400 transition-colors"
              title="了解印前知识"
            >
              <Info class="w-6 h-6" />
            </button>
          </h1>
          <p class="mt-2 text-gray-300">
            规范印前文件检查流程，避免因文件问题导致印刷错误或返工，提升交付质量。
          </p>
        </div>
      </div>
    </div>

    <!-- 知识卡片 -->
    <div v-if="showKnowledge" class="mb-6 rounded-xl border border-blue-400/20 bg-blue-500/10 p-6 backdrop-blur-lg">
      <h3 class="text-lg font-semibold text-blue-400 mb-4">印前基础知识</h3>
      <div class="grid md:grid-cols-3 gap-4 text-gray-300 text-sm">
        <div v-for="item in knowledgeItems" :key="item.title" class="p-4 rounded-lg bg-white/5 border border-white/10">
          <h4 class="font-semibold text-white mb-2">{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <!-- 左侧：设置面板 -->
      <div class="xl:col-span-1">
        <div class="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg sticky top-6">
          <!-- 项目信息 -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-white mb-4">项目信息</h3>
            <div class="space-y-4">
              <div>
                <label class="text-sm font-medium text-gray-300 mb-2 block">项目名称</label>
                <input
                  v-model="projectName"
                  type="text"
                  placeholder="输入项目名称..."
                  class="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400 transition-colors"
                />
              </div>
            </div>
          </div>

          <!-- 模板选择 -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-white mb-4">清单模板</h3>
            <div class="space-y-2">
              <button 
                v-for="(template, key) in templates" 
                :key="key"
                @click="selectedTemplate = key"
                :class="[
                  'w-full text-left p-3 rounded-lg border transition-colors',
                  selectedTemplate === key 
                    ? 'bg-fuchsia-600 border-fuchsia-500 text-white' 
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                ]"
              >
                <div class="font-medium">{{ template.name }}</div>
                <div class="text-xs opacity-80 mt-1">{{ template.description }}</div>
              </button>
            </div>
          </div>

          <!-- 进度总览 -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-white mb-4">完成进度</h3>
            <div class="bg-white/5 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-300">整体进度</span>
                <span class="text-sm font-medium text-white">{{ completedCount }}/{{ checklistItems.length }}</span>
              </div>
              <div class="w-full bg-white/10 rounded-full h-2 mb-3">
                <div 
                  class="bg-gradient-to-r from-fuchsia-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: progressPercentage + '%' }"
                ></div>
              </div>
              <div class="text-center">
                <span :class="[
                  'text-2xl font-bold',
                  progressPercentage === 100 ? 'text-green-400' : 'text-fuchsia-400'
                ]">{{ progressPercentage }}%</span>
                <div v-if="progressPercentage === 100" class="flex items-center justify-center gap-2 mt-2 text-green-400">
                  <CheckCircle class="w-4 h-4" />
                  <span class="text-sm">检查完成</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="space-y-2">
            <button
              @click="exportChecklist"
              class="w-full flex items-center justify-center gap-2 rounded-md bg-fuchsia-600 px-4 py-2 text-sm text-white hover:bg-fuchsia-700 transition-colors"
            >
              <Download class="w-4 h-4" />
              导出清单
            </button>
            <button
              @click="shareChecklist"
              class="w-full flex items-center justify-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors"
            >
              <Share2 class="w-4 h-4" />
              分享清单
            </button>
            <button
              @click="resetChecklist"
              class="w-full flex items-center justify-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors"
            >
              <RotateCcw class="w-4 h-4" />
              重置清单
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧：清单内容 -->
      <div class="xl:col-span-3">
        <div class="space-y-6">
          <!-- 分类进度概览 -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="(group, categoryName) in groupedItems" 
              :key="categoryName"
              class="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg"
            >
              <div class="flex items-center gap-3 mb-3">
                <div :class="`text-${group.color}-400`">
                  <component :is="group.icon" class="w-5 h-5" />
                </div>
                <h3 class="font-semibold text-white">{{ group.name }}</h3>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-300">
                  {{ categoryProgress[categoryName].completed }}/{{ categoryProgress[categoryName].total }}
                </span>
                <span :class="[
                  'font-medium',
                  categoryProgress[categoryName].percentage === 100 ? 'text-green-400' : 'text-gray-300'
                ]">
                  {{ categoryProgress[categoryName].percentage }}%
                </span>
              </div>
              <div class="w-full bg-white/10 rounded-full h-1.5 mt-2">
                <div 
                  :class="`bg-${group.color}-500 h-1.5 rounded-full transition-all duration-300`"
                  :style="{ width: categoryProgress[categoryName].percentage + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <!-- 详细清单 -->
          <div v-for="(group, categoryName) in groupedItems" :key="categoryName" class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
            <div class="flex items-center gap-3 mb-6">
              <div :class="`text-${group.color}-400`">
                <component :is="group.icon" class="w-6 h-6" />
              </div>
              <h2 class="text-xl font-semibold text-white">{{ group.name }}</h2>
              <div class="flex items-center gap-2 ml-auto">
                <span class="text-sm text-gray-400">
                  {{ categoryProgress[categoryName].completed }}/{{ categoryProgress[categoryName].total }}
                </span>
                <div :class="[
                  'w-2 h-2 rounded-full',
                  categoryProgress[categoryName].percentage === 100 ? 'bg-green-400' : 'bg-gray-600'
                ]"></div>
              </div>
            </div>

            <div class="space-y-4">
              <div 
                v-for="item in group.items" 
                :key="item.id"
                :class="[
                  'rounded-lg border p-4 transition-all cursor-pointer hover:border-white/20',
                  item.checked 
                    ? 'bg-green-500/10 border-green-400/30' 
                    : 'bg-white/5 border-white/10'
                ]"
                @click="toggleItem(item.id)"
              >
                <div class="flex items-start gap-3">
                  <div class="mt-0.5">
                    <component 
                      :is="item.checked ? CheckSquare : Square" 
                      :class="[
                        'w-5 h-5 transition-colors',
                        item.checked ? 'text-green-400' : 'text-gray-400'
                      ]" 
                    />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h3 :class="[
                        'font-medium transition-colors',
                        item.checked ? 'text-green-400' : 'text-white'
                      ]">
                        {{ item.title }}
                      </h3>
                      <span :class="[
                        'px-2 py-1 rounded text-xs font-medium',
                        getPriorityDisplay(item.priority).bg,
                        getPriorityDisplay(item.priority).color
                      ]">
                        {{ getPriorityDisplay(item.priority).text }}优先级
                      </span>
                    </div>
                    <p class="text-gray-300 text-sm mb-2">{{ item.description }}</p>
                    <div v-if="item.details" class="text-gray-400 text-xs bg-white/5 rounded p-2">
                      💡 {{ item.details }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>