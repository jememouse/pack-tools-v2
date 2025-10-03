<template>
  <div class="text-white max-w-5xl mx-auto">
    <!-- 面包屑导航 -->
    <div class="mb-6">
      <router-link to="/" class="text-gray-400 hover:text-fuchsia-400 transition-colors">首页</router-link>
      <span class="text-gray-600 mx-2">/</span>
      <span class="text-gray-300">{{ title }}</span>
    </div>

    <!-- 标题 -->
    <div class="mb-8">
      <div class="inline-block px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-400/20 text-fuchsia-400 text-sm mb-4">
        {{ module }}
      </div>
      <div class="flex items-center gap-3 mb-4">
        <span v-if="emoji" class="text-5xl">{{ emoji }}</span>
        <h1 class="text-4xl font-bold text-white">{{ title }}</h1>
      </div>
      <p class="text-xl text-gray-300">{{ subtitle }}</p>
    </div>

    <!-- 主要内容插槽 -->
    <div class="space-y-8">
      <slot></slot>
    </div>

    <!-- 返回按钮 -->
    <div class="flex justify-center pt-8">
      <router-link 
        to="/" 
        class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
        返回首页
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft } from 'lucide-vue-next';

defineProps({
  module: String,
  title: String,
  subtitle: String,
  emoji: String
});
</script>
