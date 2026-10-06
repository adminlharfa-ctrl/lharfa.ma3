/**
 * lharfa.ma - Official Brand Footer Component
 * Based on the professional Elite design system.
 */

document.addEventListener('DOMContentLoaded', () => {
    const footerContainer = document.querySelector('.footer-container');
    if (!footerContainer) return;

    const currentLang = localStorage.getItem('albane_lang') || 'ar';
    const translations = window.translations || {};
    const strings = translations[currentLang] || translations.ar || translations.en || {};

    const getS = (key) => (strings && strings[key]) || (translations.en && translations.en[key]) || (translations.ar && translations.ar[key]) || key;

    footerContainer.innerHTML = `
        <!-- Top Section: CTA Banner -->
        <section class="footer-cta-banner" style="padding: 40px 0; background: linear-gradient(135deg, #E63900 0%, #E63900 100%); position: relative; z-index: 10;">
            <div class="container" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 30px;">
                <div class="cta-text" style="color: white; text-align: right;">
                    <h2 style="font-size: 28px; font-weight: 950; margin: 0; line-height: 1.2;">${getS('newsletter_title')}</h2>
                    <p style="font-size: 16px; font-weight: 700; opacity: 0.9; margin-top: 5px;">${getS('newsletter_desc')}</p>
                </div>
                <div class="cta-form" style="flex: 1; max-width: 450px; min-width: 300px;">
                    <div style="background: white; padding: 6px; border-radius: 100px; display: flex; align-items: center; box-shadow: 0 15px 30px rgba(0,0,0,0.1);">
                        <input type="email" class="footer-newsletter-email" placeholder="example@mail.com" style="flex: 1; border: none; padding: 0 25px; font-size: 15px; font-weight: 700; color: var(--primary-black); outline: none; background: transparent; direction: ltr; text-align: left;">
                        <button class="footer-subscribe-btn" onclick="showNewsletterUnavailable(this)" style="background: #E63900; color: white; border: none; padding: 14px 30px; border-radius: 100px; font-weight: 900; cursor: pointer; font-size: 15px; transition: 0.3s; white-space: nowrap;">${getS('subscribe')}</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Main Footer Section -->
        <footer class="main-footer-elite" style="background: var(--primary-black); color: white; padding: 80px 0 40px; position: relative; z-index: 5;">
            <div class="container">
                <div class="footer-grid-official" style="display: grid; grid-template-columns: 1.3fr 1fr 1fr; gap: 60px; direction: rtl; text-align: right;">
                    
                    <!-- Brand Identity Column -->
                    <div class="footer-col-brand">
                        <div class="footer-logo-official" style="display: flex; align-items: center; gap: 12px; margin-bottom: 25px; direction: ltr; justify-content: flex-end;">
                            <img src="logo1.png" alt="Logo" style="height: 40px; width: auto; border-radius: 8px;">
                            <span style="font-size: 32px; font-weight: 950; letter-spacing: -1px; display: inline-flex;">
                                <span style="color: var(--primary-red);">lharfa</span><span style="color: white;">.ma</span>
                            </span>
                        </div>
                        <p style="font-size: 15px; line-height: 1.8; opacity: 0.8; font-weight: 600; max-width: 350px;">
                            ${getS('footer_desc') || 'المنصة الأولى في المغرب لربط الحرفيين بالزبائن بجودة واحترافية عالية. نضمن لك السرعة، الموثوقية، والأمان في كل طلب.'}
                        </p>
                    </div>

                    <!-- Quick Links Column -->
                    <div class="footer-col-links">
                        <h4 class="footer-title-official" style="font-size: 20px; font-weight: 900; margin-bottom: 30px; position: relative; display: inline-block; padding-bottom: 10px;">${getS('important_links')}
                            <span style="position: absolute; bottom: 0; right: 0; width: 35px; height: 3px; background: var(--primary-red); border-radius: 2px;"></span>
                        </h4>
                        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 15px;">
                            <li><a href="faq.html" style="color: white; opacity: 0.7; text-decoration: none; font-weight: 700; transition: 0.3s; font-size: 15px;">${getS('faq')}</a></li>
                            <li><a href="terms.html" style="color: white; opacity: 0.7; text-decoration: none; font-weight: 700; transition: 0.3s; font-size: 15px;">${getS('terms')}</a></li>
                            <li><a href="privacy.html" style="color: white; opacity: 0.7; text-decoration: none; font-weight: 700; transition: 0.3s; font-size: 15px;">${getS('privacy')}</a></li>
                            <li><a href="contact.html" style="color: white; opacity: 0.7; text-decoration: none; font-weight: 700; transition: 0.3s; font-size: 15px;">${getS('contact_us')}</a></li>
                        </ul>
                    </div>

                    <!-- Contact Info Column -->
                    <div class="footer-col-contact">
                        <h4 class="footer-title-official" style="font-size: 20px; font-weight: 900; margin-bottom: 30px; position: relative; display: inline-block; padding-bottom: 10px;">${getS('contact_info_title')}
                            <span style="position: absolute; bottom: 0; right: 0; width: 35px; height: 3px; background: var(--primary-red); border-radius: 2px;"></span>
                        </h4>
                        <div style="display: flex; flex-direction: column; gap: 20px;">
                            <a href="https://www.google.com/maps/search/?api=1&query=Taroudant%2C%20Morocco" target="_blank" rel="noopener" style="display: flex; align-items: center; gap: 12px; color: white; text-decoration: none; opacity: 0.9; font-weight: 700; font-size: 15px; transition: 0.3s;">
                                <i data-lucide="map-pin" style="color: var(--primary-red); width: 18px;"></i>
                                <span>${getS('footer_location')}</span>
                            </a>
                            <a href="mailto:adminlharfa@gmail.com" style="display: flex; align-items: center; gap: 12px; color: white; text-decoration: none; opacity: 0.9; font-weight: 700; font-size: 15px; transition: 0.3s;">
                                <i data-lucide="mail" style="color: var(--primary-red); width: 18px;"></i>
                                <span style="direction: ltr;">adminlharfa@gmail.com</span>
                            </a>
                        </div>
                        
                        <div class="footer-social-grid" style="display: flex; gap: 15px; margin-top: 35px;">
                            <a href="https://facebook.com" target="_blank" rel="noopener" class="social-circle-official" aria-label="Facebook">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            </a>
                            <a href="https://www.instagram.com/lharfa.ma?igsh=N2NiZHE1YjNqOGUw" target="_blank" rel="noopener" class="social-circle-official" aria-label="Instagram">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener" class="social-circle-official" aria-label="LinkedIn">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                            </a>
                            <a href="https://wa.me/212783086770" target="_blank" rel="noopener" class="social-circle-official" aria-label="WhatsApp">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </footer>

        <!-- Bottom Copyright Bar -->
        <div class="footer-bottom-bar" style="background: var(--primary-black); padding: 25px 0; border-top: 1px solid rgba(255,255,255,0.03);">
            <div class="container" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
                <p style="opacity: 0.6; font-size: 14px; font-weight: 700; margin: 0; color: white; direction: ltr;">&copy; ${new Date().getFullYear()} lharfa.ma - ${getS('rights_reserved')}</p>
                <p style="opacity: 0.6; font-size: 14px; font-weight: 700; margin: 0; color: white;">${getS('proudly_from')}</p>
            </div>
        </div>

        <style>
            .footer-newsletter-email {
                color: var(--primary-black) !important;
            }

            .social-circle-official {
                width: 48px;
                height: 48px;
                border-radius: 14px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(255, 255, 255, 0.05);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                transition: all 0.3s ease;
                text-decoration: none;
            }
            .social-circle-official:hover {
                border-color: var(--primary-red);
                background: rgba(255, 63, 0, 0.1);
                color: var(--primary-red);
                transform: translateY(-5px);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
            }
            .social-circle-official i { width: 20px; height: 20px; }

            .footer-col-links ul li a:hover {
                opacity: 1 !important;
                color: var(--primary-red) !important;
                padding-right: 5px;
            }

            .footer-subscribe-btn {
                transition: all 0.3s ease !important;
            }

            .footer-subscribe-btn:hover {
                background: #E63900 !important;
                box-shadow: 0 8px 20px rgba(255, 63, 0, 0.3) !important;
            }

            @media (max-width: 850px) {
                .main-footer-elite { padding: 40px 15px 20px !important; }
                .footer-cta-banner { padding: 30px 15px !important; text-align: center !important; }
                .footer-cta-banner .container { flex-direction: column !important; gap: 15px !important; }
                .cta-text { text-align: center !important; }
                .cta-text h2 { font-size: 24px !important; }
                .cta-text p { font-size: 14px !important; margin-top: 5px !important; }
                
                .cta-form { width: 100% !important; max-width: 100% !important; }
                
                /* Keep CTA Input and Button on the same row, but smaller for compactness */
                .cta-form > div { padding: 4px !important; }
                .cta-form input { padding: 10px 15px !important; font-size: 14px !important; height: auto !important; }
                .cta-form button { padding: 10px 20px !important; font-size: 14px !important; }

                .footer-grid-official { 
                    display: grid !important;
                    grid-template-columns: 1fr !important;
                    gap: 30px !important; 
                    text-align: center !important; 
                }
                
                .footer-col-brand, .footer-col-links, .footer-col-contact {
                    width: 100% !important;
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                }
                
                .footer-logo-official { 
                    flex-direction: row !important; 
                    gap: 10px !important;
                    justify-content: center !important;
                    margin-bottom: 12px !important;
                }
                .footer-logo-official img { height: 35px !important; }
                .footer-logo-official > span { font-size: 26px !important; }
                
                .footer-col-brand p { font-size: 14px !important; margin: 0 !important; }
                
                .footer-title-official { font-size: 18px !important; margin-bottom: 15px !important; padding-bottom: 8px !important; }
                .footer-title-official span { right: 50% !important; transform: translateX(50%) !important; }
                
                .footer-col-links ul { gap: 10px !important; }
                .footer-col-contact > div { align-items: center !important; gap: 10px !important; }
                
                .footer-social-grid { justify-content: center !important; width: 100% !important; margin-top: 20px !important; gap: 12px !important; }
                .social-circle-official { width: 40px !important; height: 40px !important; }
                .social-circle-official svg { width: 18px !important; height: 18px !important; }
                
                .footer-bottom-bar { padding: 15px 0 !important; }
                .footer-bottom-bar .container { justify-content: center !important; text-align: center !important; flex-direction: column-reverse !important; gap: 10px !important; }
                .social-circle-official { border-color: rgba(255,255,255,0.2) !important; color: white !important; }
            }
            /* carded footer mobile polish */
            @media (max-width: 850px) {
                .footer-cta-banner {
                    background: #05070A !important;
                    padding: 18px 12px 0 !important;
                }

                .footer-cta-banner .container {
                    width: 100% !important;
                    padding: 24px 18px !important;
                    border-radius: 26px !important;
                    background: linear-gradient(135deg, #E63900 0%, #E63900 100%) !important;
                    border: 1px solid rgba(255, 255, 255, 0.18) !important;
                    box-shadow: 0 22px 55px rgba(255, 63, 0, 0.24) !important;
                    overflow: hidden !important;
                    position: relative !important;
                }

                .footer-cta-banner .container::before {
                    content: '';
                    position: absolute;
                    inset-inline-start: -35px;
                    top: -45px;
                    width: 130px;
                    height: 130px;
                    border-radius: 999px;
                    background: rgba(255, 255, 255, 0.14);
                    pointer-events: none;
                }

                .cta-text {
                    position: relative !important;
                    z-index: 1 !important;
                    max-width: 100% !important;
                }

                .cta-text h2 {
                    font-size: 22px !important;
                    line-height: 1.25 !important;
                    margin-bottom: 7px !important;
                }

                .cta-text p {
                    font-size: 13px !important;
                    line-height: 1.55 !important;
                    max-width: 270px !important;
                    margin: 0 auto !important;
                }

                .cta-form {
                    position: relative !important;
                    z-index: 1 !important;
                    min-width: 0 !important;
                }

                .cta-form > div {
                    flex-direction: column !important;
                    gap: 8px !important;
                    padding: 8px !important;
                    border-radius: 20px !important;
                    background: rgba(255, 255, 255, 0.96) !important;
                    box-shadow: 0 14px 34px rgba(11, 17, 32, 0.18) !important;
                }

                .cta-form input {
                    width: 100% !important;
                    min-height: 44px !important;
                    padding: 0 14px !important;
                    text-align: center !important;
                    border-radius: 14px !important;
                }

                .cta-form button {
                    width: 100% !important;
                    min-height: 44px !important;
                    border-radius: 14px !important;
                    padding: 0 18px !important;
                    background: #E63900 !important;
                }

                .main-footer-elite {
                    background: #05070A !important;
                    padding: 18px 12px 16px !important;
                }

                .main-footer-elite > .container {
                    padding-inline: 0 !important;
                }

                .footer-grid-official {
                    background: linear-gradient(180deg, rgba(15, 23, 42, 0.96), rgba(8, 17, 31, 0.98)) !important;
                    border: 1px solid rgba(255, 255, 255, 0.08) !important;
                    border-radius: 28px !important;
                    padding: 26px 18px !important;
                    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28) !important;
                    gap: 22px !important;
                }

                .footer-col-brand,
                .footer-col-links,
                .footer-col-contact {
                    padding: 0 0 20px !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.07) !important;
                }

                .footer-col-contact {
                    border-bottom: 0 !important;
                    padding-bottom: 0 !important;
                }

                .footer-logo-official {
                    padding: 10px 14px !important;
                    background: rgba(255, 255, 255, 0.04) !important;
                    border: 1px solid rgba(255, 255, 255, 0.08) !important;
                    border-radius: 18px !important;
                    width: fit-content !important;
                    margin-inline: auto !important;
                }

                .footer-col-brand p {
                    max-width: 285px !important;
                    line-height: 1.75 !important;
                    color: rgba(255, 255, 255, 0.76) !important;
                }

                .footer-title-official {
                    margin-bottom: 14px !important;
                    font-size: 17px !important;
                }

                .footer-col-links ul {
                    width: 100% !important;
                    display: grid !important;
                    grid-template-columns: 1fr 1fr !important;
                    gap: 10px !important;
                }

                .footer-col-links li a {
                    display: flex !important;
                    min-height: 40px !important;
                    align-items: center !important;
                    justify-content: center !important;
                    border-radius: 14px !important;
                    background: rgba(255, 255, 255, 0.045) !important;
                    border: 1px solid rgba(255, 255, 255, 0.065) !important;
                    opacity: 1 !important;
                    font-size: 13px !important;
                    padding: 0 8px !important;
                }

                .footer-col-contact > div:first-of-type {
                    width: 100% !important;
                    gap: 10px !important;
                }

                .footer-col-contact > div:first-of-type a {
                    width: 100% !important;
                    min-height: 42px !important;
                    justify-content: center !important;
                    border-radius: 14px !important;
                    background: rgba(255, 255, 255, 0.045) !important;
                    border: 1px solid rgba(255, 255, 255, 0.065) !important;
                    font-size: 13px !important;
                    opacity: 1 !important;
                }

                .footer-social-grid {
                    margin-top: 16px !important;
                    gap: 10px !important;
                }

                .social-circle-official {
                    width: 42px !important;
                    height: 42px !important;
                    border-radius: 14px !important;
                    background: rgba(255, 255, 255, 0.05) !important;
                    border-color: rgba(255, 255, 255, 0.1) !important;
                }

                .footer-bottom-bar {
                    background: #05070A !important;
                    padding: 0 12px calc(14px + env(safe-area-inset-bottom, 0px)) !important;
                    border-top: 0 !important;
                }

                .footer-bottom-bar .container {
                    background: rgba(255, 255, 255, 0.035) !important;
                    border: 1px solid rgba(255, 255, 255, 0.06) !important;
                    border-radius: 18px !important;
                    padding: 10px 12px !important;
                    gap: 3px !important;
                }

                .footer-bottom-bar p {
                    font-size: 12px !important;
                    line-height: 1.5 !important;
                    opacity: 0.72 !important;
                }
            }        </style>
    `;

    // Initialize icons if lucide is available
    if (window.lucide) {
        window.lucide.createIcons();
    }
});

function showNewsletterUnavailable(button) {
    const email = button.closest('.cta-form').querySelector('input[type="email"]');
    if (!email.checkValidity()) {
        email.reportValidity();
        return;
    }
    const language = localStorage.getItem('albane_lang') || 'ar';
    const message = window.translations?.[language]?.newsletter_success || window.translations?.ar?.newsletter_success;
    alert(message || 'الاشتراك غير متاح حالياً. لم يتم تسجيل بريدك الإلكتروني.');
}
