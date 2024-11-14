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

// Redirect to level on clicking Play
document.getElementById('playButton').addEventListener('click', function () {
    window.location.href = selectedLevelUrl;
});

// Close popup if clicking outside of it
window.addEventListener('click', function (event) {
    const popupModal = document.getElementById('popupModal');
    if (event.target === popupModal) {
        closePopup();
    }
});

document.addEventListener('DOMContentLoaded', function () {

    const logoutButton = document.getElementById('logoutButton');

    if (logoutButton) {
        logoutButton.addEventListener('click', function (event) {
            event.preventDefault();
            
            // Hapus token dari localStorage
            localStorage.removeItem('token');

            // Redirect ke halaman landing page
            window.location.href = 'landing_page.html';
        });
    }
});