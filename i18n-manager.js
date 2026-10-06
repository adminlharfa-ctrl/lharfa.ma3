/**
 * lharfa.ma - Internationalization Manager
 * Handles Arabic, French, and English language switching across all pages.
 */

const I18nManager = {
    supportedLangs: ['ar', 'fr', 'en'],
    fallbackLangs: ['ar', 'en'],
    langNames: {
        ar: 'العربية',
        fr: 'Français',
        en: 'English'
    },
    langCodes: {
        ar: 'AR',
        fr: 'FR',
        en: 'EN'
    },
    storageKey: 'albane_lang',
    currentLang: 'ar',

    init() {
        this.currentLang = this.normalizeLang(localStorage.getItem(this.storageKey));
        localStorage.setItem(this.storageKey, this.currentLang);
        this.updateDOM();

        window.addEventListener('languageChanged', (event) => {
            this.currentLang = this.normalizeLang(event.detail || localStorage.getItem(this.storageKey));
            this.updateDOM();
        });

        window.addEventListener('click', (e) => {
            if (!e.target.closest('.lang-switcher') && !e.target.closest('.mobile-lang-switcher')) {
                this.closeLanguageDropdowns();
            }
        });
    },

    normalizeLang(lang) {
        return this.supportedLangs.includes(lang) ? lang : 'ar';
    },

    setLanguage(lang) {
        const nextLang = this.normalizeLang(lang);
        localStorage.setItem(this.storageKey, nextLang);
        this.currentLang = nextLang;
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: nextLang }));
        window.location.reload();
    },

    toggleLanguageDropdown(event) {
        if (event) event.stopPropagation();
        const dropdown = document.getElementById('langDropdown');
        if (!dropdown) return;
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    },

    closeLanguageDropdowns() {
        document.querySelectorAll('#langDropdown, .lang-dropdown').forEach((dropdown) => {
            dropdown.style.display = 'none';
        });
    },

    getString(key, defaultValue = '') {
        const translations = window.translations || {};
        const langOrder = [this.currentLang, ...this.fallbackLangs].filter((lang, index, arr) => arr.indexOf(lang) === index);

        for (const lang of langOrder) {
            if (translations[lang] && translations[lang][key]) {
                return translations[lang][key];
            }
        }

        return defaultValue || key;
    },

    updateDOM() {
        const lang = this.normalizeLang(this.currentLang);
        this.currentLang = lang;

        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.body.style.fontFamily = lang === 'ar' ? "'Tajawal', sans-serif" : "'Tajawal', Arial, sans-serif";

        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            const value = this.getString(key, el.textContent.trim());
            if (!value) return;

            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = value;
            } else {
                el.innerHTML = value;
            }

            if (el.hasAttribute('title')) el.setAttribute('title', value);
            if (el.hasAttribute('alt')) el.setAttribute('alt', value);
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
            const key = el.getAttribute('data-i18n-placeholder');
            const value = this.getString(key, el.getAttribute('placeholder') || '');
            if (value) el.placeholder = value;
        });

        this.updateLanguageControls();
        this.initTypewriter();

        if (window.lucide) {
            window.lucide.createIcons();
        }
    },

    updateLanguageControls() {
        const lang = this.currentLang;
        const label = this.langNames[lang];
        const code = this.langCodes[lang];

        document.querySelectorAll('#currentLangLabel, .current-lang-label').forEach((el) => {
            el.textContent = label;
        });

        document.querySelectorAll('.current-lang-code').forEach((el) => {
            el.textContent = code;
        });

        document.querySelectorAll('[data-lang-option]').forEach((el) => {
            const optionLang = this.normalizeLang(el.getAttribute('data-lang-option'));
            el.classList.toggle('active', optionLang === lang);
            el.setAttribute('aria-current', optionLang === lang ? 'true' : 'false');
        });
    },

    initTypewriter() {
        const txtElement = document.getElementById('typewriter-text');
        if (!txtElement || txtElement.dataset.initialized) return;

        let words = [];
        try {
            words = JSON.parse(txtElement.getAttribute('data-words') || '[]');
        } catch (e) {
            words = [];
        }

        if (!words.length) return;

        let txt = '';
        let wordIndex = 0;
        let isDeleting = false;

        const type = () => {
            const el = document.getElementById('typewriter-text');
            if (!el) return;

            const fullTxt = words[wordIndex % words.length];
            txt = isDeleting ? fullTxt.substring(0, txt.length - 1) : fullTxt.substring(0, txt.length + 1);
            el.textContent = txt;

            let typeSpeed = isDeleting ? 50 : 100;
            if (!isDeleting && txt === fullTxt) {
                typeSpeed = 2500;
                isDeleting = true;
            } else if (isDeleting && txt === '') {
                isDeleting = false;
                wordIndex++;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        };

        txtElement.dataset.initialized = 'true';
        type();
    }
};

window.I18nManager = I18nManager;
window.t = (key, defaultValue) => (window.I18nManager && I18nManager.getString(key, defaultValue)) || defaultValue || key;

document.addEventListener('DOMContentLoaded', () => {
    I18nManager.init();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const revealTargets = document.querySelectorAll(
        '.section, .artisan-card-premium, .service-chip, .testimonial-card, ' +
        '.why-us-content, .why-us-image, .dashboard-card, .tab-section, ' +
        '.hero-inner, .profile-header, .review-card, .product-card'
    );

    revealTargets.forEach((el, index) => {
        el.classList.add('reveal-hidden');
        if (!el.classList.contains('section') && !el.classList.contains('tab-section')) {
            el.style.transitionDelay = `${(index % 4) * 0.1}s`;
        }
        observer.observe(el);
    });
});