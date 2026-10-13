const supportedLanguages = ['en-GB', 'zh-cn', 'de-DE', 'fr-FR', 'it-IT', 'es-ES'];

function createMenu(name, onSelect) {
    const control = document.getElementById(`${name}-control`);
    const trigger = document.getElementById(`${name}-trigger`);
    const panel = document.getElementById(`${name}-menu`);
    const value = document.getElementById(`${name}-value`);
    const options = [...panel.querySelectorAll('[role="menuitemradio"]')];

    function close(restoreFocus = false) {
        if (panel.hidden) return;
        panel.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
        if (restoreFocus) trigger.focus();
    }

    function open(focusIndex = null) {
        if (trigger.disabled) return;
        document.querySelectorAll('.menu-control').forEach(other => {
            if (other !== control) other.querySelector('.menu-trigger').clickIfOpen?.();
        });
        panel.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        if (focusIndex !== null) options[focusIndex].focus();
    }

    trigger.clickIfOpen = () => close();
    trigger.addEventListener('click', () => panel.hidden ? open() : close());
    trigger.addEventListener('keydown', event => {
        if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
            event.preventDefault();
            const selected = options.findIndex(option => option.getAttribute('aria-checked') === 'true');
            open(event.key === 'End' ? options.length - 1 : event.key === 'Home' ? 0 : event.key === 'ArrowUp' ? (selected + options.length - 1) % options.length : (selected + 1) % options.length);
        } else if (event.key === 'Escape') {
            close();
        }
    });
    panel.addEventListener('keydown', event => {
        const index = options.indexOf(document.activeElement);
        if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
            event.preventDefault();
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : event.key === 'ArrowDown' ? (index + 1) % options.length : (index + options.length - 1) % options.length;
            options[next].focus();
        } else if (event.key === 'Escape') {
            event.preventDefault();
            close(true);
        } else if (event.key === 'Tab') {
            close();
        }
    });
    panel.addEventListener('click', event => {
        const option = event.target.closest('[role="menuitemradio"]');
        if (!option || !panel.contains(option)) return;
        onSelect(option.dataset.value);
        close(true);
    });
    document.addEventListener('pointerdown', event => {
        if (!control.contains(event.target)) close();
    });
    control.addEventListener('focusout', event => {
        if (!control.contains(event.relatedTarget)) close();
    });

    return {
        trigger,
        select(selected) {
            options.forEach(option => option.setAttribute('aria-checked', String(option.dataset.value === selected)));
            const option = options.find(item => item.dataset.value === selected);
            if (option) value.textContent = option.textContent;
        },
        refresh() {
            const selected = options.find(option => option.getAttribute('aria-checked') === 'true');
            if (selected) value.textContent = selected.textContent;
        }
    };
}

const themeMenu = createMenu('theme', value => {
    window.geoTheme.setPreference(value);
    themeMenu.select(value);
});
themeMenu.select(window.geoTheme.preference);
const languageMenu = createMenu('language', language => {
    if (!translations || !supportedLanguages.includes(language)) return;
    window.history.pushState(null, '', `/${language}`);
    renderLanguage(language);
});
// Check periodically only when the browser cannot report system theme changes.
if (window.geoTheme.usesTimeFallback) {
    window.setInterval(() => {
        if (window.geoTheme.followsTime) window.geoTheme.refresh();
    }, 60_000);
}
let translations = null;
let siteConfig = null;

function languageFromPath() {
    const path = window.location.pathname.replace(/\/$/, '').slice(1);
    return supportedLanguages.find(language => language.toLowerCase() === path.toLowerCase());
}

function browserLanguage() {
    const preferences = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const preference of preferences) {
        const primary = preference?.split('-')[0].toLowerCase();
        const match = supportedLanguages.find(language => language.split('-')[0].toLowerCase() === primary);
        if (match) return match;
    }
    return 'en-GB';
}

function currentLanguage() {
    return languageFromPath() || browserLanguage();
}

function setText(id, text) {
    document.getElementById(id).textContent = text;
}

function setLink(id, href) {
    document.getElementById(id).href = href;
}

function renderConfig(config) {
    setText('asn-number', config.asn.number);
    setText('asn-name', config.asn.name);
    setText('last-update', config.geofeed.lastUpdate);
    setText('footer-name', config.owner.name);
    const email = document.getElementById('email-link');
    email.href = `mailto:${config.owner.email}`;
    email.textContent = `${config.owner.email} ↗`;
    setLink('download-link', config.geofeed.url);
    setLink('website-link', config.owner.website);
    setLink('github-link', config.links.github);
    setLink('peeringdb-link', config.links.peeringdb);
}

function renderLanguage(language) {
    languageMenu.select(translations ? language : document.documentElement.lang);
    if (!translations) return;
    document.documentElement.lang = language;

    const copy = translations[language];
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;
        if (key === 'feedLead') {
            element.replaceChildren(...copy[key].split('<br>').flatMap((line, index) => index ? [document.createElement('br'), document.createTextNode(line)] : [document.createTextNode(line)]));
        } else {
            element.textContent = copy[key];
        }
    });
    themeMenu.refresh();
    setText('asn-description', copy.networkDescription);
    setText('update-frequency', siteConfig?.geofeed.updateFrequency === 'Weekly' ? copy.frequencyWeekly : siteConfig?.geofeed.updateFrequency || copy.frequencyWeekly);
    document.title = copy.title;
    document.querySelector('meta[name="description"]').content = copy.metaDescription;
    document.querySelector('meta[property="og:title"]').content = copy.title;
    document.querySelector('meta[property="og:description"]').content = copy.metaDescription;
    document.querySelector('meta[name="twitter:title"]').content = copy.title;
    document.querySelector('meta[name="twitter:description"]').content = copy.metaDescription;
}

window.addEventListener('popstate', () => renderLanguage(currentLanguage()));
renderLanguage(currentLanguage());

fetch('/config.json').then(response => {
    if (!response.ok) throw new Error(`Configuration: HTTP ${response.status}`);
    return response.json();
}).then(config => {
    siteConfig = config;
    renderConfig(config);
    if (translations) renderLanguage(currentLanguage());
}).catch(error => console.error('Could not load site configuration.', error));

fetch('/assets/locales.json').then(response => {
    if (!response.ok) throw new Error(`Translations: HTTP ${response.status}`);
    return response.json();
}).then(locales => {
    translations = locales;
    languageMenu.trigger.disabled = false;
    renderLanguage(currentLanguage());
}).catch(error => {
    console.error('Could not load translations; keeping the initial page content.', error);
});
