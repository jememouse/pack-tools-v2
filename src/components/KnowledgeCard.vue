<script setup>
import { ref } from 'vue';
import { ChevronDown, Lightbulb, CheckCircle2 } from 'lucide-vue-next';

const props = defineProps({
  card: {
    type: Object,
    required: true,
  },
});

const open = ref(false);
const toggle = () => {
  if (!props.card.content) return;
  open.value = !open.value;
};
</script>

<template>
  <div class="group rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg transition-all hover:shadow-fuchsia-400/10 hover:bg-white/10 backdrop-blur-lg">
    <button type="button" class="w-full text-left" @click="toggle">
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
        <ChevronDown class="ml-auto h-5 w-5 text-gray-400 transition-transform" :class="{ 'rotate-180': open }" />
      </div>
    </button>

    <transition name="fade">
      <div v-if="open && card.content" class="mt-4 rounded-lg border border-white/10 bg-white/5 p-4">
        <p class="text-sm text-gray-300 leading-relaxed">{{ card.content.intro }}</p>
        <div class="mt-4 grid gap-3">
          <div v-for="(kp, idx) in card.content.keyPoints" :key="idx" class="p-3 rounded-md bg-white/5 border border-white/10">
            <div class="text-white text-sm font-medium">{{ kp.title }}</div>
            <div class="text-xs text-gray-400 mt-1 leading-relaxed">{{ kp.text }}</div>
          </div>
        </div>
        <div class="mt-4 p-3 rounded-md bg-green-500/10 border border-green-400/20">
          <div class="text-sm font-semibold text-green-300 mb-1 flex items-center gap-1">
            <CheckCircle2 class="w-4 h-4" /> 实用建议
          </div>
          <ul class="text-xs text-gray-300 space-y-1 list-disc pl-5">
            <li v-for="(tip, i) in card.content.tips" :key="i">{{ tip }}</li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
