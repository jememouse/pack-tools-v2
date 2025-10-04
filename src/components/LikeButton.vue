<template>
  <div class="flex items-center gap-2">
    <button
      @click="handleLike"
      :class="[
        'flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200',
        'hover:scale-105 active:scale-95',
        liked 
          ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg shadow-pink-500/25' 
          : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
      ]"
      :disabled="isLoading"
    >
      <Heart 
        :class="[
          'w-4 h-4 transition-all duration-200',
          liked ? 'fill-current' : 'hover:scale-110'
        ]" 
      />
      <span class="font-mono">{{ formattedCount }}</span>
    </button>
    
    <!-- 点赞动画效果 -->
    <transition name="like-animation">
      <div
        v-if="showAnimation"
        class="absolute pointer-events-none"
        :style="animationStyle"
      >
        <Heart class="w-6 h-6 text-pink-500 fill-current animate-pulse" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Heart } from 'lucide-vue-next'
import { toggleLike, getLikeCount, isLiked } from '../services/likeService.js'

const props = defineProps({
  itemId: {
    type: String,
    required: true
  },
  initialCount: {
    type: Number,
    default: 0
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const emit = defineEmits(['like-changed'])

// 响应式数据
const liked = ref(false)
const count = ref(0)
const isLoading = ref(false)
const showAnimation = ref(false)
const animationStyle = ref({})

// 计算属性
const formattedCount = computed(() => {
  if (count.value < 1000) return count.value.toString()
  if (count.value < 10000) return `${(count.value / 1000).toFixed(1)}k`
  return `${Math.floor(count.value / 1000)}k`
})

// 初始化数据
onMounted(() => {
  loadLikeData()
})

// 监听itemId变化，重新加载数据
watch(() => props.itemId, () => {
  loadLikeData()
})

const loadLikeData = () => {
  try {
    liked.value = isLiked(props.itemId)
    count.value = getLikeCount(props.itemId) || props.initialCount
  } catch (error) {
    console.error('加载点赞数据失败:', error)
    count.value = props.initialCount
    liked.value = false
  }
}

const handleLike = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  
  try {
    // 播放点赞动画
    if (!liked.value) {
      playLikeAnimation()
    }
    
    // 切换点赞状态
    const result = toggleLike(props.itemId)
    
    liked.value = result.liked
    count.value = result.count
    
    // 触发事件
    emit('like-changed', {
      itemId: props.itemId,
      liked: result.liked,
      count: result.count
    })
    
    // 给用户反馈
    if (result.liked) {
      // 可以添加一些成功反馈，比如轻微震动
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
    }
    
  } catch (error) {
    console.error('点赞操作失败:', error)
  } finally {
    isLoading.value = false
  }
}

const playLikeAnimation = () => {
  // 简单的上升动画效果
  showAnimation.value = true
  animationStyle.value = {
    transform: 'translateY(0px)',
    opacity: '1'
  }
  
  // 动画结束后隐藏
  setTimeout(() => {
    animationStyle.value = {
      transform: 'translateY(-20px)',
      opacity: '0'
    }
  }, 10)
  
  setTimeout(() => {
    showAnimation.value = false
  }, 600)
}

// 暴露方法给父组件
defineExpose({
  refreshData: loadLikeData,
  getCurrentCount: () => count.value,
  isCurrentlyLiked: () => liked.value
})
</script>

<style scoped>
.like-animation-enter-active,
.like-animation-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.like-animation-enter-from {
  opacity: 0;
  transform: translateY(0px) scale(0.8);
}

.like-animation-enter-to {
  opacity: 1;
  transform: translateY(-20px) scale(1);
}

.like-animation-leave-from {
  opacity: 1;
  transform: translateY(-20px) scale(1);
}

.like-animation-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.8);
}
</style>