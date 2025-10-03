<template>
  <KnowledgeTemplate
    module="设计与印前规范"
    emoji="🎨"
    title="色彩模式：RGB vs CMYK"
    subtitle="为什么屏幕上看起来鲜艳的颜色，印刷后会变暗？"
  >
    <!-- 采用已有的内容逻辑（精简版） -->
    <section class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
      <h2 class="text-2xl font-semibold text-white mb-4">核心概念</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <div class="p-4 rounded-lg bg-gradient-to-br from-red-500/10 via-green-500/10 to-blue-500/10 border border-white/10">
          <h3 class="text-lg font-semibold text-white mb-2">RGB模式 - 光的世界</h3>
          <p class="text-sm text-gray-300">加色模式，色域更广，适用于屏幕显示。</p>
        </div>
        <div class="p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 via-magenta-500/10 to-yellow-500/10 border border-white/10">
          <h3 class="text-lg font-semibold text-white mb-2">CMYK模式 - 墨的世界</h3>
          <p class="text-sm text-gray-300">减色模式，适用于印刷，色域较窄。</p>
        </div>
      </div>
      <div class="mt-4 text-sm text-gray-300">
        RGB到CMYK转换时，鲜艳的颜色会被压缩到可印刷范围，导致变暗变灰，这是物理限制。
      </div>
    </section>

    <section class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
      <h2 class="text-2xl font-semibold text-white mb-4">实战指南</h2>
      <ul class="text-sm text-gray-300 space-y-1 list-disc pl-5">
        <li>从设计之初就使用CMYK模式创建文件</li>
        <li>定期切换到“CMYK预览”模式查看效果</li>
        <li>控制总墨量在280-300%以内</li>
        <li>必要时使用专色（Pantone）提高一致性</li>
      </ul>
    </section>
  </KnowledgeTemplate>
</template>

<script setup>
import KnowledgeTemplate from '@/components/KnowledgeTemplate.vue';
</script>
