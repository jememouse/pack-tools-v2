<script setup>
import { ref, computed, watch } from 'vue';
import { Calendar, Clock, Plus, Minus, Save, Download, Copy, RefreshCw, Info, AlertTriangle, CheckCircle, FileText, Printer, Package, Truck, BarChart3 } from 'lucide-vue-next';

// 项目基本信息
const projectInfo = ref({
  name: '',
  clientName: '',
  startDate: new Date().toISOString().split('T')[0],
  projectType: 'standard',
  urgency: 'normal',
  complexity: 'medium'
});

// 项目阶段定义
const projectPhases = ref([
  {
    id: 'requirements',
    name: '需求分析与策划',
    icon: FileText,
    color: 'blue',
    tasks: [
      { name: '客户需求调研', baseDays: 1, actualDays: 1, description: '深入了解客户需求，产品特性' },
      { name: '竞品分析', baseDays: 1, actualDays: 1, description: '研究市场同类产品包装方案' },
      { name: '包装策略制定', baseDays: 2, actualDays: 2, description: '确定包装风格、材料选择等' },
      { name: '项目计划书', baseDays: 1, actualDays: 1, description: '制定详细的项目执行计划' }
    ]
  },
  {
    id: 'design',
    name: '设计开发',
    icon: Printer,
    color: 'purple',
    tasks: [
      { name: '概念设计', baseDays: 3, actualDays: 3, description: '初步设计方案和创意构思' },
      { name: '结构设计', baseDays: 2, actualDays: 2, description: '包装结构和工艺设计' },
      { name: '视觉设计', baseDays: 4, actualDays: 4, description: '平面设计、色彩搭配等' },
      { name: '设计优化', baseDays: 2, actualDays: 2, description: '根据反馈优化设计方案' },
      { name: '印前制作', baseDays: 2, actualDays: 2, description: '制作印刷文件，检查出血等' }
    ]
  },
  {
    id: 'sampling',
    name: '打样验证',
    icon: Package,
    color: 'orange',
    tasks: [
      { name: '材料确认', baseDays: 1, actualDays: 1, description: '确认最终使用的包装材料' },
      { name: '数码打样', baseDays: 1, actualDays: 1, description: '小批量数码打样验证效果' },
      { name: '实样制作', baseDays: 3, actualDays: 3, description: '制作实际尺寸的样品' },
      { name: '客户确认', baseDays: 2, actualDays: 2, description: '客户验收样品并确认修改' },
      { name: '最终调整', baseDays: 1, actualDays: 1, description: '根据客户反馈进行最终调整' }
    ]
  },
  {
    id: 'production',
    name: '生产制作',
    icon: CheckCircle,
    color: 'green',
    tasks: [
      { name: '供应商选择', baseDays: 2, actualDays: 2, description: '选择合适的印刷和制作供应商' },
      { name: '生产准备', baseDays: 1, actualDays: 1, description: '准备生产文件和工艺要求' },
      { name: '印刷制作', baseDays: 7, actualDays: 7, description: '大批量印刷生产' },
      { name: '后道加工', baseDays: 3, actualDays: 3, description: '模切、装配等后道工序' },
      { name: '质量检验', baseDays: 1, actualDays: 1, description: '成品质量检验和验收' }
    ]
  },
  {
    id: 'delivery',
    name: '交付收尾',
    icon: Truck,
    color: 'cyan',
    tasks: [
      { name: '包装发货', baseDays: 1, actualDays: 1, description: '产品包装和物流安排' },
      { name: '项目验收', baseDays: 1, actualDays: 1, description: '客户最终验收和签字确认' },
      { name: '项目总结', baseDays: 1, actualDays: 1, description: '项目总结和经验整理' }
    ]
  }
]);

// 复杂度系数
const complexityFactors = {
  simple: 0.8,
  medium: 1.0,
  complex: 1.3,
  veryComplex: 1.6
};

// 紧急程度系数
const urgencyFactors = {
  low: 1.2,
  normal: 1.0,
  high: 0.8,
  urgent: 0.6
};

// 项目类型系数
const projectTypeFactors = {
  standard: 1.0,
  premium: 1.2,
  customized: 1.4
};

// 计算调整后的天数
const calculateAdjustedDays = (baseDays) => {
  const complexityFactor = complexityFactors[projectInfo.value.complexity];
  const urgencyFactor = urgencyFactors[projectInfo.value.urgency];
  const projectTypeFactor = projectTypeFactors[projectInfo.value.projectType];
  
  return Math.ceil(baseDays * complexityFactor * urgencyFactor * projectTypeFactor);
};

// 自动调整所有任务的天数
const adjustAllTasks = () => {
  projectPhases.value.forEach(phase => {
    phase.tasks.forEach(task => {
      task.actualDays = calculateAdjustedDays(task.baseDays);
    });
  });
};

// 监听项目信息变化，自动调整天数
watch([
  () => projectInfo.value.complexity,
  () => projectInfo.value.urgency,
  () => projectInfo.value.projectType
], adjustAllTasks, { immediate: true });

// 计算总工期
const totalDays = computed(() => {
  return projectPhases.value.reduce((total, phase) => {
    return total + phase.tasks.reduce((phaseTotal, task) => phaseTotal + task.actualDays, 0);
  }, 0);
});

// 计算结束日期
const endDate = computed(() => {
  const start = new Date(projectInfo.value.startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + totalDays.value);
  return end.toISOString().split('T')[0];
});

// 计算里程碑日期
const milestones = computed(() => {
  const start = new Date(projectInfo.value.startDate);
  let currentDate = new Date(start);
  
  return projectPhases.value.map(phase => {
    const phaseDays = phase.tasks.reduce((total, task) => total + task.actualDays, 0);
    const phaseStart = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + phaseDays);
    const phaseEnd = new Date(currentDate);
    
    return {
      phaseName: phase.name,
      startDate: phaseStart.toLocaleDateString('zh-CN'),
      endDate: phaseEnd.toLocaleDateString('zh-CN'),
      duration: phaseDays,
      color: phase.color
    };
  });
});

// 生成报告文本
const generateReport = () => {
  let report = `包装项目工期估算报告\n`;
  report += `===============================\n\n`;
  report += `项目信息：\n`;
  report += `  项目名称：${projectInfo.value.name || '未命名项目'}\n`;
  report += `  客户名称：${projectInfo.value.clientName || '未填写'}\n`;
  report += `  开始日期：${projectInfo.value.startDate}\n`;
  report += `  预计完成：${endDate.value}\n`;
  report += `  总工期：${totalDays.value} 工作日\n`;
  report += `  项目类型：${getProjectTypeText(projectInfo.value.projectType)}\n`;
  report += `  复杂程度：${getComplexityText(projectInfo.value.complexity)}\n`;
  report += `  紧急程度：${getUrgencyText(projectInfo.value.urgency)}\n\n`;
  
  report += `阶段明细：\n`;
  report += `---------------------------------\n`;
  
  projectPhases.value.forEach((phase, index) => {
    const milestone = milestones.value[index];
    report += `${phase.name}：${milestone.startDate} - ${milestone.endDate} (${milestone.duration}天)\n`;
    phase.tasks.forEach(task => {
      report += `  · ${task.name}：${task.actualDays}天 - ${task.description}\n`;
    });
    report += `\n`;
  });
  
  report += `重要提醒：\n`;
  report += `---------------------------------\n`;
  report += `• 此估算基于标准工作流程，实际情况可能因具体需求而调整\n`;
  report += `• 建议在关键节点预留1-2天的缓冲时间\n`;
  report += `• 客户反馈和修改时间可能影响实际工期\n`;
  report += `• 节假日和供应商排期需要额外考虑\n\n`;
  report += `报告生成时间：${new Date().toLocaleString('zh-CN')}`;
  
  return report;
};

// 复制到剪贴板
const copyToClipboard = async () => {
  const report = generateReport();
  try {
    await navigator.clipboard.writeText(report);
    alert('工期报告已复制到剪贴板！');
  } catch (err) {
    console.error('复制失败:', err);
    alert('复制失败，请手动复制');
  }
};

// 下载报告
const downloadReport = () => {
  const report = generateReport();
  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectInfo.value.name || '包装项目'}_工期估算报告.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 重置项目
const resetProject = () => {
  if (confirm('确定要重置所有设置吗？')) {
    projectInfo.value = {
      name: '',
      clientName: '',
      startDate: new Date().toISOString().split('T')[0],
      projectType: 'standard',
      urgency: 'normal',
      complexity: 'medium'
    };
    adjustAllTasks();
  }
};

// 显示文本转换函数
const getProjectTypeText = (type) => {
  const texts = {
    standard: '标准项目',
    premium: '高端项目',
    customized: '定制项目'
  };
  return texts[type] || type;
};

const getComplexityText = (complexity) => {
  const texts = {
    simple: '简单',
    medium: '中等',
    complex: '复杂',
    veryComplex: '非常复杂'
  };
  return texts[complexity] || complexity;
};

const getUrgencyText = (urgency) => {
  const texts = {
    low: '不紧急',
    normal: '正常',
    high: '较紧急',
    urgent: '非常紧急'
  };
  return texts[urgency] || urgency;
};

// 获取颜色类
const getColorClasses = (color) => {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-400/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-400/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-400/20',
    green: 'bg-green-500/10 text-green-400 border-green-400/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-400/20'
  };
  return colors[color] || colors.blue;
};
</script>

<template>
  <div class="text-white">
    <!-- 标题区域 -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-white flex items-center gap-3">
            <Calendar class="w-8 h-8 text-fuchsia-400" />
            简易项目工期估算器
          </h1>
          <p class="mt-2 text-gray-300">
            快速估算包装项目各阶段耗时，为客户提供合理的交付预期，支持多种项目类型和复杂度调整。
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- 左侧：项目配置 -->
      <div class="xl:col-span-1">
        <div class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
          <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 class="w-5 h-5 text-fuchsia-400" />
            项目基本信息
          </h3>

          <!-- 项目名称 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-300 mb-2">项目名称</label>
            <input
              v-model="projectInfo.name"
              type="text"
              placeholder="请输入项目名称..."
              class="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400"
            />
          </div>

          <!-- 客户名称 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-300 mb-2">客户名称</label>
            <input
              v-model="projectInfo.clientName"
              type="text"
              placeholder="请输入客户名称..."
              class="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400"
            />
          </div>

          <!-- 开始日期 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-300 mb-2">项目开始日期</label>
            <input
              v-model="projectInfo.startDate"
              type="date"
              class="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400"
            />
          </div>

          <!-- 项目类型 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-300 mb-2">项目类型</label>
            <select
              v-model="projectInfo.projectType"
              class="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400"
            >
              <option value="standard" class="bg-gray-800">标准项目 (1.0x)</option>
              <option value="premium" class="bg-gray-800">高端项目 (1.2x)</option>
              <option value="customized" class="bg-gray-800">定制项目 (1.4x)</option>
            </select>
          </div>

          <!-- 复杂程度 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-300 mb-2">复杂程度</label>
            <select
              v-model="projectInfo.complexity"
              class="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400"
            >
              <option value="simple" class="bg-gray-800">简单 (0.8x)</option>
              <option value="medium" class="bg-gray-800">中等 (1.0x)</option>
              <option value="complex" class="bg-gray-800">复杂 (1.3x)</option>
              <option value="veryComplex" class="bg-gray-800">非常复杂 (1.6x)</option>
            </select>
          </div>

          <!-- 紧急程度 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-300 mb-2">紧急程度</label>
            <select
              v-model="projectInfo.urgency"
              class="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400"
            >
              <option value="low" class="bg-gray-800">不紧急 (1.2x)</option>
              <option value="normal" class="bg-gray-800">正常 (1.0x)</option>
              <option value="high" class="bg-gray-800">较紧急 (0.8x)</option>
              <option value="urgent" class="bg-gray-800">非常紧急 (0.6x)</option>
            </select>
          </div>

          <!-- 操作按钮 -->
          <div class="space-y-2">
            <button
              @click="adjustAllTasks"
              class="w-full rounded-md bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white hover:bg-fuchsia-700 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw class="w-4 h-4" />
              重新计算工期
            </button>
            <button
              @click="resetProject"
              class="w-full rounded-md bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw class="w-4 h-4" />
              重置项目
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧：工期详情 -->
      <div class="xl:col-span-2">
        <!-- 项目概览 -->
        <div class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg mb-6">
          <h3 class="text-lg font-semibold text-white mb-4">项目概览</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-fuchsia-400">{{ totalDays }}</div>
              <div class="text-sm text-gray-400">总工期 (天)</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-400">{{ projectPhases.length }}</div>
              <div class="text-sm text-gray-400">项目阶段</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-green-400">{{ projectInfo.startDate }}</div>
              <div class="text-sm text-gray-400">开始日期</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-orange-400">{{ endDate }}</div>
              <div class="text-sm text-gray-400">预计完成</div>
            </div>
          </div>
        </div>

        <!-- 阶段明细 -->
        <div class="space-y-4 mb-6">
          <div
            v-for="(phase, phaseIndex) in projectPhases"
            :key="phase.id"
            class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <component :is="phase.icon" class="w-6 h-6 text-fuchsia-400" />
                <h4 class="text-lg font-semibold text-white">{{ phase.name }}</h4>
                <span :class="['px-3 py-1 rounded-full text-xs font-medium border', getColorClasses(phase.color)]">
                  {{ milestones[phaseIndex]?.duration || 0 }} 天
                </span>
              </div>
              <div class="text-sm text-gray-400">
                {{ milestones[phaseIndex]?.startDate }} - {{ milestones[phaseIndex]?.endDate }}
              </div>
            </div>

            <div class="grid gap-3">
              <div
                v-for="task in phase.tasks"
                :key="task.name"
                class="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div class="flex-1">
                  <div class="flex items-center gap-3">
                    <span class="text-white font-medium">{{ task.name }}</span>
                    <div class="flex items-center gap-1">
                      <input
                        v-model.number="task.actualDays"
                        type="number"
                        min="1"
                        max="30"
                        class="w-16 text-center rounded border border-white/20 bg-white/5 p-1 text-white focus:border-fuchsia-400 focus:outline-none"
                      />
                      <span class="text-gray-400 text-sm">天</span>
                    </div>
                  </div>
                  <div class="text-sm text-gray-400 mt-1">{{ task.description }}</div>
                </div>
                <div class="flex items-center gap-2 ml-4">
                  <button
                    @click="task.actualDays = Math.max(1, task.actualDays - 1)"
                    class="text-gray-400 hover:text-white transition-colors"
                  >
                    <Minus class="w-4 h-4" />
                  </button>
                  <button
                    @click="task.actualDays += 1"
                    class="text-gray-400 hover:text-white transition-colors"
                  >
                    <Plus class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮区域 -->
        <div class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
          <h3 class="text-lg font-semibold text-white mb-4">生成报告</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              @click="copyToClipboard"
              class="rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Copy class="w-4 h-4" />
              复制报告
            </button>
            <button
              @click="downloadReport"
              class="rounded-md bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download class="w-4 h-4" />
              下载报告
            </button>
            <button
              @click="window.print()"
              class="rounded-md bg-purple-600 px-4 py-3 text-sm font-medium text-white hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Printer class="w-4 h-4" />
              打印报告
            </button>
          </div>

          <!-- 温馨提示 -->
          <div class="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-400/20">
            <div class="flex items-start gap-3">
              <AlertTriangle class="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <div class="font-medium text-yellow-400 mb-1">温馨提示</div>
                <ul class="text-sm text-gray-300 space-y-1">
                  <li>• 此工期估算基于标准包装项目流程，实际情况可能因具体需求调整</li>
                  <li>• 建议在关键节点预留1-2天缓冲时间，应对突发情况</li>
                  <li>• 客户反馈和修改环节可能影响实际工期</li>
                  <li>• 节假日和供应商排期需要额外考虑</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 打印样式 */
@media print {
  .rounded-xl, .backdrop-blur-lg {
    background: white !important;
    color: black !important;
    border: 1px solid #ccc !important;
  }
  
  .text-white {
    color: black !important;
  }
  
  .text-gray-300, .text-gray-400 {
    color: #666 !important;
  }
  
  button {
    display: none !important;
  }
}
</style>