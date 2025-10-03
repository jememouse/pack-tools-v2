<template>
  <KnowledgeTemplate
    module="材料与技术基础"
    emoji="📄"
    title="克重(gsm)与厚度(pt/mm)"
    subtitle="纸张的两个关键参数，影响手感、成本和印刷效果"
  >
    <section class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
      <h2 class="text-2xl font-semibold text-white mb-4">克重与厚度的关系</h2>
      <p class="text-gray-300 leading-relaxed mb-4">
        克重（g/m²）是单位面积的重量，厚度（mm或pt）是纸张的物理厚度。两者相关但不等同——
        同样克重的纸，材质不同，厚度可能不同。
      </p>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
          <div class="text-2xl font-bold text-blue-400">80gsm</div>
          <div class="text-sm text-gray-300 mt-1">普通复印纸</div>
          <div class="text-xs text-gray-400 mt-1">薄，透光</div>
        </div>
        <div class="p-4 rounded-lg bg-purple-500/10 border border-purple-400/20">
          <div class="text-2xl font-bold text-purple-400">250gsm</div>
          <div class="text-sm text-gray-300 mt-1">铜版纸/白卡</div>
          <div class="text-xs text-gray-400 mt-1">名片标准</div>
        </div>
        <div class="p-4 rounded-lg bg-green-500/10 border border-green-400/20">
          <div class="text-2xl font-bold text-green-400">350gsm</div>
          <div class="text-sm text-gray-300 mt-1">白卡纸</div>
          <div class="text-xs text-gray-400 mt-1">高档包装盒</div>
        </div>
        <div class="p-4 rounded-lg bg-orange-500/10 border border-orange-400/20">
          <div class="text-2xl font-bold text-orange-400">600gsm+</div>
          <div class="text-sm text-gray-300 mt-1">灰板纸</div>
          <div class="text-xs text-gray-400 mt-1">精装书封面</div>
        </div>
      </div>
    </section>

    <section class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
      <h2 class="text-2xl font-semibold text-white mb-4">厚度估算</h2>
      <div class="p-4 rounded-lg bg-fuchsia-500/10 border border-fuchsia-400/20 mb-4">
        <div class="text-white font-medium mb-2">简易计算公式</div>
        <div class="text-sm text-gray-300">
          厚度(mm) ≈ 克重(gsm) ÷ 纸张密度
        </div>
        <div class="text-xs text-gray-400 mt-2">
          白卡纸密度约800，250gsm白卡 ≈ 0.31mm<br/>
          实际厚度受材质、压制工艺影响，以实测为准
        </div>
      </div>
      <div class="text-sm text-gray-300">
        <p class="mb-2"><strong>为什么需要了解厚度？</strong></p>
        <ul class="list-disc pl-5 space-y-1">
          <li>盒型设计：需计算折痕、卡槽的精确尺寸</li>
          <li>多页印刷：书籍厚度影响书脊宽度设计</li>
          <li>物流成本：总体积影响运费核算</li>
        </ul>
      </div>
    </section>

    <section class="rounded-xl border border-green-400/20 bg-green-500/10 p-6">
      <h2 class="text-2xl font-semibold text-green-300 mb-3">选材建议</h2>
      <ul class="text-sm text-gray-200 space-y-1 list-disc pl-5">
        <li>名片：250-300gsm，太薄显得廉价</li>
        <li>手提袋：300-350gsm白卡+覆膜增强强度</li>
        <li>彩盒外包装：350-400gsm灰底白板纸</li>
        <li>向印刷厂索要纸样，实际触摸比数据更直观</li>
      </ul>
    </section>
  </KnowledgeTemplate>
</template>

<script setup>
import KnowledgeTemplate from '@/components/KnowledgeTemplate.vue';
</script>
