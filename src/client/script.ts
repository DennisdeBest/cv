const btnFr = document.getElementById('btn-fr');
const btnEn = document.getElementById('btn-en');
const btnPrint = document.getElementById('btn-print');
const cvFr = document.getElementById('cv-fr');
const cvEn = document.getElementById('cv-en');

function setLang(lang: string): void {
    const isFr = lang === 'fr';
    document.documentElement.lang = lang;

    cvFr!.classList.toggle('active', isFr);
    cvEn!.classList.toggle('active', !isFr);
    cvFr!.setAttribute('aria-hidden', String(!isFr));
    cvEn!.setAttribute('aria-hidden', String(isFr));
    btnFr!.setAttribute('aria-pressed', String(isFr));
    btnEn!.setAttribute('aria-pressed', String(!isFr));
}

btnFr!.addEventListener('click', () => setLang('fr'));
btnEn!.addEventListener('click', () => setLang('en'));
btnPrint!.addEventListener('click', () => window.print());

const prefersFr = navigator.language.startsWith('fr');
setLang(prefersFr ? 'fr' : 'en');

// Theme switcher
const THEMES: Record<string, string> = {
    light: 'Light',
    dark: 'Dark',
    'orange-light': 'Orange Light',
    'orange-dark': 'Orange Dark',
};

const btnTheme = document.getElementById('btn-theme')!;
const themeMenu = document.getElementById('theme-menu')!;

function setTheme(themeId: string): void {
    document.documentElement.dataset.theme = themeId;
    localStorage.setItem('cv-theme', themeId);
    themeMenu.querySelectorAll<HTMLElement>('li[data-theme]').forEach(li => {
        li.setAttribute('aria-selected', String(li.dataset.theme === themeId));
    });
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

const savedTheme = localStorage.getItem('cv-theme')
    ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(savedTheme);
