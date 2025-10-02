<template>
  <div class="color-wheel-container">
    <svg
      :width="size"
      :height="size"
      class="color-wheel"
      @click="handleClick"
    >
      <!-- HSL Color Wheel -->
      <defs>
        <radialGradient id="saturation-gradient">
          <stop offset="0%" style="stop-color:white;stop-opacity:1" />
          <stop offset="100%" style="stop-color:white;stop-opacity:0" />
        </radialGradient>
      </defs>
      
      <!-- Create the color wheel using multiple segments -->
      <g v-for="i in segments" :key="i">
        <path
          :d="createSegmentPath(i)"
          :fill="getSegmentColor(i)"
          stroke="none"
        />
      </g>
      
      <!-- Saturation overlay -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="url(#saturation-gradient)"
      />
      
      <!-- Current color indicator -->
      <circle
        :cx="currentX"
        :cy="currentY"
        r="8"
        fill="white"
        stroke="#333"
        stroke-width="2"
        class="color-indicator"
      />
    </svg>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  hue: {
    type: Number,
    default: 0,
    validator: value => value >= 0 && value <= 360
  },
  saturation: {
    type: Number,
    default: 100,
    validator: value => value >= 0 && value <= 100
  },
  lightness: {
    type: Number,
    default: 50
  },
  size: {
    type: Number,
    default: 200
  }
});

const emit = defineEmits(['update:hue', 'update:saturation']);

const segments = 360;
const center = computed(() => props.size / 2);
const radius = computed(() => props.size / 2 - 10);

const currentX = computed(() => {
  const angle = (props.hue * Math.PI) / 180;
  const distance = (props.saturation / 100) * radius.value;
  return center.value + Math.cos(angle - Math.PI / 2) * distance;
});

const currentY = computed(() => {
  const angle = (props.hue * Math.PI) / 180;
  const distance = (props.saturation / 100) * radius.value;
  return center.value + Math.sin(angle - Math.PI / 2) * distance;
});

const createSegmentPath = (segment) => {
  const startAngle = ((segment - 1) / segments) * 2 * Math.PI - Math.PI / 2;
  const endAngle = (segment / segments) * 2 * Math.PI - Math.PI / 2;
  
  const x1 = center.value + Math.cos(startAngle) * radius.value;
  const y1 = center.value + Math.sin(startAngle) * radius.value;
  const x2 = center.value + Math.cos(endAngle) * radius.value;
  const y2 = center.value + Math.sin(endAngle) * radius.value;
  
  return `M ${center.value} ${center.value} L ${x1} ${y1} A ${radius.value} ${radius.value} 0 0 1 ${x2} ${y2} Z`;
};

const getSegmentColor = (segment) => {
  const hue = ((segment - 1) / segments) * 360;
  return `hsl(${hue}, 100%, 50%)`;
};

const handleClick = (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.clientX - rect.left - center.value;
  const y = event.clientY - rect.top - center.value;
  
  const angle = Math.atan2(y, x) + Math.PI / 2;
  const distance = Math.sqrt(x * x + y * y);
  
  let hue = (angle * 180) / Math.PI;
  if (hue < 0) hue += 360;
  
  const saturation = Math.min(100, (distance / radius.value) * 100);
  
  emit('update:hue', Math.round(hue));
  emit('update:saturation', Math.round(saturation));
};
</script>

<style scoped>
.color-wheel-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.color-wheel {
  cursor: crosshair;
  border-radius: 50%;
}

.color-indicator {
  cursor: pointer;
  transition: all 0.1s ease;
}

.color-indicator:hover {
  r: 10;
}
</style>