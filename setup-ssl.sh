#!/bin/bash

# SSL证书自动配置脚本 (使用Let's Encrypt)
# 使用方法: ./setup-ssl.sh your-domain.com

DOMAIN=$1
PROJECT_NAME="pack-tools-web"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

if [ -z "$DOMAIN" ]; then
    echo -e "${RED}❌ 请提供域名${NC}"
    echo "使用方法: ./setup-ssl.sh your-domain.com"
    exit 1
fi

echo -e "${BLUE}🔒 开始为 $DOMAIN 配置SSL证书...${NC}"

# 检查是否以root权限运行
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ 此脚本需要root权限运行${NC}"
   echo "请使用: sudo ./setup-ssl.sh $DOMAIN"
   exit 1
fi

# 安装Certbot
echo -e "${YELLOW}📦 安装Certbot...${NC}"
apt update
apt install snapd -y
snap install core; snap refresh core
snap install --classic certbot
ln -sf /snap/bin/certbot /usr/bin/certbot

# 获取SSL证书
echo -e "${YELLOW}🔒 获取SSL证书...${NC}"
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ SSL证书配置成功！${NC}"
    echo -e "${GREEN}🌐 现在可以通过 https://$DOMAIN 访问网站${NC}"
    
    # 设置自动续期
    echo -e "${YELLOW}⏰ 设置SSL证书自动续期...${NC}"
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
    
    echo -e "${GREEN}✅ SSL证书自动续期已设置${NC}"
else
    echo -e "${RED}❌ SSL证书配置失败${NC}"
    echo -e "${YELLOW}请检查:${NC}"
    echo -e "   • 域名 $DOMAIN 是否正确解析到此服务器"
    echo -e "   • 服务器80端口是否开放"
    echo -e "   • Nginx是否正常运行"
fi