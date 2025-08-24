document.addEventListener('DOMContentLoaded', () => {
    // Get all necessary DOM elements
    const passwordDisplay = document.getElementById('passwordDisplay');
    const passwordLength = document.getElementById('passwordLength');
    const lengthValue = document.getElementById('lengthValue');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    const generateButton = document.getElementById('generateButton');
    const copyButton = document.getElementById('copyButton');
    const messageBox = document.getElementById('messageBox');
    // New elements for the password strength meter
    const strengthBar = document.getElementById('strengthBar');
    const strengthLabel = document.getElementById('strengthLabel');

    // Define character sets
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    // Function to generate a random password
    function generatePassword() {
        let password = '';
        let characterSet = '';
        
        // Build the character set based on selected options
        if (uppercaseCheckbox.checked) characterSet += uppercaseChars;
        if (lowercaseCheckbox.checked) characterSet += lowercaseChars;
        if (numbersCheckbox.checked) characterSet += numberChars;
        if (symbolsCheckbox.checked) characterSet += symbolChars;

        // If no character type is selected, show an error and exit
        if (characterSet.length === 0) {
            showMessage('Please select at least one character type.');
            passwordDisplay.value = '';
            // Reset strength meter if no characters are selected
            strengthBar.style.width = '0%';
            strengthLabel.textContent = '';
            return;
        }

        // Get the desired password length from the slider
        const length = passwordLength.value;

        // Ensure the password contains at least one character from each selected set
        let ensuredPassword = '';
        if (uppercaseCheckbox.checked) ensuredPassword += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
        if (lowercaseCheckbox.checked) ensuredPassword += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
        if (numbersCheckbox.checked) ensuredPassword += numberChars[Math.floor(Math.random() * numberChars.length)];
        if (symbolsCheckbox.checked) ensuredPassword += symbolChars[Math.floor(Math.random() * symbolChars.length)];

        // Fill the rest of the password length
        for (let i = ensuredPassword.length; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characterSet.length);
            ensuredPassword += characterSet[randomIndex];
        }

        // Shuffle the final password to make it more random
        password = ensuredPassword.split('').sort(() => Math.random() - 0.5).join('');
        passwordDisplay.value = password;

        // Check the strength of the new password
        checkPasswordStrength(password);
    }

    // Function to calculate password strength and update the meter
    function checkPasswordStrength(password) {
        let score = 0;
        const length = password.length;

        // Score based on length
        if (length > 8) score += 20;
        if (length > 12) score += 20;
        if (length > 16) score += 20;

        // Score based on character types
        if (/[A-Z]/.test(password)) score += 10;
        if (/[a-z]/.test(password)) score += 10;
        if (/[0-9]/.test(password)) score += 10;
        if (/[!@#$%^&*()_+~`|}{[\]:;?><,./-=]/.test(password)) score += 10;
        
        // Set the width of the strength bar based on the score
        strengthBar.style.width = `${score}%`;

        // Update the strength label and color
        if (score < 40) {
            strengthBar.className = 'h-2.5 rounded-full strength-weak transition-all duration-300 ease-in-out';
            strengthLabel.textContent = 'Weak';
        } else if (score < 70) {
            strengthBar.className = 'h-2.5 rounded-full strength-medium transition-all duration-300 ease-in-out';
            strengthLabel.textContent = 'Medium';
        } else {
            strengthBar.className = 'h-2.5 rounded-full strength-strong transition-all duration-300 ease-in-out';
            strengthLabel.textContent = 'Strong';
        }
    }

    // Function to show a temporary message box
    function showMessage(message) {
        messageBox.textContent = message;
        messageBox.classList.add('show');
        setTimeout(() => {
            messageBox.classList.remove('show');
        }, 2000);
    }

    // Event listener for the length slider
    passwordLength.addEventListener('input', () => {
        lengthValue.textContent = passwordLength.value;
    });

    // Event listener for the generate button
    generateButton.addEventListener('click', generatePassword);
    
    // Event listener for the password display input (for manual input)
    passwordDisplay.addEventListener('input', (e) => {
        checkPasswordStrength(e.target.value);
    });

    // Event listener for the copy button
    copyButton.addEventListener('click', () => {
        // Select the text in the password input field
        passwordDisplay.select();
        passwordDisplay.setSelectionRange(0, 99999); // For mobile devices

        // Use the deprecated but reliable document.execCommand for copying
        try {
            document.execCommand('copy');
            showMessage('Password copied!');
        } catch (err) {
            showMessage('Failed to copy password.');
        }
    });

    // Generate an initial password and check its strength on load
    generatePassword();
});
