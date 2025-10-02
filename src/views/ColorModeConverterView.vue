<template>
  <div class="color-mode-converter p-6 bg-gray-100 min-h-screen font-sans">
    <h1 class="text-3xl font-bold mb-8 text-gray-800">高级色彩模式转换器</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Color Inputs -->
      <div class="flex flex-col gap-4">
        <!-- Color Picker -->
        <div class="bg-white p-4 rounded-lg shadow-md">
          <label class="block text-sm font-medium text-gray-700 mb-2">颜色选择器</label>
          <div class="flex items-center gap-3">
            <input 
              type="color" 
              v-model="colorPicker" 
              @input="updateFromColorPicker" 
              @focus="setActive('colorPicker')" 
              class="w-16 h-16 border-2 border-gray-300 rounded-lg cursor-pointer"
            />
            <div class="text-sm text-gray-600">
              <p>点击选择颜色</p>
            </div>
          </div>
        </div>

        <!-- Hex Input -->
        <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="flex items-center justify-between mb-2">
            <label for="hex-input" class="block text-sm font-medium text-gray-700">Hex</label>
            <button @click="copyToClipboard(hex)" class="text-xs text-blue-600 hover:text-blue-800">复制</button>
          </div>
          <input 
            id="hex-input" 
            type="text" 
            v-model="hex" 
            @focus="setActive('hex')" 
            @input="updateFromHex" 
            placeholder="#RRGGBB" 
            class="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>

        <!-- RGB Input -->
        <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700">RGB</label>
            <button @click="copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)" class="text-xs text-blue-600 hover:text-blue-800">复制</button>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label for="rgb-r" class="block text-xs text-gray-600">R</label>
              <input id="rgb-r" type="number" v-model.number="rgb.r" @focus="setActive('rgb')" @input="updateFromRgb" min="0" max="255" step="1" class="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label for="rgb-g" class="block text-xs text-gray-600">G</label>
              <input id="rgb-g" type="number" v-model.number="rgb.g" @focus="setActive('rgb')" @input="updateFromRgb" min="0" max="255" step="1" class="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label for="rgb-b" class="block text-xs text-gray-600">B</label>
              <input id="rgb-b" type="number" v-model.number="rgb.b" @focus="setActive('rgb')" @input="updateFromRgb" min="0" max="255" step="1" class="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </div>

        <!-- HSL Input -->
        <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700">HSL</label>
            <button @click="copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)" class="text-xs text-blue-600 hover:text-blue-800">复制</button>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label for="hsl-h" class="block text-xs text-gray-600">H</label>
              <input id="hsl-h" type="number" v-model.number="hsl.h" @focus="setActive('hsl')" @input="updateFromHsl" min="0" max="360" step="1" class="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label for="hsl-s" class="block text-xs text-gray-600">S (%)</label>
              <input id="hsl-s" type="number" v-model.number="hsl.s" @focus="setActive('hsl')" @input="updateFromHsl" min="0" max="100" step="1" class="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label for="hsl-l" class="block text-xs text-gray-600">L (%)</label>
              <input id="hsl-l" type="number" v-model.number="hsl.l" @focus="setActive('hsl')" @input="updateFromHsl" min="0" max="100" step="1" class="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </div>

        <!-- HSV Input -->
        <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700">HSV</label>
            <button @click="copyToClipboard(`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`)" class="text-xs text-blue-600 hover:text-blue-800">复制</button>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label for="hsv-h" class="block text-xs text-gray-600">H</label>
              <input id="hsv-h" type="number" v-model.number="hsv.h" @focus="setActive('hsv')" @input="updateFromHsv" min="0" max="360" step="1" class="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label for="hsv-s" class="block text-xs text-gray-600">S (%)</label>
              <input id="hsv-s" type="number" v-model.number="hsv.s" @focus="setActive('hsv')" @input="updateFromHsv" min="0" max="100" step="1" class="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label for="hsv-v" class="block text-xs text-gray-600">V (%)</label>
              <input id="hsv-v" type="number" v-model.number="hsv.v" @focus="setActive('hsv')" @input="updateFromHsv" min="0" max="100" step="1" class="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </div>

        <!-- CMYK Input -->
        <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700">CMYK</label>
            <button @click="copyToClipboard(`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`)" class="text-xs text-blue-600 hover:text-blue-800">复制</button>
          </div>
          <div class="grid grid-cols-4 gap-2">
            <div>
              <label for="cmyk-c" class="block text-xs text-gray-600">C (%)</label>
              <input id="cmyk-c" type="number" v-model.number="cmyk.c" @focus="setActive('cmyk')" @input="updateFromCmyk" min="0" max="100" step="1" class="w-full p-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label for="cmyk-m" class="block text-xs text-gray-600">M (%)</label>
              <input id="cmyk-m" type="number" v-model.number="cmyk.m" @focus="setActive('cmyk')" @input="updateFromCmyk" min="0" max="100" step="1" class="w-full p-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label for="cmyk-y" class="block text-xs text-gray-600">Y (%)</label>
              <input id="cmyk-y" type="number" v-model.number="cmyk.y" @focus="setActive('cmyk')" @input="updateFromCmyk" min="0" max="100" step="1" class="w-full p-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label for="cmyk-k" class="block text-xs text-gray-600">K (%)</label>
              <input id="cmyk-k" type="number" v-model.number="cmyk.k" @focus="setActive('cmyk')" @input="updateFromCmyk" min="0" max="100" step="1" class="w-full p-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </div>
      </div>

      <!-- Middle Column: Preview & Additional Info -->
      <div class="flex flex-col gap-6">
        <!-- Color Preview -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-4 text-gray-800">颜色预览</h2>
          <div class="relative">
            <div 
              class="w-full h-48 rounded-md border border-gray-200 transition-colors duration-300 cursor-pointer relative overflow-hidden"
              :style="{ backgroundColor: previewColor }"
              @click="addToHistory()"
            >
              <!-- Contrast checker overlay -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="bg-white bg-opacity-90 p-4 rounded-md text-center">
                  <div class="text-gray-900 font-medium mb-1">黑色文本</div>
                  <div class="text-white font-medium">白色文本</div>
                </div>
              </div>
            </div>
            <div class="mt-2 text-center text-sm text-gray-600">
              点击添加到历史记录
            </div>
          </div>
        </div>

        <!-- Color History -->
        <div class="bg-white p-4 rounded-lg shadow-md" v-if="colorHistory.length > 0">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">颜色历史</h3>
          <div class="grid grid-cols-6 gap-2">
            <div 
              v-for="(color, index) in colorHistory" 
              :key="index"
              class="w-12 h-12 rounded-md border border-gray-200 cursor-pointer hover:scale-110 transition-transform"
              :style="{ backgroundColor: color }"
              @click="loadFromHistory(color)"
              :title="color"
            ></div>
          </div>
        </div>

        <!-- Lab Values Display -->
        <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-800">CIE-Lab 值</h3>
            <button @click="copyToClipboard(`lab(${lab.l.toFixed(2)}, ${lab.a.toFixed(2)}, ${lab.b.toFixed(2)})`)" class="text-xs text-blue-600 hover:text-blue-800">复制</button>
          </div>
          <div class="grid grid-cols-3 gap-3 text-center">
            <div>
              <span class="text-sm font-medium text-gray-600">L*</span>
              <p class="text-lg font-mono">{{ lab.l.toFixed(2) }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-600">a*</span>
              <p class="text-lg font-mono">{{ lab.a.toFixed(2) }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-600">b*</span>
              <p class="text-lg font-mono">{{ lab.b.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <!-- XYZ Values Display -->
        <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-800">CIE-XYZ 值</h3>
            <button @click="copyToClipboard(`xyz(${xyz.x.toFixed(2)}, ${xyz.y.toFixed(2)}, ${xyz.z.toFixed(2)})`)" class="text-xs text-blue-600 hover:text-blue-800">复制</button>
          </div>
          <div class="grid grid-cols-3 gap-3 text-center">
            <div>
              <span class="text-sm font-medium text-gray-600">X</span>
              <p class="text-lg font-mono">{{ xyz.x.toFixed(2) }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-600">Y</span>
              <p class="text-lg font-mono">{{ xyz.y.toFixed(2) }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-600">Z</span>
              <p class="text-lg font-mono">{{ xyz.z.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Color Palette Generator & Tools -->
      <div class="flex flex-col gap-6">
        <!-- Color Palette Generator -->
        <div class="bg-white p-4 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">调色板生成器</h3>
          <div class="space-y-4">
            <!-- Monochromatic -->
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2">单色调色板</h4>
              <div class="grid grid-cols-5 gap-1">
                <div 
                  v-for="(color, index) in monochromaticPalette" 
                  :key="index"
                  class="w-full h-8 rounded cursor-pointer hover:scale-105 transition-transform"
                  :style="{ backgroundColor: color }"
                  @click="loadColorFromPalette(color)"
                  :title="color"
                ></div>
              </div>
            </div>
            
            <!-- Complementary -->
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2">互补色</h4>
              <div class="grid grid-cols-2 gap-1">
                <div 
                  v-for="(color, index) in complementaryPalette" 
                  :key="index"
                  class="w-full h-8 rounded cursor-pointer hover:scale-105 transition-transform"
                  :style="{ backgroundColor: color }"
                  @click="loadColorFromPalette(color)"
                  :title="color"
                ></div>
              </div>
            </div>

            <!-- Analogous -->
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2">类似色</h4>
              <div class="grid grid-cols-3 gap-1">
                <div 
                  v-for="(color, index) in analogousPalette" 
                  :key="index"
                  class="w-full h-8 rounded cursor-pointer hover:scale-105 transition-transform"
                  :style="{ backgroundColor: color }"
                  @click="loadColorFromPalette(color)"
                  :title="color"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Color Contrast Checker -->
        <div class="bg-white p-4 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">对比度检查器</h3>
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700">背景色:</label>
              <input 
                type="color" 
                v-model="contrastBg" 
                @input="calculateContrast"
                class="w-8 h-8 border border-gray-300 rounded cursor-pointer bg-white"
              />
              <span class="text-sm font-mono text-gray-900">{{ contrastBg }}</span>
            </div>
            
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">对比度:</span>
                <span class="font-mono font-bold" :class="contrastRatio >= 4.5 ? 'text-green-600' : 'text-red-600'">
                  {{ contrastRatio.toFixed(2) }}:1
                </span>
              </div>
              
              <div class="text-xs space-y-1">
                <div class="flex justify-between">
                  <span>AA 正常文本 (4.5:1):</span>
                  <span :class="contrastRatio >= 4.5 ? 'text-green-600' : 'text-red-600'">
                    {{ contrastRatio >= 4.5 ? '✓ 通过' : '✗ 未通过' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span>AAA 正常文本 (7:1):</span>
                  <span :class="contrastRatio >= 7 ? 'text-green-600' : 'text-red-600'">
                    {{ contrastRatio >= 7 ? '✓ 通过' : '✗ 未通过' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span>AA 大文本 (3:1):</span>
                  <span :class="contrastRatio >= 3 ? 'text-green-600' : 'text-red-600'">
                    {{ contrastRatio >= 3 ? '✓ 通过' : '✗ 未通过' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Color Space Visualization -->
        <div class="bg-white p-4 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">色彩空间可视化</h3>
          <div class="flex flex-col items-center space-y-4">
            <!-- HSL Color Wheel -->
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2 text-center">HSL 色轮</h4>
              <ColorWheel
                :hue="hsl.h"
                :saturation="hsl.s"
                :lightness="hsl.l"
                :size="180"
                @update:hue="updateHueFromWheel"
                @update:saturation="updateSaturationFromWheel"
              />
            </div>
            
            <!-- Lightness Slider -->
            <div class="w-full">
              <label class="block text-sm font-medium text-gray-700 mb-2">亮度: {{ hsl.l }}%</label>
              <input
                type="range"
                v-model.number="hsl.l"
                @input="updateFromHsl"
                @focus="setActive('hsl')"
                min="0"
                max="100"
                class="w-full h-2 bg-gradient-to-r from-black via-gray-500 to-white rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>

        <!-- Color Presets -->
        <div class="bg-white p-4 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">常用颜色</h3>
          <div class="grid grid-cols-4 gap-2">
            <div 
              v-for="preset in colorPresets" 
              :key="preset.name"
              class="group relative cursor-pointer"
              @click="loadColorFromPalette(preset.color)"
            >
              <div 
                class="w-full h-8 rounded border border-gray-200 hover:scale-105 transition-transform"
                :style="{ backgroundColor: preset.color }"
              ></div>
              <div class="text-xs text-center mt-1 text-gray-600 group-hover:text-gray-800">
                {{ preset.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div 
      v-if="showToast"
      class="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 transition-all duration-300"
    >
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue';
import ColorWheel from '../components/ColorWheel.vue';

// --- STATE MANAGEMENT ---
const hex = ref('#FF5733');
const rgb = reactive({ r: 255, g: 87, b: 51 });
const hsl = reactive({ h: 10, s: 100, l: 60 });
const hsv = reactive({ h: 10, s: 80, v: 100 });
const cmyk = reactive({ c: 0, m: 66, y: 80, k: 0 });
const lab = reactive({ l: 64.31, a: 52.91, b: 51.18 });
const xyz = reactive({ x: 32.77, y: 22.19, z: 3.85 });
const colorPicker = ref('#FF5733');

// History and UI state
const colorHistory = ref([]);
const contrastBg = ref('#FFFFFF');
const contrastRatio = ref(1);

const activeInput = ref('colorPicker'); // To track user focus and prevent feedback loops
let isUpdating = false; // Flag to prevent re-triggering watchers

// Toast notification state
const toastMessage = ref('');
const showToast = ref(false);

const previewColor = computed(() => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);

// Color presets
const colorPresets = ref([
  { name: '红色', color: '#FF0000' },
  { name: '橙色', color: '#FFA500' },
  { name: '黄色', color: '#FFFF00' },
  { name: '绿色', color: '#00FF00' },
  { name: '青色', color: '#00FFFF' },
  { name: '蓝色', color: '#0000FF' },
  { name: '紫色', color: '#800080' },
  { name: '粉色', color: '#FFC0CB' },
  { name: '棕色', color: '#A52A2A' },
  { name: '灰色', color: '#808080' },
  { name: '黑色', color: '#000000' },
  { name: '白色', color: '#FFFFFF' }
]);

// Color palettes
const monochromaticPalette = computed(() => {
  const { h, s } = hsl;
  return [
    hslToHex(h, s, Math.max(0, hsl.l - 30)),
    hslToHex(h, s, Math.max(0, hsl.l - 15)),
    hex.value,
    hslToHex(h, s, Math.min(100, hsl.l + 15)),
    hslToHex(h, s, Math.min(100, hsl.l + 30))
  ];
});

const complementaryPalette = computed(() => {
  const { s, l } = hsl;
  return [
    hex.value,
    hslToHex((hsl.h + 180) % 360, s, l)
  ];
});

const analogousPalette = computed(() => {
  const { s, l } = hsl;
  return [
    hslToHex((hsl.h - 30 + 360) % 360, s, l),
    hex.value,
    hslToHex((hsl.h + 30) % 360, s, l)
  ];
});

const setActive = (input) => {
  activeInput.value = input;
};

// --- CONVERSION LOGIC ---

// Clamp utility
const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

// HEX <-> RGB
const hexToRgb = (hexStr) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hexStr = hexStr.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexStr);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
};
const rgbToHex = (r, g, b) => {
  return ('#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)).toUpperCase();
};

// HSL <-> RGB
const hslToRgb = (h, s, l) => {
  s /= 100; l /= 100;
  let c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2, r = 0, g = 0, b = 0;
  if (0 <= h && h < 60) { r = c; g = x; b = 0; } else if (60 <= h && h < 120) { r = x; g = c; b = 0; } else if (120 <= h && h < 180) { r = 0; g = c; b = x; } else if (180 <= h && h < 240) { r = 0; g = x; b = c; } else if (240 <= h && h < 300) { r = x; g = 0; b = c; } else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
};
const rgbToHsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

// HSL to Hex (for palette generation)
const hslToHex = (h, s, l) => {
  const rgbColor = hslToRgb(h, s, l);
  return rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b);
};

// HSV <-> RGB
const hsvToRgb = (h, s, v) => {
  s /= 100; v /= 100;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
};

const rgbToHsv = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  let h = 0, s = 0, v = max;
  
  if (diff !== 0) {
    s = diff / max;
    switch (max) {
      case r: h = ((g - b) / diff) % 6; break;
      case g: h = (b - r) / diff + 2; break;
      case b: h = (r - g) / diff + 4; break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  
  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  };
};

// CMYK <-> RGB
const cmykToRgb = (c, m, y, k) => {
  c /= 100; m /= 100; y /= 100; k /= 100;
  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);
  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b)
  };
};

const rgbToCmyk = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
};

// RGB <-> XYZ
const rgbToXyz = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) * 100;
  const y = (r * 0.2126 + g * 0.7152 + b * 0.0722) * 100;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) * 100;
  return { x, y, z };
};

const xyzToRgb = (x, y, z) => {
  x /= 100; y /= 100; z /= 100;
  let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let b = x * 0.0557 + y * -0.2040 + z * 1.0570;
  r = (r > 0.0031308) ? (1.055 * Math.pow(r, 1/2.4) - 0.055) : 12.92 * r;
  g = (g > 0.0031308) ? (1.055 * Math.pow(g, 1/2.4) - 0.055) : 12.92 * g;
  b = (b > 0.0031308) ? (1.055 * Math.pow(b, 1/2.4) - 0.055) : 12.92 * b;
  return {
    r: clamp(Math.round(r * 255), 0, 255),
    g: clamp(Math.round(g * 255), 0, 255),
    b: clamp(Math.round(b * 255), 0, 255)
  };
};

// XYZ <-> LAB
const xyzToLab = (x, y, z) => {
  x /= 95.047; y /= 100.000; z /= 108.883;
  x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
  y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
  z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
  return {
    l: (116 * y) - 16,
    a: 500 * (x - y),
    b: 200 * (y - z)
  };
};

const labToXyz = (l, a, b) => {
  let y = (l + 16) / 116;
  let x = a / 500 + y;
  let z = y - b / 200;
  const y3 = Math.pow(y, 3);
  const x3 = Math.pow(x, 3);
  const z3 = Math.pow(z, 3);
  y = y3 > 0.008856 ? y3 : (y - 16/116) / 7.787;
  x = x3 > 0.008856 ? x3 : (x - 16/116) / 7.787;
  z = z3 > 0.008856 ? z3 : (z - 16/116) / 7.787;
  return {
    x: x * 95.047,
    y: y * 100.000,
    z: z * 108.883
  };
};

// RGB -> LAB (convenience function)
const rgbToLab = (r, g, b) => {
  const xyzColor = rgbToXyz(r, g, b);
  return xyzToLab(xyzColor.x, xyzColor.y, xyzColor.z);
};

// LAB -> RGB (convenience function)
const labToRgb = (l, a, b) => {
  const xyzColor = labToXyz(l, a, b);
  return xyzToRgb(xyzColor.x, xyzColor.y, xyzColor.z);
};

// Luminance calculation for contrast ratio
const getLuminance = (r, g, b) => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

// Contrast ratio calculation
const getContrastRatio = (rgb1, rgb2) => {
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

// --- UTILITY FUNCTIONS ---
const showToastMessage = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 2000);
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    showToastMessage(`已复制: ${text}`);
  } catch (err) {
    showToastMessage('复制失败');
  }
};

const addToHistory = () => {
  const currentColor = hex.value;
  if (!colorHistory.value.includes(currentColor)) {
    colorHistory.value.unshift(currentColor);
    if (colorHistory.value.length > 12) {
      colorHistory.value.pop();
    }
    localStorage.setItem('colorHistory', JSON.stringify(colorHistory.value));
  }
};

const loadFromHistory = (color) => {
  const newRgb = hexToRgb(color);
  if (newRgb) {
    setActive('none'); // Clear active input
    updateAllFromRgb(newRgb, false); // Update all inputs
  }
};

const loadColorFromPalette = (color) => {
  const newRgb = hexToRgb(color);
  if (newRgb) {
    setActive('none'); // Clear active input
    updateAllFromRgb(newRgb, false); // Update all inputs
  }
};

const calculateContrast = () => {
  const bgRgb = hexToRgb(contrastBg.value);
  if (bgRgb) {
    contrastRatio.value = getContrastRatio(rgb, bgRgb);
  }
};

// Central update function
const updateAllFromRgb = (newRgb, skipActiveInput = true) => {
  if (!newRgb) return;
  
  // Update RGB if not the active input
  if (!skipActiveInput || activeInput.value !== 'rgb') {
    Object.assign(rgb, newRgb);
  }

  // Update all other formats (skip the currently active input to prevent overriding user input)
  if (!skipActiveInput || activeInput.value !== 'hex') {
    hex.value = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  }
  
  if (!skipActiveInput || activeInput.value !== 'colorPicker') {
    colorPicker.value = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  }
  
  if (!skipActiveInput || activeInput.value !== 'hsl') {
    const newHsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    Object.assign(hsl, newHsl);
  }
  
  if (!skipActiveInput || activeInput.value !== 'hsv') {
    const newHsv = rgbToHsv(newRgb.r, newRgb.g, newRgb.b);
    Object.assign(hsv, newHsv);
  }
  
  if (!skipActiveInput || activeInput.value !== 'cmyk') {
    const newCmyk = rgbToCmyk(newRgb.r, newRgb.g, newRgb.b);
    Object.assign(cmyk, newCmyk);
  }
  
  const newLab = rgbToLab(newRgb.r, newRgb.g, newRgb.b);
  Object.assign(lab, newLab);
  
  const newXyz = rgbToXyz(newRgb.r, newRgb.g, newRgb.b);
  Object.assign(xyz, newXyz);

  // Update contrast ratio
  calculateContrast();
};

// Debounce utility for input handling
let debounceTimer = null;
const debounce = (func, delay = 100) => {
  return (...args) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func(...args), delay);
  };
};

// --- EVENT HANDLERS ---
const updateFromColorPicker = () => {
  const newRgb = hexToRgb(colorPicker.value);
  if (newRgb) updateAllFromRgb(newRgb);
};

const updateFromHex = debounce(() => {
  if (hex.value && hex.value.match(/^#[0-9A-Fa-f]{6}$/)) {
    const newRgb = hexToRgb(hex.value);
    if (newRgb) updateAllFromRgb(newRgb);
  }
});

const updateFromRgb = debounce(() => {
  // Validate RGB values
  if (rgb.r >= 0 && rgb.r <= 255 && rgb.g >= 0 && rgb.g <= 255 && rgb.b >= 0 && rgb.b <= 255) {
    updateAllFromRgb({ r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) });
  }
});

const updateFromHsl = debounce(() => {
  // Validate HSL values
  if (hsl.h >= 0 && hsl.h <= 360 && hsl.s >= 0 && hsl.s <= 100 && hsl.l >= 0 && hsl.l <= 100) {
    const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    updateAllFromRgb(newRgb);
  }
});

const updateFromHsv = debounce(() => {
  // Validate HSV values
  if (hsv.h >= 0 && hsv.h <= 360 && hsv.s >= 0 && hsv.s <= 100 && hsv.v >= 0 && hsv.v <= 100) {
    const newRgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
    updateAllFromRgb(newRgb);
  }
});

const updateFromCmyk = debounce(() => {
  // Validate CMYK values
  if (cmyk.c >= 0 && cmyk.c <= 100 && cmyk.m >= 0 && cmyk.m <= 100 && 
      cmyk.y >= 0 && cmyk.y <= 100 && cmyk.k >= 0 && cmyk.k <= 100) {
    const newRgb = cmykToRgb(cmyk.c, cmyk.m, cmyk.y, cmyk.k);
    updateAllFromRgb(newRgb);
  }
});

// Color wheel event handlers
const updateHueFromWheel = (newHue) => {
  setActive('colorWheel');
  hsl.h = newHue;
  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  updateAllFromRgb(newRgb);
};

const updateSaturationFromWheel = (newSaturation) => {
  setActive('colorWheel');
  hsl.s = newSaturation;
  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  updateAllFromRgb(newRgb);
};

// --- LIFECYCLE ---
onMounted(() => {
  // Load color history from localStorage
  const savedHistory = localStorage.getItem('colorHistory');
  if (savedHistory) {
    try {
      colorHistory.value = JSON.parse(savedHistory);
    } catch (e) {
      console.warn('Failed to parse color history from localStorage');
    }
  }
  
  // Initialize all color formats from default hex value
  const initialRgb = hexToRgb(hex.value);
  if (initialRgb) {
    setActive('none'); // No active input during initialization
    updateAllFromRgb(initialRgb, false); // Update all inputs
  }
  
  // Initialize contrast calculation
  calculateContrast();
});

</script>

<style scoped>
/* Using Tailwind CSS, so minimal custom styles are needed. */
.font-sans {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

/* Custom slider styles */
.slider {
  -webkit-appearance: none;
  height: 8px;
  border-radius: 4px;
  outline: none;
  transition: opacity 0.2s;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #333;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #333;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Smooth transitions for color changes */
.transition-colors {
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

/* Hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

.hover\:scale-110:hover {
  transform: scale(1.1);
}

/* Input field styling to ensure proper colors */
input[type="number"],
input[type="text"] {
  background-color: white !important;
  color: #1f2937 !important; /* gray-800 */
}

input[type="number"]:focus,
input[type="text"]:focus {
  outline: none;
  border-color: #3b82f6; /* blue-500 */
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Color picker styling */
input[type="color"] {
  background-color: white;
  border: 2px solid #d1d5db;
  padding: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 6px;
}

input[type="color"]::-moz-color-swatch {
  border: none;
  border-radius: 6px;
}
</style>
