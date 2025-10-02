#!/bin/bash

# 包装工具网站卸载脚本
# 使用方法: ./uninstall.sh [--keep-nginx] [--keep-ssl] [--backup]

PROJECT_NAME="pack-tools-web"
PROJECT_DIR="/var/www/$PROJECT_NAME"
NGINX_CONFIG="/etc/nginx/sites-available/$PROJECT_NAME"
NGINX_ENABLED="/etc/nginx/sites-enabled/$PROJECT_NAME"
BACKUP_DIR="/var/backups/websites"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 参数解析
KEEP_NGINX=false
KEEP_SSL=false
CREATE_BACKUP=false

for arg in "$@"; do
    case $arg in
        --keep-nginx)
            KEEP_NGINX=true
            shift
            ;;
        --keep-ssl)
            KEEP_SSL=true
            shift
            ;;
        --backup)
            CREATE_BACKUP=true
            shift
            ;;
        --help|-h)
            echo -e "${BLUE}包装工具网站卸载脚本${NC}"
            echo ""
            echo "使用方法: ./uninstall.sh [选项]"
            echo ""
            echo "选项:"
            echo "  --keep-nginx    保留Nginx服务器（不卸载Nginx）"
            echo "  --keep-ssl      保留SSL证书（不删除证书）"
            echo "  --backup        创建完整备份后再删除"
            echo "  --help, -h      显示此帮助信息"
            echo ""
            echo "示例:"
            echo "  ./uninstall.sh                    # 完全卸载"
            echo "  ./uninstall.sh --keep-nginx       # 卸载但保留Nginx"
            echo "  ./uninstall.sh --backup           # 备份后卸载"
            exit 0
            ;;
    esac
done

echo -e "${RED}⚠️  包装工具网站卸载程序${NC}"
echo -e "${YELLOW}此操作将删除网站文件和配置${NC}"
echo ""

# 检查是否以root权限运行
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ 此脚本需要root权限运行${NC}"
   echo "请使用: sudo ./uninstall.sh"
   exit 1
fi

# 显示将要删除的内容
echo -e "${CYAN}📋 卸载计划:${NC}"
if [ -d "$PROJECT_DIR" ]; then
    echo -e "   • 项目目录: $PROJECT_DIR"
fi
if [ -f "$NGINX_CONFIG" ]; then
    echo -e "   • Nginx配置: $NGINX_CONFIG"
fi
if [ -L "$NGINX_ENABLED" ]; then
    echo -e "   • 启用的配置: $NGINX_ENABLED"
fi

# SSL证书检查
SSL_DOMAIN=""
if [ -f "$NGINX_CONFIG" ]; then
    SSL_DOMAIN=$(grep "ssl_certificate" "$NGINX_CONFIG" | head -1 | grep -o "/etc/letsencrypt/live/[^/]*" | cut -d'/' -f5)
fi

if [ ! -z "$SSL_DOMAIN" ] && [ "$KEEP_SSL" = false ]; then
    echo -e "   • SSL证书: $SSL_DOMAIN"
fi

if [ "$KEEP_NGINX" = false ]; then
    echo -e "   • Nginx服务器及其配置"
fi

echo ""

# 二次确认
echo -e "${YELLOW}⚠️  确认卸载选项:${NC}"
echo -e "   保留Nginx服务器: $([ "$KEEP_NGINX" = true ] && echo -e "${GREEN}是${NC}" || echo -e "${RED}否${NC}")"
echo -e "   保留SSL证书: $([ "$KEEP_SSL" = true ] && echo -e "${GREEN}是${NC}" || echo -e "${RED}否${NC}")"
echo -e "   创建备份: $([ "$CREATE_BACKUP" = true ] && echo -e "${GREEN}是${NC}" || echo -e "${RED}否${NC}")"
echo ""

read -p "确定要继续卸载吗? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}❌ 卸载已取消${NC}"
    exit 0
fi

echo -e "${RED}🗑️  开始卸载...${NC}"

# 创建备份（如果需要）
if [ "$CREATE_BACKUP" = true ] && [ -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}💾 创建完整备份...${NC}"
    mkdir -p "$BACKUP_DIR"
    BACKUP_NAME="$PROJECT_NAME-full-backup-$(date +%Y%m%d_%H%M%S)"
    cp -r "$PROJECT_DIR" "$BACKUP_DIR/$BACKUP_NAME"
    
    # 备份Nginx配置
    if [ -f "$NGINX_CONFIG" ]; then
        cp "$NGINX_CONFIG" "$BACKUP_DIR/$BACKUP_NAME/"
    fi
    
    echo -e "${GREEN}✅ 备份已保存到: $BACKUP_DIR/$BACKUP_NAME${NC}"
fi

# 停止Nginx（临时）
echo -e "${YELLOW}⏸️  临时停止Nginx服务...${NC}"
systemctl stop nginx

# 删除网站启用的配置链接
if [ -L "$NGINX_ENABLED" ]; then
    echo -e "${YELLOW}🔗 删除Nginx启用配置...${NC}"
    rm -f "$NGINX_ENABLED"
fi

# 删除Nginx配置文件
if [ -f "$NGINX_CONFIG" ]; then
    echo -e "${YELLOW}📝 删除Nginx配置文件...${NC}"
    rm -f "$NGINX_CONFIG"
fi

# 删除SSL证书（如果选择删除）
if [ ! -z "$SSL_DOMAIN" ] && [ "$KEEP_SSL" = false ]; then
    echo -e "${YELLOW}🔒 删除SSL证书...${NC}"
    if command -v certbot >/dev/null 2>&1; then
        certbot delete --cert-name "$SSL_DOMAIN" --non-interactive
        # 删除自动续期的cron任务
        crontab -l | grep -v "certbot renew" | crontab -
    fi
fi

# 删除项目目录
if [ -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}📁 删除项目目录...${NC}"
    rm -rf "$PROJECT_DIR"
fi

# 恢复默认Nginx站点（如果保留Nginx）
if [ "$KEEP_NGINX" = true ]; then
    if [ -f "/etc/nginx/sites-available/default" ] && [ ! -L "/etc/nginx/sites-enabled/default" ]; then
        echo -e "${YELLOW}🔄 恢复默认Nginx站点...${NC}"
        ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/
    fi
    
    # 测试Nginx配置
    nginx -t
    if [ $? -eq 0 ]; then
        echo -e "${YELLOW}🔄 重启Nginx服务...${NC}"
        systemctl start nginx
        systemctl reload nginx
    else
        echo -e "${RED}❌ Nginx配置有误，请检查${NC}"
    fi
else
    # 完全卸载Nginx
    echo -e "${YELLOW}📦 卸载Nginx服务器...${NC}"
    systemctl stop nginx
    systemctl disable nginx
    apt-get remove --purge nginx nginx-common nginx-core -y
    apt-get autoremove -y
    
    # 删除Nginx配置目录
    rm -rf /etc/nginx
    rm -rf /var/log/nginx
    rm -rf /var/www/html
fi

# 卸载Node.js、npm等（询问用户）
echo ""
read -p "是否也要卸载Node.js和相关工具? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}📦 卸载Node.js和相关工具...${NC}"
    
    # 卸载全局安装的npm包
    if command -v npm >/dev/null 2>&1; then
        npm uninstall -g pm2 2>/dev/null
    fi
    
    # 卸载Node.js
    apt-get remove --purge nodejs npm -y
    apt-get autoremove -y
    
    # 删除npm全局目录
    rm -rf /usr/local/lib/node_modules
    rm -rf ~/.npm
fi

# 清理防火墙规则（询问用户）
echo ""
read -p "是否要移除防火墙中的HTTP/HTTPS规则? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🔥 移除防火墙规则...${NC}"
    ufw delete allow 'Nginx Full' 2>/dev/null
    ufw delete allow 'Nginx HTTP' 2>/dev/null
    ufw delete allow 'Nginx HTTPS' 2>/dev/null
    ufw delete allow 80/tcp 2>/dev/null
    ufw delete allow 443/tcp 2>/dev/null
fi

echo ""
echo -e "${GREEN}🎉 卸载完成！${NC}"
echo ""
echo -e "${BLUE}📊 卸载摘要:${NC}"

if [ "$CREATE_BACKUP" = true ]; then
    echo -e "${GREEN}   ✅ 已创建完整备份${NC}"
fi

if [ "$KEEP_NGINX" = true ]; then
    echo -e "${GREEN}   ✅ 已保留Nginx服务器${NC}"
    echo -e "      可通过 http://$(curl -s ifconfig.me) 访问默认页面"
else
    echo -e "${RED}   ❌ 已完全卸载Nginx${NC}"
fi

if [ "$KEEP_SSL" = true ] && [ ! -z "$SSL_DOMAIN" ]; then
    echo -e "${GREEN}   ✅ 已保留SSL证书: $SSL_DOMAIN${NC}"
elif [ ! -z "$SSL_DOMAIN" ]; then
    echo -e "${RED}   ❌ 已删除SSL证书: $SSL_DOMAIN${NC}"
fi

echo -e "${RED}   ❌ 已删除网站文件和配置${NC}"

if [ -d "$BACKUP_DIR" ] && [ "$(ls -A $BACKUP_DIR 2>/dev/null)" ]; then
    echo ""
    echo -e "${CYAN}💾 可用的备份:${NC}"
    ls -la "$BACKUP_DIR" | grep "$PROJECT_NAME" | awk '{print "   " $9 " (" $5 " bytes, " $6 " " $7 " " $8 ")"}'
fi

echo ""
echo -e "${YELLOW}💡 提示:${NC}"
echo -e "   • 如需重新部署，运行: ./deploy.sh"
echo -e "   • 备份文件保存在: $BACKUP_DIR"
echo -e "   • 系统清理完成，可安全重用服务器"