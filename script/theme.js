// Rezanur Pay — Night & Light Theme Controller

function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('rezanur_theme', theme);

    // Update all theme toggle icons on the page
    const themeIcons = document.querySelectorAll('#theme-icon');
    themeIcons.forEach(icon => {
        icon.className = isDark ? 'fa-solid fa-sun text-amber-400 text-sm' : 'fa-solid fa-moon text-slate-600 text-sm';
    });

    // Update brand logo in login page if present
    const loginLogo = document.getElementById('login-brand-logo');
    if (loginLogo) {
        loginLogo.src = isDark ? 'assets/logo/rezanur_pay_logo_white.svg' : 'assets/logo/rezanur_pay_logo.svg';
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('rezanur_theme') || 'light';
    applyTheme(savedTheme);

    const toggleBtns = document.querySelectorAll('#theme-toggle-btn');
    toggleBtns.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
        };
    });
}

// Immediate execution to prevent flash of unstyled theme
(function () {
    const saved = localStorage.getItem('rezanur_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}
