function checkAuthForProtectedPages() {
    const token = localStorage.getItem('token');
    console.log('Masuk ke profil')
    console.log('Token found in checkAuthForProtectedPages:', token);
    logToServer('info', `Token found in checkAuthForProtectedPages: ${token}`)
    if (!token) {
        console.log('No token, redirecting to login.html');
        logToServer('info', 'Redirecting to login.html');
        window.location.href = 'login.html';
    }
}

checkAuthForProtectedPages();
refreshAccessToken();

// Fungsi untuk mengecek masa aktif token
function isTokenExpiringSoon(token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Konversi ke milidetik
    const currentTime = Date.now();
    const bufferTime = 2 * 60 * 1000; // 2 menit sebelum kadaluwarsa
    return expirationTime - currentTime < bufferTime;
}

// Fungsi mengambil profil
async function fetchProfile() {
    const token = await ensureValidAccessToken();

    if (!token) {
        window.location.href = 'login.html'; // Redirect jika token tidak valid
        return;
    }

    fetch('https://103.82.93.43/api/accounts/profile/', {
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
                return fetch('https://103.82.93.43/api/accounts/profile/', {
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
    .then(data => {
        if (data) {
            // Update elemen HTML dengan data profil
            document.getElementById('username').textContent = data.username;
            document.getElementById('email').textContent = data.email;
            document.getElementById('score').textContent = data.score;
            
            const completedLevelsCount = data.completed_levels ? data.completed_levels.length : 0;
            document.getElementById('level-completed').textContent = completedLevelsCount;
        }
    })
    .catch(error => {
        console.error('Error fetching profile:', error);
    });
}

// Sembunyiin dropdown kalo ngeklik di luar
document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('moreDropdown');
    const moreButton = document.getElementById('moreButton');
    if (!moreButton.contains(event.target)) {
        dropdown.classList.add('hidden');
    }
});

document.addEventListener('DOMContentLoaded', async function () {

    await ensureValidAccessToken(); // Pastikan token valid sebelum memuat data profil
    fetchProfile();

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