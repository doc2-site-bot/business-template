// Non LCP components
const lazyComponents = [
    'gallery',
    'banner',
    'footer-nav',
    'resources',
    'contact'
];

// Build lazy component selector
let lazyComponentSel = lazyComponents.map(name => `web-${name}`);
// Add potential items
lazyComponentSel.forEach(name => lazyComponentSel.push(`${name}-item`));
lazyComponentSel = lazyComponentSel.join(',');

const variableMap = {
    'year': new Date().getFullYear()
};

const icons = {
    'LinkedIn': '<svg aria-hidden="true" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path></svg>',
    'Tel': '<svg aria-hidden="true" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"></path></svg>',
    'Maps': '<svg aria-hidden="true" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg"><path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path></svg>'
};

const loadLazyComponent = (component) => {
    const name = component.tagName.toLowerCase().replace('web-', '');
    const template = document.head.querySelector(`template[src*="${name}.js"]`);
    if (template) {
        const script = document.createElement('script');
        [...template.attributes].forEach( attr => { script.setAttribute(attr.nodeName ,attr.nodeValue) });
        document.head.append(script);
        template.remove();
    }
};

const site = document.head.querySelector('meta[name="og:site_name"]')?.content;
if (site) {
    document.title += ` | ${site}`;
}

window.addEventListener('scroll', () => {
    document.querySelector('header').classList.toggle('is-scrolling', window.scrollY !== 0)
});

document.addEventListener('DOMContentLoaded', () => {
    // Hydrate on user interaction
    let isHydrated = false;
    const hydrate = () => {
        if (!isHydrated) {
            document.body.querySelectorAll(lazyComponentSel).forEach((component) => {
                loadLazyComponent(component);
            });

            isHydrated = true;
        }
    };
    window.addEventListener('scroll', hydrate, { once: true, passive: true });
    window.addEventListener('mousemove', hydrate, { once: true, passive: true });
    window.addEventListener('touchmove', hydrate, { once: true, passive: true });
    window.addEventListener('keydown', hydrate, { once: true, passive: true });

    if (window.scrollY !== 0) {
        hydrate();
    }

    document.querySelectorAll('var').forEach((variable) => {
        const value = variableMap[variable.textContent] || icons[variable.textContent];
        if (value) {
            variable.outerHTML = `<span>${value}</span>`
        }
    });

    document.querySelectorAll('a[href]').forEach((link) => {
        link.ariaLabel = link.textContent.trim();
        if (Object.keys(icons).includes(link.textContent)) {
            link.innerHTML = icons[link.textContent];
        }

        const href = link.getAttribute('href');
        if (href.startsWith('#tel:') || href.startsWith('#mailto:')) {
            link.setAttribute('href', link.getAttribute('href').slice(1));
        }

        if (href === '#') {
            link.onclick = (event) => {
                event.preventDefault();
            };
        }
    });
});

/**
 * @param {HTMLElement} component
 */
export function assignLinkElement(component) {
    const el = component.querySelector('[href]');
    if (el) {
        const link = component.shadowRoot.querySelector('a[part="wrapper"]');
        link.href = el.getAttribute('href');

        const text = el.textContent.trim();
        link.ariaLabel = text;
        component.querySelector('img').alt = text;

        component.shadowRoot.querySelector('div[part="wrapper"]').remove();
    }
    else {
        component.shadowRoot.querySelector('a[part="wrapper"]').remove();
    }
}
