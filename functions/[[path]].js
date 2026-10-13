const languages = new Set(['en-GB', 'zh-cn', 'de-DE', 'fr-FR', 'it-IT', 'es-ES']);

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const language = url.pathname.slice(1);
  if (language.endsWith('/') && languages.has(language.slice(0, -1))) {
    url.pathname = `/${language.slice(0, -1)}`;
    return Response.redirect(url, 308);
  }
  if (!languages.has(language)) {
    return new Response('Not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  try {
    const asset = path => context.env.ASSETS.fetch(new URL(path, context.request.url));
    const [template, localesResponse, configResponse] = await Promise.all([
      asset('/'), asset('/assets/locales.json'), asset('/config.json'),
    ]);
    if (!template.ok || !localesResponse.ok || !configResponse.ok) {
      throw new Error('Could not load page assets');
    }
    const [locales, config] = await Promise.all([localesResponse.json(), configResponse.json()]);
    const copy = locales[language];
    if (!copy) throw new Error(`Missing translations for ${language}`);

    let rewriter = new HTMLRewriter()
      .on('html', { element(element) { element.setAttribute('lang', language); } })
      .on('title', { element(element) { element.setInnerContent(copy.title); } })
      .on('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]', {
        element(element) { element.setAttribute('content', copy.metaDescription); },
      })
      .on('meta[property="og:title"], meta[name="twitter:title"]', {
        element(element) { element.setAttribute('content', copy.title); },
      })
      .on('meta[property="og:url"]', {
        element(element) { element.setAttribute('content', `https://geofeed.wlms.dev/${language}`); },
      })
      .on('link[rel="canonical"]', {
        element(element) { element.setAttribute('href', `https://geofeed.wlms.dev/${language}`); },
      })
      .on('#language-value', {
        element(element) { element.setInnerContent({ 'en-GB': 'English', 'zh-cn': '简体中文', 'de-DE': 'Deutsch', 'fr-FR': 'Français', 'it-IT': 'Italiano', 'es-ES': 'Español' }[language]); },
      })
      .on('#language-menu [data-value]', {
        element(element) { element.setAttribute('aria-checked', String(element.getAttribute('data-value') === language)); },
      });

    for (const [selector, value] of Object.entries({
      '#asn-number': config.asn.number,
      '#asn-name': config.asn.name,
      '#asn-description': copy.networkDescription,
      '#update-frequency': config.geofeed.updateFrequency === 'Weekly' ? copy.frequencyWeekly : config.geofeed.updateFrequency,
      '#last-update': config.geofeed.lastUpdate,
      '#footer-name': config.owner.name,
      '#email-link': `${config.owner.email} ↗`,
    })) {
      rewriter = rewriter.on(selector, { element(element) { element.setInnerContent(value); } });
    }
    for (const [selector, href] of Object.entries({
      '#download-link': config.geofeed.url,
      '#website-link': config.owner.website,
      '#github-link': config.links.github,
      '#peeringdb-link': config.links.peeringdb,
      '#email-link': `mailto:${config.owner.email}`,
    })) {
      rewriter = rewriter.on(selector, { element(element) { element.setAttribute('href', href); } });
    }
    for (const [key, value] of Object.entries(copy)) {
      if (key === 'feedLead') {
        rewriter = rewriter.on('[data-i18n="feedLead"]', {
          element(element) {
            const escape = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
            element.setInnerContent(value.split('<br>').map(escape).join('<br>'), { html: true });
          },
        });
      } else {
        rewriter = rewriter.on(`[data-i18n="${key}"]`, {
          element(element) { element.setInnerContent(value); },
        });
      }
    }
    const headers = new Headers(template.headers);
    headers.set('Content-Type', 'text/html; charset=utf-8');
    headers.set('Cache-Control', 'public, max-age=300, must-revalidate');
    headers.delete('Content-Length');
    headers.delete('ETag');
    return rewriter.transform(new Response(template.body, { headers }));
  } catch (error) {
    console.error('Could not render language page.', error);
    return new Response('Could not render page', { status: 500 });
  }
}
