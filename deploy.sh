#!/bin/bash

# 包装工具网站自动部署脚本
# 使用方法: ./deploy.sh

# 配置变量
REPO_URL="https://github.com/jememouse/pack-tools-v2.git"
PROJECT_NAME="pack-tools-web"
NGINX_ROOT="/var/www"
PROJECT_DIR="$NGINX_ROOT/$PROJECT_NAME"
BACKUP_DIR="/var/backups/websites"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 开始部署包装工具网站...${NC}"

# 检查是否以root权限运行
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ 此脚本需要root权限运行${NC}"
   echo "请使用: sudo ./deploy.sh"
   exit 1
fi

# 创建必要目录
echo -e "${YELLOW}📁 创建项目目录...${NC}"
mkdir -p $NGINX_ROOT
mkdir -p $BACKUP_DIR

# 备份现有项目（如果存在）
if [ -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}💾 备份现有项目...${NC}"
    BACKUP_NAME="$PROJECT_NAME-backup-$(date +%Y%m%d_%H%M%S)"
    mv $PROJECT_DIR $BACKUP_DIR/$BACKUP_NAME
    echo -e "${GREEN}✅ 备份已保存到: $BACKUP_DIR/$BACKUP_NAME${NC}"
fi

# 克隆项目
echo -e "${YELLOW}📥 从GitHub克隆项目...${NC}"
cd $NGINX_ROOT
git clone $REPO_URL $PROJECT_NAME

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 克隆项目失败${NC}"
    exit 1
fi

cd $PROJECT_DIR

# 安装依赖
echo -e "${YELLOW}📦 安装项目依赖...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 安装依赖失败${NC}"
    exit 1
fi

# 构建项目
echo -e "${YELLOW}🔨 构建生产版本...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 构建项目失败${NC}"
    exit 1
fi

# 配置Nginx
echo -e "${YELLOW}🔧 配置Nginx...${NC}"

# 创建Nginx配置文件
cat > /etc/nginx/sites-available/$PROJECT_NAME << EOF
server {
    listen 80;
    listen [::]:80;
    
    # 如果您有域名，请替换下面的 server_name
    server_name _;
    
    root $PROJECT_DIR/dist;
    index index.html;
    
    # 启用gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
    
    # 处理Vue Router的History模式
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # 隐藏Nginx版本
    server_tokens off;
}
EOF

# 启用网站
ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/

# 删除默认网站（如果存在）
if [ -f "/etc/nginx/sites-enabled/default" ]; then
    rm /etc/nginx/sites-enabled/default
fi

# 测试Nginx配置
echo -e "${YELLOW}🧪 测试Nginx配置...${NC}"
nginx -t

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Nginx配置有误${NC}"
    exit 1
fi

# 重启Nginx
echo -e "${YELLOW}🔄 重启Nginx服务...${NC}"
systemctl reload nginx

# 设置文件权限
echo -e "${YELLOW}🔒 设置文件权限...${NC}"
chown -R www-data:www-data $PROJECT_DIR/dist
chmod -R 755 $PROJECT_DIR/dist

# 获取服务器IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || hostname -I | awk '{print $1}')

echo -e "${GREEN}🎉 部署完成！${NC}"
echo -e "${GREEN}📊 部署信息:${NC}"
echo -e "   项目目录: $PROJECT_DIR"
echo -e "   Nginx配置: /etc/nginx/sites-available/$PROJECT_NAME"
echo -e "   网站根目录: $PROJECT_DIR/dist"
echo ""
echo -e "${BLUE}🌐 访问网站:${NC}"
echo -e "   HTTP: http://$SERVER_IP"
echo ""
echo -e "${YELLOW}💡 后续操作:${NC}"
echo -e "   • 如需绑定域名，请修改 /etc/nginx/sites-available/$PROJECT_NAME 中的 server_name"
echo -e "   • 建议配置SSL证书以启用HTTPS"
echo -e "   • 使用 'sudo systemctl status nginx' 检查服务状态"
echo -e "   • 使用 'sudo tail -f /var/log/nginx/access.log' 查看访问日志"