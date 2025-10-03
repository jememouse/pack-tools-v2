# 项目管理脚本

## 版本管理

### 🚀 快速发布（推荐）
```bash
# 一键发布 - 包含版本更新、CHANGELOG、推送、GitHub Release
./scripts/release_helper.sh patch "修复SEO问题和样式优化"
./scripts/release_helper.sh minor "新增二维码生成器功能"
./scripts/release_helper.sh major "重构整体架构"
```

### 🔧 手动版本管理
```bash
# 仅更新版本号和标签（需要手动推送）
./scripts/version_manager.sh patch   # v0.1.0 -> v0.1.1
./scripts/version_manager.sh minor   # v0.1.1 -> v0.2.0
./scripts/version_manager.sh major   # v0.2.0 -> v1.0.0

# 查看当前版本信息
./scripts/version_manager.sh
```

### 📋 版本发布建议
- **patch**: bug修复、SEO优化、样式调整、文档更新
- **minor**: 新功能、新页面、新工具
- **major**: 重大重构、API变更、破坏性更新

## SEO 检查

### 基础检查
```bash
# 检查线上站点
BASE_URL=https://tools.heyijiapack.com ./scripts/seo_check.sh

# 检查本地开发服务器
BASE_URL=http://localhost:5173 ./scripts/seo_check.sh
```

### CI/CD 集成
在 GitHub Actions workflow 中添加：
```yaml
- name: SEO Check
  run: BASE_URL=https://tools.heyijiapack.com ./scripts/seo_check.sh
```

## 检查项目

### SEO 检查项
- ✅ **HTTP 状态码**：检查返回 200/3xx
- ✅ **基础 meta 标签**：
  - `<title>` 标签存在
  - `<meta name="description">` 存在
  - `<link rel="canonical">` 存在
  - Open Graph `og:title` 存在
  - JSON-LD 结构化数据存在
- ✅ **SEO 文件**：
  - `robots.txt` 可访问
  - `sitemap.xml` 可访问

### 版本管理功能
- ✅ 自动更新 package.json 版本号
- ✅ 创建语义化 Git 标签
- ✅ 自动更新 CHANGELOG.md
- ✅ 推送到远程仓库
- ✅ 创建 GitHub Release

## 使用示例

### 典型发布流程
```bash
# 1. 开发完成后，运行测试
npm run build

# 2. SEO 检查
BASE_URL=https://tools.heyijiapack.com ./scripts/seo_check.sh

# 3. 一键发布
./scripts/release_helper.sh minor "新增包装材料数据库和计算器优化"

# 完成！自动完成版本号更新、CHANGELOG、推送、GitHub Release
```

### 紧急修复发布
```bash
# 快速修复发布
./scripts/release_helper.sh patch "修复关键SEO配置错误"
```

## 安全性

- ✅ 所有脚本均为只读或安全操作
- ✅ 版本更新前需要用户确认
- ✅ SEO 检查仅执行 HTTP GET/HEAD 请求
- ✅ 不涉及敏感数据处理

## 返回码

- **seo_check.sh**: 
  - `0`: 检查通过（可能有警告）
  - `2`: 有关键项目失败
- **version_manager.sh/release_helper.sh**: 
  - `0`: 成功
  - `1`: 用户取消或参数错误
