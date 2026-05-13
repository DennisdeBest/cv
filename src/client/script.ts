const btnFr = document.getElementById('btn-fr')!;
const btnEn = document.getElementById('btn-en')!;
const btnDev = document.getElementById('btn-dev')!;
const btnDevops = document.getElementById('btn-devops')!;
const btnPrint = document.getElementById('btn-print')!;

const CV_IDS = ['cv-en-dev', 'cv-fr-dev', 'cv-en-devops', 'cv-fr-devops'];

let currentLang = 'en';
let currentType = 'dev';

function getParam(key: string): string | null {
    return new URLSearchParams(window.location.search).get(key);
}

function updateUrl(): void {
    const params = new URLSearchParams();
    params.set('lang', currentLang);
    params.set('cv', currentType);
    params.set('theme', document.documentElement.dataset.theme ?? 'light');
    history.replaceState(null, '', '?' + params.toString());
}

function applyState(): void {
    const activeId = `cv-${currentLang}-${currentType}`;
    document.documentElement.lang = currentLang;

    CV_IDS.forEach(id => {
        const el = document.getElementById(id)!;
        const isActive = id === activeId;
        el.classList.toggle('active', isActive);
        el.setAttribute('aria-hidden', String(!isActive));
    });

    btnFr.setAttribute('aria-pressed', String(currentLang === 'fr'));
    btnEn.setAttribute('aria-pressed', String(currentLang === 'en'));
    btnDev.setAttribute('aria-pressed', String(currentType === 'dev'));
    btnDevops.setAttribute('aria-pressed', String(currentType === 'devops'));

    updateUrl();
}

function setLang(lang: string): void {
    currentLang = lang;
    localStorage.setItem('cv-lang', lang);
    applyState();
}

function setCvType(type: string): void {
    currentType = type;
    localStorage.setItem('cv-type', type);
    applyState();
}

btnFr.addEventListener('click', () => setLang('fr'));
btnEn.addEventListener('click', () => setLang('en'));
btnDev.addEventListener('click', () => setCvType('dev'));
btnDevops.addEventListener('click', () => setCvType('devops'));
btnPrint.addEventListener('click', () => window.print());

currentLang = getParam('lang')
    ?? localStorage.getItem('cv-lang')
    ?? (navigator.language.startsWith('fr') ? 'fr' : 'en');
currentType = getParam('cv')
    ?? localStorage.getItem('cv-type')
    ?? 'dev';
applyState();

// Theme switcher
const btnTheme = document.getElementById('btn-theme')!;
const themeMenu = document.getElementById('theme-menu')!;

function setTheme(themeId: string): void {
    document.documentElement.dataset.theme = themeId;
    localStorage.setItem('cv-theme', themeId);
    themeMenu.querySelectorAll<HTMLElement>('li[data-theme]').forEach(li => {
        li.setAttribute('aria-selected', String(li.dataset.theme === themeId));
    });
    updateUrl();
}

function toggleThemeMenu(open?: boolean): void {
    const isOpen = open ?? themeMenu.hidden;
    themeMenu.hidden = !isOpen;
    btnTheme.setAttribute('aria-expanded', String(isOpen));
}

btnTheme.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleThemeMenu();
});

themeMenu.addEventListener('click', (e) => {
    const li = (e.target as Element).closest<HTMLElement>('li[data-theme]');
    if (li?.dataset.theme) {
        setTheme(li.dataset.theme);
        toggleThemeMenu(false);
    }
});

document.addEventListener('click', () => {
    if (!themeMenu.hidden) toggleThemeMenu(false);
});

const savedTheme = getParam('theme')
    ?? localStorage.getItem('cv-theme')
    ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(savedTheme);
