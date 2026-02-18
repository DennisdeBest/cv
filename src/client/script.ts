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
