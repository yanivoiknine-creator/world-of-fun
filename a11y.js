// ===== Accessibility Widget + Cookie Banner (shared across all pages) =====
(function () {

    // ── Inject HTML ──────────────────────────────────────────────────────────
    document.body.insertAdjacentHTML('beforeend', `
        <button class="a11y-fab" id="a11yFab" aria-label="אפשרויות נגישות" aria-expanded="false" title="נגישות">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="5" r="2.5"/>
                <path d="M12 8v6"/>
                <path d="M8 11h8"/>
                <path d="M9 20l3-6 3 6"/>
            </svg>
        </button>

        <div class="a11y-panel" id="a11yPanel" role="dialog" aria-modal="true" aria-label="הגדרות נגישות" hidden>
            <div class="a11y-panel-header">
                <h2 class="a11y-panel-title">נגישות</h2>
                <button class="a11y-panel-close" id="a11yPanelClose" aria-label="סגור">✕</button>
            </div>
            <div class="a11y-panel-body">
                <div class="a11y-font-section">
                    <span class="a11y-label">גודל גופן</span>
                    <div class="font-size-controls" role="group" aria-label="שינוי גודל גופן">
                        <button class="font-btn" id="fontDecrease" aria-label="הקטן גופן">A-</button>
                        <button class="font-btn font-reset-btn" id="fontReset" aria-label="איפוס גודל גופן">A</button>
                        <button class="font-btn" id="fontIncrease" aria-label="הגדל גופן">A+</button>
                    </div>
                </div>
                <div class="a11y-toggles">
                    <label class="a11y-toggle-row">
                        <span class="a11y-toggle-label">ניגודיות גבוהה</span>
                        <div class="toggle-switch"><input type="checkbox" id="toggleHighContrast"><span class="toggle-slider"></span></div>
                    </label>
                    <label class="a11y-toggle-row">
                        <span class="a11y-toggle-label">גווני אפור</span>
                        <div class="toggle-switch"><input type="checkbox" id="toggleGrayscale"><span class="toggle-slider"></span></div>
                    </label>
                    <label class="a11y-toggle-row">
                        <span class="a11y-toggle-label">הפחתת תנועה</span>
                        <div class="toggle-switch"><input type="checkbox" id="toggleReduceMotion"><span class="toggle-slider"></span></div>
                    </label>
                    <label class="a11y-toggle-row">
                        <span class="a11y-toggle-label">הדגשת קישורים</span>
                        <div class="toggle-switch"><input type="checkbox" id="toggleHighlightLinks"><span class="toggle-slider"></span></div>
                    </label>
                </div>
                <button class="a11y-reset-btn" id="a11yResetAll">איפוס הכל</button>
                <button class="a11y-stmt-btn" id="openA11yStatement">הצהרת נגישות</button>
            </div>
        </div>

        <div class="a11y-stmt-overlay" id="a11yStatementOverlay" role="dialog" aria-modal="true" aria-label="הצהרת נגישות" hidden>
            <div class="a11y-stmt-box">
                <button class="modal-close" id="a11yStatementClose" aria-label="סגור">✕</button>
                <h2 class="a11y-stmt-title">הצהרת נגישות</h2>
                <div class="a11y-stmt-content">
                    <p><strong>שם האתר:</strong> עולם של כייף</p>
                    <p><strong>תאריך עדכון:</strong> פברואר 2026</p>
                    <br>
                    <p>אתר "עולם של כייף" מחויב להנגשת תכניו לכולם, בהתאם לתקן הנגישות הישראלי ולהנחיות WCAG 2.1 ברמת AA.</p>
                    <br>
                    <h3>תכונות הנגישות באתר</h3>
                    <ul>
                        <li>ניווט מלא באמצעות מקלדת (Tab, Enter, Escape)</li>
                        <li>קישור "דלג לתוכן הראשי" לניווט מהיר</li>
                        <li>תיאור טקסטואלי לכל התמונות (Alt Text)</li>
                        <li>תמיכה בסדר קריאה מימין לשמאל (RTL)</li>
                        <li>הגדלה והקטנה של גופן</li>
                        <li>מצב ניגודיות גבוהה</li>
                        <li>מצב גווני אפור</li>
                        <li>הפחתת תנועה ואנימציות</li>
                        <li>הדגשת קישורים וכפתורים</li>
                    </ul>
                    <br>
                    <h3>אחסון מקומי (LocalStorage)</h3>
                    <p>האתר שומר את <strong>העדפות הצבעים והנגישות</strong> שלך בדפדפן בלבד. לא נאסף ולא נשמר שום מידע אישי, ולא נשלח מידע לשרת חיצוני.</p>
                    <br>
                    <h3>נתקלת בבעיה?</h3>
                    <p>האתר הוא אישי ובשלבי בנייה. אם מצאת בעיית נגישות, נשמח לשמוע ולתקן!</p>
                </div>
            </div>
        </div>

        <div class="cookie-banner" id="cookieBanner" role="region" aria-label="הודעת פרטיות" hidden>
            <div class="cookie-content">
                <p class="cookie-text">
                    האתר שומר את <strong>העדפות הצבעים והנגישות</strong> שלך בדפדפן בלבד. לא נאסף מידע אישי.
                </p>
                <div class="cookie-actions">
                    <button class="cookie-btn cookie-accept" id="cookieAccept">הבנתי!</button>
                    <button class="cookie-btn cookie-more" id="cookieMore">מידע נוסף</button>
                </div>
            </div>
        </div>
    `);

    // ── Apply saved settings on load ─────────────────────────────────────────
    [['a11yHighContrast', 'high-contrast'],
     ['a11yGrayscale',    'grayscale'],
     ['a11yReduceMotion', 'reduce-motion'],
     ['a11yHighlightLinks','highlight-links']
    ].forEach(([key, cls]) => {
        if (localStorage.getItem(key) === 'true') document.body.classList.add(cls);
    });

    let currentFontSize = parseInt(localStorage.getItem('a11yFontSize') || '0');
    applyFontSize(currentFontSize);

    function applyFontSize(level) {
        const sizes = {'-2':'80%','-1':'90%','0':'100%','1':'115%','2':'130%','3':'148%','4':'168%'};
        document.documentElement.style.fontSize = sizes[String(level)] || '100%';
        document.getElementById('fontDecrease').disabled = level <= -2;
        document.getElementById('fontIncrease').disabled = level >= 4;
    }

    // ── FAB + Panel ──────────────────────────────────────────────────────────
    const fab   = document.getElementById('a11yFab');
    const panel = document.getElementById('a11yPanel');

    fab.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = !panel.hidden;
        panel.hidden = open;
        fab.setAttribute('aria-expanded', String(!open));
    });

    document.getElementById('a11yPanelClose').addEventListener('click', () => {
        panel.hidden = true;
        fab.setAttribute('aria-expanded', 'false');
        fab.focus();
    });

    document.addEventListener('click', (e) => {
        if (!panel.hidden && !panel.contains(e.target) && e.target !== fab) {
            panel.hidden = true;
            fab.setAttribute('aria-expanded', 'false');
        }
    });

    // ── Font size ────────────────────────────────────────────────────────────
    document.getElementById('fontIncrease').addEventListener('click', () => {
        if (currentFontSize < 4) { currentFontSize++; applyFontSize(currentFontSize); localStorage.setItem('a11yFontSize', currentFontSize); }
    });
    document.getElementById('fontDecrease').addEventListener('click', () => {
        if (currentFontSize > -2) { currentFontSize--; applyFontSize(currentFontSize); localStorage.setItem('a11yFontSize', currentFontSize); }
    });
    document.getElementById('fontReset').addEventListener('click', () => {
        currentFontSize = 0; applyFontSize(0); localStorage.setItem('a11yFontSize', '0');
    });

    // ── Toggles ──────────────────────────────────────────────────────────────
    function setupToggle(id, key, cls) {
        const cb = document.getElementById(id);
        cb.checked = localStorage.getItem(key) === 'true';
        cb.addEventListener('change', () => {
            document.body.classList.toggle(cls, cb.checked);
            localStorage.setItem(key, String(cb.checked));
        });
    }
    setupToggle('toggleHighContrast',  'a11yHighContrast',   'high-contrast');
    setupToggle('toggleGrayscale',     'a11yGrayscale',      'grayscale');
    setupToggle('toggleReduceMotion',  'a11yReduceMotion',   'reduce-motion');
    setupToggle('toggleHighlightLinks','a11yHighlightLinks', 'highlight-links');

    document.getElementById('a11yResetAll').addEventListener('click', () => {
        currentFontSize = 0; applyFontSize(0); localStorage.setItem('a11yFontSize', '0');
        ['toggleHighContrast','toggleGrayscale','toggleReduceMotion','toggleHighlightLinks'].forEach(id => {
            document.getElementById(id).checked = false;
        });
        document.body.classList.remove('high-contrast','grayscale','reduce-motion','highlight-links');
        ['a11yHighContrast','a11yGrayscale','a11yReduceMotion','a11yHighlightLinks'].forEach(k => localStorage.removeItem(k));
    });

    // ── Accessibility Statement ───────────────────────────────────────────────
    const stmtOverlay = document.getElementById('a11yStatementOverlay');

    function openStatement() {
        stmtOverlay.hidden = false;
        panel.hidden = true;
        fab.setAttribute('aria-expanded', 'false');
    }
    function closeStatement() { stmtOverlay.hidden = true; }

    document.getElementById('openA11yStatement').addEventListener('click', openStatement);
    document.getElementById('a11yStatementClose').addEventListener('click', closeStatement);
    stmtOverlay.addEventListener('click', (e) => { if (e.target === stmtOverlay) closeStatement(); });

    // Footer button (present on some pages)
    const footerBtn = document.getElementById('footerA11yStatement');
    if (footerBtn) footerBtn.addEventListener('click', openStatement);

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            panel.hidden = true;
            stmtOverlay.hidden = true;
            fab.setAttribute('aria-expanded', 'false');
        }
    });

    // ── Cookie Banner ────────────────────────────────────────────────────────
    const cookieBanner = document.getElementById('cookieBanner');

    function updateFabPos() {
        const h = cookieBanner.hidden ? 0 : cookieBanner.offsetHeight;
        const off = h + 20;
        fab.style.bottom   = off + 'px';
        panel.style.bottom = (off + 64) + 'px';
    }

    if (!localStorage.getItem('privacyAccepted')) {
        cookieBanner.hidden = false;
        requestAnimationFrame(updateFabPos);
    }

    document.getElementById('cookieAccept').addEventListener('click', () => {
        cookieBanner.hidden = true;
        localStorage.setItem('privacyAccepted', 'true');
        updateFabPos();
    });
    document.getElementById('cookieMore').addEventListener('click', () => {
        cookieBanner.hidden = true;
        localStorage.setItem('privacyAccepted', 'true');
        updateFabPos();
        openStatement();
    });

})();
