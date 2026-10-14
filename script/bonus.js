// Rezanur Pay — Get Bonus / Promo Coupon Module

const VALID_COUPONS = {
    'BONUS100': { amount: 100, name: 'Flash Loyalty Bonus' },
    'WELCOME50': { amount: 50, name: 'Welcome Community Bonus' },
    'SUPER200': { amount: 200, name: 'Super Payday Reward' },
    'REZANUR500': { amount: 500, name: 'Founder Exclusive Reward' }
};

document.addEventListener('DOMContentLoaded', () => {
    const bonusBtn = document.getElementById('btn-bonus');
    const couponInput = document.getElementById('bonus-coupon');

    if (!bonusBtn) return;

    bonusBtn.addEventListener('click', (event) => {
        event.preventDefault();

        const couponCode = (couponInput?.value || '').trim().toUpperCase();

        const notify = (msg, type = 'error') => {
            if (window.Wallet && typeof window.Wallet.showToast === 'function') {
                window.Wallet.showToast(msg, type);
            } else {
                console.warn(msg);
            }
        };

        if (!couponCode) {
            notify('Please enter a bonus coupon code.', 'error');
            couponInput?.focus();
            return;
        }

        // Check if coupon exists
        const promo = VALID_COUPONS[couponCode];
        if (!promo) {
            notify(`Invalid coupon "${couponCode}".`, 'error');
            return;
        }

        // Check if already claimed
        const claimedRaw = localStorage.getItem('rezanur_claimed_coupons');
        const claimedList = claimedRaw ? JSON.parse(claimedRaw) : [];

        if (claimedList.includes(couponCode)) {
            notify(`Coupon "${couponCode}" has already been claimed!`, 'error');
            return;
        }

        // Claim reward
        claimedList.push(couponCode);
        localStorage.setItem('rezanur_claimed_coupons', JSON.stringify(claimedList));

        let currentBalance = 45000;
        if (window.Wallet && typeof window.Wallet.getBalance === 'function') {
            currentBalance = window.Wallet.getBalance();
        } else {
            const rawText = document.getElementById('balance')?.innerText || '45000';
            currentBalance = parseFloat(rawText.replace(/,/g, '')) || 45000;
        }

        const newBalance = currentBalance + promo.amount;
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
                type: 'bonus',
                category: promo.name,
                target: `Promo: ${couponCode}`,
                amount: promo.amount,
                flow: 'in',
                icon: 'fa-gift',
                iconColor: 'text-purple-500',
                iconBg: 'bg-purple-50'
            });
            trxId = trx.id;
        }

        notify(`🎉 Congratulations! You received $${promo.amount} Bonus!`, 'success');

        if (window.Wallet && typeof window.Wallet.showReceipt === 'function') {
            window.Wallet.showReceipt({
                id: trxId,
                title: 'Bonus Claimed Successfully',
                service: `Promo Bonus (${couponCode})`,
                target: promo.name,
                amount: promo.amount,
                flow: 'in'
            });
        }

        // Reset input
        if (couponInput) couponInput.value = '';
    });
});
