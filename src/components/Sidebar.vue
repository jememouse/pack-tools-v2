<script setup>
import { defineProps } from 'vue';
import { Package2 } from 'lucide-vue-next';

const props = defineProps({
  categories: Array,
  slugify: Function,
});

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) {
    // 找到主内容滚动容器
    const mainContainer = document.querySelector('main');
    if (mainContainer) {
      // 计算元素相对于容器的位置
      const elementTop = el.offsetTop;
      // 滚动到目标位置，考虑 scroll-mt-24 的偏移（约96px）
      mainContainer.scrollTo({
        top: elementTop - 100, // 减去一些偏移量确保标题可见
        behavior: 'smooth'
      });
    } else {
      // 备用方案
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};
</script>

<template>
  <aside class="w-64 flex-shrink-0 border-r border-white/10 bg-slate-900/80 p-6 backdrop-blur-lg">
    <div class="flex items-center mb-8">
      <a class="flex items-center" href="/">
        <Package2 class="h-8 w-8 text-fuchsia-400" />
        <span class="ml-3 text-xl font-bold text-white">工具矩阵</span>
      </a>
    </div>
    <nav class="space-y-6">
      <div>
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">主导航</h3>
        <ul class="space-y-1">
          <li>
            <a href="/" class="block rounded-md px-3 py-2 text-sm font-medium text-white bg-white/10">工具</a>
          </li>
          <li>
            <a href="#knowledge-base" @click.prevent="scrollTo('knowledge-base')" class="block rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5">知识库</a>
          </li>
          <li>
            <router-link to="/knowledge/packaging-standards" class="block rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">📚 包装标准库</router-link>
          </li>
        </ul>
      </div>
      <div>
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">本页导航</h3>
        <ul class="space-y-1">
          <li v-for="category in categories" :key="category">
            <a :href="'#' + slugify(category)" @click.prevent="scrollTo(slugify(category))" class="block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-white/5">{{ category }}</a>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>
