// Cloudflare Pages Function - 处理所有路径
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;
  
  // 根路径 - 服务端渲染首页
  if (path === '/' || path === '/index.html') {
    try {
      // 获取配置文件
      const configResponse = await context.env.ASSETS.fetch(new URL('/config.json', context.request.url));
      const config = await configResponse.json();
      
      // 获取 HTML 模板
      const htmlResponse = await context.env.ASSETS.fetch(new URL('/index.html', context.request.url));
      let html = await htmlResponse.text();
      
      // 服务端渲染：替换 HTML 中的占位符
      html = html
        .replace(
          /<title>.*?<\/title>/,
          `<title>AS${config.asn.number.replace('AS', '')} GeoFeed - ${config.owner.name} | RFC 8805 IP 地理位置数据</title>`
        )
        .replace(
          /<meta name="description" content=".*?">/,
          `<meta name="description" content="AS${config.asn.number.replace('AS', '')} (${config.asn.name}) 的官方 GeoFeed 数据发布站点，${config.asn.description}">`
        )
        .replace(
          /<meta property="og:title" content=".*?">/,
          `<meta property="og:title" content="AS${config.asn.number.replace('AS', '')} GeoFeed - ${config.owner.name}">`
        )
        .replace(
          /<meta property="og:description" content=".*?">/,
          `<meta property="og:description" content="${config.asn.description}">`
        )
        .replace(
          /<meta name="twitter:title" content=".*?">/,
          `<meta name="twitter:title" content="AS${config.asn.number.replace('AS', '')} GeoFeed - ${config.owner.name}">`
        )
        .replace(
          /<meta name="twitter:description" content=".*?">/,
          `<meta name="twitter:description" content="${config.asn.description}">`
        )
        .replace(
          /"name": "Aldrich J\. Xing"/g,
          `"name": "${config.owner.name}"`
        )
        .replace(
          /"email": "aldrichx@wlms\.dev"/,
          `"email": "${config.owner.email}"`
        )
        .replace(
          /"url": "https:\/\/wlms\.dev"/,
          `"url": "${config.owner.website}"`
        )
        .replace(
          /<span class="info-value" id="asn-number">AS214242<\/span>/,
          `<span class="info-value" id="asn-number">${config.asn.number}</span>`
        )
        .replace(
          /<span class="info-value" id="asn-name">Aldrich J\. Xing<\/span>/,
          `<span class="info-value" id="asn-name">${config.asn.name}</span>`
        )
        .replace(
          /<span class="info-value" id="asn-description">.*?<\/span>/,
          `<span class="info-value" id="asn-description">${config.asn.description}</span>`
        )
        .replace(
          /<span class="info-value" id="update-frequency">Daily<\/span>/,
          `<span class="info-value" id="update-frequency">${config.geofeed.updateFrequency}</span>`
        )
        .replace(
          /<span class="info-value" id="last-update">2026-02-04<\/span>/,
          `<span class="info-value" id="last-update">${config.geofeed.lastUpdate}</span>`
        )
        .replace(
          /<a href="https:\/\/wlms\.dev" id="website-link"/,
          `<a href="${config.owner.website}" id="website-link"`
        )
        .replace(
          /<a href="https:\/\/github\.com\/orangejx\/geofeed" id="github-link"/,
          `<a href="${config.links.github}" id="github-link"`
        )
        .replace(
          /<a href="https:\/\/www\.peeringdb\.com\/asn\/214242" id="peeringdb-link"/,
          `<a href="${config.links.peeringdb}" id="peeringdb-link"`
        )
        .replace(
          /<span id="footer-name">Aldrich J\. Xing<\/span>/,
          `<span id="footer-name">${config.owner.name}</span>`
        )
        .replace(
          /<a href="mailto:aldrichx@wlms\.dev" id="email-link">aldrichx@wlms\.dev<\/a>/,
          `<a href="mailto:${config.owner.email}" id="email-link">${config.owner.email}</a>`
        );
      
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } catch (error) {
      return context.env.ASSETS.fetch(context.request);
    }
  }
  
  // 允许的静态资源路径
  const allowedPaths = [
    '/geofeed.csv',
    '/config.json',
  ];
  
  // 允许的路径前缀
  const allowedPrefixes = [
    '/assets/',
  ];
  
  // 检查是否是允许的路径
  if (allowedPaths.includes(path) || allowedPrefixes.some(prefix => path.startsWith(prefix))) {
    return context.env.ASSETS.fetch(context.request);
  }
  
  // 其他所有路径重定向到 geofeed.csv
  return context.env.ASSETS.fetch(new URL('/geofeed.csv', context.request.url));
}
