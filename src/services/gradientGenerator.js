/**
 * 包装设计专用渐变生成器服务
 * 提供专业级渐变生成、导出和优化功能
 */

class GradientGeneratorService {
  constructor() {
    this.gradientTypes = {
      linear: 'linear-gradient',
      radial: 'radial-gradient',
      conic: 'conic-gradient'
    }
  }

  /**
   * 生成基于包装设计的智能渐变方案
   * @param {string} baseColor - 基础颜色
   * @param {Object} options - 配置选项
   * @returns {Array} 渐变方案数组
   */
  generatePackagingGradients(baseColor, options = {}) {
    const {
      category = 'food',
      materialType = 'glossy',
      brand = 'modern',
      target = 'retail'
    } = options

    const baseHsl = this.hexToHsl(baseColor)
    const gradients = []

    // 1. 品牌调性渐变
    gradients.push(...this.generateBrandGradients(baseColor, baseHsl, brand))
    
    // 2. 材质适配渐变
    gradients.push(...this.generateMaterialGradients(baseColor, baseHsl, materialType))
    
    // 3. 行业特色渐变
    gradients.push(...this.generateIndustryGradients(baseColor, baseHsl, category))
    
    // 4. 应用场景渐变
    gradients.push(...this.generateSceneGradients(baseColor, baseHsl, target))

    return gradients
  }

  /**
   * 生成品牌调性渐变
   */
  generateBrandGradients(baseColor, hsl, brand) {
    const { h, s, l } = hsl
    
    const brandStyles = {
      modern: [
        {
          name: '现代简约',
          type: 'linear',
          css: `linear-gradient(135deg, ${baseColor} 0%, ${this.hslToHex(h, Math.max(20, s - 40), Math.min(90, l + 20))} 100%)`,
          description: '简洁清晰，体现现代品牌形象',
          usage: '适合科技、家居、时尚品牌',
          printSafe: true,
          accessibility: 'AA'
        },
        {
          name: '极简渐变',
          type: 'linear',
          css: `linear-gradient(90deg, ${this.adjustOpacity(baseColor, 0.9)} 0%, ${this.adjustOpacity(baseColor, 0.1)} 100%)`,
          description: '透明度变化，营造轻盈感',
          usage: '适合高端品牌背景设计',
          printSafe: false,
          accessibility: 'AAA'
        }
      ],
      luxury: [
        {
          name: '奢华金属',
          type: 'linear',
          css: `linear-gradient(45deg, ${baseColor} 0%, ${this.hslToHex(h + 30, Math.min(100, s + 20), Math.max(20, l - 20))} 30%, #D4AF37 60%, ${baseColor} 100%)`,
          description: '金属质感，彰显奢华品质',
          usage: '适合奢侈品、高端化妆品',
          printSafe: true,
          accessibility: 'AA'
        },
        {
          name: '深邃神秘',
          type: 'radial',
          css: `radial-gradient(ellipse at center, ${baseColor} 0%, ${this.hslToHex(h, s, Math.max(10, l - 40))} 70%, #1a1a1a 100%)`,
          description: '径向阴影，营造神秘感',
          usage: '适合威士忌、香水等高端产品',
          printSafe: true,
          accessibility: 'A'
        }
      ],
      youthful: [
        {
          name: '青春活力',
          type: 'linear',
          css: `linear-gradient(45deg, ${baseColor} 0%, ${this.hslToHex((h + 60) % 360, Math.min(100, s + 30), Math.min(80, l + 15))} 50%, ${this.hslToHex((h + 120) % 360, Math.min(100, s + 20), Math.min(85, l + 10))} 100%)`,
          description: '多彩跳跃，充满青春气息',
          usage: '适合潮牌、运动品牌、饮料',
          printSafe: true,
          accessibility: 'AA'
        },
        {
          name: '霓虹炫彩',
          type: 'conic',
          css: `conic-gradient(from 180deg at 50% 50%, ${baseColor} 0deg, ${this.hslToHex((h + 90) % 360, 100, 70)} 90deg, ${this.hslToHex((h + 180) % 360, 90, 60)} 180deg, ${this.hslToHex((h + 270) % 360, 95, 65)} 270deg, ${baseColor} 360deg)`,
          description: '圆锥渐变，科技感十足',
          usage: '适合电竞、数码产品',
          printSafe: false,
          accessibility: 'A'
        }
      ]
    }

    return brandStyles[brand] || brandStyles.modern
  }

  /**
   * 生成材质适配渐变
   */
  generateMaterialGradients(baseColor, hsl, materialType) {
    const { h, s, l } = hsl

    const materialGradients = {
      glossy: [
        {
          name: '光面反射',
          type: 'linear',
          css: `linear-gradient(135deg, ${this.hslToHex(h, Math.min(100, s + 20), Math.min(95, l + 25))} 0%, ${baseColor} 45%, ${this.hslToHex(h, s, Math.max(20, l - 15))} 100%)`,
          description: '模拟光面材质的高光反射',
          usage: '适合光面包装盒、塑料包装',
          printSafe: true,
          materialEffect: 'highlight'
        }
      ],
      matte: [
        {
          name: '哑面质感',
          type: 'linear',
          css: `linear-gradient(180deg, ${this.hslToHex(h, Math.max(20, s - 30), Math.min(80, l + 10))} 0%, ${baseColor} 60%, ${this.hslToHex(h, Math.max(10, s - 20), Math.max(30, l - 10))} 100%)`,
          description: '柔和过渡，体现哑面质感',
          usage: '适合哑面纸盒、布料包装',
          printSafe: true,
          materialEffect: 'soft'
        }
      ],
      metallic: [
        {
          name: '金属拉丝',
          type: 'linear',
          css: `repeating-linear-gradient(90deg, ${baseColor} 0px, ${this.hslToHex(h, s, Math.min(90, l + 20))} 1px, ${this.hslToHex(h, Math.max(30, s - 10), Math.max(20, l - 10))} 2px, ${baseColor} 3px)`,
          description: '重复线性渐变模拟金属拉丝',
          usage: '适合金属包装、高端电子产品',
          printSafe: false,
          materialEffect: 'brushed'
        }
      ]
    }

    return materialGradients[materialType] || materialGradients.glossy
  }

  /**
   * 生成行业特色渐变
   */
  generateIndustryGradients(baseColor, hsl, category) {
    const { h, s, l } = hsl

    const industryGradients = {
      food: [
        {
          name: '食欲渐变',
          type: 'radial',
          css: `radial-gradient(circle at 30% 30%, ${this.hslToHex(h, Math.min(100, s + 20), Math.min(85, l + 15))} 0%, ${baseColor} 60%, ${this.hslToHex(h, Math.max(40, s - 10), Math.max(30, l - 15))} 100%)`,
          description: '温暖的径向渐变，刺激食欲',
          usage: '适合食品包装、餐饮品牌',
          psychology: '温暖、诱人、新鲜'
        }
      ],
      cosmetic: [
        {
          name: '珠光质感',
          type: 'linear',
          css: `linear-gradient(45deg, ${baseColor} 0%, ${this.addPearlEffect(baseColor)} 25%, ${this.hslToHex(h, Math.min(100, s + 15), Math.min(90, l + 20))} 50%, ${baseColor} 75%, ${this.hslToHex(h, Math.max(20, s - 15), Math.max(40, l - 10))} 100%)`,
          description: '珠光效果，提升产品档次',
          usage: '适合化妆品、香水包装',
          psychology: '高贵、精致、女性化'
        }
      ],
      electronics: [
        {
          name: '科技蓝光',
          type: 'linear',
          css: `linear-gradient(135deg, ${this.hslToHex(220, 80, 20)} 0%, ${baseColor} 40%, ${this.hslToHex(200, 100, 50)} 70%, ${this.hslToHex(240, 90, 30)} 100%)`,
          description: '科技感蓝色渐变',
          usage: '适合电子产品、数码配件',
          psychology: '专业、可靠、科技'
        }
      ]
    }

    return industryGradients[category] || industryGradients.food
  }

  /**
   * 生成应用场景渐变
   */
  generateSceneGradients(baseColor, hsl, target) {
    const { h, s, l } = hsl

    const sceneGradients = {
      retail: [
        {
          name: '货架吸引',
          type: 'linear',
          css: `linear-gradient(45deg, ${this.hslToHex(h, Math.min(100, s + 30), Math.min(80, l + 10))} 0%, ${baseColor} 30%, ${this.hslToHex(h, Math.min(100, s + 15), Math.min(90, l + 20))} 60%, ${baseColor} 100%)`,
          description: '高对比度，货架上更显眼',
          usage: '适合超市、便利店产品',
          visibility: 'high'
        }
      ],
      online: [
        {
          name: '屏幕优化',
          type: 'linear',
          css: `linear-gradient(135deg, ${this.adjustForScreen(baseColor)} 0%, ${baseColor} 50%, ${this.adjustForScreen(baseColor, -20)} 100%)`,
          description: '针对屏幕显示优化的渐变',
          usage: '适合电商产品图、网页设计',
          screenOptimized: true
        }
      ]
    }

    return sceneGradients[target] || sceneGradients.retail
  }

  /**
   * 导出渐变配置
   * @param {Object} gradient - 渐变对象
   * @param {string} format - 导出格式 ('css', 'scss', 'figma', 'ai')
   * @returns {string} 导出内容
   */
  exportGradient(gradient, format = 'css') {
    switch (format) {
      case 'css':
        return `background: ${gradient.css};`
      
      case 'scss':
        return `$gradient: ${gradient.css};\nbackground: $gradient;`
      
      case 'figma':
        return this.convertToFigmaFormat(gradient)
      
      case 'ai':
        return this.convertToAIFormat(gradient)
      
      case 'print':
        return this.convertToPrintFormat(gradient)
      
      default:
        return gradient.css
    }
  }

  /**
   * 检查渐变的印刷兼容性
   */
  checkPrintCompatibility(gradient) {
    const analysis = {
      cmykSafe: true,
      colorCount: 0,
      warnings: [],
      recommendations: []
    }

    // 提取颜色并检查
    const colors = this.extractColorsFromGradient(gradient.css)
    analysis.colorCount = colors.length

    colors.forEach(color => {
      const cmyk = this.rgbToCmyk(...this.hexToRgb(color))
      
      // 检查是否超出CMYK色域
      if (cmyk.c + cmyk.m + cmyk.y + cmyk.k > 320) {
        analysis.cmykSafe = false
        analysis.warnings.push(`颜色 ${color} 可能超出印刷色域`)
      }

      // 检查小网点问题
      if (Math.min(cmyk.c, cmyk.m, cmyk.y, cmyk.k) < 5) {
        analysis.warnings.push(`颜色 ${color} 包含过小网点，印刷时可能丢失`)
      }
    })

    // 提供建议
    if (analysis.colorCount > 6) {
      analysis.recommendations.push('建议减少渐变中的颜色数量以降低印刷成本')
    }

    if (!analysis.cmykSafe) {
      analysis.recommendations.push('建议调整颜色使其在CMYK色域内')
    }

    return analysis
  }

  // ==================== 工具函数 ====================

  hexToHsl(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return { h: 0, s: 0, l: 0 }

    let r = parseInt(result[1], 16) / 255
    let g = parseInt(result[2], 16) / 255
    let b = parseInt(result[3], 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2

    if (max === min) {
      h = s = 0
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
    h /= 360
    s /= 100
    l /= 100

    const a = s * Math.min(l, 1 - l)
    const f = n => {
      const k = (n + h * 12) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color).toString(16).padStart(2, '0')
    }

    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase()
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0]
  }

  rgbToCmyk(r, g, b) {
    r /= 255
    g /= 255
    b /= 255

    const k = 1 - Math.max(r, g, b)
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k)
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k)
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k)

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    }
  }

  adjustOpacity(color, opacity) {
    const [r, g, b] = this.hexToRgb(color)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  addPearlEffect(color) {
    const hsl = this.hexToHsl(color)
    return this.hslToHex(hsl.h, Math.max(20, hsl.s - 30), Math.min(95, hsl.l + 30))
  }

  adjustForScreen(color, adjustment = 10) {
    const hsl = this.hexToHsl(color)
    return this.hslToHex(hsl.h, hsl.s, Math.max(0, Math.min(100, hsl.l + adjustment)))
  }

  extractColorsFromGradient(css) {
    const hexRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g
    return css.match(hexRegex) || []
  }

  convertToFigmaFormat(gradient) {
    // 简化的Figma导出格式
    return JSON.stringify({
      type: 'GRADIENT_LINEAR',
      gradientStops: this.parseGradientStops(gradient.css)
    }, null, 2)
  }

  convertToAIFormat(gradient) {
    // Adobe Illustrator ASE格式提示
    return `/* Adobe Illustrator渐变代码 */\n${gradient.css}\n/* 请在AI中手动创建渐变并应用此配色方案 */`
  }

  convertToPrintFormat(gradient) {
    const colors = this.extractColorsFromGradient(gradient.css)
    let printCode = `/* 印刷渐变规格 */\n`
    
    colors.forEach((color, index) => {
      const cmyk = this.rgbToCmyk(...this.hexToRgb(color))
      printCode += `色标${index + 1}: C${cmyk.c} M${cmyk.m} Y${cmyk.y} K${cmyk.k}\n`
    })
    
    return printCode
  }

  parseGradientStops(css) {
    // 简化的渐变停止点解析
    const colors = this.extractColorsFromGradient(css)
    return colors.map((color, index) => ({
      color: color,
      position: index / (colors.length - 1)
    }))
  }
}

// 创建单例实例
export const gradientGenerator = new GradientGeneratorService()

export default GradientGeneratorService