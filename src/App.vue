<script setup>
import { ref } from 'vue';
import { Package2, Menu, X } from 'lucide-vue-next';
import Sidebar from './components/Sidebar.vue';

const categories = ['通用基础', '设计与印前', '技术查询', '项目与协作', '内容与营销'];

const slugify = (text) => {
  return text.toString().toLowerCase().replace(/\s+/g, '-');
};

const isSidebarOpen = ref(false);
</script>

<template>
  <div class="relative min-h-screen w-full font-sans text-white">
    <div class="absolute inset-0 -z-10 h-full w-full bg-slate-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
    <div class="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>

    <div class="flex h-screen">
      <!-- Mobile Sidebar -->
      <div v-if="isSidebarOpen" class="fixed inset-0 z-50 flex lg:hidden" @click="isSidebarOpen = false">
        <div class="fixed inset-0 bg-black/60"></div>
        <div class="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900/80 backdrop-blur-lg border-r border-white/10" @click.stop>
          <div class="absolute top-0 right-0 -mr-12 pt-2">
            <button @click="isSidebarOpen = false" class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <X class="h-6 w-6 text-white" />
            </button>
          </div>
          <Sidebar :categories="categories" :slugify="slugify" />
        </div>
      </div>

      <!-- Desktop Sidebar -->
      <div class="hidden lg:flex lg:flex-shrink-0">
        <Sidebar :categories="categories" :slugify="slugify" />
      </div>

      <div class="flex flex-col w-0 flex-1 overflow-hidden">
        <header class="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/10 bg-slate-900/80 px-4 backdrop-blur-lg lg:hidden">
          <button @click="isSidebarOpen = true" class="p-2 text-gray-300">
            <Menu class="h-6 w-6" />
          </button>
          <a class="flex items-center" href="/">
            <Package2 class="h-6 w-6 text-fuchsia-400" />
            <span class="ml-2 font-bold text-white">工具矩阵</span>
          </a>
        </header>

        <main class="flex-1 relative overflow-y-auto focus:outline-none py-8 px-4 md:px-6">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}
</style>
