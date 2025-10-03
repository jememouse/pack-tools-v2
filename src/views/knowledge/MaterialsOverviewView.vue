<template>
  <KnowledgeTemplate
    module="材料与技术基础"
    emoji="📦"
    title="核心包装材料简介"
    subtitle="白卡、牛皮、瓦楞……选对材料等于成功了一半"
  >
    <section class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
      <div class="grid md:grid-cols-2 gap-6">
        <div class="p-4 rounded-lg bg-white/5 border border-white/10">
          <h3 class="text-white font-semibold text-lg mb-2">🎴 白卡纸</h3>
          <p class="text-sm text-gray-300 mb-3">
            洁白挺括，印刷效果最佳，适合化妆品、电子产品等高端包装。
            成本较高，但质感最好。
          </p>
          <div class="text-xs text-gray-400">
            <p>• 常用克重：250-400gsm</p>
            <p>• 工艺适配：烫金、UV、击凸效果好</p>
            <p>• 价格：中高档</p>
          </div>
        </div>

        <div class="p-4 rounded-lg bg-white/5 border border-white/10">
          <h3 class="text-white font-semibold text-lg mb-2">🌾 牛皮纸</h3>
          <p class="text-sm text-gray-300 mb-3">
            天然棕色，韧性强，展现原生态和环保理念。适合手工食品、文创产品。
          </p>
          <div class="text-xs text-gray-400">
            <p>• 常用克重：120-300gsm</p>
            <p>• 特点：可降解，环保形象好</p>
            <p>• 价格：经济实惠</p>
          </div>
        </div>

        <div class="p-4 rounded-lg bg-white/5 border border-white/10">
          <h3 class="text-white font-semibold text-lg mb-2">📦 瓦楞纸板</h3>
          <p class="text-sm text-gray-300 mb-3">
            缓冲保护性强，运输包装必备。不同楞型适用不同场景。
          </p>
          <div class="text-xs text-gray-400">
            <p>• E楞（1-2mm）：精品盒、轻薄件</p>
            <p>• B楞（3mm）：常规快递箱</p>
            <p>• A/C楞（4-5mm）：重物、长途运输</p>
          </div>
        </div>

        <div class="p-4 rounded-lg bg-white/5 border border-white/10">
          <h3 class="text-white font-semibold text-lg mb-2">🔍 PET / BOPP</h3>
          <p class="text-sm text-gray-300 mb-3">
            透明柔性材料。PET可印刷贴标，BOPP用于覆膜提升光泽和防水性。
          </p>
          <div class="text-xs text-gray-400">
            <p>• 应用：食品包装、日用品标签</p>
            <p>• 特点：防水、透明、耐撕</p>
            <p>• 价格：按厚度和工艺浮动</p>
          </div>
        </div>
      </div>
    </section>

    <section class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
      <h2 class="text-2xl font-semibold text-white mb-4">材料选择决策树</h2>
      <div class="space-y-3 text-sm text-gray-300">
        <div class="p-3 rounded-lg bg-fuchsia-500/10 border border-fuchsia-400/20">
          <strong>追求高档质感？</strong> → 白卡纸 + 烫金/UV/击凸
        </div>
        <div class="p-3 rounded-lg bg-green-500/10 border border-green-400/20">
          <strong>强调环保理念？</strong> → 牛皮纸 + 水性印刷 + FSC认证
        </div>
        <div class="p-3 rounded-lg bg-blue-500/10 border border-blue-400/20">
          <strong>需要运输保护？</strong> → 瓦楞纸板 + 缓冲材料
        </div>
        <div class="p-3 rounded-lg bg-orange-500/10 border border-orange-400/20">
          <strong>成本敏感？</strong> → 铜版纸或普通白卡，减少工艺
        </div>
      </div>
    </section>

    <section class="rounded-xl border border-green-400/20 bg-green-500/10 p-6">
      <h2 class="text-2xl font-semibold text-green-300 mb-3">选材提示</h2>
      <ul class="text-sm text-gray-200 space-y-1 list-disc pl-5">
        <li>材料成本常占包装总成本的40-60%，是控本的关键</li>
        <li>向供应商索要纸样并实际触摸，数据不能完全代替手感</li>
        <li>考虑后道工艺兼容性：覆膜、烫金等需要纸张配合</li>
        <li>环保趋势下，可降解材料（如牛皮纸）正成为主流</li>
      </ul>
    </section>
  </KnowledgeTemplate>
</template>

<script setup>
import KnowledgeTemplate from '@/components/KnowledgeTemplate.vue';
</script>
