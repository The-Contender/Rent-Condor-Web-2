// paywall.js

function showPaywall() {
    // Check if the paywall has been shown before
    if (localStorage.getItem('paywallShown')) {
        // If shown before, check if the password has been entered
        if (!localStorage.getItem('passwordEntered')) {
            // Password not entered before, show the overlay and set up event listeners
            setupPaywall();
            return; // Exit the function to avoid the timeout below
        }
    }

    // If paywall has not been shown before, or password entered, show it and set up event listeners
    setupPaywallWithTimeout();
}

function setupPaywall() {
    var passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', handleKeyPress);
    } else {
        console.error("Element with id 'passwordInput' not found.");
    }
    document.getElementById('overlay').style.display = 'flex';
    // Set a flag indicating that the paywall has been shown
    localStorage.setItem('paywallShown', true);
}

function setupPaywallWithTimeout() {
    setTimeout(function () {
        setupPaywall();
    }, 1000);
}

function checkPassword() {
    var password = document.getElementById('passwordInput').value;
    if (password === 'vulture') {
        document.getElementById('overlay').style.display = 'none';
        // Set a flag indicating that the password has been entered
        localStorage.setItem('passwordEntered', true);
    } else {
        alert('Incorrect password. Please try again.');
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        checkPassword();
    }
}

window.onload = showPaywall;
