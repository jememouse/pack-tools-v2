#!/bin/bash

# VPS部署环境设置脚本
# 在VPS上运行此脚本来安装必要的软件

echo "🚀 开始设置VPS部署环境..."

# 更新系统包
sudo apt update && sudo apt upgrade -y

# 安装Nginx
echo "📦 安装Nginx..."
sudo apt install nginx -y

# 安装Node.js和npm (用于构建项目)
echo "📦 安装Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装Git
echo "📦 安装Git..."
sudo apt install git -y

# 安装PM2 (如果需要运行Node.js服务)
echo "📦 安装PM2..."
sudo npm install -g pm2

# 启动Nginx服务
echo "🔧 启动Nginx服务..."
sudo systemctl start nginx
sudo systemctl enable nginx

# 检查防火墙设置
echo "🔥 配置防火墙..."
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw --force enable

# 显示安装结果
echo "✅ 环境设置完成！"
echo "📊 版本信息："
echo "Nginx: $(nginx -v)"
echo "Node.js: $(node -v)"
echo "npm: $(npm -v)"
echo "Git: $(git --version)"

echo "🌐 您的服务器IP地址是: $(curl -s ifconfig.me)"
echo "🔗 现在可以通过 http://$(curl -s ifconfig.me) 访问默认页面"