// Rezanur Pay — Login Controller

document.addEventListener('DOMContentLoaded', () => {
    // Element references
    const loginForm = document.getElementById('login-form');
    const numberInput = document.getElementById('input-number');
    const pinInput = document.getElementById('input-pin');
    const togglePinBtn = document.getElementById('toggle-pin-btn');
    const togglePinIcon = document.getElementById('toggle-pin-icon');
    const demoAutofillBtn = document.getElementById('demo-autofill-btn');
    const forgotPinBtn = document.getElementById('forgot-pin-btn');
    const errorBox = document.getElementById('login-error');
    const errorMessage = document.getElementById('error-message');
    const loginBtn = document.getElementById('login-btn');
    const loginBtnText = document.getElementById('login-btn-text');
    const loginBtnIcon = document.getElementById('login-btn-icon');
    const loginSpinner = document.getElementById('login-spinner');

    // Restore remembered phone number if exists
    const rememberedNumber = localStorage.getItem('rezanur_remembered_number');
    if (rememberedNumber && numberInput) {
        numberInput.value = rememberedNumber;
    }

    // Helper: Show Error
    function showError(msg) {
        if (!errorBox || !errorMessage) return;
        errorMessage.textContent = msg;
        errorBox.classList.remove('hidden');
        
        // Add shake effect to login card
        const card = loginForm.closest('.card') || loginForm;
        card.classList.remove('shake-animation');
        void card.offsetWidth; // trigger reflow
        card.classList.add('shake-animation');
    }

    // Helper: Hide Error
    function hideError() {
        if (errorBox) {
            errorBox.classList.add('hidden');
        }
    }

    // 1. Toggle PIN visibility
    if (togglePinBtn && pinInput && togglePinIcon) {
        togglePinBtn.addEventListener('click', () => {
            const isPassword = pinInput.getAttribute('type') === 'password';
            pinInput.setAttribute('type', isPassword ? 'text' : 'password');
            togglePinIcon.className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
        });
    }

    // 2. Auto-fill Demo Credentials
    if (demoAutofillBtn && numberInput && pinInput) {
        demoAutofillBtn.addEventListener('click', () => {
            numberInput.value = '01869529572';
            pinInput.value = '1212';
            hideError();
            
            // Subtle pulse animation
            demoAutofillBtn.classList.add('bg-emerald-600');
            demoAutofillBtn.textContent = 'Filled!';
            setTimeout(() => {
                demoAutofillBtn.classList.remove('bg-emerald-600');
                demoAutofillBtn.textContent = 'Auto-Fill';
            }, 1000);
        });
    }

    // 3. Forgot PIN helper
    if (forgotPinBtn) {
        forgotPinBtn.addEventListener('click', () => {
            showError("Demo PIN reminder: The demo PIN is 1212.");
        });
    }

    // Restrict input fields to digits
    [numberInput, pinInput].forEach(input => {
        if (!input) return;
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
            hideError();
        });
    });

    // 4. Handle Login Submit
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            hideError();

            const phoneNumber = (numberInput?.value || '').trim();
            const pin = (pinInput?.value || '').trim();
            const rememberMe = document.getElementById('remember-me')?.checked;

            // Form validation
            if (!phoneNumber) {
                showError("Please enter your 11-digit mobile number.");
                numberInput?.focus();
                return;
            }

            if (phoneNumber.length !== 11) {
                showError("Mobile number must be exactly 11 digits (e.g. 01869529572).");
                numberInput?.focus();
                return;
            }

            if (!pin) {
                showError("Please enter your 4-digit PIN.");
                pinInput?.focus();
                return;
            }

            if (pin.length !== 4) {
                showError("PIN must be exactly 4 digits.");
                pinInput?.focus();
                return;
            }

            // Demo Credential Verification
            // Default demo account is 01869529572 with PIN 1212
            const isValidDemo = (phoneNumber === "01869529572" && pin === "1212");
            
            // Allow any 11-digit number with PIN 1212 in demo mode
            const isAlternateDemo = (pin === "1212");

            if (isValidDemo || isAlternateDemo) {
                // Save remember me
                if (rememberMe) {
                    localStorage.setItem('rezanur_remembered_number', phoneNumber);
                } else {
                    localStorage.removeItem('rezanur_remembered_number');
                }

                // Initialize session
                localStorage.setItem('rezanur_logged_in', 'true');
                localStorage.setItem('rezanur_user', JSON.stringify({
                    name: phoneNumber === "01869529572" ? "Rezanur Rahman" : "Valued Member",
                    phone: phoneNumber
                }));

                // Initialize starting balance if not present
                if (!localStorage.getItem('rezanur_balance')) {
                    localStorage.setItem('rezanur_balance', '45000');
                }

                // Show loading state
                if (loginBtn) loginBtn.disabled = true;
                if (loginBtnText) loginBtnText.textContent = "Authenticating...";
                if (loginBtnIcon) loginBtnIcon.classList.add('hidden');
                if (loginSpinner) loginSpinner.classList.remove('hidden');

                setTimeout(() => {
                    window.location.assign("home.html");
                }, 600);
            } else {
                showError("Login failed! Incorrect PIN or Number. Try PIN 1212.");
            }
        });
    }
});