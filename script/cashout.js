document.getElementById('btn-withdraw').addEventListener('click', function (event) {
    event.preventDefault();

    // 1. Get input values
    const agentNumber = document.getElementById('agent-number').value.trim();
    const withdrawAmount = parseFloat(document.getElementById('cashout-amount').value);
    const pin = document.getElementById('cashout-pin').value.trim();

    // 2. Get current balance element & amount
    const balanceElement = document.getElementById('balance');
    const currentBalance = parseFloat(balanceElement.innerText);

    // 3. Validation checks
    if (agentNumber.length !== 11) {
        alert("Please enter a valid 11-digit agent number.");
        return;
    }

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        alert("Please enter a valid amount to withdraw.");
        return;
    }

    if (withdrawAmount > currentBalance) {
        alert("Insufficient balance to complete this cashout!");
        return;
    }

    // 4. Verify PIN (using 1212 as default demo pin)
    if (pin === "1212") {
        const newBalance = currentBalance - withdrawAmount;
        balanceElement.innerText = newBalance;

        alert(`Successfully cashed out $${withdrawAmount}!`);

        // Reset form inputs
        document.getElementById('agent-number').value = '';
        document.getElementById('cashout-amount').value = '';
        document.getElementById('cashout-pin').value = '';
    } else {
        alert("Incorrect PIN! Please try again.");
    }
});