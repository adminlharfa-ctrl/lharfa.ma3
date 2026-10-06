/**
 * lharfa.ma - Shared Dashboard Logic
 * Handles common tasks for both Artisan and Client dashboards.
 */

const DashboardManager = {
    user: window.api?.getCachedUser() || {},
    token: window.api?.getCachedToken(),
    isDemoMode: false,

    init() {
        if (window.api?.backendConfigured === false) {
            this.isDemoMode = true;
            const role = document.querySelector('.artisan-sidebar') ? 'artisan' : 'client';
            if (this.user.role && this.user.role !== role) this.user = {};
            this.user = {
                ...this.user,
                name: this.user.name || '',
                role
            };
            this.showDemoNotice();
        } else if (!this.token) {
            window.location.replace('login.html');
            return;
        }
        this.updateHeader();
        this.updateLangLabel();
        this.setupEventListeners();
        window.I18nManager.updateDOM();
        if (window.lucide) window.lucide.createIcons();
    },

    showDemoNotice() {
        const main = document.querySelector('.artisan-main, .client-main');
        if (!main || main.querySelector('.dashboard-demo-notice')) return;

        const notice = document.createElement('div');
        notice.className = 'dashboard-demo-notice';
        notice.setAttribute('role', 'status');
        notice.textContent = 'وضع تجريبي: البيانات محلية على هذا الجهاز ولا تُشارك مع مستخدمين أو قاعدة بيانات.';
        notice.style.cssText = 'margin-bottom: 24px; padding: 14px 18px; border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 12px; background: rgba(245, 158, 11, 0.08); color: #fbbf24; font-weight: 700; line-height: 1.6;';
        main.insertBefore(notice, main.firstChild);
    },

    updateLangLabel() {
        const lang = localStorage.getItem('albane_lang') || localStorage.getItem('albane_lang') || 'ar';
        const label = document.getElementById('currentLangLabel');
        if (label) {
            label.textContent = lang.toUpperCase();
        }
    },

    updateHeader() {
        const nameHeader = document.getElementById('userNameHeader');
        const initialHeader = document.getElementById('userInitialHeader');
        const dashboardName = document.getElementById('artisanName') || document.getElementById('clientName');
        if (nameHeader && this.user.name) {
            nameHeader.textContent = this.user.name.split(' ')[0];
        }
        if (initialHeader && this.user.name) {
            initialHeader.textContent = this.user.name.charAt(0).toUpperCase();
        }
        if (dashboardName && this.user.name) {
            dashboardName.textContent = this.user.name.split(' ')[0];
        }
    },

    switchTab(tabId, el) {
        document.querySelectorAll('.tab-section').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
        
        const targetTab = document.getElementById(tabId);
        if (targetTab) targetTab.classList.add('active');

        if (el) {
            el.classList.add('active');
        } else {
            const link = document.querySelector(`.nav-item[data-tab="${tabId}"]`) || 
                         document.querySelector(`.nav-item[onclick*="${tabId}"]`);
            if (link) link.classList.add('active');
        }

        if (window.lucide) window.lucide.createIcons();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Mobile Sidebar Auto-Close
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    },

    showToast(msgKey, type = 'info') {
        const msg = window.I18nManager.getString(msgKey) || msgKey;
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type} show`;
        const icon = type === 'success' ? 'check-circle' : (type === 'error' ? 'alert-circle' : 'info');
        
        toast.innerHTML = `<i data-lucide="${icon}"></i><span>${msg}</span>`;
        container.appendChild(toast);
        
        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    },

    async logout() {
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
    },

    setupEventListeners() {
        // Toggle Sidebar for mobile
        const toggleBtn = document.querySelector('.menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        if (toggleBtn && sidebar) {
            toggleBtn.onclick = () => sidebar.classList.toggle('active');
        }

        // Close Modals on overlay click
        window.onclick = (event) => {
            if (event.target.classList.contains('modal-overlay')) {
                event.target.classList.remove('open');
            }
        };
    }
};

window.DashboardManager = DashboardManager;

// Initialize Dashboard Manager
document.addEventListener('DOMContentLoaded', () => DashboardManager.init());
