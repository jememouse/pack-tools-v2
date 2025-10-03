/**
 * 包装设计师专用色彩API服务
 * 集成多个配色工具API，为包装设计提供专业的色彩建议
 */

class ColorApiService {
  constructor() {
    this.baseUrls = {
      coolors: 'https://coolors.co/api',
      colormind: 'http://colormind.io/api/',
      // 可以添加更多API
    }
  }

  /**
   * 获取和谐配色方案 - 使用Coolors API
   * @param {string} hexColor - 基础颜色 (如: "#FF6B6B")
   * @param {number} count - 配色数量 (默认5个)
   * @returns {Promise<Array>} 配色数组
   */
  async getHarmoniousPalette(hexColor, count = 5) {
    try {
      // 方案1: 使用Coolors.co的公开API (免费)
      const response = await this.fetchCoolorsPalette(hexColor, count)
      if (response) return response
      
      // 方案2: 备用算法 - 基于色彩理论生成
      return this.generateColorTheoryPalette(hexColor, count)
    } catch (error) {
      console.warn('配色API调用失败，使用备用算法:', error)
      return this.generateColorTheoryPalette(hexColor, count)
    }
  }

  /**
   * 获取包装材质适配的配色建议
   * @param {string} hexColor - 基础颜色
   * @param {string} materialType - 材质类型 ('glossy', 'matte', 'transparent', 'metallic')
   * @returns {Object} 材质配色建议
   */
  async getMaterialAdaptedColors(hexColor, materialType = 'glossy') {
    const baseHsl = this.hexToHsl(hexColor)
    
    const adaptations = {
      glossy: {
        // 光面材质：提高饱和度和亮度
        saturation: Math.min(100, baseHsl.s + 15),
        lightness: Math.min(85, baseHsl.l + 10),
        recommendation: '适合鲜艳色彩，建议提高饱和度以增强视觉冲击力'
      },
      matte: {
        // 哑面材质：降低饱和度，提升高级感
        saturation: Math.max(20, baseHsl.s - 20),
        lightness: Math.max(30, baseHsl.l - 5),
        recommendation: '适合柔和色调，建议降低饱和度营造高端质感'
      },
      transparent: {
        // 透明材质：考虑叠加效果
        saturation: Math.max(40, baseHsl.s - 10),
        lightness: Math.max(50, baseHsl.l + 20),
        recommendation: '需考虑透明叠加效果，建议使用中等饱和度'
      },
      metallic: {
        // 金属材质：增强对比度
        saturation: Math.min(90, baseHsl.s + 10),
        lightness: baseHsl.l > 50 ? Math.max(20, baseHsl.l - 30) : Math.min(80, baseHsl.l + 30),
        recommendation: '金属质感需要高对比度，建议使用深浅搭配'
      }
    }

    const adapted = adaptations[materialType] || adaptations.glossy
    const adaptedColor = this.hslToHex(baseHsl.h, adapted.saturation, adapted.lightness)
    
    return {
      originalColor: hexColor,
      adaptedColor: adaptedColor,
      materialType: materialType,
      recommendation: adapted.recommendation,
      colorDifference: this.calculateColorDifference(hexColor, adaptedColor)
    }
  }

  /**
   * 检查颜色对比度 - 用于包装可读性检测
   * @param {string} textColor - 文字颜色
   * @param {string} bgColor - 背景颜色
   * @returns {Object} 对比度分析结果
   */
  checkAccessibility(textColor, bgColor) {
    const textRgb = this.hexToRgb(textColor)
    const bgRgb = this.hexToRgb(bgColor)
    
    const textLum = this.getLuminance(textRgb.r, textRgb.g, textRgb.b)
    const bgLum = this.getLuminance(bgRgb.r, bgRgb.g, bgRgb.b)
    
    const contrastRatio = textLum > bgLum 
      ? (textLum + 0.05) / (bgLum + 0.05)
      : (bgLum + 0.05) / (textLum + 0.05)
    
    return {
      contrastRatio: contrastRatio.toFixed(2),
      wcagAA: contrastRatio >= 4.5,
      wcagAAA: contrastRatio >= 7,
      recommendation: this.getContrastRecommendation(contrastRatio),
      suitable: contrastRatio >= 3 // 包装标签最低要求
    }
  }

  /**
   * 获取包装行业流行色趋势
   * @param {string} category - 产品类别 ('food', 'cosmetic', 'electronics', 'luxury')
   * @returns {Promise<Array>} 趋势色彩
   */
  async getTrendingColors(category = 'food') {
    // 这里可以集成Pantone Color of the Year API
    // 或者基于行业数据返回流行色
    
    const trendingColorsByCategory = {
      food: [
        { color: '#E85A4F', name: '番茄红', description: '刺激食欲，传达新鲜感' },
        { color: '#C7B377', name: '天然金', description: '健康有机，高端品质' },
        { color: '#4A7C2A', name: '自然绿', description: '环保健康，天然无添加' },
        { color: '#8B4513', name: '可可棕', description: '温暖舒适，传统工艺' },
        { color: '#FF6B35', name: '活力橙', description: '年轻活泼，维生素联想' }
      ],
      cosmetic: [
        { color: '#E8B4CB', name: '玫瑰粉', description: '温柔浪漫，女性化' },
        { color: '#2C2C54', name: '深夜蓝', description: '神秘高贵，专业护理' },
        { color: '#D4AF37', name: '奢华金', description: '尊贵奢华，高端定位' },
        { color: '#FEFEFE', name: '纯净白', description: '纯净简约，医美级别' },
        { color: '#1A1A1A', name: '经典黑', description: '时尚前卫，专业品质' }
      ],
      electronics: [
        { color: '#0066CC', name: '科技蓝', description: '科技感强，可靠专业' },
        { color: '#2E2E2E', name: '太空灰', description: '现代简约，高端质感' },
        { color: '#FFFFFF', name: '极简白', description: '纯净现代，苹果风格' },
        { color: '#FF4444', name: '警示红', description: '紧急重要，醒目提醒' },
        { color: '#00CC66', name: '环保绿', description: '节能环保，可持续' }
      ],
      luxury: [
        { color: '#8B0000', name: '帝王红', description: '尊贵奢华，传统权威' },
        { color: '#2F1B14', name: '深咖啡', description: '沉稳内敛，高端品味' },
        { color: '#C9B037', name: '香槟金', description: '优雅奢华，庆典感' },
        { color: '#191970', name: '午夜蓝', description: '神秘高贵，专业品质' },
        { color: '#36013F', name: '深紫', description: '神秘贵族，艺术气质' }
      ]
    }

    return trendingColorsByCategory[category] || trendingColorsByCategory.food
  }

  // ===================== 私有方法 =====================

  /**
   * 调用Coolors API获取配色
   */
  async fetchCoolorsPalette(hexColor, count) {
    try {
      // 注意：这是示例URL，实际使用时需要注册获取API密钥
      // const url = `${this.baseUrls.coolors}/colors/${hexColor.replace('#', '')}/palette/${count}`
      
      // 由于Coolors没有公开免费API，我们使用备用算法
      return this.generateColorTheoryPalette(hexColor, count)
    } catch (error) {
      console.error('Coolors API error:', error)
      return null
    }
  }

  /**
   * 基于色彩理论生成和谐配色
   */
  generateColorTheoryPalette(hexColor, count = 5) {
    const hsl = this.hexToHsl(hexColor)
    const palette = [hexColor] // 包含原始颜色
    
    // 生成不同类型的和谐色
    const schemes = [
      { name: 'complementary', offset: 180 }, // 互补色
      { name: 'triadic', offset: 120 },       // 三分色
      { name: 'analogous', offset: 30 },      // 类似色
      { name: 'split', offset: 150 }          // 分补色
    ]
    
    for (let i = 1; i < count; i++) {
      const scheme = schemes[(i - 1) % schemes.length]
      const newHue = (hsl.h + scheme.offset * i) % 360
      
      // 添加一些随机变化以增加自然感
      const saturation = Math.max(20, Math.min(90, hsl.s + (Math.random() - 0.5) * 40))
      const lightness = Math.max(20, Math.min(80, hsl.l + (Math.random() - 0.5) * 30))
      
      palette.push(this.hslToHex(newHue, saturation, lightness))
    }
    
    return palette
  }

  /**
   * 计算颜色差异 (简化的Delta E)
   */
  calculateColorDifference(color1, color2) {
    const rgb1 = this.hexToRgb(color1)
    const rgb2 = this.hexToRgb(color2)
    
    const deltaR = rgb1.r - rgb2.r
    const deltaG = rgb1.g - rgb2.g
    const deltaB = rgb1.b - rgb2.b
    
    return Math.sqrt(deltaR * deltaR + deltaG * deltaG + deltaB * deltaB)
  }

  /**
   * 获取对比度建议
   */
  getContrastRecommendation(ratio) {
    if (ratio >= 7) return '优秀 - 符合WCAG AAA标准'
    if (ratio >= 4.5) return '良好 - 符合WCAG AA标准'
    if (ratio >= 3) return '可接受 - 适用于包装标签'
    return '不推荐 - 对比度过低，影响可读性'
  }

  /**
   * 计算相对亮度
   */
  getLuminance(r, g, b) {
    const [rNorm, gNorm, bNorm] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm
  }

  // ===================== 颜色格式转换工具 =====================

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  }

  hexToHsl(hex) {
    const { r, g, b } = this.hexToRgb(hex)
    return this.rgbToHsl(r, g, b)
  }

  rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2

    if (max === min) {
      h = s = 0 // 无色
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }

    return { h: h * 360, s: s * 100, l: l * 100 }
  }

  hslToHex(h, s, l) {
    h /= 360; s /= 100; l /= 100
    const a = s * Math.min(l, 1 - l)
    const f = n => {
      const k = (n + h * 12) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color).toString(16).padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase()
  }
}

// 创建单例实例
export const colorApi = new ColorApiService()

// 导出具体的工具函数，方便直接使用
export const {
  getHarmoniousPalette,
  getMaterialAdaptedColors,
  checkAccessibility,
  getTrendingColors
} = colorApi

export default ColorApiService