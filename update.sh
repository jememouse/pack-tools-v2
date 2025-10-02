#!/bin/bash

# 包装工具网站更新脚本
# 使用方法: ./update.sh

# 配置变量
PROJECT_NAME="pack-tools-web"
PROJECT_DIR="/var/www/$PROJECT_NAME"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 开始更新包装工具网站...${NC}"

# 检查项目目录是否存在
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}❌ 项目目录不存在: $PROJECT_DIR${NC}"
    echo -e "${YELLOW}请先运行部署脚本: ./deploy.sh${NC}"
    exit 1
fi

# 检查是否以root权限运行
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ 此脚本需要root权限运行${NC}"
   echo "请使用: sudo ./update.sh"
   exit 1
fi

cd $PROJECT_DIR

# 拉取最新代码
echo -e "${YELLOW}📥 拉取最新代码...${NC}"
git fetch origin main

# 检查是否有更新
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ $LOCAL = $REMOTE ]; then
    echo -e "${GREEN}✅ 代码已是最新版本，无需更新${NC}"
    exit 0
fi

echo -e "${YELLOW}📋 发现新的更新...${NC}"
git log --oneline HEAD..origin/main

echo -e "${YELLOW}🔄 应用更新...${NC}"
git reset --hard origin/main

# 检查package.json是否有变化
if git diff HEAD~1 HEAD --name-only | grep -q "package.json"; then
    echo -e "${YELLOW}📦 检测到依赖变化，重新安装...${NC}"
    npm install
fi

# 重新构建项目
echo -e "${YELLOW}🔨 重新构建项目...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 构建失败${NC}"
    exit 1
fi

# 设置文件权限
echo -e "${YELLOW}🔒 更新文件权限...${NC}"
chown -R www-data:www-data dist
chmod -R 755 dist

# 重新加载Nginx
echo -e "${YELLOW}🔄 重新加载Nginx...${NC}"
systemctl reload nginx

# 获取服务器IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || hostname -I | awk '{print $1}')

echo -e "${GREEN}🎉 更新完成！${NC}"
echo -e "${BLUE}🌐 访问网站: http://$SERVER_IP${NC}"

# 显示最新的提交信息
echo -e "${YELLOW}📊 最新更新内容:${NC}"
git log -1 --pretty=format:"   提交: %h%n   作者: %an%n   时间: %ad%n   信息: %s" --date=local