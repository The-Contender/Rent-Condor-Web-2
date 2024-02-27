// paywall.js

function showPaywall() {
    setTimeout(function () {
        var passwordInput = document.getElementById('passwordInput');
        if (passwordInput) {
            passwordInput.addEventListener('keypress', handleKeyPress);
        } else {
            console.error("Element with id 'passwordInput' not found.");
        }
        document.getElementById('overlay').style.display = 'flex';
    }, 15000);
}

function checkPassword() {
    var password = document.getElementById('passwordInput').value;
    if (password === 'vulture') {
        document.getElementById('overlay').style.display = 'none';
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