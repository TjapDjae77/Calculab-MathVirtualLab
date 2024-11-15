function checkAuthForProtectedPages() {
    const token = localStorage.getItem('token');
    console.log('Token found in checkAuthForProtectedPages:', token);
    logToServer('info', `Token found in checkAuthForProtectedPages: ${token}`)
    if (!token) {
        console.log('No token, redirecting to login.html');
        logToServer('info', 'Redirecting to login.html');
        window.location.href = 'login.html';
    }
}

checkAuthForProtectedPages();

let selectedLevelUrl = '';

// Function to open the popup and set level URL
function openPopup(levelUrl) {
    selectedLevelUrl = levelUrl;
    document.getElementById('popupModal').classList.remove('hidden');
}

// Function to close the popup
function closePopup() {
    document.getElementById('popupModal').classList.add('hidden');
}

// Close popup if clicking outside of it
window.addEventListener('click', function (event) {
    const popupModal = document.getElementById('popupModal');
    if (event.target === popupModal) {
        closePopup();
    }
});

document.addEventListener('DOMContentLoaded', async function () {
    const token = await ensureValidAccessToken();

    if (!token) {
        window.location.href = 'login.html'; // Redirect jika tidak ada token
        return;
    }

    const playButton = document.getElementById('playButton');
    if (playButton) {
        playButton.addEventListener('click', function () {
            window.location.href = selectedLevelUrl;
        });
    } else {
        console.error("Element with id 'playButton' not found.");
    }

    const logoutButton = document.getElementById('logoutButton');

    if (logoutButton) {
        logoutButton.addEventListener('click', function (event) {
            event.preventDefault();
            
            // Hapus token dari localStorage
            localStorage.removeItem('token');

            // Redirect ke halaman landing page
            window.location.href = 'index.html';
        });
    }
});