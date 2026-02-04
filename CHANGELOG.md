# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-02-04

### Added
- 独立的 CSS 文件 (`assets/style.css`) 用于样式管理
- 独立的 JS 文件 (`assets/script.js`) 用于脚本管理
- `_headers` 配置文件，优化静态资源缓存策略
  - 静态资源（CSS/JS）缓存 1 年
  - 配置文件和数据缓存 1 小时
- 完整的 SEO 优化
  - Meta 标签（description, keywords, author）
  - Open Graph 标签（Facebook 分享优化）
  - Twitter Card 标签
  - JSON-LD 结构化数据
  - Canonical URL
- Cloudflare Pages Function 实现服务端渲染（SSR）
- 配置文件 (`config.json`) 支持动态内容管理
- `CHANGELOG.md` - 版本更新日志

### Changed
- 将内联 CSS 和 JS 移至独立文件，提升缓存效率
- 优化页面加载性能和 SEO 表现

### Improved
- 浏览器缓存策略，减少带宽消耗
- 搜索引擎优化，提升网站可见性

## [1.0.0] - 2026-02-04

### Added
- 初始项目结构
- `geofeed.csv` - RFC 8805 标准的 GeoFeed 数据文件
- `index.html` - 静态首页，展示 AS214242 信息
- `_redirects` - Cloudflare Pages 重定向规则
- `.gitignore` - Git 忽略文件配置
- `LICENSE` - MIT 开源协议
- `README.md` - 项目说明文档
- AS214242 基本信息配置
  - ASN: AS214242
  - 所有者: Aldrich J. Xing
  - 描述: 个人实验性网络，用于学习和研究互联网路由、BGP 协议及网络地理位置信息发布

### Features
- 提供符合 RFC 8805 标准的 GeoFeed 数据
- 美观的响应式首页设计
- 支持移动端访问
- 集成 GitHub 和 PeeringDB 链接

[1.0.1]: https://github.com/orangejx/geofeed/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/orangejx/geofeed/releases/tag/v1.0.0
