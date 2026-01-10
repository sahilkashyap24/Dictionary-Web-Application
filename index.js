let generatedCount = 0;

const passwordInput = document.getElementById('passwordOutput');
const lengthSlider = document.getElementById('passwordLength');
const lengthValue = document.getElementById('lengthValue');
const uppercaseCheckbox = document.getElementById('uppercase');
const lowercaseCheckbox = document.getElementById('lowercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');
const strengthIndicator = document.getElementById('strengthIndicator');
const strengthLabel = document.getElementById('strengthLabel');
const generatedCountDisplay = document.getElementById('generatedCount');

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Update length display
lengthSlider.addEventListener('input', (e) => {
    lengthValue.textContent = e.target.value;
    if (passwordInput.value) {
        generatePassword();
    }
});

// Auto-regenerate on option change
uppercaseCheckbox.addEventListener('change', generatePassword);
lowercaseCheckbox.addEventListener('change', generatePassword);
numbersCheckbox.addEventListener('change', generatePassword);
symbolsCheckbox.addEventListener('change', generatePassword);

function generatePassword() {
    const length = parseInt(lengthSlider.value);
    let characters = '';

    if (uppercaseCheckbox.checked) characters += UPPERCASE;
    if (lowercaseCheckbox.checked) characters += LOWERCASE;
    if (numbersCheckbox.checked) characters += NUMBERS;
    if (symbolsCheckbox.checked) characters += SYMBOLS;

    // Ensure at least one character type is selected
    if (characters === '') {
        uppercaseCheckbox.checked = true;
        characters = UPPERCASE;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    passwordInput.value = password;
    updateStrengthMeter(password);
    generatedCount++;
    generatedCountDisplay.textContent = generatedCount;
}

function updateStrengthMeter(password) {
    const length = password.length;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);

    let strength = 0;
    const typeCount = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;

    if (length >= 8) strength += 25;
    if (length >= 16) strength += 25;
    if (length >= 24) strength += 25;
    if (typeCount >= 2) strength += 25;

    strengthIndicator.style.width = Math.min(strength, 100) + '%';

    let label = 'Weak';
    let color = '#e74c3c';

    if (strength >= 75) {
        label = 'Strong';
        color = '#27ae60';
    } else if (strength >= 50) {
        label = 'Good';
        color = '#f39c12';
    }

    strengthLabel.textContent = label;
    strengthLabel.style.color = color;
    strengthIndicator.style.background = `linear-gradient(90deg, ${color} 0%, ${color} 100%)`;
}

// Generate initial password on page load
window.addEventListener('load', generatePassword);

function copyToClipboard() {
    const text = passwordInput.value;
    if (text) {
        navigator.clipboard.writeText(text).then(() => {
            const copyBtn = document.querySelector('.copy-btn');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<span class="copy-icon">✓</span><span class="copy-text">Copied!</span>';
            copyBtn.style.background = '#27ae60';

            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.background = '';
            }, 2000);
        });
    }
}
