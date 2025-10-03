# SEO 检查工具

## 使用方法

### 本地检查
```bash
# 检查线上站点
BASE_URL=https://tools.heyijiapack.com ./scripts/seo_check.sh

# 检查本地开发服务器
BASE_URL=http://localhost:5173 ./scripts/seo_check.sh
```

### CI/CD 中使用
在 GitHub Actions workflow 中添加：
```yaml
- name: SEO Check
  run: BASE_URL=https://tools.heyijiapack.com ./scripts/seo_check.sh
```

## 检查项目

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

## 返回码

- `0`: 所有检查通过（可能有警告）
- `2`: 有关键项目失败

## 输出示例

```
==> Checking: https://tools.heyijiapack.com
[OK] Status OK (200/3xx)
[OK] <title> present
[OK] meta description present
[OK] canonical present
[OK] OG title present
[WARN] JSON-LD missing
[OK] robots.txt accessible
[OK] sitemap.xml accessible

==> Summary: OK=7 WARN=1 FAIL=0
```

## 安全性

- 仅执行只读 HTTP GET/HEAD 请求
- 不修改任何服务器内容
- 不发送任何敏感数据
