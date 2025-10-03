<script setup>
import { defineProps } from 'vue';
import { ArrowRight, Lightbulb } from 'lucide-vue-next';

defineProps({
  card: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <router-link :to="card.path" class="group block rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg transition-all hover:shadow-fuchsia-400/10 hover:bg-white/10 backdrop-blur-lg h-full">
    <div class="flex flex-col h-full">
      <div class="flex items-start gap-4">
        <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-fuchsia-400/10 text-fuchsia-400">
          <span class="text-xl" v-if="card.emoji">{{ card.emoji }}</span>
          <Lightbulb v-else class="h-6 w-6" />
        </div>
        <div class="flex-1">
          <p class="text-sm font-semibold text-fuchsia-400">{{ card.module }}</p>
          <h3 class="mt-1 text-base font-semibold text-white">{{ card.title }}</h3>
          <p class="mt-2 text-sm text-gray-400">{{ card.description }}</p>
        </div>
      </div>
      <div class="mt-4 flex items-center text-sm font-medium text-gray-400 group-hover:text-fuchsia-400">
        <span>查看详情</span>
        <ArrowRight class="ml-2 h-4 w-4" />
      </div>
    </div>
  </router-link>
</template>
