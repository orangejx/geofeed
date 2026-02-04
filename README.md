# Geofeed Cloudflare Pages

一个简单的 Cloudflare Pages 项目，提供 geofeed.csv 文件访问。

## 作者

Aldrich J. Xing
- Email: aldrichx@wlms.dev
- Website: https://wlms.dev

## 功能

- 提供静态 geofeed.csv 文件
- 服务端渲染（SSR）优化 SEO
- 美观的首页展示 GeoFeed 信息
- 通过 config.json 配置站点信息
- 完整的 SEO meta 标签和结构化数据
- 所有未定义路径都重定向到 geofeed.csv

## 部署

本项目是纯静态站点，无需编译构建。

### 部署到 Cloudflare Pages

1. 将此仓库推送到 GitHub：
   ```bash
   git remote add origin https://github.com/orangejx/geofeed.git
   git branch -M main
   git push -u origin main
   ```

2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)

3. 进入 Pages 页面，点击 "Create a project"

4. 连接 GitHub 仓库并选择 `orangejx/geofeed`

5. 配置构建设置：
   - **Framework preset**: None
   - **Build command**: 留空（无需构建）
   - **Build output directory**: `/`（根目录）
   - **Root directory**: `/`（根目录）

6. 点击 "Save and Deploy"

7. 部署完成后，Cloudflare Pages 会自动：
   - 识别 `functions/` 目录并启用服务端渲染
   - 应用 `_headers` 文件中的缓存策略
   - 应用 `_redirects` 文件中的重定向规则

### 自定义域名（可选）

在 Cloudflare Pages 项目设置中，可以添加自定义域名（如 `geofeed.wlms.dev`）。

### 更新部署

每次推送到 `main` 分支，Cloudflare Pages 会自动重新部署。无需手动操作。

## 配置

编辑 `config.json` 文件来自定义站点信息：

- `owner` - 所有者信息（姓名、邮箱、网站）
- `asn` - ASN 相关信息
- `geofeed` - GeoFeed 数据配置
- `links` - 相关链接（GitHub、PeeringDB 等）

## 文件说明

- `index.html` - 静态首页模板
- `assets/style.css` - 样式文件（长期缓存）
- `assets/script.js` - 脚本文件（长期缓存）
- `functions/index.js` - Cloudflare Pages Function，实现服务端渲染
- `geofeed.csv` - 主要的 geofeed 数据文件
- `config.json` - 站点配置文件
- `_redirects` - Cloudflare Pages 重定向规则
- `_headers` - HTTP 响应头配置，优化缓存策略

## 开源协议

本项目采用 MIT License 开源协议。允许修改和商用，但必须保留版权声明和许可声明。
