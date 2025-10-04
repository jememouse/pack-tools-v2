/**
 * 点赞数据管理服务
 * 负责管理所有工具和知识页面的点赞数据
 */

const STORAGE_KEY = 'pack_tools_likes'
const USER_LIKES_KEY = 'pack_tools_user_likes'

/**
 * 获取所有点赞数据
 * @returns {Object} 点赞数据对象
 */
export function getAllLikes() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error('获取点赞数据失败:', error)
    return {}
  }
}

/**
 * 获取用户点赞记录
 * @returns {Array} 用户已点赞的项目ID列表
 */
export function getUserLikes() {
  try {
    const data = localStorage.getItem(USER_LIKES_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('获取用户点赞记录失败:', error)
    return []
  }
}

/**
 * 获取指定项目的点赞数
 * @param {string} itemId - 项目ID
 * @returns {number} 点赞数
 */
export function getLikeCount(itemId) {
  const allLikes = getAllLikes()
  return allLikes[itemId] || 0
}

/**
 * 检查用户是否已点赞
 * @param {string} itemId - 项目ID
 * @returns {boolean} 是否已点赞
 */
export function isLiked(itemId) {
  const userLikes = getUserLikes()
  return userLikes.includes(itemId)
}

/**
 * 切换点赞状态
 * @param {string} itemId - 项目ID
 * @returns {Object} 包含新的点赞状态和点赞数的对象
 */
export function toggleLike(itemId) {
  try {
    const allLikes = getAllLikes()
    const userLikes = getUserLikes()
    const currentlyLiked = userLikes.includes(itemId)
    
    if (currentlyLiked) {
      // 取消点赞
      const newUserLikes = userLikes.filter(id => id !== itemId)
      const newCount = Math.max(0, (allLikes[itemId] || 0) - 1)
      
      allLikes[itemId] = newCount
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allLikes))
      localStorage.setItem(USER_LIKES_KEY, JSON.stringify(newUserLikes))
      
      return {
        liked: false,
        count: newCount
      }
    } else {
      // 添加点赞
      const newUserLikes = [...userLikes, itemId]
      const newCount = (allLikes[itemId] || 0) + 1
      
      allLikes[itemId] = newCount
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allLikes))
      localStorage.setItem(USER_LIKES_KEY, JSON.stringify(newUserLikes))
      
      return {
        liked: true,
        count: newCount
      }
    }
  } catch (error) {
    console.error('切换点赞状态失败:', error)
    return {
      liked: false,
      count: 0
    }
  }
}

/**
 * 批量设置初始点赞数（用于初始化数据）
 * @param {Object} initialData - 初始点赞数据 { itemId: count }
 */
export function setInitialLikes(initialData) {
  try {
    const currentData = getAllLikes()
    const mergedData = { ...currentData }
    
    // 只设置当前没有数据的项目
    for (const [itemId, count] of Object.entries(initialData)) {
      if (!(itemId in mergedData)) {
        mergedData[itemId] = count
      }
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData))
  } catch (error) {
    console.error('设置初始点赞数据失败:', error)
  }
}

/**
 * 获取热门工具列表（按点赞数排序）
 * @param {number} limit - 返回数量限制
 * @returns {Array} 热门项目列表
 */
export function getPopularItems(limit = 10) {
  const allLikes = getAllLikes()
  return Object.entries(allLikes)
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

/**
 * 清空所有点赞数据（仅用于开发调试）
 */
export function clearAllLikes() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(USER_LIKES_KEY)
  } catch (error) {
    console.error('清空点赞数据失败:', error)
  }
}

// 初始化一些示例数据（首次使用时）
export function initializeDefaultLikes() {
  const currentData = getAllLikes()
  
  // 如果没有任何数据，设置一些初始值
  if (Object.keys(currentData).length === 0) {
    const defaultLikes = {
      'qr-code-generator': 128,
      'unit-converter': 95,
      'volume-weight-calculator': 87,
      'simple-layout-calculator': 76,
      'color-mode-converter': 64,
      'color-difference': 45,
      'color-recommendation': 38,
      'packaging-icons': 52,
      'paper-weight-thickness-converter': 41,
      'packaging-material-database': 33,
      'prepress-checklist': 29,
      'project-timeline-estimator': 25,
      'calculator': 15,
      // 知识库
      'knowledge-rgb-vs-cmyk': 89,
      'knowledge-delta-e': 72,
      'knowledge-bleed': 68,
      'knowledge-grammage-thickness': 55,
      'knowledge-materials-overview': 47,
      'knowledge-fsc': 34,
      'knowledge-packaging-standards': 28,
      'knowledge-product-packaging-lifecycle': 22
    }
    
    setInitialLikes(defaultLikes)
  }
}