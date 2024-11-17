function checkAuthForProtectedPages() {
    const token = localStorage.getItem('token');
    console.log('Token found in checkAuthForProtectedPages:', token);
    logToServer('info', `Token found in checkAuthForProtectedPages: ${token}`);
    if (!token) {
        console.log('No token, redirecting to login.html');
        logToServer('info', 'Redirecting to login.html');
        window.location.href = 'login.html';
    }
}

checkAuthForProtectedPages();
refreshAccessToken();

// Fungsi untuk memastikan token akses masih valid
async function ensureValidAccessToken() {
    let token = localStorage.getItem('token');
    if (token && isTokenExpiringSoon(token)) {
        console.log('Access token is expiring soon, refreshing...');
        token = await refreshAccessToken();
    }
    return token;
}

// Fungsi untuk mengecek apakah token akan kedaluwarsa dalam waktu dekat
function isTokenExpiringSoon(token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Konversi ke milidetik
    const currentTime = Date.now();
    const bufferTime = 2 * 60 * 1000; // 2 menit sebelum kedaluwarsa
    return expirationTime - currentTime < bufferTime;
}

// Fungsi untuk mengambil data leaderboard
async function fetchLeaderboard() {
    const token = await ensureValidAccessToken();

    if (!token) {
        window.location.href = 'login.html'; // Redirect jika token tidak valid
        return;
    }

    fetch('https://calculab-backend.up.railway.app/api/leaderboard/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.status === 401) {
            // Jika token ditolak, coba refresh token
            return refreshAccessToken().then(newToken => {
                return fetch('https://calculab-backend.up.railway.app/api/leaderboard/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${newToken}`,
                        'Content-Type': 'application/json'
                    }
                });
            });
        }
        return response;
    })
    .then(response => response.json())
    .then(leaderboardData => {
        if (leaderboardData) {
            const nameElements = document.querySelectorAll('.name_placeholder');
            const scoreElements = document.querySelectorAll('.score_placeholder');
            // Loop untuk mengisi data leaderboard, maksimal 10 elemen
            leaderboardData.slice(0, 10).forEach((player, index) => {
                if (nameElements[index] && scoreElements[index]) {
                    nameElements[index].textContent = player.name || 'Anonymous';
                    scoreElements[index].textContent = player.score || 0;
                }
            });
        }
    })
    .catch(error => {
        console.error('Error loading leaderboard:', error);
    });
}

// Event listener untuk menghindari dropdown tetap terbuka jika diklik di luar area
document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('moreDropdown');
    const moreButton = document.getElementById('moreButton');
    if (!moreButton.contains(event.target)) {
        dropdown.classList.add('hidden');
    }
});

document.addEventListener('DOMContentLoaded', async function () {
    await ensureValidAccessToken(); // Pastikan token valid sebelum memuat data leaderboard
    fetchLeaderboard();

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
