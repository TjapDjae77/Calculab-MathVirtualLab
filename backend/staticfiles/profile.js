checkAuthForProtectedPages();

// Fungsi `refreshAccessToken` untuk mengambil token baru
// async function refreshAccessToken() {
//     const refreshToken = localStorage.getItem('refresh_token');
//     if (!refreshToken) {
//         console.error('No refresh token found');
//         window.location.href = 'login.html';
//         return null;
//     }

//     try {
//         const response = await fetch('http://localhost:5000/api/token/refresh/', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ refresh: refreshToken })
//         });
//         if (!response.ok) {
//             throw new Error('Failed to refresh token');
//         }
//         const data = await response.json();
//         localStorage.setItem('token', data.access);
//         return data.access;
//     } catch (error) {
//         console.error('Error refreshing access token:', error);
//         window.location.href = 'login.html';
//     }
// }
refreshAccessToken();

// Memastikan token access masih valid
// async function ensureValidAccessToken() {
//     let token = localStorage.getItem('token');
//     if (token && isTokenExpiringSoon(token)) {
//         console.log('Access token is expiring soon, refreshing...');
//         token = await refreshAccessToken();
//     }
//     return token;
// }

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

    fetch('http://localhost:5000/api/accounts/profile/', {
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
                return fetch('http://localhost:5000/api/accounts/profile/', {
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
            document.getElementById('level-completed').textContent = data.level_completed;
        }
    })
    .catch(error => {
        console.error('Error fetching profile:', error);
    });
}

// Hide dropdown when clicking outside
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