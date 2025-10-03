<script setup>
import { defineProps } from 'vue';
import { ExternalLink, CheckCircle, AlertCircle, Info } from 'lucide-vue-next';

defineProps({
  standard: {
    type: Object,
    required: true,
  },
});

// 根据标准类型获取图标
const getStandardIcon = (standardNumber) => {
  if (standardNumber.includes('ISO')) return '🌍';
  if (standardNumber.includes('GB')) return '🇨🇳';
  if (standardNumber.includes('EN')) return '🇪🇺';
  if (standardNumber.includes('ASTM')) return '🇺🇸';
  if (standardNumber.includes('ISTA')) return '📦';
  if (standardNumber.includes('JIS')) return '🇯🇵';
  return '📋';
};

// 根据应用类型获取颜色
const getApplicationColor = (application) => {
  const colorMap = {
    '医疗器械包装': 'text-red-400 bg-red-400/10',
    '食品包装': 'text-green-400 bg-green-400/10',
    '运输包装': 'text-blue-400 bg-blue-400/10',
    '环保包装': 'text-emerald-400 bg-emerald-400/10',
    '危险品': 'text-orange-400 bg-orange-400/10',
    '默认': 'text-gray-400 bg-gray-400/10'
  };
  
  for (const [key, color] of Object.entries(colorMap)) {
    if (application.includes(key)) return color;
  }
  return colorMap['默认'];
};
</script>

<template>
  <div class="group relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg p-6 hover:bg-white/10 hover:border-fuchsia-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-fuchsia-400/10">
    <!-- 标准图标和编号 -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-fuchsia-400/10 text-fuchsia-400 text-2xl">
          {{ getStandardIcon(standard.standardNumber) }}
        </div>
        <div>
          <div class="text-sm font-mono text-fuchsia-400 bg-fuchsia-400/10 px-2 py-1 rounded">
            {{ standard.standardNumber }}
          </div>
        </div>
      </div>
      <div :class="['text-xs px-2 py-1 rounded-full', getApplicationColor(standard.application)]">
        {{ standard.application }}
      </div>
    </div>

    <!-- 标准标题 -->
    <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-fuchsia-400 transition-colors">
      {{ standard.title }}
    </h3>

    <!-- 标准描述 -->
    <p class="text-gray-300 text-sm mb-4 line-clamp-3">
      {{ standard.description }}
    </p>

    <!-- 关键要点 -->
    <div class="mb-4">
      <h4 class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-2">
        <CheckCircle class="h-3 w-3" />
        关键要点
      </h4>
      <div class="flex flex-wrap gap-1">
        <span 
          v-for="(point, index) in standard.keyPoints.slice(0, 3)" 
          :key="point"
          class="text-xs px-2 py-1 bg-white/10 text-gray-300 rounded-full"
        >
          {{ point }}
        </span>
        <span 
          v-if="standard.keyPoints.length > 3"
          class="text-xs px-2 py-1 bg-fuchsia-400/10 text-fuchsia-400 rounded-full"
        >
          +{{ standard.keyPoints.length - 3 }}
        </span>
      </div>
    </div>

    <!-- 重要性指示 -->
    <div class="flex items-start gap-2 p-3 bg-blue-400/10 border border-blue-400/20 rounded-lg">
      <Info class="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
      <p class="text-xs text-blue-300">
        {{ standard.importance }}
      </p>
    </div>

    <!-- 悬停效果指示器 -->
    <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <ExternalLink class="h-4 w-4 text-fuchsia-400" />
    </div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>