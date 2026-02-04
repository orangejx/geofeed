// 加载配置文件并更新页面内容
fetch('/config.json')
    .then(response => response.json())
    .then(config => {
        // 更新所有者信息
        const ownerNameEl = document.getElementById('owner-name');
        if (ownerNameEl) {
            ownerNameEl.textContent = `${config.owner.name} 的个人 GeoFeed 站点`;
        }
        
        const footerNameEl = document.getElementById('footer-name');
        if (footerNameEl) {
            footerNameEl.textContent = config.owner.name;
        }
        
        const emailLinkEl = document.getElementById('email-link');
        if (emailLinkEl) {
            emailLinkEl.href = `mailto:${config.owner.email}`;
            emailLinkEl.textContent = config.owner.email;
        }
        
        // 更新 ASN 信息
        const asnNumberEl = document.getElementById('asn-number');
        if (asnNumberEl) {
            asnNumberEl.textContent = config.asn.number;
        }
        
        const asnNameEl = document.getElementById('asn-name');
        if (asnNameEl) {
            asnNameEl.textContent = config.asn.name;
        }
        
        const asnDescEl = document.getElementById('asn-description');
        if (asnDescEl) {
            asnDescEl.textContent = config.asn.description;
        }
        
        // 更新 GeoFeed 信息
        const updateFreqEl = document.getElementById('update-frequency');
        if (updateFreqEl) {
            updateFreqEl.textContent = config.geofeed.updateFrequency;
        }
        
        const lastUpdateEl = document.getElementById('last-update');
        if (lastUpdateEl) {
            lastUpdateEl.textContent = config.geofeed.lastUpdate;
        }
        
        const downloadLinkEl = document.getElementById('download-link');
        if (downloadLinkEl) {
            downloadLinkEl.href = config.geofeed.url;
        }
        
        // 更新链接
        const websiteLinkEl = document.getElementById('website-link');
        if (websiteLinkEl) {
            websiteLinkEl.href = config.owner.website;
        }
        
        const githubLinkEl = document.getElementById('github-link');
        if (githubLinkEl) {
            githubLinkEl.href = config.links.github;
        }
        
        const peeringdbLinkEl = document.getElementById('peeringdb-link');
        if (peeringdbLinkEl) {
            peeringdbLinkEl.href = config.links.peeringdb;
        }
    })
    .catch(error => {
        console.error('加载配置文件失败:', error);
    });
