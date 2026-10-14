// Rezanur Pay — Transfer Money Module

document.addEventListener('DOMContentLoaded', () => {
    const transferBtn = document.getElementById('btn-transfer');
    const recipientInput = document.getElementById('transfer-account');
    const amountInput = document.getElementById('transfer-amount');
    const referenceInput = document.getElementById('transfer-reference');
    const pinInput = document.getElementById('transfer-pin');

    // Quick Transfer Chips
    const amountChips = document.querySelectorAll('.chip-transfer-amount');
    amountChips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            e.preventDefault();
            const val = chip.getAttribute('data-amount');
            if (amountInput && val) {
                amountInput.value = val;
            }
        });
    });

    if (!transferBtn) return;

    transferBtn.addEventListener('click', (event) => {
        event.preventDefault();

        const recipientNumber = recipientInput ? recipientInput.value.trim() : '';
        const transferAmount = parseFloat(amountInput ? amountInput.value : 0);
        const reference = referenceInput ? referenceInput.value.trim() : 'Personal Transfer';
        const pin = pinInput ? pinInput.value.trim() : '';

        const notify = (msg, type = 'error') => {
            if (window.Wallet && typeof window.Wallet.showToast === 'function') {
                window.Wallet.showToast(msg, type);
            } else {
                console.warn(msg);
            }
        };

        // Validation checks
        if (!recipientNumber || recipientNumber.length !== 11) {
            notify('Please enter an 11-digit recipient number.', 'error');
            recipientInput?.focus();
            return;
        }

        if (isNaN(transferAmount) || transferAmount <= 0) {
            notify('Please enter a valid amount to transfer.', 'error');
            amountInput?.focus();
            return;
        }

        let currentBalance = 45000;
        if (window.Wallet && typeof window.Wallet.getBalance === 'function') {
            currentBalance = window.Wallet.getBalance();
        } else {
            const rawText = document.getElementById('balance')?.innerText || '45000';
            currentBalance = parseFloat(rawText.replace(/,/g, '')) || 45000;
        }

        if (transferAmount > currentBalance) {
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

        // Execute Transfer
        const newBalance = currentBalance - transferAmount;
        localStorage.setItem('rezanur_balance', newBalance.toString());

        if (window.Wallet && typeof window.Wallet.setBalance === 'function') {
            window.Wallet.setBalance(newBalance);
        } else {
            const balEl = document.getElementById('balance');
            if (balEl) balEl.innerText = Number(newBalance).toLocaleString('en-US', { minimumFractionDigits: 2 });
        }

        let trxId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
        if (window.Wallet && typeof window.Wallet.recordTransaction === 'function') {
            const trx = window.Wallet.recordTransaction({
                type: 'transfer',
                category: 'Send Money',
                target: `To: ${recipientNumber} (${reference})`,
                amount: transferAmount,
                flow: 'out',
                icon: 'fa-paper-plane',
                iconColor: 'text-blue-500',
                iconBg: 'bg-blue-50'
            });
            trxId = trx.id;
        }

        notify(`Sent $${Number(transferAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })} to ${recipientNumber}!`, 'success');

        if (window.Wallet && typeof window.Wallet.showReceipt === 'function') {
            window.Wallet.showReceipt({
                id: trxId,
                title: 'Transfer Completed',
                service: 'Send Money (P2P Transfer)',
                target: `To: ${recipientNumber} • Ref: ${reference}`,
                amount: transferAmount,
                flow: 'out'
            });
        }

        // Reset inputs
        if (recipientInput) recipientInput.value = '';
        if (amountInput) amountInput.value = '';
        if (referenceInput) referenceInput.value = '';
        if (pinInput) pinInput.value = '';
    });
});
