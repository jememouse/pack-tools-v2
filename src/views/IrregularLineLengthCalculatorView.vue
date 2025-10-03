<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- 标题区域 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">不规则线长计算器</h1>
        <p class="text-gray-300">上传SVG文件，精确计算各种图形元素的线长</p>
      </div>

      <!-- 文件上传区域 -->
      <div class="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
        <div class="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
          <input
            ref="fileInput"
            type="file"
            accept=".svg"
            @change="handleFileUpload"
            class="hidden"
          />
          <Upload class="mx-auto h-16 w-16 text-white/50 mb-4" />
          <div v-if="!selectedFile">
            <p class="text-white text-lg mb-2">点击上传SVG文件</p>
            <p class="text-gray-400 text-sm">支持.svg格式文件</p>
            <button
              @click="$refs.fileInput.click()"
              class="mt-4 px-6 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition-colors"
            >
              选择文件
            </button>
          </div>
          <div v-else class="text-white">
            <p class="text-lg mb-2">已选择: {{ selectedFile.name }}</p>
            <p class="text-sm text-gray-300 mb-4">大小: {{ formatFileSize(selectedFile.size) }}</p>
            <div class="space-x-4">
              <button
                @click="calculateLengths"
                :disabled="isCalculating"
                class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {{ isCalculating ? '计算中...' : '开始计算' }}
              </button>
              <button
                @click="clearFile"
                class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                重新选择
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 错误信息 -->
      <div v-if="errorMessage" class="bg-red-500/10 border border-red-400/50 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <AlertCircle class="h-5 w-5 text-red-400 mr-2" />
          <p class="text-red-300">{{ errorMessage }}</p>
        </div>
      </div>

      <!-- 计算结果 -->
      <div v-if="results.length > 0" class="space-y-6">
        <div class="bg-white/10 backdrop-blur-lg rounded-xl p-6">
          <h2 class="text-xl font-semibold text-white mb-4 flex items-center">
            <Calculator class="h-6 w-6 mr-2" />
            计算结果
          </h2>
          
          <!-- 总计摘要 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-white/5 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-fuchsia-400">{{ totalElements }}</div>
              <div class="text-gray-300 text-sm">图形元素</div>
            </div>
            <div class="bg-white/5 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-green-400">{{ totalLength.toFixed(2) }}</div>
              <div class="text-gray-300 text-sm">总长度 (点)</div>
            </div>
            <div class="bg-white/5 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-blue-400">{{ (totalLength * MM_PER_POINT).toFixed(2) }}</div>
              <div class="text-gray-300 text-sm">总长度 (mm)</div>
            </div>
          </div>

          <!-- 按颜色分组的详细结果 -->
          <div v-for="colorGroup in groupedResults" :key="colorGroup.color" class="mb-6">
            <h3 class="text-lg font-medium text-white mb-3 flex items-center">
              <div 
                class="w-4 h-4 rounded mr-3 border border-white/20"
                :style="{ backgroundColor: colorGroup.color === 'none' ? 'transparent' : colorGroup.color }"
              ></div>
              描边颜色: {{ colorGroup.color }}
              <span class="ml-auto text-sm text-gray-400">
                {{ colorGroup.elements.length }} 个元素
              </span>
            </h3>
            
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-white/5">
                  <tr>
                    <th class="px-4 py-3 text-left text-gray-300">图形类型</th>
                    <th class="px-4 py-3 text-right text-gray-300">长度 (点)</th>
                    <th class="px-4 py-3 text-right text-gray-300">长度 (mm)</th>
                    <th class="px-4 py-3 text-left text-gray-300">详细信息</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/10">
                  <tr v-for="(element, index) in colorGroup.elements" :key="index" class="bg-white/5 hover:bg-white/10">
                    <td class="px-4 py-3 text-white">{{ element.type }}</td>
                    <td class="px-4 py-3 text-right text-gray-300">{{ element.length.toFixed(2) }}</td>
                    <td class="px-4 py-3 text-right text-gray-300">{{ (element.length * MM_PER_POINT).toFixed(2) }}</td>
                    <td class="px-4 py-3 text-gray-400 text-xs">{{ element.details }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="mt-2 text-right text-sm text-gray-300 bg-white/5 px-4 py-2 rounded">
              颜色小计: {{ colorGroup.totalLength.toFixed(2) }} 点 / {{ (colorGroup.totalLength * MM_PER_POINT).toFixed(2) }} mm
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Upload, Calculator, AlertCircle } from 'lucide-vue-next';

// 常量
const MM_PER_POINT = 25.4 / 72;

// 响应式数据
const selectedFile = ref(null);
const isCalculating = ref(false);
const errorMessage = ref('');
const results = ref([]);

// 计算属性
const totalElements = computed(() => results.value.length);
const totalLength = computed(() => results.value.reduce((sum, item) => sum + item.length, 0));

const groupedResults = computed(() => {
  const groups = {};
  results.value.forEach(item => {
    if (!groups[item.color]) {
      groups[item.color] = {
        color: item.color,
        elements: [],
        totalLength: 0
      };
    }
    groups[item.color].elements.push(item);
    groups[item.color].totalLength += item.length;
  });
  return Object.values(groups);
});

// 工具函数
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 几何计算函数
const calculateLineLength = (x1, y1, x2, y2) => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

const calculateRectPerimeter = (width, height) => {
  return 2 * (width + height);
};

const calculateCircleCircumference = (r) => {
  return 2 * Math.PI * r;
};

const calculateEllipseCircumference = (rx, ry) => {
  const a = Math.max(rx, ry);
  const b = Math.min(rx, ry);
  if (b === 0) return 4 * a;
  const h = ((a - b) ** 2) / ((a + b) ** 2);
  return Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
};

const parsePointsString = (pointsStr) => {
  const points = pointsStr.match(/-?\d*\.?\d+/g) || [];
  const result = [];
  for (let i = 0; i < points.length; i += 2) {
    if (points[i + 1]) {
      result.push([parseFloat(points[i]), parseFloat(points[i + 1])]);
    }
  }
  return result;
};

const calculatePolylineLength = (points, closed = false) => {
  if (points.length < 2) return 0;
  let totalLength = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    totalLength += calculateLineLength(x1, y1, x2, y2);
  }
  if (closed && points.length > 2) {
    const [x1, y1] = points[points.length - 1];
    const [x2, y2] = points[0];
    totalLength += calculateLineLength(x1, y1, x2, y2);
  }
  return totalLength;
};

// 简化的路径长度计算（基本实现）
const calculatePathLength = (dString) => {
  if (!dString) return 0;
  
  // 这是一个简化的实现，仅处理基本的M/L命令
  const commands = dString.match(/[ML]\s*[-\d.,\s]+/gi);
  if (!commands || commands.length < 2) return 0;
  
  let totalLength = 0;
  let currentPoint = [0, 0];
  
  commands.forEach(cmd => {
    const type = cmd[0].toUpperCase();
    const coords = cmd.slice(1).match(/-?\d*\.?\d+/g);
    
    if (type === 'M' && coords && coords.length >= 2) {
      currentPoint = [parseFloat(coords[0]), parseFloat(coords[1])];
    } else if (type === 'L' && coords && coords.length >= 2) {
      const newPoint = [parseFloat(coords[0]), parseFloat(coords[1])];
      totalLength += calculateLineLength(currentPoint[0], currentPoint[1], newPoint[0], newPoint[1]);
      currentPoint = newPoint;
    }
  });
  
  return totalLength;
};

// SVG样式解析
const getElementStrokeColor = (element) => {
  // 直接属性
  if (element.getAttribute('stroke') && element.getAttribute('stroke') !== 'none') {
    return element.getAttribute('stroke');
  }
  
  // style属性
  const style = element.getAttribute('style');
  if (style) {
    const match = style.match(/stroke\s*:\s*([^;]+)/);
    if (match && match[1].trim() !== 'none') {
      return match[1].trim();
    }
  }
  
  return 'none';
};

// 文件处理
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type === 'image/svg+xml') {
    selectedFile.value = file;
    errorMessage.value = '';
  } else {
    errorMessage.value = '请选择有效的SVG文件';
  }
};

const clearFile = () => {
  selectedFile.value = null;
  results.value = [];
  errorMessage.value = '';
};

// 主要计算逻辑
const calculateLengths = async () => {
  if (!selectedFile.value) return;
  
  isCalculating.value = true;
  errorMessage.value = '';
  results.value = [];
  
  try {
    const text = await selectedFile.value.text();
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(text, 'image/svg+xml');
    
    if (svgDoc.querySelector('parsererror')) {
      throw new Error('SVG文件格式错误');
    }
    
    const elements = svgDoc.querySelectorAll('rect, path, line, circle, ellipse, polygon, polyline');
    const calculationResults = [];
    
    elements.forEach((element, index) => {
      const color = getElementStrokeColor(element);
      if (color === 'none') return;
      
      let length = 0;
      let details = '';
      const tagName = element.tagName.toLowerCase();
      
      try {
        switch (tagName) {
          case 'rect':
            const width = parseFloat(element.getAttribute('width') || 0);
            const height = parseFloat(element.getAttribute('height') || 0);
            length = calculateRectPerimeter(width, height);
            details = `${width} × ${height}`;
            break;
            
          case 'line':
            const x1 = parseFloat(element.getAttribute('x1') || 0);
            const y1 = parseFloat(element.getAttribute('y1') || 0);
            const x2 = parseFloat(element.getAttribute('x2') || 0);
            const y2 = parseFloat(element.getAttribute('y2') || 0);
            length = calculateLineLength(x1, y1, x2, y2);
            details = `(${x1},${y1}) → (${x2},${y2})`;
            break;
            
          case 'circle':
            const r = parseFloat(element.getAttribute('r') || 0);
            length = calculateCircleCircumference(r);
            details = `半径: ${r}`;
            break;
            
          case 'ellipse':
            const rx = parseFloat(element.getAttribute('rx') || 0);
            const ry = parseFloat(element.getAttribute('ry') || 0);
            length = calculateEllipseCircumference(rx, ry);
            details = `半径: ${rx} × ${ry}`;
            break;
            
          case 'polygon':
            const polyPoints = parsePointsString(element.getAttribute('points') || '');
            length = calculatePolylineLength(polyPoints, true);
            details = `${polyPoints.length} 个点 (封闭)`;
            break;
            
          case 'polyline':
            const linePoints = parsePointsString(element.getAttribute('points') || '');
            length = calculatePolylineLength(linePoints, false);
            details = `${linePoints.length} 个点 (开放)`;
            break;
            
          case 'path':
            const d = element.getAttribute('d') || '';
            length = calculatePathLength(d);
            details = '路径元素';
            break;
        }
        
        if (length > 0) {
          calculationResults.push({
            type: `${tagName.charAt(0).toUpperCase() + tagName.slice(1)} #${calculationResults.filter(r => r.type.startsWith(tagName.charAt(0).toUpperCase())).length + 1}`,
            length,
            color,
            details
          });
        }
      } catch (e) {
        console.warn(`计算 ${tagName} 元素时出错:`, e);
      }
    });
    
    results.value = calculationResults;
    
    if (calculationResults.length === 0) {
      errorMessage.value = '未在SVG文件中找到可计算的图形元素';
    }
    
  } catch (error) {
    errorMessage.value = `处理文件时出错: ${error.message}`;
  } finally {
    isCalculating.value = false;
  }
};
</script>