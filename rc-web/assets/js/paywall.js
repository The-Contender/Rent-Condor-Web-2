// paywall.js

function showPaywall() {
    var paywallShown = localStorage.getItem('paywallShown') === 'true';
    var passwordEntered = localStorage.getItem('passwordEntered') === 'true';
    var lastEntryTimestamp = localStorage.getItem('lastEntryTimestamp');

    // Check if the paywall has been shown before and if the password has not been entered
    if (paywallShown && !passwordEntered) {
        // Paywall shown and password not entered before, show the overlay and set up event listeners
        setupPaywall();
        console.log(`Setup Paywall with no Timeout Triggered. 
        paywallShown val: ${paywallShown} 
        typeof paywallShown: ${typeof paywallShown} 
        passwordEntered val: ${passwordEntered} 
        typeof passwordEntered: ${typeof passwordEntered} 
        `);
    } else if (passwordEntered) {
        // Password has been entered
        if (lastEntryTimestamp) {
            const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000;
            const thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000;
            const testTime = 10 * 1000; // 10 seconds
            var currentTime = new Date().getTime();
            var lastEntryTime = parseInt(lastEntryTimestamp);

            console.log(`currentTime - lastEntryTime = ${currentTime - lastEntryTime}`);

            if (currentTime - lastEntryTime > sevenDaysInMillis) {
                // More than 7 days have passed, re-prompt the user
                setupPaywall();
            }
        }
    } else {
        // If paywall has not been shown before, give the user some time to browse
        setupPaywallWithTimeout();
        console.log(`Setup Paywall WITH Timeout Triggered. 
        paywallShown val: ${paywallShown} 
        typeof paywallShown: ${typeof paywallShown} 
        passwordEntered val: ${passwordEntered} 
        typeof passwordEntered: ${typeof passwordEntered} 
        `);
    }
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

// 15000 = 15s. Make this 60000 = 1 min
function setupPaywallWithTimeout() {
    setTimeout(function () {
        setupPaywall();
    }, 120000);
}

function checkPassword() {
    var password = document.getElementById('passwordInput').value;
    if (password === 'vulture') {
        document.getElementById('overlay').style.display = 'none';
        // Set a flag indicating that the password has been entered
        localStorage.setItem('passwordEntered', true);
        // Update the timestamp for the last entry
        localStorage.setItem('lastEntryTimestamp', new Date().getTime().toString());
        console.log(`lastEntryTimestamp Set`)
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
