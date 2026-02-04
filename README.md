# Geofeed Cloudflare Pages

一个简单的 Cloudflare Pages 项目，提供 geofeed.csv 文件访问。

## 作者

Aldrich J. Xing
- Email: aldrichx@wlms.dev
- Website: https://wlms.dev

## 功能

- 提供静态 geofeed.csv 文件
- 所有路径都重定向到 geofeed.csv

## 部署

1. 将此仓库推送到 GitHub
2. 在 Cloudflare Pages 中连接此仓库
3. 部署设置：
   - 构建命令：留空
   - 构建输出目录：`/`
   - 根目录：`/`

## 文件说明

- `geofeed.csv` - 主要的 geofeed 数据文件
- `_redirects` - Cloudflare Pages 重定向规则

## 开源协议

本项目采用 MIT License 开源协议。允许修改和商用，但必须保留版权声明和许可声明。
