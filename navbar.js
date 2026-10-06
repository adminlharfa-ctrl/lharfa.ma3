/**
 * lharfa.ma - Global Navbar Component
 * Handles dynamic navigation based on user authentication, role, and language.
 */

document.addEventListener('DOMContentLoaded', () => {
    const navbarContainer = document.querySelector('.navbar');
    if (!navbarContainer) return;

    const user = window.api?.getCachedUser() || null;
    const isLoggedIn = !!window.api?.getCachedToken() && user;
    const supportedLangs = ['ar', 'fr', 'en'];
    const currentLang = supportedLangs.includes(localStorage.getItem('albane_lang')) ? localStorage.getItem('albane_lang') : 'ar';
    const translations = window.translations || {};
    const strings = translations[currentLang] || translations.ar || translations.en || {};
    const t = (key, fallback) => strings[key] || (translations.ar && translations.ar[key]) || (translations.en && translations.en[key]) || fallback || key;

    let dashboardLink = 'login.html';
    if (isLoggedIn) {
        if (user.role === 'artisan') {
            dashboardLink = 'artisan-dashboard.html';
        } else if (user.role === 'admin') {
            dashboardLink = 'admin-dashboard.html';
        } else {
            dashboardLink = 'client-dashboard.html';
        }
    }

    const langLabels = {
        ar: 'العربية',
        fr: 'Français',
        en: 'English'
    };

    const bottomLabels = {
        ar: { home: 'الرئيسية', browse: 'تصفح', shop: 'متجر', dashboard: 'لوحة' },
        fr: { home: 'Accueil', browse: 'Artisans', shop: 'Boutique', dashboard: 'Compte' },
        en: { home: 'Home', browse: 'Browse', shop: 'Shop', dashboard: 'Account' }
    };

    const navContent = `
        <div class="container nav-container">
            <a href="index.html" class="logo" style="color: #FF3F00; display: flex; align-items: center; gap: 12px; direction: ltr;">
                <img src="logo1.png" alt="lharfa.ma Logo" style="height: 40px; width: auto; border-radius: 8px;">
                <span>lharfa<span style="color: white;">.ma</span></span>
            </a>
            <div class="nav-links">
                <div class="mobile-nav-header">
                    <a href="index.html" class="logo" style="color: #FF3F00; display: flex; align-items: center; gap: 10px; direction: ltr;">
                        <img src="logo1.png" alt="lharfa.ma Logo" style="height: 32px; width: auto; border-radius: 6px;">
                        <span>lharfa<span style="color: white;">.ma</span></span>
                    </a>
                    <button id="closeMenu" class="btn-close-menu" aria-label="Close menu"><i data-lucide="x"></i></button>
                </div>
                <a href="index.html#services" class="nav-link"><i data-lucide="wrench"></i> ${t('services_link', 'خدماتنا')}</a>
                <a href="artisans.html" class="nav-link"><i data-lucide="users"></i> ${t('artisans_link', 'تصفح الحرفيين')}</a>
                ${(isLoggedIn && user.role === 'artisan') ? `<a href="shop.html" class="nav-link"><i data-lucide="shopping-bag"></i> ${t('dashboard_shop', 'متجر المعدات')}</a>` : ''}
                ${isLoggedIn ? `
                    <div class="user-profile-nav">
                        <div class="user-info" onclick="window.location.href='${dashboardLink}'">
                            <img src="${user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)}" class="user-avatar-sm" alt="${user.name}">
                            <div class="user-details">
                                <span class="user-name-small">${user.name}</span>
                                <span class="user-role-small">${t('dashboard', 'Dashboard')}</span>
                            </div>
                        </div>
                        <button onclick="logout()" class="btn btn-outline-danger nav-logout-btn" title="${t('logout', 'خروج')}">
                            <i data-lucide="log-out"></i> ${t('logout', 'خروج')}
                        </button>
                    </div>
                ` : `
                    <a href="register.html" class="nav-link"><i data-lucide="user-plus"></i> ${t('join_us', 'كن شريكاً معنا')}</a>
                    <div class="nav-auth-btns" style="display: flex; align-items: center; gap: 15px;">
                        <a href="login.html" class="btn-elite-secondary">${t('login', 'تسجيل الدخول')}</a>
                        <a href="register.html" class="btn-elite-primary">${t('start_now', 'ابدأ الآن')}</a>
                    </div>
                `}
                <div class="lang-switcher" style="position: relative;">
                    <button class="lang-btn" onclick="I18nManager.toggleLanguageDropdown(event)" aria-label="Change language" style="display: flex; align-items: center; gap: 7px; background: rgba(255, 63, 0, 0.1); padding: 8px 12px; border-radius: 20px; border: none; font-weight: 900; cursor: pointer; color: var(--primary-orange); transition: 0.3s;">
                        <i data-lucide="globe" style="width: 18px;"></i>
                        <span class="current-lang-code">${currentLang.toUpperCase()}</span>
                        <i data-lucide="chevron-down" style="width: 14px;"></i>
                    </button>
                    <div id="langDropdown" class="lang-dropdown" style="display: none; position: absolute; top: calc(100% + 10px); left: 0; background: white; box-shadow: var(--shadow-md); border-radius: 15px; overflow: hidden; min-width: 150px; z-index: 100; border: 1px solid var(--border-color);">
                        <a href="#" data-lang-option="ar" onclick="I18nManager.setLanguage('ar'); return false;" style="display: block; padding: 12px 20px; color: var(--text-dark); text-decoration: none; font-weight: 800; border-bottom: 1px solid #f1f5f9; transition: 0.3s; text-align: left;">العربية</a>
                        <a href="#" data-lang-option="fr" onclick="I18nManager.setLanguage('fr'); return false;" style="display: block; padding: 12px 20px; color: var(--text-dark); text-decoration: none; font-weight: 800; border-bottom: 1px solid #f1f5f9; transition: 0.3s; text-align: left;">Français</a>
                        <a href="#" data-lang-option="en" onclick="I18nManager.setLanguage('en'); return false;" style="display: block; padding: 12px 20px; color: var(--text-dark); text-decoration: none; font-weight: 800; transition: 0.3s; text-align: left;">English</a>
                    </div>
                </div>
            </div>
            <div class="menu-toggle" id="menuToggle" aria-label="Open menu">
                <i data-lucide="menu"></i>
            </div>
        </div>
    `;

    navbarContainer.innerHTML = navContent;
    if (window.lucide) lucide.createIcons();

    const toggle = document.getElementById('menuToggle');
    const closeBtn = document.getElementById('closeMenu');
    const navLinks = navbarContainer.querySelector('.nav-links');

    if (toggle && navLinks) {
        toggle.onclick = () => navLinks.classList.add('active');
    }
    if (closeBtn && navLinks) {
        closeBtn.onclick = () => navLinks.classList.remove('active');
    }

    navbarContainer.querySelectorAll('.nav-link, .btn-elite-primary, .btn-elite-secondary').forEach((link) => {
        link.addEventListener('click', () => navLinks && navLinks.classList.remove('active'));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navLinks) navLinks.classList.remove('active');
    });

    renderEliteBottomNav();

    function renderEliteBottomNav() {
        const existing = document.querySelector('.mobile-bottom-nav-elite');
        if (existing) existing.remove();

        const bottomNav = document.createElement('nav');
        bottomNav.className = 'mobile-bottom-nav-elite';

        const path = window.location.pathname;
        const isHome = path === '/' || path.includes('index.html');
        const isArtisans = path.includes('artisans.html');
        const isShop = path.includes('shop.html') || path.includes('product-detail.html');
        const isDashboard = path.includes('dashboard') || path.includes('login') || path.includes('register');
        const labels = bottomLabels[currentLang] || bottomLabels.ar;

        bottomNav.innerHTML = `
            <a href="index.html" class="elite-m-nav-item ${isHome ? 'active' : ''}">
                <i data-lucide="home"></i>
                <span>${labels.home}</span>
            </a>
            <a href="artisans.html" class="elite-m-nav-item ${isArtisans ? 'active' : ''}">
                <i data-lucide="search"></i>
                <span>${labels.browse}</span>
            </a>
            ${(isLoggedIn && user.role === 'artisan') ? `
            <a href="shop.html" class="elite-m-nav-item ${isShop ? 'active' : ''}">
                <i data-lucide="shopping-bag"></i>
                <span>${labels.shop}</span>
            </a>` : ''}
            <a href="${dashboardLink}" class="elite-m-nav-item ${isDashboard ? 'active' : ''}">
                <i data-lucide="user"></i>
                <span>${labels.dashboard}</span>
            </a>
        `;

        document.body.appendChild(bottomNav);
        if (window.lucide) lucide.createIcons();

        const style = document.createElement('style');
        style.textContent = `
            .mobile-bottom-nav-elite {
                display: none;
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: white;
                height: 75px;
                box-shadow: 0 -10px 40px rgba(0,0,0,0.1);
                z-index: 10000;
                align-items: center;
                justify-content: space-around;
                padding: 0 10px;
                border-top: 1px solid #F1F5F9;
            }
            .elite-m-nav-item {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 5px;
                color: #94A3B8;
                text-decoration: none;
                font-weight: 800;
                font-size: 11px;
                height: 60px;
                border-radius: 16px;
                transition: 0.3s;
                margin: 0 4px;
            }
            .elite-m-nav-item i { width: 22px; height: 22px; }
            .elite-m-nav-item.active {
                background: #FF3F00;
                color: white;
                box-shadow: 0 10px 20px rgba(255, 0, 0, 0.3);
            }
            @media (max-width: 650px) {
                .mobile-bottom-nav-elite { display: flex; }
            }
        `;
        document.head.appendChild(style);
    }
});

async function logout() {
    if (window.api?.backendConfigured) {
        const result = await window.api.logout();
        if (!result.success) {
            window.alert(result.message || 'تعذر تسجيل الخروج. حاول مرة أخرى.');
            return;
        }
    } else {
        localStorage.removeItem('albane_token');
        sessionStorage.removeItem('albane_token');
        localStorage.removeItem('albane_user');
        localStorage.removeItem('albane_remember');
    }
    window.location.href = 'index.html';
}