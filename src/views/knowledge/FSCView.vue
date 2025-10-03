<template>
  <KnowledgeTemplate
    module="行业标准与规范速查"
    emoji="🌳"
    title="FSC 森林认证标志"
    subtitle="包装上这个小绿标，代表的是企业的环保责任"
  >
    <section class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
      <h2 class="text-2xl font-semibold text-white mb-4">什么是FSC？</h2>
      <p class="text-gray-300 leading-relaxed">
        FSC（Forest Stewardship Council，森林管理委员会）是全球权威的森林可持续认证体系。
        贴上FSC标志的包装，意味着原材料来自负责任管理的森林或回收渠道。
      </p>
    </section>

    <section class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
      <h2 class="text-2xl font-semibold text-white mb-4">三种标签类型</h2>
      <div class="grid md:grid-cols-3 gap-4">
        <div class="p-4 rounded-lg bg-white/5 border border-white/10">
          <h3 class="text-green-400 font-medium mb-2">FSC 100%</h3>
          <p class="text-sm text-gray-300">产品100%来自FSC认证森林，标准最严格，常用于高端品牌和出口产品。</p>
        </div>
        <div class="p-4 rounded-lg bg-white/5 border border-white/10">
          <h3 class="text-green-400 font-medium mb-2">FSC Mix</h3>
          <p class="text-sm text-gray-300">混合认证材料，≥70%来自FSC认证森林，其余为可控来源。市场上最常见，性价比高。</p>
        </div>
        <div class="p-4 rounded-lg bg-white/5 border border-white/10">
          <h3 class="text-green-400 font-medium mb-2">FSC Recycled</h3>
          <p class="text-sm text-gray-300">100%使用回收材料。适合强调循环经济的品牌，但纸张质感略逊于原生纸。</p>
        </div>
      </div>
    </section>

    <section class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
      <h2 class="text-2xl font-semibold text-white mb-4">标识使用规范</h2>
      <ul class="text-sm text-gray-300 space-y-1 list-disc pl-5">
        <li>印刷前必须向FSC申请许可证号（License Code）</li>
        <li>标志周围需保留足够留白，不可变形或修改颜色</li>
        <li>完整示例：FSC® C123456（含编号）</li>
        <li>出口欧美市场建议优先使用FSC认证纸张</li>
      </ul>
    </section>

    <section class="rounded-xl border border-green-400/20 bg-green-500/10 p-6">
      <h2 class="text-2xl font-semibold text-green-300 mb-3">成本与价值</h2>
      <p class="text-sm text-gray-200">
        FSC认证通常会增加5-15%的材料成本，但能显著提升品牌形象与国际市场接受度，
        特别是环保敏感型行业（食品、母婴、个人护理）。
      </p>
    </section>
  </KnowledgeTemplate>
</template>

<script setup>
import KnowledgeTemplate from '@/components/KnowledgeTemplate.vue';
</script>
