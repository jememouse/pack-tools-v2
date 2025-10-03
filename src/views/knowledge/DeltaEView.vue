<template>
  <KnowledgeTemplate
    module="设计与印前规范"
    emoji="👁️"
    title="什么是印刷色差(ΔE)?"
    subtitle="从抽象的数字到直观的视觉感受，读懂ΔE值的真实含义"
  >
    <section class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
      <h2 class="text-2xl font-semibold text-white mb-4">ΔE是什么？</h2>
      <p class="text-gray-300 leading-relaxed">
        ΔE（Delta E）是衡量两个颜色之间差异的数值。它让“看起来有点不一样”变得可以被度量、记录和沟通。
        数值越小，两个颜色越接近。不同应用场景对ΔE的接受范围不同。
      </p>
      <div class="grid md:grid-cols-2 gap-4 mt-4">
        <div class="rounded-lg p-4 bg-white/5 border border-white/10">
          <h3 class="text-white font-medium mb-2">肉眼感知与数值的对应</h3>
          <ul class="text-sm text-gray-300 space-y-1">
            <li>• ΔE < 1：几乎不可见，专业人士才能察觉</li>
            <li>• ΔE 1-3：仔细对比可见，一般商业印刷可接受</li>
            <li>• ΔE 3-6：明显可见，需客户确认或调整</li>
            <li>• ΔE > 6：严重色差，通常不可接受</li>
          </ul>
        </div>
        <div class="rounded-lg p-4 bg-white/5 border border-white/10">
          <h3 class="text-white font-medium mb-2">为什么会产生ΔE？</h3>
          <ul class="text-sm text-gray-300 space-y-1">
            <li>• 材质差异：铜版纸、白卡纸、牛皮纸会影响油墨呈现</li>
            <li>• 油墨状态：油墨品牌、密度、干燥速度不同</li>
            <li>• 工艺条件：网线数、网角、套印精度、温湿度</li>
            <li>• 颜色模型：RGB转CMYK时色域被压缩</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
      <h2 class="text-2xl font-semibold text-white mb-4">检测与控制</h2>
      <div class="grid md:grid-cols-3 gap-4">
        <div class="rounded-lg p-4 bg-white/5 border border-white/10">
          <h3 class="text-white font-medium mb-2">如何检测</h3>
          <p class="text-sm text-gray-300">使用色差仪（如 X-Rite），在标准光源下对比样张与目标值。</p>
        </div>
        <div class="rounded-lg p-4 bg-white/5 border border-white/10">
          <h3 class="text-white font-medium mb-2">控制标准</h3>
          <p class="text-sm text-gray-300">品牌主色建议 ΔE ≤ 2；批次一致性建议 ΔE ≤ 3。</p>
        </div>
        <div class="rounded-lg p-4 bg-white/5 border border-white/10">
          <h3 class="text-white font-medium mb-2">客户沟通</h3>
          <p class="text-sm text-gray-300">交付前提供样张与ΔE报告，减少主观争议。</p>
        </div>
      </div>
    </section>

    <section class="rounded-xl border border-green-400/20 bg-green-500/10 p-6">
      <h2 class="text-2xl font-semibold text-green-300 mb-3">实用建议</h2>
      <ul class="text-sm text-gray-200 space-y-1 list-disc pl-5">
        <li>品牌色采用专色（Pantone）+ 近似CMYK方案双方案备选</li>
        <li>打样时确认：材质+油墨+覆膜后的最终颜色</li>
        <li>批量生产前进行抽检，控制ΔE波动在可接受范围</li>
      </ul>
    </section>
  </KnowledgeTemplate>
</template>

<script setup>
import KnowledgeTemplate from '@/components/KnowledgeTemplate.vue';
</script>
