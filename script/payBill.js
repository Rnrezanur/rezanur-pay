// Rezanur Pay — Pay Utility Bill Module

document.addEventListener('DOMContentLoaded', () => {
    const payBillBtn = document.getElementById('btn-pay-bill');
    const billTypeSelect = document.getElementById('bill-type');
    const billAccountInput = document.getElementById('bill-account');
    const billAmountInput = document.getElementById('bill-amount');
    const pinInput = document.getElementById('bill-pin');

    if (!payBillBtn) return;

    payBillBtn.addEventListener('click', (event) => {
        event.preventDefault();

        const billType = billTypeSelect ? billTypeSelect.value.trim() : '';
        const billAccount = billAccountInput ? billAccountInput.value.trim() : '';
        const billAmount = parseFloat(billAmountInput ? billAmountInput.value : 0);
        const pin = pinInput ? pinInput.value.trim() : '';

        const notify = (msg, type = 'error') => {
            if (window.Wallet && typeof window.Wallet.showToast === 'function') {
                window.Wallet.showToast(msg, type);
            } else {
                console.warn(msg);
            }
        };

        // Validation checks
        if (!billType || billType === 'Select biller') {
            notify('Please select a utility service or biller.', 'error');
            billTypeSelect?.focus();
            return;
        }

        if (!billAccount || billAccount.length < 6) {
            notify('Please enter a valid biller / meter account number.', 'error');
            billAccountInput?.focus();
            return;
        }

        if (isNaN(billAmount) || billAmount <= 0) {
            notify('Please enter a valid bill payment amount.', 'error');
            billAmountInput?.focus();
            return;
        }

        let currentBalance = 45000;
        if (window.Wallet && typeof window.Wallet.getBalance === 'function') {
            currentBalance = window.Wallet.getBalance();
        } else {
            const rawText = document.getElementById('balance')?.innerText || '45000';
            currentBalance = parseFloat(rawText.replace(/,/g, '')) || 45000;
        }

        if (billAmount > currentBalance) {
            const formattedBal = window.Wallet ? window.Wallet.formatMoney(currentBalance) : currentBalance;
            notify(`Insufficient balance! Available: $${formattedBal}.`, 'error');
            billAmountInput?.focus();
            return;
        }

        // Verify PIN (default demo PIN: 1212)
        if (pin !== '1212') {
            notify('Incorrect PIN! (Demo PIN is 1212)', 'error');
            pinInput?.focus();
            return;
        }

        // Determine icon based on bill type
        let icon = 'fa-receipt';
        let iconColor = 'text-indigo-500';
        let iconBg = 'bg-indigo-50';

        if (billType.toLowerCase().includes('electricity') || billType.toLowerCase().includes('desco')) {
            icon = 'fa-bolt';
            iconColor = 'text-amber-500';
            iconBg = 'bg-amber-50';
        } else if (billType.toLowerCase().includes('gas') || billType.toLowerCase().includes('titas')) {
            icon = 'fa-fire-flame-simple';
            iconColor = 'text-orange-500';
            iconBg = 'bg-orange-50';
        } else if (billType.toLowerCase().includes('water') || billType.toLowerCase().includes('wasa')) {
            icon = 'fa-droplet';
            iconColor = 'text-sky-500';
            iconBg = 'bg-sky-50';
        } else if (billType.toLowerCase().includes('internet')) {
            icon = 'fa-wifi';
            iconColor = 'text-blue-500';
            iconBg = 'bg-blue-50';
        }

        // Execute Bill Payment
        const newBalance = currentBalance - billAmount;
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
                type: 'bill',
                category: billType,
                target: `Biller ID: ${billAccount}`,
                amount: billAmount,
                flow: 'out',
                icon: icon,
                iconColor: iconColor,
                iconBg: iconBg
            });
            trxId = trx.id;
        }

        notify(`Paid $${Number(billAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })} for ${billType}!`, 'success');

        if (window.Wallet && typeof window.Wallet.showReceipt === 'function') {
            window.Wallet.showReceipt({
                id: trxId,
                title: 'Bill Payment Successful',
                service: billType,
                target: `Biller ID: ${billAccount}`,
                amount: billAmount,
                flow: 'out'
            });
        }

        // Reset inputs
        if (billTypeSelect) billTypeSelect.selectedIndex = 0;
        if (billAccountInput) billAccountInput.value = '';
        if (billAmountInput) billAmountInput.value = '';
        if (pinInput) pinInput.value = '';
    });
});
