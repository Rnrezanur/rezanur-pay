// Rezanur Pay — Cash Out Module

document.addEventListener('DOMContentLoaded', () => {
    const withdrawBtn = document.getElementById('btn-withdraw');
    const agentInput = document.getElementById('agent-number');
    const amountInput = document.getElementById('cashout-amount');
    const pinInput = document.getElementById('cashout-pin');

    // Quick Cashout Chips
    const amountChips = document.querySelectorAll('.chip-cashout-amount');
    amountChips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            e.preventDefault();
            const val = chip.getAttribute('data-amount');
            if (amountInput && val) {
                amountInput.value = val;
            }
        });
    });

    if (!withdrawBtn) return;

    withdrawBtn.addEventListener('click', (event) => {
        event.preventDefault();

        const agentNumber = agentInput ? agentInput.value.trim() : '';
        const withdrawAmount = parseFloat(amountInput ? amountInput.value : 0);
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
        if (!agentNumber || agentNumber.length !== 11) {
            notify('Please enter a valid 11-digit agent number.', 'error');
            agentInput?.focus();
            return;
        }

        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            notify('Please enter a valid amount to withdraw.', 'error');
            amountInput?.focus();
            return;
        }

        // Safe balance reading (prevent string comma parsing bug)
        let currentBalance = 45000;
        if (window.Wallet && typeof window.Wallet.getBalance === 'function') {
            currentBalance = window.Wallet.getBalance();
        } else {
            const rawText = document.getElementById('balance')?.innerText || '45000';
            currentBalance = parseFloat(rawText.replace(/,/g, '')) || 45000;
        }

        // Insufficient balance check
        if (withdrawAmount > currentBalance) {
            const formattedBal = window.Wallet ? window.Wallet.formatMoney(currentBalance) : currentBalance;
            notify(`Insufficient balance! Available: $${formattedBal}.`, 'error');
            amountInput?.focus();
            return;
        }

        // Verify PIN (default demo PIN: 1212)
        if (pin !== '1212') {
            notify('Incorrect PIN! (Demo PIN is 1212)', 'error');
            pinInput?.focus();
            return;
        }

        // Execute Cash Out
        const newBalance = currentBalance - withdrawAmount;
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
                type: 'cashout',
                category: 'Cash Out (Agent)',
                target: `Agent: ${agentNumber}`,
                amount: withdrawAmount,
                flow: 'out',
                icon: 'fa-money-bill-transfer',
                iconColor: 'text-rose-500',
                iconBg: 'bg-rose-50'
            });
            trxId = trx.id;
        }

        notify(`Successfully cashed out $${Number(withdrawAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}!`, 'success');

        if (window.Wallet && typeof window.Wallet.showReceipt === 'function') {
            window.Wallet.showReceipt({
                id: trxId,
                title: 'Cash Out Successful',
                service: 'Cash Out (Agent Withdrawal)',
                target: `Agent: ${agentNumber}`,
                amount: withdrawAmount,
                flow: 'out'
            });
        }

        // Reset inputs
        if (agentInput) agentInput.value = '';
        if (amountInput) amountInput.value = '';
        if (pinInput) pinInput.value = '';
    });
});