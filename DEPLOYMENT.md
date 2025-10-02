# 包装工具网站 VPS 部署指南

本指南将帮助您将包装工具网站部署到您的VPS服务器上。

## 📋 前置要求

- Ubuntu 18.04+ 或 Debian 9+ VPS服务器
- Root权限或sudo权限
- 服务器已开放80和443端口
- (可选) 域名解析到服务器IP

## 🚀 快速部署

### 步骤1: 连接到VPS

```bash
ssh root@your-vps-ip
# 或使用您的用户名
ssh username@your-vps-ip
```

### 步骤2: 下载部署脚本

```bash
# 克隆项目到临时目录
git clone https://github.com/jememouse/pack-tools-v2.git /tmp/pack-tools-web
cd /tmp/pack-tools-web
```

### 步骤3: 设置服务器环境

```bash
# 运行环境设置脚本
sudo ./deploy-setup.sh
```

这个脚本会安装：
- ✅ Nginx web服务器
- ✅ Node.js 18.x
- ✅ Git版本控制
- ✅ PM2进程管理器
- ✅ 配置防火墙规则

### 步骤4: 部署网站

```bash
# 运行自动部署脚本
sudo ./deploy.sh
```

部署脚本会自动：
- 📥 从GitHub克隆最新代码
- 📦 安装项目依赖
- 🔨 构建生产版本
- 🔧 配置Nginx
- 🔒 设置文件权限
- 🌐 启动网站服务

### 步骤5: 访问网站

部署完成后，您可以通过以下方式访问网站：

```
http://your-server-ip
```

## 🔒 配置SSL证书 (可选但推荐)

如果您有域名，强烈建议配置SSL证书：

```bash
# 首先在DNS中将域名指向您的服务器IP
# 然后运行SSL配置脚本
sudo ./setup-ssl.sh your-domain.com
```

配置成功后，您可以通过HTTPS访问：
```
https://your-domain.com
```

## 🔄 更新网站

当您对网站进行了更改并推送到GitHub后，可以使用更新脚本：

```bash
cd /var/www/pack-tools-web
sudo ./update.sh
```

## 📁 项目结构

```
/var/www/pack-tools-web/
├── dist/                 # 构建后的静态文件 (Nginx服务目录)
├── src/                  # Vue.js源代码
├── package.json          # 项目依赖配置
├── vite.config.js        # Vite构建配置
└── ...

/etc/nginx/sites-available/pack-tools-web  # Nginx配置文件
/var/log/nginx/           # Nginx日志文件
```

## 🛠️ 常用命令

### 检查服务状态
```bash
# 检查Nginx状态
sudo systemctl status nginx

# 检查Nginx配置是否正确
sudo nginx -t

# 重新加载Nginx配置
sudo systemctl reload nginx
```

### 查看日志
```bash
# 查看访问日志
sudo tail -f /var/log/nginx/access.log

# 查看错误日志
sudo tail -f /var/log/nginx/error.log
```

### 文件权限
```bash
# 如果遇到权限问题
sudo chown -R www-data:www-data /var/www/pack-tools-web/dist
sudo chmod -R 755 /var/www/pack-tools-web/dist
```

## 🔧 自定义配置

### 绑定域名

编辑Nginx配置文件：
```bash
sudo nano /etc/nginx/sites-available/pack-tools-web
```

修改 `server_name` 行：
```nginx
server_name your-domain.com www.your-domain.com;
```

重新加载Nginx：
```bash
sudo systemctl reload nginx
```

### 修改端口

如果需要使用其他端口，修改Nginx配置中的 `listen` 指令：
```nginx
listen 8080;  # 改为您需要的端口
```

## 🔍 故障排除

### 网站无法访问
1. 检查Nginx是否运行：`sudo systemctl status nginx`
2. 检查防火墙设置：`sudo ufw status`
3. 检查端口是否开放：`netstat -tlnp | grep :80`

### 构建失败
1. 检查Node.js版本：`node -v`
2. 清理npm缓存：`npm cache clean --force`
3. 删除node_modules后重新安装：`rm -rf node_modules && npm install`

### SSL证书问题
1. 确认域名解析正确：`nslookup your-domain.com`
2. 检查防火墙是否开放443端口
3. 查看Certbot日志：`sudo tail -f /var/log/letsencrypt/letsencrypt.log`

## 📞 技术支持

如果在部署过程中遇到问题，请检查：

1. **系统要求**：确保使用支持的操作系统版本
2. **权限问题**：确保以root权限或sudo权限运行脚本
3. **网络问题**：确保服务器可以访问外网和GitHub
4. **端口开放**：确保80和443端口在防火墙中开放

## 🎯 性能优化建议

1. **启用Gzip压缩**：已在Nginx配置中启用
2. **设置缓存策略**：静态资源缓存1年
3. **使用CDN**：考虑使用CDN加速静态资源
4. **监控性能**：使用工具如htop监控服务器性能

---

**恭喜！** 🎉 您的包装工具网站现在已经成功部署在VPS上了！