<template>
  <KnowledgeTemplate
    module="设计与印前规范"
    emoji="📏"
    title="理解出血(Bleed)"
    subtitle="一个3mm的小细节，决定了你的设计是否专业"
  >
    <section class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
      <h2 class="text-2xl font-semibold text-white mb-4">什么是出血？</h2>
      <p class="text-gray-300 leading-relaxed mb-4">
        出血是印刷品设计稿超出成品尺寸的部分，用于抵消裁切误差。如果不设置出血，裁切后边缘可能露出白边，严重影响美观。
      </p>
      <div class="grid md:grid-cols-2 gap-6">
        <div class="rounded-lg p-4 bg-orange-500/10 border border-orange-400/20">
          <h3 class="text-white font-medium mb-2">❌ 没有出血</h3>
          <p class="text-sm text-gray-300">设计刚好卡在成品线，裁切误差±1-2mm会导致边缘露白</p>
        </div>
        <div class="rounded-lg p-4 bg-green-500/10 border border-green-400/20">
          <h3 class="text-white font-medium mb-2">✅ 正确出血</h3>
          <p class="text-sm text-gray-300">底色延伸到出血线（+3mm），确保裁切到哪里都有完整画面</p>
        </div>
      </div>
    </section>

    <section class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
      <h2 class="text-2xl font-semibold text-white mb-4">标准尺寸设置</h2>
      <div class="space-y-4">
        <div class="p-4 rounded-lg bg-white/5 border border-white/10">
          <h3 class="text-fuchsia-400 font-medium mb-2">名片示例</h3>
          <div class="text-sm text-gray-300 space-y-1">
            <p>• 成品尺寸：90mm × 54mm</p>
            <p>• 设计尺寸（含出血）：96mm × 60mm（四边各+3mm）</p>
            <p>• 安全区域：84mm × 48mm（内缩3mm，重要内容保持在此区域）</p>
          </div>
        </div>
        <div class="p-4 rounded-lg bg-white/5 border border-white/10">
          <h3 class="text-fuchsia-400 font-medium mb-2">A4宣传单</h3>
          <div class="text-sm text-gray-300 space-y-1">
            <p>• 成品尺寸：210mm × 297mm</p>
            <p>• 设计尺寸（含出血）：216mm × 303mm</p>
            <p>• 特殊工艺（如骑马钉）可能需要5mm出血</p>
          </div>
        </div>
      </div>
    </section>

    <section class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
      <h2 class="text-2xl font-semibold text-white mb-4">常见错误与解决</h2>
      <div class="space-y-3">
        <div class="p-4 rounded-lg bg-red-500/10 border border-red-400/20">
          <h3 class="text-red-400 font-medium mb-1">错误：黑色边框卡在裁切线</h3>
          <p class="text-sm text-gray-300">即使出血正确，边框也会因裁切误差显得不齐整。建议去掉边框或将边框内移3mm。</p>
        </div>
        <div class="p-4 rounded-lg bg-red-500/10 border border-red-400/20">
          <h3 class="text-red-400 font-medium mb-1">错误：重要文字距离边缘太近</h3>
          <p class="text-sm text-gray-300">文字、Logo等重要元素应距离裁切线至少3mm，防止被误切。</p>
        </div>
        <div class="p-4 rounded-lg bg-red-500/10 border border-red-400/20">
          <h3 class="text-red-400 font-medium mb-1">错误：导出PDF时未包含出血</h3>
          <p class="text-sm text-gray-300">导出时必须选择"包含出血"或"出血线"选项，否则印刷厂收到的是裁切后尺寸。</p>
        </div>
      </div>
    </section>

    <section class="rounded-xl border border-green-400/20 bg-green-500/10 p-6">
      <h2 class="text-2xl font-semibold text-green-300 mb-3">检查清单</h2>
      <ul class="text-sm text-gray-200 space-y-1 list-disc pl-5">
        <li>底色和底图已延伸到出血线（成品外3mm）</li>
        <li>重要内容在安全区域内（成品内3mm）</li>
        <li>文件尺寸 = 成品尺寸 + 6mm（上下左右各3mm）</li>
        <li>导出PDF时勾选"包含出血"</li>
        <li>与印刷厂确认是否需要裁切线标记</li>
      </ul>
    </section>
  </KnowledgeTemplate>
</template>

<script setup>
import KnowledgeTemplate from '@/components/KnowledgeTemplate.vue';
</script>
