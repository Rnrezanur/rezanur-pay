document.getElementById('btn-add-money').addEventListener('click', function (event) {
    event.preventDefault();

    // 1. Get input values
    const selectedBank = document.getElementById('bank-select').value;
    const accountNumber = document.getElementById('account-number').value.trim();
    const addAmount = parseFloat(document.getElementById('add-amount').value);
    const pin = document.getElementById('add-money-pin').value.trim();

    // 2. Get balance element
    const balanceElement = document.getElementById('balance');
    const currentBalance = parseFloat(balanceElement.innerText);

    // 3. Validation checks
    if (!selectedBank) {
        alert("Please select a bank.");
        return;
    }

    if (accountNumber.length !== 11) {
        alert("Please enter a valid 11-digit account number.");
        return;
    }

    if (isNaN(addAmount) || addAmount <= 0) {
        alert("Please enter a valid amount to add.");
        return;
    }

    // 4. Verify PIN (using 1212 as default demo pin)
    if (pin === "1212") {
        const newBalance = currentBalance + addAmount;
        balanceElement.innerText = newBalance;

        alert(`Successfully added $${addAmount} to your account!`);

        // Reset form inputs
        document.getElementById('bank-select').selectedIndex = 0;
        document.getElementById('account-number').value = '';
        document.getElementById('add-amount').value = '';
        document.getElementById('add-money-pin').value = '';
    } else {
        alert("Incorrect PIN! Please try again.");
    }
});