#!/bin/bash

# 快速删除脚本 - 仅删除网站文件，保留服务器环境
# 使用方法: ./quick-remove.sh

PROJECT_NAME="pack-tools-web"
PROJECT_DIR="/var/www/$PROJECT_NAME"
NGINX_CONFIG="/etc/nginx/sites-available/$PROJECT_NAME"
NGINX_ENABLED="/etc/nginx/sites-enabled/$PROJECT_NAME"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🗑️  快速删除包装工具网站${NC}"
echo -e "${YELLOW}只删除网站文件和配置，保留Nginx/Node.js等环境${NC}"
echo ""

# 检查权限
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ 需要root权限运行${NC}"
   echo "请使用: sudo ./quick-remove.sh"
   exit 1
fi

# 确认删除
read -p "确定要快速删除网站吗? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}❌ 操作已取消${NC}"
    exit 0
fi

echo -e "${YELLOW}🗑️  开始快速删除...${NC}"

# 停止相关服务
systemctl stop nginx 2>/dev/null

# 删除Nginx配置
if [ -L "$NGINX_ENABLED" ]; then
    echo "删除启用的配置..."
    rm -f "$NGINX_ENABLED"
fi

if [ -f "$NGINX_CONFIG" ]; then
    echo "删除Nginx配置文件..."
    rm -f "$NGINX_CONFIG"
fi

# 删除项目目录
if [ -d "$PROJECT_DIR" ]; then
    echo "删除项目文件..."
    rm -rf "$PROJECT_DIR"
fi

# 恢复默认站点
if [ -f "/etc/nginx/sites-available/default" ]; then
    ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/ 2>/dev/null
fi

# 重启Nginx
nginx -t && systemctl start nginx

echo -e "${GREEN}✅ 快速删除完成！${NC}"
echo -e "   • 网站文件和配置已删除"
echo -e "   • Nginx/Node.js等环境已保留"
echo -e "   • 可通过 http://$(curl -s ifconfig.me) 访问默认页面"
echo ""
echo -e "${BLUE}💡 如需重新部署，直接运行: ./deploy.sh${NC}"