<script setup>
import { defineProps } from 'vue';
import { ArrowRight } from 'lucide-vue-next';

defineProps({
  tool: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <router-link v-if="tool.path" :to="tool.path" class="group block rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg transition-all hover:shadow-fuchsia-400/10 hover:bg-white/10 backdrop-blur-lg">
    <div class="flex items-start gap-4">
      <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-fuchsia-400/10 text-fuchsia-400">
        <component :is="tool.icon" class="h-6 w-6" />
      </div>
      <div class="flex-1">
        <h3 class="text-base font-semibold text-white">{{ tool.name }}</h3>
        <p class="mt-1 text-sm text-gray-400">{{ tool.description }}</p>
      </div>
      <ArrowRight class="ml-auto h-5 w-5 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  </router-link>
  <a v-else href="#" class="group block rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg transition-all cursor-not-allowed opacity-50 backdrop-blur-lg">
    <div class="flex items-start gap-4">
      <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-fuchsia-400/10 text-fuchsia-400">
        <component :is="tool.icon" class="h-6 w-6" />
      </div>
      <div class="flex-1">
        <h3 class="text-base font-semibold text-white">{{ tool.name }}</h3>
        <p class="mt-1 text-sm text-gray-400">{{ tool.description }}</p>
      </div>
    </div>
  </a>
</template>