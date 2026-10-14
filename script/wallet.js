// Rezanur Pay — Core Wallet Engine & In-Page Notification System

const DEFAULT_TRANSACTIONS = [
    {
        id: "TXN-984210",
        type: "bill",
        category: "Electricity Bill",
        target: "DESCO Meter #849201",
        amount: 85.00,
        flow: "out",
        timestamp: "Today, 01:44 AM",
        icon: "fa-bolt",
        iconColor: "text-amber-500",
        iconBg: "bg-amber-50"
    },
    {
        id: "TXN-984189",
        type: "add_money",
        category: "Bank Deposit",
        target: "City Bank (Acc ***5892)",
        amount: 1500.00,
        flow: "in",
        timestamp: "Yesterday, 04:30 PM",
        icon: "fa-building-columns",
        iconColor: "text-emerald-500",
        iconBg: "bg-emerald-50"
    },
    {
        id: "TXN-984102",
        type: "transfer",
        category: "Mobile Recharge",
        target: "01712-345678",
        amount: 25.00,
        flow: "out",
        timestamp: "Yesterday, 11:15 AM",
        icon: "fa-mobile-screen",
        iconColor: "text-blue-500",
        iconBg: "bg-blue-50"
    },
    {
        id: "TXN-983940",
        type: "bill",
        category: "Gas Bill",
        target: "Titas Gas Prepaid #1920",
        amount: 45.00,
        flow: "out",
        timestamp: "12 Oct, 02:15 PM",
        icon: "fa-fire-flame-simple",
        iconColor: "text-orange-500",
        iconBg: "bg-orange-50"
    },
    {
        id: "TXN-983801",
        type: "bonus",
        category: "Welcome Promo Bonus",
        target: "Promo Coupon WELCOME50",
        amount: 50.00,
        flow: "in",
        timestamp: "10 Oct, 09:00 AM",
        icon: "fa-gift",
        iconColor: "text-purple-500",
        iconBg: "bg-purple-50"
    }
];

window.Wallet = {
    // 1. Get current balance cleanly
    getBalance() {
        const stored = localStorage.getItem('rezanur_balance');
        if (stored === null || isNaN(parseFloat(stored))) {
            localStorage.setItem('rezanur_balance', '45000');
            return 45000;
        }
        return parseFloat(stored);
    },

    // 2. Set balance
    setBalance(newBalance) {
        const rounded = Math.round(newBalance * 100) / 100;
        localStorage.setItem('rezanur_balance', rounded.toString());
        this.syncBalanceDisplay();
        return rounded;
    },

    // 3. Currency formatter
    formatMoney(amount) {
        return Number(amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    },

    // 4. Sync balance to all UI elements
    syncBalanceDisplay() {
        const balanceSpan = document.getElementById('balance');
        if (!balanceSpan) return;
        const currentBalance = this.getBalance();
        balanceSpan.textContent = this.formatMoney(currentBalance);
    },

    // 6. Get all transactions
    getTransactions() {
        const raw = localStorage.getItem('rezanur_transactions');
        if (!raw) {
            localStorage.setItem('rezanur_transactions', JSON.stringify(DEFAULT_TRANSACTIONS));
            return DEFAULT_TRANSACTIONS;
        }
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
            localStorage.setItem('rezanur_transactions', JSON.stringify(DEFAULT_TRANSACTIONS));
            return DEFAULT_TRANSACTIONS;
        } catch (e) {
            localStorage.setItem('rezanur_transactions', JSON.stringify(DEFAULT_TRANSACTIONS));
            return DEFAULT_TRANSACTIONS;
        }
    },

    // 7. Add new transaction
    recordTransaction(trx) {
        const list = this.getTransactions();
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newRecord = {
            id: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
            timestamp: `Today, ${timeStr}`,
            ...trx
        };
        list.unshift(newRecord);
        localStorage.setItem('rezanur_transactions', JSON.stringify(list));
        this.renderAllTransactionViews();
        return newRecord;
    },

    // 8. Render transaction lists
    renderAllTransactionViews() {
        this.renderLatestOverview();
        this.renderFullHistory('all');
    },

    renderLatestOverview() {
        const container = document.getElementById('latest-payment-items');
        if (!container) return;

        const transactions = this.getTransactions().slice(0, 5);
        if (transactions.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-slate-400 bg-white rounded-2xl border border-slate-100">
                    <i class="fa-regular fa-folder-open text-3xl mb-2 text-slate-300"></i>
                    <p class="text-xs font-semibold">No recent transactions yet.</p>
                </div>`;
            return;
        }

        container.innerHTML = transactions.map(item => this.createTransactionCardHTML(item)).join('');
    },

    renderFullHistory(filter = 'all') {
        const container = document.getElementById('history-payment-items');
        if (!container) return;

        let transactions = this.getTransactions();
        if (filter === 'in') {
            transactions = transactions.filter(t => t.flow === 'in');
        } else if (filter === 'out') {
            transactions = transactions.filter(t => t.flow === 'out');
        }

        if (transactions.length === 0) {
            container.innerHTML = `
                <div class="text-center py-10 text-slate-400 bg-white rounded-2xl border border-slate-100 p-6">
                    <div class="w-12 h-12 mx-auto mb-2 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <i class="fa-solid fa-receipt text-xl"></i>
                    </div>
                    <p class="text-xs font-bold text-slate-700">No transactions found</p>
                    <p class="text-[11px] text-slate-400 mt-0.5">Transactions in this category will appear here.</p>
                </div>`;
            return;
        }

        container.innerHTML = transactions.map(item => this.createTransactionCardHTML(item)).join('');
    },

    createTransactionCardHTML(item) {
        const isIncome = item.flow === 'in';
        const sign = isIncome ? '+' : '-';
        const amountColor = isIncome ? 'text-emerald-600' : 'text-slate-900';
        const badgeColor = isIncome ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200';

        return `
            <div class="flex items-center justify-between p-3.5 bg-white rounded-2xl shadow-xs border border-slate-100 hover:border-slate-200 transition-all hover:shadow-sm">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl ${item.iconBg || 'bg-slate-100'} flex items-center justify-center shrink-0">
                        <i class="fa-solid ${item.icon || 'fa-receipt'} ${item.iconColor || 'text-slate-600'} text-sm"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-800 text-xs leading-tight">${item.category}</h4>
                        <p class="text-[11px] text-slate-400 mt-0.5">${item.target} • <span class="text-slate-400 font-medium">${item.timestamp}</span></p>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-extrabold ${amountColor} text-xs">${sign}$${this.formatMoney(item.amount)}</div>
                    <span class="inline-block mt-0.5 px-2 py-0.5 text-[9px] font-bold rounded-full border ${badgeColor}">
                        Success
                    </span>
                </div>
            </div>
        `;
    },

    // 9. Modern In-Page Toast notification (Never use Chrome native alert)
    showToast(message, type = 'success') {
        const toast = document.getElementById('app-toast');
        const toastMessage = document.getElementById('toast-message');
        const toastIcon = document.getElementById('toast-icon');

        if (!toast || !toastMessage) {
            console.warn("In-page toast element not found, message:", message);
            return;
        }

        toastMessage.textContent = message;

        // Reset base transition classes
        toast.className = "fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl text-white shadow-2xl text-xs font-bold transition-all duration-300 transform translate-y-0 opacity-100 max-w-sm w-[90%]";

        if (type === 'success') {
            toast.classList.add('bg-emerald-600', 'border', 'border-emerald-500');
            if (toastIcon) toastIcon.className = "fa-solid fa-circle-check text-white text-base shrink-0";
        } else if (type === 'error') {
            toast.classList.add('bg-rose-600', 'border', 'border-rose-500');
            if (toastIcon) toastIcon.className = "fa-solid fa-circle-exclamation text-white text-base shrink-0";
        } else {
            toast.classList.add('bg-slate-900', 'border', 'border-slate-800');
            if (toastIcon) toastIcon.className = "fa-solid fa-circle-info text-sky-400 text-base shrink-0";
        }

        clearTimeout(this._toastTimeout);
        this._toastTimeout = setTimeout(() => {
            toast.className = "fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl opacity-0 pointer-events-none transition-all duration-300 transform -translate-y-4 max-w-sm w-[90%]";
        }, 3500);
    },

    // 10. Digital Receipt Modal
    showReceipt(data) {
        const modal = document.getElementById('receipt-modal');
        if (!modal) return;

        const trxIdEl = document.getElementById('receipt-trx-id');
        const titleEl = document.getElementById('receipt-title');
        const serviceEl = document.getElementById('receipt-service');
        const recipientEl = document.getElementById('receipt-recipient');
        const amountEl = document.getElementById('receipt-amount');
        const balanceEl = document.getElementById('receipt-balance');
        const timeEl = document.getElementById('receipt-time');

        if (trxIdEl) trxIdEl.textContent = data.id || 'TXN-' + Math.floor(100000 + Math.random() * 900000);
        if (titleEl) titleEl.textContent = data.title || 'Transaction Successful';
        if (serviceEl) serviceEl.textContent = data.service || 'Wallet Service';
        if (recipientEl) recipientEl.textContent = data.target || 'N/A';
        if (amountEl) {
            amountEl.textContent = (data.flow === 'in' ? '+' : '-') + '$' + this.formatMoney(data.amount);
            amountEl.className = `text-2xl font-black ${data.flow === 'in' ? 'text-emerald-600' : 'text-slate-900'}`;
        }
        if (balanceEl) balanceEl.textContent = '$' + this.formatMoney(this.getBalance());
        if (timeEl) timeEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today';

        if (typeof modal.showModal === 'function') {
            modal.showModal();
        } else {
            modal.setAttribute('open', 'true');
        }
    },

    // 11. Reset data helper
    resetDemoData() {
        localStorage.setItem('rezanur_balance', '45000');
        localStorage.setItem('rezanur_transactions', JSON.stringify(DEFAULT_TRANSACTIONS));
        this.syncBalanceDisplay();
        this.renderAllTransactionViews();
        this.showToast('Demo data reset back to $45,000!', 'info');
    }
};

// Route any residual window.alert calls to in-page toast so Chrome alert is NEVER shown
window.alert = function (msg) {
    if (window.Wallet && typeof window.Wallet.showToast === 'function') {
        window.Wallet.showToast(msg, 'error');
    } else {
        console.error("Alert:", msg);
    }
};

// Auto-initialize when document is ready
let balanceRevealTimer = null;

function initWalletUI() {
    Wallet.syncBalanceDisplay();
    Wallet.renderAllTransactionViews();

    // Show Balance interactive tap button with 5-second auto-hide
    const showBalanceBtn = document.getElementById('btn-show-balance');
    const pillText = document.getElementById('balance-pill-text');
    const pillAmount = document.getElementById('balance-pill-amount');
    const pillIcon = document.getElementById('balance-pill-icon');

    if (showBalanceBtn && pillText && pillAmount) {
        showBalanceBtn.onclick = (e) => {
            e.preventDefault();

            // Reveal the balance amount immediately
            Wallet.syncBalanceDisplay();
            pillText.classList.add('hidden');
            pillAmount.classList.remove('hidden');

            showBalanceBtn.classList.remove('bg-slate-100', 'border-slate-200');
            showBalanceBtn.classList.add('bg-blue-50', 'border-blue-300', 'ring-2', 'ring-blue-100');

            if (pillIcon) {
                pillIcon.classList.remove('animate-pulse');
            }

            // Clear any previously running timer
            if (balanceRevealTimer) {
                clearTimeout(balanceRevealTimer);
            }

            // Revert back to "Show Balance" after exactly 5 seconds (5000 ms)
            balanceRevealTimer = setTimeout(() => {
                pillAmount.classList.add('hidden');
                pillText.classList.remove('hidden');

                showBalanceBtn.classList.remove('bg-blue-50', 'border-blue-300', 'ring-2', 'ring-blue-100');
                showBalanceBtn.classList.add('bg-slate-100', 'border-slate-200');

                if (pillIcon) {
                    pillIcon.classList.add('animate-pulse');
                }
                balanceRevealTimer = null;
            }, 5000);
        };
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWalletUI);
} else {
    initWalletUI();
}
