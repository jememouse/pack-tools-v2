<template>
  <div class="text-white">
    <!-- 页面头部 -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-white flex items-center gap-3">
            <QrCode class="w-8 h-8 text-fuchsia-400" />
            包装专用二维码生成器
            <button 
              @click="showHelp = !showHelp" 
              class="text-gray-400 hover:text-fuchsia-400 transition-colors"
              title="使用说明"
            >
              <Info class="w-6 h-6" />
            </button>
          </h1>
          <p class="mt-2 text-gray-300">
            快速生成高分辨率、适合印刷的二维码，支持多种格式和尺寸定制。
          </p>
        </div>
        <div class="flex items-center gap-4">
          <!-- 点赞组件 -->
          <LikeButton 
            item-id="qr-code-generator"
            :initial-count="128"
            @like-changed="handleLikeChanged"
          />
        </div>
      </div>
    </div>

    <!-- 使用说明 -->
    <div v-if="showHelp" class="mb-6 rounded-xl border border-blue-400/20 bg-blue-500/10 p-4 backdrop-blur-lg">
      <h3 class="text-lg font-semibold text-blue-400 mb-2">二维码印刷要点</h3>
      <div class="text-gray-300 text-sm leading-relaxed space-y-2">
        <p>• <strong>分辨率：</strong>推荐300DPI以上，确保印刷清晰度</p>
        <p>• <strong>容错等级：</strong>包装建议选择M或Q级别，平衡容量与可靠性</p>
        <p>• <strong>留白区域：</strong>二维码周围需要保留至少4个模块宽度的空白</p>
        <p>• <strong>最小尺寸：</strong>印刷时建议不小于1cm×1cm，确保可扫描性</p>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- 左侧输入区域 -->
      <div class="xl:col-span-1">
        <div class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
          <h2 class="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Settings class="w-5 h-5" />
            二维码设置
          </h2>

          <div class="space-y-6">
            <!-- 内容输入 -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                内容 <span class="text-red-400">*</span>
              </label>
              <div class="relative">
                <textarea
                  v-model="qrConfig.text"
                  @input="updateQRCode"
                  placeholder="输入要生成二维码的内容，如网址、文本等..."
                  rows="4"
                  class="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none focus:ring-1 focus:ring-fuchsia-400"
                />
                <div class="absolute bottom-2 right-2 text-xs text-gray-400">
                  {{ qrConfig.text.length }}/2953
                </div>
              </div>
              <p class="text-xs text-gray-400 mt-1">支持网址、文本、联系方式等内容</p>
            </div>

            <!-- 快速模板 -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">快速模板</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="template in templates"
                  :key="template.name"
                  @click="useTemplate(template)"
                  class="text-left p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div class="text-sm font-medium text-white">{{ template.name }}</div>
                  <div class="text-xs text-gray-400">{{ template.description }}</div>
                </button>
              </div>
            </div>

            <!-- 尺寸设置 -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">输出尺寸</label>
              <div class="grid grid-cols-2 gap-2">
                <select
                  v-model="qrConfig.size"
                  @change="updateQRCode"
                  class="rounded-md border border-white/10 bg-white/5 p-2 text-white text-sm"
                >
                  <option v-for="size in sizes" :key="size.value" :value="size.value">
                    {{ size.label }}
                  </option>
                </select>
                <select
                  v-model="qrConfig.format"
                  @change="updateQRCode"
                  class="rounded-md border border-white/10 bg-white/5 p-2 text-white text-sm"
                >
                  <option value="png">PNG格式</option>
                  <option value="svg">SVG矢量</option>
                </select>
              </div>
            </div>

            <!-- 容错等级 -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">容错等级</label>
              <select
                v-model="qrConfig.errorCorrectionLevel"
                @change="updateQRCode"
                class="w-full rounded-md border border-white/10 bg-white/5 p-2 text-white"
              >
                <option value="L">L级 - 7% (最小码，最大容量)</option>
                <option value="M">M级 - 15% (推荐印刷)</option>
                <option value="Q">Q级 - 25% (高可靠性)</option>
                <option value="H">H级 - 30% (最高容错)</option>
              </select>
            </div>

            <!-- 颜色设置 -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">前景色</label>
                <div class="flex gap-2">
                  <input
                    v-model="qrConfig.color.dark"
                    @input="updateQRCode"
                    type="color"
                    class="w-10 h-10 rounded border border-white/10"
                  />
                  <input
                    v-model="qrConfig.color.dark"
                    @input="updateQRCode"
                    type="text"
                    class="flex-1 rounded-md border border-white/10 bg-white/5 p-2 text-white text-sm"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">背景色</label>
                <div class="flex gap-2">
                  <input
                    v-model="qrConfig.color.light"
                    @input="updateQRCode"
                    type="color"
                    class="w-10 h-10 rounded border border-white/10"
                  />
                  <input
                    v-model="qrConfig.color.light"
                    @input="updateQRCode"
                    type="text"
                    class="flex-1 rounded-md border border-white/10 bg-white/5 p-2 text-white text-sm"
                  />
                </div>
              </div>
            </div>

            <!-- 生成按钮 -->
            <div class="flex gap-2 pt-4">
              <button
                @click="updateQRCode"
                :disabled="!qrConfig.text"
                class="flex-1 rounded-md bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white hover:bg-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw class="w-4 h-4" />
                生成二维码
              </button>
              <button
                @click="resetConfig"
                class="rounded-md bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors"
              >
                <RotateCcw class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- 历史记录 -->
        <div v-if="history.length > 0" class="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg">
          <h3 class="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Clock class="w-4 h-4" />
            最近生成
          </h3>
          <div class="space-y-2 max-h-32 overflow-y-auto">
            <div 
              v-for="item in history.slice(0, 3)" 
              :key="item.id"
              class="text-xs text-gray-400 p-2 rounded bg-white/5 hover:bg-white/10 cursor-pointer"
              @click="loadFromHistory(item)"
            >
              <div class="text-white truncate">{{ item.text.substring(0, 30) }}...</div>
              <div class="flex justify-between mt-1">
                <span>{{ item.size }}px</span>
                <span>{{ item.timestamp }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧预览和下载区域 -->
      <div class="xl:col-span-2">
        <div class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg h-full">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-white flex items-center gap-2">
              <Eye class="w-5 h-5" />
              预览与下载
            </h2>
            <div class="flex gap-2">
              <button
                v-if="qrCodeDataURL"
                @click="copyToClipboard"
                class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Copy class="w-4 h-4" />
                复制图片
              </button>
              <button
                v-if="qrCodeDataURL"
                @click="downloadQR"
                class="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download class="w-4 h-4" />
                下载二维码
              </button>
            </div>
          </div>

          <div class="flex flex-col lg:flex-row gap-6 h-full">
            <!-- 预览区域 -->
            <div class="flex-1">
              <!-- 空状态 -->
              <div v-if="!qrCodeDataURL" class="flex flex-col items-center justify-center h-80 border-2 border-dashed border-gray-600 rounded-lg">
                <QrCode class="w-16 h-16 text-gray-500 mb-4" />
                <p class="text-gray-400 text-center">
                  请输入内容生成二维码
                </p>
              </div>
              
              <!-- 二维码预览 -->
              <div v-show="qrCodeDataURL" class="flex flex-col items-center">
                <div class="relative inline-block p-4 bg-white rounded-lg shadow-lg">
                  <canvas
                    ref="qrCanvas"
                    class="max-w-full"
                    :style="{ imageRendering: 'pixelated' }"
                  />
                </div>
                <div class="mt-4 text-center">
                  <div class="text-sm text-gray-300">
                    实际尺寸: {{ qrConfig.size }}×{{ qrConfig.size }}px
                  </div>
                  <div class="text-xs text-gray-400 mt-1">
                    印刷建议: 300DPI时约 {{ Math.round(qrConfig.size / 300 * 25.4) }}mm × {{ Math.round(qrConfig.size / 300 * 25.4) }}mm
                  </div>
                </div>
              </div>
              
              <!-- 隐藏的Canvas用于生成 -->
              <canvas
                v-show="false"
                ref="qrCanvasHidden"
                class="hidden"
              />
            </div>

            <!-- 规格信息 -->
            <div class="lg:w-80">
              <div class="rounded-lg border border-white/10 bg-white/5 p-4">
                <h4 class="text-sm font-semibold text-white mb-3">二维码规格</h4>
                <div class="space-y-2 text-xs text-gray-300">
                  <div class="flex justify-between">
                    <span>内容长度:</span>
                    <span>{{ qrConfig.text.length }} 字符</span>
                  </div>
                  <div class="flex justify-between">
                    <span>输出尺寸:</span>
                    <span>{{ qrConfig.size }}×{{ qrConfig.size }}px</span>
                  </div>
                  <div class="flex justify-between">
                    <span>文件格式:</span>
                    <span>{{ qrConfig.format.toUpperCase() }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>容错等级:</span>
                    <span>{{ qrConfig.errorCorrectionLevel }}级</span>
                  </div>
                  <div class="flex justify-between">
                    <span>前景色:</span>
                    <span>{{ qrConfig.color.dark }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>背景色:</span>
                    <span>{{ qrConfig.color.light }}</span>
                  </div>
                  <div v-if="qrCodeDataURL" class="flex justify-between">
                    <span>文件大小:</span>
                    <span>{{ getFileSize() }}</span>
                  </div>
                </div>
              </div>

              <!-- 印刷建议 -->
              <div class="mt-4 rounded-lg border border-orange-400/20 bg-orange-500/10 p-4">
                <h4 class="text-sm font-semibold text-orange-400 mb-2 flex items-center gap-1">
                  <AlertTriangle class="w-4 h-4" />
                  印刷建议
                </h4>
                <ul class="text-xs text-gray-300 space-y-1">
                  <li>• 保持周围至少4格的留白区域</li>
                  <li>• 印刷尺寸建议不小于1cm×1cm</li>
                  <li>• 使用高对比度的颜色组合</li>
                  <li>• 避免在弯曲或反光表面使用</li>
                </ul>
              </div>

              <!-- 可扫描性测试 -->
              <div v-if="qrCodeDataURL" class="mt-4 rounded-lg border border-green-400/20 bg-green-500/10 p-4">
                <h4 class="text-sm font-semibold text-green-400 mb-2 flex items-center gap-1">
                  <CheckCircle class="w-4 h-4" />
                  扫描测试
                </h4>
                <p class="text-xs text-gray-300">
                  请使用手机扫描预览中的二维码，确认内容正确后再用于印刷。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 成功提示 -->
    <div v-if="message" class="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import QRCode from 'qrcode';
import LikeButton from '../components/LikeButton.vue';
import { initializeDefaultLikes } from '../services/likeService.js';
import { 
  QrCode, 
  Info, 
  Settings, 
  RefreshCw, 
  RotateCcw, 
  Clock,
  Eye, 
  Copy, 
  Download, 
  AlertTriangle,
  CheckCircle
} from 'lucide-vue-next';

// 调试日志
console.log('QRCode library loaded:', QRCode);

const showHelp = ref(false);
const qrCanvas = ref(null);
const qrCanvasHidden = ref(null);
const qrCodeDataURL = ref('');
const message = ref('');
const history = ref([]);

const qrConfig = reactive({
  text: '',
  size: 512,
  format: 'png',
  errorCorrectionLevel: 'M',
  color: {
    dark: '#000000',
    light: '#ffffff'
  },
  margin: 4
});

const templates = ref([
  {
    name: '公司官网',
    description: '企业网站链接',
    template: 'https://www.company.com'
  },
  {
    name: '产品详情',
    description: '产品页面链接', 
    template: 'https://www.company.com/product/abc123'
  },
  {
    name: '联系电话',
    description: '拨打电话',
    template: 'tel:+86-400-123-4567'
  },
  {
    name: '发送邮件',
    description: '邮件联系',
    template: 'mailto:info@company.com'
  },
  {
    name: 'WiFi连接',
    description: '无线网络',
    template: 'WIFI:T:WPA;S:NetworkName;P:password;;'
  },
  {
    name: '微信公众号',
    description: '关注公众号',
    template: 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=xxx'
  }
]);

const sizes = ref([
  { label: '128px (小尺寸)', value: 128 },
  { label: '256px (标准)', value: 256 },
  { label: '512px (推荐)', value: 512 },
  { label: '1024px (高清)', value: 1024 },
  { label: '2048px (超高清)', value: 2048 }
]);

onMounted(async () => {
  // 初始化点赞数据
  initializeDefaultLikes();
  
  loadHistory();
  // 添加初始演示内容
  if (!qrConfig.text) {
    qrConfig.text = 'https://tools.heyijiapack.com';
  }
  
  // 等待DOM完全渲染
  await nextTick();
  
  // 再等待一下确保所有组件都已挂载
  setTimeout(() => {
    console.log('初始化检查Canvas元素:', {
      display: qrCanvas.value,
      hidden: qrCanvasHidden.value
    });
    if (qrConfig.text) {
      updateQRCode();
    }
  }, 500); // 增加延迟时间
});

const updateQRCode = async () => {
  console.log('开始生成二维码...', { text: qrConfig.text, config: qrConfig });
  
  if (!qrConfig.text.trim()) {
    console.log('内容为空，清空二维码');
    qrCodeDataURL.value = '';
    return;
  }

  try {
    // 等待DOM更新
    await nextTick();
    
    const options = {
      width: qrConfig.size,
      errorCorrectionLevel: qrConfig.errorCorrectionLevel,
      color: {
        dark: qrConfig.color.dark,
        light: qrConfig.color.light
      },
      margin: qrConfig.margin
    };
    
    console.log('生成选项:', options);

    if (qrConfig.format === 'svg') {
      // SVG格式
      console.log('生成SVG格式二维码...');
      const svgString = await QRCode.toString(qrConfig.text, {
        ...options,
        type: 'svg'
      });
      
      console.log('SVG生成成功，长度:', svgString.length);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      qrCodeDataURL.value = URL.createObjectURL(blob);
    } else {
      // PNG格式 - 使用Canvas
      console.log('生成PNG格式二维码...');
      
      // 等待隐藏Canvas元素就绪
      let retryCount = 0;
      const maxRetries = 10;
      
      while (!qrCanvasHidden.value && retryCount < maxRetries) {
        console.log(`等待隐藏Canvas元素...重试 ${retryCount + 1}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        await nextTick();
        retryCount++;
      }
      
      if (!qrCanvasHidden.value) {
        console.error('隐藏Canvas元素始终未找到，尝试使用DataURL方式');
        try {
          // 直接使用DataURL方式
          qrCodeDataURL.value = await QRCode.toDataURL(qrConfig.text, options);
          console.log('DataURL方式生成成功，长度:', qrCodeDataURL.value.length);
        } catch (dataUrlError) {
          console.error('DataURL方式也失败:', dataUrlError);
          message.value = '生成二维码失败，请刷新页面重试';
          return;
        }
      } else {
        console.log('隐藏Canvas元素找到:', qrCanvasHidden.value);
        
        try {
          // 先生成到隐藏Canvas
          await QRCode.toCanvas(qrCanvasHidden.value, qrConfig.text, options);
          
          // 获取DataURL
          qrCodeDataURL.value = qrCanvasHidden.value.toDataURL('image/png');
          console.log('PNG生成成功，DataURL长度:', qrCodeDataURL.value.length);
          
          // 尝试复制到显示Canvas（如果存在）
          await nextTick(); // 确保显示Canvas已渲染
          if (qrCanvas.value) {
            const displayCtx = qrCanvas.value.getContext('2d');
            qrCanvas.value.width = qrCanvasHidden.value.width;
            qrCanvas.value.height = qrCanvasHidden.value.height;
            displayCtx.drawImage(qrCanvasHidden.value, 0, 0);
            console.log('已复制到显示Canvas');
          }
          
        } catch (canvasError) {
          console.error('Canvas生成二维码失败:', canvasError);
          
          // 如果Canvas失败，尝试使用DataURL方式
          console.log('尝试使用DataURL方式生成...');
          qrCodeDataURL.value = await QRCode.toDataURL(qrConfig.text, options);
          console.log('DataURL方式生成成功，长度:', qrCodeDataURL.value.length);
        }
      }
    }

    // 添加到历史记录
    addToHistory();
    
    // 显示成功消息
    message.value = '二维码生成成功！';
    setTimeout(() => message.value = '', 3000);
    
  } catch (error) {
    console.error('生成二维码失败:', error);
    message.value = `生成失败: ${error.message}`;
    setTimeout(() => message.value = '', 5000);
  }
};

const useTemplate = (template) => {
  console.log('使用模板:', template.name, template.template);
  qrConfig.text = template.template;
  // 延迟一下确保输入框更新
  nextTick(() => {
    updateQRCode();
  });
};

const resetConfig = () => {
  qrConfig.text = '';
  qrConfig.size = 512;
  qrConfig.format = 'png';
  qrConfig.errorCorrectionLevel = 'M';
  qrConfig.color.dark = '#000000';
  qrConfig.color.light = '#ffffff';
  qrCodeDataURL.value = '';
};

const downloadQR = () => {
  console.log('开始下载二维码...', { format: qrConfig.format, hasDataURL: !!qrCodeDataURL.value });
  
  if (!qrCodeDataURL.value) {
    console.error('没有二维码数据可下载');
    message.value = '请先生成二维码';
    setTimeout(() => message.value = '', 3000);
    return;
  }

  try {
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
    link.download = `qrcode-${timestamp}.${qrConfig.format}`;
    link.href = qrCodeDataURL.value;
    
    // 添加到文档中并点击
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('下载成功');
    message.value = '二维码下载成功！';
    setTimeout(() => message.value = '', 3000);
  } catch (error) {
    console.error('下载失败:', error);
    message.value = '下载失败，请重试';
    setTimeout(() => message.value = '', 3000);
  }
};

const copyToClipboard = async () => {
  console.log('开始复制二维码到剪贴板...');
  
  // 优先使用隐藏Canvas，如果不存在则使用显示Canvas
  const canvas = qrCanvasHidden.value || qrCanvas.value;
  
  if (!canvas && !qrCodeDataURL.value) {
    message.value = '没有二维码可复制';
    setTimeout(() => message.value = '', 3000);
    return;
  }

  try {
    if (canvas) {
      // 使用Canvas复制
      canvas.toBlob(async (blob) => {
        try {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          message.value = '二维码已复制到剪贴板！';
          setTimeout(() => message.value = '', 3000);
        } catch (error) {
          console.error('复制失败:', error);
          message.value = '复制失败，请手动保存';
          setTimeout(() => message.value = '', 3000);
        }
      });
    } else if (qrCodeDataURL.value) {
      // 使用DataURL复制
      const response = await fetch(qrCodeDataURL.value);
      const blob = await response.blob();
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      message.value = '二维码已复制到剪贴板！';
      setTimeout(() => message.value = '', 3000);
    }
  } catch (error) {
    console.error('复制失败:', error);
    message.value = '复制失败，请手动保存';
    setTimeout(() => message.value = '', 3000);
  }
};

const getFileSize = () => {
  if (!qrCodeDataURL.value) return '0KB';
  
  const base64Length = qrCodeDataURL.value.split(',')[1]?.length || 0;
  const bytes = (base64Length * 3) / 4;
  
  if (bytes < 1024) return `${bytes.toFixed(0)}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

const addToHistory = () => {
  const item = {
    id: Date.now(),
    text: qrConfig.text,
    size: qrConfig.size,
    format: qrConfig.format,
    errorCorrectionLevel: qrConfig.errorCorrectionLevel,
    color: { ...qrConfig.color },
    timestamp: new Date().toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  
  history.value.unshift(item);
  if (history.value.length > 10) {
    history.value = history.value.slice(0, 10);
  }
  
  saveHistory();
};

const loadFromHistory = (item) => {
  qrConfig.text = item.text;
  qrConfig.size = item.size;
  qrConfig.format = item.format;
  qrConfig.errorCorrectionLevel = item.errorCorrectionLevel;
  qrConfig.color = { ...item.color };
  updateQRCode();
};

const saveHistory = () => {
  try {
    localStorage.setItem('qr-generator-history', JSON.stringify(history.value));
  } catch (error) {
    console.error('保存历史记录失败:', error);
  }
};

const loadHistory = () => {
  try {
    const saved = localStorage.getItem('qr-generator-history');
    if (saved) {
      history.value = JSON.parse(saved);
    }
  } catch (error) {
    console.error('加载历史记录失败:', error);
  }
};

// 处理点赞变化
const handleLikeChanged = (data) => {
  console.log('点赞变化:', data);
  // 可以在这里添加一些反馈，比如显示感谢信息
  if (data.liked) {
    message.value = '感谢您的支持！💖';
    setTimeout(() => message.value = '', 2000);
  }
};
</script>