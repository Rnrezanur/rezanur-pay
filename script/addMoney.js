// Rezanur Pay — Add Money Module

document.addEventListener('DOMContentLoaded', () => {
    const addMoneyBtn = document.getElementById('btn-add-money');
    const bankSelect = document.getElementById('bank-select');
    const accountInput = document.getElementById('account-number');
    const amountInput = document.getElementById('add-amount');
    const pinInput = document.getElementById('add-money-pin');

    // Quick Amount Chips
    const amountChips = document.querySelectorAll('.chip-add-amount');
    amountChips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            e.preventDefault();
            const val = chip.getAttribute('data-amount');
            if (amountInput && val) {
                amountInput.value = val;
            }
        });
    });

    if (!addMoneyBtn) return;

    addMoneyBtn.addEventListener('click', (event) => {
        event.preventDefault();

        const selectedBank = bankSelect ? bankSelect.value.trim() : '';
        const accountNumber = accountInput ? accountInput.value.trim() : '';
        const addAmount = parseFloat(amountInput ? amountInput.value : 0);
        const pin = pinInput ? pinInput.value.trim() : '';

        // Helper for in-page notification
        const notify = (msg, type = 'error') => {
            if (window.Wallet && typeof window.Wallet.showToast === 'function') {
                window.Wallet.showToast(msg, type);
            } else {
                console.warn(msg);
            }
        };

        // Validation checks
        if (!selectedBank || selectedBank === 'Select bank') {
            notify('Please select a bank or source.', 'error');
            bankSelect?.focus();
            return;
        }

        if (accountNumber.length < 11 || accountNumber.length > 16) {
            notify('Enter a valid 11 to 16 digit account number.', 'error');
            accountInput?.focus();
            return;
        }

        if (isNaN(addAmount) || addAmount <= 0) {
            notify('Please enter a valid amount to add.', 'error');
            amountInput?.focus();
            return;
        }

        if (addAmount > 250000) {
            notify('Daily limit exceeded. Max $250,000 per transaction.', 'error');
            return;
        }

        // Verify PIN (default demo PIN: 1212)
        if (pin !== '1212') {
            notify('Incorrect PIN! (Demo PIN is 1212)', 'error');
            pinInput?.focus();
            return;
        }

        // Safe balance calculation
        let currentBalance = 45000;
        if (window.Wallet && typeof window.Wallet.getBalance === 'function') {
            currentBalance = window.Wallet.getBalance();
        } else {
            const rawText = document.getElementById('balance')?.innerText || '45000';
            currentBalance = parseFloat(rawText.replace(/,/g, '')) || 45000;
        }

        const newBalance = currentBalance + addAmount;

        // Persist new balance
        localStorage.setItem('rezanur_balance', newBalance.toString());

        if (window.Wallet && typeof window.Wallet.setBalance === 'function') {
            window.Wallet.setBalance(newBalance);
        } else {
            const balEl = document.getElementById('balance');
            if (balEl) balEl.innerText = Number(newBalance).toLocaleString('en-US', { minimumFractionDigits: 2 });
        }

        // Record transaction
        let trxId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
        if (window.Wallet && typeof window.Wallet.recordTransaction === 'function') {
            const trx = window.Wallet.recordTransaction({
                type: 'add_money',
                category: `Deposit from ${selectedBank}`,
                target: `Acc •••• ${accountNumber.slice(-4)}`,
                amount: addAmount,
                flow: 'in',
                icon: 'fa-building-columns',
                iconColor: 'text-emerald-500',
                iconBg: 'bg-emerald-50'
            });
            trxId = trx.id;
        }

        // In-page success notification & digital receipt
        notify(`Successfully added $${Number(addAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })} via ${selectedBank}!`, 'success');

        if (window.Wallet && typeof window.Wallet.showReceipt === 'function') {
            window.Wallet.showReceipt({
                id: trxId,
                title: 'Money Added Successfully',
                service: `Add Money (${selectedBank})`,
                target: `Bank Acc •••• ${accountNumber.slice(-4)}`,
                amount: addAmount,
                flow: 'in'
            });
        }

        // Reset inputs
        if (bankSelect) bankSelect.selectedIndex = 0;
        if (accountInput) accountInput.value = '';
        if (amountInput) amountInput.value = '';
        if (pinInput) pinInput.value = '';
    });
});