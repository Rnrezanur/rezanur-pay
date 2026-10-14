// Rezanur Pay — Navigation & Section Controller

const navigationMap = [
    { btnId: 'btn-add-money-tab', sectionId: 'add-money-section' },
    { btnId: 'btn-cashout-tab', sectionId: 'cashout-section' },
    { btnId: 'btn-transfer-tab', sectionId: 'transfer-section' },
    { btnId: 'btn-bonus-tab', sectionId: 'bonus-section' },
    { btnId: 'btn-paybill-tab', sectionId: 'paybill-section' },
    { btnId: 'btn-transactions-tab', sectionId: 'transactions-section' }
];

function showSection(activeBtnId, activeSectionId) {
    // 1. Hide all form/list sections
    const allSections = document.querySelectorAll('.form-section');
    allSections.forEach(section => {
        section.classList.add('hidden');
    });

    // 2. Show the targeted section
    const targetSection = document.getElementById(activeSectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // 3. Reset all tab buttons to default inactive state
    const allTabs = document.querySelectorAll('.btn-tab');
    allTabs.forEach(tab => {
        tab.classList.remove('border-blue-600', 'bg-blue-50/80', 'ring-2', 'ring-blue-500/20');
        tab.classList.add('border-slate-200/90', 'bg-white');
        
        const label = tab.querySelector('.tab-label');
        if (label) {
            label.classList.remove('text-blue-600', 'font-bold');
            label.classList.add('text-slate-700', 'font-semibold');
        }
    });

    // 4. Highlight the active tab button (if one was clicked)
    if (activeBtnId) {
        const activeBtn = document.getElementById(activeBtnId);
        if (activeBtn) {
            activeBtn.classList.remove('border-slate-200/90', 'bg-white');
            activeBtn.classList.add('border-blue-600', 'bg-blue-50/80', 'ring-2', 'ring-blue-500/20');

            const activeLabel = activeBtn.querySelector('.tab-label');
            if (activeLabel) {
                activeLabel.classList.remove('text-slate-700', 'font-semibold');
                activeLabel.classList.add('text-blue-600', 'font-bold');
            }
        }
    }
}

// Function to return to default dashboard overview
function showHomeOverview() {
    showSection(null, 'latest-payment-section');
    if (window.Wallet && typeof window.Wallet.renderLatestOverview === 'function') {
        window.Wallet.renderLatestOverview();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Attach listeners to the 6 primary service tabs
    navigationMap.forEach(item => {
        const btn = document.getElementById(item.btnId);
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                showSection(item.btnId, item.sectionId);
            });
        }
    });

    // 2. "View All" link on latest payments
    const viewAllBtn = document.getElementById('btn-view-all-transactions');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('btn-transactions-tab', 'transactions-section');
            if (window.Wallet && typeof window.Wallet.renderFullHistory === 'function') {
                window.Wallet.renderFullHistory('all');
            }
        });
    }

    // 3. Close / Back buttons on individual form sections
    const backBtns = document.querySelectorAll('.btn-close-section');
    backBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showHomeOverview();
        });
    });

    // 4. Bottom Navigation shortcuts
    const navHomeBtn = document.getElementById('bottom-nav-home');
    if (navHomeBtn) {
        navHomeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showHomeOverview();
        });
    }

    const navTransferBtn = document.getElementById('bottom-nav-transfer');
    if (navTransferBtn) {
        navTransferBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('btn-transfer-tab', 'transfer-section');
        });
    }

    const navHistoryBtn = document.getElementById('bottom-nav-history');
    if (navHistoryBtn) {
        navHistoryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('btn-transactions-tab', 'transactions-section');
        });
    }

    // 5. Transaction Ledger Filters (All / In / Out)
    // Ensures clicking any filter tab applies the primary active blue button style
    const filterTabs = document.querySelectorAll('.filter-tab-btn');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            filterTabs.forEach(t => {
                t.className = 'filter-tab-btn flex-1 py-1.5 rounded-xl bg-transparent text-slate-600 text-xs font-semibold hover:text-slate-900 transition-all cursor-pointer border-none shadow-none';
            });
            this.className = 'filter-tab-btn flex-1 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer border-none';

            const filterValue = this.getAttribute('data-filter') || 'all';
            if (window.Wallet && typeof window.Wallet.renderFullHistory === 'function') {
                window.Wallet.renderFullHistory(filterValue);
            }
        });
    });

    // 6. Reset Demo Data button
    const resetDataBtn = document.getElementById('btn-reset-data');
    if (resetDataBtn) {
        resetDataBtn.addEventListener('click', () => {
            if (window.Wallet && typeof window.Wallet.resetDemoData === 'function') {
                window.Wallet.resetDemoData();
            }
        });
    }
});